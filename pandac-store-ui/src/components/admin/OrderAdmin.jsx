import React from 'react';
import DataManager from '../common/DataManager';
import { orderConfig } from './configs';
import { ordersLoader } from './loaders';

const OrderAdmin = () => {
    return <DataManager config={orderConfig} />;
};

export default OrderAdmin;
export { ordersLoader };
