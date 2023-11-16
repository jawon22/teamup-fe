import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";

const ProfileEdit = ()=>{
  const [profile, setProfile] = useState({});

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
        openModal(); // 프로필 로드가 완료된 후에 모달 열기
    })
    .catch(err=>{//실패
        console.error(err);
    });
  };
  

  useEffect(()=>{
    loadProfile(loggedInEmpNo);
  },[loggedInEmpNo]);
  

  // 프로필 수정창 열기
  const editProfile = (loggedInEmpNo) =>{
    console.log(loggedInEmpNo);
    // 해당 직원의 프로필을 불러옴
    loadProfile(loggedInEmpNo);
    // const findProfile = profile;//현재의 profile 상태를 가져옴
    // console.log(findProfile);
    // // 해당 직원의 프로필을 불러옴
    // setProfile(findProfile);
    // openModal();
  };


  //수정한 값 처리
  const changeProfile = (e)=>{
    // console.log("Changing Profile:", e.target.name, e.target.value);
    setProfile({
      ...profile,
      [e.target.name] : e.target.value
    });
  };


  //프로필 수정 처리
  const updateProfile = ()=>{
    console.log("Updating Profile:", profile);
    const copyProfile = {...profile};
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
                            {profile.attachNo}
                        </p> */}
                        <img src ={surf} alt="profileImage"/>
                      </div>
                      <div className="col-6 mt-5">
                        <p>부서 : {profile.deptName}</p>
                        <p>직위 : {profile.empPositionName}</p>
                        <p>이름 : {profile.empName}</p>
                        <p>입사일 : {profile.empJoin}</p>
                      </div>
                    </div>

                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-2">
                          <p>연락처</p>
                        </div>
                        <div className="col-10">
                          <input type="tel" name="empTel" className="form-control" 
                              value={profile.empTel} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>이메일</p>
                        </div>
                        <div className="col-10">
                          <input type="email" name="empEmail" className="form-control" 
                              value={profile.empEmail} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>소개</p>
                        </div>
                        <div className="col-10">
                          <input type="text" name="profileTitle" className="form-control" 
                              value={profile.profileTitle} onChange={changeProfile}/>
                        </div>
                        <div className="col-2">
                          <p>내용</p>
                        </div>
                        <div className="col-10">
                          <textarea name="profileContent" className="form-control" rows="4"
                              value={profile.profileContent} onChange={changeProfile}/>
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