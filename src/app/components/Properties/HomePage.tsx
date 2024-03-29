import { db } from '@/firebase/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import React, { FC, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  
import { Button } from '@/components/ui/button';
import { MdInsertEmoticon, MdOutlinePets } from "react-icons/md";
import { Calendar } from '@/components/ui/calendar';
import { IoAddOutline, IoTerminalSharp, IoSearchOutline } from "react-icons/io5";
import Link from 'next/link';
import LoadingSkeleton from '@/app/LoadingSkeleton';
import { Item } from '@radix-ui/react-navigation-menu';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useToast } from '@/components/ui/use-toast';

interface Booking {
    id: string;
    bookings: {
        startDate?: { seconds: number, nanoseconds: number };
        endDate?: { seconds: number, nanoseconds: number };
      userId?: string;
    };
  }

interface Property {
    title: string;
    host: string;
    date: string;
    price: number;
    image?: string;
    id: string;
    isPetFriendly?: boolean;
    bookings?: Booking[]; 
}
const HomePage: FC = () => {
    const router  = useRouter();
    const { user } = useUser();
    const { toast } = useToast();

    //State Management
    const [propertyList, setPropertyList] = useState<Property[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [checkInDate, setCheckInDate] = React.useState<Date | undefined>(undefined);
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    //Collection Reference
    const propertyRef = collection(db, "properties");

    //Fetch Properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
            setLoading(true);
            const data = await getDocs(propertyRef);
            const properties: Property[] = [];
    
            //Fetch Booking Datat for Each Property
            for(const item of data.docs) {
                const propertyData = item.data();
                const propertyId = item.id;
                const bookingsRef = collection(db, 'properties', propertyId, 'bookings');
                const bookingData = await getDocs(bookingsRef);
                const bookings: Booking[] = bookingData.docs.map((item) => {
                    const booking = { ...item.data(), id: item.id } as Booking;
                    return booking;
                });
                properties.push({
                    id: propertyId,
                    title: propertyData.title,
                    host: propertyData.host,
                    image: propertyData.image,
                    date: propertyData.date,
                    price: propertyData.price,
                    isPetFriendly: propertyData.isPetFriendly,
                    bookings: bookings
                });
                console.log("Bookings:", bookings);
            }
            
            setPropertyList(properties);
            } catch(err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, []);
    
    //Stringify Check In/Out Dates
    let checkInDateString = '';
    if(checkInDate) {
        checkInDateString = checkInDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    }
    let checkOutDateString = '';
    if(checkOutDate) {
        checkOutDateString = checkOutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    }

    //Filter Properties
    const filteredProperties = () => {
        if (!checkInDate || !checkOutDate) {
            return propertyList;
        }
        const filteredProperties = propertyList.filter((item) => {
            if (!item.bookings || item.bookings.length === 0) {
                return true;
            }
            const isAvailable = item.bookings.every((item) => {
                const bookingStart = item.bookings?.startDate ? new Date(item.bookings.startDate.seconds * 1000) : undefined;
                const bookingEnd = item.bookings?.endDate ? new Date(item.bookings.endDate.seconds * 1000) : undefined;
                return !bookingStart || !bookingEnd || (checkInDate >= bookingEnd || checkOutDate <= bookingStart);
            })
            return isAvailable;
        })
        return filteredProperties;
    }
    const handleFilterButtonClick = () => {
        const filteredProps = filteredProperties();
        setPropertyList(filteredProps);
    };

    //Authorize Add-To-Properties Page
    const handleNavigation = () => {
        if (user) {
          router.push('/add-a-property');
        } else {
            toast({
                title: "Please Sign In",
                description: 'Sign in to add a property to Ryan AirBnb',
              })
        }
      };

  return (
    <div className="w-full flex flex-col items-center justify-center">
        <div className="my-8 flex items-center justify-center px-4 sm:px-6 py-4 border border-solid border-[#eee] rounded-l-full shadow-lg focus:outline-none focus:border-blue-500 rounded-r-full">
        <div className="mr-[10px]">
            <div className="flex items-center justify-center gap-2">
            <div onClick={handleNavigation} className="bg-[#436ad3] rounded-full hidden h-[50px] w-[50px] sm:flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#6180df] hover:rotate-90 hover:cursor-pointer">
            <IoAddOutline className="text-[#fff] text-[2rem]" />
            </div>
            <div className="text-[0.9rem] font-semibold hidden md:block">Add a Property</div>
            </div>
        </div>
        <div  className="border-l border-l-solid border-l-[#eee] h-full pl-[12.5px] hidden lg:block">
        <div className="w-[300px] ">
        <input type="search" onChange={(e) => setSearchTerm(e.target.value)} placeholder={`Search our properties...`} className="block w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 rounded-r-full" />
        </div>
        </div>
        <NavigationMenu >
          <NavigationMenuList>
        <NavigationMenuItem  className="border-l border-l-solid border-l-[#eee] h-full ">
            <NavigationMenuTrigger>{checkInDate ? checkInDateString :"Check In Date"}</NavigationMenuTrigger>
               <NavigationMenuContent className="w-full">
                   <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    className="rounded-md border"
                    />
            </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem  className="border-l border-l-solid border-l-[#eee] h-full">
           <NavigationMenuTrigger>{checkOutDate ? checkOutDateString :"Check Out Date"}</NavigationMenuTrigger>
               <NavigationMenuContent className="w-full h-[300px]">
                   <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    className="rounded-md border"
                    />
                </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
    <div onClick={handleFilterButtonClick} className="bg-[#436ad3] rounded-full h-[35px] w-[35px] sm:h-[50px] sm:w-[50px] flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#6180df] hover:cursor-pointer"><IoSearchOutline className="text-[1.5rem] sm:text-[1.8rem] text-white"/></div>
    </div>
    <div className="flex flex-col items-center justify-center">
        {loading? <LoadingSkeleton /> : <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {propertyList.filter((val) => {
            if (searchTerm == '') {
                return val;
            } else if (
                val.title.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return val;
            }
        }).map((item) => (
            <Link href={{
                pathname: "/properties",
                query: {id: item.id}
            }} key={item.id}>
            <Card key={item.id} className="hover:cursor-pointer">
                <CardHeader>
                {item.image ? 
                <img src={item.image} alt="" className="w-[300px] h-[300px] rounded-lg object-cover" /> 
                : null}
                <CardTitle className="text-[1.3rem]">{item.title}</CardTitle>
                <CardDescription>
                <p>Hosted by {item.host}</p>
                <p>{item.date}</p>
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="underline">£{item.price}<span className="font-light ml-[3px]">per night</span></div>
                </CardContent>
                <CardFooter className="flex justify-between">
                <Link href={{
                    pathname: "/properties",
                    query: {id: item.id}
                }}>
                    <Button>View Property</Button>
                    </Link>
                    {item.isPetFriendly && <div className="flex items-center justify-center gap-1 text-green-500"><MdOutlinePets/><div className="text-[0.9rem]">Pet Friendly!</div></div> }
                </CardFooter>
            </Card>
            </Link>
        ))}
    </div>}
    
    </div>
    </div>
  )
}

export default HomePage;