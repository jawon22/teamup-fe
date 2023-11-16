import axios from "axios";
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" // import할것!
import './cal.css';
import { Modal } from "bootstrap";
const Calendar = () => {

  // const eventClick = (e) => {
  //   const clickedEvent = e.event;
  //   const clickedEventId = clickedEvent.id;


  //   // 이제 필요한 정보들을 사용하거나 상태로 관리할 수 있습니다.
  //   console.log('클릭한 이벤트 ID:', clickedEvent.id);
  //   console.log('클릭한 이벤트 title:', clickedEvent.title);
  //   console.log('클릭한 이벤트 ID:', clickedEvent.content);

  //   setSchedule({
  //     calNo:clickedEventId,
  //     calStartDate:clickedEvent.start,
  //     calEndDate:clickedEvent.end,
  //     calTitle:clickedEvent.title,
  //     calContent:clickedEvent.content,
  //     calColor:clickedEvent.color
  //   });

  //   console.log(schedule)

  //   openModal();
  // };

  const eventClick = (e) => {
    setIsEventClicked(true);

    const clickedEvent = e.event;
    const clickedEventId = clickedEvent.id;
    console.log(isEventClicked);

  
    // 이벤트의 정보를 setSchedule 함수로 저장
    setSchedule({
      calNo: clickedEventId,
      calStartDate: clickedEvent.start,
      calEndDate: clickedEvent.end,
      calTitle: clickedEvent.title,
      calContent: clickedEvent.title, // 예시로 title을 사용했습니다. 실제로 사용하는 데이터에 따라 수정하세요.
      calColor: clickedEvent.color
    });
  
    // setSchedule이 비동기적으로 동작하므로 업데이트된 schedule을 확인하기 위해 로그를 찍어보세요.
    
    // 모달을 열기 전에 schedule을 확인해보세요.
    openModal();
    console.log('Updated Schedule:', schedule);
  };


  const calendarRef = useRef(null);
  const [scheduleList, setScheduleList] = useState([]);



  const [schedule, setSchedule] = useState({
   calNo:"",
    empNo:"11",
    calStartDate:"",
    calEndDate:"",
    calTitle:"",
    calContent:"",
    calColor:"",
  });

  const clearSchedule = () =>{
    setSchedule({
      empNo:"11",
      calStartDate:"",
      calEndDate:"",
      calTitle:"",
      calContent:"",
      calColor:""
    })

  };

  const changeSchedule =(e)=>{
    setSchedule({
      ...schedule,
      [e.target.name]:e.target.value
        });
  };

  const addSchedule =()=>{
      axios({
        url:"http://localhost:8080/cal_emp/",
        method:"post",
        data:schedule

      }).then(response=>{
        loadSchedule();
        closeModal();
      }
      )

  };
  const editSchedule = () => {
    axios({
      url: `http://localhost:8080/cal_emp/updateCal/${schedule.calNo}`,
      method: "post",
      data: schedule
    })
      .then(response => {
        console.log(response);
        console.log(schedule.calNo);
      })
      .catch(error => {
        console.error("Edit Schedule Error:",schedule.calNo );
      });
  };
  
  
  
  

 


  









  // [{"calNo":16,"
  // empNo":11,"
  // calStartDate":"2023-11-10",
  // "calEndDate":null,"
  // calTitle":"테스트타이틀",
  // "calContent":"테스트 컨텐츠",
  // "calStatus":"N",
  // "calColor":"red"}]



  // 일정 불러오기
  const loadSchedule = () => {
    axios({
      url: "http://localhost:8080/cal_emp/list/11",
      method: "get"
    }).then(response => {
      console.log(response);
      setScheduleList(response.data);
    }).catch(error => {
      console.error("Error loading schedules", error);
    });
  };

  useEffect(() => {
    loadSchedule();
   
    
  }, []);

  const select = (selectInfo) => {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    openModal();
    //모달열고 start end-1 로 추가 
    console.log('선택한 날짜 범위: ', start, '에서', end);
    console.log('id: ', eventClick.clickedEventId);

    setSchedule({...schedule,
      calStartDate:start,
      calEndDate:end}

      )
  }


  const [id, setId] = useState('');



  //일정 클릭하면 ~상세 모달로 띄우기
//   const eventClick = (e) => {
//     const detail = e.event;
//     setSchedule({...e});
//     setId(detail.id);
    
    
//     openModal();
//     console.log('id: ', id);
//     console.log('클릭한 번호:', detail.id);
//     console.log('클릭한 이벤트 제목:', detail.title);
// }


  

  const plugin = [
    dayGridPlugin, // 월간 달력 // day 그리드
    interactionPlugin
    /* 이벤트를 위한 플러그인
    일정 추가/수정 : 캘린더에 새 이벤트를 추가하거나 기존 이벤트를 수정 
      : 이벤트를 클릭하면 이벤트 정보를 수정하는 팝업이나 모달 띄움
    드래그 앤 드롭 : 마우스로 드래그하여 다른 날짜나 시간으로 이동
    리사이징 : 기간을 변경하여 이벤트의 기간을 늘이거나 줄임
    일정 클릭 이벤트
    */
  ];

  const bsModal = useRef();

  const openModal = () => {
    var modal = new Modal(bsModal.current);
    modal.show();
  };

  const closeModal = () => {
    var modal =  Modal.getInstance(bsModal.current);
    clearSchedule();
    setId(null);
    modal.hide();
    setIsEventClicked(false);

  };

  const [isEventClicked, setIsEventClicked] = useState(false);



  //수정 버튼을 누르면 ! 그냥 상세보기 창에서 인풋 창으로 변경 할 수 있도록 만들어야 하는데
//click하기 전에는 sapn으로 보여주고 click 하면 수정 input 창이랑 버튼이 hidden 에서 보이도록 만든다



  



  return (
    <>
      <FullCalendar
        // height={} // 높이 지정
        plugins={plugin}
        initialView="dayGridMonth" // 초기뷰 dayGridMonth or timeGridWeek
        headerToolbar={{ // 띄어쓰면 갭이 생기고, 콤마가 있으면 그룹으로 묶는 형태
          left: "today prev,next",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay"
        }}


        footerToolbar={{

          //  right: "dayGridMonth,dayGridWeek,dayGridDay"
        }}


        buttonText={{
          // prev: "이전", // 부트스트랩 아이콘으로 변경 가능
          // next: "다음",
          // prevYear: "이전 년도",
          // nextYear: "다음 년도",
          today: "오늘",
          month: "월별",
          week: "주별",
          day: "일별",
          list: "리스트"
        }}
        /* 버튼 텍스트 default {{
            prev: "<",
            next: ">",
            prevYear: "<<",
            nextYear: ">>",
            today: "today",
            month: "month",
            week: "week",
            day: "day",
          }} */
        // event = 일정
        eventClick={eventClick} // 이벤트 클릭시
        editable={true} // 사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
        selectable={true} // 사용자의 날짜 선택 여부
        selectMirror={true} // 사용자의 시간 선택시 time 표시 여부
        select={select} // 날짜가 선택 될 때
        weekends={true} // 주말 표시 여부
        dayMaxEvents={true} // 하루에 표시 될 최대 이벤트 수 true = 셀의 높이
        navLinks={true} // 달력의 날짜 클릭시 일간 스케쥴로 이동
        navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구
        // eventContent={fn(): node {} || true} // 일정 커스텀
        eventTextColor="#3B3131"
        events={scheduleList.map(schedule => ({

          id:schedule.calNo,
          //empNo:schedule.empNo,
          title:schedule.calTitle,
          start: schedule.calStartDate,
          end: schedule.calEndDate,
          color:schedule.calColor,
          content:schedule.calContent

         
        }))} // empNo:"11",
          // calStartDate:"",
          // calEndDate:"",
          // calTitle:"",
          // calContent:"",
          // calColor:""

      />

      <div>

        <div className="modal fade" ref={bsModal}  keyboard={false}  backdrop="static" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{ isEventClicked ? '상세' : '등록'}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row mt-4">
                    <div className="col">
                      Title <input type="text" name="calTitle" onChange={changeSchedule} className="form-control" value={schedule.calTitle} />
                    </div>
                    <div className="col">
                      Color <select type="text" name="calColor"  onChange={changeSchedule} className="form-control"value={schedule.calColor} >
                              <option>----선택----</option>
                              <option value={"#E0FFFF"}>1</option>
                              <option value={"#E6E6FA"}>1</option>
                              <option value={"#FFF0F5"}>1</option>
                            </select>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col">
                      Content <input type="text" name="calContent"  onChange={changeSchedule} className="form-control" value={schedule.calContent}/>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col">
                      시작일 <input type="date" name="calStartDate"  onChange={changeSchedule} value={schedule.calStartDate}  className="form-control"/>
                    </div>
                    <div className="col">
                      종료일 <input type="date" name="calEndDate"  onChange={changeSchedule} value={schedule.calEndDate} className="form-control"/>
                    </div>
                  </div>

                </div>



              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} data-bs-dismiss="modal">Close</button>

                { isEventClicked ? 
                <button type="button" className="btn btn-primary" onClick={editSchedule}>수정</button>
                :
                <button type="button" className="btn btn-primary" onClick={addSchedule}>등록</button>
                }

               
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
    //모달 만들어서  모달 띄우고 state 설정해서 추가
  );
};

export default Calendar;