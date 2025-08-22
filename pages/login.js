// pages/login.js
import React from "react";

const USERS = [
  { email: "a.ford@fsgsolutions.net", password: "FSG123$%^" },      // You
  { email: "a.sweet@fsgsolutions.net", password: "FSG123$%^" },     // Anthony
  { email: "u.gonzales@fsgsolutions.net", password: "FSG123$%^" },  // Ubaldo
];

export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const foundUser = USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("roza_user", foundUser.email);
      alert(`Welcome, ${foundUser.email}!`);
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          ROZA Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
