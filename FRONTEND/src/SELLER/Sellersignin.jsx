import { Button, TextField, CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
}).required();

export function Sellersignin({ href, forget }) {
  Sellersignin.propTypes = {
    href: PropTypes.string.isRequired,
    forget: PropTypes.string.isRequired,
  };

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false); // Loading state for button animation

  const onSubmit = async (data) => {
    setLoading(true); // Start loading animation

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}seller/signin`, data, {
        withCredentials: true
      });

      if (response.data.success) {
        localStorage.setItem("sellername", response.data.sellername);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("sellerId", response.data.sellerId);
        toast.success(response.data.message);
        navigate("/sellerhome");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-md py-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Signin</h1>
        <div className="bg-teal-300 p-6 rounded-md shadow-lg flex">
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
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
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"} {/* Loading animation */}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <a className="text-black-400 block mb-2" href={href}>I don't have an account?</a>
                  <a className="text-black-400" href={forget}>Forget Password?</a>
                </div>
              </div>
            </form>
          </div>
          {/* Advertisement Section */}
          <div className="ml-4 hidden md:block">
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                padding: 2,
                boxShadow: 2,
                textAlign: 'center',
                width: 200,
              }}
            >
              <Typography variant="h6" component="div" gutterBottom>
                Sell Your Products
              </Typography>
              <Typography variant="body2">
                Join us and expand your e-business!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                List your products easily and reach more customers.
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
