import React from 'react';
import { useAuth } from '../api/firebaseAuth';
import { useParams } from 'react-router-dom';
import WriteForm from '../components/WriteForm';
import { useQuery } from '@tanstack/react-query';
import { productFetchById } from '../api/firebaseStore';

export default function WritePage() {
    const { isLogin, currentUser } = useAuth();
    const { id } = useParams();
    const {
        data: post,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productFetchById(id),
        enabled: !!id, // id가 있을 때만 쿼리 실행
    });

    if (!isLogin) {
        // 로그인하지 않은 경우에 대한 처리 (예: 로그인 페이지로 리디렉션)
        return <p>글을 작성하려면 로그인이 필요합니다.</p>;
    }

    if (id) {
        if (isLoading) {
            return <div className='loading loading-spinner loading-lg'></div>;
        }

        if (isError) {
            return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
        }

        if (post && post.uid !== currentUser.uid) {
            // 권한 없는 사용자에 대한 처리 (예: 메인 페이지로 리디렉션)
            return <p>이 게시물을 수정할 권한이 없습니다.</p>;
        }
    }

    return (
        <>
            {id && <p>현재 수정 글 ID: {id} // 이 글을 쓴 사람 정보 </p>}{' '}
            {/* id 값을 표시할 때 좀 더 명확하게 */}
            <WriteForm
                currentUser={currentUser}
                id={id}
                initialData={id ? post : null}
            />
        </>
    );
}
