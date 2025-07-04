import React from 'react';

const FormFilter = ({ type, setFormData }) => {
    const list = [
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
    ];
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
};

export default FormFilter;
