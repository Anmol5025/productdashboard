'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { fetchProducts } from '@/api/products';
import { ProductTable } from '@/components/ProductTable';
import { Pagination } from '@/components/Pagination';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { useLocalProducts } from '@/lib/ProductsContext';
import { Product } from '@/types';
import { Plus } from 'lucide-react';
import { ProductFormModal } from '@/components/ProductFormModal';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { Suspense } from 'react';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { applyLocalChanges, addProductLocal, editProductLocal, deleteProductLocal } = useLocalProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Parse URL params
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);
  const limit = isNaN(limitParam) || ![10, 20, 50].includes(limitParam) ? 10 : limitParam;
  
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const skip = (page - 1) * limit;

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  
  // Abort controller for race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadProducts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError('');

    try {
      let sortBy = '';
      let order: 'asc' | 'desc' = 'asc';
      
      if (sort) {
        const parts = sort.split('_');
        sortBy = parts[0];
        order = parts[1] as 'asc' | 'desc';
      }

      const res = await fetchProducts(
        { limit, skip, q, category, sortBy, order },
        abortControllerRef.current.signal
      );
      
      setProducts(res.products);
      setTotal(res.total);
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError('Failed to load products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [limit, skip, q, category, sort]);

  useEffect(() => {
    loadProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts]);

  const updateUrl = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const finalProducts = applyLocalChanges(products);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <SearchFilterBar
        initialSearch={q}
        initialCategory={category}
        initialSort={sort}
        onSearchChange={(newQ) => updateUrl({ q: newQ, page: 1, category: null })}
        onCategoryChange={(newCat) => updateUrl({ category: newCat, page: 1, q: null })}
        onSortChange={(newSort) => updateUrl({ sort: newSort, page: 1 })}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={loadProducts} className="bg-red-100 px-3 py-1 rounded hover:bg-red-200">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <ProductTable
            products={finalProducts}
            onEdit={(p) => {
              setSelectedProduct(p);
              setIsFormModalOpen(true);
            }}
            onDelete={(id) => {
              const productToDelete = finalProducts.find(p => p.id === id);
              if (productToDelete) {
                setSelectedProduct(productToDelete);
                setIsDeleteModalOpen(true);
              }
            }}
          />
          <Pagination
            total={total}
            skip={skip}
            limit={limit}
            onPageChange={(newSkip) => {
              const newPage = Math.floor(newSkip / limit) + 1;
              updateUrl({ page: newPage });
            }}
            onLimitChange={(newLimit) => updateUrl({ limit: newLimit, page: 1 })}
          />
        </>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        product={selectedProduct}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={selectedProduct?.id || 0}
        productTitle={selectedProduct?.title || ''}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
