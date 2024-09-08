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
  password: yup.string().required("Enter your password"),
}).required();

const Signin = ({ href, forget }) => {
  Signin.propTypes = {
    href: PropTypes.string.isRequired,
    forget: PropTypes.string.isRequired,
  };

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const onSubmit = async () => {
    setLoading(true); // Start loading
    try {
      const data = {
        email,
        password,
      };

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/signin`, data, {
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.setItem("userId", response.data._id);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.error(response.data.message || "Signin failed");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error(error.response?.data?.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-md py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-6">Signin</h1>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? <CircularProgress size={24} /> : "Submit"} {/* Show spinner when loading */}
                </Button>
              </div>
              <div className="text-center">
                <a className="text-black-400 block" href={href}>I don't have an account?</a>
                <a className="text-black-400 block mt-2" href={forget}>Forget Password?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
