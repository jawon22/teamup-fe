import React from "react";
import { NavLink } from "react-router-dom";
const Home = ()=>{


    return (
    <div className="container-fluid">
        <div className="row ms-3">
            <div className="col">
                <h1 >홈페이지</h1>

        <NavLink to="/myPage">마이페이지</NavLink> <br/>
        <NavLink to="/profileEdit">프로필 수정(마이페이지에 넣을껍니당)</NavLink> <br/>
        <NavLink to="/calendar">일정</NavLink>

            </div>
        </div>
    </div>);
};
export default Home;