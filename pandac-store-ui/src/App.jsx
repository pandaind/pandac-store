import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import React from "react";
import {Outlet, useNavigation} from "react-router-dom";

function App() {
    const navigation = useNavigation();
    return (
        <React.Fragment>
            <Header/>
            {navigation.state === "loading" ? (
                <div className={"flex items-center justify-center w-full min-h-[852px] bg-white dark:bg-gray-800"}>
                    <span className={"text-4xl font-semibold text-primary dark:text-light"}>Loading...</span>
                </div>
                )
                : (<Outlet/>)
            }
            <Footer/>
        </React.Fragment>
    );
}

export default App
