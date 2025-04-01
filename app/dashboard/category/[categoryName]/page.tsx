"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

const CategoryPage = () => {
  const { categoryName } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Products in {categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <h4 className="text-xl font-semibold text-gray-800">{product.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold text-gray-800 mt-4">${product.price}</p>
            <div className="mt-4">
              <button
                onClick={() => addToCart(product)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
