import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { X } from 'lucide-react';
import { addProduct, updateProduct } from '@/api/products';
import { useLocalProducts } from '@/lib/ProductsContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const isEdit = !!product;
  const { addProductLocal, editProductLocal } = useLocalProducts();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setTitle(product.title);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setCategory(product.category);
      } else {
        setTitle('');
        setPrice('');
        setStock('');
        setCategory('');
      }
      setError('');
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!title || !category || isNaN(parsedPrice) || isNaN(parsedStock)) {
      setError('Please fill in all fields with valid data.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Product> = {
        title,
        price: parsedPrice,
        stock: parsedStock,
        category,
      };

      if (isEdit) {
        // Mock update
        const updated = await updateProduct(product.id, payload);
        editProductLocal({ ...product, ...updated });
      } else {
        // Mock add
        const added = await addProduct(payload);
        // addProduct doesn't return full product details that table might need, 
        // so we augment it with some dummy data to match the UI.
        addProductLocal({
          ...added,
          id: Math.floor(Math.random() * 10000) + 1000,
          thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
          rating: 0,
        } as Product);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
