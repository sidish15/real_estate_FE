import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('')
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`)
        const data = await res.json()
        if (data.success === false) {
          return;
        }

        setLandlord(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord();
  }, [listing.userRef])

  // console.log(landlord);
  const onChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'> {listing.name.toLowerCase()}</span></p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message} 
            onChange={onChange}
            placeholder='Enter your message here...'
            className='border w-full rounded-lg p-3'
          ></textarea>
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}
          &body=${message}`}
          className='bg-slate-700 text-white text-center
          p-3 rouned-lg uppercase hover:opacity-95'>
          Send Message
          </Link>
        </div>
      )}
    </>
  )
}
Contact.propTypes = {
  listing: PropTypes.node,
}
export default Contact;