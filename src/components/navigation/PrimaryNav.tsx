"use client";
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

interface Props {
  data : {
    icon : IconDefinition, label : string
  }[];
}

const PrimaryNav = ({data} : Props) => {
  const [active, setActive] = useState("Friends");
  return (
    <div>
      <div className="flex flex-col items-start space-y-3 p-2">
        {data.map((value) => (
          <button className={`${active === value.label && "bg-[#3e4046]"} w-full flex items-center gap-3 p-2 rounded-md hover:bg-[#35373c] duration-150`}
            onClick={() => setActive(value.label)}
            key={value.label}
          >
          <FontAwesomeIcon icon={value.icon} className="text-[26px]"/>
          <span className="">{value.label}</span>
        </button>
        ))}
      </div>
    </div>
  )
}

export default PrimaryNav