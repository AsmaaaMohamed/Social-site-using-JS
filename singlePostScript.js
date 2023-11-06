const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");

getPost();
function getPost(){
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        const post = response.data.data;
        const authorName = post.author.username;
        const postParent = document.getElementById("post-parent");
        postParent.innerHTML = "";
        let postImg = Object.keys(post.image) != 0? post.image : "./posts-pics/cat-02.jpg";
        let profileImg = Object.keys(post.author.profile_image) != 0? post.author.profile_image : "./profile-pics/user-gender-neutral-head-icon.png";
        let postTitle = post.title ? post.title : "";
        const authorSpan = document.getElementById("authorSpan");
        authorSpan.innerHTML = `${authorName}'s`
        let content = `
            <div class="card shadow mt-3">
                    <div class="card-header">
                        <img class="border border-2 rounded-circle" src="${profileImg}" width="40px" height="40px">
                        <b>${authorName}</b>
                    </div>
                    <div class="card-body" >
                        <img src="${postImg}" class="w-100" height="400">
                        <h6 class="text-body-tertiary mt-1"> ${post.created_at} </h6>
                        <h5 class="card-title">${postTitle}</h5>
                        <p class="card-text">${post.body}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                        <hr>
                        <div>
                            <i class="bi bi-pen"></i>
                            <span>(${post.comments_count}) Comments
                                <span id="post-tags-${post.id}">
                                    <button class="btn btn-sm rounded-5" style="background-color:grey;color:#fff">
                                        Policyyy
                                    </button>
                                </span>    
                            </span>
                        </div>
                    </div>
                    <hr>   

                    <!-- COMMENTS -->
                    <div id="comments">
                        
                    </div>
                    <!--// COMMENTS //-->
                    
                    <div class="input-group mb-3" id="add-comment-div">                            
                        <input id="comment-input" type="text" placeholder="add your comment.." class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                        <button class="btn btn-outline-primary" type="button" id="button-addon1" onclick="sendCommentClicked()">send</button>
                    </div>
            </div>`;
        postParent.innerHTML += content;
        const comments = post.comments;
        const commentsDiv = document.getElementById("comments");
        commentsDiv.innerHTML ="";
        for (comment of comments){
            let commentImg = Object.keys(comment.author.profile_image) != 0? comment.author.profile_image : "./profile-pics/user-gender-neutral-head-icon.png";
            commentContent =
                `<!-- COMMENT -->
                <div class="p-3 mb-1" style="background: rgb(241, 246, 255)">
                    <div>
                        <img src="${commentImg}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                        <b>${comment.author.username}</b>
                    </div>

                    <div>
                        ${comment.body}
                    </div>
                </div>
                <!--// COMMENT //-->`;
            commentsDiv.innerHTML += commentContent;
        }
        let comInput = document.getElementById("comment-input");
        comInput.onkeydown = function(e){
            if(e.keyCode == 13){
                sendCommentClicked();
            }
        }
        
    });
}
function getComments(){
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        const post = response.data.data;
        const comments = post.comments;
        const commentsDiv = document.getElementById("comments");
        commentsDiv.innerHTML ="";
        for (comment of comments){
            let commentImg = Object.keys(comment.author.profile_image) != 0? comment.author.profile_image : "./profile-pics/user-gender-neutral-head-icon.png";
            commentContent =
                `<!-- COMMENT -->
                <div class="p-3 mb-1" style="background: rgb(241, 246, 255)">
                    <div>
                        <img src="${commentImg}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                        <b>${comment.author.username}</b>
                    </div>

                    <div>
                        ${comment.body}
                    </div>
                </div>
                <!--// COMMENT //-->`;
            commentsDiv.innerHTML += commentContent;
        }
    });
}
function sendCommentClicked(){
    let commentInput = document.getElementById("comment-input");
    const token = localStorage.getItem("token");
    const headers = {
        "authorization"  : `Bearer ${token}`
    };
    const body = {
        "body" : commentInput.value,
    }
    axios.post(`${baseUrl}/posts/${id}/comments`,body,{
        headers : headers
    }).then((response)=>{
        getPost();
        commentInput.value="";
        showAlert("Comment added successfully" , "success");
    }).catch((error)=>{
        const errorMsg = error.response.data.message;
        showAlert(errorMsg , "danger");
    });
}