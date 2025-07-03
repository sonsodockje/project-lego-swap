import { useInfiniteQuery } from '@tanstack/react-query';
import { productsFetch } from '../api/firebaseStore';
import { Link } from 'react-router-dom';
import React, { memo } from 'react';

export default function ItemList() {
    const itemsPerPage = 4; // 한 페이지당 보여줄 아이템 수

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam }) => productsFetch(pageParam, itemsPerPage),
        getNextPageParam: (lastPage) => lastPage.lastVisible,
        initialPageParam: null,
    });

    if (isLoading) {
        return <div className='loading loading-spinner loading-lg'></div>;
    }

    if (isError) {
        return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const allProducts = data?.pages.flatMap((page) => page.products) || [];

    return (
        <div className='flex flex-col items-center justify-center'>
            {allProducts.length > 0 && (
                <>
                    <div className='grid grid-cols-2 gap-4 w-full'>
                        {allProducts.map((item) => (
                            <Link to={`/detail/${item.id}`} key={item.id}>
                                <MemoizedItem item={item} />
                            </Link>
                        ))}
                    </div>
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className='btn btn-primary mt-4'>
                            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                        </button>
                    )}
                </>
            )}
            {allProducts.length === 0 && !isLoading && !isError && (
                <div>상품이 없습니다.</div>
            )}
        </div>
    );
}
const Item = ({ item }) => {
    return (
        <div className='flex flex-col bg-base-100 shadow-sm'>
            <div className='h-3/12'>
                <img
                    src={item.imgs[0].resized}
                    loading='lazy'
                    className='min-w-full h-[200px] object-cover object-center rounded-t-lg' /* ⭐️ `min-h` 제거, `w-full h-full` 적용 */
                />
            </div>

            <div className='flex flex-col p-2'>
                <h2 className='text-xl'>{item.title}</h2>
                <div className='flex'>
                    <p>{item.sell}</p>
                    <p>{item.want}</p>
                </div>
                <p className='text-lg font-bold'>${item.price}</p>
                <p>
                    {item.opened === 0 ? (
                        <span className='text-red-500'>개봉</span>
                    ) : (
                        <span className='text-green-500'>미개봉</span>
                    )}
                </p>
                <div className='flex justify-end'>
                    <button className='btn btn-primary btn-sm'>찜</button>
                </div>
            </div>
        </div>
    );
};

const MemoizedItem = memo(Item);
