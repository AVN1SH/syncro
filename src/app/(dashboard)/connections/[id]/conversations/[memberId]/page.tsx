import Secondary from '@/components/windows/Secondary'
import React from 'react'

interface Props {
  params : {
    id : string;
    threadId : string;
  }
}

const page = ({params} : Props) => {
  return (
    <div className="fixed left-[310px] top-[40px] right-0 bottom-0">
      <Secondary />
    </div>
  )
}

export default page
