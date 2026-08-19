"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminDataGrid from "@/components/AdminDataGrid";
import AdminSidebar from "@/components/AdminSidebar";
import { selectIsAdmin } from "@/store/slices/authSlice";
import {
  useAddProductImageMutation, useCreateCategoryMutation, useCreateProductMutation, useDeleteCategoryMutation,
  useDeleteProductMutation, useGetCategoriesQuery, useGetProductsQuery, useUpdateCategoryMutation, useUpdateProductMutation
} from "@/store/api/productsApi";

const emptyProduct = { name: "", slug: "", description: "", categoryId: "", price: "", discountPrice: "", sku: "", stockQuantity: "0", size: "", isFeatured: false, imageUrl: "" };
const emptyCategory = { name: "", slug: "", parentCategoryId: "" };

export default function AdminPage() {
  const isAdmin = useSelector(selectIsAdmin);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState("products");
  const [sidebar, setSidebar] = useState(null);
  const [product, setProduct] = useState(emptyProduct);
  const [category, setCategory] = useState(emptyCategory);
  const [notice, setNotice] = useState("");
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useGetProductsQuery({ page: 1, pageSize: 100 });
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();
  const [createProduct, createProductState] = useCreateProductMutation();
  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [addProductImage] = useAddProductImageMutation();
  const [createCategory, createCategoryState] = useCreateCategoryMutation();
  const [updateCategory, updateCategoryState] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return <div className="container"><p>Loading admin dashboard...</p></div>;
  if (!isAdmin) return <div className="container"><h1>Admin access required</h1><p>Please sign in with an Admin account to manage the catalog.</p></div>;

  const closeSidebar = () => { setSidebar(null); setProduct(emptyProduct); setCategory(emptyCategory); };
  const openProduct = (item = null) => {
    setProduct(item ? { ...emptyProduct, ...item, categoryId: String(item.categoryId), price: String(item.price), discountPrice: item.discountPrice ?? "", stockQuantity: String(item.stockQuantity), imageUrl: item.imageUrls?.[0] ?? "" } : emptyProduct);
    setSidebar({ type: "product", id: item?.productId ?? null });
  };
  const openCategory = (item = null) => {
    setCategory(item ? { name: item.name, slug: item.slug, parentCategoryId: item.parentCategoryId ? String(item.parentCategoryId) : "" } : emptyCategory);
    setSidebar({ type: "category", id: item?.categoryId ?? null });
  };
  const productField = (field) => (event) => setProduct((current) => ({ ...current, [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const categoryField = (field) => (event) => setCategory((current) => ({ ...current, [field]: event.target.value }));

  const saveProduct = async (event) => {
    event.preventDefault(); setNotice("");
    const { imageUrl, ...form } = product;
    const payload = { ...form, categoryId: Number(form.categoryId), price: Number(form.price), discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice), stockQuantity: Number(form.stockQuantity) };
    try {
      const saved = sidebar.id ? await updateProduct({ id: sidebar.id, ...payload }).unwrap() : await createProduct(payload).unwrap();
      if (imageUrl) await addProductImage({ id: saved.productId, imageUrl, isPrimary: true }).unwrap();
      setNotice(`Product ${sidebar.id ? "updated" : "created"} successfully.`); closeSidebar();
    } catch (error) { setNotice(error.data?.message ?? "Could not save product."); }
  };
  const saveCategory = async (event) => {
    event.preventDefault(); setNotice("");
    const payload = { ...category, parentCategoryId: category.parentCategoryId === "" ? null : Number(category.parentCategoryId) };
    try { sidebar.id ? await updateCategory({ id: sidebar.id, ...payload }).unwrap() : await createCategory(payload).unwrap(); setNotice(`Category ${sidebar.id ? "updated" : "created"} successfully.`); closeSidebar(); }
    catch (error) { setNotice(error.data?.message ?? "Could not save category."); }
  };
  const removeProduct = async (item) => { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteProduct(item.productId).unwrap(); setNotice("Product deleted."); } catch { setNotice("Could not delete product."); } };
  const removeCategory = async (item) => { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteCategory(item.categoryId).unwrap(); setNotice("Category deleted."); } catch { setNotice("Could not delete category."); } };
  const productSaving = createProductState.isLoading || updateProductState.isLoading;
  const categorySaving = createCategoryState.isLoading || updateCategoryState.isLoading;

  return <div className="container admin-page">
    <div className="admin-heading"><div><p className="eyebrow">Catalog management</p><h1>Admin dashboard</h1><p>Manage your store catalog from one place.</p></div></div>
    <div className="admin-tabs"><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button><button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categories</button></div>
    {notice && <p className={notice.includes("Could not") ? "error-text" : "success-text"}>{notice}</p>}
    {tab === "products" ? <AdminDataGrid title="Products" items={productsData?.items ?? []} itemKey={(item) => item.productId} getSearchText={(item) => `${item.name} ${item.sku} ${item.categoryName} ${item.slug}`} onAdd={() => openProduct()} addLabel="Add product" loading={productsLoading} error={productsError} emptyText="No products yet." renderItem={(item) => <article className="grid-card" key={item.productId}><img src={item.imageUrls?.[0] || "/placeholder.png"} alt="" /><div className="grid-card-body"><span className="grid-kicker">{item.categoryName}</span><strong>{item.name}</strong><span className="grid-meta">${Number(item.price).toFixed(2)} · Stock {item.stockQuantity}</span><div className="row-actions"><button onClick={() => openProduct(item)}>Edit</button><button className="danger-button" onClick={() => removeProduct(item)}>Delete</button></div></div></article>} /> : <AdminDataGrid title="Categories" items={categories} itemKey={(item) => item.categoryId} getSearchText={(item) => `${item.name} ${item.slug}`} onAdd={() => openCategory()} addLabel="Add category" loading={categoriesLoading} error={categoriesError} emptyText="No categories yet." renderItem={(item) => <article className="grid-card category-card" key={item.categoryId}><div className="category-icon">#</div><div className="grid-card-body"><strong>{item.name}</strong><span className="grid-meta">/{item.slug}</span><div className="row-actions"><button onClick={() => openCategory(item)}>Edit</button><button className="danger-button" onClick={() => removeCategory(item)}>Delete</button></div></div></article>} />}
    <AdminSidebar open={Boolean(sidebar)} title={sidebar?.type === "product" ? (sidebar.id ? "Edit product" : "Add product") : (sidebar?.id ? "Edit category" : "Add category")} onClose={closeSidebar}>
      {sidebar?.type === "product" ? <form className="sidebar-form" onSubmit={saveProduct}>
        <label>Name<input value={product.name} required onChange={productField("name")} /></label><label>Slug<input value={product.slug} required onChange={productField("slug")} /></label><label>Category<select value={product.categoryId} required onChange={productField("categoryId")}><option value="">Choose a category</option>{categories.map((item) => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}</select></label><label>SKU<input value={product.sku} required onChange={productField("sku")} /></label><div className="sidebar-two-col"><label>Price<input type="number" min="0" step="0.01" value={product.price} required onChange={productField("price")} /></label><label>Discount price<input type="number" min="0" step="0.01" value={product.discountPrice} onChange={productField("discountPrice")} /></label></div><div className="sidebar-two-col"><label>Stock quantity<input type="number" min="0" value={product.stockQuantity} required onChange={productField("stockQuantity")} /></label><label>Size<input value={product.size} onChange={productField("size")} /></label></div><label>Description<textarea rows="4" value={product.description} onChange={productField("description")} /></label><label>Image URL<input type="url" placeholder="https://example.com/image.jpg" value={product.imageUrl} onChange={productField("imageUrl")} /></label><label className="checkbox-field"><input type="checkbox" checked={product.isFeatured} onChange={productField("isFeatured")} /> Featured product</label><button className="button" disabled={productSaving}>{productSaving ? "Saving..." : sidebar.id ? "Save changes" : "Create product"}</button>
      </form> : sidebar?.type === "category" ? <form className="sidebar-form" onSubmit={saveCategory}><label>Name<input value={category.name} required onChange={categoryField("name")} /></label><label>Slug<input value={category.slug} required onChange={categoryField("slug")} /></label><label>Parent category<select value={category.parentCategoryId} onChange={categoryField("parentCategoryId")}><option value="">None</option>{categories.filter((item) => item.categoryId !== sidebar.id).map((item) => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}</select></label><button className="button" disabled={categorySaving}>{categorySaving ? "Saving..." : sidebar.id ? "Save changes" : "Create category"}</button></form> : null}
    </AdminSidebar>
  </div>;
}
