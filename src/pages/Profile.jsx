import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase.js"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserSuccess, signOutUserStart } from '../redux/user/userSlice.js'
// import {useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom"

const Profile = () => {
  const fileRef = useRef(null);

  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({}) //for updating the formdata acc to new profile
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([])

  const dispatch = useDispatch();
  // const navigate=useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name //will produce always unique name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);//we want to actually see the percentage of the upload

    // upload.on starts
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setFilePerc(Math.round(progress));
      },
      //we want to track the changes
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    )
    // upload.on ends
  }

  const handleChange = (e) => {
    setFormData({
      ...FormData,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`https://real-estate-yi19.onrender.com/api/user/update/${currentUser._id}`, {
        // this currentUser we got from useSelector
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }


  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://real-estate-yi19.onrender.com/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }


  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('https://real-estate-yi19.onrender.com/api/auth/signout')
      const data = res.json();
      // console.log(data.success); //undefined
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`http://localhost:8080/api/user/listings/${currentUser._id}`);
      
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true)
        return;
      }
      setUserListings(data);

    } catch (error) {
      setShowListingError(true)
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`https://real-estate-yi19.onrender.com/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      )
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="profile"
          className='rounded-full h-24 w-24 
        object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ?
            (<span className='text-red-700'>
              Error Image Upload(Image must be less than 2mb )
            </span>)
            :
            filePerc > 0 && filePerc < 100 ? (
              <span>
                {`Uploading ${filePerc}%`}
              </span>
            )
              :
              filePerc === 100 ? (
                <span className='text-green-700'> Successfully Uploaded!</span>
              )
                :
                ""
          }
        </p>
        <input type='text' placeholder='username' id='username'
          className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange} />
        <input type='text' placeholder='email' id='email'
          className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type='password' placeholder='password' id='password'
          className='border p-3 rounded-lg' onChange={handleChange} />
        <button className='bg-slate-700 text-white rounded-lg
        p-3 uppercase hover:opacity-95
        disabled:opacity-80'>
          {loading ? "loading.." : "Update"}
        </button>
        <Link to={"/create-listing"} className='bg-green-700 text-white rounded-lg p-3 
          text-center uppercase hover:opacity-95 disabled:opacity-50' >

          Create Listing
        </Link>



      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully" : ""}</p>

      <button className='text-green-700 w-full font-mono'
        onClick={handleShowListings}
      >Show Listings
      </button>
      <p>{showListingError ? 'Error showing Listings' : ''}</p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-5'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex
       justify-between items-center gap-4'>

              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover"
                  className='h-16 w-16 object-contain' />
              </Link>
              <Link className='text-slate-700 font-semibold flex-1
        hover:underline truncate' to={`listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'>
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  {/* /update-listing/${listing._id}  already defined in app.jsx */}
                  <button className='text-green-700'>
                    Edit
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>)

      }
    </div>
  )
}
export default Profile


