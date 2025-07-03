import { useEffect, useState } from 'react';
import { productsFetch } from '../firebaseStore';
import { Link } from 'react-router';
import Pagination from './Pagination';

export default function ItemList() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataList = async () => {
      try {
        const products = await productsFetch();
        setProductsList(products);
        setLoading(false);
        console.log('Fetched products:', products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    };
    dataList();
  }, []);

  if (loading) {
    return <div className='loading loading-spinner loading-lg'></div>;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {loading && <div className='loading loading-spinner loading-lg'></div>}
      {!loading && productsList.length > 0 && (
        <>
          <div className='grid grid-cols-2 gap-4 w-full'>
            {productsList.map((item) => (
              <Link to={`/detail/${item.id}`} key={item.id}>
                <Item item={item} />
              </Link>
            ))}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );

  function Item({ item }) {
    return (
      <div className='flex flex-col bg-base-100 shadow-sm'>
        <div className='h-3/12'>
          <img
            src={item.imgs[0]}
            loading='lazy'
            className='min-w-full h-[200px] object-cover object-center rounded-t-lg' /* ⭐️ `min-h` 제거, `w-full h-full` 적용 */
          />
        </div>

        <div className='flex flex-col p-2'>
          <h2 className='text-xl'>{item.title}</h2>
          <div className='flex'>
            <p>{item.sell}</p>
            <p>{item.want}</p>
          </div>
          <p className='text-lg font-bold'>${item.price}</p>
          <p>
            {item.opened === 0 ? (
              <span className='text-red-500'>개봉</span>
            ) : (
              <span className='text-green-500'>미개봉</span>
            )}
          </p>
          <div className='flex justify-end'>
            <button className='btn btn-primary btn-sm'>찜</button>
          </div>
        </div>
      </div>
    );
  }
}
