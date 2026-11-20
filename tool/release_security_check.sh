#!/usr/bin/env bash
# Production release security gate for the portfolio (Next.js, static, deployed
# to Vercel Production on push to main). Blocks a release unless every required
# check passes. Policy: ~/.claude/skills/release-security-audit/SKILL.md
#
#   bash tool/release_security_check.sh                   full gate (before pushing to main)
#   bash tool/release_security_check.sh --artifact .next  scan a built output dir for secrets
#
# Exit 0 = PASS, 1 = BLOCKED. A check that cannot run counts as a failure.
# Accepted risks: security/accepted-risks.txt, one "<path> | reason | approved-by | date"
# per line, added only by the owner. Matching findings are reported, not failed.
set -u
ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)" || exit 1
cd "$ROOT" || exit 1

VERSION="$(node -p 'require("./package.json").version' 2>/dev/null)"
[ -n "$VERSION" ] || { echo "cannot read package.json version"; exit 1; }
HEAD="$(git rev-parse HEAD)"
REPORT_DIR="security/reports"
mkdir -p "$REPORT_DIR"
LOG="$REPORT_DIR/${VERSION}.automated.md"
[ "${1:-}" = "--artifact" ] && LOG="$REPORT_DIR/${VERSION}.artifact.md"
ACCEPTED="security/accepted-risks.txt"
FAILS=0

{
  echo "# Automated release gate: $VERSION"
  echo
  echo "- Commit: $HEAD"
  echo "- Run: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
} > "$LOG"

pass() { echo "PASS  $1" | tee -a "$LOG"; }
fail() { echo "FAIL  $1" | tee -a "$LOG"; FAILS=$((FAILS + 1)); }
note() { echo "NOTE  $1" | tee -a "$LOG"; }

accepted() { # $1 = path
  [ -f "$ACCEPTED" ] && grep -v '^\s*#' "$ACCEPTED" | cut -d'|' -f1 | sed 's/ *$//' | grep -qxF "$1"
}

# Credential shapes. The Formspree form id and the Google site-verification
# token are public by design and deliberately not here.
SECRET_RE='-----BEGIN ([A-Z]+ )?PRIVATE KEY-----|"private_key": *"|AKIA[0-9A-Z]{16}|(sk|rk)_live_[0-9A-Za-z]{16,}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,}|xox[abprs]-[0-9A-Za-z-]{10,}|vercel_[A-Za-z0-9]{24,}|AIza[0-9A-Za-z_-]{35}|(api[_-]?key|secret|password|token)["'"'"' ]*[:=] *["'"'"'][A-Za-z0-9_\-]{16,}'
SECRET_FILES_RE='(\.pem|\.p12|\.key|service[-_]?account[^/]*\.json|(^|/)\.env(\.[a-z]+)?|(^|/)\.vercel/)$'

# --------------------------------------------------------------- artifact mode
if [ "${1:-}" = "--artifact" ]; then
  ART="${2:-.next}"
  [ -d "$ART" ] || { echo "artifact dir not found: $ART"; exit 1; }
  hits="$(grep -r -I -E -c -e "$SECRET_RE" "$ART/static" "$ART/server" 2>/dev/null | awk -F: '{s+=$NF} END {print s+0}')"
  if [ "$hits" = "0" ]; then pass "build output $ART has no credential-shaped strings"
  else fail "build output $ART has $hits credential-shaped strings"; fi
  maps="$(find "$ART/static" -name '*.map' 2>/dev/null | wc -l | tr -d ' ')"
  [ "$maps" = "0" ] && pass "no public source maps in $ART/static" || fail "$maps source maps shipped publicly"
  [ "$FAILS" = 0 ] && exit 0 || exit 1
fi

echo "== Audit 1: secrets"
if command -v gitleaks >/dev/null; then
  if gitleaks detect --source . --log-opts="--all" --redact --no-banner >/dev/null 2>&1; then
    pass "gitleaks: working tree and full history"
  else fail "gitleaks found leaks (run: gitleaks detect --source . --log-opts=--all --redact -v)"; fi
else
  note "gitleaks not installed (brew install gitleaks); using the built-in scan"
fi
tree_hits="$(git grep -I -l -E -e "$SECRET_RE" -- . ':!tool/release_security_check.sh' ':!package-lock.json' 2>/dev/null)"
for f in $tree_hits; do
  if accepted "$f"; then note "accepted risk: credential-shaped content in $f"
  else fail "credential-shaped content in tracked file $f"; fi
done
[ -z "$tree_hits" ] && pass "no credential-shaped content in tracked files"
file_hits="$(git ls-files | grep -E "$SECRET_FILES_RE" | grep -v -E '\.example$')"
for f in $file_hits; do
  if accepted "$f"; then note "accepted risk: secret file tracked: $f"
  else fail "secret file tracked in git: $f"; fi
done
[ -z "$file_hits" ] && pass "no .env, keys, service accounts or .vercel tracked"
EXCL=(':!tool/release_security_check.sh' ':!package-lock.json')
if [ -f "$ACCEPTED" ]; then
  while IFS= read -r a; do [ -n "$a" ] && EXCL+=(":!$a"); done \
    < <(grep -v '^\s*#' "$ACCEPTED" | cut -d'|' -f1 | sed 's/ *$//')
fi
hist_hits="$(git log --all -p --no-color -- . "${EXCL[@]}" 2>/dev/null \
  | grep -E '^\+' | grep -E -c -e "$SECRET_RE")"
if [ "$hist_hits" = "0" ]; then pass "no credential-shaped lines in git history (accepted files excluded)"
else fail "git history has $hist_hits credential-shaped added lines"; fi

echo "== Audit 3: production readiness"
grep -q 'productionBrowserSourceMaps *: *true' next.config.* 2>/dev/null \
  && fail "public source maps enabled in next.config" || pass "no public browser source maps"
dbg="$(git grep -n -E 'console\.(log|debug)\(|debugger;' -- src 2>/dev/null)"
[ -z "$dbg" ] && pass "no console.log/debugger in src" || fail "debug output left in src: $(echo "$dbg" | head -3)"
lh="$(git grep -n -E 'https?://(localhost|127\.0\.0\.1)' -- src 2>/dev/null)"
[ -z "$lh" ] && pass "no localhost endpoints in src" || fail "localhost endpoint in src: $(echo "$lh" | head -3)"
ext="$(git grep -n -E 'target="_blank"' -- src | grep -v 'noopener' | grep -v -E 'rel=' )"
[ -z "$ext" ] && pass "every target=_blank link carries rel" || note "target=_blank without rel on same line (check manually): $(echo "$ext" | head -2)"

if npx --no-install tsc --noEmit >/dev/null 2>&1; then pass "tsc --noEmit"; else fail "tsc --noEmit"; fi
if npx --no-install eslint src >/dev/null 2>&1; then pass "eslint"; else fail "eslint"; fi
if npx --no-install next build >/dev/null 2>&1; then pass "next build (production)"; else fail "next build"; fi
note "no automated test suite in this repo: behaviour verified by headless-browser run (see report)"
if npm audit --omit=dev --audit-level=high >/dev/null 2>&1; then
  pass "npm audit: no high/critical in production deps"
else fail "npm audit: high/critical in production deps, or audit could not run"; fi

echo "== Audits 2, 4, 5: reviewed release report"
R="$REPORT_DIR/${VERSION}.md"
if [ ! -f "$R" ]; then
  fail "no reviewed report $R (run the release-security-audit skill)"
elif ! grep -q '^- Release verdict: PASS' "$R"; then
  fail "$R verdict is not PASS"
else
  AUDITED="$(sed -n 's/^- Audited commit: *//p' "$R" | head -1)"
  if [ -z "$AUDITED" ] || ! git cat-file -e "$AUDITED^{commit}" 2>/dev/null; then
    fail "$R has no valid 'Audited commit'"
  elif [ -n "$(git diff --name-only "$AUDITED" HEAD -- . ':!security' ':!tool/release_security_check.sh')" ]; then
    fail "code changed since the audited commit $AUDITED: re-audit"
  else pass "reviewed report $R is PASS for this code"; fi
fi
if [ -n "$(git status --porcelain --untracked-files=no -- . ':!security')" ]; then
  fail "uncommitted changes: commit before a release"
else pass "working tree clean"; fi

echo | tee -a "$LOG"
if [ "$FAILS" = 0 ]; then
  echo "- Gate verdict: PASS" | tee -a "$LOG"; exit 0
else
  echo "- Gate verdict: BLOCKED ($FAILS failed)" | tee -a "$LOG"; exit 1
fi
