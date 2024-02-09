import { Checkbox } from '@/components/ui/checkbox';
import { db, storage } from '@/firebase/firebase-config'
import { addDoc, collection, getDocs, SnapshotMetadata } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import React, { FC, useState, useEffect } from 'react'
import { v4 } from 'uuid';
import PropertyItem from './PropertyItem';

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
        if(!imageUpload) return;
        const imageFolderRef = ref(storage, `properties/${imageUpload.name + v4()}`);
        try {
            await uploadBytes(imageFolderRef, imageUpload);
            const downloadURL = await getDownloadURL(imageFolderRef);
            setImageURL(downloadURL); 
        } catch (err) {
            console.error(err);
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
    }, [])
  return (
    <div>
        <div>
        <input type="text" placeholder="Property title" onChange={(e) => setPropTitle(e.target.value)} />
        <input type="text" placeholder="Host" onChange={(e) => setPropHost(e.target.value)} />
        <input type="text" placeholder="Date" onChange={(e) => setPropDate(e.target.value)} />
        <input type="number" placeholder="Price per night" onChange={(e) => {setPropPrice(Number(e.target.value))}} />
        <div className="flex">
            <div>Pet Friendly?</div>
        <input type="checkbox" checked={isPetFriendly} onChange={(e) => {setIsPetFriendly(e.target.checked)}}/>
        </div>
        <input type="file" onChange={(e) => setImageUpload(e.target.files?.[0] || null)} />
        <button onClick={handleImageUpload}>Upload Image</button>
        <button onClick={handleSubmit}>Submit Property</button>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-4">
        {propertyList.map((prop: Property) => (
        <div>
            <PropertyItem key={prop.id} item={prop} />
        </div>
    ))
    }
    </div>
    </div>
    </div>
  )
}

export default Properties