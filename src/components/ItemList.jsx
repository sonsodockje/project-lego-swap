import { Link } from 'react-router-dom';
import { MemoizedItem } from './Item';

export default function ItemList({ products }) {
    if (products.length === 0) {
        return <div>상품이 없습니다.</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-cols-1 gap-4 w-full'>
                {products.map((item) => (
                    <Link to={`/detail/${item.id}`} key={item.id}>
                        <MemoizedItem item={item} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
