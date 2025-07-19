import React from 'react';

export default function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='w-full join p-6 flex justify-center'>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`join-item btn ${number === currentPage ? 'btn-active' : ''}`}>
                    {number}
                </button>
            ))}
        </div>
    );
}
