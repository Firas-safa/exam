'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";

const UpdateProductForm = ({ categoryName }: { categoryName: string }) => {
  const router = useRouter();
  const { productId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchProductById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/products/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.data) {
          const product = response.data.data;
          setTitle(product.title);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category);
        } else {
          setError("Product not found.");
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Product not found.");
      }
    };

    fetchCategories();
    if (productId) {
      fetchProductById();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (!category) {
        setError("Category not found.");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/products/admin/${productId}`,
        {
          title,
          description,
          price: parseFloat(price),
          categoryId: category.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push(`/admin-dashboard/category/${categoryName}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Product</h2>
      {error && <div className="text-red-500 bg-red-100 p-2 rounded-md">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Category</label>
          <select
            value={category?.title || ""}
            onChange={(e) => {
              const selectedCategory = categories.find((cat) => cat.title === e.target.value);
              setCategory(selectedCategory);
            }}
            required
            disabled={loadingCategories}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loadingCategories ? <option>Loading categories...</option> : categories.map((cat) => (
              <option key={cat.id} value={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50' : ''}`} disabled={loading || loadingCategories}>
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;