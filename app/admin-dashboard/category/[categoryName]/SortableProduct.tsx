"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

interface SortableProductProps {
  product: Product;
  handleDeleteProduct: (productId: number) => void;
}

const SortableProduct: React.FC<SortableProductProps> = ({ product, handleDeleteProduct }) => {
  const { categoryName } = useParams();
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow flex items-center gap-4"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 rounded-lg hover:bg-gray-200 transition"
        title="Drag to reorder"
      >
        <GripVertical className="text-gray-600" />
      </div>

      {/* Product Content (Clickable) */}
      <div
        className="flex-grow cursor-pointer"
      >
        <h4 className="text-xl font-semibold text-gray-800">{product.title}</h4>
        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
        <p className="text-lg font-bold text-gray-800 mt-4">${product.price}</p>
      </div>

      {/* Action Buttons (Not Draggable) */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            router.push(`/admin-dashboard/category/${categoryName}/update-product/${product.id}`);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Update
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            handleDeleteProduct(product.id);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SortableProduct;
