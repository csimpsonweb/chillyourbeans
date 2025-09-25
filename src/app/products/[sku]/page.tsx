'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { magentoAPI } from '@/lib/magento-api';
import type { MagentoProduct } from '@/lib/magento-api';

export default function ProductDetailPage() {
  const params = useParams();
  const sku = params.sku as string;

  const [product, setProduct] = useState<MagentoProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!sku) return;
    try {
      setLoading(true);
      const productData = await magentoAPI.getProductBySku(decodeURIComponent(sku));
      setProduct(productData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [sku]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const getCustomAttribute = (attributeCode: string): string => {
    if (!product) return '';
    const attr = product.custom_attributes?.find(a => a.attribute_code === attributeCode);
    return attr ? String(attr.value) : '';
  };

  const getProductImage = (): string => {
    const imageAttr = getCustomAttribute('image');
    return magentoAPI.getImageUrl(imageAttr) || '/placeholder-product.jpg';
  };

  const getDescription = (): string => {
    return getCustomAttribute('description') || 'No description available.';
  };

  const getShortDescription = (): string => {
    return getCustomAttribute('short_description') || '';
  };

  if (loading) {
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

  if (error || !product) {
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
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="text-center py-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto dark:bg-red-900 dark:border-red-700 dark:text-red-300">
            {error || 'Product not found'}
          </div>
          <Link href="/products" className="inline-block mt-4 text-gray-800 hover:text-gray-600 dark:text-gray-300">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/categories" className="text-gray-300 hover:text-white">
                Categories
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products" className="text-gray-800 hover:text-gray-600 dark:text-gray-300">
            ← Back to Products
          </Link>
        </div>

        <div className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Image
                src={getProductImage()}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </p>
              </div>

              {getShortDescription() && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {getShortDescription()}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Product Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-white capitalize">{product.type_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="text-white">{product.weight} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`${product.status === 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {product.status === 1 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.status !== 1}
                >
                  {product.status === 1 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Description
            </h3>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: getDescription() }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}