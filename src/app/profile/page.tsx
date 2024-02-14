"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/firebase/firebase-config';
import { useUser } from '@auth0/nextjs-auth0/client';
import { collection, collectionGroup, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoTimeSharp } from 'react-icons/io5';
import ClipLoader from "react-spinners/ClipLoader";

interface Booking {
    propertyTitle?: string;
    host?: string;
    date?: string;
    price?: number;
    propertyImage?: string;
    propertyId?: string;
    id?: string;
    isPetFriendly?: boolean;
  bookings?: {
    startDate?: Timestamp;
    endDate?: Timestamp;
    userId?: string;
  };
}
const ProfilePage = () => {
  const { user, error, isLoading } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const propertiesRef = collection(db, "properties");

  
  useEffect(() => {
     //Fetch Bookings
  const fetchBookings = async () => {
    try {
      const data = await getDocs(propertiesRef);
      const allBookings: Booking[] = [];

      //iterate over all bookings
      for(const item of data.docs) {
        const propertyData = item.data();
        const propertyId = item.id;
        const propertyTitle = propertyData.title;
        const propertyImage = propertyData.image;
        const bookingsRef = collection(db, 'properties', propertyId, 'bookings');
        //Get Booking Data
        const bookingData = await getDocs(bookingsRef);
        const propertyBookings: Booking[] = bookingData.docs.map((item) => {
          const booking = { ...item.data(), id: item.id, propertyId: propertyId, propertyTitle: propertyTitle, propertyImage: propertyImage } as Booking;
          return booking;
    });
    allBookings.push(
      ...propertyBookings);
    }
    console.log("All:", allBookings);
  if (user) {
  const userId = user.sub;
  const userBookings = allBookings.filter((item) => item.bookings?.userId === userId);
  setBookings(userBookings);
  console.log("User Bookings:", userBookings);
  console.log("bookings:", bookings);
      }
      
  } catch(err) {
      console.error(err);
    }
  }
  console.log(bookings);
    fetchBookings()
  }, [user, isLoading, error]);

  if(isLoading) {
    return <div className="h-[80vh] w-full flex items-center justify-center"><ClipLoader color="#436ad3"/></div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  } 
  if(!user) {
    return <div>Please login to access this page</div>
  } 

  return (
    <div className='flex flex-col lg:flex-row justify-center gap-[50px] pt-[50px]'>
      <div className="flex flex-col gap-[0px] md:gap-[50px] lg:gap-[0px] md:flex-row lg:flex-col items-center justify-center lg:items-start lg:justify-start">
      <div className=" border border-solid border-[#eee] p-4 shadow-lg w-[350px] flex flex-col items-center justify-center rounded-[20px]">
      <Avatar>
      <AvatarImage src={user.picture!} />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center justify-center">
      <span className="text-[2rem] font-semibold">{user?.name?.split(" ")[0]}</span>
      <span className="text-[#436ad3] font-medium mt-[-10px]">Guest</span>
      </div>
      </div>
      <div className="px-6 py-6 mt-[40px] border border-solid border-[#eee] p-4 w-[350px] flex flex-col items-start justify-start gap-[25px] rounded-[20px]">
        <h1 className="text-[1.5rem] font-medium">{`${user?.name?.split(" ")[0]}'s information:`}</h1>
        <div>
        <div className="text-[#436ad3]">Email: <span className='text-black'>{user.email}</span></div>
      <p className="text-[#436ad3]">Current Bookings: <span className='text-black'>{bookings.length}</span></p>
      </div>
      </div>
      </div>
      <div className=" flex flex-col ml-[50px] lg:ml-[0px]">
        <h1 className="text-[2rem] font-semibold pb-[25px]">Your <span className="text-[#436ad3]">bookings:</span></h1>
        {bookings ? bookings.map(item => (
            <div key={item.id} className="w-auto xl:w-[800px] border-t border-t-solid border-t-[#eee]">
            <div className="py-[25px] flex">
      <div key={item.id} className="flex flex-col sm:flex-row gap-[25px]">
        
        <img className="w-[200px] h-[200px] object-cover rounded-[20px]" src={item.propertyImage} alt="" />
        <div>
        <h1 className="font-semibold text-[1.5rem]">{item.propertyTitle}</h1>
        <div className="flex gap-[25px] mt-[20px]">
        <div>
          <p className="font-medium">Check In Date:</p>
        <p>{item?.bookings?.startDate?.seconds && new Date(item.bookings.startDate.seconds * 1000).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium">Check Out Date:</p>
        <p>{item?.bookings?.endDate?.seconds && new Date(item.bookings.endDate.seconds * 1000).toLocaleDateString()}</p>
      </div>
      </div>
      <Link href={{
                    pathname: "/properties",
                    query: {id: item.propertyId}
                }}>
      <Button className="mt-[25px]">View Property</Button>
      </Link>
      </div>
      </div>
      </div>
      </div>
    )) : 
    <div className="w-auto xl:w-[800px] border-t border-t-solid border-t-[#eee]">
        <div className="py-[25px] text-[1.5rem] font-medium">
          No bookings yet. Browse our properties <Link href="/"><Button>here</Button></Link>
        </div>
    </div>          
    }
          
  </div>
    </div>
  )
}
export default ProfilePage;