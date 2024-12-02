import api from "./api";

export const userProfileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // query to get user
    getUser: builder.query({
      query: () => ({
        url: "/api/getUser",
      }),
    }),
    // mutation update user
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/updateUser",
        method: "PUT",
        body: credentials,
      }),
    }),
    // mutation to reset password
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/api/resetPassword",
        method: "PATCH",
        body: credentials,
      }),
    }),
    // mutation to reset password
    addAddress: builder.mutation({
      query: (credentials) => ({
        url: "/api/addAddress",
        method: "POST",
        body: credentials,
      }),
    }),
    // query to get addresses
    getAddresses: builder.query({
      query: () => ({
        url: "/api/getAddresses",
      }),
      providesTags: ["getAddresses"],
    }),
    // mutation to update default address
    updateDefaultAddress: builder.mutation({
      query: (credentials) => ({
        url: "/api/updateDefaultAddress",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["getAddresses"],
    }),
    // query to get addresses
    getOneAddress: builder.query({
      query: (addressId) => ({
        url: `/api/getOneAddress/${addressId}`,
      }),
      providesTags: ["getAddresses"],
    }),
    updateAddress: builder.mutation({
      query: (credentials) => ({
        url: "/api/updateAddress",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getAddresses"],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: "/api/deleteAddress",
        method: "DELETE",
        body: addressId,
      }),
    }),
    getUserOrderHistories:builder.query({
      query:({page,limit}) => ({
        url:`/api/getUserOrderHistories?page=${page}&limit=${limit}`
      }),
      providesTags:['userGetOrders']
    }),
    getOneOrder:builder.query({
      query:(orderId) => ({
        url:`/api/getOneOrder/${orderId}`
      }),
    }),
    updateOrderStatus:builder.mutation({
      query:(credentials) =>({
        url:'/api/order/updateStatus',
        method:'PATCH',
        body:credentials
      }),
      invalidatesTags:['userGetOrders']
    }),
    getWallet:builder.query({
      query:() => ({
        url:'/api/getWallet'
      })
    }),
    downloadInvoice:builder.query({
      query:(orderId) => ({
        url:`/api/downloadInvoice/${orderId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      })
    })
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useAddAddressMutation,
  useGetAddressesQuery,
  useUpdateDefaultAddressMutation,
  useGetOneAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useLazyGetUserOrderHistoriesQuery,
  useGetOneOrderQuery,
  useUpdateOrderStatusMutation,
  useGetWalletQuery,
  useLazyDownloadInvoiceQuery
} = userProfileApi;
