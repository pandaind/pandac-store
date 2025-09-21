import React from 'react';
import DataManager from '../common/DataManager';
import { discountConfig } from './configs';
import { discountsLoader } from './loaders';

const DiscountAdmin = () => {
    return <DataManager config={discountConfig} />;
};

export default DiscountAdmin;
export { discountsLoader };
