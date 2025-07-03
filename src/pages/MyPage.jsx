import React from 'react';
import Layout from '../layout/Layout';
import { useAuth } from '../api/firebaseAuth';

export default function MyPage() {
    const { currentUser, isLogin, handleLogout } = useAuth();

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
            <button className='btn btn-primary'>
                탈퇴(글은 자동으로 지워지지 않습니다.)
            </button>
            <button className='btn btn-primary' onClick={handleLogout}>
                로그아웃
            </button>
        </>
    );
}
