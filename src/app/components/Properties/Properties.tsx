import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { db, storage } from '@/firebase/firebase-config'
import { addDoc, collection, getDocs, SnapshotMetadata } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import React, { FC, useState, useEffect } from 'react';
import { HiOutlineXMark } from "react-icons/hi2";
import { TiTick } from "react-icons/ti";
import { v4 } from 'uuid';
import PropertyItem from './PropertyItem';
import ClipLoader from "react-spinners/ClipLoader";

interface Property {
    title?: string,
    price?: number,
    host?: string,
    date?: string,
    id?: string,
    image?: string,
    isPetFriendly?: boolean,
}
const Properties: FC = () => {
    //State Management
    const [propertyList, setPropertyList] = useState<Property[]>([]);
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [imageURL, setImageURL] = useState<string>('');
    const [propTitle, setPropTitle] = useState<string>('');
    const [propHost, setPropHost] = useState<string>('');
    const [propDate, setPropDate] = useState<string>('');
    const [propPrice, setPropPrice] = useState<number>(0);
    const [isPetFriendly, setIsPetFriendly] = useState<boolean>(false);
    const [startDate, setStartDate] = useState();

    //Firebase Collection Reference
    const propertiesRef = collection(db, "properties");

    //Upload Image to Firebase
    const handleImageUpload = async () => {
        setIsUploading(true);
        if(!imageUpload) {
            setIsUploading(false);
            return;
        };
        const imageFolderRef = ref(storage, `properties/${imageUpload.name + v4()}`);
        try {
            await uploadBytes(imageFolderRef, imageUpload);
            const downloadURL = await getDownloadURL(imageFolderRef);
            setImageURL(downloadURL); 
        } catch (err) {
            console.error(err);
            setIsUploading(false);
        } finally {
            setIsUploading(false);
            setUploadComplete(true);
        }
    }

    //Handle Submit
    const handleSubmit = async () => {
        try {
            await addDoc(propertiesRef, {
                title: propTitle,
                host: propHost,
                date: propDate,
                price: propPrice,
                image: imageURL,
                isPetFriendly: isPetFriendly,
            })
            fetchProperties();
            setImageURL("");
        } catch(err) {
            console.error(err);
        } finally {
            // Clear all input fields and reset state
            setPropTitle('');
            setPropHost('');
            setPropDate('');
            setPropPrice(0);
            setIsPetFriendly(false);
            setImageUpload(null);
            setUploadComplete(false);
            setImageURL('');
        }
    } 
 
    //Fetch Properties
    const fetchProperties = async () => {
        try {
        const data = await getDocs(propertiesRef);
        const properties: Property[] = data.docs.map((item) => ({ ...item.data(), id: item.id} as Property));
        setPropertyList(properties);
        } catch(err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchProperties();
    }, [fetchProperties])
  return (
    <div className="w-full flex items-center justify-center flex-col">
        <div className="w-[90vw] lg:w-[70%]">
        <h1 className="font-medium text-[2rem] py-[15px]">Add your <span className="text-[#436ad3]">property</span></h1>
        <div className=" flex flex-col gap-[15px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        <input type="text" value={propTitle} placeholder="Property title" onChange={(e) => setPropTitle(e.target.value)} />
        <input type="text" value={propHost} placeholder="Host" onChange={(e) => setPropHost(e.target.value)} />
        <input type="text" value={propDate} placeholder="Date" onChange={(e) => setPropDate(e.target.value)} />
        <div>
            <div className="text-[#333] font-light text-[0.9rem]">Price per Night</div>
        <input type="number" value={propPrice} placeholder="Price per night" onChange={(e) => {setPropPrice(Number(e.target.value))}} />
        </div>
        </div>
        <div className="flex items-center gap-[40px]">
        <div className="flex items-center gap-[10px]">
        <input className="w-[18px] h-[18px] hover:cursor-pointer" type="checkbox" checked={isPetFriendly} onChange={(e) => {setIsPetFriendly(e.target.checked)}}/>
        <div className="text-[1.2rem]">Pet Friendly?</div>
        </div>
        <input type="file" onChange={(e) => setImageUpload(e.target.files?.[0] || null)} />
        </div>
        <div className="flex gap-[25px]">
            <div className="flex items-center justify-center gap-[10px]">
        <button onClick={handleImageUpload} className="border border-solid border-[#ee] rounded-[10px] px-6 py-4 transition duration-300 hover:border-[#436ad3] focus:border-[#436ad3]">Upload Image</button>
        {isUploading ? <ClipLoader color="#436ad3" /> : !uploadComplete ? 
        null : <div className="bg-green-500 h-[30px] w-[30px] flex items-center justify-center rounded-full transition duration-300 ease-in-out">
            <TiTick className="text-white text-[1.2rem]"/></div>}
        </div>
        {uploadComplete ? <Button onClick={handleSubmit} className="py-7 px-6 transition duration-300 ease-in-out">Submit Property</Button> : null}
        
        </div>
        </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {propertyList.map((prop: Property) => (
        <div key={prop.id}>
            <PropertyItem item={prop} />
        </div>
    ))
    }
    </div>
    </div>
    </div>
  )
}

export default Properties