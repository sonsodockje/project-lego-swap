import { db } from './firebase';
import { ref, get, update, serverTimestamp } from 'firebase/database';

export const getOrCreateChatRoom = async (myUserId, sellerUserId, product, navigate) => {
  console.log(myUserId, sellerUserId, product)

  // 고유한 chatRoomId 생성 (productId_user1Id_user2Id 형식)
  const userIds = [myUserId, sellerUserId].sort();
  const chatRoomId = `${product.id}_${userIds[0]}_${userIds[1]}`;
  const chatRoomName = product.title
  const chatImgUrl = product.imgs[0].resized 
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
       chatImgUrl,
      lastMessage: '',
      lastTimestamp: serverTimestamp(),
      memberIds: [myUserId, sellerUserId],
    };

    const updates = {};
    updates[`/chats/${chatRoomId}`] = chatRoomData;
    updates[`/members/${myUserId}/${chatRoomId}`] = true;
    updates[`/members/${sellerUserId}/${chatRoomId}`] = true;

    await update(ref(db), updates);
    navigate(`/dm/${chatRoomId}`);
    return chatRoomId;
  }
};