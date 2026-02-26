import React, { useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import Table from "../components/Table";
import { toast } from "react-toastify";
import {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
} from "../../services/adminFethApi";

function AdminCatagories() {
  //--------------> Table Area <-------------------//

  // Table Config
  const columns = ["categoryName", "description"];
  const headings = ["category", "description", "Status", "Update", ""];
  const buttonConfigs = [
    {
      label: "Toggle",
      action: handleStatus,
      styles: "text-green-600 text-[30px]",
      icon: (isActive) => (
        <i className={`fas ${isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
      ),
    },
    {
      label: "Edit",
      action: handleEdit,
      styles: "text-[25px]",
      icon: () => <i className="fas  fa-edit"></i>,
    },
  ];

  // ---- Mutations ---- //
  const { data } = useGetCategoriesQuery(); // to get categories
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation(); // to update status of category

  // ---- Functions ---- //

  // function to update status of the category
  async function handleStatus(catagory) {
    try {
      const categoryId = catagory._id;
      const response = await updateCategoryStatus({ categoryId }).unwrap();
      if (response) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //--------------> Form Area <-------------------//

  // ---- Mutations ---- //
  const [
    addcategory,
    { error: addError, isError: isAddError, isLoading: isAdding },
  ] = useAddCategoryMutation(); // mutation for add new category
  const [
    updateCategory,
    { error: updateError, isError: isUpdateError, isLoading: isUpdating },
  ] = useUpdateCategoryMutation(); // mutation for update category

  // ---- States ---- //
  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [validateError, setValidateError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- Functions ---- //

  // function to validate form
  function validate() {
    if (!category?.categoryName || category.categoryName.length === 0) {
      setValidateError("Category name is needed");
      return false;
    }

    if (!category?.description || category.description.length === 0) {
      setValidateError("Category description is needed");
      return false;
    }
    setValidateError("");
    return true;
  }

  // function to handleEditing
  async function handleEdit(category) {
    try {
      setIsEditing(true);
      setCategory(category);
      setIsModalOpen(true);
      setValidateError("");
    } catch (error) {
      console.log(error);
    }
  }

  const mainButton = {
    name: "Add Category",
    action: () => {
      setIsEditing(false);
      setCategory({ categoryName: "", description: "" });
      setIsModalOpen(true);
      setValidateError("");
    },
  };

  // function to handdle form change
  function handleChange(e) {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  }

  // function to handle submit of the form
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing) {
        await updateCategory(category).unwrap();
        toast.success("Category updated successfully", { position: "top-right", theme: "dark" });
        setIsModalOpen(false);
        setIsEditing(false);
      } else {
        await addcategory(category).unwrap();
        toast.success("Category added successfully", { position: "top-right", theme: "dark" });
        setIsModalOpen(false);
      }
      setCategory({ categoryName: "", description: "" });
      setValidateError("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full  pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Catagories</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i>{" "}
              Catagories
            </span>
          </div>
        </div>
        <div className="p-10">
          <Table
            pageName="Category Management"
            headings={headings}
            data={data}
            columns={columns}
            buttonConfigs={buttonConfigs}
            mainButton={mainButton}
          />
        </div>
      </main>

      {/* Modern Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">Category Name</label>
                <input
                  onChange={handleChange}
                  value={category.categoryName}
                  name="categoryName"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-gray-50 hover:bg-white"
                  type="text"
                  placeholder="Enter category name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
                <textarea
                  onChange={handleChange}
                  value={category.description}
                  name="description"
                  className="w-full h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-gray-50 hover:bg-white resize-none"
                  placeholder="Enter category description"
                />
              </div>

              <div className="mt-2 text-center min-h-[20px] flex justify-center items-center">
                {(validateError || isAddError || isUpdateError) && (
                  <span className="text-red-500 text-sm font-medium">
                    {validateError || addError?.data?.message || updateError?.data?.message || "Operation failed"}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="w-full h-12 rounded-xl bg-black text-white font-semibold text-[17px] hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isEditing
                    ? (isUpdating ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : "Save Changes")
                    : (isAdding ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : "Create Category")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCatagories;
