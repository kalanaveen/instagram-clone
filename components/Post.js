import { HeartIcon as FillHeartIcon } from "@heroicons/react/solid";
import { DotsHorizontalIcon, HeartIcon, ChatIcon, PaperAirplaneIcon, BookmarkIcon, EmojiHappyIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";

function Post({ id, username, userImg, img, caption, timestamp }) {
    const { data: session } = useSession();
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([])
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() =>
        onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
            (snapshot) => setComments(snapshot.docs))
        , [db, id])

    useEffect(() => onSnapshot(collection(db, "posts", id, "likes"), orderBy("timestamp", "desc"), (snapshot) => setLikes(snapshot.docs)), [db, id])

    useEffect(() => setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), [likes])

    const deletePost = async (e) => {
        e.preventDefault();
        if(session.user.username === username){
            await deleteDoc(doc(db, "posts", id)) 
        }
    }

    const likePost = async () => {
        if (hasLiked) {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid))
        } else {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.username,
            })
        }
    }

    const sendComment = async (e) => {
        e.preventDefault()

        const commentSend = comment
        setComment("")

        await addDoc(collection(db, "posts", id, "comments"), {
            comment: commentSend,
            username: session.user.username,
            userImg: session.user.image,
            timestamp: serverTimestamp(),
        })
    }

    return (
        <div className="bg-white my-7 border rounded-sm">
            <div className="flex items-center p-5">
                <img src={userImg} alt="profile" className="rounded-full h-12 w-12 object-contain border p-1 mr-3" />
                <p className="flex-1 font-bold">{username}</p>
                {session && (
                    <div className="p-4">
                        <div className="group relative">
                            <button>
                                <DotsHorizontalIcon className="h-5" /></button>
                            <nav tabIndex="0" className=" bg-white invisible w-32 absolute right-0 bottom-0 transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1">
                                <ul className="py-1">
                                    <li>
                                        <a href="/" className=" px-2 py-2 hover:bg-gray-100" onClick={deletePost}>
                                            Delete post
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            <img src={img} alt="post image" className="object-cover w-full" />

            {session && (
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex space-x-4">
                        {hasLiked ? (
                            <FillHeartIcon onClick={likePost} className="btn text-red-500" />
                        ) : (
                            <HeartIcon className="btn" onClick={likePost} />
                        )}
                        <ChatIcon className="btn" />
                        <PaperAirplaneIcon className="btn" />
                    </div>
                    <BookmarkIcon className="btn" />
                </div>
            )}

            <p className="p-5 truncate">
                {likes.length > 0 && (
                    <p className="font-bold mb-1">{likes.length} likes</p>
                )}
                <div className="flex flex-col">
                    <div>
                        <span className="font-bold mr-1">{username} </span>{caption}
                    </div>
                    <div>
                        <span className="mr-1 text-xs text-gray-400">Posted</span>
                        <Moment fromNow className="pr-5 text-xs text-gray-400 ml-2">
                            {timestamp?.toDate()}
                        </Moment>
                    </div>
                </div>
            </p>
            
            {comments.length > 0 && (
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">>
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-center space-x-2 mb-3">
                            <img src={comment.data().userImg} alt="user image" className="h-7 rounded-full" />
                            <p className="text-sm flex-1">
                                <span className="font-bold">{comment.data().username} </span>
                                {comment.data().comment}
                            </p>
                            <Moment fromNow className="pr-5 text-xs text-gray-400">
                                {comment.data().timestamp?.toDate()}
                            </Moment>
                        </div>
                    ))}
                </div>
            )}
        
            {session && (

                <form className="flex items-center p-4">
                    <EmojiHappyIcon className="h-7" />
                    <input value={comment} type="text" className="border-none flex-1 focus:ring-0 outline-none" placeholder="Add a comment...." onChange={(e) => setComment(e.target.value)} />
                    <button type="submit" disabled={!comment.trim()} onClick={sendComment} className="font-semibold text-blue-400">Post</button>
                </form>
            )}
        </div>
    );
}

export default Post;
