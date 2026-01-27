//login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const VALID_USER = {
  username: "Duncan-Njaramba",
  password: "0721412592"
};

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (username === VALID_USER.username && password === VALID_USER.password) {
      const user = { username, loggedAt: dayjs().format() };
      onLogin(user);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Sign In</h2>
        <p className="text-sm text-gray-600 mb-4">Manhattan Enterprises ltd — Inventory access</p>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Duncan-Njaramba"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Your password"
            />
          </div>

          <button className="w-full bg-blue-900 text-white py-2 rounded">Sign in</button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <div>Test credentials:</div>
          <div><strong>username:</strong> Duncan-Njaramba</div>
          <div><strong>password:</strong> 0721412592</div>
        </div>
      </div>
    </div>
  );
}
