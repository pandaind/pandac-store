import ProductCard from "./ProductCard.jsx";
import Dropdown from "./Dropdown.jsx";
import SearchBox from "./SearchBox.jsx";
import {useMemo, useState} from "react";

const ProductListing = ({products}) => {
    const [searchText, setSearchText] = useState("");
    const [selectedSort, setSelectedSort] = useState("Default");
    const sortList = ["Default", "Price: Low to High", "Price: High to Low", "Popularity"];

    const filteredAndSortedProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

        let filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase())
                    || product.description.toLowerCase().includes(searchText.toLowerCase()));

        return filteredProducts.slice().sort((a, b) =>{
            switch (selectedSort) {
                case "Price: Low to High":
                    return parseFloat(a.price) - parseFloat(b.price);
                case "Price: High to Low":
                    return parseFloat(b.price) - parseFloat(a.price);
                case "Popularity":
                    return parseInt(b.popularity) - parseInt(a.popularity);
                default:
                    return parseFloat(b.price) - parseFloat(a.price);
            }
        })

    }, [products, searchText, selectedSort])

    const handleSearchChange = (value) => {
        setSearchText(value);
    }

    const handleSortChange = (value) => {
        setSelectedSort(value);
    }


    return (<div className={"max-w-[1152px] mx-auto"}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12">
            <SearchBox
                label="Search"
                placeholder="Search products..."
                value={searchText}
                handleSearch={(value) => handleSearchChange(value)}
            />
            <Dropdown
                label="Sort by"
                options={sortList}
                value={selectedSort}
                handleSort={(value) => handleSortChange(value)}
            />
        </div>
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 py-12"}>
            {
                filteredAndSortedProducts.length > 0 ?
                    filteredAndSortedProducts.map((product) => (<ProductCard key={product.productId} product={product}/>)) :
                (<p className={"text-center font-primary font-bold text-lg text-primary"}>No products found.</p>)
            }
        </div>
    </div>);
}


export default ProductListing;