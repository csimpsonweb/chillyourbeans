'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { magentoAPI } from '@/lib/magento-api';
import type { Category } from '@/types/product';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoryData = await magentoAPI.getCategories();
      setCategories(categoryData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories(null);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (category: Category, level = 0) => {
    if (!category.is_active) return null;

    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
      <div key={category.id} className={indentClass}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Level {category.level}</span>
                <span>Position: {category.position}</span>
                <span>{category.product_count} products</span>
              </div>
            </div>
            <Link
              href={`/categories/${category.id}`}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>

        {category.children_data && category.children_data.length > 0 && (
          <div className="ml-4">
            {category.children_data.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              ChillYourBeans
            </Link>
            <div className="flex space-x-4">
              <Link href="/products" className="text-gray-300 hover:text-white">
                Products
              </Link>
              <Link href="/categories" className="text-white font-medium">
                Categories
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Categories</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse our product categories to find exactly what you&apos;re looking for.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
              {error}
            </div>
          </div>
        ) : categories ? (
          <div className="space-y-4">
            {categories.children_data && categories.children_data.length > 0 ? (
              categories.children_data.map(category => renderCategory(category))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No categories found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No categories available.</p>
          </div>
        )}
      </main>
    </div>
  );
}