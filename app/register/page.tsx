"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    password: "",
    roles: [{ roleName: "USER", roleDescription: "User role" }], 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
    const roles = selectedRoles.map(role => ({
      roleName: role,
      roleDescription: role === "USER" ? "User role" : "Admin role", 
    }));
    setFormData({ ...formData, roles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:8080/registerNewUser", formData);

      if (response.data.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login"); 
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Registration successful! Redirecting...</p>}

        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg mb-2"
          required
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg mb-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg mb-2"
          required
        />

        <select
          name="roles"
          multiple
          onChange={handleRoleChange}
          className="w-full px-3 py-2 border rounded-lg mb-2"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
