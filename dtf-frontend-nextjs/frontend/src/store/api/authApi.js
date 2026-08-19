import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "auth/register", method: "POST", body })
    }),
    login: builder.mutation({
      query: (body) => ({ url: "auth/login", method: "POST", body })
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: "auth/forgot-password", method: "POST", body })
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: "auth/reset-password", method: "POST", body })
    })
  })
});

export const { useRegisterMutation, useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
