import React from 'react';
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

const UserLayout = ({children}) => {
    return (
        <>
            <Header/>
                <div>
                <main>{children}</main>
                </div>
            <Footer/>
            </>
    );
};

export default UserLayout;
