import { useLocation } from 'react-router-dom'
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Pagination } from "react-bootstrap";
import { FaRegCheckSquare } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { FiXSquare } from "react-icons/fi";
import { TfiPencil } from "react-icons/tfi";

import { useRecoilState } from 'recoil';
import { companyState, userState } from '../recoil';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { copy } from 'stylis';
import moment from 'moment';

const ApproveList = (props)=>{
    const location = useLocation();
    const [user,setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);

    const [apprList,setApprList] = useState([]); //결재 계층형 데이터(처음에 오는 것)
    const [apprData, setApprData] = useState([]); // 클릭한 결재 정보
    const [receiver, setReceiver] = useState([]); //승인자만 저장
    const [receiverInfo, setReceiverInfo] = useState([]); //승인자의 정보
    const [approveReceiver, setApproveReceiver] = useState([]); //승인자의 사원정보
    const [receiverPosition, setReceiverPosition] = useState([]); //자신을 제외한 사원정보
    const [checkInfo, setCheckInfo] = useState([]);

    // const [pageSize, setPageSize] = useState(10); // 페이지당 항목 수
    // const [totalPages, setTotalPages] = useState(1); // 첫 페이지 설정
    const [positionOrder, setPositionOrder] = useState([]); // 해당 회사의 직급 설정
    const [position, setPosition] = useState([]); 

    const [referer, setReferer] = useState([]); //참조자만 저장
    const [empList, setEmpList] = useState([]); // 회원에 대한 모든 정보 
    const [emp, setEmp] = useState([]); //결재 하나의 회원정보
    const [ycount, setYCount] = useState([]);// Y카운트 갯수

    const empNo = parseInt(user.substring(6)); //로그인한 사람의 사원번호

    // 페이지네이션 함수
    // const pageCount = () =>{
    //     setTotalPages(Math.ceil(apprList.length/pageSize));
    // }

    // 로그인한 사원의 회사 직급 가져오기
    const getPosition = async() =>{

        const response = await axios({
            url:`${process.env.REACT_APP_REST_API_URL}/empPosition/position/${company}`,
            method:"get"
        });
        setPosition(response.data);
        const positions = response.data.map(item => item.empPositionName);
        setPositionOrder(positions);
    }

    useEffect(()=>{
        getPosition();
    },[company])

    // receivers
    const divideReceiversDto = ()=>{
        const receiversList = apprData.receiversDtoList ? apprData.receiversDtoList.map(receiver => receiver.receiversReceiver) : [];
        setReceiver(receiversList);
    }

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
        
        const myInfo = combinedArray.find(userInfo => userInfo.empInfo.empNo === empNo); //자신의 정보
        if(myInfo){
            const myApprInfo = apprData.receiversDtoList.find(receiver => receiver.receiversReceiver === empNo);
            SetMyApprInfo(myApprInfo);

            const higherPosition = combinedArray.filter(userInfo => 
                Number(userInfo.empInfo.empPositionNo) > Number(myInfo.empInfo.empPositionNo))
            setReceiverPosition(higherPosition);

            const ycount = higherPosition.filter(i => i.receiversStatus ==="Y");
            setYCount(ycount)
        }

        const selectInfo = combinedArray.find(list=> list.empInfo.empNo ===empNo)
        setCheckInfo(selectInfo);
    }
    
    const isAllApproved = ()=>{
        return receiverPosition.length === ycount.length;
    }


    useEffect(()=>{
        findReceiverInfo();
    },[receiver])
    
    // referers
    const divideReferersDto = ()=>{
        const referersList = apprData.referrersDtoList ? apprData.referrersDtoList.map(referer => referer.referrersReferrer) : [];
        setReferer(referersList);
    }
    
    
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
    },[props.user]);
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
            url:`${process.env.REACT_APP_REST_API_URL}/emp/complexSearch/`,
            method:"post",
            data:{
            comId: company}
        })
        .then(response =>{
            setEmpList(response.data);
        })
    };
    
    const [myApprInfo, SetMyApprInfo] = useState([]);

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
        pathNo:0,
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

    const clearApprReceiver= ()=>{
        setCheckReceiver({
            receiversNo :0,
            pathNo:0,
            receiversReceiver:0,
            receiversStatus:"",
            receiversConfirmTime:"",
            receiversReturnRs:""
        })
    }

    //승인자 결재 승인 처리
    const checkAppr = ()=>{
        const { receiversReturnRs } = checkRecevier;

        const copyReceiver = {...myApprInfo,receiversReturnRs};
        delete copyReceiver.pathNo;
        delete copyReceiver.receiversReceiver;

        // receiversConfirmTime이 null이면 현재 날짜로 설정
    if (copyReceiver.receiversConfirmTime === null) {
        copyReceiver.receiversConfirmTime = moment(new Date()).format('YYYY-MM-DD');
    }
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/${myApprInfo.pathNo}/${myApprInfo.receiversReceiver}`,
            method:"put",
            data:copyReceiver
        })
        .then(response=>{
            susinButton();
            closeModal();

        })
    };
    
    //승인자 결재 반려 처리
    const cancelAppr = () =>{
        const { receiversReturnRs } = checkRecevier;

        const copyReceiver = {...myApprInfo,receiversReturnRs};
        delete copyReceiver.pathNo;
        delete copyReceiver.receiversReceiver;

        // receiversConfirmTime이 null이면 현재 날짜로 설정
    if (copyReceiver.receiversConfirmTime === null) {
        copyReceiver.receiversConfirmTime = moment(new Date()).format('YYYY-MM-DD');
    }
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/pathNo/${myApprInfo.pathNo}/receiver/${myApprInfo.receiversReceiver}`,
            method:"put",
            data:copyReceiver
        })
        .then(response=>{
            susinButton();
            closeModal();
        })
    };
    

    //모달 관련 처리
    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => {
        clearApprReceiver();
        setShow(false)
    };

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10 offset-md-1">
                    <div className="text-end my-3" >
                        <Link to="/approveWrite">
                            <button className="btn btn-primary">기안 상신 작성<TfiPencil /></button>
                        </Link>
                    </div>

                    <div className="mb-3">
                        <h2>전자결재</h2>
                    </div>


                    <div className="btn-group text-start" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1"/>
                        <label className="btn btn-outline-primary rounded-start" for="btnradio1" onClick={susinButton}>수신</label>
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
                                <thead className='table-primary'>
                                    <tr>
                                        <th width="35%">제목</th> 
                                        <th width="15%">발신인</th> 
                                        <th width="20%">상신일</th> 
                                        <th width="20%">마감일</th> 
                                        <th>상태</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {apprList.map((appr,index)=>(
                                        <tr key={index} onClick={e=>approveOneClick(appr)} style={{cursor: "pointer"}}>
                                            <td className='text-start'>
                                                {appr.approveDto.apprTitle}
                                            </td>
                                            <td>{appr.empName}</td>
                                            <td>{appr.approveDto.apprDateStart}</td>
                                            <td>{appr.approveDto.apprDateEnd}</td>
                                            <td style={{color: appr.status === "승인" ? "green" 
                                                : appr.status === "반려" ? "red" : "inherit"}}>
                                                    {appr.status}
                                            </td>
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

                        <Modal.Header closeButton className='me-3'>
                            <Modal.Title id="contained-modal-title-vcenter" className='ms-6 mt-3'>
                                {apprData.empName}님의 결재신청서
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body border="dark">
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col xs={10} md={10}>
                                        {/* {조건 ? 참 : 거짓}
                                            {조건 && 참}
                                            {조건 || 거짓} */}

                                        { apprData.length !==0 && 
                                        <Row className='border border-success rounded mt-3'>
                                            <Col className='text-end my-1'>
                                                {/* {apprData.receiversDtoList.map((receiver,index)=>(
                                                    <span key={index} className='ms-2' style={{display:'inline'}}>
                                                        {receiver.receiversReceiver}
                                                    </span>
                                                ))} */}
                                                {approveReceiver.map((receiver)=>(
                                                    <span key={receiver.empPositionNo} className='me-3' style={{display:'inline'}}>
                                                        {receiver.empName}
                                                    </span>
                                                ))}
                                                <div></div>
                                                
                                                {apprData.receiversDtoList.map((receiver,index)=>(
                                                    <span key={index} className='mx-4' style={{display:'inline'}}>
                                                        {receiver.receiversStatus === 'Y' ? <FaRegCheckSquare /> : 
                                                            (receiver.receiversStatus === 'N' ? <FiXSquare /> : <FaRegSquare />)}
                                                    </span> 
                                                ))}
                                            </Col>
                                        </Row>
                                        }

                                        <Row className='border border-success mt-3 rounded-top'>
                                            <Col xs={2} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                부서
                                            </Col>
                                            <Col xs={4} md={4} className='py-2'>
                                                {apprData.deptName}
                                            </Col>
                                            <Col xs={2} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                직위
                                            </Col>
                                            <Col xs={4} md={4} className='py-2'>
                                                {emp.empPositionName}
                                            </Col>
                                        </Row>

                                        <Row className='border border-top-0 border-success'>
                                            <Col xs={12} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                사원번호
                                            </Col>
                                            <Col xs={12} md={4} className='py-2'>
                                                {emp.empId}
                                            </Col>
                                            <Col xs={12} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                이름
                                            </Col>
                                            <Col xs={12} md={4} className='py-2'>
                                                {apprData.empName}
                                            </Col>
                                        </Row>

                                        <Row className='border border-top-0 border-success'>
                                            <Col xs={12} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                연락처
                                            </Col>
                                            {apprData.length !==0 &&
                                                <Col xs={12} md={10} className='py-2'>
                                                    {apprData.empTel}
                                                </Col>
                                            }
                                        </Row>

                                        <Row className='border border-top-0 border-success'>
                                            <Col xs={12} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                기간
                                            </Col>
                                            {apprData.length !==0 &&
                                                <Col xs={12} md={10} className='py-2'>
                                                    {apprData.approveDto.apprDateStart} ~ {apprData.approveDto.apprDateEnd}
                                                </Col>
                                            }
                                        </Row>

                                        <Row className='border border-top-0 border-success rounded-bottom'>
                                            <Col xs={12} md={2} className='border-bg-color text-center py-2 text-bold text-green'>
                                                사유
                                            </Col>
                                            {apprData.length !==0 &&
                                                <Col xs={12} md={10} className='py-2'>
                                                    {apprData.approveDto.apprContent}
                                                </Col>
                                            }    
                                        </Row>

                                        <Row>
                                            {apprData.length !==0 &&
                                                <Col className='text-end mt-4'>
                                                    신청일　:　
                                                    {apprData.approveDto.apprDateStart.substring(0,4)}년
                                                    {apprData.approveDto.apprDateStart.substring(5,7)}월
                                                    {apprData.approveDto.apprDateStart.substring(8,10)}일
                                                </Col>
                                            } 
                                        </Row>

                                        <Row>
                                            <Col className='text-end mt-2'>
                                                신청자 : {apprData.empName}
                                            </Col>
                                        </Row>

                                        <div>
                                            {!isAllApproved() &&(
                                                <div style={{color:'red'}}>앞 승인자의 승인이 이루어지지 않았습니다.</div>
                                            )}
                                        </div>
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
                                                <Row className="justify-content-md-center">
                                                    <Col xs={10} md={10}>
                                                        <Row>
                                                            <Col xs={6} md={9}>
                                                                <Form>
                                                                    {(()=>{
                                                                        if(receiver.length === 1 ){
                                                                            return(
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    placeholder="반려 시 사유를 입력하세요"
                                                                                    autoFocus name='receiversReturnRs' value={checkRecevier.receiversReturnRs}
                                                                                    onChange={e=>changeRecevier(e)} className='mt-2 mb-4'
                                                                                    />
                                                                            );
                                                                        }
                                                                        if (receiver.length > 1){
                                                                            const isApproved = receiverPosition.length === ycount.length;

                                                                            if (isApproved && checkInfo !== undefined) {
                                                                                return(
                                                                                    <Form.Control
                                                                                    type="text"
                                                                                    placeholder="반려 시 사유를 입력하세요"
                                                                                    autoFocus name='receiversReturnRs' value={checkRecevier.receiversReturnRs}
                                                                                    onChange={e=>changeRecevier(e)} className='mt-2 mb-4'
                                                                                    />
                                                                                );
                                                                            }
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </Form>
                                                            </Col>
                                                            <Col xs={6} md={3} className='text-end'>
                                                                {(()=>{
                                                                    if(receiver.length === 1 && apprData.status ==="진행"){
                                                                        return (
                                                                            <div>
                                                                                <Button variant="primary" className='me-1'
                                                                                    onClick={checkAppr}>승인</Button>
                                                                                <Button variant='secondary' onClick={cancelAppr}>반려</Button>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    if (receiver.length > 1 && apprData.status === "진행") {
                                                                        const isApproved = receiverPosition.length === ycount.length;
                                                                        
                                                                        if (isApproved && checkInfo !== undefined) {
                                                                            return (
                                                                                <div>
                                                                                    <Button 
                                                                                        variant="primary"
                                                                                        className={`me-1 ${checkInfo.receiversStatus !== "R" ? 'disabled' : ''} mt-2 mb-4`}
                                                                                        onClick={checkAppr}
                                                                                    >
                                                                                        승인
                                                                                    </Button>
                                                                                    <Button 
                                                                                        variant="secondary" 
                                                                                        className={`me-1 ${checkInfo.receiversStatus !== "R" ? 'disabled' : ''} mt-2 mb-4`}
                                                                                        onClick={cancelAppr}
                                                                                    >
                                                                                        반려
                                                                                    </Button>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </Col>
                                                        </Row>
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


// if(receiver.length > 1 && apprData.status === "진행"){
//     const myIndex = receiver.findIndex((r) => r === empNo);
//     if (myIndex !== -1) {
//         const allApproved = ycount.every((count, index) => index >= myIndex || count > 0);
//         if (allApproved && checkInfo !== undefined) {
//             return (
//                 <div>
//                     <Button variant="primary"
//                         className={`me-1 ${checkInfo.receiversStatus !=="R" ? 'disabled': ''} mt-2 mb-4`}
//                         onClick={checkAppr}>승인</Button>
//                     <Button variant='secondary' 
//                         className={`me-1 ${checkInfo.receiversStatus !=="R" ? 'disabled': ''} mt-2 mb-4`}
//                         onClick={cancelAppr}>반려</Button>
//                 </div>
//             );
//         }
//     }
// }