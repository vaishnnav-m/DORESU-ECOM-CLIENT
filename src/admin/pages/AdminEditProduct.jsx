import AddProductForm from "../components/AddProductForm";
import EditProductForm from "../components/AdminEditProductForm";
import Aside from "../components/Aside";
import Header from "../components/Header";

function AdminEditProduct() {
  return (
    <div className="bg-[#E7E7E3] flex min-h-screen">
      <Aside />
      <main className="w-full  pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Add Product</h2>
            <span className="text-[16px]">
              Home <i className="fa-solid fa-angle-right text-sm"></i> Products
            </span>
          </div>

          <div className="p-10">
            <EditProductForm/>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminEditProduct;
