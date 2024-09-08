import { Button, TextField, CircularProgress } from "@mui/material"; // Import CircularProgress for loading spinner
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react"; // Import useState for loading state

const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  newpassword: yup.string().min(6, "Password must be at least 6 characters").max(12, "Password must be at most 12 characters").required("New password is required"),
}).required();

export function Forgetadminpassword({ href }) {

  Forgetadminpassword.propTypes = {
    href: PropTypes.string.isRequired,
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to track loading

  const onSubmit = async (data) => {
    setLoading(true); // Show loading spinner when request starts
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}admin/forgetpassword`, data, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false); // Stop loading spinner after request finishes
    }
  };

  return (
    <div className="bg-black h-svh flex items-center py-4 justify-center">
      <div className="w-full max-w-md bg-teal-300 p-8 rounded-md shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Forget Password</h1>
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
              {...register("newpassword")}
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.newpassword}
              helperText={errors.newpassword?.message}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"} {/* Display loading spinner */}
            </Button>
          </div>
          <div className="text-center">
            <a className="text-black-400" href={href}>Sign in?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
