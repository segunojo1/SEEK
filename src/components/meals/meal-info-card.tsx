import { Clock, ExpandIcon, X } from 'lucide-react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Image from 'next/image'
import { useState } from 'react'

interface MealInfoCardProps {
    onExpandChange?: (isExpanded: boolean) => void
}

const MealInfoCard = ({ onExpandChange }: MealInfoCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => {
        const newExpandedState = !isExpanded
        setIsExpanded(newExpandedState)
        onExpandChange?.(newExpandedState)
    }

    return (
        <div className={`relative w-full ${isExpanded ? 'z-50' : ''}`}>
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
                <Clock />
                <p className='text-[14px] font-medium'>Nutritional Information</p>
            </div>

            {isExpanded && (
                <div 
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
                    onClick={toggleExpand}
                />
            )}
            <Card 
                className={`bg-[#2C2C2C] relative border-[0.5px] border-[#404040] rounded-[20px] transition-all duration-300 ease-in-out ${
                    isExpanded 
                        ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-auto max-h-[90vh] z-50 p-6' 
                        : 'min-w-full h-[318px]'
                }`}
            >
                <button 
                    onClick={toggleExpand}
                    className='text-[#D4D4D4] absolute top-[10px] right-[10px] z-10 hover:bg-white/10 p-1 rounded-full transition-colors'
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                    {isExpanded ? <X size={20} /> : <ExpandIcon size={20} />}
                </button>
                <CardContent className='overflow-y-auto max-h-[calc(90vh-100px)]'>
                    <div className={`${isExpanded ? 'flex flex-col md:flex-row gap-8' : ''}`}>
                        <div className={isExpanded ? 'md:w-1/2' : ''}>
                            <Image 
                                src='/assets/meall.png' 
                                alt='Meal' 
                                width={isExpanded ? 80 : 36} 
                                height={isExpanded ? 80 : 36} 
                                className={`${isExpanded ? 'mb-6' : 'mb-[45px]'} transition-all duration-300`} 
                            />
                            <h3 className='text-xl font-bold text-white mb-4'>Ingredients</h3>
                            <ul className='text-[#D4D4D4] text-[14px] font-medium space-y-2'>
                                <li>• Black-eyed peas</li>
                                <li>• Bell peppers</li>
                                <li>• Onions</li>
                                <li>• Vegetable oil</li>
                                <li>• Seasoning cubes</li>
                            </ul>
                        </div>
                        <div className={isExpanded ? 'md:w-1/2' : 'hidden'}>
                            <h3 className='text-xl font-bold text-white mb-4'>Instructions</h3>
                            <ul className='text-[#D4D4D4] text-[14px] font-medium space-y-3'>
                                <li className='flex gap-2'>
                                    <span className='text-white font-bold'>1.</span>
                                    <span>Soak and peel the beans.</span>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-white font-bold'>2.</span>
                                    <span>Blend with peppers, onions, and a little water until smooth.</span>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-white font-bold'>3.</span>
                                    <span>Add oil, seasoning, and mix thoroughly.</span>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-white font-bold'>4.</span>
                                    <span>Pour into containers or wraps.</span>
                                </li>
                                <li className='flex gap-2'>
                                    <span className='text-white font-bold'>5.</span>
                                    <span>Steam for 45 minutes to 1 hour until firm.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MealInfoCard