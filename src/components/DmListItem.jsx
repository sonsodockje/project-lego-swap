import React from 'react';
import { Link } from 'react-router-dom';

export default function DmListItem({ chatRoom, currentUser }) {
    // Find the other member in the chat room
    const otherMember = chatRoom.memberInfo.find(
        (member) => member.user !== currentUser.uid,
    );

    const truncateText = (text, length = 20) => {
        if (text && text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };

    return (
        <Link
            to={`/dm/${chatRoom.id}`}
            key={chatRoom.id}
            className='block bg-base-100  border-b-1 border-base-300 overflow-hidden hover:bg-base-200 transition-all duration-300 ease-in-out'>
            <div className='flex items-center p-3'>
                {/* Image Section */}
                <div className='relative w-24 h-24 flex-shrink-0'>
                    <div className='aspect-square w-full h-full'>
                        <img
                            className='w-full h-full rounded-lg object-cover'
                            src={chatRoom.chatProductImgUrl}
                            alt={chatRoom.chatRoomName}
                        />
                    </div>
                    {otherMember && (
                        <div className='absolute bottom-1 left-1 flex items-center gap-1.5 bg-black bg-opacity-60 rounded-full py-1 px-2'>
                            <img
                                src={otherMember.img || ''}
                                alt={otherMember.name || 'User'}
                                className='w-5 h-5 rounded-full object-cover'
                            />
                            <p className='text-white text-xs font-semibold'>
                                {otherMember.name || '상대방'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className='ml-4 flex-grow flex flex-col justify-center min-w-0'>
                    <h2
                        className='text-base font-bold text-gray-800 truncate'
                        title={chatRoom.chatRoomName}>
                        {chatRoom.chatRoomName}
                    </h2>
                    <p className='text-sm text-gray-600 mt-1 truncate'>
                        {truncateText(chatRoom.lastMessage, 25) ||
                            '아직 메시지가 없습니다.'}
                    </p>
                    {chatRoom.lastTimestamp && (
                        <p className='text-xs text-gray-400 mt-2 self-start'>
                            {new Date(
                                chatRoom.lastTimestamp,
                            ).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
