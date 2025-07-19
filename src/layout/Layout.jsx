import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className='min-w-[300px] max-w-screen-sm mx-auto  h-full py-5 sm:py-1 shadow-sm hide-scrollbar'>
            <Header />
            <div className='p-4'>
                <Outlet />
            </div>
        </div>
    );
}
