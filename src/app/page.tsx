import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">
              ChillYourBeans
            </div>
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

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl">
            Welcome to ChillYourBeans
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            Your premium coffee destination powered by Next.js and Magento
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/products"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/categories"
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Shop by Category
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Coffee</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sourced directly from the finest coffee farms around the world
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fresh Roasted</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Roasted to perfection and delivered fresh to your doorstep
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expert Curation</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Hand-selected by our coffee experts for exceptional quality
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
