import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { productFetchById } from '../firebaseStore';
import { useState } from 'react';
import { useAuth } from '../firebaseAuth';

export default function DetailPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const { currentUser } = useAuth(); // 현재 사용자 정보 가져오기

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // id가 없으면 fetch하지 않음 (선택 사항)

      if (isLoading) {
        return;
      }

      setIsLoading(true); // 로딩 시작

      try {
        // productFetchById가 데이터를 반환한다고 가정
        // productFetchById도 setIsLoading을 인자로 받으면 내부에서 로딩 관리가 가능합니다.
        const fetchedData = await productFetchById(id, setIsLoading);
        setData(fetchedData); // 가져온 데이터를 data 상태에 저장
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
        // 에러 처리 (예: 사용자에게 메시지 표시)
        setData(null); // 에러 발생 시 data를 초기화
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    };

    fetchData(); // 정의된 비동기 함수 즉시 호출

    // return () => { /* cleanup 함수 (필요시) */ };
  }, [id]);
  if (isLoading) {
    return <div>로딩 중...</div>;
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
              <img key={index} src={img} alt={`Image ${index + 1}`} />
            ))}
        </>
      )}
      {currentUser && data.uid === currentUser.uid && (
        <button className='btn btn-primary'> 수정하기</button>
      )}
    </div>
  );
}
