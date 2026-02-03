import AddProductForm from "../components/AddProductForm";
import Aside from "../components/Aside";
import Header from "../components/Header";

function AdminAddProduct() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen flex font-sans text-gray-900">
      <div className="hidden lg:block">
        <Aside />
      </div>

      <main className="flex-1 w-full lg:pl-[260px] transition-all duration-300 ease-in-out">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 pt-24 lg:pt-28 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Add Product</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span className="hover:text-black cursor-pointer transition-colors">Home</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
                <span className="hover:text-black cursor-pointer transition-colors">Products</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
                <span className="text-gray-900">Add New</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors">
                Publish Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <AddProductForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAddProduct;
