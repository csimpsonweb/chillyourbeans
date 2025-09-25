'use client';

import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans min-h-screen bg-white">
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
              <Link href="/">ChillYourBeans</Link>
            </div>

            {/* Centered desktop navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                Categories
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
                  href="/products"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black sm:text-6xl">
            Welcome to ChillYourBeans
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Your premium coffee destination powered by Next.js and Magento
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/products"
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/categories"
              className="bg-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Shop by Category
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black">Premium Coffee</h3>
            <p className="text-gray-600 mt-2">
              Sourced directly from the finest coffee farms around the world
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black">Fresh Roasted</h3>
            <p className="text-gray-600 mt-2">
              Roasted to perfection and delivered fresh to your doorstep
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black">Expert Curation</h3>
            <p className="text-gray-600 mt-2">
              Hand-selected by our coffee experts for exceptional quality
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
