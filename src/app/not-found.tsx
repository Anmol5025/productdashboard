import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404</h2>
        <p className="text-lg text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          Go back home
        </Link>
      </div>
    </div>
  );
}
