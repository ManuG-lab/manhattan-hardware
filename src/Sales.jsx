import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const API_URL = "https://manhattan-hardware-backend-1.onrender.com/products";
const SALES_URL = "https://manhattan-hardware-backend-1.onrender.com/sales";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [editSaleId, setEditSaleId] = useState(null);
  const [editSaleForm, setEditSaleForm] = useState({ dateSold: "", quantitySold: "" });

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

  const startEditSale = (sale) => {
    setEditSaleId(sale.id);
    setEditSaleForm({ dateSold: sale.dateSold || dayjs().format('YYYY-MM-DD'), quantitySold: sale.quantitySold || 0 });
  };

  const handleEditSaleChange = (e) => setEditSaleForm({ ...editSaleForm, [e.target.name]: e.target.value });

  const updateSale = async (id) => {
    const payload = { ...sales.find(s => s.id === id), dateSold: editSaleForm.dateSold, quantitySold: Number(editSaleForm.quantitySold) };
    await fetch(`${SALES_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const updated = await fetch(SALES_URL).then(r => r.json());
    setSales(updated);
    setEditSaleId(null);
  };

  const deleteSale = async (id) => {
    if (!confirm('Delete this sale?')) return;
    await fetch(`${SALES_URL}/${id}`, { method: 'DELETE' });
    const updated = await fetch(SALES_URL).then(r => r.json());
    setSales(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900">Sales History</h1>

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
                  <td className="p-1 sm:p-2">
                    {editSaleId === s.id ? (
                      <input type="date" name="dateSold" value={editSaleForm.dateSold} onChange={handleEditSaleChange} className="border p-1 text-xs" />
                    ) : (
                      dayjs(s.dateSold).format("DD MMM YYYY")
                    )}
                  </td>
                  <td className="p-1 sm:p-2">
                    {editSaleId === s.id ? (
                      <input name="quantitySold" value={editSaleForm.quantitySold} onChange={handleEditSaleChange} className="border p-1 text-xs" />
                    ) : (
                      s.quantitySold
                    )}
                  </td>
                  <td className="p-1 sm:p-2">KES {s.price}</td>
                  <td className="p-1 sm:p-2">KES {s.quantitySold * s.price}</td>
                  <td className="p-1 sm:p-2">
                    {editSaleId === s.id ? (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => updateSale(s.id)} className="btn-primary px-2 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditSaleId(null)} className="px-2 py-1 rounded border text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => startEditSale(s)} className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs">Edit</button>
                        <button onClick={() => deleteSale(s.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}