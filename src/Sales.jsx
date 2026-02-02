import React, { useEffect, useState } from "react";

const SALES_URL = "https://manhattan-hardware-backend-1.onrender.com/sales";
const PRODUCTS_URL = "https://manhattan-hardware-backend-1.onrender.com/products";

export default function Sales() {
  const [sales,setSales]=useState([]);
  const [products,setProducts]=useState([]);
  const [variants,setVariants]=useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      const salesRes = await fetch(SALES_URL);
      setSales(await salesRes.json());

      const productsRes = await fetch(PRODUCTS_URL);
      const productsData = await productsRes.json();
      setProducts(productsData);

      const allVariants = [];
      for (const p of productsData) {
        const res = await fetch(`${PRODUCTS_URL}/${p.id}/variants`);
        const data = await res.json();
        allVariants.push(...data);
      }
      setVariants(allVariants);
    };
    fetchData();
  },[]);

  const getVariant = (id)=>variants.find(v=>v.id===id);
  const getProductName = (pid)=>products.find(p=>p.id===pid)?.name;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-300 min-w-[500px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Product Name</th>
            <th className="border border-gray-300 p-2">Variant ID</th>
            <th className="border border-gray-300 p-2">Quantity Sold</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s=>(
            <tr key={s.id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{getProductName(getVariant(s.variant_id)?.product_id) || 'Unknown'}</td>
              <td className="border border-gray-300 p-2">{s.variant_id}</td>
              <td className="border border-gray-300 p-2">{s.quantity_sold}</td>
              <td className="border border-gray-300 p-2">KES {s.price}</td>
              <td className="border border-gray-300 p-2">KES {s.quantity_sold * s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
