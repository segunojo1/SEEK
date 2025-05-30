"use client"

import AlternativesCard from "@/components/meals/alternatives-card"
import MealDetails from "@/components/meals/meal-details"
import MealInfoCard from "@/components/meals/meal-info-card"
import MealInsightCard from "@/components/meals/meal-insight-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductsStore } from "@/store/products.store"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'

export const LinkPill = () => {
    return (
        <div className="flex items-center gap-[5px] px-[10px] py-[7px] bg-[#FEFAEE33] border-[0.7px] border-[#FEFAEE80] rounded-full">
            <Image src='/assets/smallstar.svg' alt='' width={20} height={20} className='' />
            <p className="text-[15px] font-medium">Product Details</p>
        </div>
    )
}


const MealPage = () => {

  const { id } = useParams();
  const router = useRouter();
  const { currentMeal, fetchMealDetails, isLoading, error } = useProductsStore();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadMealDetails = async () => {
      try {
        const profileId = Cookies.get('profileID');
        if (!profileId) {
          throw new Error('Profile ID not found');
        }
        
        const mealName = decodeURIComponent(id as string);
        const result = await fetchMealDetails(mealName, profileId);
        
        if (!result) {
          throw new Error('Failed to load meal details');
        }
      } catch (error) {
        console.error('Error loading meal details:', error);
        setLocalError('Failed to load meal details. Please try again.');
      }
    };

    if (id) {
      loadMealDetails();
    }
    
    // Cleanup function to reset the currentMeal when component unmounts
    return () => {
      useProductsStore.getState().setCurrentMeal(null);
    };
  }, [id, fetchMealDetails]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />
            
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if we don't have any meal data
  if ((error || localError) && !currentMeal) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Meal Not Found</h1>
        <p className="text-gray-400 mb-6">
          {error || localError || 'The requested meal could not be found.'}
        </p>
        <Button onClick={() => router.push('/explore')} variant="outline">
          Back to Explore
        </Button>
      </div>
    );
  }
  
  // If we don't have meal data but also no error, show loading
  if (!currentMeal) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Meal Details...</h1>
      </div>
    );
  }
// const meal = currentMeal?.value
console.log(currentMeal);

    return (
        <section className="relative satoshi">
            <Image src='/assets/logo.png' alt='' width={103} height={90} className='mx-auto mb-[55px] left-0 right-0 absolute' />

            <div className="flex items-center gap-3 p-5 mb-[28px] w-fit">
                <Image src='/assets/meal-icon.svg' alt='' width={24} height={24} className='' />
                <XIcon width={16} height={16} />
                <p className="text-[14px] font-bold text-[#FAFAFA]">{currentMeal?.mealName}</p>
            </div>
            <div className="flex items-center gap-[13px] px-5">
                <LinkPill />
                <LinkPill />
            </div>
            <div className="p-[50px]">

                <MealDetails meal={currentMeal} />
                <div className="flex gap-[20px] min-w-full mt-[30px]">
                    <MealInfoCard 
                        type="nutrition" 
                        data={{
                            nutrition: currentMeal?.nutrition
                        }}
                    />
                    <MealInfoCard 
                        type="recipe" 
                        data={{
                            recipeSteps: currentMeal?.recipeSteps?.$values
                        }}
                    />
                    <MealInfoCard 
                        type="usage" 
                        data={{
                            usage: currentMeal?.usage
                        }}
                    />
                </div>
                <div className="flex gap-[24px] mt-[30px]">
                    <MealInsightCard 
                    recipeSteps={currentMeal?.recipeSteps?.$values || []}
                />
                    <AlternativesCard 
                        alternatives={{
                            $id: currentMeal?.alternatives?.$id,
                            $values: currentMeal?.alternatives?.$values || []
                        }}
                    />
                </div>
            </div>

        </section>
    )
}

export default MealPage