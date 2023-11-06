getPosts();
function userClicked(userId)
{
    window.location = `profile.html?userid=${userId}`
}
let currentPage = 1;
let lastPage = 1;
//===== INFINITE SCROLL ======//
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if(endOfPage && currentPage < lastPage){
        currentPage++;
        getPosts(currentPage , false);
    }
});


function getPosts(page = 1 , reload = true){
    toggleLoader(true);
    axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
    .then((response) => {
        const posts = response.data.data;
        const postParent = document.getElementById('posts');
        lastPage = response.data.meta.last_page;
        if (reload)
            postParent.innerHTML ='';
        for(post of posts){
            const author = post.author;
            let profileImg = Object.keys(post.author.profile_image) != 0? post.author.profile_image : "./profile-pics/user-gender-neutral-head-icon.png";
            let postImg = Object.keys(post.image) != 0? post.image : "./posts-pics/cat-02.jpg";
            let postTitle = post.title ? post.title : "";
            // show or hide (edit) button
            let user = getCurrentUser();
            let isMyPost = user != null && post.author.id == user.id;
            let editBtnContent ='';
            if(isMyPost){
                editBtnContent = 
                `
                <button class="btn btn-danger" style="float:right;margin-left:5px" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                <button class="btn btn-secondary" style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                `;
            }
            let content = `
            <div class="card shadow mt-3">
                <span onclick="userClicked(${author.id})" style="cursor: pointer">
                    <div class="card-header">
                    <img class="border border-2 rounded-circle" src="${profileImg}" width="40px" height="40px">
                </span>
                <b>${author.username}</b>
                ${editBtnContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
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
            </div>
            `;
            postParent.innerHTML += content;
            const currrentPostTagsId = `post-tags-${post.id}`;
            document.getElementById(currrentPostTagsId).innerHTML="";
            for(tag of post.tags){
                let tagsContent =`                                    
                <button class="btn btn-sm rounded-5" style="background-color:grey;color:#fff">
                    ${tag.name}
                </button>`;
                document.getElementById(currrentPostTagsId).innerHTML += tagsContent;
            }
        }
    }).catch((error)=>{
        let errorMsg = error.response.data.message;
        showAlert(errorMsg , "danger");
    }).finally(()=>{
        toggleLoader(false);
    });
    
}
function postClicked(postId){
    window.location=`singlePost.html?postId=${postId}`;
}
