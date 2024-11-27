import api from "./api";

export const userProductsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // query to get produts
    getProuducts: builder.query({
      query: ({ offset, limit, category , priceRange,sortOption, query }) => ({
        url: `/api/getProducts?offset=${offset}&limit=${limit}&query=${query}&category=${encodeURIComponent(category)}&priceRange=${encodeURIComponent(priceRange)}&sortOption=${sortOption}`,
      }),
    }),    
    getProduct: builder.query({
      query: (id) => ({
        url: `/api/getProduct/${id}`,
      }),
      providesTags:["userGetProductDetail"]
    }),
    //query to get categories
    getCategories: builder.query({
      query: () => ({
        url: "/api/getCategories",
      }),
    }),
    addToCart: builder.mutation({
      query: (credentials) => ({
        url: "/api/addToCart",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags:['getCart']
    }),
    getCart: builder.query({
      query: () => ({
        url: "/api/getCart",
      }),
      providesTags:['getCart']
    }),
    updateCart: builder.mutation({
      query: (credentials) => ({
        url: "/api/updateCart",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags:['getCart']
    }),
    removeCartProduct:builder.mutation({
      query:(credentials) => ({
        url:'/api/removeCartProduct',
        method:'DELETE',
        body:credentials
      }),
      invalidatesTags:['getCart']
    }),
    placeOrder:builder.mutation({
      query:credentials => ({
        url:'/api/placeOrder',
        method:"POST",
        body:credentials
      })
    }),
    verifyOrder:builder.mutation({
      query:(credentials) => ({
        url:'/api/verifyOrder',
        method:'POST',
        body:credentials
      }),
    }),
    addWishList:builder.mutation({
      query:(credentials) => ({
        url:'/api/wishList/add',
        method:'POST',
        body:credentials
      })
    }),
    getWishList: builder.query({
      query: () => ({
        url: "/api/wishList/get",
      }),
    }),
    userGetCoupons:builder.query({
      query:() => ({
        url:'/api/getCoupons'
      })
    }),
    applyCoupon:builder.mutation({
      query:(credentials) => ({
        url:'/api/applyCoupon',
        method:'POST',
        body:credentials
      })
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetProuductsQuery,
  useGetProductQuery,
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveCartProductMutation,
  usePlaceOrderMutation,
  useVerifyOrderMutation,
  useAddWishListMutation,
  useGetWishListQuery,
  useApplyCouponMutation,
  useGetCategoriesQuery,
  useUserGetCouponsQuery
} = userProductsApi;
