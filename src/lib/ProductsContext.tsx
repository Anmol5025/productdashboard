'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';

type LocalChanges = {
  added: Product[];
  edited: Record<number, Product>;
  deleted: Set<number>;
};

interface ProductsContextType {
  localChanges: LocalChanges;
  addProductLocal: (p: Product) => void;
  editProductLocal: (p: Product) => void;
  deleteProductLocal: (id: number) => void;
  applyLocalChanges: (products: Product[]) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [localChanges, setLocalChanges] = useState<LocalChanges>({
    added: [],
    edited: {},
    deleted: new Set(),
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('product_changes');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalChanges({
          added: parsed.added || [],
          edited: parsed.edited || {},
          deleted: new Set(parsed.deleted || []),
        });
      }
    } catch (e) {
      console.error('Failed to parse local changes');
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever it changes
  React.useEffect(() => {
    if (!isInitialized) return;
    
    const dataToSave = {
      added: localChanges.added,
      edited: localChanges.edited,
      deleted: Array.from(localChanges.deleted),
    };
    localStorage.setItem('product_changes', JSON.stringify(dataToSave));
  }, [localChanges, isInitialized]);

  const addProductLocal = (p: Product) => {
    setLocalChanges(prev => ({ ...prev, added: [p, ...prev.added] }));
  };

  const editProductLocal = (p: Product) => {
    setLocalChanges(prev => ({
      ...prev,
      edited: { ...prev.edited, [p.id]: p }
    }));
  };

  const deleteProductLocal = (id: number) => {
    setLocalChanges(prev => {
      const newDeleted = new Set(prev.deleted);
      newDeleted.add(id);
      return { ...prev, deleted: newDeleted };
    });
  };

  const applyLocalChanges = (serverProducts: Product[]) => {
    if (!isInitialized) return serverProducts; // avoid hydration mismatches
    
    // 1. Filter out deleted
    let result = serverProducts.filter(p => !localChanges.deleted.has(p.id));
    // 2. Apply edits
    result = result.map(p => localChanges.edited[p.id] || p);
    // Note: To show added products on page 1, we could prepend them, 
    // but pagination gets tricky. We'll just prepend them for simplicity.
    return [...localChanges.added, ...result];
  };

  return (
    <ProductsContext.Provider value={{ localChanges, addProductLocal, editProductLocal, deleteProductLocal, applyLocalChanges }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useLocalProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useLocalProducts must be used within ProductsProvider');
  return context;
}
