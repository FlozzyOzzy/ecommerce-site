import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './components/Signin'
import Signup from './components/Signup'
import GetProducts from './components/GetProducts'

function App() {
 

  return (
    <BrowserRouter>
    <div className="bg-gray-50">
      <h1>My E-Commerce App</h1>
      <Routes>
        <Route path='/signup' element= {<Signup />} />
        <Route path='/signin' element= {<Signin />} />
        <Route path='/' element= {<GetProducts />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
