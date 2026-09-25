'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/api/products';
import { Product } from '@/types';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useLocalProducts } from '@/lib/ProductsContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { localChanges } = useLocalProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        const productId = Number(id);
        
        // If it's a newly added local product, find it in context
        const localAdded = localChanges.added.find(p => p.id === productId);
        if (localAdded) {
          setProduct(localAdded);
          setLoading(false);
          return;
        }

        // Fetch from server
        const data = await fetchProductById(id as string);
        
        // Apply local edit if any
        if (localChanges.edited[productId]) {
          setProduct(localChanges.edited[productId]);
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadData();
    }
  }, [id, localChanges]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline flex items-center justify-center mx-auto gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <img 
              className="w-full h-auto object-cover rounded-lg bg-gray-50" 
              src={product.images?.[0] || product.thumbnail} 
              alt={product.title} 
            />
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <img key={i} src={img} className="w-16 h-16 object-cover rounded border" alt="" />
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8 md:w-1/2">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
              {product.category?.replace('-', ' ')}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 text-gray-700 font-medium">{product.rating}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="text-3xl font-bold text-gray-900 mb-6">
              ${Number(product.price).toFixed(2)}
            </div>
            
            <div className="border-t border-gray-100 pt-6 mt-6">
              <h3 className="font-semibold text-lg mb-4">Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{review.reviewerName}</span>
                        <div className="flex text-yellow-500 text-sm">
                          ★ {review.rating}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
