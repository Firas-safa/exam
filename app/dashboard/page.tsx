"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Category {
  id: number;
  title: string;
  description: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
}

const UserDashboard = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string | null>(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const roles = localStorage.getItem("role")?.split(",") || [];
      if (roles.includes("USER") || roles.includes("ADMIN")) {
        try {
          const response = await axios.get("http://localhost:8080/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setLoading(false);
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            handleLogout();
          }
        }
      } else {
        router.push("/login");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullName(localStorage.getItem("fullName"));
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    router.push("/login");
  };

  // Loading state
  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          {fullName && (
            <h2 className="text-2xl font-semibold text-gray-800">Welcome, {fullName}</h2>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => router.push("dashboard/view-cart")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            View Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/category/${category.title}`)} // Navigates to the product category page
          >
            <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
