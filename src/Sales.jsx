import React, { useEffect, useState } from "react";

const SALES_URL = "https://manhattan-hardware-backend-1.onrender.com/sales";
const PRODUCTS_URL = "https://manhattan-hardware-backend-1.onrender.com/products";

export default function Sales() {
  const [sales,setSales]=useState([]);
  const [products,setProducts]=useState([]);
  const [variants,setVariants]=useState([]);

  useEffect(()=>{
    fetch(SALES_URL).then(r=>r.json()).then(setSales);
    fetch(PRODUCTS_URL).then(r=>r.json()).then(setProducts);
  },[]);

  const getVariant = (id)=>variants.find(v=>v.id===id);
  const getProductName = (pid)=>products.find(p=>p.id===pid)?.name;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {sales.map(s=>(
        <div key={s.id} className="border p-2 mb-2">
          Variant: {s.variant_id}<br/>
          Qty: {s.quantity_sold}<br/>
          Price: {s.price}<br/>
          Total: {s.quantity_sold * s.price}
        </div>
      ))}
    </div>
  );
}
