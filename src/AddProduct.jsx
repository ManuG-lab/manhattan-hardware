import React, { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/products";

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    dateReceived: dayjs().format("YYYY-MM-DD"),
    stockReceived: "",
    expiryDate: dayjs().add(1, 'year').format("YYYY-MM-DD")
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stockReceived: Number(form.stockReceived)
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // go back to inventory where products are fetched on mount
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Add New Product</h2>

        <form onSubmit={addProduct} className="bg-white p-4 rounded shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input className="border p-2" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
          <input className="border p-2" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input className="border p-2" name="price" placeholder="Price" value={form.price} onChange={handleChange} />

          <input className="border p-2" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
          <input className="border p-2" type="date" name="dateReceived" value={form.dateReceived} onChange={handleChange} />
          <input className="border p-2" name="stockReceived" placeholder="Stock Received" value={form.stockReceived} onChange={handleChange} />

          <input className="border p-2" type="date" name="expiryDate" placeholder="Expiry Date" value={form.expiryDate} onChange={handleChange} />

          <button className="col-span-1 sm:col-span-2 md:col-span-3 bg-blue-900 text-white py-2 rounded hover:opacity-90">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}
