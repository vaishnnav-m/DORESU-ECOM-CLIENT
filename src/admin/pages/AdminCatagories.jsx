import React, { useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import Table from "../components/Table";
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
  const { data } = useGetCategoriesQuery();// to get categories
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
    { error: addError, isError, isLoading, data: addSuccess },
  ] = useAddCategoryMutation(); // mutation for add new category
  const [updateCategory, { data: editSuccess }] = useUpdateCategoryMutation();// mutation for update category

  // ---- States ---- //
  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [validateError, setValidateError] = useState("");

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
      const confirmEdit = window.confirm("Are you sure you want to edit this category?");
    if (confirmEdit) {
        setIsEditing(true);
        setCategory(category);
    }
    } catch (error) {
      console.log(error);
    }
  }

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

    if (isEditing) {
      await updateCategory(category).unwrap();
      if(editSuccess){
        setCategory({ categoryName: "", description: "" });
        setIsEditing(false)
      } 
    }else{
      await addcategory(category).unwrap();
      if (addSuccess) {
        setCategory({ categoryName: "", description: "" });
      }
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
            pageName="Catagory Management"
            headings={headings}
            data={data}
            columns={columns}
            buttonConfigs={buttonConfigs}
          />
        </div>

        <div className="w-full flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="min-w-[700px] flex flex-col gap-9 p-20  justify-center"
          >
            <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative">
              <span className="bg-[#e7e7e3] px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
                Category
              </span>
              <input
                onChange={handleChange}
                value={category.categoryName}
                name="categoryName"
                className="w-full h-full rounded-lg px-5 bg-transparent"
                type="text"
              />
            </div>
            <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative">
              <span className="bg-[#e7e7e3] px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
                Description
              </span>
              <input
                onChange={handleChange}
                value={category.description}
                name="description"
                className="w-full h-full rounded-lg px-5 bg-transparent"
                type="text"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
            >
              {isEditing ? "Edit" : isLoading ? "Adding..." : "Add"}
            </button>
            {(validateError || isError) && (
              <span className="text-red-500">
                {validateError || addError?.data?.message || "Adding failed"}
              </span>
            )}
            {editSuccess && (
              <span className="text-green-500">{editSuccess.message}</span>
            )}
            {addSuccess && <span className="text-green-500">{addSuccess.message}</span>}
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminCatagories;
