import React, { useEffect, useState } from 'react';
import {
    doc,
    onSnapshot,
    collection,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/api/firebaseStore';
import { useAuth } from '@/api/firebaseAuth';
import Comment from './Comment'; // 대댓글 입력 컴포넌트

// 날짜 포맷 함수는 그대로 사용
function format(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${year}.${month}.${day} | ${hours}:${minutes}`;
    return formattedDate;
}

const Comments = ({ id }) => {
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null); // 어떤 댓글에 대댓글을 다는지
    const { currentUser } = useAuth(); // 현재 로그인 사용자 정보

    useEffect(() => {
        if (!id) {
            console.warn("게시물 ID가 유효하지 않습니다.");
            return;
        }

        const productDocRef = doc(db, 'products', id);
        const commentsCollectionRef = collection(productDocRef, 'comments');
        // 댓글을 createdAt 기준으로 오름차순 정렬 (오래된 것이 먼저)
        const q = query(commentsCollectionRef, orderBy('createdAt', 'asc'));

        // 상위 댓글 리스너
        const unsub = onSnapshot(q, (querySnapshot) => {
            // 각 상위 댓글에 대한 대댓글 리스너들을 저장할 배열
            const commentUnsubs = [];
            const fetchedComments = [];

            querySnapshot.docs.forEach((commentDoc) => {
                const commentData = {
                    id: commentDoc.id,
                    ...commentDoc.data(),
                    date: format(commentDoc.data().createdAt.toDate()),
                    recomments: [], // 초기에 빈 배열로 설정
                };

                const recommentsCollectionRef = collection(
                    commentDoc.ref,
                    'recomments',
                );
                const rq = query(
                    recommentsCollectionRef,
                    orderBy('createdAt', 'asc'), // 대댓글도 시간순으로 정렬
                );

                // 각 상위 댓글에 대한 대댓글 리스너 설정
                const unsubRecomments = onSnapshot(
                    rq,
                    (recommentQuerySnapshot) => {
                        const fetchedRecomments =
                            recommentQuerySnapshot.docs.map((recommentDoc) => ({
                                id: recommentDoc.id,
                                ...recommentDoc.data(),
                                date: format(recommentDoc.data().createdAt.toDate()),
                            }));

                        // 상위 댓글의 recomments 상태를 업데이트
                        setComments((prevComments) =>
                            prevComments.map((c) =>
                                c.id === commentDoc.id
                                    ? { ...c, recomments: fetchedRecomments }
                                    : c,
                            ),
                        );
                    },
                    (error) => {
                        console.error('대댓글을 가져오는 중 오류 발생:', error);
                    },
                );

                commentUnsubs.push(unsubRecomments); // 대댓글 리스너 해제 함수를 저장
                fetchedComments.push(commentData); // 상위 댓글 데이터 추가
            });

            // 상위 댓글 상태 업데이트
            setComments(fetchedComments);

            // 컴포넌트 언마운트 시 모든 대댓글 리스너 해제
            return () => {
                commentUnsubs.forEach((unsubFunc) => unsubFunc());
            };
        }, (error) => {
            console.error('댓글을 가져오는 중 오류 발생:', error);
        });

        // 상위 댓글 리스너 해제
        return () => unsub();
    }, [id]);

    return (
        <div className='w-full py-5 border-t border-gray-200'>
            <h3 className='text-lg font-semibold mb-4'>댓글</h3>
            {comments.length > 0 ? (
                <ul className='w-full flex flex-col gap-6'>
                    {comments.map((comment) => (
                        <li key={comment.id} className='relative flex flex-col gap-3 p-4 bg-base-100 rounded-lg shadow-sm border border-gray-100'>
                            {/* 댓글 작성자 정보 */}
                            <div className='flex items-center gap-3'>
                                <img
                                    className='w-10 h-10 rounded-full object-cover border border-gray-200'
                                    src={comment.author?.photoURL || 'https://via.placeholder.com/40'} // Fallback 이미지 추가
                                    alt={comment.author?.displayName || '사용자'}
                                />
                                <div className='flex flex-col'>
                                    <p className='font-medium text-base-content'>{comment.author?.displayName || '익명 사용자'}</p>
                                    <p className='text-xs text-base-content'>{comment.date}</p>
                                </div>
                            </div>
                            
                            {/* 댓글 내용 */}
                            <p className='text-base-content leading-relaxed'>{comment.content}</p>

                            {/* 액션 버튼 (대댓, 삭제) */}
                            <div className='flex justify-end gap-2 mt-2'>
                                <button
                                    className='btn btn-ghost btn-sm text-blue-600 hover:bg-blue-50'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setReplyingTo(
                                            replyingTo === comment.id ? null : comment.id,
                                        );
                                    }}>
                                    대댓
                                </button>
                                {currentUser && comment.author?.uid === currentUser.uid && (
                                    <button
                                        onClick={() => {
                                            console.log('게시물 ID:', id, '댓글 ID:', comment.id);
                                            // TODO: 삭제 로직 구현 (Firestore에서 댓글 문서 삭제)
                                            alert('삭제 기능은 아직 구현되지 않았습니다.');
                                        }}
                                        className='btn btn-ghost btn-sm text-red-600 hover:bg-red-50'>
                                        삭제
                                    </button>
                                )}
                            </div>

                            {/* 대댓글 입력 폼 (조건부 렌더링) */}
                            {replyingTo === comment.id && (
                                <div className='mt-4 pt-4 border-t border-gray-200'>
                                    <Comment
                                        isRe={true} // 대댓글임을 나타냄
                                        setIsRe={() => setReplyingTo(null)} // 대댓글 입력 후 폼 닫기
                                        commentId={comment.id} // 대댓글을 달 상위 댓글 ID 전달
                                        postId={id} // 게시물 ID 전달
                                    />
                                </div>
                            )}

                            {/* 대댓글 목록 (조건부 렌더링) */}
                            {comment.recomments && comment.recomments.length > 0 && (
                                <ul className='ml-4 mt-4 flex flex-col gap-4 pl-2'> 
                                    {comment.recomments.map((recomment) => (
                                        <li key={recomment.id} className='relative flex flex-col gap-2 p-3 bg-base-200 rounded-lg shadow-xs'>
                                            {/* 대댓글 작성자 정보 */}
                                            <div className='flex items-center gap-2'>
                                                <img
                                                    className='w-8 h-8 rounded-full object-cover border border-gray-100'
                                                    src={recomment.author?.photoURL || 'https://via.placeholder.com/32'}
                                                    alt={recomment.author?.displayName || '사용자'}
                                                />
                                                <div className='flex flex-col'>
                                                    <p className='font-normal text-base-content text-sm'>{recomment.author?.displayName || '익명 사용자'}</p>
                                                    <p className='text-xs text-base-content'>{recomment.date}</p>
                                                </div>
                                            </div>
                                            {/* 대댓글 내용 */}
                                            <p className='text-base-content text-sm'>{recomment.content}</p>

                                            {/* 대댓글 삭제 버튼 */}
                                            {currentUser && recomment.author?.uid === currentUser.uid && (
                                                <div className='flex justify-end'>
                                                    <button
                                                        onClick={() => {
                                                            console.log('게시물 ID:', id, '상위 댓글 ID:', comment.id, '대댓글 ID:', recomment.id);
                                                    
                                                            alert('대댓글 삭제 기능은 아직 구현되지 않았습니다.');
                                                        }}
                                                        className='btn btn-ghost btn-xs text-red-500 hover:bg-red-50'>
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center text-gray-500 py-8'>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            )}
        </div>
    );
};

export default Comments;