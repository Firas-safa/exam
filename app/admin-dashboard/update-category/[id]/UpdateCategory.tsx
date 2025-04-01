'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const UpdateCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [category, setCategory] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setCheckingAccess(true);
    try {
      const roles = localStorage.getItem('role')?.split(',') || [];
      if (!roles.includes('ADMIN')) {
        router.replace('/dashboard');
        return;
      }
      
      if (!categoryId) {
        setError('Invalid Category ID');
        return;
      }
      
      const fetchCategory = async () => {
        setLoading(true);
        setError(null);

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }

          const response = await axios.get(`http://localhost:8080/api/categories/${categoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data?.data) {
            setCategory({
              title: response.data.data.title,
              description: response.data.data.description,
            });
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error fetching category');
        } finally {
          setLoading(false);
          setCheckingAccess(false);
        }
      };

      fetchCategory();
    } catch {
      setCheckingAccess(false);
    }
  }, [categoryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!category.title || !category.description) {
      setError('Both title and description are required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/categories/admin/${categoryId}`,
        { title: category.title, description: category.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccess('Category updated successfully!');
        setTimeout(() => router.push('/admin-dashboard'), 1500);
      } else {
        setError('Failed to update category');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating category');
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
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-semibold mb-4">Update Category</h1>

      {error && <div className="text-red-500 bg-red-100 p-2 rounded-md mb-2">{error}</div>}
      {success && <div className="text-green-500 bg-green-100 p-2 rounded-md mb-2">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Category Title
          </label>
          <input
            type="text"
            id="title"
            value={category.title}
            onChange={(e) => setCategory({ ...category, title: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter category title"
            required
            disabled={checkingAccess || loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Category Description
          </label>
          <textarea
            id="description"
            value={category.description}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter category description"
            required
            disabled={checkingAccess || loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
          disabled={checkingAccess || loading}
        >
          {loading ? 'Updating...' : 'Update Category'}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategoryPage;
