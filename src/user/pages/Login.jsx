import leftImage from '../assets/LeftImage.png'
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="flex min-h-screen">

      <div className="flex-1 bg-cover bg-center flex items-center justify-center" style={{backgroundImage:`url(${leftImage})`}}>
         <h1 className="text-[63px] text-white font-bold" style={{fontFamily:"Volkhov"}}>DORESU</h1>
      </div>

      <div className="flex-1 flex flex-col gap-32 px-[50px] pt-[80px]">
        <div>
          <h2 className="font-medium text-[50px] text-[#212121]">LOGIN</h2>
          <span className="font-medium text-[18] text-[#737373]">Get access to your Orders, Wishlist and Recommendations</span>
        </div>
        <div className='flex flex-col gap-6 items-center'>
         <LoginForm/>
           <span className="font-medium text-[20px] text-[#737373]">Don't have an account ?<Link className="font-bold text-[20px] text-[#484848] ml-3" to="/signup">Signup</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
