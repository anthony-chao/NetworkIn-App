import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReplyIndex from "./reply_index";
import UpdateCommentContainer from './update_comment_container';
import AddReplyContainer from "./add_reply_container";

const CommentIndexItem = (props) => {

    const { comment, users, timeSince, currentUser, deleteComment, comments, likes, addLike, deleteLike } = props;
    const history = useHistory();

    const toAuthorsProfile = () => {
        history.push(`/users/${comment.user_id}`);
    }

    const [dropdown, setDropdown] = useState(false);
    const [editing, setEditing] = useState(false);
    const [addReply, setAddReply] = useState(false);

    const handleAddReply = () => {
        addReply ? setAddReply(false) : setAddReply(true);
    };

    const handleDropdown = () => {
        dropdown ? setDropdown(false) : setDropdown(true);
    };

    const cancelEdit = () => {
        editing ? setEditing(false) : setEditing(true);
    };

    const repliesCount = Object.values(comments)
        .filter((reply) => reply.parent_comment_id === comment.id)
        .length;

    const likesCount = Object.values(likes)
        .filter((like) => like.likeable_type === "Comment" && like.likeable_id === comment.id)
        .length

    const likedComment = Object.values(likes)
        .filter((like) => like.likeable_type === "Comment" && like.likeable_id === comment.id && like.user_id === currentUser.id);
        
    const toggleLike = () => {
        (likedComment.length === 0) ? 
            addLike({post_id: comment.post_id, likeable_type: "Comment", likeable_id: comment.id, user_id: currentUser.id})
        : deleteLike(likedComment[0]);
    }
    
    return (
        <div>
            <div className="single-comment">
                <div onClick={toAuthorsProfile}> 
                    {(users[comment.user_id].profilePictureUrl) ?
                    <img src={`${users[comment.user_id].profilePictureUrl}`} id="post-index-profile-image" style={{height: 40, width: 40, cursor: "pointer", objectFit: "cover"}}/> 
                    : <img src="https://i.postimg.cc/bYDLSPVZ/image-removebg-preview.png" id="post-index-profile-image" style={{height: 40, width: 40, cursor: "pointer", objectFit: "cover"}}/>
                    }
                </div>
                <div className="single-comment-right">
                    <div className="single-comment-body">
                        <div className="single-comment-name-time">
                            <div onClick={toAuthorsProfile} id="single-comment-name">
                                <div>{users[comment.user_id].first_name.concat(" ", users[comment.user_id].last_name)}</div>
                                { (comment.user_id === currentUser.id) ? <p>Author</p> : null }
                            </div>
                            <div className="single-comment-post-date">
                                <div>{timeSince(comment.created_at)}</div>
                                { currentUser.id === comment.user_id ?
                                <span onClick={handleDropdown} onBlur={() => setDropdown(false)}>•••</span>
                                : null }
                                { (dropdown) ? 
                                    <div id="comment-dropdown">
                                        <div onClick={() => {setEditing(true), setDropdown(false)}}><img src="https://i.postimg.cc/Y9JpH6sk/image-removebg-preview.png" id="comment-edit-button"/>Edit</div>
                                        <div onClick={() => {deleteComment(comment), setDropdown(false)}}><img src="https://i.postimg.cc/tRh0B38K/image-removebg-preview.png" id="comment-edit-button"/>Delete</div>
                                    </div> 
                                : null}
                            </div>
                        </div>
                        <div id="single-comment-headline">{users[comment.user_id].headline}</div>
                        { (editing) ? 
                            <div>
                                <UpdateCommentContainer comment={comment} cancelEdit={cancelEdit} editing={editing} setEditing={setEditing}/>
                            </div>
                        : <div id="single-comment-body">{comment.body}</div> }
                    </div>
                    <div className="comment-likes-replies">
                        <div onClick={toggleLike} id={`${likedComment.length === 0 ? "" : 'liked-post-icon'}`}>Like</div>
                        {(likesCount > 0) ? <span>• {likesCount} <img src="https://i.postimg.cc/VNmdxbQc/image-removebg-preview.png"/></span> : null}
                        |
                        <div onClick={handleAddReply}>Reply</div> 
                        {(repliesCount === 1) ? <span>• 1 Reply</span> : null}
                        {(repliesCount > 1) ? <span>• {repliesCount} Replies</span> : null}
                    </div>
                </div>
            </div>
            <ReplyIndex comment={comment} timeSince={timeSince} handleAddReply={handleAddReply}/>
            { addReply ? <AddReplyContainer postId={comment.post_id} parent_comment_id={comment.id} /> : null }
        </div>
    )
}

export default CommentIndexItem;