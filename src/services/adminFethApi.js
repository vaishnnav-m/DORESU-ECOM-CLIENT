import adminApi from "./adminApi";

const adminFetchApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    // mutation for login admin
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // query to get accesstoken
    adminRefreshToken: builder.query({
      query: () => "/refresh",
      transformResponse: (response) => response.accessToken,
    }),
    // query to get users
    getUsers: builder.query({
      query: () => ({
        url: "/getUsers",
      }),
      providesTags: ["getUsers"],
    }),
    // mutation for update user
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "/updateStatus",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getUsers"],
    }),
    // mutation for addCategory
    addCategory: builder.mutation({
      query: (credentials) => ({
        url: "/addCategory",
        method: "POST",
        body: credentials,
      }),
    }),
    //query to get categories
    getCategories: builder.query({
      query: () => ({
        url: "/getCategories",
      }),
      providesTags: ["getCategory"],
    }),
    // mutation for update Category Status
    updateCategoryStatus: builder.mutation({
      query: (credentials) => ({
        url: "/updateCategoryStatus",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getCategory"],
    }),
    // mutation for update Category
    updateCategory: builder.mutation({
      query: (credentials) => ({
        url: "/updateCategory",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getCategory"],
    }),
    // mutation to add product
    addProduct: builder.mutation({
      query: (credentials) => ({
        url: "/addProduct",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["getProducts"],
    }),
    // query to get products
    getProduts: builder.query({
      query: ({ offset, limit, query = "" }) => ({
        url: `/getProducts?offset=${offset}&limit=${limit}&query=${query}`,
      }),
      providesTags: ["getProducts"],
    }),
    // mutation to updateStatus of Product
    updateProductStatus: builder.mutation({
      query: (credentials) => ({
        url: "/products/updateStatus",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["getProducts"],
    }),
    // query to get individual product
    getProduct: builder.query({
      query: (id) => ({
        url: `/getProduct/${id}`,
      }),
      providesTags: ["getProduct"],
    }),
    // mutation to edit product
    editProduct: builder.mutation({
      query: (credentials) => ({
        url: "/products/editProduct",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getProduct", "userGetProductDetail"],
    }),
    // query to get order histories
    getOrderHistories: builder.query({
      query: ({ filter, startDate, endDate, page, limit }) => ({
        url: `/getOrderHistories?startDate=${startDate}&endDate=${endDate}&filter=${filter}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["getOrders"],
    }),
    // mutation to update orders status
    updateOrderStatus: builder.mutation({
      query: (credentials) => ({
        url: "/updateOrderStatus",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["getOrders"],
    }),
    // mutation to add offers
    addOffer: builder.mutation({
      query: (credentials) => ({
        url: "/addOffers",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["getOffers"],
    }),
    // query for fetch offers
    getOffers: builder.query({
      query: () => ({
        url: "/getOffers",
      }),
      providesTags: ["getOffers"],
    }),
    // mutation to updateStatus of the offer
    updateOfferStatus: builder.mutation({
      query: (credentials) => ({
        url: "/offers/updateStatus",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["getOffers"],
    }),
    // mutation to update the offer
    updateOffer: builder.mutation({
      query: (credentials) => ({
        url: "/updateOffer",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getOffers"],
    }),
    // mutation to add the coupon
    addCoupon: builder.mutation({
      query: (credentials) => ({
        url: "/addCoupon",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["getCoupons"],
    }),
    // query to fetch all coupons
    getCoupons: builder.query({
      query: () => ({
        url: "/getCoupons",
      }),
      providesTags: ["getCoupons"],
    }),
    // mutation to edit coupons
    editCoupons: builder.mutation({
      query: (credentials) => ({
        url: "/editCoupon",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getCoupons"],
    }),
    downloadPDFReport: builder.query({
      query: ({ filter, startDate, endDate }) => ({
        url: `salesReportPdf/?startDate=${startDate}&endDate=${endDate}&filter=${filter}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    downloadExcelReport: builder.query({
      query: ({ filter, startDate, endDate }) => ({
        url: `salesReportExcel/?startDate=${startDate}&endDate=${endDate}&filter=${filter}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginAdminMutation,
  useAdminRefreshTokenQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryStatusMutation,
  useUpdateCategoryMutation,
  useAddProductMutation,
  useLazyGetProdutsQuery,
  useUpdateProductStatusMutation,
  useGetProductQuery,
  useEditProductMutation,
  useLazyGetOrderHistoriesQuery,
  useUpdateOrderStatusMutation,
  useAddOfferMutation,
  useGetOffersQuery,
  useUpdateOfferStatusMutation,
  useUpdateOfferMutation,
  useAddCouponMutation,
  useGetCouponsQuery,
  useEditCouponsMutation,
  useLazyDownloadPDFReportQuery,
  useLazyDownloadExcelReportQuery,
} = adminFetchApi;
