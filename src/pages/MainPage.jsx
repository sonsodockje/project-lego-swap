import React, { useState } from 'react';
import ItemList from '../components/ItemList';
import ItemFilterHeader from '../components/ItemFilterHeader';

export default function MainPage() {
    const [filter, setFiler] = useState('');

    const handleFilter = (e) => {
        setFiler(e.target.innerText);
    };

    return (
        <>
            <ItemFilterHeader handleFilter={handleFilter} />
            <ItemList filterData={filter} />
        </>
    );
}
