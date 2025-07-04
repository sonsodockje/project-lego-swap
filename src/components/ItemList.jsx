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
        return (
        <>
        <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-error animate-ping"></div>
            <div className="status status-error"></div>
</div> loding
</>)
    }

    if (isError) {
        return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const allProducts = data?.pages.flatMap((page) => page.products) || [];

    return (
        <div className='flex flex-col items-center justify-center'>
            {allProducts.length > 0 && (
                <>
                    <div className='grid grid-cols-1 gap-4 w-full'>
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
        <div className='flex flex-row  rounded-lg shadow-sm'>
            <div className="relative">
                <img
                src={item.imgs[0].resized}
                loading='lazy'
                className=' object-cover max-h-[150px] md:min-w-[200px] min-w-[100px]  rounded-tl-lg rounded-bl-lg'
                    />
            <div className="absolute bottom-0 flex items-center gap-2 bg-black opacity-70 rounded-md m-2 p-1">
                <img src={item.userPhoto} className='rounded-full w-4 h-4' alt="" />
                <p className='text-white text-xs'>{item.user}</p>
            </div>
            
            </div>
            

            <div className='flex flex-col w-full px-4 py-2 gap-1 items-start'>
                <h2 className='font-semibold text-[1.1rem]'>
                    {truncateTitle(item.title)}
                </h2>
                <div className='flex gap-2 text-[.6rem] font-semibold text-white mb-4 justify-center items-center'>
                    <div className='py-[4px] px-[6px] rounded-full bg-red-400'>
                        {item.sell}
                    </div>
                    <p className='text-gray-500'>을</p>
                    <div className='py-1 px-2 rounded-full bg-blue-400'>
                        {item.want}
                    </div>
                    <p className='text-gray-500'>로 교환합니다.</p>
                </div>
                <div className='flex flex-row justify-between items-center w-full'>
                    <div className=''>
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
                    <div className='flex gap-2 h-full items-end '>
                        <div className='btn btn-sm'
                        onClick={(e)=>{
                             e.preventDefault()
                
                    console.log("ee")}}
                        >dm</div>
                        <div className='btn btn-sm bg-emerald-100' onClick={(e)=>{
                             e.preventDefault()
                
                    console.log("ee")}}>찜</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MemoizedItem = memo(Item);
