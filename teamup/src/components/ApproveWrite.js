import { useEffect, useState } from "react";
import { receiverState, referrerState, userState } from '../recoil';
import { useRecoilState } from "recoil";
import axios from "axios";

const ApproveWrite = (props)=>{
    const [user, setUser] = useRecoilState(userState);
    const [receiver, setReceiver] = useRecoilState(receiverState);
    const [referrer, setReferrer] = useRecoilState(referrerState);

    //모든 사원 정보
    const [empList, setEmpList] = useState({
        deptNo :"",
        empNo: "",
        empPositionNo:""
    });

    // 결재 초기설정
    const [approve, setApprove] = useState({
        approveSender:user, // userState에 있는 값을 꺼내서 넘겨 
        approveTitle:"",
        approveContent:"",
        approveDivision:"",
    });

    // 승인자 초기설정
    const [approver, setApprover] = useState({
        approverReceiver : receiver
    });

    // 참조자 초기설정
    const [approveSee, setApproveSee] = userState({
        approveSeeReferrer : referrer
    });

    // 사원 정보 조회
    const loadEmp = async()=>{
        const response = await axios({
            url:"${process.env.REACT_APP_REST_API_URL}/emp/",
            method:"get"
        });
        setEmpList(response.data)
    };
    //처음 페이지에서만 사원 정보 불어오기
    useEffect(()=>{
        loadEmp();
    },[]);

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">

                    <h2 className="text-start">기안 상신</h2>

                    <div className="row">

                        <div className="border border-light col-8">
                            
                        </div>

                        <div className="border border-light col-4">
                            <span>결재자 지정</span>
                            <div className="border border-light">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col">
                                            {/* map 함수를 이용해 option 태그 반복 생성 */}
                                            {empList.map(emp => (
                                                <option key={emp.empNo} value={emp.empNo}>
                                                    {emp.deptNo}{emp.empNo}{emp.empPositionNo}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary">추가</button>
                                    </div>
                                </div>
                            </div>

                            <span className="my-2">참조자 지정</span>
                            <div className="border border-light">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col">

                                        </select>
                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary">추가</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </div>
    );
};

export default ApproveWrite;