import { Button, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/seller/signin", data, {
        withCredentials: true
      });

      if (response.data.success) {
        localStorage.setItem("sellername",response.data.sellername)
        localStorage.setItem("email",response.data.email)
        localStorage.setItem("sellerId",response.data.sellerId)
        toast.success(response.data.message);
        navigate("/sellerhome");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="bg-black min-h-screen flex  justify-center">
      <div className="w-full max-w-md py-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-8">Signin</h1>
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
              <div className="text-center mt-4">
                <a className="text-black-400 block mb-2" href={href}>I dont have an account?</a>
                <a className="text-black-400" href={forget}>Forget Password?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
