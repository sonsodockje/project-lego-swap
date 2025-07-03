import { app } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(app);

export const uploadProductImage = async (file, pathPrefix = 'products/imgs/') => {
  // Storage에 저장될 고유한 파일 이름 생성 (UUID 사용)
  const uniqueFileName = `${uuidv4()}-${file.name}`;
  const storageRef = ref(storage, `${pathPrefix}${uniqueFileName}`); // 'products/imgs/' 경로에 저장

  try {
    // 1. 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);
    console.log('이미지 업로드 성공:', snapshot.metadata.name);

    // 2. 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }
};


