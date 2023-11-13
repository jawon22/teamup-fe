import { Route, Routes } from 'react-router';
import './App.css';
import Sidebar from './components/Sidebar';
import "./components/Sidebar";
import "./components/styles.css";
import ApproveList from "./components/ApproveList";
import ApproveWrite from "./components/ApproveWrite";
import Com from './components/com';
import Search from './components/search';
import Home from './components/home';
import Login from './components/login';

function App() {
  return (
  <>
        <div className=' main-content container-fluid '>
        <Sidebar />
        {/* 메인 화면 */}

        <div>
          <Routes>
            {/* 결재라우터 */}
            <Route path="/approveList" element={<ApproveList/>}></Route> 
            <Route path="/approveWrite" element={<ApproveWrite/>}></Route>
            <Route path='/com' element={<Com/>} ></Route>
            <Route path='/search' element={<Search/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            </Routes>

        </div>
      

        </div>
  
  </>
  );
}

export default App;