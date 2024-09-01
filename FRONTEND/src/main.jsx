import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import "./index.css";
import Signin from "./USER/Signin";
import Usersignup from "./USER/Usersignup";
import Forgetpassworduser from "./USER/Forgetpassword";
import App from "./App";
import Productcarddetials from "./PAGES/Productcarddetials";
import Userhomepage from "./USER/Userhomepage";
import { Toaster } from "react-hot-toast";
import { Sellersignin } from "./SELLER/Sellersignin";
import { Sellersignup } from "./SELLER/Sellersignup";
import { Forgetsellerpassword } from "./SELLER/Forgetsellerpassword";
import { Forgetadminpassword } from "./ADMIN/Forgetadminpassword";
import { Adminsignin } from "./ADMIN/Adminsignin";
import { Adminsignup } from "./ADMIN/Adminsignup";
import { SignLayout } from "./LoginPagesLayout/SignLayout";
import { UserRoutes } from "./PROTECTROUTES/UserRoutes";
import { NoProductsFound } from "./PAGES/Noproductfound";
import Sellerhomepage from "./SELLER/Sellerhomepage";
import { SellerRoutes } from "./PROTECTROUTES/SellerRoutes";
import { Sellerdashboard } from "./SELLER/Sellerdashboard";
import { Sellerhomelayout } from "./SELLER/Sellerhomelayout";
import Addproducts from "./SELLER/Addproducts";
import AdminDashboard from "./ADMIN/Admindashboard";
import Adminmainlayout from "./ADMIN/Adminmainlayout";
import { AdminRoutes } from "./PROTECTROUTES/AdminRoutes";
import CartPage from "./PAGES/Cart"
import PaymentStatus from "./PAYMENT/Paymentstatus";
import UserDashboard from "./USER/Userdashboard"

const router = createBrowserRouter([

  //user
  {
    path: "/",
    element:<SignLayout/>,

    children:[
      {path:"/", element:<Signin href={"user/signup"} forget={"user/forgetpassword"}/>},
      {path:"user/signup", element:<Usersignup href={"/"}/>},
      {path:"user/forgetpassword", element:<Forgetpassworduser href={"/"}/>},
     
    ]
  },

  //user homepage
  {
    path:"/home",
    element:(
    <UserRoutes>
     <App/>
    </UserRoutes>
    
  ),

    children:[
      {path:"/home", element:<Userhomepage/>},
      {path:"/home/product/:id", element:<Productcarddetials/>},
      {path:"/home/dashboard", element:<UserDashboard/>},
      {path:"/home/no-products-found", element:<NoProductsFound/>},
      {path:"/home/cart", element:<CartPage/>},
      {path:"/home/payment-status/:status", element:<PaymentStatus/>}
    ]
  },

  //seller
   {
    path:"/seller",
    element:<SignLayout/>,

    children:[
      {path:"/seller", element:<Sellersignin href={"/seller/signup"} forget={"/seller/forgetpassword"}/>},
      {path:"/seller/signup", element:<Sellersignup href={"/seller"}/>},
      {path:"/seller/forgetpassword", element:<Forgetsellerpassword href={"/seller"}/>}
    ]
   },

   //seller homepage

   {
    path:"/sellerhome",
    element:(
      <SellerRoutes>
      <Sellerhomelayout/>,
      </SellerRoutes>
    
   ),
    children:[
      {path:"/sellerhome",element:<Sellerhomepage/>},
      {path:"/sellerhome/dashboard",element:<Sellerdashboard/>},
      {path:"/sellerhome/add-product",element:<Addproducts/>},
      {path:"/sellerhome/edit-product/:id",element:<Addproducts/>},
    ]
   },

   //Admin
   {
    path:"/admin",
    element:<SignLayout/>,

    children:[
      {path:"/admin", element:<Adminsignin href={"/admin/signup"} forget={"/admin/forgetpassword"}/>},
      {path:"/admin/signup", element:<Adminsignup href={"/admin"}/>},
      {path:"/admin/forgetpassword", element:<Forgetadminpassword href={"/admin"}/>},
      {path:"/admin/dashboard", element:<AdminDashboard/>}
    ]
   },
   
   // admin dashboard

   {
    path:"/admin/dashboard",
    element:(
      <AdminRoutes>
      <Adminmainlayout/>
      </AdminRoutes>
    ),
  
    children:[
      {path:"/admin/dashboard", element:<AdminDashboard/>}
    ]
   }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster/>
    <RouterProvider router={router} />
    
   
  </React.StrictMode>
);