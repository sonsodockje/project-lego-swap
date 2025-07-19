import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { userLike } from '../api/firebaseStore';

export default function MyLikedItem({ product, currentUser }) {
    const queryClient = useQueryClient();

    const handleUnlike = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!window.confirm('정말로 이 찜을 취소하시겠습니까?')) {
            return;
        }

        const previousLikedProducts = queryClient.getQueryData([
            'likedProducts',
            currentUser.uid,
        ]);

        // Optimistic update: 캐시에서 해당 아이템 제거
        queryClient.setQueryData(['likedProducts', currentUser.uid], (old) =>
            old.filter((p) => p.id !== product.id),
        );

        try {
            await userLike(product.id, currentUser.uid);
        } catch (error) {
            // Rollback on error
            queryClient.setQueryData(
                ['likedProducts', currentUser.uid],
                previousLikedProducts,
            );
            console.error('찜 취소 실패:', error);
            alert('찜 취소 중 오류가 발생했습니다.');
        }
    };

    return (
        <Link
            to={`/detail/${product.id}`}
            key={product.id}
            className='block p-4 border rounded-lg shadow-sm hover:bg-gray-50'>
            <h3 className='text-md font-semibold'>{product.title}</h3>
            <p className='text-gray-600 text-sm'>
                찜한 시간:{' '}
                {new Date(product.likedAt.seconds * 1000).toLocaleString()}
            </p>
            {product.imgs && product.imgs.length > 0 && (
                <img
                    src={product.imgs[0].resized}
                    alt={product.title}
                    className='w-24 h-24 object-cover rounded-md mt-2'
                />
            )}
            <button     className='p-2 btn btn-primary  mt-2 btn-xs text-xs' onClick={handleUnlike}>
                삭제
            </button>
        </Link>
    );
}
