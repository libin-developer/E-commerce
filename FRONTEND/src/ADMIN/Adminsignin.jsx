import { Button, TextField, CircularProgress } from "@mui/material"; // Add CircularProgress for spinner
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react"; // Add useState for loading

const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
}).required();

export function Adminsignin({ href, forget }) {

  Adminsignin.propTypes = {
    href: PropTypes.string.isRequired,
    forget: PropTypes.string.isRequired,
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const onSubmit = async (data) => {
    setLoading(true); // Start loading spinner
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}admin/signin`, data, {
        withCredentials: true
      });
      if (response.data.success) {
        localStorage.setItem("adminname", response.data.adminname);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("adminId", response.data.adminId);
        toast.success(response.data.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-md bg-teal-300 p-8 rounded-md shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Signin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <TextField
              {...register("email")}
              label="Email"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"} {/* Show spinner during loading */}
            </Button>
          </div>
          <div className="text-center">
            <a className="text-black-400" href={href}>I don't have an account?</a><br />
            <a className="text-black-400" href={forget}>Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
