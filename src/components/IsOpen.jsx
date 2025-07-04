import React from 'react';

const IsOpen = ({ formData, setFormData }) => {
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
};

export default IsOpen;
