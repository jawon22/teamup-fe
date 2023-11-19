import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { FaEdit } from "react-icons/fa";

const ProfileEdit = ()=>{
  const [profile, setProfile] = useState({
    attach:"",
    empTel:"",
    empEmail:"",
    profileTitle:"",
    profileContent:""
  });
  console.log(profile);

  const [user, setUser] = useRecoilState(userState);
  const loggedInEmpNo = parseInt(user.substring(6));
  console.log(loggedInEmpNo);

  //프로필 조회
  const loadProfile = (empNo) => {
    axios ({
      url:`http://localhost:8080/profile/${empNo}`,
      method:"get",
    })
    .then(response =>{//성공
        // console.log(response);
        setProfile(response.data);
        // 이미지 정보 업데이트
        updateImagePreview();

        // 프로필 로드가 완료된 후에 모달 열기
        openModal();

        // 서버에서 가져온 데이터가 있을 때만 로컬 스토리지에서 이미지 데이터 가져오기
        // const savedImage = localStorage.getItem("profileImage");
        // if (savedImage && response.data.attach) {
        //   setProfile({
        //     ...response.data,
        //     attach: savedImage,
        //   });
        // }
    })
    .catch(err=>{//실패
        console.error(err);
    });
  };
  

  useEffect(()=>{
    loadProfile(loggedInEmpNo);
  },[]);
  

  // 프로필 수정창 열기
  const editProfile = () =>{
    // console.log(loggedInEmpNo);
    // 해당 직원의 프로필을 불러옴
    loadProfile(loggedInEmpNo);
    // const findProfile = profile;//현재의 profile 상태를 가져옴
    // console.log(findProfile);
    // // 해당 직원의 프로필을 불러옴
    // setProfile(findProfile);
    // openModal();
  };

  
  //이미지 미리보기 업데이트
  const updateImagePreview = async ()=>{
    const changeImage = document.getElementById("changeImage");
    const previewImage = document.getElementById("previewImage");
    
    if(changeImage.files && changeImage.files[0]){
      // 파일이 선택된 경우 미리보기를 업데이트하고 LocalStorage에 저장
      const file = changeImage.files[0];
      
      //미리보기 업데이트
      const reader = new FileReader();
      reader.onload = (e) =>{
        previewImage.src = e.target.result;
        
        // empNo를 사용하여 고유한 키 생성
        const key = `profileImage_${loggedInEmpNo}`;

        // 파일을 Blob 형태로 변환하여 로컬 스토리지에 저장
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        
        localStorage.setItem(key, blobUrl);
      };

      reader.readAsDataURL(file);

      // // FormData에 파일 추가
      // const formData = new FormData();
      // formData.append("attach", file);

      // // 프로필 상태 업데이트
      // setProfile({
      //   ...profile,
      //   attach: formData,
      // });

    }
    else{
       // 파일이 선택되지 않은 경우 LocalStorage의 데이터가 Blob URL인지 확인
      const key = `profileImage_${loggedInEmpNo}`;
      const savedData = localStorage.getItem(key);

      if (savedData && savedData.startsWith("blob:")) {
        // 데이터가 Blob URL인 경우 직접 src 속성으로 설정
        previewImage.src = savedData;
      }
      else {
        // 데이터가 Blob URL이 아닌 경우 서버에서 이미지를 가져옴
        try {
          const response = await axios.get(`http://localhost:8080/profile/image/${profile.empNo}`, {
            responseType: "blob",
          });

          // 미리보기 업데이트
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImage.src = e.target.result;
            
            const blob = new Blob([e.target.result], { type: response.data.type });
            const blobUrl = URL.createObjectURL(blob);
            localStorage.setItem(key, blobUrl);
          };
  
          reader.readAsDataURL(response.data);
          
        } catch (error) {
          console.error("서버에서 프로필 이미지 가져오기 오류:", error);
        }
      }
    }
  };




  //수정한 값 처리
  const changeProfile = (e)=>{
    if (e.target.type === "file") {
      // 파일 업로드 시
      const file = e.target.files[0];
      setProfile({
        ...profile,
        attach: file,
      });
      updateImagePreview(file);
    } else {
      // 텍스트 입력 시
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    }
  };


  //프로필 수정 처리
  const updateProfile = async()=>{

    // const copyProfile = {...profile};
    // delete copyProfile.attachNo;// 불필요한 attachNo 삭제

    //이미지 파일 가져가기(input[type="file"]을 사용한다고 가정)
    const changeImage = document.getElementById("changeImage");
     // console.log(changeImage);
     const attach = changeImage.files[0];
     // console.log(attach);
    
    //프로필 데이터를 FormData로 만듦
    const formData = new FormData();
    formData.append("empTel", profile.empTel);
    formData.append("empEmail", profile.empEmail);
    formData.append("profileTitle", profile.profileTitle);
    formData.append("profileContent", profile.profileContent);
    formData.append("attach", attach);
    // console.log(formData);

    // FormData에 파일을 추가하고 나서 프로필 상태 업데이트
    setProfile({
      ...profile,
      attach: formData,
    });


    //프로필 데이터 및 이미지 업데이트
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
                        {/* <FaEdit type="file" name="attach" id="changeImage" onChange={updateImagePreview}/> */}
                        <input type="file" name="attach" id="changeImage" onChange={updateImagePreview}/>
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