import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";

const ProfileEdit = ()=>{
  const [profile, setProfile] = useState({
    profileImage:null,
    empTel:"",
    empEmail:"",
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
        openModal(); // 프로필 로드가 완료된 후에 모달 열기
    })
    .catch(err=>{//실패
        console.error(err);
    });
  };
  

  useEffect(()=>{
    loadProfile(loggedInEmpNo);
  },[]);
  

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
  const updateProfile = async()=>{

    const copyProfile = {...profile};
    // delete copyProfile.attachNo;// 불필요한 attachNo 삭제

    //이미지 파일 가져가기(input[type="file"]을 사용한다고 가정)
    const changeImage = document.getElementById("changeImage");
    const profileImage = changeImage.files[0];
    
    // try{
    //프로필 데이터를 FormData로 만듦
    const formData = new FormData();
    formData.append("attachNo", copyProfile.attachNo);
    formData.append("empTel", copyProfile.empTel);
    formData.append("empEmail", copyProfile.empEmail);
    formData.append("profileTitle", copyProfile.profileTitle);
    formData.append("profileContent", copyProfile.profileContent);
    formData.append("profileImage", profileImage);
    // console.log(profileImage);

  //   const response = await axios.put(
  //     `http://localhost:8080/profile/${loggedInEmpNo}`,
  //     formData,
  //     {
  //       headers:{"Content-Type" : "multipart/form-data"},
  //     }
  //   );

  //     // 등록 후 목록을 다시 불러오기
  //     loadProfile(loggedInEmpNo);
  //     closeModal();
  //   }
  //   catch(error){
  //     console.error("이미지등록 실패");
  //   }
  // };
  
      
    axios({
      url:`http://localhost:8080/profile/${loggedInEmpNo}`,
      method:"put",
      data:formData,
      headers:{
        "Content-Type" : "multipart/form-data",
      },
    })
    .then(response=>{
      loadProfile(loggedInEmpNo);
      closeModal();
    })
    .catch(err=>{})
  };


  //이미지 미리보기 업데이트
  const updateImagePreview = ()=>{
    const changeImage = document.getElementById("changeImage");
    const previewImage = document.getElementById("previewImage");

    if(changeImage.files && changeImage.files[0]){
      const reader = new FileReader();

      reader.onload = (e) =>{
        previewImage.src = e.target.result;
      };

      reader.readAsDataURL(changeImage.files[0]);
    }
  };



  //모달 관련 처리
  const bsModal = useRef();
  const openModal = () =>{
    updateImagePreview();
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
              data-bs-backdrop="static" tabIndex={1} role="dialog" aria-hidden="true">
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
                      <div className="col-6 mt-4 text-center">
                        {/* <p>일단이미지번호들어오나보자 : 
                            {profile.attachNo}
                        </p> */}
                        <img src ={surf} alt="profileImage" id="previewImage" className="rounded-circle" 
                                style={{width:"180px", height:"180px", objectFit:"cover"}}/>
                        <input type="file" name="profileImage" id="changeImage" onChange={updateImagePreview}/>
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
                      </div>  
                      <div className="row">  
                        <div className="col-2">
                          <p>이메일</p>
                        </div>
                        <div className="col-10">
                          <input type="email" name="empEmail" className="form-control" 
                              value={profile.empEmail} onChange={changeProfile}/>
                        </div>
                      </div>  
                      <div className="row">
                        <div className="col-2">
                          <p>소개</p>
                        </div>
                        <div className="col-10">
                          <input type="text" name="profileTitle" className="form-control" 
                              value={profile.profileTitle} onChange={changeProfile}/>
                        </div>
                      </div>
                      <div className="row">
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