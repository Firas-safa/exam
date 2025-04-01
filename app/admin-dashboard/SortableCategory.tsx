"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Category {
  id: number;
  title: string;
  description: string;
}

interface SortableCategoryProps {
  category: Category;
  handleDeleteCategory: (categoryId: number) => void;
}

const SortableCategory: React.FC<SortableCategoryProps> = ({ category, handleDeleteCategory }) => {
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

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
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 rounded-lg hover:bg-gray-200 transition"
        title="Drag to reorder"
      >
        <GripVertical className="text-gray-600" />
      </div>

      <div
        className="flex-grow cursor-pointer"
        onClick={() => router.push(`/admin-dashboard/category/${category.title}`)}
      >
        <h4 className="text-xl font-semibold text-gray-800">{category.title}</h4>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            router.push(`/admin-dashboard/update-category/${category.id}`);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Update
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            handleDeleteCategory(category.id);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SortableCategory;
