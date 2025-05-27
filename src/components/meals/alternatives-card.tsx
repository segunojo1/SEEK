
import { Clock, ExpandIcon } from 'lucide-react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Image from 'next/image'


const AlternativesCard = () => {
    return (
        <div className='w-1/3'>
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
                <Clock />
                <p className='text-[14px] font-medium'>Recommended Alternatives</p>
            </div>

            <Card className='bg-[#2C2C2C] relative  h-[318px] border-[0.5px] border-[#404040] rounded-[20px]'>
            <Image src='/assets/meall.png' alt='' width={36} height={36} className='mb-[45px]' />
            <CardContent>
                    <ul className='text-[#D4D4D4] text-[14px] font-medium'>
                        <li>Soak and peel the beans.</li>
                        <li>Blend with peppers, onions, and a little water until smooth.</li>
                        <li>Add oil, seasoning, and mix thoroughly.</li>
                        <li>Pour into containers or wraps.</li>
                        <li>Steam for 45 minutes to 1 hour until firm.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default AlternativesCard