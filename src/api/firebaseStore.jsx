import { app } from './firebase';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc, // deleteDoc 임포트 추가
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

export const productsFetch = async (lastVisibleDoc = null, itemsPerPage = 8) => {
  try {
    let q;
    if (lastVisibleDoc) {
      q = query(
        collection(db, 'products'),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisibleDoc),
        limit(itemsPerPage),
      );
    } else {
      q = query(
        collection(db, 'products'),
        orderBy('timestamp', 'desc'),
        limit(itemsPerPage),
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('컬렉션에 문서가 없습니다.');
      return { products: [], lastVisible: null, hasMore: false };
    }

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const hasMore = products.length === itemsPerPage; // limit과 가져온 문서 수가 같으면 다음 페이지가 있을 가능성 있음

    console.log('컬렉션 문서 읽기 성공:', products);

    return { products, lastVisible, hasMore };
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

export const deleteProductById = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    console.log(`Document with ID ${id} successfully deleted!`);
  } catch (error) {
    console.error(`Error removing document with ID ${id}:`, error);
    throw new Error('상품 삭제 중 오류가 발생했습니다.');
  }
};