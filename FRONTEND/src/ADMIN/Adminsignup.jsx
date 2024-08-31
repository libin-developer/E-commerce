import { Button, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const schema = yup.object({
  adminname: yup.string().min(3, "Admin name must be at least 3 characters").max(15, "Admin name must be at most 15 characters").required("Admin name is required"),
  email: yup.string().email("Invalid email address").max(50, "Email must be at most 50 characters").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").max(12, "Password must be at most 12 characters").required("Password is required"),
}).required();

export function Adminsignup({ href }) {

  Adminsignup.propTypes = {
    href: PropTypes.string.isRequired,
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/admin/signup", data, {
        withCredentials: true
      });
      if (response.data.success) {
        localStorage.setItem("adminname",response.data.adminname)
        localStorage.setItem("email",response.data.email)
        localStorage.setItem("role",response.data.role)
        localStorage.setItem("adminId",response.data.adminId)
        toast.success(response.data.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-md bg-teal-300 p-8 rounded-md shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <TextField
              {...register("adminname")}
              label="Admin Name"
              variant="outlined"
              fullWidth
              error={!!errors.adminname}
              helperText={errors.adminname?.message}
              size="small"
              className="bg-gray-50"
            />
          </div>
          <div>
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              size="small"
              className="bg-gray-50"
            />
          </div>
          <div>
            <TextField
              {...register("password")}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              size="small"
              className="bg-gray-50"
            />
          </div>
          <div>
            <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
          </div>
          <div className="text-center">
            <a className="text-black-400" href={href}>Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
