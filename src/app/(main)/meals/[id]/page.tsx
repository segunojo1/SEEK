"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProductsStore } from '@/store/products.store';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Utensils, Clock3, Star } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';

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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 -ml-2 flex items-center gap-1 text-gray-400 hover:text-white"
      >
        <ChevronLeft size={18} />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div>
          <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src={
                currentMeal?.mealName 
                  ? `/images/meals/${String(currentMeal.mealName).toLowerCase().replace(/\s+/g, '-')}.jpg`
                  : '/images/placeholder-meal.jpg'
              }
              alt={currentMeal?.mealName || 'Meal image'}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-meal.jpg';
              }}
              priority
            />
          </div>
          
          {currentMeal?.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {currentMeal.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-sm text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Column - Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentMeal.mealName}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-medium">{currentMeal.personalizedHealthScore}/100</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock3 className="w-4 h-4" />
              <span className="text-sm">30-45 min</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Utensils className="w-4 h-4" />
              <span className="text-sm">Main Course</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-300">{currentMeal?.description || 'No description available.'}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Nutritional Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Calories</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.calories}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Protein</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.protein}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Carbs</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.carbs}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Fat</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.fat}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Fiber</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.fiber}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Sodium</p>
                <p className="text-xl font-semibold">{currentMeal?.nutrition?.sodium}</p>
              </div>
            </div>
          </div>
          
          {currentMeal?.recipeSteps?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">How to Prepare</h3>
              <ol className="space-y-3 list-decimal list-inside">
                {currentMeal.recipeSteps.map((step, index) => (
                  <li key={index} className="text-gray-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {currentMeal?.usage && (
            <div className="bg-[#2C2C2C] p-4 rounded-lg border border-[#404040]">
              <h4 className="font-medium text-[#F9E8CD] mb-2">Serving Suggestion</h4>
              <p className="text-gray-300">{currentMeal.usage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealPage