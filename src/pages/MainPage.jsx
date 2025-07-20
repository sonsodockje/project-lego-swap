import React, { useState } from 'react';
import ItemList from '../components/ItemList';
import ItemFilterHeader from '../components/ItemFilterHeader';
import Pagination from '../components/Pagination';
import { useQuery } from '@tanstack/react-query';
import { productsFetch } from '../api/firebaseStore';

export default function MainPage() {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: productsFetch,
    });

    const handleFilter = (e) => {
        setFilter(e.target.innerText);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return (
            <div className='flex m-auto gap-4 f-ull items-center align-middle text-center'>
                <div className='inline-grid *:[grid-area:1/1]'>
                    <div className='status status-error animate-ping'></div>
                    <div className='status status-error'></div>
                </div>
                <div>로딩중</div>
            </div>
        );
    }

    if (isError) {
        return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const allProducts = data?.products || [];
    const filteredProducts =
        filter && filter !== 'all'
            ? allProducts.filter((item) => item.want === filter)
            : allProducts;

    // 클라이언트 측 페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const totalItems = filteredProducts.length; // 필터링된 상품의 총 개수

    return (
        <>
            <ItemFilterHeader handleFilter={handleFilter} />
            <ItemList products={currentItems} />
            <div className='sticky bottom-0 left-1/2 '>
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}
