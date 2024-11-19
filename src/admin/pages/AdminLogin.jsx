import AdminLoginForm from '../components/AdminLoginForm'
import leftImage from '../assets/LeftImage.png'

function AdminLogin() {
  return (
    <div className="flex min-h-screen">

      <div className="flex-1 bg-cover bg-center flex items-center justify-center" style={{backgroundImage:`url(${leftImage})`}}>
         <h1 className="text-[63px] text-white font-bold" style={{fontFamily:"Volkhov"}}>DORESU</h1>
      </div>

      <div className="flex-1 flex flex-col gap-32 px-[50px] pt-[80px]">
        <div>
          <h2 className="font-medium text-[50px] text-[#212121] uppercase">admin login</h2>
          <span className="font-medium text-[18] text-[#737373]">Hello welcome to admin signup</span>
        </div>
        <div className='flex flex-col gap-6 items-center'>
         <AdminLoginForm/>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin