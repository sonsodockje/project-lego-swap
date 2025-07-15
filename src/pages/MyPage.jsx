import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { useAuth } from '../api/firebaseAuth';
import { readUserLike, fetchUserPosts } from '../api/firebaseStore';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function MyPage() {
    const { currentUser, isLogin, handleLogout } = useAuth();
    const [activeTab, setActiveTab] = useState('myPosts'); // 'myPosts' 또는 'myLikes'

    // 내가 쓴 글 데이터 가져오기
    const { data: myPosts, isLoading: myPostsLoading, isError: myPostsError } = useQuery({
        queryKey: ['myPosts', currentUser?.uid],
        queryFn: () => fetchUserPosts(currentUser.uid),
        enabled: !!currentUser?.uid && activeTab === 'myPosts',
    });

    // 나의 찜 데이터 가져오기
    const { data: likedProducts, isLoading: likedProductsLoading, isError: likedProductsError } = useQuery({
        queryKey: ['likedProducts', currentUser?.uid],
        queryFn: () => readUserLike(currentUser.uid),
        enabled: !!currentUser?.uid && activeTab === 'myLikes',
    });

    if (!isLogin) {
        return <Layout>로그인이 필요합니다.</Layout>;
    }

    if (myPostsLoading || likedProductsLoading) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    if (myPostsError || likedProductsError) {
        return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                {currentUser.photoURL && (
                    <img src={currentUser.photoURL} alt="프로필" className="w-20 h-20 rounded-full mr-4 object-cover" />
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{currentUser.displayName}</h1>
                    <p className="text-gray-600">{currentUser.email}</p>
                </div>
            </div>

            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab tab-lg ${activeTab === 'myPosts' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('myPosts')}
                >
                    내가 쓴 글
                </a>
                <a
                    className={`tab tab-lg ${activeTab === 'myLikes' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('myLikes')}
                >
                    나의 찜
                </a>
            </div>

            {activeTab === 'myPosts' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">내가 쓴 글</h2>
                    {myPosts && myPosts.length > 0 ? (
                        myPosts.map((post) => (
                            <Link to={`/detail/${post.id}`} key={post.id} className="block p-4 border rounded-lg shadow-sm hover:bg-gray-50">
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <p className="text-gray-600 text-sm">{new Date(post.timestamp.seconds * 1000).toLocaleDateString()}</p>
                                {post.imgs && post.imgs.length > 0 && (
                                    <img src={post.imgs[0].resized} alt={post.title} className="w-24 h-24 object-cover rounded-md mt-2" />
                                )}
                            </Link>
                        ))
                    ) : (
                        <p>작성한 게시글이 없습니다.</p>
                    )}
                </div>
            )}

            {activeTab === 'myLikes' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">나의 찜</h2>
                    {likedProducts && likedProducts.length > 0 ? (
                        likedProducts.map((product) => (
                            <Link to={`/detail/${product.id}`} key={product.id} className="block p-4 border rounded-lg shadow-sm hover:bg-gray-50">
                                <h3 className="text-lg font-semibold">{product.title}</h3>
                                <p className="text-gray-600 text-sm">찜한 시간: {new Date(product.likedAt.seconds * 1000).toLocaleString()}</p>
                                {product.imgs && product.imgs.length > 0 && (
                                    <img src={product.imgs[0].resized} alt={product.title} className="w-24 h-24 object-cover rounded-md mt-2" />
                                )}
                            </Link>
                        ))
                    ) : (
                        <p>아직 찜한 상품이 없습니다.</p>
                    )}
                </div>
            )}

            <div className="mt-8 flex justify-end gap-2">
                <button className="btn btn-error" onClick={handleLogout}>
                    로그아웃
                </button>
    
            </div>
        </div>
    );
}