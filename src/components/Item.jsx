import React, { memo, useCallback } from 'react';
import { userLike } from '../api/firebaseStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/firebaseAuth';
import { handleOpenChatRoom } from '../api/firebaseRealtime';
import { readUserLike } from '../api/firebaseStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const truncateTitle = (title) => {
    if (title.length > 14) {
        return title.substring(0, 14) + '...';
    }
    return title;
};

const Item = ({ item }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // 나의 찜 데이터 가져오기
    // useQuery의 data는 초기값으로 undefined를 가집니다.
    // 데이터 로딩 중이거나 쿼리가 실행되지 않았을 때 likedProducts는 undefined입니다.
    const { data: likedProducts, isLoading } = useQuery({
        // isLoading, isError 추가
        queryKey: ['likedProducts', currentUser?.uid],
        queryFn: () => readUserLike(currentUser.uid),
        enabled: !!currentUser?.uid,
        staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터를 신선하다고 간주
        cacheTime: 1000 * 60 * 10, // 10분 동안 캐시 데이터 유지
    });

    // 현재 아이템이 사용자의 찜 목록에 포함되어 있는지 확인하는 헬퍼 변수
    const isItemLiked =
        !isLoading &&
        likedProducts &&
        likedProducts.some((product) => product.id === item.id);

    // useCallback을 사용하여 handleDmBtn 함수 메모이제이션
    const handleDmBtn = useCallback(
        (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('로그인이 필요합니다.');
                return;
            }
            handleOpenChatRoom(currentUser.uid, item.uid, item, navigate);
        },
        [currentUser, item, navigate],
    );

    // useCallback을 사용하여 찜하기 버튼의 onClick 핸들러 메모이제이션
    const queryClient = useQueryClient();

    // useCallback을 사용하여 찜하기 버튼의 onClick 핸들러 메모이제이션
    const handleLikeBtn = useCallback(
        async (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('로그인이 필요합니다.');
                return;
            }

            const previousLikedProducts = queryClient.getQueryData([
                'likedProducts',
                currentUser.uid,
            ]);

            // Optimistic update
            if (isItemLiked) {
                // 찜 취소: 캐시에서 해당 아이템 제거
                queryClient.setQueryData(
                    ['likedProducts', currentUser.uid],
                    (old) => old.filter((product) => product.id !== item.id),
                );
            } else {
                // 찜하기: 캐시에 해당 아이템 추가 (임시 likedAt 값 사용)
                queryClient.setQueryData(
                    ['likedProducts', currentUser.uid],
                    (old) => [
                        ...(old || []),
                        { id: item.id, likedAt: new Date() },
                    ],
                );
            }

            try {
                await userLike(item.id, currentUser.uid);
            } catch (error) {
                // Rollback on error
                queryClient.setQueryData(
                    ['likedProducts', currentUser.uid],
                    previousLikedProducts,
                );
                console.error('찜하기/취소 실패:', error);
                alert('찜하기/취소 중 오류가 발생했습니다.');
            }
        },
        [item.id, currentUser, isItemLiked, queryClient],
    );

    return (
        <div className='flex flex-row max-h-[150px] rounded-lg shadow-sm'>
            <div className='relative'>
                <div className='h-full w-[150px] md:w-[200px] lg:w-[250px] overflow-hidden'>
                    <img
                        src={item.imgs[0].resized}
                        loading='lazy'
                        className='object-cover rounded-tl-lg rounded-bl-lg w-full h-full'
                        alt={item.title} // 이미지 alt 속성 추가
                    />
                </div>

                <div className='absolute bottom-0 flex items-center gap-2 bg-black opacity-70 rounded-md m-2 p-1'>
                    <img
                        src={item.userPhoto}
                        className='rounded-full w-4 h-4'
                        alt={`${item.user} profile`} // 이미지 alt 속성 추가
                    />
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
                    {currentUser && (
                        <div className='flex gap-2 h-full items-end '>
                            <div className='btn btn-sm' onClick={handleDmBtn}>
                                DM
                            </div>

                            {/* isItemLiked 변수를 사용하여 조건부 렌더링 */}
                            <div
                                className={`btn btn-sm ${isItemLiked ? 'bg-red-100' : 'bg-emerald-100'}`}
                                onClick={handleLikeBtn}>
                                찜
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MemoizedItem = memo(Item);
