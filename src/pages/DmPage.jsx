import React from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

export default function DmPage() {
    const { chatRoomId } = useParams();
    console.log('DmPage - chatRoomId:', chatRoomId);

    const {
        messages,
        newMessage,
        setNewMessage,
        handleSendMessage,
        isSending,
        messagesEndRef,
        currentUser,
    } = useChat(chatRoomId);

    return (
        <div className='flex flex-col h-dvw max-w-lg mx-auto'>
            <MessageList
                messages={messages}
                currentUser={currentUser}
                messagesEndRef={messagesEndRef}
            />
            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isSending={isSending}
            />
        </div>
    );
}
