import { useRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import { userState } from "../recoil";
import axios from "axios";
import Attend from './attend';
import AttendDetail from './attendDetail';

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
            <div className="container m-5">

                {/* 마이페이지 상세 */}
                <div className="row mt-4 mp-bg text-green">
                    <div className="col-4 offset-4">

                        <div className="row mt-3">
                            <div className="col-6 text-bold">부서번호</div>
                            <div className="col-6">{empInfo.deptNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-6 text-bold">사원번호</div>
                            <div className="col-6">{empInfo.empNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-6 text-bold">이름</div>
                            <div className="col-6">{empInfo.empName}</div>
                        </div> 
                        <div className="row mt-2">
                            <div className="col-6 text-bold">연락처</div>
                            <div className="col-6">{empInfo.empTel}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-6 text-bold">이메일</div>
                            <div className="col-6">{empInfo.empEmail}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-6 text-bold">직급</div>
                            <div className="col-6">{empInfo.empPositionNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-6 text-bold">가입일</div>
                            <div className="col-6">{empInfo.empJoin}</div>
                        </div>
                        <div className="row mt-2 mb-3">
                            <div className="col-6 text-bold">회사아이디</div>
                            <div className="col-6">{empInfo.comId}</div>
                        </div>

                    </div>
                </div>
                        
                <div className="row mt-4 text-green">
                    {/* 연차 관리 */}
                    <div className="col-6 text-center">
                        <div className="row mp-bg mb-4 me-1">
                            <div className="col-12">
                                연차 관리
                            </div>
                        </div>
                    </div>

                    {/* 근태 관리 */}
                    <div className="col-6 text-center text-green text-bold">
                        <div className="row mp-bg mb-4 ms-1">
                            <div className="col-12">
                            <Attend/>   
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 근태 관리 상세 */}
                <div className="row p-5 text-center green-color mp-bg">
                    <div className="col-12">
                        <AttendDetail/>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Mypage;
