import React, { useState, useRef } from 'react';
import { productUpload } from '../api/firebaseStore'; // productUpload 함수 경로
import { uploadProductImage } from '../api/firebaseStorage'; // uploadProductImage 함수 경로
import { useNavigate } from 'react-router';

const MAX_IMAGES = 4;

const resizeImage = async (file) => {
    const MAX_DIMENSION = 500;

    // 1. 파일을 Data URL로 읽는 비동기 작업
    const readDataURL = () => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error); // 에러 처리 추가
            reader.readAsDataURL(file);
        });
    };

    // 2. Data URL에서 이미지를 로드하는 비동기 작업
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error); // 에러 처리 추가
            img.src = src;
        });
    };

    try {
        const dataURL = await readDataURL(); // 파일 읽기 완료까지 대기
        const img = await loadImage(dataURL); // 이미지 로드 완료까지 대기

        let width = img.width;
        let height = img.height;

        // 이미지 크기 조절 로직 (기존과 동일)
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
                height = Math.round((height * MAX_DIMENSION) / width);
                width = MAX_DIMENSION;
            } else {
                width = Math.round((width * MAX_DIMENSION) / height);
                height = MAX_DIMENSION;
            }
        }

        // Canvas를 이용한 이미지 그리기 및 Blob 추출
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create Blob from canvas.'));
                }
            }, file.type);
        });
    } catch (error) {
        console.error('Image resizing failed:', error);
        throw error; // 에러를 다시 던져서 호출자에게 알림
    }
};

const handleImageSelection = async (
    e,
    selectedFiles, // 현재 선택된 파일 상태 (배열)
    setPreviewImgUrls, // 미리보기 URL 상태 업데이트 함수
    setSelectedFiles, // 선택된 파일(원본 + 리사이즈) 상태 업데이트 함수
) => {
    const newFilesFromInput = Array.from(e.target.files);
    const newImageFiles = newFilesFromInput.filter((file) =>
        file.type.startsWith('image/'),
    );

    // 1. 최대 이미지 개수 초과 확인
    const MAX_IMAGES = 10; // MAX_IMAGES는 외부에서 정의된 상수라고 가정합니다.
    if (selectedFiles.length + newImageFiles.length > MAX_IMAGES) {
        alert(
            `사진은 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다. 이미지가 너무 많습니다.`,
        );
        e.target.value = ''; // 파일 입력 필드 초기화
        return;
    }

    // 2. 이미지 리사이즈 및 File 객체 생성 (비동기 병렬 처리)
    const processedFilesPromises = newImageFiles.map(async (file) => {
        try {
            const resizedBlob = await resizeImage(file);
            // 원본 파일의 이름과 타입을 사용하여 새로운 File 객체 생성
            return new File([resizedBlob], file.name, { type: file.type });
        } catch (error) {
            console.error(`Error resizing image ${file.name}:`, error);
            // 에러 발생 시 해당 파일은 건너뛰거나, null/undefined 반환하여 이후 필터링
            return null;
        }
    });

    const processedFiles = (await Promise.all(processedFilesPromises)).filter(
        Boolean,
    ); // null 값 필터링

    // 3. 미리보기 URL 생성 및 상태 업데이트
    const newPreviewUrls = newImageFiles.map((file) =>
        URL.createObjectURL(file),
    );
    setPreviewImgUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

    // 4. 선택된 파일 상태 업데이트 (원본 + 리사이즈된 파일 매핑)
    const filesToStore = newImageFiles.map((originalFile, index) => ({
        original: originalFile,
        resized: processedFiles[index], // 리사이즈 및 File 객체로 변환된 파일
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesToStore]);

    // 5. 파일 입력 필드 초기화
    e.target.value = '';
};

const handleRemoveImage = (
    indexToRemove,
    previewImgUrls,
    setPreviewImgUrls,
    setSelectedFiles,
) => {
    URL.revokeObjectURL(previewImgUrls[indexToRemove]);
    setPreviewImgUrls((prevUrls) =>
        prevUrls.filter((_, idx) => idx !== indexToRemove),
    );
    setSelectedFiles((prevFiles) =>
        prevFiles.filter((_, idx) => idx !== indexToRemove),
    );
    // 만약 수정 중인 게시물에 이미지가 있는 경우라면 추가적인 로직이 필요합니다.
};

export default function WriteForm({ currentUser }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [previewImgUrls, setPreviewImgUrls] = useState([]); // 미리보기용 URL 상태
    const [selectedFiles, setSelectedFiles] = useState([]); // ㄹㅇ 사이즈  파일 상태

    const [formData, setFormData] = useState({
        title: '',
        user: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        imgs: [], // Firebase Storage 다운로드 URL이 저장될 배열
        body: '',
        uid: currentUser.uid,
        timestamp: new Date(),
        price: 0,
        want: '',
        sell: '',
        opened: true,
        soldOut: false,
    });

    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) {
            alert('현재 작업 처리 중입니다. 잠시만 기다려주세요.');
            return;
        }
        if (selectedFiles.length === 0) {
            alert('상품 이미지를 1개 이상 선택해야 합니다.');
            return;
        }
        setIsLoading(true);
        try {
            const uploadedUrls = await Promise.all(
                selectedFiles.map(async (filePair) => {
                    const originalURL = await uploadProductImage(
                        filePair.original,
                        'products/imgs/original/',
                    );
                    const resizedURL = await uploadProductImage(
                        filePair.resized,
                        'products/imgs/resized/',
                    );
                    return { original: originalURL, resized: resizedURL };
                }),
            );
            const finalFormData = {
                ...formData,
                imgs: uploadedUrls,
            };
            console.log('최종 폼 데이터:', finalFormData);
            await productUpload(finalFormData, setIsLoading, navigate);
        } catch (error) {
            console.error('상품 등록 중 오류 발생:', error);
            alert('상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form className='w-full relative' onSubmit={handleSubmit}>
                <section>
                    <input
                        type='text'
                        className='input validator w-full'
                        required
                        minLength='1'
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                title: e.target.value,
                            }));
                        }}
                        value={formData.title}
                    />
                    <p className='validator-hint'>1자 이상</p>
                </section>

                <section className='flex w-full gap-1 mb-4'>
                    {previewImgUrls.length > 0 ? (
                        previewImgUrls.map((url, index) => (
                            <div key={index} className='relative'>
                                <img
                                    src={url}
                                    alt={`미리보기 이미지 ${index + 1}`}
                                    className='w-[200px] aspect-square ring-indigo-800 object-cover rounded-md'
                                />
                                <button
                                    onClick={() =>
                                        handleRemoveImage(
                                            index,
                                            previewImgUrls,
                                            setPreviewImgUrls,
                                            setSelectedFiles,
                                        )
                                    }
                                    className='absolute top-0.5 right-0.5 bg-black bg-opacity-60 text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-sm'
                                    type='button' // 폼 제출 방지
                                >
                                    X
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className='w-full h-[200px] mb-4 bg-gray-100 rounded-2xl text-sm text-center flex items-center justify-center'>
                            선택된 이미지가 없습니다.
                        </div>
                    )}
                </section>

                <section>
                    <input
                        type='file'
                        className='file-input file-input-md w-full mb-7 hidden'
                        accept='image/*'
                        multiple
                        onChange={(e) =>
                            handleImageSelection(
                                e,
                                selectedFiles,
                                setPreviewImgUrls,
                                setSelectedFiles,
                            )
                        }
                        ref={fileInputRef}
                    />
                    <button
                        className='btn w-full mb-7'
                        onClick={() => {
                            fileInputRef.current.click();
                        }}
                        type='button' // 폼 제출을 방지하기 위해 type을 button으로 지정
                        disabled={isLoading} // 로딩 중일 때 이미지 선택 버튼 비활성화
                    >
                        사진 선택
                    </button>
                </section>

                <section>
                    <textarea
                        className='textarea validator w-full resize-none'
                        placeholder='설명을 작성해주세요.'
                        minLength='2'
                        required
                        maxLength='500'
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                body: e.target.value,
                            }));
                        }}
                        value={formData.body} // controlled component
                    ></textarea>
                    <p className='validator-hint'>2자 이상</p>
                </section>

                <div className='flex'>
                    <input
                        type='number'
                        className='input validator w-full'
                        required
                        placeholder='가격'
                        min='0'
                        max='6000000'
                        title='Must be between 1 to 6,000,000'
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                price: parseInt(e.target.value) || 0,
                            }));
                        }}
                        // controlled component
                    />
                    <p className='rounded-sm bg-gray-100 p-2 px-4 ml-1'>원</p>
                </div>
                <p className='validator-hint '>상품 가격을 입력해주세요.</p>
                <section>
                    <p>판매팀</p>
                    <FormFilter
                        type='sell'
                        list={[
                            '페라리',
                            '맥라렌',
                            '메르세데스',
                            '레드불',
                            '윌리암스',
                            '알파로메오',
                            '레드불레이싱',
                            '하스',
                            '아스톤마틴',
                            '아카데미',
                            '기타',
                        ]}
                        setFormData={setFormData}
                    />
                    <p>희망팀</p>
                    <FormFilter
                        type='want'
                        list={[
                            '상관없음',
                            '맥라렌',
                            '메르세데스',
                            '레드불',
                            '윌리암스',
                            '알파로메오',
                            '레드불레이싱',
                            '하스',
                            '아스톤마틴',
                            '아카데미',
                            '기타',
                        ]}
                        setFormData={setFormData}
                    />
                </section>

                <IsOpen formData={formData} setFormData={setFormData} />

                <div className='flex gap-1 justify-end'>
                    <button className='btn' type='reset'>
                        취소
                    </button>
                    <button
                        className='btn'
                        type='submit'
                        disabled={isLoading} // 로딩 중일 때 제출 버튼 비활성화
                    >
                        {isLoading ? '저장 중...' : '저장'}
                    </button>
                </div>
            </form>
        </>
    );
}

function FormFilter({ type, list, setFormData }) {
    return (
        <>
            <select
                className='select validator w-full'
                required
                onChange={(e) => {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        [type]: e.target.value,
                    }));
                }}>
                <option disabled selected value=''>
                    선택하시게나
                </option>
                {list.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <p className='validator-hint'>필수 선택 항목입니다.</p>
        </>
    );
}

function IsOpen({ formData, setFormData }) {
    return (
        <>
            <div className='flex gap-2 validator w-full mb-14'>
                <div className='flex gap-1'>
                    <label htmlFor='opened_true'>개봉</label>
                    <input
                        type='radio'
                        name='opened'
                        id='opened_true'
                        value='true'
                        className='radio radio-md'
                        required
                        checked={formData.opened === true}
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                opened: e.target.value === 'true',
                            }));
                        }}
                    />
                </div>

                <div className='flex gap-1'>
                    <label htmlFor='opened_false'>미개봉</label>
                    <input
                        type='radio'
                        name='opened'
                        id='opened_false'
                        value='false'
                        className='radio radio-md'
                        required
                        checked={formData.opened === false}
                        onChange={(e) => {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                opened: e.target.value === 'true',
                            }));
                        }}
                    />
                </div>
            </div>
            <p className='validator-hint'>개봉 여부를 선택해주세요.</p>
        </>
    );
}
