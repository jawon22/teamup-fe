import { Navigate, Route, Routes, useNavigate } from 'react-router';
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

import { CgProfile } from "react-icons/cg";
import { BsFillBellFill } from "react-icons/bs";
import { RiKakaoTalkFill } from "react-icons/ri";

import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SalList from './components/SalList';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ProfileEdit from './components/profileEdit';//마이페이지로 합치면 지울껍니당
import Calendar from './components/calendar';
import DeptCalendar from './components/deptCalendar';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { companyState, userState } from './recoil';







import Emp from './components/Emp';



function App() {
  const location = useLocation();
  const [user, setUser] = useRecoilState(userState);

    // 조직도 관련 const 모음--------------------
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
   //------------------------------조직도 끝---

  const [company, setCompany] = useRecoilState(companyState);
  const navigate = useNavigate();




useEffect(()=>{
  if(user!== ''){

    navigate('/home')
    console.log("user=",user)
  }

},[])

  


  //axios로 사용자 정보를 찾아서 이사람이 관리자인지 여부에따라 보여주고 말고를 결정하고 
  //만약에  user가 null이 아니면 로그인 버튼 활성화 로그인이 되어있다면 비활성화






  return (
    <>
      <div className='main-content container-fluid'>
        <Sidebar />

        <div className='row ms-5 mt-3'>
          <div className='col-md-10 offset-md-1 me-5'>

        {/* 헤더 */}
        <div className='row '>
            <div className='col-8 me-auto'>
              <Navbar.Brand href="#home" className='logo'>
                <img src={TeamUpLogo} alt="TemaUpLog" width={100}/>
                <NavLink to="/companyJoin" className="ms-5">회사로그인</NavLink>

                <NavLink to="/deptInsert" className="ms-1">부서등록</NavLink>
                <NavLink to="/empTree"className={"ms-2"}>조직도</NavLink>
                <NavLink to="/profileEdit"className="ms-1">프로필</NavLink>

                <Button onClick={handleShow} className=" btn btn-primary ms-3">조직도</Button>

              </Navbar.Brand>
            </div>
            <div className='col-4'>

                <div className='row'>
                  <div className='col d-flex ml-auto justify-content-between align-items-center text-end icons-container'>
                    <div className='col-2 offset-6 mt-1 me-1'>
                      <RiKakaoTalkFill className="me-2" size="45" style={{ color: '#218C74' }} />
                    </div>
                    <div className='col-2 mt-1'>
                      <BsFillBellFill className="me-2" size="40" style={{ color: '#218C74' }} />
                    </div>
                    <div className='col-2'>
                      <Navbar expand="sm" className="bg-body-white ">
                        <Nav className="bg-body-primary ">

                          <NavDropdown title={<CgProfile className="me-3" size={45}style={{color:'#218C74'}} />} id="basic-nav-dropdown">                                       
                            <NavDropdown.Item >마이페이지</NavDropdown.Item>                                                        

                            <NavDropdown.Item href="#action/3.2">로그아웃</NavDropdown.Item>
                          </NavDropdown>
                        </Nav>
                      </Navbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 본문 */}
            {/* 여기가 회원 로그인 페이지 ===> 회원이 로그인을 하면 select 로 찾아서  sessionstoregy 에 저장 하고 */}


            {/* 회사 로그인 */}










                
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
                    <Route path="/calendar" element={<Calendar/>}></Route>
                    <Route path='/companyJoin' element={<CompanyJoin/>}></Route>
                    <Route path='/salList' element={<SalList/>}></Route>
                    <Route path="/deptCalendar" element={<DeptCalendar/>} ></Route>

                    <Route path='/empTree' element={<Emp/>}/>


                {/* 마이페이지에 합치면 profileEdit는 지울껍니당 */}
                <Route path="/profileEdit" element={<ProfileEdit />}></Route>


              </Routes>
            </div>

            {/* 조직도  */}
            <div className='row'>

                  <div className='col-10 offset-1'>   
                  <Offcanvas show={show} onHide={handleClose} placement='end'>
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>조직도</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Emp/> 
                    </Offcanvas.Body>
                  </Offcanvas>

              </div>
            </div>

          </div>
        </div>

      </div>

    </>
  );
}

export default App;