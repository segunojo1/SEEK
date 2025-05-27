"use client"

import AlternativesCard from "@/components/meals/alternatives-card"
import MealDetails from "@/components/meals/meal-details"
import MealInfoCard from "@/components/meals/meal-info-card"
import MealInsightCard from "@/components/meals/meal-insight-card"
import { XIcon } from "lucide-react"
import Image from "next/image"

export const LinkPill = () => {
    return (
        <div className="flex items-center gap-[5px] px-[10px] py-[7px] bg-[#FEFAEE33] border-[0.7px] border-[#FEFAEE80] rounded-full">
            <Image src='/assets/smallstar.svg' alt='' width={20} height={20} className='' />
            <p className="text-[15px] font-medium">Meal Name</p>
        </div>
    )
}


const MealPage = () => {
    return (
        <section className="relative satoshi">
            <Image src='/assets/logo.png' alt='' width={103} height={90} className='mx-auto mb-[55px] left-0 right-0 absolute' />

            <div className="flex items-center gap-3 p-5 mb-[28px] w-fit">
                <Image src='/assets/meal-icon.svg' alt='' width={24} height={24} className='' />
                <XIcon width={16} height={16} />
                <p className="text-[14px] font-bold text-[#FAFAFA]">MoiMoi</p>
            </div>
            <div className="flex items-center gap-[13px] px-5">
                <LinkPill />
                <LinkPill />
            </div>
            <div className="p-[50px]">

                <MealDetails />
                <div className="flex gap-[20px] min-w-full mt-[30px]">
                    <MealInfoCard />
                    <MealInfoCard />
                    <MealInfoCard />
                </div>
                <div className="flex gap-[24px] mt-[30px]">
                    <MealInsightCard />
                    <AlternativesCard />
                </div>
            </div>

        </section>
    )
}

export default MealPage