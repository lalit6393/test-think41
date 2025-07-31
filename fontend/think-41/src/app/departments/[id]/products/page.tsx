'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Products = () => {

    const params = useParams();
    const id = params?.id as string;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const productsAPI = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/departments/${id}/products`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!id) return;
        productsAPI();
    }, [])


    if (loading) return <p className='bg-slate-700 text-slate-50 p-4'>Loading</p>
    return (
        <div className=''>
            <h1 className='text-slate-100 text-2xl p-4 sticky top-0 bg-black'>Product list</h1>
            <div className='text-slate-50 grid grid-cols-1 lg:grid-cols-2 bg-slate-200 gap-4 p-4'>
                {
                    products.map((item) => (
                        <div key={item.id} className='bg-slate-700 text-slate-50 rounded-xl p-4 cursor-pointer'>
                            <h2>{item.name}</h2>
                            <p>Price: {item.retail_price}</p>
                            <p>Brand: {item.brand}</p>
                            <p>Category: {item.category}</p>
                            <p>Cost: {item.cost}</p>
                            <p>Department: {item.department}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Products
