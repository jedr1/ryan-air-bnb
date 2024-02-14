import React, { FC } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { MdOutlinePets } from 'react-icons/md';

interface Property {
    title?: string,
    price?: number,
    host?: string,
    date?: string,
    id?: string,
    image?: string,
    isPetFriendly?: boolean,
}

const PropertyItem:FC<{item: Property}> = ({ item }) => {
  return (
    <Card key={item.id}>
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
                <p className="underline">£{item.price}<span className="font-light ml-[3px]">per night</span></p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {item.isPetFriendly && <div className="flex items-center justify-center gap-1 text-green-500"><MdOutlinePets/><div className="text-[0.9rem]">Pet Friendly!</div></div> }
                </CardFooter>
            </Card>
  )
}

export default PropertyItem;