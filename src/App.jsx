import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Navbar from './components/Navbar';
import CityForm from './CityForm';
import CityList from './CityList';
import AreaAddForm from './AreaAddForm';
import AddCategoryForm from './AddCategoryForm';
import CatgoeryList from './CatgoeryList';
import MaidForm from './MaidForm';
import UserProfileCards from './UserProfileCards';
import RegisterForm from './RegisterForm';
import UserLogin from './UserLogin';
import Adminlogin from './AdminLogin';
import MaidRequestTable from './RequesttoAdmin';
import Myworks from './Myworks';
import Emplogin from './Emplogin';
import RequestStatusForUser from './RequestStatusForUser';
import BookedEmpQuery from './BookedEmpQuery';
import Logout from './components/Logout';
import EmployeeTable from './EmployeeTable';
import WorkStatusList from './WorkStatusList';
import Sidebar from './components/Navbar';
import EmpscmpletedWrks from './EmpscmpletedWrks';
import Completedwrksuser from './Completedwrksuser';
function App() {
  const [role, setRole] = useState(localStorage.getItem("role"))

  const [collapsed, setCollapsed] = useState(false);
  const updaterole = (role) => {
    setRole(role);
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  };


  return (
    <>
      <Router>
        <div className="app-container">
          <Sidebar role={role} />
          <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>

            {/* <Navbar role={role}/> */}
            <Routes>
              {/* for common routes  start*/}
              <Route path="/" element={<Home />} />
              <Route path="/signUp" element={<RegisterForm />} />
              <Route path="/signOut" element={<Logout updaterole={updaterole} />} />
              <Route path="/empSignin" element={<Emplogin updaterole={updaterole} />} />
              <Route path="/signIn" element={<UserLogin updaterole={updaterole} />} />
              <Route path="/adminSignin" element={<Adminlogin updaterole={updaterole} />} />
              {/* for common routes  end*/}


              {/* for admin routes  start*/}
              <Route path="/cityForm" element={<CityForm />} />
              <Route path="/cityOperations" element={<CityList />} />
              <Route path="/addArea" element={<AreaAddForm />} />
              <Route path="/addCatgory" element={<AddCategoryForm />} />
              <Route path="/catList" element={<CatgoeryList />} />
              <Route path="/addmaids" element={<MaidForm />} />
              <Route path="/empTable" element={<EmployeeTable />} />
              <Route path="/Requests" element={<MaidRequestTable />} />
              <Route path='/myworks' element={<Myworks />}></Route>
              <Route path="/wrkstatus" element={<WorkStatusList />} />
              <Route path="/cmpletedwrks" element={<EmpscmpletedWrks />} />
                    <Route path="/cmpletedwrksuser" element={<Completedwrksuser />} />
              {/* for admin routes  end*/}

              <Route path="/Complaints" element={<BookedEmpQuery />} />
              <Route path="/maidProfile" element={<UserProfileCards />} />
              <Route path="/RequestStatusUSer" element={<RequestStatusForUser />} />

            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
