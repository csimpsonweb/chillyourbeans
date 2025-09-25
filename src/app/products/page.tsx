'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { magentoAPI } from '@/lib/magento-api';
import type { MagentoProduct } from '@/lib/magento-api';

export default function ProductsPage() {
  const [products, setProducts] = useState<MagentoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let result;

      if (search.trim()) {
        result = await magentoAPI.searchProducts(search.trim(), pageSize);
      } else {
        result = await magentoAPI.getProducts({
          pageSize,
          currentPage,
          sortOrders: [{ field: 'name', direction: 'ASC' }]
        });
      }

      setProducts(result.items);
      setTotalCount(result.total_count);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getCustomAttribute = (product: MagentoProduct, attributeCode: string): string => {
    const attr = product.custom_attributes?.find(a => a.attribute_code === attributeCode);
    return attr ? String(attr.value) : '';
  };

  const getProductImage = (product: MagentoProduct): string => {
    const imageAttr = getCustomAttribute(product, 'image');
    return magentoAPI.getImageUrl(imageAttr) || '/placeholder-product.jpg';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              ChillYourBeans
            </Link>
            <div className="flex space-x-4">
              <Link href="/products" className="text-white font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Products</h1>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </form>
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
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
              Showing {products.length} of {totalCount} products
            </div>
          </>
        )}
      </main>
    </div>
  );
}