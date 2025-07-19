import PageHeading from "./PageHeading.jsx";
import ProductListing from "./ProductListing.jsx";
import products from "../data/Products.js";

export default function Home() {
    return (
        <div className="max-w-[1152px] mx-auto px-6 py-8">
            <PageHeading title={"Explore Our Products"}>
                Unique local products for sale in our store. Up to <b>50% off</b>. Use Code while payment : <b>PANDAC50</b>.
            </PageHeading>
            <ProductListing products={products}/>
        </div>
    );
}