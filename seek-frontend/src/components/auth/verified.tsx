import React from 'react'
import { Button } from '../ui/button'

interface VerifiedProps {
    onSuccess: () => void
}
const Verified = ({onSuccess}: VerifiedProps) => {
    // const handleSubmit = () => {
    //     onSuccess()
    // }
    return (
        <section>
            <h2 className="text-[29px]/[auto] text-[#737373] font-semibold mb-6">You&apos;re in!</h2>
            <p className="text-[15px] font-medium satoshi">
                Your email has been verified—welcome to Seek.
            </p>
            <div className="mt-8">
                <div className="relative flex items-center mb-8">
                    <div className="w-full border-t border-[#D4D4D4]"></div>
                </div>
                <Button onClick={() => onSuccess()} type="button" className="bg-[#F9E8CD] w-full py-[13px] h-full">Continue</Button>

            </div>
        </section>
    )
}

export default Verified