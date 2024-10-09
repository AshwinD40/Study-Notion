import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className=' mx-auto '>
        <h1 className=' text-3xl font-bold text-center mb-5'>Get in Touch</h1>
        <p className=' text-sm text-richblack-500 text-center font-semibold mb-14'>We’d love to here for you, Please fill out this form.</p>

        <div>
          <ContactUsForm/>
        </div>
    </div>
  )
}

export default ContactFormSection