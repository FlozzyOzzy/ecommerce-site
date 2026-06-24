import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './components/Signin'
import Signup from './components/Signup'
import GetProducts from './components/GetProducts'
import AddProducts from './components/AddProducts'
import Landingpage from './components/Landingpage'
import Cart from './components/Cart'
import CartProvider from './context/CartProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
 

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="relative min-h-svh w-full bg-gray-50 font-sans">
          <div className="fixed inset-0 -z-10 bg-gray-50" aria-hidden="true" />
          <div className="flex min-h-svh w-full flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col">
              <Routes>
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/getproducts' element={<GetProducts />} />
                <Route path='/addproducts' element={<AddProducts />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/' element= {<Landingpage/>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
