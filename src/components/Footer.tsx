import { ArrowUpRightIcon, ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a href="#top" className="footer-name">
          Sohan Dhungel<span>.</span>
        </a>
        <a href="#top" className="button-secondary">
          Back to top <ArrowUpIcon size={17} aria-hidden />
        </a>
      </div>
      <div className="footer-bottom">
        <p>Software, with a human touch.</p>
        <div>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRightIcon size={13} aria-hidden />
          </a>
          <a href={site.cv} target="_blank" rel="noopener noreferrer">
            View CV <ArrowUpRightIcon size={13} aria-hidden />
          </a>
          <span>Built in Kathmandu</span>
        </div>
      </div>
    </footer>
  );
}
