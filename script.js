// ===============================
// THARAFLOW PROJECT MANAGEMENT
// ===============================

// ---------- STORAGE ----------

let users = JSON.parse(localStorage.getItem("users")) || [];

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let projects = JSON.parse(localStorage.getItem("projects")) || [];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let team = JSON.parse(localStorage.getItem("team")) || [];

let comments = JSON.parse(localStorage.getItem("comments")) || [];

// ---------- SAVE ----------

function saveData(){

localStorage.setItem("users",JSON.stringify(users));

localStorage.setItem("currentUser",JSON.stringify(currentUser));

localStorage.setItem("projects",JSON.stringify(projects));

localStorage.setItem("tasks",JSON.stringify(tasks));

localStorage.setItem("team",JSON.stringify(team));

localStorage.setItem("comments",JSON.stringify(comments));

}

// ---------- LOGIN PAGE ----------

const loginPage=document.getElementById("loginPage");

const app=document.getElementById("app");

const loginTab=document.getElementById("loginTab");

const signupTab=document.getElementById("signupTab");

const loginForm=document.getElementById("loginForm");

const signupForm=document.getElementById("signupForm");

// ---------- TAB SWITCH ----------

loginTab.onclick=()=>{

loginTab.classList.add("active");

signupTab.classList.remove("active");

loginForm.style.display="flex";

signupForm.style.display="none";

}

signupTab.onclick=()=>{

signupTab.classList.add("active");

loginTab.classList.remove("active");

signupForm.style.display="flex";

loginForm.style.display="none";

}

// ---------- SIGNUP ----------

document.getElementById("signupBtn").onclick=function(){

const username=document.getElementById("signupUsername").value.trim();

const password=document.getElementById("signupPassword").value.trim();

if(username===""||password===""){

alert("Fill all fields");

return;

}

const exists=users.find(u=>u.username===username);

if(exists){

alert("Username already exists");

return;

}

users.push({

username,

password,

profile:""

});

saveData();

alert("Account created successfully.");

loginTab.click();

}

// ---------- LOGIN ----------

document.getElementById("loginBtn").onclick=function(){

const username=document.getElementById("loginUsername").value.trim();

const password=document.getElementById("loginPassword").value.trim();

const user=users.find(u=>u.username===username && u.password===password);

if(!user){

alert("Invalid Username or Password");

return;

}

currentUser=user;

saveData();

openApp();

}

// ---------- OPEN APP ----------

function openApp(){

loginPage.style.display="none";

app.style.display="flex";

document.getElementById("profileName").textContent=currentUser.username;

document.getElementById("displayName").value=currentUser.username;

renderProjects();

renderTasks();

renderMembers();

updateDashboard();

}

// ---------- AUTO LOGIN ----------

if(currentUser){

openApp();

}
// ===============================
// SIDEBAR NAVIGATION
// ===============================

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        pages.forEach(page => page.classList.remove("active-page"));

        const page = document.getElementById(item.dataset.page);

        if(page){
            page.classList.add("active-page");
        }

        pageTitle.textContent = item.textContent.trim();

    });

});

// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutBtn").addEventListener("click",()=>{

if(confirm("Do you really want to logout?")){

localStorage.removeItem("currentUser");

location.reload();

}

});

// ===============================
// PROFILE IMAGE
// ===============================

const upload=document.getElementById("profileUpload");

upload.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(e){

document.getElementById("profileImage").src=e.target.result;

document.getElementById("settingsProfileImage").src=e.target.result;

currentUser.profile=e.target.result;

const index=users.findIndex(
u=>u.username===currentUser.username
);

users[index]=currentUser;

saveData();

}

reader.readAsDataURL(file);

});

// Load Saved Image

if(currentUser && currentUser.profile){

document.getElementById("profileImage").src=currentUser.profile;

document.getElementById("settingsProfileImage").src=currentUser.profile;

}

// ===============================
// SAVE PROFILE NAME
// ===============================

document.getElementById("saveProfile").addEventListener("click",()=>{

const newName=document.getElementById("displayName").value.trim();

if(newName===""){

alert("Name cannot be empty");

return;

}

currentUser.username=newName;

document.getElementById("profileName").textContent=newName;

const index=users.findIndex(
u=>u.username===currentUser.username
);

if(index!==-1){

users[index]=currentUser;

}

saveData();

alert("Profile Updated Successfully.");

});

// ===============================
// DARK MODE
// ===============================

const darkBtn=document.getElementById("darkModeBtn");

darkBtn.onclick=function(){

document.body.classList.toggle("dark-mode");

}

// ===============================
// TOAST
// ===============================

function showToast(message){

const toast=document.getElementById("toast");

document.getElementById("toastText").textContent=message;

toast.style.display="flex";

setTimeout(()=>{

toast.style.display="none";

},2500);

}
// ===============================
// PROJECT MANAGEMENT
// ===============================

const projectModal = document.getElementById("projectModal");
const saveProjectBtn = document.getElementById("saveProject");
const projectBoard = document.getElementById("projectBoard");
const recentProjects = document.getElementById("recentProjects");

// ---------- OPEN PROJECT MODAL ----------

document.getElementById("newProjectBtn").onclick = () => {
    projectModal.style.display = "flex";
};

document.getElementById("addProjectPage").onclick = () => {
    projectModal.style.display = "flex";
};

document.getElementById("closeProject").onclick = () => {
    projectModal.style.display = "none";
};

// ---------- SAVE PROJECT ----------

saveProjectBtn.onclick = function () {

    const name = document.getElementById("projectName").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const deadline = document.getElementById("projectDeadline").value;
    const priority = document.getElementById("projectPriority").value;

    if (name === "") {
        alert("Project name is required.");
        return;
    }

    const project = {

        id: Date.now(),

        name,

        description,

        deadline,

        priority,

        createdBy: currentUser.username

    };

    projects.push(project);

    saveData();

    renderProjects();

    updateDashboard();

    projectModal.style.display = "none";

    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("projectDeadline").value = "";

    showToast("Project Created Successfully");

};

// ---------- RENDER PROJECTS ----------

function renderProjects() {

    projectBoard.innerHTML = "";

    recentProjects.innerHTML = "";

    projects.forEach(project => {

        const card = document.createElement("div");

        card.className = "project-card";

        card.innerHTML = `

            <h3>${project.name}</h3>

            <p>${project.description}</p>

            <p><b>Deadline:</b> ${project.deadline || "Not Set"}</p>

            <span class="status ${project.priority.toLowerCase()}">

                ${project.priority}

            </span>

            <br><br>

            <button onclick="deleteProject(${project.id})">

                Delete

            </button>

        `;

        projectBoard.appendChild(card);

        recentProjects.appendChild(card.cloneNode(true));

    });

}

// ---------- DELETE PROJECT ----------

function deleteProject(id){

if(!confirm("Delete this project?")) return;

projects = projects.filter(project => project.id !== id);

saveData();

renderProjects();

updateDashboard();

showToast("Project Deleted");

}

// ---------- SEARCH PROJECT ----------

document.getElementById("searchInput").addEventListener("keyup", function(){

const value = this.value.toLowerCase();

const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {

const text = card.innerText.toLowerCase();

card.style.display = text.includes(value) ? "block" : "none";

});

});

// ---------- DASHBOARD COUNTERS ----------

function updateDashboard(){

document.getElementById("totalProjects").textContent = projects.length;

document.getElementById("analyticsProjects").textContent = projects.length;

document.getElementById("analyticsTasks").textContent = tasks.length;

const completed = tasks.filter(t => t.status === "Completed").length;

const pending = tasks.filter(t => t.status === "Pending").length;

document.getElementById("completedTasks").textContent = completed;

document.getElementById("pendingTasks").textContent = pending;

document.getElementById("analyticsCompleted").textContent = completed;

document.getElementById("analyticsPending").textContent = pending;

document.getElementById("teamCount").textContent = team.length;

}

// ---------- INITIAL LOAD ----------

renderProjects();

updateDashboard();
// ===============================
// TEAM MANAGEMENT
// ===============================

const memberModal = document.getElementById("memberModal");
const teamBoard = document.getElementById("teamBoard");

document.getElementById("newMemberBtn").onclick = () => {
    memberModal.style.display = "flex";
};

document.getElementById("addMemberPage").onclick = () => {
    memberModal.style.display = "flex";
};

document.getElementById("closeMember").onclick = () => {
    memberModal.style.display = "none";
};

document.getElementById("saveMember").onclick = function () {

    const name = document.getElementById("memberName").value.trim();
    const email = document.getElementById("memberEmail").value.trim();

    if (name === "" || email === "") {
        alert("Please fill all fields");
        return;
    }

    const member = {
        id: Date.now(),
        name,
        email
    };

    team.push(member);

    saveData();

    renderMembers();

    updateDashboard();

    memberModal.style.display = "none";

    document.getElementById("memberName").value = "";
    document.getElementById("memberEmail").value = "";

    showToast("Team Member Added");
};

function renderMembers() {

    teamBoard.innerHTML = "";

    const memberSelect = document.getElementById("taskMember");

    memberSelect.innerHTML = `<option value="">Assign Member</option>`;

    team.forEach(member => {

        memberBoard = document.createElement("div");

        memberBoard.className = "member-card";

        memberBoard.innerHTML = `

            <h3>${member.name}</h3>

            <p>${member.email}</p>

            <button onclick="deleteMember(${member.id})">

                Remove

            </button>

        `;

        teamBoard.appendChild(memberBoard);

        memberSelect.innerHTML += `
            <option>${member.name}</option>
        `;

    });

}

function deleteMember(id){

team = team.filter(member => member.id !== id);

saveData();

renderMembers();

updateDashboard();

showToast("Member Removed");

}

// ===============================
// TASK MANAGEMENT
// ===============================

const taskModal = document.getElementById("taskModal");

const taskBoard = document.getElementById("taskBoard");

document.getElementById("newTaskBtn").onclick = () => {

taskModal.style.display = "flex";

loadProjects();

};

document.getElementById("addTaskPage").onclick = () => {

taskModal.style.display = "flex";

loadProjects();

};

document.getElementById("closeTask").onclick = () => {

taskModal.style.display = "none";

};

function loadProjects(){

const select = document.getElementById("taskProject");

select.innerHTML = `<option value="">Select Project</option>`;

projects.forEach(project=>{

select.innerHTML += `

<option>

${project.name}

</option>

`;

});

}

document.getElementById("saveTask").onclick = function(){

const title = document.getElementById("taskTitle").value.trim();

const description = document.getElementById("taskDescription").value.trim();

const project = document.getElementById("taskProject").value;

const member = document.getElementById("taskMember").value;

const deadline = document.getElementById("taskDeadline").value;

const status = document.getElementById("taskStatus").value;

if(title===""){

alert("Task title required");

return;

}

tasks.push({

id:Date.now(),

title,

description,

project,

member,

deadline,

status

});

saveData();

renderTasks();

updateDashboard();

taskModal.style.display="none";

showToast("Task Created");

};

function renderTasks(){

taskBoard.innerHTML="";

tasks.forEach(task=>{

const card=document.createElement("div");

card.className="task-card";

card.innerHTML=`

<h3>${task.title}</h3>

<p>${task.description}</p>

<p><b>Project:</b> ${task.project}</p>

<p><b>Assigned:</b> ${task.member}</p>

<p><b>Status:</b> ${task.status}</p>

<p><b>Deadline:</b> ${task.deadline}</p>

<button onclick="openComments(${task.id})">

Comments

</button>

<button onclick="deleteTask(${task.id})">

Delete

</button>

`;

taskBoard.appendChild(card);

});

}

function deleteTask(id){

tasks = tasks.filter(task=>task.id!==id);

saveData();

renderTasks();

updateDashboard();

showToast("Task Deleted");

}

// ===============================
// COMMENTS
// ===============================

let selectedTask = null;

function openComments(id){

selectedTask = id;

document.getElementById("commentModal").style.display="flex";

renderComments();

}

document.getElementById("closeComment").onclick=function(){

document.getElementById("commentModal").style.display="none";

}

document.getElementById("addComment").onclick=function(){

const text=document.getElementById("newComment").value.trim();

if(text==="") return;

comments.push({

task:selectedTask,

user:currentUser.username,

text

});

saveData();

document.getElementById("newComment").value="";

renderComments();

};

function renderComments(){

const list=document.getElementById("commentList");

list.innerHTML="";

comments
.filter(c=>c.task===selectedTask)
.forEach(comment=>{

list.innerHTML += `

<div class="comment">

<b>${comment.user}</b>

<p>${comment.text}</p>

<hr>

</div>

`;

});

}

renderMembers();

renderTasks();