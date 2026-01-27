import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import dayjs from "dayjs";
import Sales from "./Sales";
import AddProduct from "./AddProduct";
import Login from "./Login";

const PRODUCTS_URL = "https://manhattan-hardware-backend-1.onrender.com/products";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sellVariantId, setSellVariantId] = useState(null);
  const [sellQty, setSellQty] = useState("");

  useEffect(() => {
    fetch(PRODUCTS_URL).then(r => r.json()).then(setProducts);
  }, []);

  const loadVariants = async (productId) => {
    const res = await fetch(`${PRODUCTS_URL}/${productId}/variants`);
    const data = await res.json();
    setVariants(data);
  };

  const sellVariant = async (variant) => {
    await fetch("https://manhattan-hardware-backend-1.onrender.com/sales", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        variantId: variant.id,
        quantitySold: Number(sellQty),
        price: variant.price
      })
    });
    setSellVariantId(null);
    setSellQty("");
    loadVariants(variant.product_id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory</h1>

      {products.map(p => (
        <div key={p.id} className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">
            {p.name} — {p.category}
          </h2>

          <button
            onClick={() => loadVariants(p.id)}
            className="text-sm text-blue-600 underline"
          >
            View Sizes
          </button>

          {variants.filter(v => v.product_id === p.id).map(v => (
            <div key={v.id} className="flex items-center gap-4 mt-2 border p-2">
              <div><b>Size:</b> {v.size}</div>
              <div><b>Price:</b> KES {v.price}</div>
              <div><b>Stock:</b> {v.stock_received}</div>

              {sellVariantId === v.id ? (
                <>
                  <input
                    value={sellQty}
                    onChange={e => setSellQty(e.target.value)}
                    className="border p-1 w-20"
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
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <Routes>
      <Route path="/" element={user ? <Inventory/> : <Navigate to="/login"/>}/>
      <Route path="/add" element={user ? <AddProduct/> : <Navigate to="/login"/>}/>
      <Route path="/sales" element={user ? <Sales/> : <Navigate to="/login"/>}/>
      <Route path="/login" element={<Login onLogin={setUser}/>}/>
    </Routes>
  );
}
