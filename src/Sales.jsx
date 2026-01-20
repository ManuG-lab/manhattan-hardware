import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const API_URL = "https://manhattan-hardware-backend-1.onrender.com/products";
const SALES_URL = "https://manhattan-hardware-backend-1.onrender.com/sales";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data));
    fetch(SALES_URL)
      .then(res => res.json())
      .then(data => setSales(data));
  }, []);

  const getProductName = (productId) => {
    const product = products.find(p => p.id == productId);
    return product ? product.name : "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Sales History</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-1 sm:p-2">Sale ID</th>
              <th className="p-1 sm:p-2">Product</th>
              <th className="p-1 sm:p-2">Date Sold</th>
              <th className="p-1 sm:p-2">Quantity Sold</th>
              <th className="p-1 sm:p-2">Price</th>
              <th className="p-1 sm:p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id} className="border-t text-center">
                <td className="p-1 sm:p-2">{s.id}</td>
                <td className="p-1 sm:p-2">{getProductName(s.productId)}</td>
                <td className="p-1 sm:p-2">{dayjs(s.dateSold).format("DD MMM YYYY")}</td>
                <td className="p-1 sm:p-2">{s.quantitySold}</td>
                <td className="p-1 sm:p-2">KES {s.price}</td>
                <td className="p-1 sm:p-2">KES {s.quantitySold * s.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}