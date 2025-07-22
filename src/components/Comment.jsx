import { useAuth } from '@/api/firebaseAuth';
import { commentUpload, reCommentUpload } from '@/api/firebaseStore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Comment = ({ isRe, setIsRe, commentId }) => {
    const { id } = useParams();
    const { isLogin, currentUser } = useAuth();
    const [commentData, setCommentData] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin) {
            alert('로그인이 필요합니다.');
            return;
        }

        const { displayName, photoURL, uid } = currentUser;
        const comment = {
            author: {
                displayName,
                photoURL,
                uid,
            },
            content: commentData,
            createdAt: new Date(),
        };

        setIsLoading(true);

        if (isRe) {
            try {
                await reCommentUpload(id, commentId, comment, setIsLoading);
                setCommentData(''); // 입력 필드 초기화
                setIsRe(false);
            } catch (error) {
                console.error('대댓글 업로드 오류:', error);
                alert('대댓글 작성에 실패했습니다.');
            }
        } else {
            try {
                await commentUpload(id, comment, setIsLoading);
                setCommentData(''); // 입력 필드 초기화
            } catch (error) {
                console.error('댓글 업로드 오류:', error);
                alert('댓글 작성에 실패했습니다.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pb-10'>
            <div className='flex gap-2'>
                <input
                    className='input w-full'
                    type='text'
                    value={commentData}
                    required
                    onChange={(e) => setCommentData(e.target.value)}
                    placeholder='댓글을 입력하세요...'
                />
                <button className='btn' type='submit' disabled={isLoading}>
                    {isLoading ? '등록중...' : '작성'}
                </button>
            </div>
        </form>
    );
};

export default Comment;
