import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


const Signup = () => {
  // states for user inputs
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()


  // function to post user inputs to the flask api
  const submit = async(e) => {
    // preventing default behavior of forms reloading
    e.preventDefault()
    setLoading("Please wait as we upload your data!")

    // adding data to the new form data
    const data = new FormData()
    data.append("firstname", firstname)
    data.append("lastname", lastname)
    data.append("email", email)
    data.append("phone", phone)
    data.append("password", password)

    // posting user input to the flask backend api
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup" , data)
      setLoading("")
      // update the sucess message
      setSuccess(response.data.success)
      navigate("/")

      // clear all the user inputs
      setFirstname("")
      setLastname("")
      setEmail("")
      setPhone("")
      setPassword("")
    } catch (error) {
      setLoading("")
      setError(error.message)
    }
  }
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submit}>
            {loading}
            {success}
            {error}
            <h2 className="font-sans! text-4xl! text-gray-800!">Signup</h2>
            <input 
            type="text" 
            placeholder='First name' 
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <input 
            type="text" 
            placeholder='Last name' 
             value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <input 
            type="email" 
            placeholder='Email' 
             value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <input 
            type="tel" 
            placeholder='Phone' 
             value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <input 
            type="password" 
            placeholder='Password' 
             value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"/> <br />
            <button type='submit' className="bg-blue-600 text-white px-4 py-2 my-4 rounded">Signup</button>
        </form>
        <h2>Already have an account? <Link to="/signin">Sign In</Link></h2>
    </div>
  )
}

export default Signup