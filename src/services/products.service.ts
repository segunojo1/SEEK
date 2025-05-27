import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export interface MealRecommendation {
  $id: string;
  name: string;
  course: string;
  description: string;
  imageUrl?: string;
}

export interface MealRecommendationsResponse {
  $id: string;
  $values: MealRecommendation[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: Array<{
    id: string;
    name: string;
    time: string;
    items: Array<{
      id: string;
      name: string;
      amount: string;
    }>;
  }>;
}

export class ProductService {
  private api: AxiosInstance;
  private static instance: ProductService;
  private readonly COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: 7 // 7 days
  };

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private getProfileId(): string {
    const profileId = Cookies.get('profileId');
    if (!profileId) {
      throw new Error('Profile ID not found in cookies');
    }
    return profileId;
  }

  public async getRecommendedMeals(): Promise<MealRecommendation[]> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get<MealRecommendationsResponse>('/api/MealRecommendation/GenerateMeals', {
        params: { profileId }
      });
      return response.data?.$values || [];
    } catch (error) {
      console.error('Error fetching recommended meals:', error);
      return [];
    }
  }

  public async generateMealPlan(): Promise<MealPlan | null> {
    try {
      const profileId = this.getProfileId();
      const response = await this.api.get('/api/MealPlan/GenMeal', {
        params: { profileId }
      });
      return response.data || null;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return null;
    }
  }
}

export const productService = ProductService.getInstance();