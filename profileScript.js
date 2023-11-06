setupUI()
getUser()
getPosts()

function getCurrentUserId()
{
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}

function getUser()
{
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    .then((response) => {
        const user = response.data.data
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("main-info-image").src = Object.keys(user.profile_image) != 0? user.profile_image : "./profile-pics/user-gender-neutral-head-icon.png"
        document.getElementById("name-posts").innerHTML = `${user.username}'s`
        // posts & comments count
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count

    })
}

function getPosts()
{
    const id = getCurrentUserId()   
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
        const posts = response.data.data
        document.getElementById("post-parent").innerHTML = ""
        for(post of posts)
        {           
            const author = post.author
            let postTitle = ""
            // show or hide (edit) button
            let user = getCurrentUser()
            let isMyPost = user != null && post.author.id == user.id
            let editBtnContent = ``
            if(isMyPost){
                editBtnContent = 
                `
                    <button class='btn btn-danger' style='margin-left: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>

                    <button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                `
            }

            if(post.title != null)
            {
                postTitle = post.title
            }
            let authorImg = Object.keys(author.profile_image) != 0? author.profile_image : "./profile-pics/user-gender-neutral-head-icon.png"
            let postImg = Object.keys(post.image) != 0? post.image : "./posts-pics/cat-02.jpg"

            let content = `
                <div class="card shadow">
                    <div class="card-header">
                        <img class="rounded-circle border border-2" src="${authorImg}" alt="" style="width: 40px; height: 40px">
                        <b>${author.username}</b>
                        ${editBtnContent}                       
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                        <img class="w-100" src="${postImg}" alt="">

                        <h6 style="color: rgb(193, 193, 193);" class="mt-1">
                            ${post.created_at}
                        </h6>
                        <h5>
                            ${postTitle}
                        </h5>
                        <p>
                            ${post.body}
                        </p>
                        <hr>
                        <div>
                            <i class="bi bi-pen"></i>
                            <span>
                                (${post.comments_count}) Comments
                                <span id="post-tags-${post.id}">
                                </span>
                            </span>                           
                        </div>
                    </div>
                </div>
            `

            document.getElementById("post-parent").innerHTML += content
            const currentPostTagsId = `post-tags-${post.id}`
            document.getElementById(currentPostTagsId).innerHTML = ""
            for(tag of post.tags)
            {
                console.log(tag.name)
                let tagsContent = 
                `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                            ${tag.name}
                    </button>
                `
                document.getElementById(currentPostTagsId).innerHTML += tagsContent
            }
        }
    })

}