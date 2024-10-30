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
import { SignLayout } from "./LoginPagesLayout/SignLayout";
import { UserRoutes } from "./PROTECTROUTES/UserRoutes";
import { NoProductsFound } from "./PAGES/Noproductfound";
import Sellerhomepage from "./SELLER/Sellerhomepage";
import { SellerRoutes } from "./PROTECTROUTES/SellerRoutes";
import { Sellerdashboard } from "./SELLER/Sellerdashboard";
import { Sellerhomelayout } from "./SELLER/Sellerhomelayout";
import Addproducts from "./SELLER/Addproducts";
import PaymentStatus from "./PAYMENT/Paymentstatus";
import CartPage from "./PAGES/Cart";
import DashboardWrapper from "./USER/DashbaordWrapper";


const router = createBrowserRouter([


  //user
  {
    path: "/signin",
    element:<SignLayout/>,

    children:[
      {path:"/signin", element:<Signin href={"signin/signup"} forget={"/signin/forgetpassword"}/>},
      {path:"/signin/signup", element:<Usersignup href={"/signin"}/>},
      {path:"/signin/forgetpassword", element:<Forgetpassworduser href={"/signin"}/>},
     
    ]
  },

  //user homepage
  {
    path:"/",
    element:(
    <UserRoutes>
     <App/>
    </UserRoutes>
    
  ),

    children:[
      {path:"/", element:<Userhomepage/>},
      {path:"/product/:id", element:<Productcarddetials/>},
      {path:"/dashboard", element:<DashboardWrapper/>},
      {path:"/no-products-found", element:<NoProductsFound/>},
      {path:"/cart", element:<CartPage/>},
      {path:"/payment-status/:status", element:<PaymentStatus/>}
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
   
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster/>
    <RouterProvider router={router} />
    
   
  </React.StrictMode>
);