import React from 'react';
import UserInfoCard from './UserInfoCard';
import AuthButton from './AuthButton';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className='navbar bg-base-100 border-b-2 border-b-gray-50 '>
            <div className='navbar-start'>
                <Link to='/' className='btn btn-ghost text-sm'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24px'
                        viewBox='0 -960 960 960'
                        width='24px'
                        fill='#1f1f1f'>
                        <path d='M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z' />
                    </svg>
                </Link>
            </div>

            <div className='navbar-center'>
                <NavLink
                    to='/dm'
                    className={({ isActive }) =>
                        isActive
                            ? 'text-pink-600 btn btn-ghost'
                            : 'text-black btn btn-ghost'
                    }>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24px'
                        viewBox='0 -960 960 960'
                        width='24px'
                        fill='currentColor'>
                        <path d='M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z' />
                    </svg>
                </NavLink>
            </div>

            <div className='navbar-end flex gap-2'>
                <UserInfoCard />
                <AuthButton />
            </div>
        </div>
    );
}
