import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData, //previous information
      [e.target.id]: e.target.value,
    })
  }
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      const res = await fetch('https://real-estate-yi19.onrender.com/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      // we want to send the body by a stringify the formdata


      //next is to change and convert the response we get to JSON
      const data = await res.json();
      console.log(data);
      // data="user created successfully"
      if (data.success === false) {
        setLoading(false);
        seterror(data.message);
        return;
      }
      else {
        setLoading(false);
        seterror(null);
        navigate("/sign-in")
      }
    } catch (error) {
      // after the error happens weve to set the loading to false
      setLoading(false);
      seterror(error.message);

    }
  }
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4  p-3 max-w-lg mx-auto' onSubmit={handleSubmit}>
        <input type="text" placeholder='username'
          className='border p-3 rounded-lg' id='username'
          onChange={handleChange} />
        <input type="text" placeholder='email'
          className='border p-3 rounded-lg' id='email'
          onChange={handleChange} />
        <input type="password" placeholder='password'
          className='border p-3 rounded-lg' id='password'
          onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase
      hover:opacity-95 disabled:opacity-80 '>
          {loading ? 'Loading...' : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"} >
          <span className='text-blue-700'> Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500  mt-5'>{error}</p>}
    </div>
  )
}




export default SignUp;

/*
mx-w-lg :in the bigger screen ,we dont get bigger than large
mx-auto :centre 
'bg-slate-700:background
 text-white :text white color
 p-3:padding 3
  rounded-lg:round in the corners
   uppercase
A <span> element which is used to color a part of a text:
we want to send the body by a stringify the formdata
*/
