'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const Item = () => {
    const params = useParams();
    const id = params?.id as string;
    const [item, setItem] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const itemAPI = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        
        setItem(data[0])
        setLoading(false);
    }

    useEffect(() => {
        if (!id) return;
        console.log(id);
        itemAPI();
    }, [id])

    if (loading) return <p className='bg-slate-700 text-slate-50 p-4'>Loading</p>

    return (
        <div className='bg-slate-900 text-slate-50 rounded-xl p-4 cursor-pointer'>
            {
                item ?
                    <>
                        <h2>{item.name}</h2>
                        <p>Price: {item.retail_price}</p>
                        <p>Brand: {item.brand}</p>
                        <p>Category: {item.category}</p>
                        <p>Cost: {item.cost}</p>
                        <p>Department: {item.department}</p>
                    </> :
                    <p>Item not found</p>
            }
        </div>
    )
}

export default Item
