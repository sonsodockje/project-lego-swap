import React from 'react';

export default function MessageList({ messages, currentUser, messagesEndRef }) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`chat ${msg.senderId === currentUser?.uid ? 'chat-end' : 'chat-start'}`}
                >
                    <div className="chat-bubble">
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
