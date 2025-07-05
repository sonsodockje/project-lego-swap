import React, { useRef, useState } from 'react';

// const MainFilterContext = createContext(null);

// export function useMainFilter() {
//   return useContext(MainFilterContext);
// }

// export function MainFilterContextProvider({ children }) {
//     const [filter, setFilter] = useState(null);

//     const value = {
//       filter,
//       setFilter
//     };

//     return (
//         <MainFilterContext.Provider value={value}>{children}</MainFilterContext.Provider>
//     );
// }

const ItemFilterHeader = ({ handleFilter }) => {
    const list = [
        '페라리',
        '맥라렌',
        '메르세데스',
        '레드불',
        '윌리암스',
        '자우버',
        '알비',
        '하스',
        '애마',
        '아카데미',
        '기타',
    ];

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const onDragStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX + scrollRef.current.scrollLeft);
    };

    const onDragEnd = () => {
        setIsDragging(false);
    };

    const onDragMove = (e) => {
        if (isDragging) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const newScrollLeft = startX - e.pageX;
            if (
                newScrollLeft >= 0 &&
                newScrollLeft <= scrollWidth - clientWidth
            ) {
                scrollRef.current.scrollLeft = newScrollLeft;
            }
        }
    };

    return (
        <div
            ref={scrollRef}
            className='flex items-center w-full overflow-x-auto mb-4 gap-2 no-scrollbar'
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onMouseMove={onDragMove}>
            <p
                className='btn btn-sm flex-shrink-0'
                onClick={(e) => {
                    handleFilter(e);
                }}>
                all
            </p>
            {list.map((item) => (
                <p
                    className='btn btn-sm flex-shrink-0'
                    key={item}
                    style={{ userSelect: 'none' }}
                    onClick={(e) => {
                        handleFilter(e);
                    }}>
                    {item}
                </p>
            ))}
        </div>
    );
};

export default ItemFilterHeader;
