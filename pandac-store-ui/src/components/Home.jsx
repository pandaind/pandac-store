import PageHeading from "./PageHeading.jsx";
import ProductListing from "./ProductListing.jsx";
import {useEffect, useState} from "react";
import apiClient from "../api/apiClient.js";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/products");
            setProducts(response.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch products, try again!")
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-xl font-semibold">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-xl text-red-500">Error: {error}</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1152px] mx-auto px-6 py-8">
            <PageHeading title={"Explore Our Products"}>
                Unique local products for sale in our store. Up to <b>50% off</b>. Use Code while payment
                : <b>PANDAC50</b>.
            </PageHeading>
            <ProductListing products={products}/>
        </div>
    );
}