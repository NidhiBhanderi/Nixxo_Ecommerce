"use client";

import { useGetProductsQuery } from "@/store/api/productsApi";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { data, isLoading, isError } = useGetProductsQuery({ sort: "featured", pageSize: 8 });

  return (
    <div className="container">
      <section className="hero">
        <h1>Custom DTF Stickers, Made to Order</h1>
        <p>Durable, vibrant, easy-peel transfers — printed and shipped fast.</p>
      </section>
      <h2 className="section-title">Featured Products</h2>
      {isLoading && <p>Loading products...</p>}
      {isError && <p className="error-text">Couldn't load products right now.</p>}
      {data && <div className="product-grid">{data.items.map((p) => <ProductCard key={p.productId} product={p} />)}</div>}
    </div>
  );
}
