import React from 'react';

export default function MessageList({
    otherInfo,
    messages,
    currentUser,
    messagesEndRef,
}) {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className='flex-1 overflow-y-auto p-4 '>
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`chat ${msg.senderId === currentUser?.uid ? 'chat-end' : 'chat-start'}`}>
                    <div className='chat-image avatar'>
                        {msg.senderId !== currentUser?.uid && (
                            <div className='w-10 rounded-full'>
                                <img src={otherInfo.img} alt='Profile' />
                            </div>
                        )}
                    </div>
                    <div
                        className={`chat-bubble ${msg.senderId === currentUser?.uid ? 'chat-bubble-primary' : ''}`}>
                        {msg.text}
                    </div>
                    <div className='chat-footer opacity-50'>
                        {formatTimestamp(msg.timestamp)}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
