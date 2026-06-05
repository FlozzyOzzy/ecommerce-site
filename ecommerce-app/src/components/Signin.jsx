import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


const Signin = () => {
  // states for user inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  // hook to facilitate navigation to a new page
  const navigate = useNavigate()


  // function to submit data to Flask API
  const submit = async (e)=> {
    // prevent forms default behavior of relaoding
    e.preventDefault()
    // set loading message
    setLoading("Please wait as we log you in...")
    // add data to new form data
    try {
      const data = new FormData()
      data.append("email", email)
      data.append("password", password)

      // post data to the flask backend api
      const response = await axios.post ("http://127.0.0.1:5000/api/signin" , data)
      setLoading("")
      if (response.data.user) {
        // if the user exists then they will be directed to the home page
        navigate("/")
      }
      else {
        // User not found
        setError("Login Failed")
      }

    } catch {
      setLoading("")
      setError("There was a server Error")
      
    }
  }


  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submit}>
            <h2 className="font-sans! text-4xl! text-gray-800!">Signin</h2>
            {loading}
            {error}
            <input 
            type="email" 
            placeholder='Email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" /> <br />
            <input 
            type="password" 
            placeholder='Password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <button className="bg-blue-600 text-white px-4 py-2 my-4 rounded" type='submit'>Signin</button>
        </form>

        {/* link to signup when a user does not have an account */}
        <h2>Don't have an account? <Link to="/signup">Sign Up</Link></h2>
    </div>
  )
}

export default Signin