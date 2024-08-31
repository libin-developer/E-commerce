// import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './LOGINNAV/Footer'
import Userhomenavbar from "../src/USER/Userhomenavbar"
import { Outlet } from 'react-router-dom'



function App() {

  return (
    <>
      
     <Userhomenavbar/>
     <main>
        <Outlet/>
      </main>
        <Footer/>
     
    
    </>
  )
}

export default App
