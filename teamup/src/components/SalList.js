import { useRecoilState } from 'recoil';
import React, { useEffect, useMemo, useState } from "react";
import { userState } from '../recoil';
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const SalList=(prop)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    
    const [salList, setSalList] = useState({
        salListNo: "",
        empNo: "",
        salListTotal: 0,
        salListHealth: 0,
        salListLtcare: 0,
        salListNational: 0,
        salListEmp: 0,
        salListWork: 0,
        salListLocal: 0,
        salListDate: `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    });

    useEffect(() => {
        salDetail();
    }, [empNo]);

    //화면 실행시 최신 급여내역을 출력 
    const salDetail = () => {
        axios({
            url: `http://localhost:8080/salList/salListDate/empNo/${empNo}`,
            method: "get"
        })
            .then(response => {
                if (!response.data) {
                    alert("급여내역이 없습니다.");
                } else {
                    setSalList(response.data);
                }
            })
            .catch(error => {
                console.error("급여 상세 정보를 가져오는 중 오류가 발생했습니다:", error);
            });
    };
    
    //이전 버튼 - 현재 급여내역 바로 전달의 내역을 출력
    const salListBefore = ()=>{
        // 현재 날짜를 가져와서 한 달을 빼기
        const currentDate = new Date(salList.salListDate);
        currentDate.setMonth(currentDate.getMonth() - 1);

        // 새로운 날짜를 문자열로 변환하여 함수 호출
        const newDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

        axios({
            url:`http://localhost:8080/salList/salListDate/empNo/${empNo}/salListDate/${newDate}`,
            method:"get"
        })
        .then(response=>{
            if (!response.data) {
                alert("급여내역이 없습니다.");
            } else {
                // console.log(response.data);
                setSalList(response.data);
            }
        })
        .catch(error => {
            console.error("급여 상세 정보를 가져오는 중 오류가 발생했습니다:", error);
        });
    };

    //다음 버튼 - 현재 급여내역 바로 다음 달의 내역을 출력
    const salListNext = ()=>{
        // 현재 날짜를 가져와서 한 달을 더하기
        const currentDate = new Date(salList.salListDate);
        currentDate.setMonth(currentDate.getMonth() + 1);

        // 새로운 날짜를 문자열로 변환하여 함수 호출
        const newDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

        axios({
            url:`http://localhost:8080/salList/salListDate/empNo/${empNo}/salListDate/${newDate}`,
            method:"get"
        })
        .then(response=>{
            if (!response.data) {
                alert("급여내역이 없습니다.");
            } else {
                // console.log(response.data);
                setSalList(response.data);
            }
        })
        .catch(error => {
            console.error("급여 상세 정보를 가져오는 중 오류가 발생했습니다:", error);
        });
    };

    //실지급액
    //- useMemo : 특정 값이 변할 때에만 계산하도록 처리
    const totalSal = useMemo(()=>{
        return parseFloat(salList.salListTotal || 0) - parseFloat(salList.salListHealth || 0)
        - parseFloat(salList.salListLocal || 0) - parseFloat(salList.salListLtcare || 0)
        - parseFloat(salList.salListNational || 0) - parseFloat(salList.salListWork || 0)
    }, [salList]);

    //총공제액
    const totalTax = useMemo(()=>{
        return parseFloat(salList.salListHealth || 0)
        + parseFloat(salList.salListLocal || 0) + parseFloat(salList.salListLtcare || 0)
        + parseFloat(salList.salListNational || 0) + parseFloat(salList.salListWork || 0)
    },[salList]);

    return(

            <div className="row">
                <div className="col-md-10 offset-md-1">

                    <div className='row'> 
                        <div className='col-4 mt-2 ms-2 ps-4'>
                            <div className='text-primary h2 d-flex'>
                                <span className=''onClick={salListBefore}><IoIosArrowBack /></span>
                                <span className='h3 mt-1'>{`${new Date(salList.salListDate).getFullYear()} . ${String(new Date(salList.salListDate).getMonth() + 1).padStart(2, '0')}`}</span>
                                <div><span onClick={salListNext}> <IoIosArrowForward /></span></div>
                            </div>
                        </div>
                    <div className='col-7'>
                        <h1 className='text-primary'>급여 명세서</h1>         
                    </div>
                    </div>

                    <hr className='border border-primary border-2'/>

                <div className='row ps-5 ms-2 mb-2 mt-4'>
                    <div className='col-2 h4'>
                        실수령액                        
                    </div>
                    <div className='col-7'>    
                    <hr className='text-primary'/>
                    </div>
                    <div className='col-3 h4'>
                    {totalSal.toLocaleString()}원원                     
                    </div>
                </div>



                    <div className="row ms-5">
                        <div className="col-5">
                            <div className='row mt-3 h5'>
                                <div className='col-5 offset-1 ms-3 text-start'>
                                <div className=''>총 지급액</div>
                                </div>
                                <div className='col-6 text-end'>
                                <div>{salList.salListTotal ? salList.salListTotal.toLocaleString() : 0}원</div>                       
                                </div>
                            </div>
                            <div>
                                <hr className='border border-primary border-2'/>
                            </div>
                        </div>
                        <div className='col-1'>
                        </div>
                        <div className='col-5'>
                        <div className='row mt-3 h5'>
                            <div className='col-5 offset-1 text-start'>
                                <div>총 공제액</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{totalTax.toLocaleString()}원</div>                                             
                            </div>
                            <div>
                                <hr className='border border-primary border-2'/>
                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-5 offset-1 text-start'>
                                <div>건강보험료</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{salList && salList.salListHealth ? salList.salListHealth.toLocaleString() : '0'}원</div>                                             
                            </div>
                            <div>
                                <hr className='text-primary'/>
                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-5 offset-1 text-start'>
                                <div>지방소득세</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{salList && salList.salListLocal ? salList.salListLocal.toLocaleString() : '0'}원</div>                                             
                            </div>
                            <div>
                                <hr className='text-primary'/>
                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-5 offset-1 text-start'>
                                <div>장기요양보험료</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{salList && salList.salListLtcare ? salList.salListLtcare.toLocaleString() : '0'}원</div>                                             
                            </div>
                            <div>
                                <hr className='text-primary'/>
                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-5 offset-1 text-start'>
                                <div>근로소득세</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{salList && salList.salListWork ? salList.salListWork.toLocaleString() : '0'}원</div>                                             
                            </div>
                            <div>
                                <hr className='text-primary'/>
                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-5 offset-1 text-start'>
                                <div>국민연금</div>
                            </div>
                            <div className='col-5 text-end'>
                                <div>{salList && salList.salListNational ? salList.salListNational.toLocaleString() : '0'}원</div>                                             
                            </div>
                            <div>
                                <hr className='text-primary'/>
                            </div>
                        </div>
                        
                        </div>
                    </div>

                </div>
            </div>

    );
};

export default SalList;