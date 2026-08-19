"use client";

import { useMemo, useState } from "react";

export default function AdminDataGrid({ title, items = [], itemKey, getSearchText, renderItem, onAdd, addLabel, loading, error, emptyText }) {
  const [search, setSearch] = useState("");
  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? items.filter((item) => getSearchText(item).toLowerCase().includes(term)) : items;
  }, [items, search, getSearchText]);

  return <section className="admin-panel data-grid-panel">
    <div className="grid-toolbar"><div><h2>{title}</h2><span>{items.length} total</span></div><button className="button" type="button" onClick={onAdd}>{addLabel}</button></div>
    <input className="grid-search" type="search" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(event) => setSearch(event.target.value)} />
    {loading ? <p>Loading {title.toLowerCase()}...</p> : error ? <p className="error-text">Could not load {title.toLowerCase()}.</p> : visibleItems.length ? <div className="admin-grid">{visibleItems.map((item) => renderItem(item, itemKey(item)))}</div> : <p className="empty-state">{search ? "No matching results." : emptyText}</p>}
  </section>;
}
