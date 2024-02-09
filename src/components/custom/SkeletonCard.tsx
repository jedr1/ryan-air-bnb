import React from 'react';
import {
    Card, 
    CardContent,
    CardHeader,
    CardFooter
} from "../ui/card";
import { Skeleton } from '../ui/skeleton';

export default function SkeletonCard() {
  return (
    <Card>
        <CardHeader>
                
                <Skeleton className="w-[300px] h-[300px] rounded-lg" /> 
                
                <Skeleton className="h-6 w-2/3" />
                
                <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-28" />
                </CardFooter>
            </Card>
  )
}
