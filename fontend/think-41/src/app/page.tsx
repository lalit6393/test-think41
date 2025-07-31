import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex flex-col gap-4 p-4">
      <p>Welcome home</p>
      <div className="flex gap-4">
        <Link href={'/products'} className='text-blue-400 bg-slate-100 rounded-lg px-4 py-2'>Products</Link>
        <Link href={'/departments'} className='text-blue-400 bg-slate-100 rounded-lg px-4 py-2'>Departments</Link>
      </div>
    </div>
  );
}
