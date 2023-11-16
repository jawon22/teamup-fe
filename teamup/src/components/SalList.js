import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from "react";
import { userState } from '../recoil';
import axios from "axios";
import { useLocation } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const SalList=(prop)=>{
    const [user, setUser] = useRecoilState(userState);
    const location = useLocation();
    const empNo = user.substring(6)

    const [salList, setSalList] = useState({
        salListNo:"",
        empNo:"",
        salListTotal:"",
        salListHealth:"",
        salListLtcare:"",
        salListNational:"",
        salListEmp:"",
        salListWork:"",
        salListLocal:"",
        salListDate:""
    });

    const salDetail =()=>{
        //서버에서 급여내역 list 불러와서 state에 설정하는 코드 
        axios({
            url:`http://localhost:8080/salList/salListDate/empNo/${empNo}`,
            method:"get"
        })
        .then(response=>{
            console.log(response.data);
            setSalList(response.data);
        })
        .catch(err=>{ window.alert("통신 오류 발생"); });   
    };

    useEffect(()=>{
        salDetail();
    },[]);

    const totalSal = parseFloat(salList.salListTotal) - parseFloat(salList.salListHealth)
        - parseFloat(salList.salListLocal) - parseFloat(salList.salListLtcare)
        - parseFloat(salList.salListNational) - parseFloat(salList.salListWork);

    const totalTax = parseFloat(salList.salListHealth)
    + parseFloat(salList.salListLocal) + parseFloat(salList.salListLtcare)
    + parseFloat(salList.salListNational) + parseFloat(salList.salListWork);

    console.log("salList:", salList);




    return(

            <div className="row">
                <div className="col-md-10 offset-md-1">

                    <div className='row'> 
                        <div className='col-4 mt-2 ms-2 ps-4'>
                            <div className='text-primary h2'>

                                <span><IoIosArrowBack /></span>
                                {salList.salListDate}
                                <span> <IoIosArrowForward /></span>

                                </div>
                        </div>
                    <div className='col-7'>
                        <h1 className='text-primary'>급여 명세서</h1>         
                    </div>
                    </div>

                    <hr className='border border-primary border-2'/>

                <div className='row ms-2 ps-5'>
                    <div className='col-2'>
                        실수령액                        
                    </div>
                    <div className='col-7'>    
                    <hr className='text-primary'/>
                    </div>
                    <div className='col-3'>
                    {totalSal.toLocaleString()}원                      
                    </div>
                </div>



                    <div className="row ms-5">
                        <div className="col-5">
                            <div className='row mt-3'>
                                <div className='col-5 offset-1 text-start'>
                                <div>총 지급액</div>
                                </div>
                                <div className='col-5 text-end'>
                                <div>{salList.salListTotal.toLocaleString()}원</div>                       
                                </div>
                            </div>
                            <div>
                                <hr className='border border-primary border-2'/>
                            </div>
                        </div>
                        <div className='col-1'>
                        </div>
                        <div className='col-5'>
                        <div className='row mt-3'>
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
                                <div>{salList.salListHealth.toLocaleString()}원</div>                                             
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
                                <div>{salList.salListLocal.toLocaleString()}원</div>                                             
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
                                <div>{salList.salListLtcare.toLocaleString()}원</div>                                             
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
                                <div>{salList.salListWork.toLocaleString()}원</div>                                             
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
                                <div>{salList.salListNational.toLocaleString()}원</div>                                             
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