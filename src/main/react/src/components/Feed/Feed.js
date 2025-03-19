import React, {useState, useEffect, useRef, useContext} from "react";
import { useProfile } from "../../pages/ProfileContext";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; // KR: 리디렉션을 위한 useNavigate 임포트
import "react-toastify/dist/ReactToastify.css";
import FeedApi from "../../api/FeedApi";
import { getUserInfo } from "../../axios/AxiosInstanse";

import { getStorage, ref, getDownloadURL } from "firebase/storage";


// KR: 이미지 파일 임포트
import imgLogo1 from "../../images/RefreshButton.png";
import imgLogo2 from "../../images/DeveloperMark.jpg";
import imgLogo3 from "../../images/PictureButton.png";

// KR: 스타일 컴포넌트 임포트 (스타일 관련 코드는 변경하지 않음)
import {
  LayoutContainer,
  ProfileSection,
  ProfileImage,
  FeedContainer,
  CreateFeedContainer,
  TextareaContainer,
  UploadIconLabel,
  UploadIcon,
  PostList,
  Post,
  PostHeader,
  AuthorImage,
  AuthorDetails,
  AuthorName,
  PostDate,
  UploadedImage,
  RefreshButton,
  RefreshIcon,
  FriendsSection,
  FriendList,
  FriendItem,
  FriendInfo,
  FriendImage,
  FriendDetails,
  FriendRole,
  FriendActions,
  FriendRequestButton,
  MessageButton,
  PostActions,
  ActionButton,
  EditButton, // KR: 수정 버튼
  CommentContainer,
  CommentInput,
  CommentInputContainer,
  CommentSubmitIcon,
  CommentCard,
  RepostContainer,
  RepostInput,
  RepostSubmitButton,
  OriginalPostContainer,
  OriginalPostHeader,
  OriginalPostContent,
  ReplyContainer,
} from "../../styles/FeedStyles";
import {Container} from "../../design/CommonDesign";
import {MemberInfoContext} from "../../api/provider/MemberInfoContextProvider2";
import {ChatContext} from "../../api/context/ChatStore";
import ChattingApi from "../../api/ChattingApi";
import {storage} from "../../utils/FirebaseConfig";
import {post} from "axios";

/**
 * 재귀적으로 댓글(또는 대댓글)을 업데이트한다.
 * @param {Array} comments - 댓글 배열
 * @param {number} commentId - 업데이트할 댓글 ID
 * @param {object|function} updatedData - 업데이트 데이터 객체 또는 함수를 전달
 * @returns {Array} 업데이트된 댓글 배열
 */
const updateCommentRecursively = (comments, commentId, updatedData) => {
  return comments.map((comment) => {
    if (comment.commentId === commentId) {
      const newData =
        typeof updatedData === "function" ? updatedData(comment) : updatedData;
      return { ...comment, ...newData };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentRecursively(
          comment.replies,
          commentId,
          updatedData
        ),
      };
    }
    return comment;
  });
};

/**
 * 두 피드 객체를 병합한다.
 * @param {object} oldFeed - 기존 피드 데이터
 * @param {object} newFeed - 새로 가져온 피드 데이터
 * @returns {object} 병합된 피드 데이터
 */
const mergeFeedData = (oldFeed, newFeed) => {
  return {
    ...oldFeed,
    ...newFeed,
    profileImg: newFeed.profileImg || oldFeed.profileImg,
    originalPoster: newFeed.originalPoster || oldFeed.originalPoster,
  };
};

const getOriginalPosterLabel = (originalPoster) => {
  if (originalPoster) {
    console.log("Original Poster exists:", originalPoster);
    return `- ${originalPoster.name}`;
  } else {
    console.log("Original Poster is null or undefined");
    return "";
  }
};

/**
 * 대댓글을 재귀적으로 렌더링한다.
 * (답글 또한 댓글과 같은 로직으로 좋아요 상태가 처리된다)
 * @param {Array} replies - 대댓글 배열
 * @param {number} parentFeedId - 상위 피드 ID
 * @param {number} memberId - 현재 사용자 ID
 * @param {object} likedComments - 댓글 및 대댓글의 좋아요 상태 객체
 * @param {object} commentLikeLoading - 좋아요 처리 중 상태 객체
 * @param {function} handleCommentLike - 댓글 좋아요/취소 처리 함수
 * @param {function} toggleReplyInput - 답글 입력 토글 함수
 * @param {object} showReplyInput - 답글 입력창 표시 상태 객체
 * @param {object} replyInputs - 답글 입력값 상태 객체
 * @param {function} setReplyInputs - 답글 입력값 업데이트 함수
 * @param {function} handleReplySubmit - 답글 제출 처리 함수
 * @param {function} startEditingComment - 댓글 수정 시작 함수
 * @param {number|null} editingCommentId - 현재 수정 중인 댓글 ID
 * @param {string} editingCommentContent - 수정 중인 댓글 내용
 * @param {function} setEditingCommentContent - 수정 중인 댓글 내용 업데이트 함수
 * @param {function} submitCommentEdit - 댓글 수정 제출 함수
 * @returns {JSX.Element} 대댓글 렌더링 JSX
 */
const renderReplies = (
  replies,
  parentFeedId,
  memberId,
  likedComments,
  commentLikeLoading,
  handleCommentLike,
  toggleReplyInput,
  showReplyInput,
  replyInputs,
  setReplyInputs,
  handleReplySubmit,
  startEditingComment,
  editingCommentId,
  editingCommentContent,
  setEditingCommentContent,
  submitCommentEdit
) => {
  return (
    <ReplyContainer>
      {(replies || []).map((reply, idx) => {
        console.log(
          "Rendering reply:",
          reply.commentId,
          "liked status:",
          likedComments[reply.commentId]
        );
        return (
          <CommentCard key={reply.commentId || idx}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={reply.profileImg || imgLogo2}
                alt="답글 작성자 이미지"
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                {reply.memberName || "Unknown"}
              </span>
            </div>
            {editingCommentId === reply.commentId ? (
              <div>
                <CommentInput
                  type="text"
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                  placeholder="댓글 수정..."
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "5px",
                  }}
                >
                  <EditButton onClick={submitCommentEdit}>저장</EditButton>
                  <EditButton onClick={() => startEditingComment(null)}>
                    취소
                  </EditButton>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "13px" }}>{reply.comment}</div>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#0073b1",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                onClick={() => handleCommentLike(reply.commentId, parentFeedId)}
                disabled={commentLikeLoading[reply.commentId]}
              >
                {likedComments[reply.commentId] ? "Unlike" : "Like"} (
                {reply.likesCount != null ? reply.likesCount : 0})
              </button>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#0073b1",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                onClick={() => toggleReplyInput(reply.commentId)}
              >
                Reply
              </button>
              {reply.memberId === memberId && (
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#0073b1",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => startEditingComment(reply)}
                >
                  수정
                </button>
              )}
            </div>
            {showReplyInput[reply.commentId] && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <CommentInput
                  type="text"
                  placeholder="답글 추가..."
                  value={replyInputs[reply.commentId] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [reply.commentId]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleReplySubmit(reply.commentId, parentFeedId);
                  }}
                />
                <EditButton
                  style={{ padding: "5px", fontSize: "12px" }}
                  onClick={() =>
                    handleReplySubmit(reply.commentId, parentFeedId)
                  }
                >
                  Send
                </EditButton>
              </div>
            )}
            {reply.replies &&
              reply.replies.length > 0 &&
              renderReplies(
                reply.replies,
                parentFeedId,
                memberId,
                likedComments,
                commentLikeLoading,
                handleCommentLike,
                toggleReplyInput,
                showReplyInput,
                replyInputs,
                setReplyInputs,
                handleReplySubmit,
                startEditingComment,
                editingCommentId,
                editingCommentContent,
                setEditingCommentContent,
                submitCommentEdit
              )}
          </CommentCard>
        );
      })}
    </ReplyContainer>
  );
};

/**
 * Feed 컴포넌트
 */
function Feed() {
  const navigate = useNavigate();

/*  // KR: 페이지 로드시 body 배경색 설정
  useEffect(() => {
    document.body.style.backgroundColor = "#f5f6f7";
  }, []);*/

  // KR: 피드 및 관련 상태 초기화
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [newFeed, setNewFeed] = useState("");
  const [image, setImage] = useState(null);
  const observer = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [memberData, setMemberData] = useState(null);

  const storage = getStorage();
  const [profileImgs, setProfileImgs] = useState({});

  // KR: 피드, 댓글, 좋아요 상태
  const [likedPosts, setLikedPosts] = useState({});
  const [likeLoading, setLikeLoading] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showRepostInput, setShowRepostInput] = useState({});
  const [repostInputs, setRepostInputs] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  // KR: 댓글/대댓글 좋아요 처리 중 상태
  const [commentLikeLoading, setCommentLikeLoading] = useState({});

  // KR: 수정 모드 상태
  const [editingFeedId, setEditingFeedId] = useState(null);
  const [editingFeedContent, setEditingFeedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  // 채팅
  const {setRoomId, setIsMenuOpen, setSelectedPage} = useContext(ChatContext);
  const [chatRooms, setChatRooms] = useState([]);
  // const {setRoomId} = useContext(ChatContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  // 채팅
  const { member } = useContext(MemberInfoContext);

  useEffect(() => {
    posts.forEach((post) => {
      if (post.isRepost) {
        console.log("Repost detected:", post);
      }
    });
  }, [posts]);

  // KR: 프로필 컨텍스트 사용
  const { profileInfo } = useProfile();
  useEffect(() => {
    console.log("Profile 정보:", profileInfo);
  }, [profileInfo]);

  // KR: 현재 사용자 정보 가져오기 함수
  const fetchMemberData = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo && userInfo.memberId) {
        setMemberId(userInfo.memberId);
        setMemberData({
          name: userInfo.name,
          currentCompany: userInfo.currentCompany,
          profileImg: userInfo.profileImg,
        });
      } else {
        // KR: 로그인하지 않은 경우 토스트 메시지 출력 후 2.5초 후에 로그인 페이지로 리디렉션
        toast.error("로그인이 필요합니다.");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류:", error);
      toast.error("사용자 정보를 확인할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // KR: 피드 게시물 불러오기 함수
  const fetchFeedPosts = async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const data = await FeedApi.fetchFeeds(page, 10, memberId);

      // KR: 새로 가져온 데이터가 없으면 더 이상 불러올 피드가 없음
      if (data.length === 0) {
        setHasMore(false);
      }

      // KR: 기존 피드와 중복되지 않는 데이터만 병합 후 최신순 정렬
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((p) => p.feedId));
        const filteredNewData = data.filter(
          (item) => !existingIds.has(item.feedId)
        );
        const combined = [...prevPosts, ...filteredNewData];
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return combined;
      });

      // KR: 한 번에 10개 미만의 데이터가 오면 마지막 페이지로 간주
      if (data.length < 10) {
        setHasMore(false);
      }

      // KR: 피드 좋아요 상태 업데이트
      setLikedPosts((prev) => {
        const newLiked = { ...prev };
        data.forEach((post) => {
          newLiked[post.feedId] = post.liked || false;
        });
        return newLiked;
      });

      // KR: 댓글 좋아요 상태 업데이트 (직접 연결된 댓글)
      setLikedComments((prev) => {
        const newLikedComments = { ...prev };
        data.forEach((post) => {
          if (post.comments && Array.isArray(post.comments)) {
            post.comments.forEach((comment) => {
              newLikedComments[comment.commentId] = comment.liked || false;
              if (comment.replies && Array.isArray(comment.replies)) {
                comment.replies.forEach((reply) => {
                  newLikedComments[reply.commentId] = reply.liked || false;
                });
              }
            });
          }
        });
        return newLikedComments;
      });
    } catch (error) {
      console.error("❌ 피드 가져오기 실패:", error);
      toast.error("피드를 불러오는데 실패했습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedPosts();
  }, [page, memberId]);

  // KR: 무한 스크롤용 Intersection Observer 설정
  const lastPostElementRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  // KR: 피드 작성 처리 함수
  const handleCreateFeed = async () => {
    if (!newFeed.trim() && !image) return;
    const data = { memberId, content: newFeed, mediaUrl: image };
    try {
      const createdPost = await FeedApi.createFeed(data);
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
      setNewFeed("");
      setImage(null);
      toast.success("피드 작성이 완료되었습니다.");
    } catch (error) {
      console.error("❌ 피드 작성 실패:", error);
      toast.error("피드 작성에 실패했습니다.");
    }
  };

  // KR: 피드 저장 처리 함수
  const handleSaveFeed = async (feedId) => {
    try {
      await FeedApi.saveFeed(feedId);
      toast.success("게시글이 저장되었습니다!");
    } catch (error) {
      console.error("❌ 게시글 저장 실패:", error);
      toast.error("게시글 저장에 실패했습니다.");
    }
  };

  // KR: 피드 새로고침 처리 함수
  const handleRefreshFeeds = () => {
    setRefreshing(true);
    setPage(0);
    setPosts([]);
    setHasMore(true);
    fetchFeedPosts();
    setTimeout(() => setRefreshing(false), 300);
  };

  // KR: 이미지 업로드 처리 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * KR: 피드 게시글 좋아요/취소 처리 (비관적 업데이트)
   * @param {number} feedId - 피드 ID
   */
  const handleLike = async (feedId) => {
    if (likeLoading[feedId]) return;
    setLikeLoading((prev) => ({ ...prev, [feedId]: true }));
    try {
      const currentLiked = likedPosts[feedId] || false;
      if (currentLiked) {
        await FeedApi.unlikeFeed(feedId, memberId);
      } else {
        await FeedApi.likeFeed(feedId, memberId);
      }
      const updatedFeed = await FeedApi.getFeedById(feedId, memberId);
      setLikedPosts((prev) => ({ ...prev, [feedId]: updatedFeed.liked }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.feedId === feedId ? mergeFeedData(post, updatedFeed) : post
        )
      );
    } catch (error) {
      console.error("❌ Like/Unlike failed", error);
      toast.error("좋아요 처리에 실패했습니다.");
    } finally {
      setLikeLoading((prev) => ({ ...prev, [feedId]: false }));
    }
  };

  /**
   * KR: 댓글 입력창 토글 처리 함수
   * @param {number} feedId - 피드 ID
   */
  const toggleCommentInput = (feedId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [feedId]: !prev[feedId],
    }));
  };

  /**
   * KR: 댓글 입력값 업데이트 처리 함수
   * @param {number} feedId - 피드 ID
   * @param {string} value - 입력값
   */
  const handleCommentInputChange = (feedId, value) => {
    setCommentInputs((prev) => ({ ...prev, [feedId]: value }));
  };

  /**
   * KR: 새로운 댓글 제출 처리 함수
   * @param {number} feedId - 피드 ID
   */
  const handleCommentSubmit = async (feedId) => {
    const comment = commentInputs[feedId];
    if (!comment || !comment.trim()) return;
    try {
      const newComment = await FeedApi.addComment(feedId, {
        comment,
        memberId,
      });
      if (!newComment.memberName || newComment.memberName === "Unknown") {
        newComment.memberName = memberData ? memberData.name : "Unknown";
        newComment.currentCompany = memberData
          ? memberData.currentCompany
          : "미등록 회사";
        newComment.profileImg = memberData
          ? memberData.profileImg
          : "";
      }
      setCommentInputs((prev) => ({ ...prev, [feedId]: "" }));
      toast.success("댓글이 등록되었습니다.");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.feedId === feedId
            ? {
                ...post,
                comments:
                  (post.comments || []).length > 0
                    ? [newComment, ...post.comments]
                    : [newComment],
              }
            : post
        )
      );
      setLikedComments((prev) => ({
        ...prev,
        [newComment.commentId]: newComment.liked,
      }));
    } catch (error) {
      console.error("❌ 댓글 제출 실패", error.response?.data || error);
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  /**
   * KR: 리포스트 입력창 토글 처리 함수
   * @param {number} feedId - 피드 ID
   */
  const toggleRepostInput = (feedId) => {
    setShowRepostInput((prev) => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  /**
   * KR: 리포스트 입력값 업데이트 처리 함수
   * @param {number} feedId - 피드 ID
   * @param {string} value - 입력값
   */
  const handleRepostInputChange = (feedId, value) => {
    setRepostInputs((prev) => ({ ...prev, [feedId]: value }));
  };

  /**
   * KR: 리포스트 제출 처리 함수
   * @param {number} feedId - 피드 ID
   */
  const handleRepostSubmit = async (feedId) => {
    const repostComment = repostInputs[feedId] || "";
    try {
      // KR: repost API 호출 후 즉시 피드 목록에 추가
      const repostResponse = await FeedApi.repostFeed(feedId, memberId, {
        content: repostComment,
      });
      setPosts((prevPosts) => [repostResponse, ...prevPosts]);
      setRepostInputs((prev) => ({ ...prev, [feedId]: "" }));
      toast.success("리포스트가 완료되었습니다!");
    } catch (error) {
      console.error("❌ Repost failed", error);
      toast.error("리포스트 처리에 실패했습니다.");
    }
  };

  /**
   * KR: 댓글 또는 대댓글 좋아요 처리 (비관적 업데이트)
   * @param {number} commentId - 댓글 (또는 대댓글) ID
   * @param {number} feedId - 해당 댓글이 속한 피드 ID
   */
  const handleCommentLike = async (commentId, feedId) => {
    if (commentLikeLoading[commentId]) return;
    console.log(
      "handleCommentLike: commentId",
      commentId,
      "current liked:",
      likedComments[commentId]
    );
    setCommentLikeLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      if (likedComments[commentId]) {
        await FeedApi.unlikeComment(commentId, memberId);
      } else {
        await FeedApi.likeComment(commentId, memberId);
      }
      const updatedFeed = await FeedApi.getFeedById(feedId, memberId);
      console.log("Updated feed after like toggle:", updatedFeed);
      const findCommentById = (comments, id) => {
        for (let comment of comments) {
          console.log(
            "Inspecting comment:",
            comment.commentId,
            "with replies:",
            comment.replies
          );
          if (comment.commentId === id) return comment;
          if (comment.replies) {
            const found = findCommentById(comment.replies, id);
            if (found) return found;
          }
        }
        return null;
      };
      const updatedComment = findCommentById(updatedFeed.comments, commentId);
      console.log(
        "Found updated comment for id",
        commentId,
        ":",
        updatedComment
      );
      if (updatedComment && typeof updatedComment.liked === "boolean") {
        setLikedComments((prev) => ({
          ...prev,
          [commentId]: updatedComment.liked,
        }));
      } else {
        console.warn(
          "Updated comment liked value is undefined, toggling manually."
        );
        setLikedComments((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));
      }
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("❌ 댓글 좋아요 처리 오류:", error);
      toast.error("댓글 좋아요 처리에 실패했습니다.");
    } finally {
      setCommentLikeLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  /**
   * KR: 답글 입력창 토글 처리 함수
   * @param {number} commentId - 댓글(답글) ID
   */
  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  /**
   * KR: 답글 제출 처리 함수
   * @param {number} commentId - 부모 댓글 ID (답글의 부모)
   * @param {number} feedId - 피드 ID
   */
  const handleReplySubmit = async (commentId, feedId) => {
    const reply = replyInputs[commentId];
    if (!reply || !reply.trim()) return;
    try {
      const newReply = await FeedApi.addComment(feedId, {
        comment: reply,
        memberId,
        parentCommentId: commentId,
      });
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      toast.success("답글이 등록되었습니다.");
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.feedId !== feedId) return post;
          const updatedComments = post.comments.map((c) =>
            c.commentId === commentId
              ? { ...c, replies: (c.replies || []).concat(newReply) }
              : c
          );
          return { ...post, comments: updatedComments };
        })
      );
    } catch (error) {
      console.error("❌ 답글 제출 실패", error.response?.data || error);
      toast.error("답글 등록에 실패했습니다.");
    }
  };

  // KR: 피드 게시글 수정 시작
  const startEditingFeed = (feed) => {
    if (feed.memberId !== memberId) {
      toast.error("자신의 게시글만 수정할 수 있습니다.");
      return;
    }
    setEditingFeedId(feed.feedId);
    setEditingFeedContent(feed.content);
  };

  // KR: 피드 게시글 수정 제출
  const submitFeedEdit = async () => {
    if (!editingFeedContent.trim()) return;
    try {
      const updatedFeed = await FeedApi.editFeed(editingFeedId, {
        memberId,
        content: editingFeedContent,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.feedId === editingFeedId
            ? mergeFeedData(post, updatedFeed)
            : post
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

  // KR: 댓글 수정 시작
  const startEditingComment = (comment) => {
    if (!comment || comment.memberId !== memberId) {
      toast.error("자신의 댓글만 수정할 수 있습니다.");
      return;
    }
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.comment);
  };

  // KR: 댓글 수정 제출
  const submitCommentEdit = async () => {
    if (!editingCommentContent.trim()) return;
    try {
      const updatedComment = await FeedApi.editComment(editingCommentId, {
        memberId,
        comment: editingCommentContent,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (!post.comments) return post;
          return {
            ...post,
            comments: updateCommentRecursively(
              post.comments,
              editingCommentId,
              updatedComment
            ),
          };
        })
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
      toast.success("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("❌ 댓글 수정 실패:", error);
      toast.error("댓글 수정에 실패했습니다.");
    }
  };

  const privateChat = async (post) => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const sender = memberId;
    const receiver = Number(post.memberId);

    if (sender === receiver) {
      alert("본인과는 채팅할 수 없습니다.");
      return;
    }

    try {
      // 현재 로그인한 사용자와 post 작성자의 채팅방이 있는지 확인
      const existingChatRoom = chatRooms.find(room =>
/*          (room.senderId === memberId && room.receiverId === post.memberId) ||
          (room.senderId === post.memberId && room.receiverId === memberId)*/
          (room.senderId === sender && room.receiverId === receiver) ||
          (room.senderId === receiver && room.receiverId === sender)
      );

      if (existingChatRoom) {
/*        setIsMenuOpen(false);
        // 기존 채팅방이 존재하면 해당 채팅방으로 이동
        setRoomId(existingChatRoom.roomId);
        navigate("/msg");
        setSelectedPage("chatting");*/
        navigate("/msg", {
          state: {selectedPage: "chatting", roomId: existingChatRoom.roomId}
        });
      } else {
        // setIsMenuOpen(false);
        // 기존 채팅방이 없으면 새로운 채팅방 생성 후 이동
        const newChatRoom = await ChattingApi.chatCreate(sender, receiver);
        // const newChatRoom = await ChattingApi.chatCreate(memberId, post.memberId);
        console.log("새로운 채팅방 생성됨:", newChatRoom);

        if (newChatRoom && newChatRoom.roomId) {
/*          setRoomId(newChatRoom.roomId);
          navigate("/msg");
          setSelectedPage("chatting");*/
          navigate("/msg", {
            state: {selectedPage: "chatting", roomId: newChatRoom.roomId}
          });
        } else {
          alert("채팅방 생성에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("채팅방 확인 또는 생성 중 오류 발생:", error);
      alert("채팅을 시작하는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    const loadProfileImgs = async () => {
      const newProfileImgs = {};

      for (const post of posts) {
        try {
          const imgRef = ref(storage, `profile_images/${post.memberId}`);
          const imgUrl = await getDownloadURL(imgRef);
          newProfileImgs[post.memberId] = imgUrl;
        } catch (error) {
          console.error("이미지 불러오기 중 오류 : ", error);
          newProfileImgs[post.memberId] = imgLogo2;
        }
      }
      setProfileImgs(newProfileImgs);
    };
    if (posts.length > 0) {
      loadProfileImgs();
    }
  }, [posts]);

  return (
    <Container className="center font_color">
      <LayoutContainer>
        {/* KR: 프로필 섹션 */}
        <ProfileSection>
          <ProfileImage src={imgLogo2} alt="프로필 이미지" />
          <p>Email: {profileInfo.email}</p>
          <p>Name: {profileInfo.name}</p>
        </ProfileSection>

        <FeedContainer>
          {/* KR: 피드 작성 섹션 */}
          <CreateFeedContainer>
            <TextareaContainer>
            <textarea
                value={newFeed}
                onChange={(e) => setNewFeed(e.target.value)}
                placeholder="새 피드를 작성하세요..."
                rows="3"
            />
              <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
              />
              <UploadIconLabel htmlFor="image-upload">
                <UploadIcon src={imgLogo3} alt="이미지 업로드" />
              </UploadIconLabel>
            </TextareaContainer>
            {image && <UploadedImage src={image} alt="업로드된 이미지" />}
            <button onClick={handleCreateFeed}>피드 작성</button>
          </CreateFeedContainer>

          {/* KR: 새로고침 버튼 */}
          <RefreshButton onClick={handleRefreshFeeds}>
            <RefreshIcon
                className={refreshing ? "refreshing" : ""}
                src={imgLogo1}
                alt="새로고침"
            />
          </RefreshButton>

          {/* KR: 피드 게시물 목록 */}
          <PostList>
            {(posts || []).map((post, index) => {
              const isLastPost = (posts || []).length === index + 1;
              return (
                  <Post
                      key={post.feedId}
                      ref={isLastPost ? lastPostElementRef : null}
                  >
                    <PostHeader>
                      <AuthorImage
                          src={profileImgs[post.memberId] || imgLogo2}
                          alt="회원 이미지"
                      />
                      <AuthorDetails>
                        <AuthorName>{post.authorName || "Unknown"}</AuthorName>
                        <div>
                          {memberId !== post?.memberId && ( // 본인이 아닐 때만 버튼 보이기
                              <button onClick={() => privateChat(post)}>1:1 채팅하기</button>
                          )}
                        </div>
                        <PostDate>{post.createdAt}</PostDate>
                      </AuthorDetails>
                      {post.memberId === memberId && (
                          <EditButton
                              onClick={() => startEditingFeed(post)}
                              style={{ marginLeft: "auto" }}
                          >
                            수정
                          </EditButton>
                      )}
                    </PostHeader>
                    {post.originalPoster && (
                        <OriginalPostContainer>
                          <OriginalPostHeader>
                            원본 게시글 {getOriginalPosterLabel(post.originalPoster)}
                          </OriginalPostHeader>
                          <OriginalPostContent>
                            {post.repostedFromContent || "내용이 없습니다."}
                          </OriginalPostContent>
                        </OriginalPostContainer>
                    )}
                    {editingFeedId === post.feedId ? (
                        <div>
                          <CommentInput
                              value={editingFeedContent}
                              onChange={(e) => setEditingFeedContent(e.target.value)}
                              placeholder="게시글 수정..."
                          />
                          <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "5px",
                              }}
                          >
                            <EditButton onClick={submitFeedEdit}>저장</EditButton>
                            <EditButton onClick={() => setEditingFeedId(null)}>
                              취소
                            </EditButton>
                          </div>
                        </div>
                    ) : (
                        <p>{post.content}</p>
                    )}
                    {post.mediaUrl && (
                        <UploadedImage src={post.mediaUrl} alt="게시글 이미지" />
                    )}
                    <hr />
                    <PostActions>
                      <ActionButton onClick={() => handleLike(post.feedId)}>
                        {likedPosts[post.feedId] ? "Unlike" : "Like"} (
                        {post.likesCount})
                      </ActionButton>
                      <ActionButton onClick={() => toggleCommentInput(post.feedId)}>
                        Comment
                      </ActionButton>
                      <ActionButton onClick={() => toggleRepostInput(post.feedId)}>
                        Repost
                      </ActionButton>
                      <ActionButton onClick={() => handleSaveFeed(post.feedId)}>
                        Save
                      </ActionButton>
                    </PostActions>
                    {showCommentInput[post.feedId] && (
                        <CommentContainer>
                          <CommentInputContainer>
                            <CommentInput
                                type="text"
                                placeholder="댓글 추가..."
                                value={commentInputs[post.feedId] || ""}
                                onChange={(e) =>
                                    handleCommentInputChange(post.feedId, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleCommentSubmit(post.feedId);
                                }}
                            />
                            <CommentSubmitIcon
                                onClick={() => handleCommentSubmit(post.feedId)}
                            >
                              &#10148;
                            </CommentSubmitIcon>
                          </CommentInputContainer>
                        </CommentContainer>
                    )}
                    {post.comments && (post.comments || []).length > 0 && (
                        <div style={{ marginTop: "10px" }}>
                          {(post.comments || []).map((comment, idx) => (
                              <CommentCard
                                  key={
                                    comment.commentId
                                        ? `${comment.commentId}-${idx}`
                                        : `${idx}`
                                  }
                              >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img
                                      src={comment.profileImg || imgLogo2}
                                      alt="댓글 작성자 이미지"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                      }}
                                  />
                                  <div
                                      style={{ display: "flex", flexDirection: "column" }}
                                  >
                            <span
                                style={{ fontWeight: "bold", fontSize: "14px" }}
                            >
                              {comment.memberName || "Unknown"}
                            </span>
                                    <span style={{ fontSize: "12px", color: "#888" }}>
                              {comment.currentCompany || "미등록 회사"}
                            </span>
                                  </div>
                                </div>
                                {editingCommentId === comment.commentId ? (
                                    <div>
                                      <CommentInput
                                          type="text"
                                          value={editingCommentContent}
                                          onChange={(e) =>
                                              setEditingCommentContent(e.target.value)
                                          }
                                          placeholder="댓글 수정..."
                                      />
                                      <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: "10px",
                                            marginTop: "5px",
                                          }}
                                      >
                                        <EditButton onClick={submitCommentEdit}>
                                          저장
                                        </EditButton>
                                        <EditButton
                                            onClick={() => setEditingCommentId(null)}
                                        >
                                          취소
                                        </EditButton>
                                      </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "14px" }}>
                                      {comment.comment}
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <button
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#0073b1",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                          handleCommentLike(comment.commentId, post.feedId)
                                      }
                                      disabled={commentLikeLoading[comment.commentId]}
                                  >
                                    {likedComments[comment.commentId]
                                        ? "Unlike"
                                        : "Like"}{" "}
                                    (
                                    {comment.likesCount != null
                                        ? comment.likesCount
                                        : 0}
                                    )
                                  </button>
                                  <button
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#0073b1",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => toggleReplyInput(comment.commentId)}
                                  >
                                    Reply
                                  </button>
                                  {comment.memberId === memberId && (
                                      <button
                                          onClick={() => startEditingComment(comment)}
                                          style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#0073b1",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                          }}
                                      >
                                        수정
                                      </button>
                                  )}
                                </div>
                                {comment.replies &&
                                    (comment.replies || []).length > 0 && (
                                        <div>
                                          {renderReplies(
                                              comment.replies,
                                              post.feedId,
                                              memberId,
                                              likedComments,
                                              commentLikeLoading,
                                              handleCommentLike,
                                              toggleReplyInput,
                                              showReplyInput,
                                              replyInputs,
                                              setReplyInputs,
                                              handleReplySubmit,
                                              startEditingComment,
                                              editingCommentId,
                                              editingCommentContent,
                                              setEditingCommentContent,
                                              submitCommentEdit
                                          )}
                                        </div>
                                    )}
                                {showReplyInput[comment.commentId] && (
                                    <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginTop: "5px",
                                        }}
                                    >
                                      <CommentInput
                                          type="text"
                                          placeholder="답글 추가..."
                                          value={replyInputs[comment.commentId] || ""}
                                          onChange={(e) =>
                                              setReplyInputs((prev) => ({
                                                ...prev,
                                                [comment.commentId]: e.target.value,
                                              }))
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              handleReplySubmit(
                                                  comment.commentId,
                                                  post.feedId
                                              );
                                          }}
                                      />
                                      <EditButton
                                          style={{ padding: "5px", fontSize: "12px" }}
                                          onClick={() =>
                                              handleReplySubmit(
                                                  comment.commentId,
                                                  post.feedId
                                              )
                                          }
                                      >
                                        Send
                                      </EditButton>
                                    </div>
                                )}
                              </CommentCard>
                          ))}
                        </div>
                    )}
                    {showRepostInput[post.feedId] && (
                        <RepostContainer>
                          <RepostInput
                              type="text"
                              placeholder="리포스트 시 코멘트 추가..."
                              value={repostInputs[post.feedId] || ""}
                              onChange={(e) =>
                                  handleRepostInputChange(post.feedId, e.target.value)
                              }
                          />
                          <RepostSubmitButton
                              onClick={() => handleRepostSubmit(post.feedId)}
                          >
                            Repost
                          </RepostSubmitButton>
                        </RepostContainer>
                    )}
                  </Post>
              );
            })}
          </PostList>
        </FeedContainer>

        {/* KR: 친구 추천 섹션 */}
        <FriendsSection>
          <h2>친구 추천</h2>
          <FriendList>
            <FriendSuggestions memberId={memberId} />
          </FriendList>
        </FriendsSection>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </LayoutContainer>
    </Container>
  );
}

/**
 * KR: 친구 추천 컴포넌트
 * @param {object} props - 컴포넌트 props
 * @param {number} props.memberId - 현재 로그인한 사용자 ID
 * @returns {JSX.Element} 친구 추천 목록 렌더링
 */
function FriendSuggestions({ memberId }) {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const suggestedFriends = await FeedApi.fetchSuggestedFriends(memberId);
        setFriendList(suggestedFriends);
      } catch (error) {
        console.error("❌ 친구 추천 불러오기 실패:", error);
      }
    }
    if (memberId) fetchFriends();
  }, [memberId]);

  return (
    <>
      {(friendList || []).map((friend) => (
        <FriendItem key={friend.memberId}>
          <FriendInfo>
            <FriendImage
              src={friend.profileImg || imgLogo2}
              alt="친구 이미지"
            />
            <FriendDetails>
              <span>{friend.name}</span>
              <FriendRole>{friend.currentCompany || "미등록 회사"}</FriendRole>
            </FriendDetails>
          </FriendInfo>
          <FriendActions>
            <FriendRequestButton>친구 요청</FriendRequestButton>
            <MessageButton>메시지</MessageButton>
          </FriendActions>
        </FriendItem>
      ))}
    </>
  );
}

export default Feed;
