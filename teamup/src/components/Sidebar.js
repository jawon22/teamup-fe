import React, { useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { companyState, levelState, userState } from '../recoil';
import Emp from './emp';
import {AiOutlineMenu, AiOutlineHome} from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";//전자결재
import {BiMessageRoundedError} from "react-icons/bi";
import { AiOutlineNotification } from "react-icons/ai";//공지사항
import {MdApproval} from "react-icons/md";
import {BsFillPersonCheckFill} from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";//주소록
import {BiChalkboard} from "react-icons/bi";
import {MdPayment} from "react-icons/md";
import {BiLogOut} from "react-icons/bi";
import {RiAdminLine} from "react-icons/ri";
import surf from "./images/TeamUpLogoW.png";


import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min'; // 부트스트랩 JavaScript 파일 임포트


const Sidebar = (props) => {
    // const [user, setUser] = useState({});
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);
    const [level, setLevel] = useRecoilState(levelState);

    const location = useLocation();

    const login = ()=>{
        setUser('202302032');
        setLevel('1');
    };
    const logout = ()=>{
        setUser('');
        setLevel('');
    };

    return (
        <div>

            <div className="side-bar row">
                
                <div className='row'>
                    <div className='col'>            
                        <div className='text-end' >
                            {user}{company}
                            <button onClick={login} className='btn btn-primary'>로그인</button>
                            <button onClick={logout} className='btn btn-primary'>로그아웃</button>
                            <NavLink to='/login' className="nav-link">
                                로그인 페이지로
                            </NavLink>
                        </div>                
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                    <img src ={surf} alt="TeamUpLogoW" className='mt-4 me-2' width="100px"/>
                    </div>
                </div>

                <div className="nav-link text-start ms-5 home-link">
                    <NavLink to='/home'>
                        <AiOutlineHome className="text-white me-3" size="30" />
                        <label className="me-4">홈</label>
                    </NavLink> 
                </div>
                <div className="nav-link text-start ms-5">
                    <NavLink to="#">
                        {/* <BiMessageRoundedError className="text-white me-3" size="30" /> */}
                        <AiOutlineNotification className="text-white me-3" size="30"/>
                        <label className="me-4">공지사항</label>
                    </NavLink> 
                </div>
                <div className="nav-link text-start ms-5">
                    <NavLink className={`nav-link ${location.pathname === '/approveList' ? 'active' : ''}`} to="/approveList">
                        {/* <MdApproval className="text-white me-3" size="30" /> */}
                        <IoDocumentTextOutline className="text-white me-3" size="30"/>
                        <label className="me-4">전자결재</label>
                    </NavLink> 
                </div>
                <div className="nav-link text-start ms-5">
                    <NavLink to="/search">
                        {/* <BsFillPersonCheckFill className="text-white me-3" size="30" /> */}
                        <FaRegAddressCard className="text-white me-3" size="30"/>
                      <label className="me-4">주소록</label>
                    </NavLink>
                </div> 
                <div className="nav-link text-start ms-5">
                    <NavLink to="/com">
                        <BiChalkboard className="text-white me-3" size="30" />
                        <label className="me-4">TV</label>
                    </NavLink> 
                </div>
                <div className="nav-link text-start ms-5">
                    <NavLink to="#">
                        <MdPayment className="text-white me-3" size="30" />
                        <label className="me-4">카드</label>
                    </NavLink> 
                </div>
                <div className="nav-link text-start ms-5">
                    <NavLink to="#">
                        <BiLogOut className="text-white me-3" size="30" />
                        <label className="me-4">사직서</label>
                    </NavLink> 
                </div>

                {/* 관리자일 때만 나오기 */}
                <div className="mb-3 nav-link text-start ms-5">
                    <NavLink to="#">
                        <RiAdminLine className="text-white me-3 mt-1" size="30" />
                        <label className="me-4">관리자</label>
                    </NavLink> 
                </div>



            </div>

            <div className="main-content container-fluid">

                {/* <div className='row'><div className='col'>
                    <Emp/>
                </div></div> */}
            </div>




        </div>

    );
}
export default Sidebar