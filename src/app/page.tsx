"use client"
import Link from "next/link";
import HomePage from "./components/Properties/HomePage";
import { useRouter } from "next/router";
import Properties from "./components/Properties/Properties";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { Button } from "@/components/ui/button";
import { MdOutlinePets } from "react-icons/md";
import LoadingSkeleton from "./LoadingSkeleton";

interface Property {
  title: string;
  host: string;
  date: string;
  price: number;
  image?: string;
  id: string;
  isPetFriendly?: boolean;
}
export default function Home() {
  return (
    <main>
      <div className="w-full border-t border-t-solid border-t-[#eee]">
      </div>
      <HomePage />
    </main>
  );
}
