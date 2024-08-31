
import Loginnavbar from '../LOGINNAV/Loginnavbar'
import Footer from '../LOGINNAV/Footer'
import { Outlet } from 'react-router-dom'

export  function SignLayout() {
  return (
    <div>
      <Loginnavbar/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
