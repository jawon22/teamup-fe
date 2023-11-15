import { useRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import { userState } from "../recoil";
import axios from "axios";
import Attend from './attend';

const Mypage = () => {
    const [empInfo, setEmpInfo] = useState({
        comId: '',
        deptNo: '',
        empId: '',
        empName: '',
        empEmail: '',
        empPositionNo: '',
        empTel: '',
        empJoin: ''
    });
    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);

    const myInfo = () => {
        axios({
            url: `http://localhost:8080/emp/mypage/${empNo}`,
            method: 'get',
        }).then(response => {
            console.log(response.data);
            setEmpInfo(response.data);
        });
    };

    useEffect(() => {
        myInfo();
    }, []);

    return (
        <>
            <div className="container">

                <div className="row mt-4">
                    <div className="col-8 offset-4">
                        <h1>마이페이지</h1>
                    </div>
                </div>

                <div className="row mt-4 mp-bg">
                    <div className="col-8 offset-4">
                        {empNo}
                        이름: {empInfo.empName} <br />
                        부서번호: {empInfo.deptNo} <br />
                        사원번호: {empInfo.empId} <br />
                        회사아이디: {empInfo.comId} <br />
                        이메일: {empInfo.empEmail} <br />
                        직급: {empInfo.empPositionNo} <br />
                        이름: {empInfo.empTel} <br />
                        이름: {empInfo.empJoin} <br />
                    </div>
                </div>

                <div className="row mt-4">

                    <div className="col-6 text-center">
                        {/* 연차 관리 */}
                        <div className="row mp-bg m-3">
                            <div className="col-12">
                                연차 관리
                            </div>
                        </div>
                    </div>

                    <div className="col-6 text-center">
                        {/* 근태 관리 */}
                        <div className="row mp-bg m-3">
                            <div className="col-12">
                            <Attend />
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Mypage;
