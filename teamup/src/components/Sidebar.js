import React, { useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { levelState, userState } from '../recoil';
import Emp from './emp';
import {CgProfile} from "react-icons/cg";
import {BsFillBellFill} from "react-icons/bs";
import {RiKakaoTalkFill} from "react-icons/ri";
import {AiOutlineMenu, AiOutlineHome} from "react-icons/ai";
import {BiMessageRoundedError} from "react-icons/bi";
import {MdApproval} from "react-icons/md";
import {BsFillPersonCheckFill} from "react-icons/bs";
import {BiChalkboard} from "react-icons/bi";
import {MdPayment} from "react-icons/md";
import {BiLogOut} from "react-icons/bi";
import {RiAdminLine} from "react-icons/ri";

import TeamUpLogo from './images/TeamUpLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min'; // 부트스트랩 JavaScript 파일 임포트


const Sidebar = (props) => {
    // const [user, setUser] = useState({});
    const [user, setUser] = useRecoilState(userState);
    const [level, setLevel] = useRecoilState(levelState);

    const location = useLocation();

    const login = ()=>{
        setUser('15');
        setLevel('1');
    };
    const logout = ()=>{
        setUser('');
        setLevel('');
    };

    return (
        <div>

            <div className="side-bar row">
                <div className="icon mb-5">
                    <div><AiOutlineMenu className="me-3 mt-1" size="30" /></div>
                    <div><AiOutlineMenu className="me-3 mt-1" size="30" /></div>
                </div>
                
                <div className="mb-3">
                    <NavLink to="#" className="nav-link">
                        <label className="me-4">홈</label>
                        <AiOutlineHome className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>
                <div className="mb-3 nav-link">
                    <NavLink to="#">
                        <label className="me-4">공지사항</label>
                        <BiMessageRoundedError className="text-white me-4 mt-1" size="35" />
                    </NavLink> 
                </div>
                <div className="mb-3">
                    <NavLink className={`nav-link ${location.pathname === '/approveList' ? 'active' : ''}`} to="/approveList">
                        <label className="me-4">전자결재</label>
                        <MdApproval className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>
                <div className="mb-3">
                    <NavLink to="#">
                      <label className="me-4">주소록</label>
                        <BsFillPersonCheckFill className="text-white me-3 mt-1" size="35" />
                    </NavLink>
                </div> 
                <div className="mb-3">
                    <NavLink to="#">
                        <label className="me-4">TV</label>
                        <BiChalkboard className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>
                <div className="mb-3">
                    <NavLink to="#">
                        <label className="me-4">카드</label>
                        <MdPayment className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>
                <div className="mb-3">
                    <NavLink to="#">
                        <label className="me-4">사직서</label>
                        <BiLogOut className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>

                {/* 관리자일 때만 나오기 */}
                <div className="mb-3">
                    <NavLink to="#">
                        <label className="me-4">관리자</label>
                        <RiAdminLine className="text-white me-3 mt-1" size="35" />
                    </NavLink> 
                </div>

                <div className='row'>
                    <div className='col-6 offset-6'>
                        <div className="sidebar-menu  me-1">
                            <div className='text-end border  border-radius' >
                                {user}
                                <button onClick={login}>로그인</button>
                                <button onClick={logout}>로그아웃</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content container-fluid">
                
                <nav className="navbar navbar-expand-lg bg-white pe-3 ps-4" data-bs-theme="light">
                    <div className="container-fluid ">
                        <NavLink className="navbar-brand"><img src={TeamUpLogo} alt="TemaUpLog" width={100}/></NavLink>                        
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                                <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">조직도</button>
                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav me-auto">



                            </ul>
                            <div className="d-flex align-iteme-3enter">
                                <RiKakaoTalkFill className="text-primary me-3 mt-1" size="45"/>
                                <BsFillBellFill className="text-primary me-3 mt-1" size="40"/>

                                <li className="nav-item dropdown me-4">
                                    <NavLink className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    <CgProfile className="text-primary me-3" size="50"/>
                                    </NavLink>
                                    <div className="dropdown-menu me-3 ">
                                        <NavLink className="dropdown-item" to="#">mypage</NavLink>
                                        <NavLink className="dropdown-item" to="#">logout</NavLink>

                                    </div>
                                </li>
                                
                            </div>
                        </div>
                    </div>
                </nav>
                    {/* 본문 */}

                {/* offcanvas  */}
                <div className='row'><div className='col-10 offset-1'>   
                    <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasRightLabel">조직도</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            조직도 자리 
                        </div>
                    </div>
                </div></div>

                {/* <div className='row'><div className='col'>
                    <Emp/>
                </div></div> */}
            </div>




        </div>

    );
}
export default Sidebar