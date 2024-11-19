import leftImage from '../assets/LeftImage.png'
import { Link } from "react-router-dom";
import SignupForm from '../components/SignupForm';

function Signup() {
  return (
    <div className="flex min-h-screen">

      <div className="flex-1 bg-cover bg-center flex items-center justify-center" style={{backgroundImage:`url(${leftImage})`}}>
         <h1 className="text-[63px] text-white font-bold" style={{fontFamily:"Volkhov"}}>DORESU</h1>
      </div>

      <div className="flex-1 flex flex-col gap-20 px-[50px] pt-[50px]">
        <div>
          <h2 className="font-medium text-[50px] text-[#212121]">SIGNUP</h2>
          <span className="font-medium text-[18] text-[#737373]">Sign up with your mobile number and email to get started</span>
        </div>
        <div className='flex flex-col gap-5 items-center'>
         <SignupForm/>
           <span className="font-medium text-[20px] text-[#737373]">Already have an account ?<Link className="font-bold text-[20px] text-[#484848] ml-3" to="/login">Login</Link></span>
        </div>
      </div>
    </div>
  )
}

export default Signup