import React, { memo, useCallback } from 'react';
import { userLike } from '../api/firebaseStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/firebaseAuth';
import { readUserLike } from '../api/firebaseStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// --- SVG Icons ---
const HeartIcon = ({ className, ...props }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        className={className}
        viewBox='0 0 24 24'
        fill='currentColor'
        {...props}>
        <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
    </svg>
);

const CommentIcon = ({ className, ...props }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
        {...props}>
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        />
    </svg>
);

const truncateTitle = (title) => {
    if (title.length > 20) {
        return title.substring(0, 20) + '...';
    }
    return title;
};

const Item = ({ item }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: likedProducts, isLoading } = useQuery({
        queryKey: ['likedProducts', currentUser?.uid],
        queryFn: () => readUserLike(currentUser.uid),
        enabled: !!currentUser?.uid,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    const isItemLiked =
        !isLoading &&
        likedProducts &&
        likedProducts.some((product) => product.id === item.id);

    const handleLikeBtn = useCallback(async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        const previousLikedProducts = queryClient.getQueryData([
            'likedProducts',
            currentUser.uid,
        ]);

        if (isItemLiked) {
            queryClient.setQueryData(
                ['likedProducts', currentUser.uid],
                (old) => old.filter((product) => product.id !== item.id),
            );
        } else {
            queryClient.setQueryData(
                ['likedProducts', currentUser.uid],
                (old) => [...(old || []), { id: item.id, likedAt: new Date() }],
            );
        }

        try {
            await userLike(item.id, currentUser.uid);
        } catch (error) {
            queryClient.setQueryData(
                ['likedProducts', currentUser.uid],
                previousLikedProducts,
            );
            console.error('찜하기/취소 실패:', error);
            alert('찜하기/취소 중 오류가 발생했습니다.');
        }
    }, [item.id, currentUser, isItemLiked, queryClient]);

    const handleItemClick = () => {
        navigate(`/detail/${item.id}`);
    };

    return (
        <div
            onClick={handleItemClick}
            className='bg-base-100 rounded-lg shadow-md overflow-hidden hover:bg-base-200 duration-500 cursor-pointer flex flex-row'>
            {/* Image Section */}
            <div className='relative w-32 sm:w-36 flex-shrink-0'>
                <div className='aspect-square w-full h-full'>
                    <img
                        src={item.imgs[0].resized}
                        loading='lazy'
                        className='w-full h-full object-cover'
                        alt={item.title}
                    />
                </div>
                <div className='absolute bottom-1 left-1 flex items-center gap-1 bg-black bg-opacity-50 rounded-full p-1 pr-2'>
                    <img
                        src={item.userPhoto}
                        className='rounded-full w-5 h-5'
                        alt={`${item.user} profile`}
                    />
                    <p className='text-white text-xs font-semibold'>
                        {item.user}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className='p-3 flex flex-col flex-grow'>
                <div className='flex flex-wrap gap-1 mb-2'>
                    <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            item.opened === 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                        {item.opened === 0 ? '개봉' : '미개봉'}
                    </span>
                    <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {item.sell}
                    </span>

                    <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
                        {item.want}
                    </span>
                </div>

                <h2
                    className='text-base font-bold text-gray-800 leading-tight'
                    title={item.title}>
                    {truncateTitle(item.title)}
                </h2>

                <p className='mt-1 text-lg font-bold text-gray-900'>
                    {item.price.toLocaleString()} 원
                </p>

                {/* Spacer to push stats to the bottom */}
                <div className='flex-grow' />

                {/* Stats and Like Button */}
                <div className='mt-2 flex justify-between items-center'>
                    <div className='flex items-center gap-3 text-gray-500'>
                        {/* <span className='flex items-center gap-1'>
                            <HeartIcon className='w-4 h-4' />
                            <span className='text-xs'>
                                {item.likeCount || 0}
                            </span>
                        </span>
                        <span className='flex items-center gap-1'>
                            <CommentIcon className='w-4 h-4' />
                            <span className='text-xs'>
                                {item.commentCount || 0}
                            </span>
                        </span> */}
                    </div>

                    {currentUser && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleLikeBtn();
                            }}
                            className={`p-2 rounded-full transition-colors duration-200 hover:cursor-pointer ${
                                isItemLiked
                                    ? 'text-red-500 bg-red-100'
                                    : 'text-gray-400 hover:bg-base-200'
                            }`}
                            aria-label='찜하기'>
                            <HeartIcon className='w-5 h-5' />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MemoizedItem = memo(Item);
