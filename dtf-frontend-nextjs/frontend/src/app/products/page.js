"use client";

import { useState } from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/store/api/productsApi";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, isError } = useGetProductsQuery({
    search: search || undefined,
    categoryId: categoryId || undefined,
    sort,
    page,
    pageSize: 12
  });

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 1;

  return (
    <div className="container">
      <h1>Shop All Stickers</h1>

      <div className="toolbar">
        <input
          placeholder="Search stickers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading && <p>Loading products…</p>}
      {isError && <p className="error-text">Couldn't load products right now.</p>}

      {data && (
        <>
          <div className="product-grid">
            {data.items.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>

          <div className="pagination">
            <button className="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages || 1}</span>
            <button className="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
