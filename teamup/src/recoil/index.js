import { atom } from "recoil";

//atom은 recoil에 데이터를 만드는 명령
//원래 HttpSession에 넣어뒀던 데이터를 리액트에서 관리할 수 있도록 추가

// 로그인했을시 아이디 저장소
const userState = atom({
    key:'userState',
    default:''//향후 서버 연동 로그인이 구현되면 비워두고 로그인 성공시 설정하도록 구현
});

// 레벨 저장소
const levelState = atom({
    key:'levelState',
    default:''
});
const companyState = atom({
    key:'companyState',
    default:''
});

//토큰 저장소
const tokenState = atom({
    key:'tokenState',
    default:''
});

// 결재자 저장소
const receiverState  = atom({
    key:'receiverState',
    default:''
});

// 참조자 저장소
const referrerState  = atom({
    key:'referrerState',
    default:''
});

//TodoList저장소
 const todosState = atom({
    key: 'todosState',
    default: [],
  });

  const loadingState = atom({
    key: 'loadingState',
    default: true,
  });

  //채팅방 스테이트
   const roomState =atom({
    key:'roomState',
    default:'',
   })

   //공지사항 저장소
   export const userReadHistoryState = atom({
    key: 'userReadHistory',
    default: [], // 사용자의 조회 이력을 저장할 배열
  });

  //공지사항 댓글 저장소
  export const repliesState = atom({
    key: 'repliesState',
    default: [],
  });


   const nameState =atom({
    key:'nameState',
    default:'',
   })
   const deptNoState =atom({
    key:'deptNoState',
    default:'',
   })



export {userState, levelState, roomState,tokenState, nameState,deptNoState,receiverState, referrerState,companyState, todosState, loadingState};