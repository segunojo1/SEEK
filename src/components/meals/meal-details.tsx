import Image from 'next/image'
import React from 'react'

export const Tag = () => {
    return (
        <div className="flex items-center gap-[5px] px-[10px] py-[7px] bg-[#FEFAEE33] border-[0.7px] border-[#FEFAEE80] rounded-full">
            <Image src='/assets/smallstar.svg' alt='' width={20} height={20} className='' />
            <p className="text-[15px] font-medium">Meal</p>
        </div>
    )
}

const MealDetails = () => {
    return (
        <div className='flex justify-between items-end '>
            
            <div className='flex flex-col items-start gap-3 max-w-[608px]'>

                <Image src='/assets/meall.png' alt='' width={100} height={100} className='' />
                <h1 className='text-[38px] font-semibold'>Jollof Rice</h1>
                <div className='flex items-center gap-[10px]'>
                    <Image src='/assets/rating-icon.svg' alt='' width={36} height={36} className='' />
                    <p className='text-[30px] font-semibold'><span className='text-[#B4F1CF]'>78</span>/100</p>
                </div>
                <p className='text-[16px] font-medium'>A rich West African rice dish cooked in tomato sauce with spices and optional proteins. Jollof Rice is flavorful, hearty, and widely enjoyed.</p>
            </div>

            <div className='flex flex-col gap-4 items-start'>
                <h2 className='text-[14px] font-medium text-[#A3A3A3]'>Tags</h2>
                <div className='flex flex-wrap max-w-[275px] gap-[10px]'>
                    <Tag />
                    <Tag />
                    <Tag />
                    <Tag />
                    <Tag />
                </div>
            </div>
        </div>
    )
}

export default MealDetails