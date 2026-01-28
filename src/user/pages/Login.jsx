import leftImage from '../assets/LeftImage.png'
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Side - Hidden on Mobile */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative items-center justify-center" 
        style={{backgroundImage:`url(${leftImage})`}}
      >
         <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
         <h1 className="text-7xl text-white font-bold relative z-10 font-volkhov tracking-wider drop-shadow-2xl">DORESU</h1>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              Enter your details to access your account, wishlist & more.
            </p>
          </div>
          
          <div className='w-full'>
            <LoginForm/>
          </div>

          <div className="text-center pt-2">
            <span className="text-gray-500 text-sm md:text-base">Don't have an account? 
              <Link className="font-bold text-black ml-2 hover:underline transition-all" to="/signup">Sign up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
