"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-config';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaHouseCircleCheck } from "react-icons/fa6";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MdOutlinePets } from 'react-icons/md';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Property {
    title?: string,
    price?: number,
    id?: string,
    image?: string,
    host?: string,
    date?: string,
    isPetFriendly?: boolean,
}
export default function Page() {
    //State Management
    const [property, setProperty] = useState<Property | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    //Get Property ID from URL
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    
    //Fetch Property from Firebase
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const propertyRef = doc(collection(db, 'properties'), id as string);
                const prop = await getDoc(propertyRef);
                if (prop.exists()) {
                    setProperty(prop.data() as Property);
                } else {
                    console.error('Property not found')
                }
            } catch(err) {
                console.error('Error fetching property:', err);
            }
        };

        if(id) {
            fetchProperty();
        }
        
    }, []);

    const { toast } = useToast();
    const { user } = useUser();
    //Handle Booking
    const handleBooking =  async () => {
        try {
            //Get userID
                if (!user) {
                    console.log('User is not authenticated');
                    return;
                }
                const userId = user.sub;

            const propertyRef = doc(collection(db, 'properties'), id as string);
            const bookingRef = collection(propertyRef, 'bookings');
            await addDoc(bookingRef, {
                bookings: {
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId
                }
            });
            toast({
                title: "Your Booking was Successful!",
                description: `${startDate} until ${endDate}`,
              })
            console.log('Booking successfully added!')
        } catch(err) {
            console.log('Error booking property:', err);
        }
    }
  return (
    <div className="pb-[50px] w-full flex flex-col justify-center items-center border-t border-t-solid border-t-[#eee]">
        {property ? 
            <div className="md:w-[70%] w-full flex items-center justify-center flex-col">
                <div>
                    <h1 className="font-medium text-[1.8rem] py-[15px]">{property.title}</h1>
                    <div className="flex gap-[15px]">
                    <img src={property.image} alt="" className="w-[90vw] sm:w-[80vw] lg:w-[40vw] md:w-[50vw] sm:h-[400px] object-cover rounded-l-[20px] rounded-r-[20px] md:rounded-r-[0px]"/>
                    <div className="flex flex-col gap-[20px]">
                    <img src={property.image} alt="" className="w-[25vw] h-[190px] object-cover rounded-tr-[20px] hidden md:block"/>
                    <img src={property.image} alt="" className="w-[25vw] h-[190px] object-cover rounded-br-[20px] hidden md:flex"/>
                    </div>
                    </div>
                </div>
                <div className="w-[90vw] sm:w-[80vw] md:w-auto flex flex-col items-start justify-start gap-[0px] md:flex-row md:gap-[40px]">
                <div className='w-full md:w-auto'>
                <div className="w-full md:w-[40vw] flex flex-col">
                <div className="pb-[25px]">
                <h1 className="font-medium text-[1.2rem] pt-[15px]">{property.title}</h1>
                <p className="text-[#333] text-[0.9rem]">£{property.price} a night</p>
                </div>
                <div className="w-full md:w-auto flex gap-[25px] py-[20px] items-center border-t border-t-solid border-t-[#eee]">
                    <FaHouseCircleCheck className="text-[#436ad3] text-[2rem]" />
                    <div>
                <div className="text-[1.1rem] font-medium">Hosted by {property.host}</div>
                <p className="text-[#333] text-[0.9rem]">Verified Host</p>
                </div>
                </div>
                {property.isPetFriendly ? <div className="flex gap-[25px] py-[25px] items-center border-t border-t-solid border-t-[#eee]">
                <MdOutlinePets className="text-green-500 text-[2rem]" />
                <div>
            <div className="text-[1.1rem] font-medium">Pet Friendly</div>
            <p className="text-[#333] text-[0.9rem]">Bring your pets along for the stay</p>
            </div>
                </div> : null}
                </div>
                </div>
                <div>
                    <Card className="max-w-[400px] shadow-lg mt-[25px]">
                        <CardHeader>
                            <CardTitle className="text-[1.5rem] font-medium pb-[15px]">£{property.price}<span className="font-light text-[1.2rem]"> a night</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-[15px]">
                                <div className=" flex flex-col">
                                <div className="text-[0.9rem] font-medium">CHECK IN</div>
                            <Popover>
                              <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                              )}
                            >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                       {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                       </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                        </PopoverContent>
                        </Popover>
                        </div>
                        <div className=" flex flex-col">
                                <div className="text-[0.9rem] font-medium">CHECK OUT</div>
                        <Popover>
                              <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                              )}
                            >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                       {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                       </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                        </PopoverContent>
                        </Popover>
                        </div>
                        </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleBooking}>Reserve</Button>
                        </CardFooter>
                    </Card>
                </div>
                </div>
            </div>
         : <div className='flex flex-col items-center justify-center h-[80vh] text-[#333] font-light w-full gap-[15px]'>
            <div className="text-[1.2rem]">Fetching property</div>
            <ClipLoader color="#436ad3"/>
            </div>}
    </div>
  )
}
