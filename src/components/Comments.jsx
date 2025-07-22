import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, collection , query, orderBy} from 'firebase/firestore';
import { db } from '@/api/firebaseStore';
import { useAuth } from '@/api/firebaseAuth';

function format(dateObj) {
    // 날짜 부분 (YYYY.MM.DD)
    const year = dateObj.getFullYear();
    // getMonth()는 0부터 시작하므로 +1, 두 자리로 포맷
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    // 시간 부분 (HH시 MM분)
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${year}.${month}.${day} | ${hours}:${minutes}`;

    return formattedDate;
}

const Comments = ({ id }) => {
    const [comments, setComments] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const productDocRef = doc(db, 'products', id);
        const commentsCollectionRef = collection(productDocRef, 'comments');

        const q = query(commentsCollectionRef, orderBy('createdAt', 'asc'));


        // onSnapshot은 컬렉션의 경우 QuerySnapshot을 반환합니다.
        const unsub = onSnapshot(q,
            commentsCollectionRef,
            (querySnapshot) => {
                const source = querySnapshot.metadata.hasPendingWrites
                    ? 'Local'
                    : 'Server';
                console.log(source, ' data: ');

                const fetchedComments = [];
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());

                    fetchedComments.push({
                        id: doc.id,
                        ...doc.data(),
                        date: format(doc.data().createdAt.toDate()),
                    });
                });
                setComments(fetchedComments); // 상태 업데이트
            },
            (error) => {
                console.error('댓글을 가져오는 중 오류 발생:', error);
            },
        );

        //     data(): 문서에 저장된 실제 데이터 필드들을 JavaScript 객체 형태로 반환하는 메서드입니다. 데이터 자체에 접근하려면 이 메서드를 호출해야 합니다. 그래서 doc.data()처럼 괄호를 붙여서 사용합니다.

        // 쉽게 말해, doc.id는 문서의 신분증 번호이고, doc.data()는 문서 안의 **내용물(데이터 묶음)**을 꺼내오는 액션이라고 생각하시면 됩니다. 내용물을 꺼내려면 "꺼내줘!"라고 메서드를 호출해야 하죠.

        return () => unsub();
    }, [id]);

    return (
        <div className='w-full py-5'>
            {comments.length > 0 ? (
                <ul className='w-full flex flex-col gap-4 '>
                    {comments.map((comment) => (
                        <li key={comment.id} className='flex gap-4 relative'>
                            <div className='max-w-[50px]'>
                                <img
                                    className='avatar rounded-full'
                                    src={comment.author.photoURL}
                                    alt=''
                                />
                                <p>{comment.author.displayName}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>{comment.content}</p>
                                <p>{comment.date}</p>
                            </div>
                            {currentUser &&
                                comment.author &&
                                comment.author.uid === currentUser.uid && (
                                    <button
                                        onClick={() => {
                                            console.log(id, comment.id);
                                        }}
                                        className='absolute right-0 bottom-10 btn btn-sm'>
                                        삭제
                                    </button>
                                )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>댓글이 없습니다.</p>
            )}
        </div>
    );
};

export default Comments;
