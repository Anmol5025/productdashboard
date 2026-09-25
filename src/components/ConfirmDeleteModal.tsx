import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { deleteProduct } from '@/api/products';
import { useLocalProducts } from '@/lib/ProductsContext';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, productId, productTitle }: ConfirmDeleteModalProps) {
  const { deleteProductLocal } = useLocalProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteProduct(productId);
      deleteProductLocal(productId);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4 sm:p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete <span className="font-semibold">{productTitle}</span>? This action cannot be undone.
          </p>
          
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex-1"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
