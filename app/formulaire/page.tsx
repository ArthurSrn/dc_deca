"use client"
import MultiStepForm from "../components/MultiStepForm";
import { useRouter } from 'next/navigation';

export default function Formulaire() {
    const router = useRouter();

    return (
        <div>
            <MultiStepForm onComplete={() => router.push('/parti')} />
        </div>
    )
}   
