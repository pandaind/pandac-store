import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Home, {productsLoader} from "./components/Home.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Cart from "./components/Cart.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import {contactAction} from "./actions/contactAction.js";
import {ToastContainer, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from "./components/ProductDetails.jsx";


const routeDefinitions = createRoutesFromElements(
    <Route path="/" element={<App/>} errorElement={<ErrorPage/>}>
        <Route index element={<Home/>} loader={productsLoader}/>
        <Route path="/home" element={<Home/>} loader={productsLoader}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>} action={contactAction}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/products/:productId" element={<ProductDetail />} />
    </Route>
);

const appRouter = createBrowserRouter(routeDefinitions);


/*const appRouter =  createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/cart",
                element: <Cart />
            }
        ]
    }
])*/

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={appRouter}/>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable
            pauseOnHover
            theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
            transition={Bounce}
        />
    </StrictMode>,
)
