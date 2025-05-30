'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/store/products.store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const InsightPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { currentBlog, fetchBlogById, isLoading } = useProductsStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogById(id as string);
    }
    setIsClient(true);
  }, [id, fetchBlogById]);

  if (!isClient || isLoading) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
        </div>
        <div className="space-y-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!currentBlog) {
    return (
      <section className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <p className="text-gray-400 mb-6">The requested blog post could not be found.</p>
        <Button onClick={() => router.push('/explore')} variant="outline">
          Back to Explore
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 -ml-2 flex items-center gap-1 text-gray-400 hover:text-white"
      >
        <ChevronLeft size={18} />
        Back
      </Button>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#2C2C2C] text-sm font-medium rounded-full">
            {currentBlog.category}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock size={14} />
            <span>5 min read</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentBlog.title}</h1>
      </div>
      
      <article className="prose prose-invert max-w-none">
        {currentBlog.text.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>
      
      <div className="mt-12 pt-8 border-t border-[#404040]">
        <Button 
          variant="outline" 
          onClick={() => router.push('/explore')}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Back to Explore
        </Button>
      </div>
    </section>
  );
};

export default InsightPage;