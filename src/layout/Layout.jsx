import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className='max-w-[600px] min-h-svh m-auto shadow-sm  hide-scrollbar'>
            <Header />
            <div className='container mx-auto p-4'>
                <Outlet />
            </div>
        </div>
    );
}
