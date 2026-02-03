import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../store/authSlice";
const apiUrl = import.meta.env.VITE_API_URL

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    localStorage.removeItem("userToken");
    const refreshResult = await baseQuery("/api/refresh", api, extraOptions);
    if (refreshResult?.data) {
      const token = refreshResult.data.accessToken;
      localStorage.setItem("userToken", token)
      api.dispatch(setCredentials(token));
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired";
      }
      return refreshResult;
    }
  }
  return result;
};

const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default api;
