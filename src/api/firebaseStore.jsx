import { app } from './firebase';
import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
    deleteDoc,
    updateDoc, // updateDoc 임포트 추가
    where, // where 임포트 추가
} from 'firebase/firestore';

export const db = getFirestore(app);

/**
 * Firestore에 상품 데이터를 업로드
 * @param {object} data - 업로드할 상품 데이터
 * @param {Function} setIsLoading - 로딩 상태 변경 함수
 * @param {Function} navigate - 업로드 성공 후 페이지 이동을 처리하는 함수
 */
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

/**
 * Firestore에서 모든 상품 목록을 가져옴 (클라이언트 측 페이지네이션을 위해)
 * @returns {Promise<{products: Array<object>, totalCount: number}>} - 상품 목록과 총 개수를 포함하는 객체를 반환하는 Promise 객체
 * @throws {Error}
 */
export const productsFetch = async () => {
    try {
        // 모든 상품을 가져오기 위한 쿼리
        const q = query(
            collection(db, 'products'),
            orderBy('timestamp', 'desc'),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('컬렉션에 문서가 없습니다.');
            return { products: [], totalCount: 0 };
        }

        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        const totalCount = products.length;

        console.log('컬렉션 문서 읽기 성공 (모든 데이터):', products);

        return { products, totalCount };
    } catch (error) {
        console.error('컬렉션 문서를 읽는 중 오류 발생:', error);
        throw error; // 오류를 호출자에게 다시 던집니다。
    }
};

/**
 * Firestore에서 ID로 특정 상품의 데이터를 가져옴
 * @param {string} id - 상품의 ID
 * @returns {Promise<object|null>} - 상품 데이터를 포함하는 Promise 객체를 반환하거나, 문서가 없으면 null을 반환
 */
export const productFetchById = async (id) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        return { id: docSnap.id, ...docSnap.data() }; // ID도 함께 반환
    } else {
        console.log('No such document!');
        return null;
    }
};

/**
 * Firestore에서 ID로 특정 상품을 삭제
 * @param {string} id - 상품의 ID
 * @throws {Error}
 */
export const deleteProductById = async (id) => {
    try {
        await deleteDoc(doc(db, 'products', id));
        console.log(`Document with ID ${id} successfully deleted!`);
    } catch (error) {
        console.error(`Error removing document with ID ${id}:`, error);
        throw new Error('상품 삭제 중 오류가 발생했습니다.');
    }
};

/**
 * Firestore에서 특정 상품의 데이터를 업데이트
 * @param {string} id - 업데이트할 상품의 ID
 * @param {object} data - 업데이트할 상품 데이터
 * @param {Function} setIsLoading - 로딩 상태 설정 함수
 * @param {Function} navigate - 페이지 이동 함수
 */
export const productUpdate = async (id, data, setIsLoading, navigate) => {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, data);
        console.log('Document with ID ', id, ' successfully updated!');

        if (navigate) {
            navigate('/detail/' + id); // 업데이트 성공 후 상세 페이지로 이동
        }
    } catch (e) {
        console.error('Error updating document: ', e);
        alert('상품 업데이트 중 오류가 발생했습니다.');
    } finally {
        setIsLoading(false);
    }
};

/**
 * 사용자가 특정 상품에 '좋아요'를 누를 때 Firestore에 데이터를 저장
 * @param {string} productId - '좋아요'를 누른 상품의 ID
 * @param {string} currentUserId - 현재 로그인한 사용자의 ID
 */
export const userLike = async (productId, currentUserId) => {
    try {
        const likeDocRef = doc(db, 'user', currentUserId, 'like', productId);
        const docSnap = await getDoc(likeDocRef);

        if (docSnap.exists()) {
            // 이미 찜한 경우: 찜 취소 (문서 삭제)
            await deleteDoc(likeDocRef);
            console.log('Document successfully deleted!');
            alert('찜 취소!');
        } else {
            // 찜하지 않은 경우: 찜하기 (문서 추가)
            await setDoc(likeDocRef, {
                likedAt: new Date(),
            });
            console.log('Document set with ID: ', productId);
            alert('찜 완료!');
        }
    } catch (e) {
        console.error('Error updating document: ', e);
        alert('찜 오류...~');
    }
};

/**
 * Firestore에서 사용자가 '좋아요'를 누른 상품 목록을 가져옴 (상세 정보 포함)
 * @param {string} currentUserId - 현재 로그인한 사용자의 ID
 * @returns {Promise<Array<object>>} - '좋아요'를 누른 상품 목록을 포함하는 Promise 객체를 반환
 * @throws {Error}
 */
export const readUserLike = async (currentUserId) => {
    try {
        const likeCollectionRef = collection(db, 'user', currentUserId, 'like');
        const querySnapshot = await getDocs(likeCollectionRef);

        const likedProductIds = [];
        querySnapshot.forEach((doc) => {
            likedProductIds.push({
                productId: doc.id,
                likedAt: doc.data().likedAt,
            });
        });

        // 각 찜한 상품의 상세 정보를 가져옵니다.
        const likedProductsWithDetails = await Promise.all(
            likedProductIds.map(async (likedItem) => {
                const productDetail = await productFetchById(
                    likedItem.productId,
                );
                return productDetail
                    ? { ...productDetail, likedAt: likedItem.likedAt }
                    : null;
            }),
        );

        // null 값 필터링 및 likedAt 기준으로 최신순 정렬
        const filteredAndSortedProducts = likedProductsWithDetails
            .filter((product) => product !== null)
            .sort((a, b) => b.likedAt.seconds - a.likedAt.seconds); // likedAt이 Timestamp 객체라고 가정

        if (filteredAndSortedProducts.length > 0) {
            console.log(
                'Liked products data with details:',
                filteredAndSortedProducts,
            );
            return filteredAndSortedProducts;
        } else {
            console.log('No liked products found!');
            return [];
        }
    } catch (e) {
        console.error('Error reading liked products: ', e);
        throw new Error('찜 목록을 불러오는 데 오류가 발생했습니다.');
    }
};

/**
 * Firestore에서 특정 사용자가 작성한 모든 상품 게시글을 가져옴
 * @param {string} userId - 게시글을 작성한 사용자의 ID
 * @returns {Promise<Array<object>>} - 사용자가 작성한 상품 게시글 목록을 포함하는 Promise 객체를 반환
 * @throws {Error}
 */
export const fetchUserPosts = async (userId) => {
    try {
        const q = query(
            collection(db, 'products'),
            where('uid', '==', userId), // uid 필드가 userId와 일치하는 문서 필터링
            orderBy('timestamp', 'desc'), // 최신순 정렬
        );
        const querySnapshot = await getDocs(q);

        const userPosts = [];
        querySnapshot.forEach((doc) => {
            userPosts.push({ id: doc.id, ...doc.data() });
        });

        console.log('User posts:', userPosts);
        return userPosts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw new Error('내가 쓴 글을 불러오는 데 오류가 발생했습니다.');
    }
};

export const commentUpload = async (postId, data, setIsLoading) => {
    try {
        const productDocRef = doc(db, 'products', postId)
        const commentsCollectionRef = collection(productDocRef, 'comments');

        const returnData = await addDoc(commentsCollectionRef, data);
        console.log('Document comment with ID: ', returnData.id);
    } catch (e) {
        console.error('Error adding document: ', e);
    } finally {
        setIsLoading(false);
    }
};



    // await reCommentUpload(id, commentId, comment, setIsLoading);

export const reCommentUpload = async (postId, commentId,data, setIsLoading) => {
    console.log("정보", postId, commentId,data, setIsLoading)
    try {
        const commentsDocRef = doc(db, 'products', postId,'comments', commentId)
        const reCommentCollctionRef = collection(commentsDocRef, 'recomments');
        const returnData = await addDoc(reCommentCollctionRef, data);
        console.log('Document comment with ID: ', returnData.id);
    } catch (e) {
        console.error('Error adding document: ', e);
    } finally {
        setIsLoading(false);
    }
};

// export const fetchComment = async (postId) => {
//     try {
//         const q = query(
//             collection(db, 'products'),
//             where('uid', '==', userId), // uid 필드가 userId와 일치하는 문서 필터링
//             orderBy('timestamp', 'desc'), // 최신순 정렬


            
//         );
//         const querySnapshot = await getDocs(q);

//         const userPosts = [];
//         querySnapshot.forEach((doc) => {
//             userPosts.push({ id: doc.id, ...doc.data() });
//         });

//         console.log('User posts:', userPosts);
//         return userPosts;

//     } catch (error) {
//         console.error('Error fetching user posts:', error);
//         throw new Error('내가 쓴 글을 불러오는 데 오류가 발생했습니다.');
//     }
// };