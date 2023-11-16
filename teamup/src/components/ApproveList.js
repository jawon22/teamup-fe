import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Modal } from "bootstrap";
import { useRecoilState } from 'recoil';
import { userState } from '../recoil';
import { useEffect, useState } from 'react';

const ApproveList = (props)=>{
    const location = useLocation();
    const [user,setUser] = useRecoilState(userState);
    const [apprList,setApprList] = useState([]); //결재 계층형 데이터(처음에 오는 것)
    const [copyApprList, setCopyApprList] = useState([]);
    const [approveDto, setApproveDto] = useState([]); //결재 appr + apprPath번호 + 이름 + 전화번호 저장
    const [receiver, setReceiver] = useState([]); //승인자만 저장
    const [referer, setReferer] = useState([]);; //참조자만 저장

    const empNo = parseInt(user.substring(6)); //로그인한 사람의 사원번호

    // 계층형 데이터 나누기 ( appr + apprPathNo)
    const divideApproveDto = ()=>{
        setApproveDto(apprList.map((appr) => ({
            approveDto: appr.approveDto,
            apprPathNo: appr.apprPathNo,
            empName : appr.empName,
            empTel : appr.empTel
            }))
          );
        };
        
    // receivers
    const divideReceiversDto = ()=>{
        // 중첩된 map을 사용하여 데이터를 펼침
        const receiversList = apprList.flatMap((appr) =>
        appr.receiversDtoList.map((receiver) => receiver));
        setReceiver(receiversList);
    }
    
    // referers
    const divideReferersDto = ()=>{
        const referersList = apprList.flatMap((appr) =>
        appr.referrersDtoList.map((referer)=> referer));
        setReferer(referersList);
    }
    
    const loadAppr = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            setApprList(response.data);
            setCopyApprList(response.data);
        })
    };

    console.log(apprList);
    // console.log(approveDto);
    // console.log(receiver);
    // console.log(referer);
    
    // 수신버튼을 눌렀을때 (페이지 기본)
    // 로그인한 사람이 결재의 승인자로 지정 되어있는 기안만
    const susinButton = ()=>{
        const updateApprList = copyApprList.filter((appr)=> 
            appr.receiversDtoList.some((receiver)=> receiver.receiversReceiver === empNo));
        setApprList(updateApprList);
    };
    
    // 발신버튼을 눌렀을때
    // 로그인한 사람이 작성한 기안만 + 진행상태가 진행중
    const barsinButton = ()=>{
        const updateApprList = copyApprList.filter((appr) => 
        appr.approveDto.apprSender === empNo &&
        appr.status ==='진행');
        setApprList(updateApprList);
    }

    // 완료버튼을 눌렀을때
    // 로그인한 사람이 작성한 기안 + 진행상태가 반료or완료
    const checkButton = ()=>{
        const updateApprList = copyApprList.filter((appr) => 
            appr.approveDto.apprSender === empNo &&
            appr.status !== '진행');
        setApprList(updateApprList);
    }

    // 참조버튼을 눌렀을때
    // 로그인한 사람이 결재의 참조자로 지정 되어있는 기안만
    const chamjoButton = ()=>{
        const updateApprList = copyApprList.filter((appr)=> 
            appr.referrersDtoList.some((referer)=> referer.referrersReferrer === empNo));
        setApprList(updateApprList);
    };

    
    useEffect(()=>{
        loadAppr();
    },[]);

    // useEffect(()=>{
    //     divideApproveDto();
    //     divideReceiversDto();
    //     divideReferersDto();
    // },[apprList]);

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
                                    {/* {apprList[0].approveDto.apprNo} */}
                                    
                                    {apprList.map((appr,index)=>(
                                        <tr key={index}>
                                            <td className='text-start'>{appr.approveDto.apprTitle}</td>
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

                </div>
            </div>
        </div>
    );
};

export default ApproveList;