"use client"

import { useUser} from '@auth0/nextjs-auth0/client';
import { loadBindings } from 'next/dist/build/swc';
import Image from 'next/image';
import Link from 'next/link';
import React, {FC, useEffect, useState} from 'react';
import { IoPersonAdd } from 'react-icons/io5';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "../../../assets/ryanairbnb.png";
import SignOutButton from './Auth0/SignOutButton';
import ClipLoader from "react-spinners/ClipLoader";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar: FC = () => {
  //Load User Profile Picture
  const { user, isLoading, error } = useUser();
  const [profilePicture, setProfilePicture] = useState<string>('');

  //Handle Sign Out from Auth0
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        window.location.href="/api/auth/logout";
    };

  useEffect(() => {
    if (user) {
      if (user.picture) {
        setProfilePicture(user.picture);
      }
    }
  }, [user]);

  
  return (
    <nav className="py-[20px] h-[90px] w-[100vw] bg-white flex items-center justify-center sticky top-0 border-b border-b-solid border-b-[#eee] z-50">
        <div className="w-[85%] flex justify-between items-center">
            <Link href="/">
          <Image src={Logo} alt="logo" className="h-full w-[133px] hover:cursor-pointer"/>
          </Link>
          <div className="mr-[10px] md:mr-[25px] lg:mr-16">
            {user ? (
              profilePicture ?
              <DropdownMenu>
                <DropdownMenuTrigger>
              <div className="px-4 py-2 border border-solid border-[#eee] rounded-full flex gap-4 flex-rows items-center justify-center transition duration-300 ease-in-out hover:shadow-lg hover:cursor-pointer">
                <RiMenu2Line />
                <Link href="/profile">
              <img src={profilePicture} alt="Profile" className="w-9 h-9 rounded-full" />
              </Link>
              {/* <SignOutButton /> */}
              </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <Link href="/profile">
    <DropdownMenuItem className="hover:cursor-pointer">
      <IoMdPerson className="text-[#436ad3] mr-[5px]" /> Profile</DropdownMenuItem>
    </Link>
    <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSignOut} disabled={isSigningOut || !user}>
    {isSigningOut ? 
        'Signing out...' 
        : <div className="flex items-center justify-center"><FaSignOutAlt className="mr-[5px]"/><div>Sign Out</div></div>}</DropdownMenuItem>
  </DropdownMenuContent>
              </DropdownMenu>
              : <div>{user.name}</div>
            ) : (
              isLoading ? <ClipLoader color="#436ad3" /> :
              <Link href="/api/auth/login">
              <div className="px-4 py-2 border border-solid border-[#eee] rounded-full flex gap-4 flex-rows items-center justify-center transition duration-300 ease-in-out hover:shadow-lg hover:cursor-pointer">
                <RiMenu2Line className="text-[1.2rem]" />
                <IoPersonAdd className="text-[1.8em] text-[#436ad3]"/>
              </div>
              </Link>
            )
            }
            
          </div>
        </div>
      </nav>
  )
}

export default Navbar;