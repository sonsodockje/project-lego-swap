import { useQuery } from '@tanstack/react-query';
import { productsFetch } from '../api/firebaseStore';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { useState } from 'react';

export default function ItemList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // 한 페이지당 보여줄 아이템 수

  const { data: productsList, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsFetch,
  });

  if (isLoading) {
    return <div className='loading loading-spinner loading-lg'></div>;
  }

  const totalPages = Math.ceil(productsList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productsList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      {isLoading && <div className='loading loading-spinner loading-lg'></div>}
      {!isLoading && productsList.length > 0 && (
        <>
          <div className='grid grid-cols-2 gap-4 w-full'>
            {currentItems.map((item) => (
              <Link to={`/detail/${item.id}`} key={item.id}>
                <Item item={item} />
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );

  function Item({ item }) {
    return (
      <div className='flex flex-col bg-base-100 shadow-sm'>
        <div className='h-3/12'>
          <img
            src={item.imgs[0].resized}
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


