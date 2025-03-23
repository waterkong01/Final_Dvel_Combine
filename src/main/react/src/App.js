import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/Feed/Feed";
import Forum from "./components/Forums/Forum";
import News from "./pages/News";
import JobPost from "./pages/JobPost";
import JobDetail from "./pages/JobDetail"; // 구직 공고 상세 페이지
import Edu from "./pages/Edu";
import EduList from "./pages/EduList";
import Profile from "./pages/Profile";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import { ProfileProvider } from "./pages/ProfileContext";

import { AuthProvider } from "./api/context/AuthContext";
import SignUp from "./pages/SignUp";
import Lecture from "./pages/kedu/course/lecture2";
import { RegionContextProvider } from "./api/provider/RegionSearchContextProvider2";
import Course from "./pages/kedu/course/course2";
import KakaoAuth from "./component/KakaoAuth";
import NaverCallback from "./component/NaverCallBack";
import { ToastContainer } from "react-toastify"; // ToastContainer 컴포넌트 import
import "react-toastify/dist/ReactToastify.css"; // 스타일 import
import { MemberInfoContextProvider } from "./api/provider/MemberInfoContextProvider2";

import CreatePost from "./components/Forums/CreatePost";
import PostDetail from "./components/Forums/PostDetail";
import ForumPosts from "./components/Forums/ForumPosts";
import CourseList from "./pages/kedu/course/courseList2";
import DetailCourse from "./pages/kedu/course/detailCourse2";
import Trend from "./pages/kedu/etc/Trend";
import Trend2 from "./pages/kedu/etc/Trend2";
import Trend3 from "./pages/kedu/etc/Trend3";
import User from "./pages/User";
import MsgMain from "./pages/Msg/MsgMain";
import Alarm from "./pages/Alarm";
import Add from "./pages/Add";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Main from "./pages/Main";
import {ChatStoreProvider} from "./api/context/ChatStore";
import Store from "./api/context/Store";
import {Provider} from "react-redux";
import React, {createContext, useContext, useEffect, useState} from "react";
import TopBar from "./component/TopBar";
import SideBar from "./component/SideBar";
import GlobalStyle from "./styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import MypageDetail from "./pages/mypage/MypageDetail";
import MypageList from "./pages/mypage/MypageList";

// export const DarkModeContent = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const theme = {
    darkMode: darkMode, // 다크모드 상태를 전역 테마로 설정
  };
  return (
      <>
        <ThemeProvider theme={theme}>
          <GlobalStyle setDarkMode={setDarkMode} darkMode={darkMode} />
          <Provider store={Store}>
            <ChatStoreProvider>
               <AuthProvider>
                  <RegionContextProvider>
                    <MemberInfoContextProvider>
                      <ProfileProvider>
                        <Router>
                          <TopBar
                              darkMode={darkMode}
                              setDarkMode={setDarkMode}
                          />
                          <SideBar
                              darkMode={darkMode}
                              setDarkMode={setDarkMode}
                          />
                          <Routes>
                            <Route path="" element={<Main/>}/>
                            <Route path="/home" element={<Home/>}/>
                            <Route path="/search" element={<Search/>}/>
                            {/*<Route path="/news" element={<News/>}/>*/}
                            <Route path="/add" element={<Add/>}/>
                            <Route path="/alarm" element={<Alarm/>}/>
                            <Route path="/msg" element={<MsgMain darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
                            <Route path="/user" element={<User/>}/>




                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/auth/kakao/callback" element={<KakaoAuth />} />
                            <Route
                                path="/login/oauth2/code/naver"
                                element={<NaverCallback />}
                            />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/mypage" element={<MyPage />} />
                            <Route path="/mypage/:mypageId" element={<MypageDetail />} />
                            <Route path="/mypagelist" element={<MypageList />} />

                            <Route path="/feed" element={<Feed />} />
                            <Route path="/jobpost" element={<JobPost />} />
                            <Route path="/job/:id" element={<JobDetail />} />
                            <Route path="/edu" element={<Edu />} />
                            <Route path="/edulist" element={<EduList />} />
                            <Route path="/forum" element={<Forum />} />
                            <Route path="/forum/post/:postId" element={<PostDetail />} />
                            <Route path="/forum/create-post" element={<CreatePost />} />
                            <Route
                                path="/forum/category/:categoryId"
                                element={<ForumPosts />}
                            />
                            <Route path="/news" element={<News />} />
                            <Route path="/edu" element={<Edu />} />
                            <Route path="/lecture/:academyId" element={<Lecture />} />
                            <Route path="/academy" element={<Course />} />
                            <Route path="/course" element={<CourseList />} />
                            <Route
                                path="/detail/:region/:academyName/:courseId"
                                element={<DetailCourse />}
                            />
                            <Route path="/trend" element={<Trend />} />
                            <Route path="/trend2" element={<Trend2 />} />
                            <Route path="/trend3" element={<Trend3 />} />
                          </Routes>
                          {/* 최상위에 ToastContainer 배치 */}
                          <ToastContainer
                              position="top-right" // 위치 설정 (top-right)
                              autoClose={2000} // 자동 닫힘 시간 설정 (5000ms = 5초)
                              hideProgressBar={false} // 진행바 숨기기 여부
                              newestOnTop={false} // 새 메시지가 위에 표시되도록 설정
                              closeOnClick={true} // 클릭 시 닫히도록 설정
                              rtl={false} // RTL (오른쪽에서 왼쪽으로) 설정
                              pauseOnHover={true} // Hover 시 일시 정지
                          />
                        </Router>
                      </ProfileProvider>
                    </MemberInfoContextProvider>
                  </RegionContextProvider>
                </AuthProvider>
            </ChatStoreProvider>
          </Provider>
        </ThemeProvider>
      </>
  );
}

export default App;
