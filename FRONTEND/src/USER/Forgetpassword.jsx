import { Button, TextField, CircularProgress } from "@mui/material";
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().required("Enter your email"),
  newpassword: yup.string().min(6, "Password must be at least 6 characters").max(12, "Password must be at most 12 characters").required("Enter your new password"),
}).required();

const Forgetpassworduser = ({ href }) => {
  Forgetpassworduser.propTypes = {
    href: PropTypes.string.isRequired,
  };

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false); // State for loading animation

  const onSubmit = async (data) => {
    setLoading(true); // Start loading when the form is submitted
    try {
      const request = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/forgetpassword`, data, {
        withCredentials: true,
      });

      if (request.data.success) {
        toast.success(request.data.message);
        navigate("/");
      } else {
        toast.error(request.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading when the request is completed
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-md py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Forgot Password</h1>
        <div className="bg-teal-300 p-6 rounded-md shadow-lg">
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
                  disabled={loading} // Disable button while loading
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"} {/* Show loading spinner */}
                </Button>
              </div>
              <div className="text-center">
                <a className="text-black-400 block mt-4" href={href}>Sign In?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgetpassworduser;
