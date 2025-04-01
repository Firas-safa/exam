"use client";
import React from "react";
import { useParams } from "next/navigation";
import UpdateProductForm from "./UpdateProductForm";

const UpdateProductPage = () => {
  const { categoryName } = useParams();

  const category = Array.isArray(categoryName) ? categoryName[0] : categoryName;

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <UpdateProductForm categoryName={category} /> 
    </div>
  );
};

export default UpdateProductPage;
