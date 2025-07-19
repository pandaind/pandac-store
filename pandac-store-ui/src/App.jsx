import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import React from "react";
import Home from "./components/Home.jsx";

function App() {
    return (
        <React.Fragment>
            <Header></Header>
            <Home></Home>
            <Footer></Footer>
        </React.Fragment>
    );
}

export default App
