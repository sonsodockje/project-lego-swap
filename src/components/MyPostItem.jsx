import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { deleteProductById } from '../api/firebaseStore';

export default function MyPostItem({ post, currentUser }) {
    const queryClient = useQueryClient();

    const handleDeletePost = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            return;
        }

        const previousMyPosts = queryClient.getQueryData([
            'myPosts',
            currentUser.uid,
        ]);

        // Optimistic update: 캐시에서 해당 아이템 제거
        queryClient.setQueryData(['myPosts', currentUser.uid], (old) =>
            old.filter((p) => p.id !== post.id),
        );

        try {
            await deleteProductById(post.id);
        } catch (error) {
            // Rollback on error
            queryClient.setQueryData(
                ['myPosts', currentUser.uid],
                previousMyPosts,
            );
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <Link
            to={`/detail/${post.id}`}
            key={post.id}
            className='block p-4 border rounded-lg shadow-sm hover:bg-gray-50'>
            <h3 className='text-md font-semibold'>{post.title}</h3>
            <p className='text-gray-600 text-sm'>
                {new Date(post.timestamp.seconds * 1000).toLocaleDateString()}
            </p>
            {post.imgs && post.imgs.length > 0 && (
                <img
                    src={post.imgs[0].resized}
                    alt={post.title}
                    className='w-24 h-24 object-cover rounded-md mt-2'
                />
            )}
            <button
                className='p-2 btn btn-primary  mt-2 btn-xs text-xs'
                onClick={handleDeletePost}>
                삭제
            </button>
        </Link>
    );
}
