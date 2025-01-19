import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <FontAwesomeIcon icon={faExclamationTriangle} className="text-8xl text-yellow-400"/>
      <p>Create or Click on an existing connection to start syncing.</p> 
    </div>
  )
}

export default page