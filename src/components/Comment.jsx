import React from 'react';
const Comment = () => {
    return (
        <form
            onSubmit={(e) => {
                console.log(e);
            }}>
            <input type='text' />
            <button type='submit'>확인</button>
        </form>
    );
};

export default Comment;
