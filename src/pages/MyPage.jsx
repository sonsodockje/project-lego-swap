import React from 'react';
import Layout from '../layout/Layout';
import { useAuth } from '../api/firebaseAuth';
import { readUserLike } from '../api/firebaseStore';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function MyPage() {
    const { currentUser, isLogin, handleLogout } = useAuth();

    const {
        data: likedProducts, // data 이름을 likedProducts로 변경하여 명확하게 사용
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['userLike', currentUser?.uid], // 사용자 ID도 queryKey에 포함하여 사용자가 바뀌면 새로 불러오도록
        queryFn: () => readUserLike(currentUser.uid),
        enabled: !!currentUser?.uid, // currentUser.uid가 있을 때만 쿼리 실행
    });

    if (isLoading) {
        return <div>찜 목록을 불러오는 중입니다...</div>;
    }

    if (isError) {
        return (
            <div>찜 목록을 불러오는데 오류가 발생했습니다: {error.message}</div>
        );
    }

    if (!likedProducts || likedProducts.length === 0) {
        return <div>아직 찜한 상품이 없습니다.</div>;
    }

    if (!isLogin) {
        return <Layout>로그인 ㄱ</Layout>;
    }

    return (
        <>
            <div className=''>
                {currentUser.displayName}
                {currentUser.email}
                <img src={currentUser.photoURL} alt='' />
                {currentUser.uid}
            </div>
            <div className=''>내가 쓴글</div>
            <div className=''>나의 대화 목록</div>
            <div className=''>나의 짐</div>
            <ul>
                {likedProducts.map((product) => (
                    <Link
                        to={`/detail/${product.productId}`}
                        key={product.productId}>
                        <div className='m-4 bg-blue-200'>
                            상품 ID: {product.productId} (찜한 시간:{' '}
                            {new Date(
                                product.likedAt.seconds * 1000,
                            ).toLocaleString()}
                            )
                        </div>
                    </Link>
                ))}
            </ul>
            <button className='btn btn-primary'>
                탈퇴(글은 자동으로 지워지지 않습니다.)
            </button>
            <button className='btn btn-primary' onClick={handleLogout}>
                로그아웃
            </button>
        </>
    );
}
