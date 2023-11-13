import React, { useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { companyState, levelState, userState } from '../recoil';
import Emp from './emp';
import {AiOutlineMenu, AiOutlineHome} from "react-icons/ai";
import {BiMessageRoundedError} from "react-icons/bi";
import {MdApproval} from "react-icons/md";
import {BsFillPersonCheckFill} from "react-icons/bs";
import {BiChalkboard} from "react-icons/bi";
import {MdPayment} from "react-icons/md";
import {BiLogOut} from "react-icons/bi";
import {RiAdminLine} from "react-icons/ri";


import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min'; // 부트스트랩 JavaScript 파일 임포트


const Sidebar = (props) => {
    // const [user, setUser] = useState({});
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);
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
                
                <div className='row'><div className='col'>            
                            <div className='text-end' >
                                {user}{company}
                                <button onClick={login} className='btn btn-primary'>로그인</button>
                                <button onClick={logout} className='btn btn-primary'>로그아웃</button>
                                <NavLink to='/login' className="nav-link">
                                    로그인 페이지로
                                </NavLink>
                            </div>                
                </div> </div>

                <div className="mb-3">
                    <NavLink to='/home' className="nav-link">
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
                    <NavLink   to="/search">
                      <label className="me-4">주소록</label>
                        <BsFillPersonCheckFill className="text-white me-3 mt-1" size="35" />
                    </NavLink>
                </div> 
                <div className="mb-3">
                    <NavLink to="/com">
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