import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:3000/graphql";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI, prepareHeaders: (headers, { getState }) => {
    // Lấy token từ store
    const token = getState().auth.token;

    // Thêm token vào header
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
