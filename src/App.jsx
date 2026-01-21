import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import dayjs from "dayjs";
import Sales from "./Sales";
import AddProduct from "./AddProduct";

const API_URL = "https://manhattan-hardware-backend-1.onrender.com/products";
const SALES_URL = "https://manhattan-hardware-backend-1.onrender.com/sales";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    dateReceived: dayjs().format("YYYY-MM-DD"),
    stockReceived: "",
    expiryDate: dayjs().add(1, 'year').format("YYYY-MM-DD")
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ dateSold: "", quantitySold: "" });
  const [filters, setFilters] = useState({ name: "", category: "", price: "" });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data));
    fetch(SALES_URL)
      .then(res => res.json())
      .then(data => setSales(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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

    const updated = await fetch(API_URL).then(res => res.json());
    setProducts(updated);

    setForm({
      name: "",
      category: "",
      price: "",
      image: "",
      dateReceived: dayjs().format("YYYY-MM-DD"),
      stockReceived: "",
      expiryDate: dayjs().add(1, 'year').format("YYYY-MM-DD")
    });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      dateSold: dayjs().format("YYYY-MM-DD"),
      quantitySold: ""
    });
  };

  const addSale = async (id) => {
    const product = products.find(p => p.id === id);
    const payload = {
      productId: id,
      dateSold: editForm.dateSold,
      quantitySold: Number(editForm.quantitySold),
      price: product.price
    };

    await fetch(SALES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const updatedSales = await fetch(SALES_URL).then(res => res.json());
    setSales(updatedSales);
    setEditingId(null);
  };

  const calculateTotalStock = (received) => received;
  const calculateTotalSold = (productId) => sales.filter(s => s.productId == productId).reduce((sum, s) => sum + s.quantitySold, 0);
  const calculateBalance = (received, productId) => received - calculateTotalSold(productId);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    p.category.toLowerCase().includes(filters.category.toLowerCase()) &&
    (filters.price === "" || p.price >= Number(filters.price))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Manhattan Enterprises ltd</h1>
          <p className="text-sm text-gray-600 hidden sm:block">Inventory Management Platform</p>
        </div>

        {/* CTA to Add Product */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <input className="border p-2" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} />
            <input className="border p-2" name="category" placeholder="Filter by Category" value={filters.category} onChange={handleFilterChange} />
            <input className="border p-2" name="price" placeholder="Min Price" value={filters.price} onChange={handleFilterChange} />
          </div>
          <div className="flex gap-2">
            <Link to="/add" className="bg-blue-900 text-white px-4 py-2 rounded hover:opacity-90">Add Product</Link>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-1 sm:p-2">Image</th>
                <th className="p-1 sm:p-2">Product</th>
                <th className="p-1 sm:p-2">Category</th>
                <th className="p-1 sm:p-2">Price</th>
                <th className="p-1 sm:p-2 hidden md:table-cell">Date Received</th>
                <th className="p-1 sm:p-2">Stock Received</th>
                <th className="p-1 sm:p-2">Total Stock</th>
                <th className="p-1 sm:p-2">Total Sold</th>
                <th className="p-1 sm:p-2">Balance</th>
                <th className="p-1 sm:p-2 hidden lg:table-cell">Expiry Date</th>
                <th className="p-1 sm:p-2">Sell</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const isExpiringSoon = dayjs(p.expiryDate).diff(dayjs(), 'day') <= 30;
                const totalSold = calculateTotalSold(p.id);
                return (
                  <tr key={p.id} className={`border-t text-center ${isExpiringSoon ? 'bg-red-100' : ''}`}>
                    <td className="p-1 sm:p-2">
                      <img src={p.image} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover mx-auto rounded" />
                    </td>
                    <td className="p-1 sm:p-2">{p.name}</td>
                    <td className="p-1 sm:p-2">{p.category}</td>
                    <td className="p-1 sm:p-2">KES {p.price}</td>
                    <td className="p-1 sm:p-2 hidden md:table-cell">{dayjs(p.dateReceived).format("DD MMM YYYY")}</td>
                    <td className="p-1 sm:p-2">{p.stockReceived}</td>
                    <td className="p-1 sm:p-2 font-semibold">
                      {calculateTotalStock(p.stockReceived)}
                    </td>
                    <td className="p-1 sm:p-2">{totalSold}</td>
                    <td className={`p-1 sm:p-2 font-bold ${calculateBalance(p.stockReceived, p.id) < 10 ? "text-red-600" : ""}`}>
                      {calculateBalance(p.stockReceived, p.id)}
                    </td>
                    <td className="p-1 sm:p-2 hidden lg:table-cell">{dayjs(p.expiryDate).format("DD MMM YYYY")}</td>
                    <td className="p-1 sm:p-2">
                      {editingId === p.id ? (
                        <div className="flex flex-col gap-1">
                          <input
                            type="date"
                            name="dateSold"
                            value={editForm.dateSold}
                            onChange={handleEditChange}
                            className="border p-1 text-xs"
                          />
                          <input
                            name="quantitySold"
                            placeholder="Quantity"
                            value={editForm.quantitySold}
                            onChange={handleEditChange}
                            className="border p-1 text-xs"
                          />
                          <button
                            onClick={() => addSale(p.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:opacity-90 text-xs"
                          >
                            Add Sale
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="bg-blue-900 text-white px-2 py-1 rounded hover:opacity-90 text-xs"
                        >
                          Sell Item
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-blue-900 font-bold">M</div>
            <div>
              <div className="font-bold">Manhattan Enterprises ltd</div>
              <div className="text-xs text-gray-200">Hardware Inventory</div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-white hover:underline">Inventory</Link>
            <Link to="/add" className="text-white hover:underline">Add Product</Link>
            <Link to="/sales" className="text-white hover:underline">Sales</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-gray-200">
        <div className="max-w-6xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center">
          <div>© {new Date().getFullYear()} Manhattan Enterprises ltd</div>
          <div className="text-sm text-gray-400">Built for internal inventory management</div>
        </div>
      </footer>
    </div>
  );
}
