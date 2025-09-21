import PageHeading from "./PageHeading.jsx";
import ProductListings from "../product/ProductListings.jsx";
import { useLoaderData } from "react-router-dom";

export default function Home() {
  const products = useLoaderData();
  return (
    <div className="max-w-[1152px] mx-auto px-6 py-8">
      <PageHeading title={"Click It Before Someone Else Picks It"}>
        Unique local products for sale in our store. Up to <b className={"text-green-700 dark:text-lighter"}>50% off</b>.
        Use Code while payment
        : <b className={"text-green-700 dark:text-lighter"}>PANDAC50</b>
      </PageHeading>
      <ProductListings products={products} />
    </div>
  );
}
