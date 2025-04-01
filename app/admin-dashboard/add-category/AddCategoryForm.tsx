'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddCategoryForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCheckingAccess(true);
    try {
      const roles = localStorage.getItem("role")?.split(",") || [];
      if (!roles.includes('ADMIN')) {
        router.replace('/dashboard'); 
      } else {
        setCheckingAccess(false);
      }
    } catch {
      setCheckingAccess(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/categories/admin',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Response Status:', response.status);  
      if (response.status === 200) {
        setSuccess('Category added successfully!');
        setTimeout(() => {
          console.log('Redirecting to /admin-dashboard...');
          router.push('/admin-dashboard');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error adding category:', err);  
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <div className="p-6 bg-white shadow-md rounded-md text-center">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-semibold mb-4">Add Category</h1>

      {error && <div className="text-red-500 bg-red-100 p-2 rounded-md">{error}</div>}
      {success && <div className="text-green-500 bg-green-100 p-2 rounded-md">{success}</div>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Category Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          disabled={checkingAccess || loading}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Category Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          disabled={checkingAccess || loading}
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
        disabled={checkingAccess || loading}
      >
        {loading ? 'Adding Category...' : 'Add Category'}
      </button>
    </form>
  );
};

export default AddCategoryForm;
