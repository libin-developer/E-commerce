import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

const schema = yup
  .object({
    productname: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    catogery: yup.string().required("Catogery is required"),
    price: yup.string().required("Price is required"),
    stock: yup.number().required("Stock is required").min(0, "Stock must be at least 0"),
    image: yup.mixed().required("Image is required"),
  })
  .required();

export default function AddProducts() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { id } = useParams();
  const isEdit = Boolean(id);

  const loaddata = async () => {
    if (!isEdit) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/product/product/${id}`);
      const formData = res.data;
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loaddata();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const requestBody = {
        productname: data.productname,
        description: data.description,
        catogery: data.catogery,
        price: data.price,
        stock: data.stock,
        image: data.image[0],
      };

      if (!isEdit) {
        const sellerId = localStorage.getItem("sellerId");
        const res = await axios.post(
          `http://localhost:3000/api/v1/product/add-product/${sellerId}`,
          requestBody,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/sellerhome");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.put(
          `http://localhost:3000/api/v1/product/update-product/${id}`,
          requestBody,
          {
            withCredentials: true,
           
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/sellerhome");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
          {isEdit ? "Edit Your Product" : "Add Your Product"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("productname")}
            type="text"
            placeholder="Product Name"
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.productname && <p className="text-red-500 text-xs">{errors.productname.message}</p>}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}

          <select
            {...register("catogery")}
            defaultValue=""
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select Catogery
            </option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Beauty">Beauty</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs">{errors.catogery.message}</p>}

          <input
            {...register("price")}
            type="text"
            placeholder="Price"
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}

          <input
            {...register("stock")}
            type="number"
            placeholder="Stock"
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}

          <input
            {...register("image")}
            type="file"
            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}

          <button
            type="submit"
            className="w-full py-2 px-3 text-sm rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
