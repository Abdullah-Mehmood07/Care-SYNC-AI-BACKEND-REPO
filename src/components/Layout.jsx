import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingAI from './FloatingAI';

const Layout = () => {
    return (
        <>
            <Header />
            <main id="main-content">
                <Outlet />
            </main>
            <FloatingAI />
            <Footer />
        </>
    );
};

export default Layout;
