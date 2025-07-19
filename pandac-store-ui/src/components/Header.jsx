import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart, faSnowman} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <a href="/" className="link">
                    <FontAwesomeIcon icon={faSnowman} className="fa-icon"/>
                    <span className="brand-title">PandaC Store</span>
                </a>
                <nav className="nav">
                    <ul>
                        <li>
                            <a href="/" className="link">Home</a>
                        </li>
                        <li>
                            <a href="/about" className="link">About</a>
                        </li>
                        <li>
                            <a href="/contact" className="link">Contact</a>
                        </li>
                        <li>
                            <a href="/login" className="link">Login</a>
                        </li>
                        <li>
                            <a href="/signup" className="link">Sign Up</a>
                        </li>
                        <li>
                            <a href="/cart" className="link">
                                <FontAwesomeIcon icon={faShoppingCart}/>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;