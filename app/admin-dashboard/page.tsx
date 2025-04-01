"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import SortableCategory from "./SortableCategory";

interface Category {
  id: number;
  title: string;
  description: string;
  positionOrder: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string | null>(null);

  // Fetch user's full name from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullName(localStorage.getItem("fullName"));
    }
  }, []);

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const roles = localStorage.getItem("role")?.split(",") || [];
    if (!roles.includes("ADMIN")) {
      router.push("/dashboard");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedCategories = response.data.data.sort(
        (a: { positionOrder: number }, b: { positionOrder: number }) => 
          a.positionOrder - b.positionOrder
      );

      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/categories/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newCategories = categories.filter((category) => category.id !== id);
      setCategories(newCategories);

      await axios.put(
        "http://localhost:8080/api/categories/admin/update-order",
        newCategories.map((category) => category.id),
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Handle Drag End
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((category) => category.id === active.id);
    const newIndex = categories.findIndex((category) => category.id === over.id);
    const newCategories = arrayMove(categories, oldIndex, newIndex);

    setCategories(newCategories);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/categories/admin/update-order",
        newCategories.map((category) => category.id),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating category order:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        {fullName && <h2 className="text-2xl font-semibold text-gray-800">Welcome, {fullName}</h2>}
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => router.push("/admin-dashboard/add-category")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Category
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((category) => category.id)} strategy={horizontalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <SortableCategory key={category.id} category={category} handleDeleteCategory={handleDeleteCategory} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AdminDashboard;
