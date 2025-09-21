import React from 'react';
import DataManager from '../common/DataManager';
import { userConfig } from './configs';
import { usersLoader } from './loaders';

const UserAdmin = () => {
    return <DataManager config={userConfig} />;
};

export default UserAdmin;
export { usersLoader };
