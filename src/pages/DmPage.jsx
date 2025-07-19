import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { useEffect, useState } from 'react';

export default function DmPage() {
    const { chatRoomId } = useParams();
    const navigate = useNavigate();
    const {
        chatRoomName,
        membersInfo,
        messages,
        newMessage,
        setNewMessage,
        handleSendMessage,
        isSending,
        messagesEndRef,
        currentUser,
    } = useChat(chatRoomId);

    const [otherPersonInfo, setOtherPersonInfo] = useState(null);

    useEffect(() => {
        if (membersInfo.length > 0 && currentUser) {
            const otherInfo = membersInfo.find(
                (member) => member.user !== currentUser.uid,
            );
            setOtherPersonInfo(otherInfo);
        }
    }, [membersInfo, currentUser]);

    if (!otherPersonInfo) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <span className='loading loading-spinner loading-lg'></span>
            </div>
        );
    }

    return (
        <div className='flex flex-col max-w-lg mx-auto h-[800px]'>
            <div className='flex items-center w-full'>
                <button
                    onClick={() => navigate(-1)}
                    className='btn btn-ghost btn-circle'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-6 h-6'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15.75 19.5L8.25 12l7.5-7.5'
                        />
                    </svg>
                </button>
                <div className='avatar items-center ml-4'>
                    {/* <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={otherPersonInfo.img} alt="Profile" />
                    </div> */}
                </div>
                <h1 className='text-xl font-bold ml-4'>
                    {otherPersonInfo.name}
                </h1>
                <h1 className='text-xl font-bold ml-4'>{chatRoomName}</h1>
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
