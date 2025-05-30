'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface MealInsightCardProps {
    recipeSteps: string[]
    onChatClick?: () => void
    className?: string
}

const MealInsightCard = ({ recipeSteps, onChatClick }: MealInsightCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className='w-2/3'>
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
                <Clock />
                <p className='text-[14px] font-medium'>Insights</p>
            </div>
            <Card className="bg-[#2C2C2C] relative min-w-full h-[318px] border-[0.5px] border-[#404040] rounded-[20px]">
                <CardContent>
                    <Image src='/assets/meall.png' alt='' width={36} height={36} className='mb-[45px]' />
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[#D4D4D4] text-lg font-medium">Recipe</h3>
                        <Button 
                            onClick={onChatClick}
                            variant="outline"
                            className="text-[#D4D4D4] hover:bg-[#404040]"
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Open in Chat
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {recipeSteps.slice(0, 2).map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <span className="text-[#D4D4D4]">{step}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MealInsightCard