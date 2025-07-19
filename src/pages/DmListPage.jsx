import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/firebaseAuth';
import { db } from '../api/firebase';
import { ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import DmListItem from '../components/DmListItem';


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

                console.log(data)

                if (data) {
                    
                    const loadedChatRooms = Object.entries(data)
                        .map(([chatRoomId, chatRoomData]) => ({
                            id: chatRoomId,
                            ...chatRoomData,
                        }))
                        .filter((chatRoom) => {
                        
                            const parts = chatRoom.id.split('_');

                            console.log('Parts:', parts);
                            if (parts.length === 3) {
                                const user1Id = parts[1];
                                const user2Id = parts[2];

                                const isParticipant =
                                    user1Id === currentUser.uid || 
                                    user2Id === currentUser.uid;
                                return isParticipant;
                            }
                            return false;
                        });
                    // 마지막 메시지 시간(lastTimestamp)을 기준으로 정렬 (최신순)
                    loadedChatRooms.sort((a, b) => {
                        const timeA = a.lastTimestamp || 0; 
                        const timeB = b.lastTimestamp || 0; 
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
                    <DmListItem key={chatRoom.id} chatRoom={chatRoom} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
}
