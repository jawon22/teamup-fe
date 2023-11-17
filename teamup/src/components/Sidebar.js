import React, { useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { companyState, levelState, userState } from '../recoil';
import Emp from './emp';
import { AiOutlineHome} from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";//전자결재
import { AiOutlineNotification } from "react-icons/ai";//공지사항
import { FaRegAddressCard } from "react-icons/fa";//주소록
import { MdOutlineWorkHistory } from "react-icons/md";//근태관리
import { GiReceiveMoney } from "react-icons/gi";//급여내역
import {BiLogOut} from "react-icons/bi";//로그아웃
import { MdOutlineManageAccounts } from "react-icons/md";//관리자메뉴
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
        setUser('202302034');
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

                <div className="ms-4">
                    <NavLink to='/home' className="home-link nav-link d-flex align-items-center">
                        <AiOutlineHome className="text-white me-3" size="30" />
                        <span>홈</span>
                    </NavLink> 
                </div>
                <div className="ms-4">
                    <NavLink to="#" className="nav-link d-flex align-items-center">
                        <AiOutlineNotification className="text-white me-3" size="30"/>
                        <span>공지사항</span>
                    </NavLink> 
                </div>
                <div className="ms-4">
                    <NavLink className={`nav-link ${location.pathname === '/approveList' ? 'active' : ''}, d-flex align-items-center`} to="/approveList">
                        <IoDocumentTextOutline className="text-white me-3" size="30" />
                        <span>전자결재</span>
                    </NavLink> 
                </div>
                <div className="ms-4">
                    <NavLink to="/search" className="nav-link d-flex align-items-center">
                        <FaRegAddressCard className="text-white me-3" size="30"/>
                        <span>주소록</span>
                    </NavLink>
                </div> 
                <div className="ms-4">
                    <NavLink to="/salList" className="nav-link d-flex align-items-center">
                        <GiReceiveMoney className="text-white me-3" size="30"/>
                        <span>급여내역</span>
                    </NavLink> 
                </div>
                <div className="ms-4">
                    <NavLink to="#" className="nav-link d-flex align-items-center">
                        <BiLogOut className="text-white me-3" size="30" />
                        <span>로그아웃</span>
                    </NavLink> 
                </div>

                {/* 관리자일 때만 나오기 */}
                <div className="ms-4">
                    <NavLink to="#" className="nav-link d-flex align-items-center">
                        <MdOutlineManageAccounts className="text-white me-3 mt-1" size="30"/>
                        <span>관리자</span>
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