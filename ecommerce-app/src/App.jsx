import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './components/Signin'
import Signup from './components/Signup'
import GetProducts from './components/GetProducts'
import Landingpage from './components/Landingpage'

function App() {
 

  return (
    <BrowserRouter>
      <div className="relative min-h-svh w-full bg-gray-50 font-sans">
        <div className="fixed inset-0 -z-10 bg-gray-50" aria-hidden="true" />
        <div className="flex min-h-svh w-full flex-col">
          <main className="flex flex-1 flex-col">
            <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/getproducts' element={<GetProducts />} />
              <Route path='/' element= {<Landingpage/>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
