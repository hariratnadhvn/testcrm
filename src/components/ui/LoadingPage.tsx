import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
    </div>
  );
}