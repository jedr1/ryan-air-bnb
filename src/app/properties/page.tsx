"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-config';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Property {
    title?: string,
    price?: number,
    id?: string,
    image?: string,
    host?: string,
    date?: string,
    isPetFriendly?: boolean,
}
export default function page() {
    //State Management
    const [property, setProperty] = useState<Property | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
    //Handle Booking
    const handleBooking =  async () => {
        try {
            const propertyRef = doc(collection(db, 'properties'), id as string);
            const bookingRef = collection(propertyRef, 'bookings');
            await addDoc(bookingRef, {
                bookings: {
                    startDate: startDate,
                    endDate: endDate
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
    <div>
        {property ? 
            <div>
                <img src={property.image} alt="" className="w-[400px] h-[200px] object-cover" />
                <h1>{property.title}</h1>
                <div>{property.host}</div>
                <div>{property.date}</div>
                <div>{property.price}</div>
                <input type="date" placeholder="Check In Date" onChange={(e) => setStartDate(new Date((e.target.value)))} />
                <input type="date" placeholder="Check Out Date" onChange={(e) => setEndDate(new Date((e.target.value)))} />
                <Button onClick={handleBooking}>Reserve Property</Button>
            </div>
         : <div>no property</div>}
    </div>
  )
}
