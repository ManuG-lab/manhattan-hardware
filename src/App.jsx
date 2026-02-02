import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Sales from "./Sales";
import AddProduct from "./AddProduct";
import Login from "./Login";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PRODUCTS_URL = "https://manhattan-hardware-backend-1.onrender.com/products";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sales, setSales] = useState([]);
  const [sellVariantId, setSellVariantId] = useState(null);
  const [sellQty, setSellQty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch(PRODUCTS_URL);
        const products = await productsRes.json();
        setProducts(products);

        const allVariants = [];
        for (const p of products) {
          const res = await fetch(`${PRODUCTS_URL}/${p.id}/variants`);
          const data = await res.json();
          allVariants.push(...data);
        }
        setVariants(allVariants);

        const salesRes = await fetch("https://manhattan-hardware-backend-1.onrender.com/sales");
        const salesData = await salesRes.json();
        setSales(salesData);
      } catch (error) {
        toast.error("Failed to load inventory data");
      }
    };
    fetchData();
  }, []);

  const sellVariant = async (variant) => {
    const qty = Number(sellQty);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const currentStock = getCurrentStock(variant.id);
    if (qty > currentStock) {
      toast.error(`Only ${currentStock} items available in stock`);
      return;
    }

    try {
      await fetch("https://manhattan-hardware-backend-1.onrender.com/sales", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          variantId: variant.id,
          quantitySold: qty,
          price: variant.price
        })
      });
      setSellVariantId(null);
      setSellQty("");
      // Reload variants and sales
      const res = await fetch(`${PRODUCTS_URL}/${variant.product_id}/variants`);
      const data = await res.json();
      setVariants(prev => [...prev.filter(v => v.product_id !== variant.product_id), ...data]);
      const salesRes = await fetch("https://manhattan-hardware-backend-1.onrender.com/sales");
      setSales(await salesRes.json());
      toast.success(`Sold ${qty} x ${variant.size} for KES ${qty * variant.price}`);
    } catch (error) {
      toast.error("Failed to complete sale");
    }
  };

  const getCurrentStock = (variantId) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return 0;
    const sold = sales.filter(s => s.variant_id === variantId).reduce((sum, s) => sum + s.quantity_sold, 0);
    return variant.stock_received - sold;
  };

  const filteredProducts = products.filter(p => 
    (filterCategory === "" || p.category === filterCategory) &&
    (searchName === "" || p.name.toLowerCase().includes(searchName.toLowerCase()))
  );

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Inventory</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-300 min-w-[600px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Product Name</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Date Received</th>
            <th className="border border-gray-300 p-2">Expiry Date</th>
            <th className="border border-gray-300 p-2">Size</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Stock</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => {
            const productVariants = variants.filter(v => v.product_id === p.id);
            return productVariants.length > 0 ? productVariants.map((v, index) => (
              <tr key={v.id} className="border border-gray-300">
                {index === 0 && (
                  <>
                    <td className="border border-gray-300 p-2" rowSpan={productVariants.length}>{p.name}</td>
                    <td className="border border-gray-300 p-2" rowSpan={productVariants.length}>{p.category}</td>
                    <td className="border border-gray-300 p-2" rowSpan={productVariants.length}>{dayjs(p.date_received).format('DD/MM/YYYY')}</td>
                    <td className="border border-gray-300 p-2" rowSpan={productVariants.length}>{dayjs(p.expiry_date).format('DD/MM/YYYY')}</td>
                  </>
                )}
                <td className="border border-gray-300 p-2">{v.size}</td>
                <td className="border border-gray-300 p-2">KES {v.price}</td>
                <td className="border border-gray-300 p-2">{getCurrentStock(v.id)}</td>
                <td className="border border-gray-300 p-2">
                  {sellVariantId === v.id ? (
                    <>
                      <input
                        value={sellQty}
                        onChange={e => setSellQty(e.target.value)}
                        className="border p-1 w-20 mr-2"
                        placeholder="Qty"
                      />
                      <button
                        onClick={() => sellVariant(v)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Sell
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSellVariantId(v.id)}
                      className="bg-blue-900 text-white px-2 py-1 rounded"
                    >
                      Sell
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr key={p.id} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2">{p.category}</td>
                <td className="border border-gray-300 p-2">{dayjs(p.date_received).format('DD/MM/YYYY')}</td>
                <td className="border border-gray-300 p-2">{dayjs(p.expiry_date).format('DD/MM/YYYY')}</td>
                <td className="border border-gray-300 p-2" colSpan="4">No variants available</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <Inventory/> : <Navigate to="/login"/>}/>
          <Route path="/add" element={user ? <AddProduct/> : <Navigate to="/login"/>}/>
          <Route path="/sales" element={user ? <Sales/> : <Navigate to="/login"/>}/>
          <Route path="/login" element={<Login onLogin={setUser}/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
