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
    const truncateTitle = (title) => {
        if (title.length > 14) {
            return title.substring(0, 14) + '...';
        }
        return title;
    };
    return (
        <div className='flex flex-col bg-base-100 shadow-sm'>
            <div className='h-[150px]'>
                <img
                    src={item.imgs[0].resized}
                    loading='lazy'
                    className='min-w-full h-full object-cover object-center rounded-t-lg' /* ⭐️ `min-h` 제거, `w-full h-full` 적용 */
                />
            </div>

            <div className='flex flex-col max-h-44 p-4 gap-1'>
                <h2 className='font-semibold text-md'>
                    {truncateTitle(item.title)}
                </h2>
                <div className='flex gap-2 text-xs font-semibold text-white mb-4'>
                    <div className='py-1 px-2 rounded-full bg-red-400'>
                        {item.sell}
                    </div>
                    <div className='py-1 px-2 rounded-full bg-blue-400'>
                        {item.want}
                    </div>
                </div>
                <div className='flex justify-between'>
                    <p className='text-lg font-bold'>${item.price}</p>
                    <p>
                        {item.opened === 0 ? (
                            <span className='text-red-500 font-semibold text-sm'>
                                개봉
                            </span>
                        ) : (
                            <span className='text-green-500 font-semibold text-sm'>
                                미개봉
                            </span>
                        )}
                    </p>
                </div>

                <div className='flex justify-end'>
                    <button className='btn btn-primary btn-sm'>찜</button>
                </div>
            </div>
        </div>
    );
};

const MemoizedItem = memo(Item);
