import { Button, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";


const schema = yup.object({
  username: yup.string().min(3).max(15).required(),
  email: yup.string().email().max(50).required(),  // increased max limit for email
  password: yup.string().min(6).max(12).required(),
}).required();

export default function Usersignup({ href }) {

  Usersignup.propTypes = {
    href: PropTypes.string.isRequired,
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const onSubmit = async () => {
    try {
      const data = {
        username,
        email,
        password,
      }; 
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/signup`, data, {
        withCredentials: true
      });
      console.log(response.data.success);
      if (response.data.success) {
        localStorage.setItem("username",response.data.username)
        localStorage.setItem("email",response.data.email)
        localStorage.setItem("userId",response.data._id)
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="bg-black h-svh flex  justify-center">
      <div className="w-full max-w-md py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-4 ">Signup</h1>
        <div className="bg-teal-300 p-6 rounded-md shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <div>
                <TextField
                  {...register("username")}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  size="small"
                  className="bg-gray-50"
                  onChange={(e)=>setUsername(e.target.value)}
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
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
              <div>
                <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
              </div>
              <div>
                <a className="text-black block text-center" href={href}>Already have an account?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}