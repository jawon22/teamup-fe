import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";

const ProfileEdit = ()=>{
  const [profile, setProfile] = useState({
    attachNo:0,
    empNo:0,
    deptName:"",
    empPositionName:"",
    empName:"",
    empTel:"",
    empEmail:"",
    empJoin:"",
    profileTitle:"",
    profileContent:""
  });

  const [user, setUser] = useRecoilState(userState);
  const loggedInEmpNo = parseInt(user.substring(6));

  //프로필 조회
  const loadProfile = (empNo) => {
    axios ({
      url:`http://localhost:8080/profile/${empNo}`,
      method:"get",
  })
  .then(response =>{//성공
      console.log(response);
      setProfile(response.data);
  })
  .catch(err=>{//실패
      console.error(err);
  });
  };
  

  useEffect(()=>{
    loadProfile(loggedInEmpNo);
  },[loggedInEmpNo]);
  

  const [profileone, setProfileone] =useState({});

  // 프로필 수정창 열기
  const editProfile = () =>{
    // console.log(empNo);
    const findProfile = profile.find(pro=>pro.empNo === loggedInEmpNo);
    // 해당 직원의 프로필을 불러옴
    setProfileone(findProfile);
    openModal();
  };


  //수정한 값 처리
  const changeProfile = (e)=>{
    setProfileone({
      ...profileone,
      [e.target.name] : e.target.value
    });
  };


  //프로필 수정 처리
  const updateProfile = ()=>{
    const copyProfile = {...profileone};
    // delete copyProfile.profileNo;

    axios({
      url:`http://localhost:8080/profile/${loggedInEmpNo}`,
      method:"put",
      data:copyProfile
    })
    .then(response=>{
      loadProfile(loggedInEmpNo);
      closeModal();
    })
    .catch(err=>{})
  };





  //모달 관련 처리
  const bsModal = useRef();
  const openModal = () =>{
      const modal = new Modal(bsModal.current);
      modal.show();
  };
  const closeModal = () =>{
      const modal = Modal.getInstance(bsModal.current);
      modal.hide();
      // clearProfile();
  };


  return (
    <>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary" onClick={()=>editProfile(loggedInEmpNo)}>프로필수정</button>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" ref={bsModal} 
              data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">프로필</h5>
              <button type="button" className="btn-close" data-dismiss="modal" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <div className="col-6">
                        {/* <p>일단이미지번호들어오나보자 : 
                            {profileone.attachNo}
                        </p> */}
                        <img src ={surf} alt="profileImage"/>
                      </div>
                      <div className="col-6 mt-5">
                        <p>부서 : {profileone.deptName}</p>
                        <p>직위 : {profileone.empPositionName}</p>
                        <p>이름 : {profileone.empName}</p>
                        <p>입사일 : {profileone.empJoin}</p>
                      </div>
                    </div>

                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-2">
                          <p>연락처</p>
                        </div>
                        <div className="col-10">
                          <input type="tel" name="empTel" className="form-control" 
                              value={profileone.empTel} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>이메일</p>
                        </div>
                        <div className="col-10">
                          <input type="email" name="empEmail" className="form-control" 
                              value={profileone.empEmail} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>소개</p>
                        </div>
                        <div className="col-10">
                          <input type="text" name="profileTitle" className="form-control" 
                              value={profileone.profileTitle} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>내용</p>
                        </div>
                        <div className="col-10">
                          <textarea name="profileContent" className="form-control" rows="4"
                              value={profileone.profileContent} onChange={changeProfile}/>
                        </div>
                      </div>
                    </div> 

                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="row">
                <div className="col">
                  <button className="btn btn-secondary ms-1" onClick={closeModal}>닫기</button>
                  <button className="btn btn-primary ms-1" onClick={updateProfile}>수정</button>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div> 
    </>
  );
};

export default ProfileEdit;