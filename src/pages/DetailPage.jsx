import React from 'react';
import { useParams } from 'react-router';
import { productFetchById } from '../api/firebaseStore';
import { useAuth } from '../api/firebaseAuth';
import { useQuery } from '@tanstack/react-query';

export default function DetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth(); // 현재 사용자 정보 가져오기

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productFetchById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!data) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      {/* 데이터가 있을 때만 표시 */}
      {id && <p>현재 글 ID: {id}</p>}
      {/* 여기에 데이터를 활용한 UI를 표시 */}
      {data && (
        <>
          <h2>{data.title}</h2> {/* 예시: 데이터에 title 필드가 있다고 가정 */}
          <p>{data.body}</p>{' '}
          {/* 예시: 데이터에 description 필드가 있다고 가정 */}
          <img src={data.userPhoto} />
          {data.imgs &&
            data.imgs.map((img, index) => (
              <img key={index} src={img.original} alt={`Image ${index + 1}`} />
            ))}
        </>
      )}
      {currentUser && data.uid === currentUser.uid && (
        <button className='btn btn-primary'> 수정하기</button>
      )}
    </div>
  );
}

