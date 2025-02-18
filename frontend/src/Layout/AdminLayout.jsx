import React from 'react';

const AdminLayout = ({children}) => {
    return (
        <>
            <div>
            <main>{children}</main>
            </div>
        </>
    );
};

export default AdminLayout;
