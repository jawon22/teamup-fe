import { useEffect, useState } from "react";
import { receiverState, referrerState, userState } from "../recoil";
import { useRecoilState } from "recoil";
import axios from "axios";
import { BsX } from "react-icons/bs";

const ApproveWrite = (props)=>{
    // const [user, setUser] = useRecoilState(userState);
    // const [receiver, setReceiver] = useRecoilState(receiverState);
    // const [referrer, setReferrer] = useRecoilState(referrerState);

    const [empList, setEmpList] = useState([]); //모든 사원 정보
    const [receiverList, setReceiverList] = useState([]); //결재자 처음 복제 리스트
    const [refererList, setRefererList] = useState([]); // 참조자 처음 복제

    // // 결재 초기설정
    // const [approve, setApprove] = useState({
    //     approveSender:user, // userState에 있는 값을 꺼내서 넘겨 
    //     approveTitle:"",
    //     approveContent:"",
    //     approveDivision:"",
    // });

    // // 승인자 초기설정
    // const [approver, setApprover] = useState({
    //     approverReceiver : receiver
    // });

    // // 참조자 초기설정
    // const [approveSee, setApproveSee] = userState({
    //     approveSeeReferrer : referrer
    // });

    // 사원 정보 조회
    const loadEmp = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/emp/`,
            method:"get"
        })
        .then(response=>{
            setEmpList(response.data);
            setReceiverList(response.data);
            setRefererList(response.data);
        })
    };

    //처음 페이지에서만 사원 정보 불어오기
    useEffect(()=>{
        loadEmp()
    },[]);

    const [selectedValue, setSelectedValue] = useState(null); //승인자 값 저장
    const [savedValues, setSavedValues] = useState([]); //승인자 전체 저장

    const [selectedRefererValue, setSelectedRefererValue] = useState(null); //참조자 값 저장
    const [savedValues2, setSavedValues2] = useState([]); //참조자 전체 저장

    //승인자 선택 후 객체로 저장
    const selectedReceiver = (e)=>{
        const filterList = receiverList.filter(receiver=>receiver.empNo === parseInt(e.target.value));
        setSelectedValue({...filterList[0]});
    };
    const saveReceiver = ()=>{
        if(selectedValue !== null){
            setSavedValues([...savedValues, {...selectedValue}]);
            
        //     // receiverList에서 선택한 값을 제거
            // const updateReceiverList = receiverList.filter(emp => {
            //     // console.log(emp.empNo, selectedValue, emp.empNo === selectedValue);
            //     return emp.empNo !== selectedValue.empNo;
            // });
            const updateReceiverList = receiverList.filter(emp => emp.empNo !== selectedValue.empNo);

            setRefererList(updateReceiverList);
            setReceiverList(updateReceiverList);
            setSelectedValue(null); 
        }
    };

    //참조자 선택후 저장
    const selectedReferer = (e)=>{
        const filterList = refererList.filter(referer=>referer.empNo === parseInt(e.target.value));
        setSelectedRefererValue({...filterList[0]});
    };
    const saveReferer = ()=>{
        if(selectedRefererValue !== null){
            setSavedValues2([...savedValues2, {...selectedRefererValue}]);
            
            // refererList에서 선택한 값을 제거
            const updateRefererList = refererList.filter(emp => emp.empNo !== selectedRefererValue.empNo);
            
            setReceiverList(updateRefererList);
            setRefererList(updateRefererList);
            setSelectedRefererValue(null);
        }
    };

    // 선택된 승인자 삭제
    const removeReceiver = (e)=>{
        const removeFilterList = savedValues2.filter(receiver=>receiver.empNo === parseInt(e.target.value));
        
        
    };
    // 선택된 참조자 삭제
    const removeReferer = (e)=>{

    }


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
                                        <select className="form-select col" onChange={selectedReceiver}>
                                            <option value="">선택하세요</option>
                                        {/* map 함수를 이용해 option 태그 반복 생성 */}
                                            {receiverList.map(emp => (
                                                <option key={emp.empNo} value={emp.empNo}>
                                                    부서:{emp.deptNo} 사원번호:{emp.empNo} 직급:{emp.empPositionNo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary" onClick={saveReceiver}>
                                            저장
                                        </button>
                                    </div>
                                </div>
                                <div> 
                                {/* 저장을 누르면 추가되는 영역 */}
                                    {savedValues.map((receiver,index)=>(
                                        <div key={receiver.empNo}>
                                            {receiver.empNo} 
                                            <BsX onClick={removeReceiver}/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className="my-2">참조자 지정</span>
                            <div className="border border-light">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col" onChange={selectedReferer}>
                                        <option value="">선택하세요</option>
                                        {/* map 함수를 이용해 option 태그 반복 생성 */}
                                            {refererList.map(emp => (
                                                <option key={emp.empNo} value={emp.empNo}>
                                                    부서:{emp.deptNo} 사원번호:{emp.empNo} 직급:{emp.empPositionNo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary" onClick={saveReferer}>
                                            저장
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {/* 저장을 누르면 추가되는 영역 */}
                                    {savedValues2.map((referer,index)=>(
                                        <div key={referer.empNo}>
                                            {referer.empNo}
                                            <BsX onClick={removeReferer}/>
                                        </div>
                                    ))}
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