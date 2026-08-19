import { apiSlice } from "./apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // params: { search, categoryId, sort, page, pageSize }
      query: (params) => ({ url: "products", params }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ productId }) => ({ type: "Product", id: productId })),
              { type: "Product", id: "LIST" }
            ]
          : [{ type: "Product", id: "LIST" }]
    }),
    getProductBySlug: builder.query({
      query: (slug) => `products/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }]
    }),
    getCategories: builder.query({
      query: () => "categories",
      providesTags: [{ type: "Category", id: "LIST" }]
    }),
    // --- Admin mutations ---
    createProduct: builder.mutation({
      query: (body) => ({ url: "products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `products/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }]
    }),
    addProductImage: builder.mutation({
      query: ({ id, ...body }) => ({ url: `products/${id}/images`, method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }]
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: "categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }]
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({ url: `categories/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }]
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }]
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = productsApi;
