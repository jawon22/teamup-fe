import axios from "axios";
import { useState, useEffect, useRef } from "react";
import surf from "./images/profileImage.png";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { FaEdit } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const ProfileEdit = ()=>{
  const [profile, setProfile] = useState({
    attach:"",
    empTel:"",
    empEmail:"",
    profileTitle:"",
    profileContent:""
  });
  // console.log(profile);

  const [user, setUser] = useRecoilState(userState);
  const loggedInEmpNo = parseInt(user.substring(6));

  // const bsModal = useRef();
  const [showModal, setShowModal] = useState(false);


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
    })
    .catch(err=>{//실패
        console.error(err);
    });
  };

  useEffect(()=>{
    loadProfile(loggedInEmpNo);
  },[]);



  // console.log(loggedInEmpNo);

  //이미지 불러오기
  // const loadProflieImage = async (profilNo) =>{
  //   try{
  //     const imageUrl = await axios({
  //       url:`http://localhost:8080/profile/${profilNo}`,
  //       method:"get",
  //       responseType : "blob",//이미지 데이터를 바이너리 형식으로 받기 위한 설정
  //     })
  //     .then(response =>{
  //       const blob = new Blob([response.data], {type: response.headers['content-type']});
  //       return URL.createObjectURL(response.data);
  //     });
      
  //     //이미지 URL을 사용하여 이미지 미리보기 업데이트
  //     const previewImage = document.getElementById("previewImage");
  //     previewImage.src = imageUrl;
  //     console.log(imageUrl);
  //   } 
    
  //   catch (error) {
  //     console.error("프로필 이미지 불러오기 에러", error);
  //     return null;
      
  //   }
  // };
  
  
  
  //이미지 미리보기 업데이트
  const updateImagePreview = ()=>{
    const changeImage = document.getElementById("changeImage");
    const previewImage = document.getElementById("previewImage");
    
    if(changeImage && changeImage.files && changeImage.files[0]){
      
      const file = changeImage.files[0];
      
       // 미리보기 업데이트
      previewImage.src = URL.createObjectURL(file);
        
      // 서버로 선택된 이미지를 업로드
      // const formData = new FormData();
      // formData.append("attach", file);
      
      // reader.readAsDataURL(file);
      // reader.readAsArrayBuffer(file);
      
      // 여기에 이미지를 서버에 업로드하는 로직을 추가해야 합니다.
      // axios를 사용하여 서버에 이미지 업로드 요청을 보내세요.
      // axios({
      //   url:`http://localhost:8080/profile/${loggedInEmpNo}`,
      //   method:"put",
      //   // responseType : "blob"
      //   data: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // })
      // .then(response =>{
      //   // const arrayBuffer = e.target.result;
      //   // const blob = new Blob([arrayBuffer], { type: file.type });
      // })
      // .catch(err =>{});
      
    }
    
    
  };


    // 프로필 수정창 열기
    const editProfile = () =>{
      // console.log(loggedInEmpNo);
      // 해당 직원의 프로필을 불러옴
      // const findProfile = profile;//현재의 profile 상태를 가져옴
      // console.log(findProfile);
      // // 해당 직원의 프로필을 불러옴
      // setProfile(findProfile);
      openModal();
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
    // formData.append("attach", attach);

    // 이미지 파일이 있는 경우에만 FormData에 추가
    if (attach) {
      formData.append("attach", attach);
    }

    try{
      //서버로 업데이트 요청 전송
      await axios({
        url:`http://localhost:8080/profile/${loggedInEmpNo}`,
        method:"put",
        data: formData,
        headers:{
          "Content-Type": "multipart/form-data",
        },
      });

      
      // FormData에 파일을 추가하고 나서 프로필 상태 업데이트
      setProfile({
        ...profile,
        attach: attach,
      });


      //업데이트 성공 시 모달 닫기
      closeModal();
    }
    catch(error){
      console.error("프로필 업데이트 에러", error);
      //수정한 이미지 파일이 없는 경우에도 모달 닫기
      closeModal();
    }



    //프로필 데이터 및 이미지 업데이트
  //   axios({
  //     url:`http://localhost:8080/profile/${loggedInEmpNo}`,
  //     method:"put",
  //     data:formData,
  //     headers:{
  //       "Content-Type" : "multipart/form-data",
  //     },
  //   })
  //   .then(response=>{
      
  //     closeModal();
  //   })
  //   .catch(err=>{})
  };


  



  //모달 관련 처리

  const openModal = () =>{
    setShowModal(true);
  };
  const closeModal = () =>{
    setShowModal(false);
  };

  //이미지를 만들기 위해서 필요한 것은 사번
  //사번만 알면 <img src="http://localhost:8080/image/profile/사번">으로 이미지를 출력할 수 있다
  const [imgSrc, setImgSrc] = useState(null);//처음에는 없다고 치고 기본이미지로 설정
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
      <div className="row">
        <div className="col">
          <button className="btn btn-primary" onClick={()=>editProfile(loggedInEmpNo)}>프로필수정</button>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        show={showModal}
        onHide={closeModal} 
        backdrop="static"
        size="md"
        centered={true}
        aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h5 className="modal-title">프로필</h5>
              {/* <button type="button" className="btn-close" data-dismiss="modal" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example mt-3">
          <Container>
            <Row>
              <Col xs={6} md={6}>
                <label className="profile-file-button justify-content-end" for="changeImage">
                  <img src={displayImage} alt="profileImage" id="previewImage" className="rounded-circle" 
                      style={{width:"180px", height:"180px", objectFit:"cover"}}/>
                  <IoCamera style={{width:"30px", height:"30px"}} className="ms-150"/>
                </label>
                <input type="file" name="attach" id="changeImage" style={{display:"none"}} onChange={updateImagePreview}/>
              </Col>
              <Col xs={6} md={6}>
                <p>부서 : {profile.deptName}</p>
                <p>직위 : {profile.empPositionName}</p>
                <p>이름 : {profile.empName}</p>
                <p>입사일 : {profile.empJoin}</p>
              </Col>
            </Row>

            <Row>
              <Col xs={4} md={3} className="text-center">
                <p>연락처</p>
              </Col>
              <Col xs={8} md={9}>
                <input type="tel" name="empTel" className="form-control" 
                        value={profile.empTel} onChange={changeProfile}/>
              </Col>
            </Row>
            

            <Row>
              <Col xs={4} md={3} className="text-center">
                <p>이메일</p>
              </Col>
              <Col xs={8} md={9}>
                <input type="email" name="empEmail" className="form-control" 
                        value={profile.empEmail} onChange={changeProfile}/>
              </Col>
            </Row>

            <Row>
              <Col xs={4} md={3} className="text-center">
                <p>소개</p>
              </Col>
              <Col xs={8} md={9}>
                <input type="text" name="profileTitle" className="form-control" 
                        value={profile.profileTitle} onChange={changeProfile}/>
              </Col>
            </Row>

            <Row>
              <Col xs={4} md={3} className="text-center">
                <p>내용</p>
              </Col>
              <Col xs={8} md={9}>
                <textarea name="profileContent" className="form-control" rows="4"
                            value={profile.profileContent} onChange={changeProfile}/>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>닫기</Button>
          <Button variant="primary" onClick={updateProfile}>수정</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileEdit;