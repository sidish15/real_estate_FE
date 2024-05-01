import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
const OAuth = () => {
        const navigate=useNavigate();
        const dispatch=useDispatch();
        const handleGoogleClick=async()=>{
 try{
const provider=new GoogleAuthProvider()
const auth=getAuth(app)

const result=await signInWithPopup(auth,provider)
// console.log(result);

const res=await fetch('https://real-estate-yi19.onrender.com/api/auth/google',{
        method:"POST",
        headers:{
                "Content-Type":"application/json",
                
        },
        body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
})
//json->string
const data=await res.json()
// string->json
dispatch(signInSuccess(data));
navigate("/")
 }catch(error){
        console.log("Could not connect with Google",error);
 }
        }
  return (
    <button onClick={handleGoogleClick} type="button" className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95'>
      CONTINUE WITH GOOGLE
    </button>
//     this button is submit by default ,we need to change it to button
  )
}

export default OAuth
