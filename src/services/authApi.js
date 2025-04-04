import { logOut } from "../store/authSlice";
import api from "./api";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // mutation for login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // mutation for signup user
    signupUser: builder.mutation({
      query: (newUser) => ({
        url: "/api/signup",
        method: "POST",
        body: newUser,
      }),
    }),

    // mutation for send verify otp
    verifyOtp:builder.mutation({
      query:(otpData) => ({
        url:'/api/verifyOtp',
        method:'POST',
        body:otpData,
      })
    }),

    // mutation for resend otp
    resendOtp:builder.mutation({
      query:(userId) => ({
        url:'/api/resendOtp',
        method:'POST',
        body:userId
      })
    }),
    // mutation to send google auth
    googleAuth:builder.mutation({
      query:(credentials) => ({
        url:'/api/googleAuth',
        method:'POST',
        body:credentials
      })
    }),

    // mutation to for get otp for forgot password
    getOtp:builder.mutation({
      query:(email) => ({
        url:'/api/sendForgotOtp',
        method:'POST',
        body:email
      })
    }),

    // mutation to for verify forgot password
    verifyForgotOtp:builder.mutation({
      query:(credentials) => ({
        url:'/api/verifyForgotOtp',
        method:'POST',
        body:credentials
      }) 
    }),

    // mutation to for reset the password for forgot password
    forgotPassword:builder.mutation({
      query:(credentials) => ({
        url:'/api/forgotPassword',
        method:'POST',
        body:credentials
      })
    }),

    // query to get accesstoken
    refreshToken:builder.query({
      query:() => 'api/refresh',
      transformResponse:(response) => response.accessToken
    }),
    // mutation for logut user
    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          dispatch(logOut());
          dispatch(api.util.resetApiState());
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutUserMutation,
  useRefreshTokenQuery,
  useGoogleAuthMutation,
  useGetOtpMutation,
  useVerifyForgotOtpMutation,
  useForgotPasswordMutation
} = authApi;
