import { app } from './firebase';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

const db = getFirestore(app);

export const productUpload = async (data, setIsLoading, navigate) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), data);
    console.log('Document written with ID: ', docRef.id);

    if (navigate) {
      // navigate 함수가 제대로 전달되었는지 확인
      navigate('/'); // 업로드 성공 후 홈으로 이동
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  } finally {
    setIsLoading(false);
  }
};

export const productsFetch = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));

    if (querySnapshot.empty) {
      console.log('컬렉션에 문서가 없습니다.');
      return [];
    }

    const products = [];

    //
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log('컬렉션 문서 읽기 성공:', products);

    return products; // 문서 ID를 포함한 배열 반환
  } catch (error) {
    console.error('컬렉션 문서를 읽는 중 오류 발생:', error);
    throw error; // 오류를 호출자에게 다시 던집니다.
  }
};

export const productFetchById = async (id) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    return docSnap.data();
  } else {
    console.log('No such document!');
    return null;
  }
};
