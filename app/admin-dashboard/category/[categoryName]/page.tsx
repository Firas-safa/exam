"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableProduct from "./SortableProduct";

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
  positionOrder: number;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/products/category/${categoryName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sortedProducts = response.data.data.sort(
          (a: { positionOrder: number }, b: { positionOrder: number }) => 
            a.positionOrder - b.positionOrder
        );
        setProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        setError("Error fetching products");
        setLoading(false);
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleDeleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axios.delete(`http://localhost:8080/api/products/admin/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      setError("Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((product) => product.id === active.id);
    const newIndex = products.findIndex((product) => product.id === over.id);
    const newProducts = arrayMove(products, oldIndex, newIndex);

    setProducts(newProducts);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/products/admin/update-order",
        newProducts.map((product) => product.id),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating product order:", error);
      setError("Error updating product order");
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Products in {categoryName}</h2>
        <button
          onClick={() => router.push(`/admin-dashboard/category/${categoryName}/add-product`)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Add Product
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={products.map((product) => product.id)} strategy={horizontalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <SortableProduct key={product.id} product={product} handleDeleteProduct={handleDeleteProduct} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CategoryPage;
