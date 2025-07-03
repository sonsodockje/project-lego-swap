import React from 'react';
import { useAuth } from '../api/firebaseAuth';
import { useParams } from 'react-router';
import WriteForm from '../components/WriteForm';

export default function WritePage() {
  const { isLogin, currentUser } = useAuth();
  const { id } = useParams();

  if (!isLogin) {
    return <p>로그인먼저</p>;
  }

  return (
    <>
      {id && <p>현재 조회 글 ID: {id}</p>}{' '}
      {/* id 값을 표시할 때 좀 더 명확하게 */}
      <WriteForm currentUser={currentUser} />
    </>
  );
}
