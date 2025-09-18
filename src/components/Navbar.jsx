import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaUserShield, FaCity,
  FaMapMarkedAlt, FaListAlt, FaUserCog, FaClipboardList, FaTasks, FaExclamationCircle, FaBars
} from 'react-icons/fa';
import '../assets/sidebar.css';

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h4 className="sidebar-title">Easy Mech</h4>
        <div className="toggle-container">
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      </div>
      <ul className="sidebar-menu">
        {!role && (
          <>
            <li><Link to="/"><FaHome /><span>Home</span></Link></li>
            <li><Link to="/signUp"><FaUserPlus /><span>Sign Up</span></Link></li>
            <li><Link to="/signIn"><FaSignInAlt /><span>Sign In</span></Link></li>
            <li><Link to="/adminSignin"><FaUserShield /><span>Admin Signin</span></Link></li>
            <li><Link to="/empSignin"><FaUserCog /><span>Mechanical Sign In</span></Link></li>
          </>
        )}

        {role === 'admin' && (
          <>
            <li><Link to="/cityForm"><FaCity /><span>City Form</span></Link></li>
            <li><Link to="/addArea"><FaMapMarkedAlt /><span>Add Area</span></Link></li>
            <li><Link to="/addCatgory"><FaListAlt /><span>Add Category</span></Link></li>
            <li><Link to="/addmaids"><FaUserCog /><span>Add Workers</span></Link></li>
            <li><Link to="/empTable"><FaUserCog /><span>Workers List</span></Link></li>
            <li><Link to="/Requests"><FaClipboardList /><span>Requests</span></Link></li>
            <li><Link to="/wrkstatus"><FaClipboardList /><span>Completed Works</span></Link></li>
            {/* <li><Link to="/Complaints"><FaExclamationCircle /><span>Complaints</span></Link></li> */}
            <li><Link to="/signOut"><FaSignOutAlt /><span>Logout</span></Link></li>
          </>
        )}

        {role === 'user' && (
          <>
            <li><Link to="/maidProfile"><FaUserCog /><span>Mechanical Profile</span></Link></li>
            <li><Link to="/RequestStatusUSer"><FaClipboardList /><span>Request Status</span></Link></li>
              <li><Link to="/cmpletedwrksuser"><FaExclamationCircle /><span>Completed Works</span></Link></li>
            {/* <li><Link to="/Complaints"><FaExclamationCircle /><span>Complaints</span></Link></li> */}
            <li><Link to="/signOut"><FaSignOutAlt /><span>Logout</span></Link></li>
          </>
        )}

        {role === 'emp' && (
          <>
            <li><Link to="/myworks"><FaTasks /><span>My Works</span></Link></li>
             <li><Link to="/cmpletedwrks"><FaTasks /><span>Completed Works</span></Link></li>
            {/* <li><Link to="/Complaints"><FaExclamationCircle /><span>Complaints</span></Link></li> */}
            <li><Link to="/signOut"><FaSignOutAlt /><span>Logout</span></Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
