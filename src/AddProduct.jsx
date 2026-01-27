import React, { useState } from "react";

const PRODUCTS_URL = "https://manhattan-hardware-backend-1.onrender.com/products";
const VARIANTS_URL = "https://manhattan-hardware-backend-1.onrender.com/variants";

export default function AddProduct() {
  const [product, setProduct] = useState({ name:"", category:"" });
  const [variants, setVariants] = useState([
    { size:"20LT", price:"", stockReceived:"" },
    { size:"4LT", price:"", stockReceived:"" },
    { size:"1LT", price:"", stockReceived:"" }
  ]);

  const save = async () => {
    const res = await fetch(PRODUCTS_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(product)
    });
    const { id } = await res.json();

    for (let v of variants) {
      if (!v.price) continue;
      await fetch(VARIANTS_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          productId: id,
          size: v.size,
          price: Number(v.price),
          stockReceived: Number(v.stockReceived)
        })
      });
    }

    alert("Product added with variants!");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <input placeholder="Name"
        className="border p-2 w-full mb-2"
        onChange={e=>setProduct({...product,name:e.target.value})}
      />
      <input placeholder="Category"
        className="border p-2 w-full mb-4"
        onChange={e=>setProduct({...product,category:e.target.value})}
      />

      {variants.map((v,i)=>(
        <div key={i} className="flex gap-2 mb-2">
          <div className="w-16">{v.size}</div>
          <input placeholder="Price"
            className="border p-1 w-24"
            onChange={e=>{
              const copy=[...variants];
              copy[i].price=e.target.value;
              setVariants(copy);
            }}
          />
          <input placeholder="Stock"
            className="border p-1 w-24"
            onChange={e=>{
              const copy=[...variants];
              copy[i].stockReceived=e.target.value;
              setVariants(copy);
            }}
          />
        </div>
      ))}

      <button onClick={save}
        className="bg-blue-900 text-white px-4 py-2 rounded mt-4">
        Save Product
      </button>
    </div>
  );
}
