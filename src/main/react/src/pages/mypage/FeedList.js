import React, {useEffect, useRef, useState} from "react";
import FeedApi from "../../api/FeedApi";
import ChattingApi from "../../api/ChattingApi";
import {getStorage, getDownloadURL, ref} from "firebase/storage";
import imgLogo2 from "../../images/DeveloperMark.jpg";
import {storage} from "../../utils/FirebaseConfig";
import {
    EditBtnBox,
    FeedBottom,
    FeedContainer,
    FeedImg,
    FeedMid,
    FeedTop,
    UserInfo
} from "../../design/Mypage/FeedListDesign";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";
import {toast} from "react-toastify";
import Common from "../../utils/Common";

const FeedList = ({memberId}) => {
    const [feeds, setFeeds] = useState([]); // 피드 리스트 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nickName, setNickName] = useState(null);
    const [profileImg, setProfileImg] = useState(imgLogo2);
    const [loggedInUser, setLoggedInUser] = useState(null);

    // KR: 수정 모드 상태
    const [editingFeedId, setEditingFeedId] = useState(null);
    const [editingFeedContent, setEditingFeedContent] = useState("");
    const [posts, setPosts] = useState([]);

    const FEED_ICON_URL = [
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fclose%201.png?alt=media&",  // close
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
    ]

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date(dateString));
    };

    useEffect(() => {
        // 현재 로그인한 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await Common.getTokenByMemberId();
                const memberId = response.data;
                setLoggedInUser(memberId);
                console.log("로그인한 memberId:", typeof memberId);
            } catch (e) {
                console.error("로그인한 사용자 정보를 가져오는 중 오류 발생:", e);
            }
        };
        const fetchFeeds = async (memberId) => {
            try {
                const response = await FeedApi.getFeedByMemberId(memberId);
                console.log("API 응답: ", response);

                if (response.length === 0) {
                    setFeeds([]);
                } else {
                    setFeeds(response);
                }
            } catch (error) {
                setError("게시물을 불러오는 중 오류가 발생했습니다.");
                console.error("❌ 게시물 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchNickName = async (memberId) => {
            try {
                const response = await ChattingApi.getNickNameByMemberId(memberId);
                console.log("nickName:", response);
                setNickName(response.data);
            } catch (error) {
                console.error("닉네임 가져오는 중 오류:", error);
            }
        };
        const fetchProfileImg = async (memberId) => {
            try {
                const imgRef = ref(storage, `profile_images/${memberId}`);
                const imgUrl = await getDownloadURL(imgRef);
                setProfileImg(imgUrl);
            } catch (error) {
                console.error("이미지 불러오기 중 오류 : ", error);
                setProfileImg(imgLogo2);
            }
        }
        fetchUserInfo();
        if (memberId) {
            fetchFeeds(memberId);
            fetchNickName(memberId);
            fetchProfileImg(memberId);
        }
    }, [memberId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    // 수정 모드 활성화
    const startEditingFeed = (feed) => {
        if (feed.memberId !== memberId) {
            toast.error("자신의 게시글만 수정할 수 있습니다.");
            return;
        }
        setEditingFeedId(feed.feedId);
        setEditingFeedContent(feed.content);
    };

    // 수정 취소
    const cancelEditingFeed = () => {
        setEditingFeedId(null);
        setEditingFeedContent("");
    };

    // 피드 수정 저장
    const submitFeedEdit = async () => {
        if (!editingFeedContent.trim()) return;
        try {
            await FeedApi.editFeed(editingFeedId, {
                memberId,
                content: editingFeedContent
            });

            // 수정된 내용을 반영하여 feeds 업데이트
            setFeeds((prevFeeds) =>
                prevFeeds.map((feed) =>
                    feed.feedId === editingFeedId
                        ? { ...feed, content: editingFeedContent }
                        : feed
                )
            );

            setEditingFeedId(null);
            setEditingFeedContent("");
            toast.success("게시글이 수정되었습니다.");
        } catch (error) {
            console.error("❌ 피드 수정 실패:", error);
            toast.error("게시글 수정에 실패했습니다.");
        }
    };

    // 피드 삭제
    const deleteFeed = async (feedId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await FeedApi.deleteFeed(feedId);
            setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.feedId !== feedId));
            toast.success("게시글이 삭제되었습니다.");
        } catch (error) {
            console.error("❌ 게시글 삭제 실패:", error);
            toast.error("게시글 삭제에 실패했습니다.");
        }
    }

    const isOwner = loggedInUser === Number(memberId);

    return (
      <>
          {feeds.length > 0 ? (
              feeds.map((feed) => (
                  <FeedContainer key={feed.id}>
                      <FeedTop>
                          <FeedImg src={profileImg} alt="프로필 이미지" />
                          <UserInfo>
                              <span className="nick_name">{nickName}</span>
                              <span className="created_at">{formatDate(feed.createdAt)}</span>
                          </UserInfo>
                      </FeedTop>
                      <FeedMid>
                          {editingFeedId === feed.feedId ? (
                              <textarea
                                  value={editingFeedContent}
                                  onChange={(e) => setEditingFeedContent(e.target.value)}
                                  rows={3}
                                  style={{ width: "100%", resize: "none" }}
                              />
                          ) : (
                              <span>{feed.content}</span>
                          )}
                      </FeedMid>

                      <FeedBottom>
                          {editingFeedId === feed.feedId ? (
                              <FeedBottom>
                                  <button className="save" onClick={submitFeedEdit}>저장</button>
                                  <button onClick={cancelEditingFeed}>취소</button>
                              </FeedBottom>
                          ) : (
                              <>
                                  {loggedInUser === feed.memberId && ( // 로그인한 사용자와 피드 작성자가 같을 때만 아이콘 표시
                                      <>
                                          <ChattingIcon
                                              src={FEED_ICON_URL[1]}
                                              alt="edit"
                                              onClick={() => startEditingFeed(feed)}
                                          />
                                          <ChattingIcon
                                              src={FEED_ICON_URL[0]}
                                              alt="delete"
                                              onClick={() => deleteFeed(feed.feedId)}
                                          />
                                      </>
                                  )}
                              </>
                          )}
                      </FeedBottom>
                  </FeedContainer>
              ))
          ) : (
              <div>해당 사용자가 등록한 게시물이 없습니다.</div>
          )}
      </>
    );
};

export default FeedList;