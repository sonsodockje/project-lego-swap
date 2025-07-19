import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/firebaseAuth';
import { db } from '../api/firebase';
import { ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';

export default function DmListPage() {
    const { currentUser } = useAuth();

    const [chatRooms, setChatRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('로그인이 필요합니다.');
            return;
        }

        const chatsRef = ref(db, 'chats');
        const unsubscribe = onValue(
            chatsRef,
            (snapshot) => {
                const data = snapshot.val();

                if (data) {
                    const loadedChatRooms = Object.entries(data)
                        .map(([chatRoomId, chatRoomData]) => ({
                            id: chatRoomId,
                            ...chatRoomData,
                        }))
                        .filter((chatRoom) => {
                            console.log('Filtering chatRoom:', chatRoom.id);
                            // chatRoomId에서 사용자 ID를 추출하여 현재 사용자가 포함되어 있는지 확인
                            const parts = chatRoom.id.split('_');
                            console.log('Parts:', parts);
                            if (parts.length === 3) {
                                const user1Id = parts[1];
                                const user2Id = parts[2];
                                console.log(
                                    'Extracted user IDs:',
                                    user1Id,
                                    user2Id,
                                );
                                console.log(
                                    'Current user ID:',
                                    currentUser.uid,
                                );
                                const isParticipant =
                                    user1Id === currentUser.uid ||
                                    user2Id === currentUser.uid;
                                console.log('Is participant:', isParticipant);
                                return isParticipant;
                            }
                            console.log(
                                'ChatRoom ID does not match expected format (productId_user1Id_user2Id).',
                            );
                            return false;
                        });
                    // 마지막 메시지 시간(lastTimestamp)을 기준으로 정렬 (최신순)
                    loadedChatRooms.sort((a, b) => {
                        const timeA = a.lastTimestamp || 0; // lastTimestamp가 없을 경우 0으로 처리
                        const timeB = b.lastTimestamp || 0; // lastTimestamp가 없을 경우 0으로 처리
                        return timeB - timeA; // 내림차순 정렬 (최신 메시지가 위로)
                    });
                    setChatRooms(loadedChatRooms);
                }
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching chat rooms:', err);
                setError('채팅방 목록을 불러오는 데 실패했습니다.');
                setLoading(false);
            },
        );

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return (
            <div className='text-center mt-8'>채팅방 목록을 불러오는 중...</div>
        );
    }

    if (error) {
        return (
            <div className='text-center mt-8 text-red-500'>오류: {error}</div>
        );
    }

    if (chatRooms.length === 0) {
        return (
            <div className='text-center mt-8'>
                참여하고 있는 채팅방이 없습니다.
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>내 DM 목록</h1>
            <div className='space-y-4'>
                {chatRooms.map((chatRoom) => (
                    <Link
                        to={`/dm/${chatRoom.id}`}
                        key={chatRoom.id}
                        className='block p-4 border rounded-lg shadow-sm hover:bg-gray-50 '>
                        <div className='flex gap-5'>
                            <div className=''>
                                <img
                                    className='w-20 h-20 rounded-md object-cover'
                                    src={chatRoom.chatImgUrl}
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
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
