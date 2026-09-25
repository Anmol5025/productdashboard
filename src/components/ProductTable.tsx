import React from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">No products found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                      <img className="h-12 w-12 object-cover mix-blend-multiply" src={product.thumbnail} alt="" />
                    </div>
                    <div className="ml-4">
                      <Link href={`/products/${product.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {product.title}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-yellow-400 mr-1">★</span> {product.rating}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100 bg-gray-50/50">
        {products.map((product) => (
          <div key={product.id} className="p-5 flex flex-col gap-4 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-20 w-20 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                <img className="h-20 w-20 object-cover mix-blend-multiply" src={product.thumbnail} alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`} className="text-base font-bold text-gray-900 hover:text-blue-600 truncate block">
                  {product.title}
                </Link>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="font-bold text-gray-900 text-lg">${product.price.toFixed(2)}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-yellow-500 font-medium flex items-center text-xs">★ {product.rating}</span>
                    <span className={`text-xs font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => onEdit(product)} className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors border border-gray-200">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => onDelete(product.id)} className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors border border-gray-200">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
