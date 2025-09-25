'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { magentoAPI } from '@/lib/magento-api';
import type { MagentoProduct } from '@/lib/magento-api';
import Footer from '@/components/Footer';

export default function CoffeePage() {
  const [products, setProducts] = useState<MagentoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCoffeeProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch products from Coffee category (category ID: 3)
      const result = await magentoAPI.getProductsByCategory(3, 50, 1);

      setProducts(result.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coffee products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoffeeProducts();
  }, [fetchCoffeeProducts]);

  const getCustomAttribute = (product: MagentoProduct, attributeCode: string): string => {
    const attr = product.custom_attributes?.find(a => a.attribute_code === attributeCode);
    return attr ? String(attr.value) : '';
  };

  const getProductImage = (product: MagentoProduct): string => {
    const imageAttr = getCustomAttribute(product, 'image');
    return magentoAPI.getImageUrl(imageAttr) || '/placeholder-product.jpg';
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile burger menu button (replaces logo on mobile) */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop logo (hidden on mobile) */}
            <div className="hidden md:block text-2xl font-bold text-white">
              <Link href="/">CYB Coffee Co.</Link>
            </div>

            {/* Centered desktop navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/coffee" className="text-white font-medium transition-colors">
                Coffee
              </Link>
              <Link href="/equipment" className="text-gray-300 hover:text-white transition-colors">
                Equipment
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search icon */}
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </button>

              {/* Account icon */}
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Cart/Basket icon */}
              <button className="text-white hover:text-gray-300 transition-colors relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h8a2 2 0 002-2V7M8 7h12" />
                </svg>
                {/* Cart count badge */}
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/coffee"
                  className="text-white font-medium block px-3 py-2 text-base transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Coffee
                </Link>
                <Link
                  href="/equipment"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Equipment
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Coffee</h1>
          <p className="text-gray-600">
            Discover our premium selection of coffee beans, sourced directly from the finest farms around the world.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No coffee products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white">
                <Link href={`/products/${product.sku}`}>
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-black">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-800">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}