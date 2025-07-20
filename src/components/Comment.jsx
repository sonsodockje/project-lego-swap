const Comment = () => {
    return (
        <form
            onSubmit={(e) => {
                console.log(e);
            }}>
            <div className='p-5 btn btn-dash text-center m-auto flex mt-4'>
                댓글 기능은 아직 지원하지 않습니다.
            </div>
            <div className='flex align-middle justify-between items-center mt-4 gap-2'>
                <input type='text' className='input input-sm' />
                <button type='submit' className='btn btn-sm'>
                    확인
                </button>
            </div>
        </form>
    );
};

export default Comment;
