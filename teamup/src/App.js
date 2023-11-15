import { Route, Routes } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import "./components/Sidebar";
import "./components/styles.css";
import ApproveList from "./components/ApproveList";
import ApproveWrite from "./components/ApproveWrite";
import Com from './components/com';
import Search from './components/search';
import Home from './components/home';
import Login from './components/login';
import Mypage from './components/mypage';
import DeptInsert from './components/detpInsert';
import CompanyJoin from './components/companyJoin';
import TeamUpLogo from './components/images/TeamUpLogo.png';
import {CgProfile} from "react-icons/cg";
import {BsFillBellFill} from "react-icons/bs";
import {RiKakaoTalkFill} from "react-icons/ri";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SalList from './components/SalList';

import ProfileEdit from './components/profileEdit';//마이페이지로 합치면 지울껍니당

function App() {
  const location = useLocation();
  return (
  <>
    <div className='main-content container-fluid'>
      <Sidebar/>

        <div className='row ms-5 mt-3'>
          <div className='col-md-10 offset-md-1'>
            {/* 헤더 */}

            <div className='row'>
              <div className='col-8'>
                <Navbar.Brand href="#home" className='logo'>
                  <img src={TeamUpLogo} alt="TemaUpLog" width={100}/>
                  <NavLink to="/companyJoin" className="ms-5">회사로그인</NavLink>
                  <NavLink to="/deptInsert" className="ms-1">부서등록</NavLink>
                  <button className="btn btn-primary ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">조직도</button>
                </Navbar.Brand>
              </div>

            
              <div className='col-4 d-flex justify-content-end align-items-center'>
                <div className='ms-3'>
                  <RiKakaoTalkFill size="40" style={{color:'#218C74'}}/>
                </div>
                <div className='ms-3'>
                  <BsFillBellFill size="35"style={{color:'#218C74'}}/>
                </div>
                <Navbar expand="sm" className="bg-body-white ">
                  <Nav className="bg-body-primary ">
                    <NavDropdown title={<CgProfile size="40" style={{color:'#218C74'}} />} id="basic-nav-dropdown">                                       
                      <NavDropdown.Item >마이페이지</NavDropdown.Item>              
                        <NavLink  className={`nav-link ${location.pathname === '/salList' ? 'active' : ''}`} to='/salList'>
                          <NavDropdown.Item className={`nav-link ${location.pathname === '/salList' ? 'active' : ''}`} href='/salList'>급여내역</NavDropdown.Item>
                        </NavLink>                                            
                      <NavDropdown.Item href="#action/3.2">로그아웃</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar>
              </div>
            

            </div>

            {/* 본문 */}
            <div className='mt-3'>
              <Routes>
                {/* 각종 라우터 */}
                <Route path="/approveList" element={<ApproveList/>}></Route> 
                <Route path="/approveWrite" element={<ApproveWrite/>}></Route>
                <Route path='/com' element={<Com/>} ></Route>
                <Route path='/search' element={<Search/>}></Route>
                <Route path='/home' element={<Home/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path="/mypage" element={<Mypage/>}></Route>
                <Route path="/deptInsert" element={<DeptInsert/>}></Route>

                {/* 마이페이지에 합치면 profileEdit는 지울껍니당 */}
                <Route path="/profileEdit" element={<ProfileEdit/>}></Route>

                <Route path='companyJoin' element={<CompanyJoin/>}></Route>
                <Route path="/salList" element={<SalList/>}></Route>

              </Routes>
            </div>

            {/* 조직도  */}
            <div className='row'>
              <div className='col-10 offset-1'>   
                <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                  <div className="offcanvas-header">
                      <h5 className="offcanvas-title" id="offcanvasRightLabel">조직도</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                  </div>
                  <div className="offcanvas-body">
                    조직도 자리 
                  </div>
                </div>
              </div>
            </div>
         
          </div> 
        </div>
       
    </div>
  
  </>
  );
}

export default App;