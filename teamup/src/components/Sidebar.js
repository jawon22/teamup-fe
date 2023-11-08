import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { levelState, userState } from '../recoil';
import Emp from './emp';
import {CgProfile} from "react-icons/cg";
import {BsFillBellFill} from "react-icons/bs";
import {RiKakaoTalkFill} from "react-icons/ri";
import TeamUpLogo from './images/TeamUpLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min'; // 부트스트랩 JavaScript 파일 임포트


const Sidebar = () => {
    // const [user, setUser] = useState({});
    const [user, setUser] = useRecoilState(userState);
    const [level, setLevel] = useRecoilState(levelState);

    const login = ()=>{
        setUser('testuser1');
        setLevel('VIP');
    };
    const logout = ()=>{
        setUser('');
        setLevel('');
    };

    return (
        <div>

            <div className="side-bar">
                <div className="icon">
                    <div>▼</div>
                    <div>▶</div>
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
                
                <nav className="navbar navbar-expand-lg bg-white pe-5 ms-5" data-bs-theme="light">
                    <div className="container-fluid ">
                        <NavLink className="navbar-brand"><img src={TeamUpLogo} alt="TemaUpLog" width={100}/></NavLink>                        
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                                <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">조직도</button>
                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav me-auto">



                            </ul>
                            <div className="d-flex">
                                <RiKakaoTalkFill className="text-primary ms-2 mt-1"size="40"/>
                                <BsFillBellFill className="text-primary ms-2 mt-1"size="40"/>
                                <CgProfile className="text-primary ms-2"size="50"/>
                            </div>
                        </div>
                    </div>
                </nav>
                    {/* 본문 */}

                {/* offcanvas  */}
                <div className='row'><div className='col-10 offset-1'>   
                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasRightLabel">조직도</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            조직도 자리 
                        </div>
                    </div>
                </div></div>

                <div className='row'><div className='col ms-5'>
                    <Emp/>
                </div></div>
            </div>




        </div>

    );
}
export default Sidebar