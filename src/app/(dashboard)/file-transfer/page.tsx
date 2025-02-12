import { redirect } from 'next/navigation';
import React from 'react'

const page = () => {
  return redirect("/file-transfer/sender");
}

export default page
