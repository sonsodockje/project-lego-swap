import { app } from './firebase';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    documentId,
    query,
    orderBy,
    deleteDoc,
    updateDoc,
    where,
    writeBatch,
} from 'firebase/firestore';

export const db = getFirestore(app);

/**
 * Firestore에 상품 데이터를 업로드
 * @param {object} data - 업로드할 상품 데이터
 * @returns {Promise<string>} - 생성된 문서의 ID를 반환하는 Promise 객체
 * @throws {Error} - 문서 추가 중 오류 발생 시
 */
export const productUpload = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'products'), data);
        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('Error adding document: ', e);
        throw new Error('상품 업로드 중 오류가 발생했습니다.');
    }
};

/**
 * Firestore에서 모든 상품 목록을 가져옴 (클라이언트 측 페이지네이션을 위해)
 * @description 데이터가 많아질 경우, 성능 저하를 방지하기 위해 서버 측 페이지네이션 (limit, startAfter) 사용을 고려해야 합니다.
 * @returns {Promise<{products: Array<object>, totalCount: number}>} - 상품 목록과 총 개수를 포함하는 객체를 반환하는 Promise 객체
 * @throws {Error} - 데이터 조회 중 오류 발생 시
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
        throw new Error('상품 목록을 불러오는 중 오류가 발생했습니다.');
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

export const deleteCommentById = async (productId, commentId, reCommentId) => {
    try {
        if(!reCommentId) {
            await deleteDoc(doc(db, 'products', productId, 'comments', commentId));
            console.log('successfully deleted!');
        } else {
            await deleteDoc(doc(db, 'products', productId, 'comments', commentId, 'recomments', reCommentId));
            console.log('successfully deleted!');
        }
    } catch (error) {
        console.error(error);
        throw new Error('댓글 삭제중 오류가 발생했습니다.');
    }
};

/**
 * Firestore에서 특정 상품의 데이터를 업데이트
 * @param {string} id - 업데이트할 상품의 ID
 * @param {object} data - 업데이트할 상품 데이터.
 * @returns {Promise<void>}
 * @throws {Error} - 업데이트 중 오류 발생 시
 */
export const productUpdate = async (id, data) => {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, data);
        console.log('Document with ID ', id, ' successfully updated!');
    } catch (e) {
        console.error('Error updating document: ', e);
        throw new Error('상품 업데이트 중 오류가 발생했습니다.');
    }
};

/**
 * 사용자가 특정 상품에 '좋아요'를 누를 때 Firestore에 데이터를 저장
 * @param {string} productId - '좋아요'를 누른 상품의 ID
 * @param {string} currentUserId - 현재 로그인한 사용자의 ID
 * @returns {Promise<boolean>} - '좋아요'가 추가되면 true, 취소되면 false를 반환
 * @throws {Error} - 작업 중 오류 발생 시
 */
export const userLike = async (productId, currentUserId) => {
    try {
        const batch = writeBatch(db);

        const userLikeDocRef = doc(
            db,
            'user',
            currentUserId,
            'like',
            productId,
        );

        const docSnap = await getDoc(userLikeDocRef);

        if (docSnap.exists()) {
            // 찜 취소
            batch.delete(userLikeDocRef);
            console.log('Document successfully deleted!');
            await batch.commit();
            return false;
        } else {
            // 찜하기
            batch.set(userLikeDocRef, {
                likedAt: new Date(),
            });
            await batch.commit();
            console.log('Document set with ID: ', productId);
            return true;
        }
    } catch (e) {
        console.error('Error updating document: ', e);
        throw new Error('찜 처리 중 오류가 발생했습니다.');
    }
};

/**
 * Firestore에서 사용자가 '좋아요'를 누른 상품 목록을 가져옴 (상세 정보 포함)
 * @description Firestore 'in' 쿼리는 한 번에 30개의 ID만 조회할 수 있습니다.
 * 만약 사용자가 30개 이상의 상품에 '좋아요'를 누를 경우, ID 목록을 30개씩 나누어 여러 번 쿼리해야 합니다.
 * @param {string} currentUserId - 현재 로그인한 사용자의 ID
 * @returns {Promise<Array<object>>} - '좋아요'를 누른 상품 목록을 포함하는 Promise 객체를 반환
 * @throws {Error}
 */
export const readUserLike = async (currentUserId) => {
    try {
        const likeCollectionRef = collection(db, 'user', currentUserId, 'like');
        const querySnapshot = await getDocs(likeCollectionRef);

        if (querySnapshot.empty) {
            return [];
        }

        const likedItems = {};
        querySnapshot.forEach((doc) => {
            likedItems[doc.id] = doc.data().likedAt;
        });

        const productIds = Object.keys(likedItems);
        const productChunks = [];
        for (let i = 0; i < productIds.length; i += 30) {
            productChunks.push(productIds.slice(i, i + 30));
        }

        const productPromises = productChunks.map((chunk) => {
            const productsQuery = query(
                collection(db, 'products'),
                where(documentId(), 'in', chunk),
            );
            return getDocs(productsQuery);
        });

        const productSnapshots = await Promise.all(productPromises);

        const likedProductsWithDetails = [];
        productSnapshots.forEach((snapshot) => {
            snapshot.forEach((doc) => {
                likedProductsWithDetails.push({
                    id: doc.id,
                    ...doc.data(),
                    likedAt: likedItems[doc.id],
                });
            });
        });

        const sortedProducts = likedProductsWithDetails
            .sort((a, b) => b.likedAt.seconds - a.likedAt.seconds); // likedAt이 Timestamp 객체라고 가정

        console.log('Liked products data with details:', sortedProducts);
        return sortedProducts;
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

/**
 * Firestore에 댓글 데이터를 업로드
 * @param {string} postId - 상품 ID
 * @param {object} data - 업로드할 댓글 데이터
 * @returns {Promise<string>} - 생성된 댓글 문서의 ID
 * @throws {Error} - 댓글 업로드 중 오류 발생 시
 */
export const commentUpload = async (postId, data) => {
    try {
        const productDocRef = doc(db, 'products', postId);
        const commentsCollectionRef = collection(productDocRef, 'comments');
        const returnData = await addDoc(commentsCollectionRef, data);
        console.log('Document comment with ID: ', returnData.id);
        return returnData.id;
    } catch (e) {
        console.error('Error adding document: ', e);
        throw new Error('댓글 작성 중 오류가 발생했습니다.');
    }
};

/**
 * Firestore에 대댓글 데이터를 업로드
 * @param {string} postId - 상품 ID
 * @param {string} commentId - 부모 댓글 ID
 * @param {object} data - 업로드할 대댓글 데이터
 * @returns {Promise<string>} - 생성된 대댓글 문서의 ID
 * @throws {Error} - 대댓글 업로드 중 오류 발생 시
 */
export const reCommentUpload = async (postId, commentId, data) => {
    try {
        const commentsDocRef = doc(db, 'products', postId, 'comments', commentId);
        const reCommentCollctionRef = collection(commentsDocRef, 'recomments');
        const returnData = await addDoc(reCommentCollctionRef, data);
        console.log('Document comment with ID: ', returnData.id);
        return returnData.id;
    } catch (e) {
        console.error('Error adding document: ', e);
        throw new Error('대댓글 작성 중 오류가 발생했습니다.');
    }
};

/**
 * 특정 상품 문서의 comments 서브컬렉션 문서 수를 가져옴
 * @param {string} productId - 상품의 ID
 * @returns {Promise<number>} - comments 서브컬렉션의 문서 수를 반환하는 Promise 객체
 * @description 댓글과 대댓글이 많아질 경우, 모든 문서를 읽어오므로 비용 및 성능에 비효율적일 수 있습니다. '상품' 문서에 댓글 카운트 필드를 두고 트랜잭션이나 Cloud Function으로 관리하는 것을 고려해볼 수 있습니다.
 */

export const getCommentsCount = async (productId) => {
    try {
        const commentsCollectionRef = collection(
            db,
            'products',
            productId,
            'comments',
        );
        const commentsSnapshot = await getDocs(commentsCollectionRef);
        let totalCount = commentsSnapshot.size;

        for (const commentDoc of commentsSnapshot.docs) {
            const recommentsCollectionRef = collection(
                commentDoc.ref,
                'recomments',
            );
            const recommentsSnapshot = await getDocs(recommentsCollectionRef);
            totalCount += recommentsSnapshot.size;
        }

        return totalCount;
    } catch (error) {
        console.error('Error getting comments and recomments count:', error);
        throw new Error('댓글 및 대댓글 수를 가져오는 데 오류가 발생했습니다.');
    }
};

/**
 * 특정 상품의 '좋아요' 수를 가져옴
 * @param {string} productId - 상품의 ID
 * @returns {Promise<number>} - '좋아요' 수를 반환하는 Promise 객체
 */
export const getLikedCount = async (productId) => {
    try {
        const LikesCollectionRef = collection(
            db,
            'products',
            productId,
            'liked',
        );
        const likedSnapshot = await getDocs(LikesCollectionRef);
        let totalCount = likedSnapshot.size;

        return totalCount;
    } catch (error) {
        console.error('Error getting comments and recomments count:', error);
        throw new Error('종아요 수를 가져오는 데 오류가 발생했습니다.');
    }
};