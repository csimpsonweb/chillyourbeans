'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { magentoAPI } from '@/lib/magento-api';
import type { MagentoProduct, MagentoCategory } from '@/lib/magento-api';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  const [category, setCategory] = useState<MagentoCategory | null>(null);
  const [products, setProducts] = useState<MagentoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  const fetchCategoryAndProducts = useCallback(async () => {
    if (!categoryId) return;
    try {
      setLoading(true);

      const [categoryData, productsData] = await Promise.all([
        magentoAPI.getCategoryById(categoryId),
        magentoAPI.getProductsByCategory(categoryId, pageSize, currentPage)
      ]);

      setCategory(categoryData);
      setProducts(productsData.items);
      setTotalCount(productsData.total_count);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category data');
      setCategory(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, currentPage, pageSize]);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [fetchCategoryAndProducts]);

  const getCustomAttribute = (product: MagentoProduct, attributeCode: string): string => {
    const attr = product.custom_attributes?.find(a => a.attribute_code === attributeCode);
    return attr ? String(attr.value) : '';
  };

  const getProductImage = (product: MagentoProduct): string => {
    const imageAttr = getCustomAttribute(product, 'image');
    return magentoAPI.getImageUrl(imageAttr) || '/placeholder-product.jpg';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <nav className="bg-black shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-white">
                ChillYourBeans
              </Link>
              <div className="flex space-x-4">
                <Link href="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <nav className="bg-black shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-white">
                ChillYourBeans
              </Link>
              <div className="flex space-x-4">
                <Link href="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="text-center py-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto dark:bg-red-900 dark:border-red-700 dark:text-red-300">
            {error || 'Category not found'}
          </div>
          <Link href="/categories" className="inline-block mt-4 text-gray-800 hover:text-gray-600 dark:text-gray-300">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              ChillYourBeans
            </Link>
            <div className="flex space-x-4">
              <Link href="/products" className="text-gray-300 hover:text-white">
                Products
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-white">
                Categories
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4">
            <Link href="/categories" className="text-gray-800 hover:text-gray-600 dark:text-gray-300">
              ← Back to Categories
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>Level {category.level}</span>
            <span>Position: {category.position}</span>
            <span>{category.product_count} products</span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No products found in this category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-black rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.sku}`}>
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Previous
                </button>
                <span className="text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {products.length} of {totalCount} products in {category.name}
            </div>
          </>
        )}
      </main>
    </div>
  );
}