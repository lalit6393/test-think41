'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link';

const Department = () => {
    const params = useParams();
    const id = params?.id as string;
    const [item, setItem] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const itemAPI = async () => {
        setLoading(true);

        const res = await fetch(`http://localhost:3000/api/departments/${id}`);
        const data = await res.json();

        setItem(data[0])
        setLoading(false);
    }

    useEffect(() => {
        if (!id) return;
        itemAPI();
    }, [id])

    if (loading) return <p className='bg-slate-700 text-slate-50 p-4'>Loading</p>

    return (
        <div className='bg-slate-900 text-slate-50 rounded-xl p-4 cursor-pointer'>
            {
                item ?
                    <div className='flex flex-col gap-4'>
                        <p>{item.name}</p>
                        <Link href={`/departments/${id}/products`} className='text-blue-400 bg-slate-100 rounded-lg px-4 py-2'>Products</Link>
                    </div> :
                    <p>Item not found</p>
            }
        </div>
    )
}

export default Department
