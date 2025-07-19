
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { useEffect, useState } from 'react';

export default function DmPage() {
    const { chatRoomId } = useParams();


    console.log('DmPage - chatRoomId:', chatRoomId);

    const {
        membersInfo,
        messages,
        newMessage,
        setNewMessage,
        handleSendMessage,
        isSending,
        messagesEndRef,
        currentUser,
    } = useChat(chatRoomId);

    const otherPersonInfo = membersInfo.find((memberData) => { return memberData.user !== currentUser.uid; })
    console.log(otherPersonInfo)

    return (
        <div className='flex flex-col h-dvw max-w-lg mx-auto'>
            <div className="flex w-full">
                {otherPersonInfo?.name}
    
        
            </div>
            <MessageList
            otherInfo={otherPersonInfo}
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
