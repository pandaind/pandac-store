import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart, faSnowman, faSun, faMoon} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";

const Header = () => {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    const navLinkClass =
        "text-center text-lg font-primary font-semibold text-primary py-2 dark:text-light hover:text-dark dark:hover:text-lighter";
    return (
        <header className="border-b border-gray-300 dark:border-gray-600 sticky top-0 z-20 bg-normal-bg dark:bg-dark-bg">
            <div className="flex items-center justify-between mx-auto max-w-[1152px] px-6 py-4">
                <NavLink href="/" className={navLinkClass}>
                    <FontAwesomeIcon icon={faSnowman} className="h-8 w-8"/>
                    <span className="font-bold">PandaC Store</span>
                </NavLink>
                <nav className="flex items-center py-2 z-10">
                    <button
                        className="flex items-center justify-center mx-3 w-8 h-8 rounded-full border border-primary dark:border-light transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        aria-label="Toggle theme"
                        onClick={toggleTheme}
                    >
                        <FontAwesomeIcon
                            icon={theme === "dark" ? faMoon : faSun}
                            className="w-4 h-4 dark:text-light text-primary"
                        />
                    </button>
                    <ul className={"flex space-x-6"}>
                        <li>
                            <NavLink to="/home" className={({isActive})=> isActive ?
                                         `underline ${navLinkClass}` : navLinkClass}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={({isActive})=> isActive ?
                                `underline ${navLinkClass}` : navLinkClass}>
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className={({isActive})=> isActive ?
                                `underline ${navLinkClass}` : navLinkClass}>
                                Contact
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/login" className={({isActive})=> isActive ?
                                `underline ${navLinkClass}` : navLinkClass}>
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/signup" className={({isActive})=> isActive ?
                                `underline ${navLinkClass}` : navLinkClass}>
                                Sign Up
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/cart" className={navLinkClass}>
                                <FontAwesomeIcon icon={faShoppingCart} className="dark:text-light" />
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;