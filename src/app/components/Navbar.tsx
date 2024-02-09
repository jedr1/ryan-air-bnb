"use client"

import { useUser} from '@auth0/nextjs-auth0/client';
import { loadBindings } from 'next/dist/build/swc';
import Image from 'next/image';
import Link from 'next/link';
import React, {FC, useEffect, useState} from 'react';
import { IoPersonAdd } from 'react-icons/io5';
import Logo from "../../../assets/ryanairbnb.png";
import SignOutButton from './Auth0/SignOutButton';

const Navbar: FC = () => {
  //Load User Profile Picture
  const { user, isLoading } = useUser();
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    if (user) {
      if (user.picture) {
        setProfilePicture(user.picture);
      }
    }
  }, [user]);

  
  return (
    <nav className="py-[20px] h-[90px] w-[100vw] bg-white flex items-center justify-center">
        <div className="w-[85%] flex justify-between items-center">
            <Link href="/">
          <Image src={Logo} alt="logo" className="h-full w-[133px] hover:cursor-pointer"/>
          </Link>
          <div className="mr-16">
            {user ? (
              profilePicture ?
              <div className="flex gap-4 flex-rows items-center justify-center">
              <img src={profilePicture} alt="Profile" className="w-12 h-12 rounded-full transition duration-300 ease hover:translate-y-[-5px] hover:cursor-pointer" />
              <SignOutButton />
              </div>
              : <div>{user.name}</div>
            ) : (
              isLoading ? <div>loading...</div> :
              <Link href="/api/auth/login">
                <IoPersonAdd className="text-[2em] text-[#436ad3] transition duration-300 ease hover:cursor-pointer hover:translate-y-[-5px]"/>
              </Link>
            )
            }
            
          </div>
        </div>
      </nav>
  )
}

export default Navbar;