import "react-image-crop/dist/ReactCrop.css";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
} from "../../services/adminFethApi";
import ImageCroper from "./ImageCroper";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function AddProductForm() {
  const navigate = useNavigate();

  // Mutations & Queries
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: categoryData } = useGetCategoriesQuery();

  // States
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    image: [],
    variants: [], // logic in separate state
  });

  const [variants, setVariants] = useState([
    { size: "", stock: "", price: "" },
  ]);

  const [profileImage, setProfileImage] = useState(null);
  const [thumbnail, setThumbnail] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formError, setFormError] = useState({});

  // Form Handlers
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Removed trim() on change to allow typing spaces comfortably
    });
    // Clear error when user types
    if (formError[e.target.name]) {
      setFormError(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  // Variant Handlers
  const handleChangeVariant = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index][name] = value;
    setVariants(updatedVariants);
  };

  const addNewVariant = () => {
    setVariants([...variants, { size: "", stock: "", price: "" }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Image Handlers
  const onDrop = useCallback(
    (acceptedFiles) => {
      const imageUrls = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...acceptedFiles],
      }));

      setThumbnail((prev) => [...(prev || []), ...imageUrls]);

      if (profileImage === null && imageUrls.length > 0)
        setProfileImage(imageUrls[0].url);
    },
    [profileImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps


  // Validation
  const validateSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.array()
      .min(3, "At least 3 images are required")
      .required("Images are required"),
  });

  function validateVarients() {
    for (let index = 0; index < variants.length; index++) {
      let variant = variants[index];
      if (!variant.size) {
        setFormError({ variants: `Size for variant ${index + 1} is required` });
        return false
      }
      if (!variant.stock || Number(variant.stock) < 0) {
        setFormError({ variants: `Stock for variant ${index + 1} must be a valid number` });
        return false
      }
      // Allow 0 stock? Usually yes, but user check had < 0. Let's assume >= 0 is fine.

      if (!variant.price || Number(variant.price) <= 0) {
        setFormError({ variants: `Price for variant ${index + 1} must be positive` });
        return false
      }
    };
    return true;
  }

  // Submit Handler
  async function handdleSubmit(e) {
    e.preventDefault();
    setFormError({});

    try {
      // 1. Sync variants to form data for validation? Or just validate independently.
      // Logic used mixed approach. Let's validate first.

      const currentFormData = { ...formData, image: formData.image }; // Ensure image array is there

      await validateSchema.validate(currentFormData, { abortEarly: false });

      if (!validateVarients()) {
        toast.error("Please check variant details");
        return;
      }

      const payload = new FormData();
      payload.append("productName", formData.productName.trim());
      payload.append("description", formData.description.trim());
      payload.append("category", formData.category);

      variants.forEach((variant, index) => {
        payload.append(`variants[${index}][size]`, variant.size);
        payload.append(`variants[${index}][stock]`, variant.stock);
        payload.append(`variants[${index}][price]`, variant.price);
      });

      formData.image.forEach((file) => {
        payload.append("file", file);
      });

      const response = await addProduct(payload).unwrap();

      if (response) {
        toast.success("Product added successfully!", {
          position: "top-right",
          theme: "colored",
        });

        // Reset Form
        setFormData({
          productName: "",
          description: "",
          category: "",
          image: [],
          variants: [],
        });
        setVariants([{ size: "", stock: "", price: "" }]);
        setFormError({});
        setProfileImage(null);
        setThumbnail([]);
      }
    } catch (errors) {
      console.error(errors);
      if (errors.inner) {
        const newErrors = {};
        errors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setFormError(newErrors);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error(errors?.data?.message || "Failed to add product");
      }
    }
  }

  function handleCancel() {
    if (window.confirm("Are you sure you want to discard changes?")) {
      navigate('/admin/products');
    }
  }

  function handleRemove(index) {
    const newImages = formData.image.filter((_, i) => i !== index);
    const newThumbnails = thumbnail.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, image: newImages }));
    setThumbnail(newThumbnails);

    // Update main image logic
    if (index === selectedIndex) {
      setSelectedIndex(null);
      setProfileImage(newThumbnails.length > 0 ? newThumbnails[0].url : null);
    } else if (newThumbnails.length > 0 && !profileImage) {
      setProfileImage(newThumbnails[0].url);
    } else if (newThumbnails.length === 0) {
      setProfileImage(null);
    }
  }

  function setCropedImage(croppedFile) {
    const imageUrl = URL.createObjectURL(croppedFile);
    setProfileImage(imageUrl);

    setFormData((prev) => {
      const updatedImages = [...prev.image];
      updatedImages[selectedIndex] = croppedFile;
      return { ...prev, image: updatedImages };
    });

    setThumbnail((prev) => {
      const updatedThumbnails = [...prev];
      updatedThumbnails[selectedIndex] = { url: imageUrl, file: croppedFile };
      return updatedThumbnails;
    });
  }

  return (
    <form onSubmit={handdleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* --- Left Column: General Info & Variants --- */}
      <div className="lg:col-span-2 flex flex-col gap-8">

        {/* General Information Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3">General Information</h3>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input
              className={`rounded-lg border px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-black/5 ${formError.productName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`}
              placeholder="e.g. Summer Cotton T-Shirt"
              type="text"
              name="productName"
              onChange={handleChange}
              value={formData.productName}
            />
            {formError.productName && <span className="text-xs text-red-500 font-medium">{formError.productName}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              className={`rounded-lg border px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-black/5 min-h-[150px] resize-y ${formError.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`}
              placeholder="Describe the product..."
              name="description"
              onChange={handleChange}
              value={formData.description}
            />
            {formError.description && <span className="text-xs text-red-500 font-medium">{formError.description}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <div className="relative">
              <select
                name="category"
                className={`w-full appearance-none rounded-lg border px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-black/5 bg-white ${formError.category ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`}
                onChange={handleChange}
                value={formData.category}
              >
                <option value="">Select Category</option>
                {categoryData && categoryData.map((category) => (
                  <option key={category._id} value={category._id}>{category.categoryName}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
            {formError.category && <span className="text-xs text-red-500 font-medium">{formError.category}</span>}
          </div>
        </div>

        {/* Variants Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-lg font-bold text-gray-800">Product Variants</h3>
            <button type="button" onClick={addNewVariant} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <i className="fas fa-plus-circle"></i> Add Option
            </button>
          </div>

          {formError.variants && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{formError.variants}</div>}

          <div className="flex flex-col gap-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors relative group">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 border rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all text-sm z-10"
                  disabled={variants.length === 1}
                >
                  <i className="fas fa-times"></i>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Size */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Size</label>
                    <div className="relative">
                      <select
                        name="size"
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
                        onChange={(e) => handleChangeVariant(index, e)}
                        value={variant.size}
                      >
                        <option value="">Select Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="extra large">Extra Large</option>
                      </select>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Stock</label>
                    <input
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none w-full"
                      placeholder="0"
                      type="number"
                      min="0"
                      name="stock"
                      onChange={(e) => handleChangeVariant(index, e)}
                      value={variant.stock}
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Price (₹)</label>
                    <input
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none w-full"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      name="price"
                      onChange={(e) => handleChangeVariant(index, e)}
                      value={variant.price}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Right Column: Media & Actions --- */}
      <div className="flex flex-col gap-8">

        {/* Media Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Product Media</h3>

          {/* Main Preview */}
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group flex items-center justify-center">
            {profileImage ? (
              <>
                <img className="w-full h-full object-contain" src={profileImage} alt="Main Preview" />
                <button
                  type="button"
                  onClick={() => {
                    // Find index of profileImage in thumbnails to edit
                    const idx = thumbnail.findIndex(t => t.url === profileImage);
                    if (idx !== -1) {
                      setSelectedIndex(idx);
                      setModalOpen(true);
                    }
                  }}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-black p-2 rounded-lg shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  title="Crop Image"
                >
                  <i className="fas fa-crop-simple"></i>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400 gap-2">
                <i className="fas fa-image text-4xl opacity-20"></i>
                <span className="text-sm font-medium">No Image Selected</span>
              </div>
            )}
          </div>

          {/* Thumbnails Grid */}
          {thumbnail.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {thumbnail.map((img, index) => (
                <div
                  key={index}
                  onClick={() => { setSelectedIndex(index); setProfileImage(img.url); }}
                  className={`aspect-square rounded-md overflow-hidden border cursor-pointer relative group ${profileImage === img.url ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dropzone */}
          <div className="flex flex-col gap-2">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                        ${formError.image ? 'border-red-500 bg-red-50' : ''}
                    `}
            >
              <input {...getInputProps()} />
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-500">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
            </div>
            {formError.image && <span className="text-xs text-red-500 font-medium text-center">{formError.image}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-4 rounded-xl bg-black text-white font-semibold shadow-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <i className="fas fa-spinner fa-spin"></i>}
            {isLoading ? "adding..." : "Add Product"}
          </button>
        </div>
      </div>

      {modalOpen && (
        <ImageCroper
          updateProfile={setCropedImage}
          imageSrc={profileImage}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </form>
  );
}

export default AddProductForm;
