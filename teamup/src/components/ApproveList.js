import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import axios from "axios";
// import { Modal } from "bootstrap";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { useRecoilState } from 'recoil';
import { userState } from '../recoil';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { copy } from 'stylis';

const ApproveList = (props)=>{
    const location = useLocation();
    const [user,setUser] = useRecoilState(userState);
    const [apprList,setApprList] = useState([]); //결재 계층형 데이터(처음에 오는 것)
    const [apprData, setApprData] = useState([]); // 클릭한 결재 정보
    const [receiver, setReceiver] = useState([]); //승인자만 저장
    const [receiverInfo, setReceiverInfo] = useState([]); //승인자의 정보
    const [approveReceiver, setApproveReceiver] = useState([]); //승인자의 사원정보
    const [receiverPosition, setReceiverPosition] = useState([]); //자신을 제외한 사원정보

    const [referer, setReferer] = useState([]); //참조자만 저장
    const [empList, setEmpList] = useState([]); // 회원에 대한 모든 정보 
    const [emp, setEmp] = useState([]); //결재 하나의 회원정보
    const [ycount, setYCount] = useState([]);// Y카운트 갯수

    const empNo = parseInt(user.substring(6)); //로그인한 사람의 사원번호

    // receivers
    const divideReceiversDto = ()=>{
        const receiversList = apprData.receiversDtoList ? apprData.receiversDtoList.map(receiver => receiver.receiversReceiver) : [];
        setReceiver(receiversList);
    }
    console.log(receiver);
    console.log(receiverInfo);
    console.log(approveReceiver);

    // receivers의 모든정보추출
    const findReceiverInfo = ()=>{
        const search = receiver.map(empNo => empList.find(emp => emp.empNo === empNo)); // 해당 승인자의 모든 정보 추출
        setApproveReceiver(search);

        const receiversStatusArray = receiver.map(empNo =>
            apprData.receiversDtoList.find(receiverDto => receiverDto.receiversReceiver === empNo)?.receiversStatus);
        
        // empNo, empInfo, receiversStatus를 합쳐서 새로운 배열 생성
        const combinedArray = receiver.map((empNo, index) => ({
            empInfo: search[index],
            receiversStatus: receiversStatusArray[index],
        }));    

        setReceiverInfo(combinedArray);

        // return receiver.map(recNo => { // 해당 승인자의 번호와 직급순서 추출
        //     const foundEmp = empList.find(emp => emp.empNo === recNo);
        //     return foundEmp ? {empNo: foundEmp.empNo, empPositionNo: foundEmp.empPositionNo} : null
        // });
    }
    
    useEffect(()=>{
        findReceiverInfo();
        approveCompute();
    },[receiver])
    
    // referers
    const divideReferersDto = ()=>{
        const referersList = apprData.referrersDtoList ? apprData.referrersDtoList.map(referer => referer.referrersReferrer) : [];
        setReferer(referersList);
    }
    
    console.log(apprList);
    // console.log(approveDto);
    // console.log(receiver);
    // console.log(referer);
    
    // 수신버튼을 눌렀을때 (페이지 기본)
    // 로그인한 사람이 결재의 승인자로 지정 되어있는 기안만
    const susinButton = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            const updateApprList = response.data.filter((appr)=> 
                appr.receiversDtoList.some((receiver)=> receiver.receiversReceiver === empNo));
            setApprList(updateApprList);
        });
    };
    
    // 발신버튼을 눌렀을때
    // 로그인한 사람이 작성한 기안만 + 진행상태가 진행중
    const barsinButton = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            const updateApprList = response.data.filter((appr) => 
            appr.approveDto.apprSender === empNo &&
                appr.status ==='진행');
            setApprList(updateApprList);
        });
    }

    // 완료버튼을 눌렀을때
    // 로그인한 사람이 작성한 기안 + 진행상태가 반료or완료
    const checkButton = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            const updateApprList = response.data.filter((appr) => 
                appr.approveDto.apprSender === empNo &&
                appr.status !== '진행');
            setApprList(updateApprList);
        });
    };

    // 참조버튼을 눌렀을때
    // 로그인한 사람이 결재의 참조자로 지정 되어있는 기안만
    const chamjoButton = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            const updateApprList = response.data.filter((appr)=> 
                appr.referrersDtoList.some((referer)=> referer.referrersReferrer === empNo));
            setApprList(updateApprList);
        });
    };
    
    useEffect(()=>{
        susinButton();
        listEmp();
    },[]);
    useEffect(()=>{
        divideReceiversDto();
        divideReferersDto();
    },[apprData])

    //전자결재 상세 모달처리
    const approveOneClick = (target)=>{
        const findTargetData = empList.find(em => em.empNo === target.approveDto.apprSender);
        setEmp(findTargetData);

        setApprData(target);

        openModal();
    }

    //회원의 정보
    const listEmp = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/emp/`,
            method:"get"
        })
        .then(response =>{
            setEmpList(response.data);
        })
    };
    
    console.log(empList);
    console.log(emp);
    console.log(apprData);
    // console.log(approveReceiver.empInfo.empNo);

    const [myApprInfo, SetMyApprInfo] = useState([]);

    useEffect(()=>{
        approveCompute();
    },[apprData])
    console.log(myApprInfo);

    //상세를 누르면 승인자들의 직급에 따라 계산
    const approveCompute = ()=>{
        const myInfo = receiverInfo.find(userInfo => userInfo.empInfo.empNo === empNo); //자신의 정보
        if(myInfo){
            const myApprInfo = apprData.receiversDtoList.find(receiver => receiver.receiversReceiver === empNo);
            SetMyApprInfo(myApprInfo);

            const higherPosition = receiverInfo.filter(userInfo => 
                    userInfo.empInfo.empPositionNo > myInfo.empInfo.empPositionNo)
            setReceiverPosition(higherPosition);

            const ycount = higherPosition.filter(i => i.receiversStatus ==="Y");
            setYCount(ycount)
        }
    };
    console.log(receiverPosition);
    console.log(receiverPosition.length);
    console.log(ycount);
    console.log(ycount.length);


    //자신이 올린 결재 삭제 처리
    const deleteAppr = (apprNo) =>{
        const choice = window.confirm("삭제하시나요?");
        if(choice ===false) return;

        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/${apprNo}`,
            method:"delete"
        })
        .then(response=>{
            barsinButton();
            closeModal();
        })
        .catch(err=>{});
    }

    const [checkRecevier , setCheckReceiver] = useState({
        receiversNo :0,
        pahtNo:0,
        receiversReceiver:0,
        receiversStatus:"",
        receiversConfirmTime:"",
        receiversReturnRs:""
    });

    const changeRecevier = (e)=>{
        setCheckReceiver((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    //승인자 결재 승인 처리
    const checkAppr = async()=>{
        const copyReceiver = {...checkRecevier};
        delete copyReceiver.pahtNo;
        delete copyReceiver.receiversReceiver;
        
        const response = await axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/${copyReceiver.pahtNo}/${copyReceiver.receiversReceiver}`,
            method:"put",
            data:copyReceiver
        });
        susinButton();
        closeModal();
    }

    //모달 관련 처리
    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="text-end my-3" >
                        <NavLink className={`nav-link ${location.pathname === '/approveWrite' ? 'active' : ''}`} to="/approveWrite">
                            <button className="btn btn-info">기안 상신 작성</button>
                        </NavLink>
                    </div>

                    <div className="btn-group text-start" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1"/>
                        <label className="btn btn-outline-primary" for="btnradio1" onClick={susinButton}>수신</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2"/>
                        <label className="btn btn-outline-primary" for="btnradio2" onClick={barsinButton}>발신</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3"/>
                        <label className="btn btn-outline-primary" for="btnradio3" onClick={checkButton}>완료</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio4"/>
                        <label className="btn btn-outline-primary" for="btnradio4" onClick={chamjoButton}>참조</label>
                    </div>

                    <div className='row'>
                        <div className='col'>

                            <table className='table table-hover text-center'>
                                <thead>
                                    <tr>
                                        <th className='text-start'>제목</th> 
                                        <th>발신인</th> 
                                        <th>상신일</th> 
                                        <th>마감일</th> 
                                        <th>상태</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {apprList.map((appr,index)=>(
                                        <tr key={index} onClick={e=>approveOneClick(appr)}>
                                            <td className='text-start'>
                                                {appr.approveDto.apprTitle}
                                            </td>
                                            <td>{appr.empName}</td>
                                            <td>{appr.approveDto.apprDateStart}</td>
                                            <td>{appr.approveDto.apprDateEnd}</td>
                                            <td>{appr.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

                    {/* Modal */}
                    <Modal
                        show={show}
                        onHide={closeModal}
                        backdrop="static"
                        keyboard={true}
                        {...props}
                        size="lg"
                        aria-labelledby="approve-modal"
                        centered>
                        <Modal.Body border="dark" style={{ width: '50rem'}}>
                            <Container>
                                {/* {조건 ? 참 : 거짓}
                                    {조건 && 참}
                                    {조건 || 거짓} */}
                                <Row>
                                    <Col aria-labelledby='approve-modal' closeButton className='text-end'>
                                        <Button type='button' variant="light"
                                            className='border-0 bg-transparent' onClick={closeModal}>
                                                <span aria-hidden="true">&times;</span>
                                        </Button>
                                    </Col>
                                </Row>

                                { apprData.length !==0 && 
                                <Row>
                                    <Col className='text-end'>
                                        {/* {apprData.receiversDtoList.map((receiver,index)=>(
                                            <span key={index} className='ms-2' style={{display:'inline'}}>
                                                {receiver.receiversReceiver}
                                            </span>
                                        ))} */}
                                        {approveReceiver.map((receiver)=>(
                                            <span key={receiver.empPositionNo} className='ms-2' style={{display:'inline'}}>
                                                {receiver.empName}
                                            </span>
                                        ))}
                                        <div></div>
                                        {apprData.receiversDtoList.map((receiver,index)=>(
                                            <span key={index} className='ms-2' style={{display:'inline'}}>
                                                {receiver.receiversStatus === 'Y' ? <FaCheck /> : ""}
                                            </span> 
                                        ))}
                                    </Col>
                                </Row>
                                }

                                <Row style={{border: '1px solid gray'}}>
                                    <Col xs={12} md={2} style={{border: '1px solid gray', backgroundColor:'skyblue'}}>
                                        부서
                                    </Col>
                                    <Col xs={6} md={4} style={{border: '1px solid gray'}}>
                                        {apprData.deptName}
                                    </Col>
                                    <Col xs={12} md={2} style={{border: '1px solid gray', backgroundColor:'skyblue' }}>
                                        직위
                                    </Col>
                                    <Col xs={6} md={4} style={{border: '1px solid gray'}}>
                                        {emp.empPositionNo}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={2}>
                                        사원번호
                                    </Col>
                                    <Col xs={6} md={4}>
                                        {emp.empId}
                                    </Col>
                                    <Col xs={12} md={2}>
                                        이름
                                    </Col>
                                    <Col xs={6} md={4}>
                                        {apprData.empName}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={6} md={2}>
                                        연락처
                                    </Col>
                                    {apprData.length !==0 &&
                                        <Col xs={6} md={10}>
                                            {apprData.empTel}
                                        </Col>
                                    }
                                </Row>

                                <Row>
                                    <Col xs={6} md={2}>
                                        기간
                                    </Col>
                                    {apprData.length !==0 &&
                                        <Col xs={6} md={10}>
                                            {apprData.approveDto.apprDateStart} ~ {apprData.approveDto.apprDateEnd}
                                        </Col>
                                    }
                                </Row>

                                <Row>
                                    <Col xs={6} md={2}>
                                        사유
                                    </Col>
                                    {apprData.length !==0 &&
                                        <Col xs={6} md={10}>
                                            {apprData.approveDto.apprContent}
                                        </Col>
                                    }    
                                </Row>

                                <Row>
                                    {apprData.length !==0 &&
                                        <Col className='text-end'>
                                            신청일　:　
                                            {apprData.approveDto.apprDateStart.substring(0,4)}년
                                            {apprData.approveDto.apprDateStart.substring(5,7)}월
                                            {apprData.approveDto.apprDateStart.substring(8,10)}일
                                        </Col>
                                    } 
                                </Row>

                                <Row>
                                    <Col className='text-end'>
                                        신청자: {apprData.empName}
                                    </Col>
                                </Row>

                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            {(()=> {
                                if(apprData.length !==0 ){
                                    if(apprData.status === "진행" && apprData.approveDto.apprSender === empNo){ //발신일때
                                        return (
                                            <Button variant="danger" onClick={e=>deleteAppr(apprData.approveDto.apprNo)}>
                                                삭제
                                            </Button>
                                        );
                                    }
                                    if(apprData.status !== "진행" && apprData.approveDto.apprSender === empNo){ //완료일때
                                        return null;
                                    }
                                    if(receiver.includes(empNo) && apprData.status === "진행"){ //수신일때
                                        return (
                                            <Container>
                                                <Row>
                                                    <Col xs={6} md={9}>
                                                        <Form>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="반려 시 사유를 입력하세요"
                                                                autoFocus name='receiversReturnRs' value={checkRecevier.receiversReturnRs}
                                                                onChange={e=>changeRecevier(e)}
                                                                />
                                                        </Form>
                                                    </Col>
                                                    <Col xs={6} md={3} className='text-end'>
                                                        {(()=>{
                                                            if(receiver.length === 1 && apprData.status ==="진행"){
                                                                return <Button variant="info" className='me-1'>승인</Button>
                                                            }
                                                            if(receiver.length > 1 && apprData.status === "진행"){
                                                                const myIndex = receiver.findIndex((r) => r === empNo);
                                                                if (myIndex !== -1) {
                                                                    const allApproved = ycount.every((count, index) => index >= myIndex || count > 0);
                                                                    if (allApproved) {
                                                                        return <Button variant="info" className='me-1'>승인</Button>;
                                                                    }
                                                                }
                                                            }
                                                            return null;
                                                        })()}
                                                        <Button variant='secondary'>반려</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        )
                                    }
                                    if(referer.includes(empNo)){ //참조일때
                                        return null;
                                    }
                                }
                            })()}
                        </Modal.Footer>
                    </Modal>


                </div>
            </div>
        </div>
    );
};

export default ApproveList;