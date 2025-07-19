import React from 'react';
import { Link } from 'react-router-dom';

export default function DmListItem({ chatRoom, currentUser }) {
    // 상대방 정보 찾기
    const otherMember = chatRoom.memberInfo.find(member => member.user !== currentUser.uid);

    return (
        <Link
            to={`/dm/${chatRoom.id}`}
            key={chatRoom.id}
            className='block p-4 border rounded-lg shadow-sm hover:bg-gray-50 '>
            <div className='flex gap-5'>
                <div className=''>
                    <img
                        className='w-20 h-20 rounded-md object-cover'
                        src={chatRoom.chatProductImgUrl}
                        alt=''
                    />
                </div>
                <div className=''>
                    <div className='flex w-full   justify-between items-center mb-2'>
                        <h2 className='text-lg font-semibold'>
                            {chatRoom.chatRoomName}
                        </h2>
                        {chatRoom.lastTimestamp && (
                            <span className='text-sm text-gray-500'>
                                {new Date(
                                    chatRoom.lastTimestamp,
                                ).toLocaleString()}
                            </span>
                        )}
                    </div>
                    <p className='text-gray-700'>
                        마지막 메시지:{' '}
                        {chatRoom.lastMessage || '메시지 없음'}
                    </p>
                </div>
                <div className="">
                    {otherMember && (
                        <>
                            <img src={otherMember.img || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <p>{otherMember.name || ''}</p>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
