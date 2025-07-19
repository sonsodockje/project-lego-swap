import React from 'react';

export default function MessageInput({
    newMessage,
    setNewMessage,
    handleSendMessage,
    isSending,
}) {
    return (
        <form onSubmit={handleSendMessage} className='flex p-4 border-t'>
            <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='메시지를 입력하세요...'
                className='input input-bordered flex-1'
            />
            <button
                type='submit'
                className='btn btn-primary ml-2'
                disabled={isSending}>
                전송
            </button>
        </form>
    );
}
