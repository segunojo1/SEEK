import { useUserStore } from '@/store/user.store';
import useAuthStore from '@/store/auth.store';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  dateCreated: string;
  dateModified: string | null;
}

export interface Profile {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  skinType: string;
  nationality: string;
  dietType: string;
  allergies: string[];
  userGoals: string[];
  dateCreated: string;
  dateModified: string | null;
}

export interface SignupPayload {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

export interface ProfilePayload {
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  skinType: string;
  nationality: string;
  dietType: string;
  allergies: string[];
  userGoals: string[];
}

export interface OtpResponse {
  message: string;
  success: boolean;
  userId?: string;
  token?: string;
  user?: User;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

class AuthService {
  private api: AxiosInstance;
  private static instance: AuthService;
  private readonly COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: 7 // 7 days
  };

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token to requests
    this.api.interceptors.request.use(
      (config) => {
        // Skip adding token for signup and login endpoints
        const isAuthEndpoint = [
          '/api/auth/register',
          '/api/auth/login',
          '/api/auth/send-otp',
          '/api/VerificationCode/VerifyCode/'
        ].some(endpoint => config.url?.includes(endpoint));

        if (!isAuthEndpoint) {
          const token = Cookies.get('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            // Handle case where token is missing but required
            console.warn('No authentication token found');
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`, {
                refreshToken
              });
              
              const { token, refreshToken: newRefreshToken } = response.data;
              
              // Update tokens
              Cookies.set('token', token, this.COOKIE_OPTIONS);
              Cookies.set('refreshToken', newRefreshToken, this.COOKIE_OPTIONS);
              
              // Update the Authorization header
              originalRequest.headers.Authorization = `Bearer ${token}`;
              
              // Retry the original request
              return this.api(originalRequest);
            }
          } catch (error) {
            // If refresh token fails, clear auth and redirect to login
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            useUserStore.getState().setUser(null);
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    // Always initialize user state when getting the instance
    AuthService.instance.initializeUserState();
    return AuthService.instance;
  }

  public getAuthToken(): string | null {
    return Cookies.get('token') || null;
  }

  private initializeUserState() {
    const token = this.getAuthToken();
    
    if (token) {
      // Set the token in the API headers
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user from cookies
      const userStr = Cookies.get('user');
      
      if (userStr) {
        try {
          const user: User = JSON.parse(userStr); 
          
          useUserStore.getState().setUser(user);
          
        } catch (error) {
          console.error('Error parsing user data from cookies:', error);
          // If user data is invalid, clear everything
          this.logout();
        }
      } else {
        console.error('No user data found in cookies');
        // Clear the persisted state from localStorage
        localStorage.removeItem('user-storage');
        this.logout();
      }
    }
  }

  public async sendOtp(email: string, name: string): Promise<OtpResponse> {
    try {
      const response = await this.api.post<OtpResponse>('/api/auth/send-otp', { email, name });
      return response.data;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      throw new Error(errorMessage);
    }
  }

  public async verifyOtp(otp: string): Promise<OtpResponse> {
    try {
      // First, get the user ID from the store or context
      const userId = useAuthStore.getState().signupData.userId;
      if (!userId) {
        throw new Error('User ID not found. Please try the signup process again.');
      }

      const response = await this.api.get<OtpResponse>(
        `/api/VerificationCode/VerifyCode/${otp}/${userId}`
      );
      
      if (response.data.token) {
        // Store the token and update the auth header
        Cookies.set('token', response.data.token, this.COOKIE_OPTIONS);
        this.api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // If user data is included in the response, store it as well
        if (response.data.user) {
          Cookies.set('user', JSON.stringify(response.data.user), this.COOKIE_OPTIONS);
          useUserStore.getState().setUser(response.data.user);
        }
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'OTP verification failed';
      console.error('OTP verification failed:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  public async register(payload: SignupPayload & { [key: string]: any }): Promise<{
    $id: string;
    value: {
      $id: string;
      id: number;
      FullName: string;
      Email: string;
      roleId: number;
      roleName: string;
    };
    message: string;
  }> {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        // Handle file uploads
        if (value instanceof File) {
          formData.append(key, value);
        } 
        // Handle array fields (like allergies, userGoals, etc.)
        else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
        // Handle other primitive values
        else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await this.api.post<{
        $id: string;
        value: {
          $id: string;
          id: number;
          fullName: string;
          email: string;
          roleId: number;
          roleName: string;
        };
        message: string;
      }>('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  public async createProfile(userId: string, profileData: ProfilePayload): Promise<Profile> {
    try {
      const response = await this.api.post<Profile>(`/api/Profile/create?userId=${userId}`, profileData);
      // Store profile ID in cookies after successful profile creation
      if (response.data?.id) {
        Cookies.set('profileID', response.data.id, this.COOKIE_OPTIONS);
      }
      return response.data;
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      throw new Error(error.response?.data?.message || 'Profile creation failed. Please try again.');
    }
  }

  public async getProfileByUserId(userId: string): Promise<{
    $id: string;
    message: string;
    isSuccessful: boolean;
    value: number;
  }> {
    try {
      const response = await this.api.get(`/api/Profile/profileByIdUserId?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile. Please try again.');
    }
  }

  public async login(email: string, password: string): Promise<{ user: User; token: string; value: any }> {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await this.api.post<{ 
        $id: string;
        token: string;
        value: {
          $id: string;
          id: number;
          fullName: string;
          email: string;
          roleId: number;
          roleName: string;
          isProfileExist: boolean;
        };
        message: string;
      }>('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.token) {
        const { token, value } = response.data;
        const user = {
          id: value.id.toString(),
          email: value.email,
          firstName: value.fullName.split(' ')[0],
          lastName: value.fullName.split(' ').slice(1).join(' ') || '',
          isEmailVerified: true,
          dateCreated: new Date().toISOString(),
          dateModified: null
        };
        
        Cookies.set('token', token, this.COOKIE_OPTIONS);
        Cookies.set('user', JSON.stringify(user), this.COOKIE_OPTIONS);
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { user, token, value: response.data.value };
      }
      
      throw new Error('No token received');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      toast(errorMessage);
      throw new Error(errorMessage);
    }
  }

  public logout(): void {
    // Remove auth token and user data from cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Clear authorization header
    delete this.api.defaults.headers.common['Authorization'];
    
    // Update user store
    const userStore = useUserStore.getState();
    userStore.setUser(null);
  }
}

export default AuthService.getInstance();