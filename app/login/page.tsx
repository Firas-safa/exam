"use client";

import LoginForm from "./LoginForm";  

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
