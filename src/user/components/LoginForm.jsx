import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import GoogleAuth from "./GoogleAuth";
import ForgotPassworEmail from "./ForgotPassworEmail";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisibile,setIsModalVisibile] = useState(false);

  const navigate = useNavigate();
  const [loginUser, { isLoading, isError, isSuccess, error: authError }] =
    useLoginUserMutation();
  const dispatch = useDispatch();

  // function to handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await loginUser(formData).unwrap();
      if (response && response.accessToken) {
        localStorage.setItem("userToken", response.accessToken);
        dispatch(setCredentials(response.accessToken));
        return navigate("/");
      }
    } catch (error) {
      console.log("error is :", error);
    }
  };

  // function to handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
          <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
            Email
          </label>
          <input
            onChange={handleChange}
            value={formData.email}
            name="email"
            className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="w-full">
            <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
              <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
                Password
              </label>
              <input
                onChange={handleChange}
                value={formData.password}
                name="password"
                className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                  <i className={`far fa-${showPassword ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
            <div className="text-right mt-2">
                 <button
                    type="button"
                    onClick={() => setIsModalVisibile(true)}
                    className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                  >
                    Forgot Password?
                  </button>
            </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Login"
          )}
        </button>
        
        {isError && (
          <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100 text-center">
            {authError?.data?.message || "Login failed"}
          </div>
        )}

        {isSuccess && <div className="p-3 bg-green-50 text-green-500 text-sm rounded-md border border-green-100 text-center">Login successful!</div>}
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <GoogleAuth />
      
      {isModalVisibile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="p-4 flex justify-end">
                    <button onClick={() => setIsModalVisibile(false)} className="text-gray-400 hover:text-black p-2">
                        <i className="fas fa-times text-lg"></i>
                    </button>
               </div>
               <div className="px-6 pb-8">
                  <ForgotPassworEmail closeModal ={() => setIsModalVisibile(false)}/>
               </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
