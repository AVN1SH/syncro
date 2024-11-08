import { faImage } from "@fortawesome/free-regular-svg-icons"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  bannerImage ?: string;
}

const Banner = ({bannerImage} : Props) => {
  return (
    <div className="bg-zinc-600 h-[100px] object-cover object-center flex items-center justify-center">
      {bannerImage 
      ? <img src={bannerImage} />
      :<div className="relative w-full h-full">
        <FontAwesomeIcon icon={faImage} size="4x" className="text-zinc-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <FontAwesomeIcon icon={faTriangleExclamation} size="xl" className="text-yellow-500 absolute bottom-[17px] right-[85px] opacity-70" />
      </div>}
    </div>
  )
}

export default Banner
