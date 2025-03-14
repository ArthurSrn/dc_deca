import Link from 'next/link';
import Image from 'next/image';
import { ParcoursType } from '../types/parcours';

const ParcoursCard = ({ parcours, id }: { parcours: ParcoursType; id: string }) => {
    return (
        <Link href={`/parcours/${id}`}>
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative h-48 w-full">
                    <Image
                        src={parcours.urlImage}
                        alt={parcours.nom}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                {/* ... reste du contenu de la carte ... */}
            </div>
        </Link>
    );
};

export default ParcoursCard; 