const baseUrl = "https://tarmeezacademy.com/api/v1";
setupUI();
function loginBtnClicked(){
    const password = document.getElementById("pass").value;
    const userName = document.getElementById("user-name").value;
    const params = {
        "username" : userName,
        "password" : password
    };
    toggleLoader(true);
    axios.post(`${baseUrl}/login`, params)
    .then((response)=>{
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        closeModal("login-modal");
        showAlert("Logged in successfully", "success");
        setupUI();
    }).catch((error)=>{
        const errorMsg = error.response.data.message;
        showAlert(errorMsg , 'danger');
    }).finally(()=>{
        toggleLoader(false);
    });
}
function registerBtnClicked(){
    const registerPassword = document.getElementById("register-pass").value;
    const registerUserName = document.getElementById("register-user-name").value;
    const registerName = document.getElementById("register-name").value;
    const registerProfileImage = document.getElementById("register-profile-image").files[0];
    const params={
        "username" : registerUserName,
        "password" : registerPassword,
        "name"     : registerName,
    };
    let formData = new FormData();
    formData.append("username" , registerUserName);
    formData.append("name" , registerName);
    formData.append("password" , registerPassword);
    formData.append("image" , registerProfileImage);
    const headers = {
        "Content-Type" : "multipart/form-data",
    };
    const url = `${baseUrl}/register`;
    toggleLoader(true);
    axios.post(url, formData,{
        headers:headers
    })
    .then((response)=>{
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        closeModal("register-modal");
        showAlert("You have registered successfully", "success");
        setupUI();
    }).catch((error)=>{
        const message = error.response.data.message;
        showAlert(message,'danger');
    }).finally(()=>{
        toggleLoader(false);
    });
}
function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Logged out successfully");
    setupUI();
}
function profileClicked()
{
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}
function setupUI(){
    const token = localStorage.getItem("token");
    const loginDiv = document.getElementById("login-div");
    const logoutDiv = document.getElementById("logout-div");
    const publishBtn = document.getElementById("add-btn");

    if(token == null) // user is guest (not logged in)
    {  
        loginDiv.style.setProperty("display", "block", "important");
        logoutDiv.style.setProperty("display", "none", "important");
        publishBtn.style.setProperty("display", "none", "important");
    }else { // for logged in user
        loginDiv.style.setProperty("display", "none", "important");
        logoutDiv.style.setProperty("display", "block", "important");
        publishBtn.style.setProperty("display", "block", "important");
        const user = getCurrentUser();
        document.getElementById("nav-username").innerHTML = user.username;
        let userImg = user.profile_image[0] ;
        if(userImg != null)
        {
            document.getElementById("profile-img").src =  user.profile_image;
        }
    }
}
function showAlert(customMessage, type="success"){
    const alertPlaceholder = document.getElementById('success-alert-div')
    const wrapper = document.createElement('div');
    wrapper.setAttribute("id" , "success-alert");
    const alert = (message, type) => {
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    };

    alert(customMessage, type);

    // todo: hide the alert
    setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert');
        alertToHide.close();
    }, 2000);
}
function publishBtnClicked(){
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-content-input").value;
    const image = document.getElementById("post-image-input").files[0];
    const token = localStorage.getItem("token");
    let formData = new FormData();
    let url = '';
    if(isCreate)
    {
        url = `${baseUrl}/posts`;
    }else {
        formData.append("_method", "put");
        url = `${baseUrl}/posts/${postId}`;
    }
    formData.append("title" , title);
    formData.append("body" , body);
    formData.append("image" , image);
    const headers = {
        "Content-Type" : "multipart/form-data",
        "authorization"  : `Bearer ${token}`
    };
    toggleLoader(true);
    axios.post(url, formData,{
        headers:headers
    }).then((response)=>{
        showAlert("Post has been published" , "success");
        closeModal("create-post-modal");
        getPosts();
    })
    .catch((error)=>{
        const message = error.response.data.message;
        showAlert(message , "danger");
    }).finally(()=>{
        toggleLoader(false);
    });
}
function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject));
    //console.log(`${post.image}`);
    document.getElementById("post-modal-submit-btn").innerHTML = "Update";
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-content-input").value = post.body;
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
    postModal.toggle();
}
function deletePostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject));
    console.log(post)
    document.getElementById("delete-post-id-input").value = post.id;
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {});
    postModal.toggle();
}
function confirmPostDelete() {
    const token = localStorage.getItem("token")
    const postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    toggleLoader(true);
    axios.delete(url, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        getPosts()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=>{
        toggleLoader(false);
    });
}

function closeModal(id){
    const modal = document.getElementById(id);
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}
function getCurrentUser(){
    let userInfo = null;
    const storageUser = localStorage.getItem("user");
    if(storageUser != null){
        userInfo = JSON.parse(storageUser);
    }
    return userInfo;
}
function addBtnClicked()
{        
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-content-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}