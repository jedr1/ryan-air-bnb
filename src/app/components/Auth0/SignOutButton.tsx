import { useUser } from '@auth0/nextjs-auth0/client'
import React, { FC, useEffect, useState } from 'react';
import { FaSignOutAlt } from "react-icons/fa";

const SignOutButton: FC = () => {
    const {user, error, isLoading } = useUser();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        window.location.href="/api/auth/logout";
    };

    useEffect(() => {
        if(!isLoading && error) {
            console.error('Authentication error:', error);
        }
    }, [isLoading, error]);
  return (
    <button onClick={handleSignOut} disabled={isSigningOut || !user}>
      <div className="underline text-[0.8rem] font-bold text-[#333] transition duration-500 ease hover:text-[#cf6100]">  
        {isSigningOut ? 
        'Signing out...' 
        : 
        <div className="flex items-center justify-center gap-1">
            <FaSignOutAlt className="text-[1rem] rotate-180"/>
            <div>SIGN OUT</div>
        </div>
        }
      </div>
    </button>
  )
}

export default SignOutButton