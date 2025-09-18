import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
function Logout({updaterole}) {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        updaterole(null);  

        navigate('/');  
    }, [navigate, updaterole]);


  return (
    <div>
      
    </div>
  )
}

export default Logout
