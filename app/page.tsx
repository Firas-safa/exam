import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our E-Commerce Platform</h1>
        <p className="mb-4 text-lg">Please <Link href="/login" className="text-blue-500">login</Link> to continue.</p>
        <p className="mb-4 text-lg">Or <Link href="/register" className="text-blue-500">register</Link> to continue.</p>

      </div>
    </div>
  );
}
