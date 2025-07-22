import PageHeading from "./PageHeading.jsx";
import ProductListing from "./ProductListing.jsx";
import apiClient from "../api/apiClient.js";
import {useLoaderData} from "react-router-dom";

export default function Home() {
    const products = useLoaderData();
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

export async function productsLoader() {
    try {
        const response = await apiClient.get("/products");
        return response.data;
    } catch (error) {
        throw new Response(error.message || "Failed to fetch products. Please try again.",
            {status: error.status || 500});
    }
}