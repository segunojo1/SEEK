import { create } from 'zustand';
import { productService, MealRecommendation, MealPlan } from '@/services/products.service';

interface ProductsStore {
  recommendedMeals: MealRecommendation[];
  mealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  fetchRecommendedMeals: () => Promise<void>;
  generateMealPlan: () => Promise<void>;
  setRecommendedMeals: (meals: MealRecommendation[]) => void;
  setMealPlan: (plan: MealPlan | null) => void;
  clearError: () => void;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  recommendedMeals: [],
  mealPlan: null,
  isLoading: false,
  error: null,

  fetchRecommendedMeals: async () => {
    try {
      set({ isLoading: true, error: null });
      const meals = await productService.getRecommendedMeals();
      set({ recommendedMeals: meals });
    } catch (error) {
      console.error('Error in fetchRecommendedMeals:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch recommended meals',
        recommendedMeals: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  generateMealPlan: async () => {
    try {
      set({ isLoading: true, error: null });
      const plan = await productService.generateMealPlan();
      set({ mealPlan: plan });
    } catch (error) {
      console.error('Error in generateMealPlan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate meal plan',
        mealPlan: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setRecommendedMeals: (meals: MealRecommendation[]) => {
    set({ recommendedMeals: meals });
  },

  setMealPlan: (plan: MealPlan | null) => {
    set({ mealPlan: plan });
  },

  clearError: () => {
    set({ error: null });
  },
}));