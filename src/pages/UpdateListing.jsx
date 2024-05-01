import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import  { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate ,useParams} from 'react-router-dom';

const UpdateListing = () => {
  const navigate=useNavigate()
  const params=useParams();
  const { currentUser } = useSelector((state) => state.user)
  const [files, setFile] = useState([])
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
//   console.log(files);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  // console.log(formData.imageUrls);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
        const fetchListing=async()=>{
        const listingId=params.listingId; //as we have given listingId name in app.jsx
        // console.log(listingId); id of the listing that we got from url of the page
        const res=await fetch(`/api/listing/get/${listingId}`);
        const data=await res.json();
        if(data.success===false){
          console.log(data.message);
          return ;
        }
        setFormData(data)
        }
        fetchListing();
  },[])

  const handleImageSubmit = (e) => {

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true)
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls)
          })
          setImageUploadError(false) //if there was an error prev ,we wanna remove that error
          setUploading(false)
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)')
          setUploading(false);
        })
    }
    else {
      setImageUploadError('You can only upload 6 images per listing')
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log((`Upload is ${progress}% done`));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    console.log("clicked");
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

  const handleChange = (e) => {
    console.log(e.target.id);
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      // console.log(e.target.checked); returns true when clicked
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea') {
      // console.log(e.target.type);
      // console.log(e.target.id);
      setFormData({
        ...formData,
        [e.target.id]: e.target.value // if we dont add brackets we would be getting value instead of variable
      })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image') //we want to return and error as well;
      if (+formData.discountPrice > +formData.regularPrice) return ('Discount price should be less than Regular Price')
      setLoading(true)
      setError(false)
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id  //we wanna know who is sending this
        })
      })
      const data = await res.json();
      setLoading(false)
      if (data.success === false) {
        setError(error.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false)
    }
  }








  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Update a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit} >
        <div className='flex flex-col gap-4 flex-1 '>
          <input type="text" placeholder='Name' className='border p-3 
      rounded-lg  ' id='name' maxLength="70" minLength="10" required
            onChange={handleChange} value={formData.name}
          />
          <input type="text" placeholder='Description' className='border p-3 
      rounded-lg  ' id='description' required onChange={handleChange} value={formData.description} />
          <input type="text" placeholder='Address' className='border p-3 
      rounded-lg  ' id='address' required onChange={handleChange} value={formData.address} />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === "rent"} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min="1" max="10" required
                className='p-3 border border-grap-300 rounded-lg'
                onChange={handleChange} value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min="1" max="10" required
                className='p-3 border border-grap-300 rounded-lg'
                onChange={handleChange} value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min="50" max="1000000" required
                className='p-3 border border-grap-300 rounded-lg'
                onChange={handleChange} value={formData.regularPrice}
              />

              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>($/months)</span>
              </div>
            </div>
            {formData.offer && (

              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='1000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>

                  <p>Discounted price</p>
                  <span className='text-xs'>($/months)</span>
                </div>
              </div>
            )}
          </div>


        </div>
        <div className='flex flex-col flex-1 gap-4'>

          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover(max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input className="p-3 border-gray-300 rounded w-full"
              type="file" id='images' accept='image/*' multiple
              onChange={(e) => setFile(e.target.files)}
            />
            <button
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              onClick={handleImageSubmit}
              type='button'
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <button
          disabled={loading ||uploading}
            className='p-3 uppercase font-semibold bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 '
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className='text-red-700'>{error}</p>}
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className='flex justify-between 
            p-3 border items-center'>
                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                <button
                  disabled={uploading} //disabled when we are uploading
                  type="button"
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  onClick={() => handleRemoveImage(index)}
                >Delete</button>
              </div>
            ))

          }
        </div>
      </form>

    </main>
  )
}









export default UpdateListing
