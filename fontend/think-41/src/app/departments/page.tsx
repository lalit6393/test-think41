'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Department = () => {

    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const departmentsAPI = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/departments');
        const data = await res.json();
        setDepartments(data);
        setLoading(false);
    }

    useEffect(() => {
        departmentsAPI();
    }, [])


    if (loading) return <p className='bg-slate-700 text-slate-50 p-4'>Loading...</p>

    return (
        <div className='text-slate-50 grid grid-cols-1 lg:grid-cols-2 bg-slate-200 gap-4 p-4'>
            {
                departments.map((department) => <Link href={`departments/${department.id}`} className='bg-slate-900 text-slate-50 rounded-xl p-4 cursor-pointer' key={department.id}>{department.name}</Link>)
            }
        </div>
    )
}

export default Department
