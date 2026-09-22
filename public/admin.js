const API = "http://localhost:5000/api";
let token = localStorage.getItem("adminToken");
let data = null;

const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function authHeaders(){return {"Content-Type":"application/json","Authorization":`Bearer ${token}`}}

async function api(path, options={}){
    const response = await fetch(API + path, {...options, headers:{...authHeaders(), ...(options.headers||{})}});
    if(response.status===401){logout();throw new Error("Session expired");}
    const result = await response.json();
    if(!response.ok) throw new Error(result.message || "Request failed");
    return result;
}

$("loginForm").addEventListener("submit", async e=>{
    e.preventDefault();
    $("loginError").textContent="";
    try{
        const result=await fetch(API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("loginEmail").value,password:$("loginPassword").value})}).then(r=>r.json());
        if(!result.token) throw new Error(result.message||"Invalid credentials");
        token=result.token;localStorage.setItem("adminToken",token);showDashboard();await loadData();
    }catch(err){$("loginError").textContent=err.message}
});

$("logoutBtn").addEventListener("click",logout);
function logout(){localStorage.removeItem("adminToken");token=null;$("dashboardView").classList.add("hidden");$("loginView").classList.remove("hidden")}
function showDashboard(){$("loginView").classList.add("hidden");$("dashboardView").classList.remove("hidden")}

document.querySelectorAll(".nav-item").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
        document.querySelectorAll(".admin-section").forEach(x=>x.classList.remove("active-section"));
        btn.classList.add("active");$(btn.dataset.section).classList.add("active-section");
        $("pageTitle").textContent=btn.querySelector("span").textContent;
    });
});

async function loadData(){
    data=await api("/portfolio");
    renderAll();
}

function renderAll(){
    $("projectCount").textContent=data.projects?.length||0;
    $("educationCount").textContent=data.education?.length||0;
    $("experienceCount").textContent=data.experience?.length||0;
    $("skillCount").textContent=(data.skills?.technical?.length||0)+(data.skills?.web?.length||0)+(data.skills?.other?.length||0);
    renderProfile();renderContact();renderSkills();renderArray("education","educationList",educationTemplate);renderArray("experience","experienceList",experienceTemplate);renderArray("projects","projectsList",projectTemplate);renderArray("futureProjects","futureList",futureTemplate);
}

function renderProfile(){
    $("profileForm").innerHTML=`
    <label>Full name<input id="pName" value="${escapeHtml(data.profile.name)}"></label>
    <label>Headline<input id="pHeadline" value="${escapeHtml(data.profile.headline)}"></label>
    <label class="full">Bio<textarea id="pBio">${escapeHtml(data.profile.bio)}</textarea></label>
    <label class="full">About text<textarea id="pAbout">${escapeHtml(data.profile.about)}</textarea></label>
    <div class="save-row full"><button class="save-btn" onclick="saveProfile()">Save profile</button></div>`;
}
async function saveProfile(){data.profile={...data.profile,name:$("pName").value,headline:$("pHeadline").value,bio:$("pBio").value,about:$("pAbout").value};await save();}

function renderContact(){
    $("contactForm").innerHTML=`
    <label>Email<input id="cEmail" value="${escapeHtml(data.contact.email)}"></label>
    <label>GitHub<input id="cGithub" value="${escapeHtml(data.contact.github)}"></label>
    <label>LinkedIn<input id="cLinkedin" value="${escapeHtml(data.contact.linkedin)}"></label>
    <label>Resume path / URL<input id="cResume" value="${escapeHtml(data.contact.resume)}"></label>
    <div class="save-row full"><button class="save-btn" onclick="saveContact()">Save contact</button></div>`;
}
async function saveContact(){data.contact={email:$("cEmail").value,github:$("cGithub").value,linkedin:$("cLinkedin").value,resume:$("cResume").value};await save();}

function renderSkills(){
    $("skillsForm").innerHTML=`
    ${skillField("technical","Technical / Backend",data.skills.technical)}
    ${skillField("web","Web / Frontend",data.skills.web)}
    ${skillField("other","Professional / Other",data.skills.other)}
    <div class="save-row full"><button class="save-btn" onclick="saveSkills()">Save skills</button></div>`;
}
function skillField(id,label,items){return `<label class="full">${label}<textarea id="s_${id}">${escapeHtml(items.join(", "))}</textarea></label>`}
async function saveSkills(){["technical","web","other"].forEach(k=>data.skills[k]=$("s_"+k).value.split(",").map(x=>x.trim()).filter(Boolean));await save();}

function renderArray(key,container,template){$(container).innerHTML=data[key].map((item,i)=>template(item,i)).join("")||"<p>No items yet.</p>"}
function educationTemplate(x,i){return `<div class="edit-card"><div class="edit-card-head"><strong>Education ${i+1}</strong><button class="delete-btn" onclick="removeItem('education',${i})">Delete</button></div><div class="form-grid"><label>Qualification<input id="education_${i}_title" value="${escapeHtml(x.title)}"></label><label>Institution<input id="education_${i}_institution" value="${escapeHtml(x.institution)}"></label><label>Period<input id="education_${i}_period" value="${escapeHtml(x.period)}"></label><label>Link<input id="education_${i}_link" value="${escapeHtml(x.link||"")}"></label></div><div class="save-row"><button class="save-btn" onclick="saveItem('education',${i})">Save</button></div></div>`}
function experienceTemplate(x,i){return `<div class="edit-card"><div class="edit-card-head"><strong>Experience ${i+1}</strong><button class="delete-btn" onclick="removeItem('experience',${i})">Delete</button></div><div class="form-grid"><label>Role<input id="experience_${i}_role" value="${escapeHtml(x.role)}"></label><label>Company<input id="experience_${i}_company" value="${escapeHtml(x.company)}"></label><label>Period<input id="experience_${i}_period" value="${escapeHtml(x.period)}"></label><label>Location<input id="experience_${i}_location" value="${escapeHtml(x.location||"")}"></label><label class="full">Description<textarea id="experience_${i}_description">${escapeHtml(x.description)}</textarea></label></div><div class="save-row"><button class="save-btn" onclick="saveItem('experience',${i})">Save</button></div></div>`}
function projectTemplate(x,i){return `<div class="edit-card"><div class="edit-card-head"><strong>Project ${i+1}</strong><button class="delete-btn" onclick="removeItem('projects',${i})">Delete</button></div><div class="form-grid"><label>Title<input id="projects_${i}_title" value="${escapeHtml(x.title)}"></label><label>Category<input id="projects_${i}_category" value="${escapeHtml(x.category)}"></label><label>Image path<input id="projects_${i}_image" value="${escapeHtml(x.image||"")}"></label><label>GitHub URL<input id="projects_${i}_github" value="${escapeHtml(x.github||"")}"></label><label class="full">Description<textarea id="projects_${i}_description">${escapeHtml(x.description)}</textarea></label><label class="full">Technologies (comma separated)<input id="projects_${i}_technologies" value="${escapeHtml((x.technologies||[]).join(", "))}"></label><label class="full">Key features (one per line)<textarea id="projects_${i}_features">${escapeHtml((x.features||[]).join("\n"))}</textarea></label></div><div class="save-row"><button class="save-btn" onclick="saveItem('projects',${i})">Save</button></div></div>`}
function futureTemplate(x,i){return `<div class="edit-card"><div class="edit-card-head"><strong>Future project ${i+1}</strong><button class="delete-btn" onclick="removeItem('futureProjects',${i})">Delete</button></div><div class="form-grid"><label>Title<input id="futureProjects_${i}_title" value="${escapeHtml(x.title)}"></label><label>Status<input id="futureProjects_${i}_status" value="${escapeHtml(x.status)}"></label><label class="full">Description<textarea id="futureProjects_${i}_description">${escapeHtml(x.description)}</textarea></label></div><div class="save-row"><button class="save-btn" onclick="saveItem('futureProjects',${i})">Save</button></div></div>`}

async function saveItem(key,i){
    const x=data[key][i];
    if(key==="education"){x.title=$(`${key}_${i}_title`).value;x.institution=$(`${key}_${i}_institution`).value;x.period=$(`${key}_${i}_period`).value;x.link=$(`${key}_${i}_link`).value}
    if(key==="experience"){x.role=$(`${key}_${i}_role`).value;x.company=$(`${key}_${i}_company`).value;x.period=$(`${key}_${i}_period`).value;x.location=$(`${key}_${i}_location`).value;x.description=$(`${key}_${i}_description`).value}
    if(key==="projects"){x.title=$(`${key}_${i}_title`).value;x.category=$(`${key}_${i}_category`).value;x.image=$(`${key}_${i}_image`).value;x.github=$(`${key}_${i}_github`).value;x.description=$(`${key}_${i}_description`).value;x.technologies=$(`${key}_${i}_technologies`).value.split(",").map(v=>v.trim()).filter(Boolean);x.features=$(`${key}_${i}_features`).value.split("\n").map(v=>v.trim()).filter(Boolean)}
    if(key==="futureProjects"){x.title=$(`${key}_${i}_title`).value;x.status=$(`${key}_${i}_status`).value;x.description=$(`${key}_${i}_description`).value}
    await save();
}
async function removeItem(key,i){if(confirm("Delete this item?")){data[key].splice(i,1);await save();}}
function addItem(key){
    const defaults={education:{title:"New qualification",institution:"Institution",period:"Current",link:""},experience:{role:"New role",company:"Company",period:"Current",location:"",description:"Description"},projects:{title:"New project",category:"Web Development",image:"",github:"",description:"Project description",technologies:[],features:[]},futureProjects:{title:"New future project",status:"Planned",description:"Project idea"}};
    data[key].push({...defaults[key]});renderAll();
}
async function save(){
    try{await api("/portfolio",{method:"PUT",body:JSON.stringify(data)});toast("Saved successfully ✓");renderAll()}catch(e){toast(e.message)}
}

if(token){showDashboard();loadData().catch(()=>logout())}
