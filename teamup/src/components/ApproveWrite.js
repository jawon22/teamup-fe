import { useEffect, useState } from "react";
import { companyState, receiverState, referrerState, userState } from "../recoil";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsX } from "react-icons/bs";

const ApproveWrite = (props)=>{
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);

    const [receiverList, setReceiverList] = useState([]); //결재자 처음 복제 리스트
    const [refererList, setRefererList] = useState([]); // 참조자 처음 복제
    const [list, setList] = useState([]);

    const empNo = parseInt(user.substring(6)); // 202302032
    const navigate = useNavigate(); // 리다이렉트용

    // 현재 날짜를 가져오는 함수
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isEndDateValid = () => { //마감일이 작성일보다 이른지 확인하는 함수
        return !appr.apprDateEnd || appr.apprDateEnd >= appr.apprDateStart;
    };

    useEffect(()=>{
        const emp = list.find(em =>em.empNo === parseInt(empNo));
        setAppr({
            apprSender:empNo,
            deptNo: emp ? emp.deptNo:"",
            apprTitle:"",
            apprContent:"",
            apprDateStart: getCurrentDate(), // 오늘 날짜로 초기화
            apprDateEnd:"",
            apprDivision:"결재"
        })
    },[list])

    const [appr, setAppr] = useState({});

    const changeappr = (e) =>{
        setAppr({
            ...appr,
            [e.target.name] : e.target.value
        });
    };

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

    // 같은 회사로 조회
    const selectCom = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/emp/complexSearch/`,
            method:"post",
            data:{
            comId: company}
        })
        .then(response=>{
            setList(response.data);

            const removeMy = response.data.filter(receiver => receiver.empNo !== empNo && receiver.comId === company
                    && receiver.empExit === null);
            setReceiverList(removeMy);
            setRefererList(removeMy);
        })
    }
    useEffect(()=>{selectCom()},[])

    //기안 등록(최종)
    const saveAppr = async()=>{
        // 필수 값들이 존재하는지 확인
        if (
            !appr.apprTitle ||
            !appr.apprDivision ||
            !appr.apprDateStart ||
            !appr.apprDateEnd ||
            !isEndDateValid() ||
            savedValues.length === 0
        ) {
            // 필수 값이 없으면 알림 처리 또는 다른 작업 수행
            alert('참조자를 제외하고 모든 입력값을 작성해주세요.');
            return;
        }

        const dataAll = {
            approveDto:appr,
            receiversDtoList:savedValues.map(receiver => ({receiversReceiver : receiver.empNo})),
            referrersDtoList:savedValues2.map(referer => ({referrersReferrer : referer.empNo}))
        };

        try {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/approve/`,
            method: "post",
            data: dataAll,
        });
            // 등록 완료 알림 또는 다른 작업 수행
            alert('기안이 등록되었습니다.');
            navigate("/approveList"); // 혹은 다른 페이지로 이동
        } catch (error) {
            // 오류 발생 시 알림 처리 또는 다른 작업 수행
            alert('기안 등록 중 오류가 발생했습니다.');
        }
    };

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
    const removeReceiver = (empNo)=>{
        // 클릭한 승인자 리스트 찾은 후 담기
        const removeFilterList = savedValues.filter(receiver=>receiver.empNo === parseInt(empNo));
        
        // 클릭한 승인자를 savedValues에서 제거
        // 제거한 승인자 리스트를 다시 savedValues에 설정
        const reUpdateReceiver = savedValues.filter(receiver => receiver.empNo !== {...removeFilterList[0]}.empNo );
        setSavedValues(reUpdateReceiver);

        //클릭한 승인자를 receiverList와 refererList에 담아야함
        setReceiverList([...receiverList, {...removeFilterList[0]}]);
        setRefererList([...refererList, {...removeFilterList[0]}]);

    };

    // 선택된 참조자 삭제 (위에랑 같음)
    const removeReferer = (empNo)=>{
        const removeFilterList = savedValues2.filter(referer=>referer.empNo === parseInt(empNo));

        const reUpdateReferer = savedValues2.filter(referer => referer.empNo !== {...removeFilterList[0]}.empNo);
        setSavedValues2(reUpdateReferer);

        setReceiverList([...receiverList,{...removeFilterList[0]}]);
        setRefererList([...refererList,{...removeFilterList[0]}]);
    }

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10 offset-md-1">

                    <h2 className="text-start">기안 상신</h2>

                    <div className="row">

                        <div className="col-8">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th scope="row">제목</th>
                                    <td>
                                        <input type="text" className="form-control" name="apprTitle"
                                            value={appr.apprTitle} onChange={changeappr}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">종류</th>
                                    <td>
                                        <select className="form-select" name="apprDivision"
                                            value={appr.apprDivision} onChange={changeappr}>
                                            <option value="결재">결재</option>
                                            <option value="연차">연차</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">작성일</th>
                                    <td>
                                        <input type="date" className="form-control" name="apprDateStart"
                                            value={appr.apprDateStart} onChange={changeappr} readOnly/>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">마감일</th>
                                    <td>
                                        <input type="date" className="form-control" name="apprDateEnd"
                                            value={appr.apprDateEnd} onChange={changeappr}/>
                                            {!isEndDateValid() &&(
                                                <div style={{color:'red'}}>마감일은 작성일 이후로 설정해주세요</div>
                                            )}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">내용</th>
                                    <td>
                                        <textarea type="text" className="form-control" name="apprContent"
                                            rows={10} value={appr.apprContent} onChange={changeappr} style={{ resize: "none" }}/>
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>

                        <div className=" col-4">
                            <span>결재자 지정</span>
                            <div className="">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col" onChange={selectedReceiver}>
                                            <option value="">선택하세요</option>
                                        {/* map 함수를 이용해 option 태그 반복 생성 */}
                                            {receiverList.map(emp => (
                                                <option key={emp.empNo} value={emp.empNo}>
                                                    {/* 부서:{emp.deptName}  */}
                                                    {emp.empPositionName} -
                                                    {emp.empName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary w-100" onClick={saveReceiver}>
                                            저장
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-1 mb-3"> 
                                {/* 저장을 누르면 추가되는 영역 */}
                                    {savedValues.map((receiver,index)=>(
                                        <div key={receiver.empNo}>
                                            <span class="rounded-start approve-dept">{receiver.deptName}</span>
                                            <span class="rounded-end approve-position">{receiver.empPositionName}</span>
                                            　
                                            <span style={{fontSize:"14px", fontWeight:"bold"}}>{receiver.empName}</span>
                                            <BsX onClick={()=>removeReceiver(receiver.empNo)}/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className="my-2">참조자 지정</span>
                            <div className="">
                                <div className="row">
                                    <div className="col-8">
                                        <select className="form-select col" onChange={selectedReferer}>
                                        <option value="">선택하세요</option>
                                        {/* map 함수를 이용해 option 태그 반복 생성 */}
                                            {refererList.map(emp => (
                                                <option key={emp.empNo} value={emp.empNo}>
                                                    {emp.empPositionName} -
                                                    {emp.empName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-4">
                                        <button className="btn btn-primary w-100" onClick={saveReferer}>
                                            저장
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    {/* 저장을 누르면 추가되는 영역 */}
                                    {savedValues2.map((referer,index)=>(
                                        <div key={referer.empNo}>
                                            <span class="rounded-start approve-dept">{referer.deptName}</span>
                                            <span class="rounded-end approve-position">{referer.empPositionName}</span>
                                            　
                                            <span style={{fontSize:"14px", fontWeight:"bold"}}>{referer.empName}</span>
                                            <BsX onClick={()=>removeReferer(referer.empNo)}/>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="col text-end">
                            <button className="btn btn-primary" onClick={saveAppr} 
                                disabled={!isEndDateValid()}>
                                기안등록
                            </button>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWrite;