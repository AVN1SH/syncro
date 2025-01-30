import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="/images/hashBackground.svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] object-contain -z-10 opacity-80" />
      <div className="font-semibold mt-4 text-zinc-400 flex flex-col gap-2 items-center pt-6 relative overflow-hidden text-sm">
        <h1 className="text-lg text-zinc-300 font-bold">
          NO THREADS YET
        </h1>
        <div className="flex flex-col gap-0 items-center">
          <p>You don't have access to text / voice / video threads..
          <span className="text-yellow-500">! </span> </p>
          <p>Make sure you must create or join the connection before creating a threads.</p> 
        </div>
      </div>
    </div>
  )
}

export default page