"use client"
import { CourseCountContext } from '@/app/_context/CourseCountContext'
import { LayoutDashboard, UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Menu, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs'

function SideBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const MenuList = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard'
        },
        {
            name: 'Profile',
            icon: UserCircle,
            path: '/dashboard/profile'
        }
    ]

    const { totalCourse, setTotalCourse } = useContext(CourseCountContext);
    const path = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden fixed top-4 left-4 z-50" 
                onClick={toggleMenu}
            >
                {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-screen w-64 shadow-md p-5 bg-white
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:block
                z-40
            `}>
                <div className='flex gap-2 items-center justify-center relative'>
                    <Image 
                        src={'/logo.svg'} 
                        alt='logo' 
                        width={150} 
                        height={50} 
                        className="mx-auto"
                    />
                    <button 
                        className='md:hidden absolute right-0 top-1/2 -translate-y-1/2' 
                        onClick={toggleMenu}
                    >
                    </button>
                </div>

                <div className='mt-10'>
                    <Link href={'/create'} className="w-full">
                        <Button className="w-full" disabled={totalCourse >= 2}>
                            + Create New
                        </Button>
                    </Link>

                    <div className='mt-5'>
                        {MenuList.map((menu, index) => (
                            <Link href={menu.path} key={index} onClick={toggleMenu}>
                                <div 
                                    className={`flex gap-5 items-center p-3
                                    hover:bg-slate-200 rounded-lg cursor-pointer mt-3
                                    ${path == menu.path && 'bg-slate-200'}`}
                                >
                                    <menu.icon/>
                                    <h2>{menu.name}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='border p-3 bg-slate-100 rounded-lg
                absolute bottom-10 w-[85%]'>
                    <h2 className='text-lg mb-2'>
                        Available Credits : {(2 - totalCourse)}
                    </h2>
                    <Progress value={(totalCourse / 2) * 100} />
                    <h2 className='text-sm'>
                        {totalCourse} Out of 2 Credits Used
                    </h2>
                    <Link href={'/dashboard/upgrade'}>
                        <Button size="sm" className="w-full mt-2">
                            Upgrade
                        </Button>
                    </Link>
                    <div className="mt-2">
                        <Button size="sm" className="w-full p-3">
                            <UserButton/> Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden" 
                    onClick={toggleMenu}
                />
            )}
        </>
    )
}

export default SideBar;