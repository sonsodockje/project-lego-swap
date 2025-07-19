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
        <div className='flex flex-col max-w-lg mx-auto h-[calc(100lvh-110px)] overflow-none'>
            <div className='flex justify-center pb-2 items-center w-full'>
                <div className='avatar items-center ml-4'>
                    <div className='w-5 h-5 rounded-full '>
                        <img src={otherPersonInfo.img} alt='Profile' />
                    </div>
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
