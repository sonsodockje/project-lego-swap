import { userLike } from '../api/firebaseStore';
import { Link, useNavigate } from 'react-router-dom';
import React, { memo } from 'react';
import { useAuth } from '../api/firebaseAuth';
import { getOrCreateChatRoom } from '../api/firebaseRealtime';

export default function ItemList({ products }) {
    if (products.length === 0) {
        return <div>상품이 없습니다.</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-cols-1 gap-4 w-full'>
                {products.map((item) => (
                    <Link to={`/detail/${item.id}`} key={item.id}>
                        <MemoizedItem item={item} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

const Item = ({ item }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const truncateTitle = (title) => {
        if (title.length > 14) {
            return title.substring(0, 14) + '...';
        }
        return title;
    };

    const handleDmBtn = (e, product, sellerId) => {
        e.preventDefault();
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }
        getOrCreateChatRoom(currentUser.uid, sellerId, product, navigate);
    };

    return (
        <div className='flex flex-row  max-h-[150px] rounded-lg shadow-sm'>
            <div className='relative'>
                <div className='h-full w-[150px] md:w-[200px] lg:w-[250px] overflow-hidden'>
                    {' '}
                    <img
                        src={item.imgs[0].resized}
                        loading='lazy'
                        className='object-cover rounded-tl-lg rounded-bl-lg w-full h-full'
                    />
                </div>

                <div className='absolute bottom-0 flex items-center gap-2 bg-black opacity-70 rounded-md m-2 p-1'>
                    <img
                        src={item.userPhoto}
                        className='rounded-full w-4 h-4'
                        alt=''
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
                            <div
                                className='btn btn-sm'
                                onClick={(e) => handleDmBtn(e, item, item.uid)}
                            >
                                dm
                            </div>
                            <div
                                className='btn btn-sm bg-emerald-100'
                                onClick={(e) => {
                                    e.preventDefault();
                                    userLike(item.id, currentUser.uid);
                                }}
                            >
                                찜
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MemoizedItem = memo(Item);
