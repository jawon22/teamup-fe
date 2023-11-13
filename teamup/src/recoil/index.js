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


export {userState, levelState, tokenState, receiverState, referrerState,companyState};