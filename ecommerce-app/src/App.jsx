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
import CheckoutFlow from './components/CheckoutFlow'
import OrderDetails from './components/OrderDetails'
import Profile from './components/Profile'
import AdminRoute from './components/AdminRoute'
import ProductDetails from './components/ProductDetails'

function App() {
 

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="relative min-h-screen min-h-svh w-full bg-gray-50 font-sans">
          <div className="fixed inset-0 -z-10 bg-gray-50" aria-hidden="true" />
          <div className="flex min-h-screen min-h-svh w-full flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col">
              <Routes>
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/getproducts' element={<GetProducts />} />
                <Route path='/products/:productId' element={<ProductDetails />} />
                <Route path='/addproducts' element={<AdminRoute><AddProducts /></AdminRoute>} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<CheckoutFlow />} />
                <Route path='/orders/:orderId' element={<OrderDetails />} />
                <Route path='/profile' element={<Profile />} />
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
