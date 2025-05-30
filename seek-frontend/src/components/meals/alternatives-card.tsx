import { Clock, CheckCircle2, ExpandIcon } from 'lucide-react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Image from 'next/image'

interface AlternativesCardProps {
    alternatives: {
        $id?: string;
        $values: string[];
    }
}

const AlternativesCard = ({ alternatives }: AlternativesCardProps) => {
    return (
        <div className='w-1/3 min-h-full max-h-[318px]'>
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
                <Clock />
                <p className='text-[14px] font-medium'>Recommended Alternatives</p>
            </div>

            <Card className="bg-[#2C2C2C] border-[0.5px] border-[#404040] rounded-[20px] h-full ">
                <CardContent>
                    <h3 className="text-[#D4D4D4] text-lg font-medium mb-4">Alternatives</h3>
                    <ul className="text-[#D4D4D4] text-[14px] font-medium space-y-2">
                        {alternatives?.$values?.filter(Boolean).map((alt: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="text-primary w-4 h-4" />
                                {alt}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default AlternativesCard