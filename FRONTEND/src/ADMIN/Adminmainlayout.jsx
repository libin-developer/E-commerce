
import { Outlet } from 'react-router-dom'
import Adminnavbar from './Adminnavbar'



function Adminmainlayout() {

  return (
    <>
      
     <Adminnavbar/>
     <main>
        <Outlet/>
      </main>
       
     
    
    </>
  )
}

export default Adminmainlayout
