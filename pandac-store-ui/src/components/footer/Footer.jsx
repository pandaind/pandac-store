import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import './Footer.css';

export default function Footer() {
  return (
      <footer className="footer">
        Built with <FontAwesomeIcon icon={faHeart} className="footer-icon" aria-hidden="true"/>
          by
          <a href="https://pandac.in" target="_blank" rel="noopener noreferrer">PandaC</a>
      </footer>
  );
}