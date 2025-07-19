import { useState, useEffect, useRef } from 'react';
import { db } from '../api/firebase';
import {
    ref,
    onValue,
    push,
    set,
    serverTimestamp,
    update,
} from 'firebase/database';
import { useAuth } from '../api/firebaseAuth';

export function useChat(chatRoomId) {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const messagesRef = ref(db, `messages/${chatRoomId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = data
                ? Object.entries(data).map(([key, value]) => ({
                      id: key,
                      ...value,
                  }))
                : [];
            setMessages(loadedMessages);
        });

        return () => unsubscribe();
    }, [chatRoomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser || isSending) return;

        setIsSending(true);

        const messagesRef = ref(db, `messages/${chatRoomId}`);
        const newMessageRef = push(messagesRef);

        const messageData = {
            senderId: currentUser.uid,
            text: newMessage,
            timestamp: serverTimestamp(),
        };

        await set(newMessageRef, messageData);

        const chatRef = ref(db, `chats/${chatRoomId}`);
        await update(chatRef, {
            lastMessage: newMessage,
            lastTimestamp: serverTimestamp(),
        });

        setNewMessage('');
        setIsSending(false);
    };

    return {
        messages,
        newMessage,
        setNewMessage,
        handleSendMessage,
        isSending,
        messagesEndRef,
        currentUser, // currentUser도 훅에서 반환하여 MessageList에서 사용 가능하게 함
    };
}
