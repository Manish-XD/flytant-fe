import Image from "next/image";
import loadingIcon from "../../public/img/hiJ9ypGI5tIKdwKoK2.webp";

function Loading({size}) 
{
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image src={loadingIcon} alt="Loading animation" style={{height: size}}/>
    </div>  
  )
}

export default Loading;