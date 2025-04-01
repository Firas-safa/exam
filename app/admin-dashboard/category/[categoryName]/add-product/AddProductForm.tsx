'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

const AddProductForm = () => {
  const router = useRouter();
  const { categoryName } = useParams(); 

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<any>(null); 
  const [categories, setCategories] = useState<any[]>([]); 
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState<string | null>(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.data);
        setLoadingCategories(false); 
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      }
    };

    
    const fetchCategoryByName = async (name: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const category = response.data.data.find(
          (cat: any) => cat.title.toLowerCase() === name.toLowerCase()
        );

        if (category) {
          setCategory(category); 
        }
      } catch (error) {
        console.error("Error fetching category by name:", error);
      }
    };

    fetchCategories();

    if (typeof categoryName === 'string' && categoryName) {
      fetchCategoryByName(categoryName); 
    }
  }, [categoryName, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    setSuccess(null); 

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (category) {
        const response = await axios.post(
          "http://localhost:8080/api/products/admin",
          {
            title,
            description,
            price: parseFloat(price),
            categoryId: category.id, 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setSuccess('Product added successfully!');
          setTimeout(() => {
            router.push(`/admin-dashboard/category/${categoryName}`); 
          }, 1500); 
        }
      } else {
        console.error("Category not found.");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError("Product title must be unique.");
      } else {
        setError(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 bg-red-100 p-2 rounded-md">{error}</div>} 
        {success && <div className="text-green-500 bg-green-100 p-2 rounded-md">{success}</div>} 

        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Category</label>
          <input
            type="text"
            value={category?.title || categoryName} 
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50' : ''}`}
          disabled={loading || loadingCategories}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
