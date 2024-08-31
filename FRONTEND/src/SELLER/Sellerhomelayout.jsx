import { Outlet } from "react-router-dom";

import Sellerhomenav from "./Sellerhomenav";


export  function Sellerhomelayout() {
  return (
    <>
        <Sellerhomenav/>
        <main>
        <Outlet/>
      </main>
      
     
      
    </>
  )
}
