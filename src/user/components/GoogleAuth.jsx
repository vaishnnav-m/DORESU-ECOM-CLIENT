import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "../../services/authApi";
import './GooleStyles.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

function GoogleAuth() {
  const dispatch = useDispatch();
  const [googleAuth, { data, isLoading, isError}] = useGoogleAuthMutation();
  useEffect(() => {

    if(data){
      toast.success("successfully loggedin !", {
        position: "top-right",
        theme: "dark",
      });
      localStorage.setItem('userToken',data.data);
      dispatch(setCredentials(data.data))
    }
  },[data])

  if(isError){
    toast.error("Something went worong",{
      position:"top-right",
    })
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center ">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          strokeColor="black"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperClass="stroke-black"
        />
      </div>
    );
  }

  return (
    <div className="button-div">
      <GoogleLogin
        logo_alignment="center"
        onSuccess={(credentials) => googleAuth(credentials)}
      />
    </div>
  );
}

export default GoogleAuth;
