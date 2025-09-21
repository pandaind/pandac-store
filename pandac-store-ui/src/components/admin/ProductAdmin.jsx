import React from 'react';
import DataManager from '../common/DataManager';
import { productConfig } from './configs';
import { productsLoader } from './loaders';

const ProductAdmin = () => {
    return <DataManager config={productConfig} />;
};

export default ProductAdmin;
export { productsLoader };