import { useRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import { userState } from "../recoil";
import axios from "axios";
import Attend from './attend';
import surf from "./images/profileImage.png";
import { FaEdit } from "react-icons/fa";


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



//로그인한 회원의 마이페이지 프로필이미지
  const loggedInEmpNo = parseInt(user.substring(6));

  const [imgSrc, setImgSrc] = useState(surf);//처음에는 없다고 치고 기본이미지로 설정
  useEffect(()=>{
    axios({
      url:`http://localhost:8080/image/profile/${loggedInEmpNo}`,
      method:"get"
    })
    .then(response=>{
      setImgSrc(`http://localhost:8080/image/profile/${loggedInEmpNo}`);
    })
    .catch(err=>{
      setImgSrc(surf);
    });
  }, []);

  //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
  const displayImage = imgSrc || surf;


    return (
        <>
            <div className="container m-5 ps-5 pe-5">

                {/* 마이페이지 상세 */}
                <div className="row mt-4 mp-bg text-green">

                    <div className="col-5 d-flex justify-content-center align-items-center">
                        <img src={displayImage} alt="profileImage" id="previewImage" 
                                className="rounded-circle" 
                                style={{width:"220px", height:"220px", objectFit:"cover"}}/>
                        <button type="button" className="btn btn-primary btn-icon rounded-circle" height="40px">
                            <FaEdit size="30px" className="mt-150"/>
                        </button>
                    </div>

                    <div className="col-7 p-4">

                        <div className="row mt-3">
                            <div className="col-4 text-bold">부서번호</div>
                            <div className="col-8">{empInfo.deptNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">사원번호</div>
                            <div className="col-8">{empInfo.empNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">이름</div>
                            <div className="col-8">{empInfo.empName}</div>
                        </div> 
                        <div className="row mt-2">
                            <div className="col-4 text-bold">연락처</div>
                            <div className="col-8">{empInfo.empTel}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">이메일</div>
                            <div className="col-8">{empInfo.empEmail}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">직급</div>
                            <div className="col-8">{empInfo.empPositionNo}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4 text-bold">가입일</div>
                            <div className="col-8">{empInfo.empJoin}</div>
                        </div>
                        <div className="row mt-2 mb-3">
                            <div className="col-4 text-bold">회사아이디</div>
                            <div className="col-8">{empInfo.comId}</div>
                        </div>

                    </div>
                </div>
                        
                <div className="row mt-5 text-green">
                    {/* 근태 관리 */}
                    <div className="text-center text-green">
                        <div className="row mp-bg mb-4 p-4">
                            <div className="col-12">
                            <Attend/>   
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default Mypage;
