import Link from 'next/link'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

type Props = {}

const BackButton = (props: Props) => {
  return (
    <div><Link
    href="./"
    className="w-16 h-16 bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 hover:dark:bg-neutral-700 
      mt-24 ml-5 rounded-full flex justify-center items-center"
  >
    <FaArrowLeft className="w-10 h-10 dark:text-emerald-500" />
  </Link></div>
  )
}
export default BackButton;