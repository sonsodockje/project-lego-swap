import React, { useEffect, useState } from 'react';
import { deleteProductById, productFetchById } from '../api/firebaseStore';
import { useAuth } from '../api/firebaseAuth';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate(); // useNavigate 훅 추가
    const { currentUser } = useAuth();
    const [mainImage, setMainImage] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productFetchById(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (data && data.imgs && data.imgs.length > 0) {
            setMainImage(data.imgs[0].original);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className='loading loading-spinner loading-lg mx-auto'></div>
        );
    }

    if (isError) {
        return (
            <div className='text-red-500 text-center'>
                데이터를 불러오는 중 오류가 발생했습니다.
            </div>
        );
    }

    if (!data) {
        return <div className='text-center'>데이터를 찾을 수 없습니다.</div>;
    }

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            try {
                await deleteProductById(id);
                alert('상품이 성공적으로 삭제되었습니다.');
                navigate('/'); // 삭제 후 홈으로 이동
            } catch (error) {
                console.error('상품 삭제 중 오류 발생:', error);
                alert('상품 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className='container mx-auto p-4 bg-white rounded-lg shadow-md'>
            <h1 className='text-3xl font-bold mb-4 text-gray-800'>
                {data.title}
            </h1>

            {/* Main Image Section */}
            {mainImage && (
                <div className='mb-4'>
                    <img
                        src={mainImage}
                        alt={data.title}
                        className='w-full h-96 object-contain rounded-lg shadow-sm'
                    />
                </div>
            )}

            {/* Thumbnails Section */}
            {data.imgs && data.imgs.length > 0 && (
                <div className='flex space-x-2 overflow-x-auto pb-2 mb-4'>
                    {data.imgs.map((img, index) => (
                        <img
                            key={index}
                            src={img.resized} // 썸네일은 리사이징된 이미지 사용
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img.original ? 'border-blue-500' : 'border-transparent'}`}
                            onClick={() => handleThumbnailClick(img.original)}
                        />
                    ))}
                </div>
            )}

            {/* User Info */}
            <div className='flex justify-between border-b-1 border-gray-100 pb-4 mb-4'>
                <div className='flex items-center   '>
                    {data.userPhoto && (
                        <img
                            src={data.userPhoto}
                            alt={data.user}
                            className='w-12 h-12 rounded-full mr-3 object-cover'
                        />
                    )}
                    <div>
                        <p className='font-semibold text-lg text-gray-700'>
                            {data.user}
                        </p>
                        <p className='text-sm text-gray-500'>
                            {new Date(
                                data.timestamp.seconds * 1000,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {currentUser && data.uid !== currentUser.uid && (
                    <button className='btn btn-accent'>DM</button>
                )}
            </div>

            {/* Product Details */}
            <div className='mb-4'>
                <p className='text-gray-700 text-lg leading-relaxed mb-4'>
                    {data.body}
                </p>
                <div className='grid grid-cols-2 gap-2 text-gray-600 text-sm'>
                    <p>
                        <span className='font-semibold'>가격:</span>{' '}
                        <span className=''>
                            {data.price.toLocaleString()}원
                        </span>
                    </p>
                    <p>
                        <span className='font-semibold'>개봉 여부:</span>{' '}
                        {data.opened ? '개봉' : '미개봉'}
                    </p>
                    <p>
                        <span className='font-semibold'>판매팀:</span>{' '}
                        {data.sell}
                    </p>
                    <p>
                        <span className='font-semibold'>희망팀:</span>{' '}
                        {data.want}
                    </p>
                </div>
            </div>

            {/* Action Button */}
            {currentUser && data.uid === currentUser.uid && (
                <div className='flex justify-end mt-6 gap-2'>
                    <Link
                    to={`/write/${id}`} className='btn btn-primary px-6 py-2 rounded-md text-white font-semibold'>
                        수정하기
                    </Link>
                    <button
                        className='btn btn-error px-6 py-2 rounded-md text-white font-semibold'
                        onClick={handleDelete}>
                        삭제하기
                    </button>
                </div>
            )}
        </div>
    );
}
