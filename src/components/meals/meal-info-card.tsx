import { Clock, ExpandIcon, X } from 'lucide-react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Image from 'next/image'
import { useState } from 'react'

interface MealInfoCardProps {
    onExpandChange?: (isExpanded: boolean) => void
    type: 'nutrition' | 'recipe' | 'usage'
    data: {
        nutrition?: {
            calories: string
            carbs: string
            protein: string
            fat: string
            fiber: string
            sodium: string
        }
        recipeSteps?: string[]
        usage?: string
        image?: string
        name?: string
        prepTime?: string
    }
}

const MealInfoCard = ({ onExpandChange, type, data }: MealInfoCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { nutrition, recipeSteps, usage, image, name, prepTime } = data || {}

    const toggleExpand = () => {
        const newExpandedState = !isExpanded
        setIsExpanded(newExpandedState)
        onExpandChange?.(newExpandedState)
    }

    const getContent = () => {
        switch (type) {
            case 'nutrition':
                return nutrition ? (
                    <div className="space-y-1 text-[16px] font-normal">
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Calories</span>
                            <span>{nutrition.calories}</span>
                        </div>
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Carbs</span>
                            <span>{data.nutrition?.carbs}</span>
                        </div>
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Protein</span>
                            <span>{data.nutrition?.protein}</span>
                        </div>
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Fat</span>
                            <span>{data.nutrition?.fat}</span>
                        </div>
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Fiber</span>
                            <span>{data.nutrition?.fiber}</span>
                        </div>
                        <div className="flex gap-[2px] items-center">
                            <span className='text-[#D4D4D4]'>Sodium</span>
                            <span>{data.nutrition?.sodium}</span>
                        </div>
                    </div>
                ) : null
            case 'recipe':
                return (
                    <div className="space-y-4">
                        {data.recipeSteps?.map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className=" text-white flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                )
            case 'usage':
                return (
                    <div className="space-y-4">
                        <p>{data.usage}</p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className={`relative w-full ${isExpanded ? 'z-50' : ''}`}>
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
                {type === 'nutrition' ? (
                    <>
                        <Clock size={16} />
                        <span>Nutritional Information</span>
                    </>
                ) : type === 'recipe' ? (
                    <>
                        <Clock size={16} />
                        <span>Recipe</span>
                    </>
                ) : (
                    <>
                        <Clock size={16} />
                        <span>Description/Usage</span>
                    </>
                )}
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
                    {isExpanded ? <X size={20} /> : <ExpandIcon size={16} />}
                </button>
                <CardContent className='overflow-y-auto max-h-[calc(90vh-100px)]'>
                    <div className={`${isExpanded ? 'flex flex-col md:flex-row gap-8' : ''}`}>
                        <div className={isExpanded ? 'md:w-1/2' : ''}>
                            {data.image && (
                                <Image 
                                    src={data.image}
                                    alt={data.name || 'Meal'}
                                    width={400}
                                    height={300}
                                    className='w-full h-auto rounded-lg'
                                />
                            )}
                        </div>
                    </div>

                    <Image 
                                src='/assets/meall.png' 
                                alt='Meal' 
                                width={isExpanded ? 80 : 36} 
                                height={isExpanded ? 80 : 36} 
                                className={`${isExpanded ? 'mb-6' : 'mb-[45px]'} transition-all duration-300`} 
                            />
                    {getContent()}
                </CardContent>
            </Card>
        </div>
    )
}

export default MealInfoCard