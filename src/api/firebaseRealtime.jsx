import { db } from './firebase';
import { ref, get, update, serverTimestamp } from 'firebase/database';

export const handleOpenChatRoom = async (user, product, navigate) => {
    console.log(user, product);
    // 고유한 chatRoomId 생성 (productId_user1Id_user2Id 형식)
    const userIds = [user.uid, product.uid].sort();
    const chatRoomId = `${product.id}_${userIds[0]}_${userIds[1]}`;
    const chatRoomName = product.title;
    const chatProductImgUrl = product.imgs[0].resized;
    const chatRoomRef = ref(db, `chats/${chatRoomId}`);
    const snapshot = await get(chatRoomRef);

    if (snapshot.exists()) {
        // 채팅방이 이미 존재하면 해당 채팅방으로 이동
        navigate(`/dm/${chatRoomId}`);
        return chatRoomId;
    } else {
        // 채팅방이 없으면 새로 생성
        const chatRoomData = {
            chatRoomId,
            chatRoomName,
            chatProductImgUrl,
            isEnd: false,
            lastMessage: '',

            lastTimestamp: serverTimestamp(),
            memberInfo: [
                {
                    user: user.uid,
                    name: String(user.displayName || ''), // `UserId`는 현재 채팅을 시작하는 사용자 ID일 것입니다.
                    img: String(user.photoURL || ''), // 사용자의 프로필 이미지 URL
                },
                {
                    user: product.uid,
                    name: product.user, // `sellerUserId`는 판매자(즉, 상대방)의 ID일 것입니다.
                    img: product.userPhoto || '', // 판매자의 프로필 이미지 URL
                },
            ],
            // 여기에 추가적인 채팅방 관련 필드를 넣을 수 있습니다.
        };

        const updates = {};
        updates[`/chats/${chatRoomId}`] = chatRoomData;
        updates[`/members/${user.uid}/${chatRoomId}`] = true;
        updates[`/members/${product.uid}/${chatRoomId}`] = true;

        await update(ref(db), updates);
        navigate(`/dm/${chatRoomId}`);
        return chatRoomId;
    }
};
