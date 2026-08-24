const imgs=[
"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80"
];

const data=[
["Premium villa plot","Thirunindravur, Chennai","1092 sq.ft • Plot","₹3,000","/ sq.ft","images/property-sample.jpg","Buy"],
["3 BHK Villa","Thirumalisai, Chennai","3 BHK • 1800 sq.ft • Villa","₹45,000","/ month",imgs[1],"Rent"],
["Independent House","Thiruvallur, Tamil Nadu","2 BHK • 1200 sq.ft • House","₹28,000","/ month",imgs[2],"Buy"],
["Commercial Space","Thamaraipakkam, Tamil Nadu","Commercial • 2400 sq.ft • Building","₹50,000","/ month",imgs[3],"Commercial"]
];

let currentMode="Buy";

function card(p,i){
 return `<article class="card" onclick="showDetail(${i})">
 <div class="pic" style="background-image:url('${p[5]}')">
 <span class="verified">✓ Verified</span>
 <button class="heart" onclick="event.stopPropagation();this.textContent=this.textContent==='♡'?'♥':'♡'">♡</button>
 </div>
 <div class="body"><h3>${p[0]}</h3><div class="loc">${p[1]}</div><div class="meta">${p[2]}</div><div class="price">${p[3]} <small>${p[4]}</small></div></div>
 </article>`;
}

function render(list=data){
 document.getElementById("cards").innerHTML=list.map(card).join("");
 document.getElementById("similar").innerHTML=data.filter((_,i)=>i!==1).map(card).join("");
}
render();

document.querySelectorAll(".tabs .tab").forEach(tab=>{
 tab.addEventListener("click",()=>{
   document.querySelectorAll(".tabs .tab").forEach(t=>t.classList.remove("active"));
   tab.classList.add("active");
   currentMode=tab.dataset.mode;
   filterProperties();
 });
});

document.querySelectorAll("[data-mode-link]").forEach(link=>{
 link.addEventListener("click",()=>{
   currentMode=link.dataset.modeLink;
   document.querySelectorAll(".tabs .tab").forEach(t=>t.classList.toggle("active",t.dataset.mode===currentMode));
   filterProperties();
 });
});

document.querySelectorAll("[data-location]").forEach(link=>{
 link.addEventListener("click",()=>{
   document.getElementById("location").value=link.dataset.location;
   document.getElementById("properties").scrollIntoView({behavior:"smooth"});
   filterProperties();
 });
});

function filterProperties(){
 const loc=document.getElementById("location").value.trim().toLowerCase();
 let results=data.filter(p=>{
   const modeOK=currentMode==="Buy" ? (p[6]==="Buy" || p[6]==="Rent") : p[6]===currentMode;
   const locOK=!loc || p[1].toLowerCase().includes(loc);
   return modeOK && locOK;
 });
 if(!results.length){
   document.getElementById("cards").innerHTML="<p style='grid-column:1/-1;text-align:center;padding:45px;color:#66736d'>😔 No properties found.<br>Try changing your mode or location.</p>";
 }else{
   document.getElementById("cards").innerHTML=results.map((p)=>card(p,data.indexOf(p))).join("");
 }
}

document.getElementById("searchForm").addEventListener("submit",e=>{
 e.preventDefault();
 filterProperties();
 document.getElementById("properties").scrollIntoView({behavior:"smooth"});
});

function showDetail(index=1){
 const p=data[index] || data[1];
 document.querySelector(".home").classList.add("hidden");
 document.querySelector(".detail").classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
 document.getElementById("mainphoto").style.backgroundImage=`url('${p[5]}')`;
 document.getElementById("thumbs").innerHTML=imgs.map((x,i)=>`<div class="thumb ${x===p[5]?'active':''}" style="background-image:url('${x}')" onclick="mainPhoto('${x}',this)"></div>`).join("");
}
function mainPhoto(url,el){
 document.getElementById("mainphoto").style.backgroundImage=`url('${url}')`;
 document.querySelectorAll(".thumb").forEach(x=>x.classList.remove("active"));
 el.classList.add("active");
}
function showHome(){
 document.querySelector(".home").classList.remove("hidden");
 document.querySelector(".detail").classList.remove("active");
 window.scrollTo({top:0,behavior:"smooth"});
}

function openModal(){document.getElementById("modal").classList.add("open")}
function closeModal(){document.getElementById("modal").classList.remove("open")}
document.getElementById("post").onclick=openModal;
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.getElementById("login").onclick=()=>alert("Demo login — connect this to your authentication system.");

document.querySelectorAll(".tab").forEach(t=>t.addEventListener("keydown",e=>{
 if(e.key==="Enter"||e.key===" "){e.preventDefault();t.click();}
}));

/* Multiple property image upload + previews */
let selectedImages=[];
const imageInput=document.getElementById("propertyImages");
const previewGrid=document.getElementById("imagePreviewGrid");

imageInput.addEventListener("change",e=>{
 const files=[...e.target.files].filter(f=>f.type.startsWith("image/"));
 selectedImages=[...selectedImages,...files];
 renderImagePreviews();
 imageInput.value="";
});

function renderImagePreviews(){
 previewGrid.innerHTML="";
 selectedImages.forEach((file,index)=>{
   const reader=new FileReader();
   reader.onload=ev=>{
     const item=document.createElement("div");
     item.className="image-preview";
     item.innerHTML=`<img src="${ev.target.result}" alt="Property image ${index+1}">
       ${index===0?'<span class="primary-badge">Main photo</span>':''}
       <button type="button" class="remove-image" aria-label="Remove image">×</button>`;
     item.querySelector(".remove-image").onclick=()=>{
       selectedImages.splice(index,1);
       renderImagePreviews();
     };
     previewGrid.appendChild(item);
   };
   reader.readAsDataURL(file);
 });
}

document.getElementById("postPropertyForm").addEventListener("submit",async e=>{
 e.preventDefault();

 if(selectedImages.length===0){
   alert("Please add at least one property image.");
   return;
 }

 const form=e.target;
 const sheetUrl=document.getElementById("googleSheetUrl")?.value.trim() || localStorage.getItem(sheetUrlKey) || "";
 if(sheetUrl) setSheetUrl(sheetUrl);

 const mainImage = await readFileAsDataURL(selectedImages[0]);
 const property={
   submittedAt:new Date().toLocaleString("en-IN"),
   name:form.elements.name.value.trim(),
   phone:form.elements.phone.value.trim(),
   title:form.elements.title.value.trim(),
   mode:form.elements.mode.value,
   type:form.elements.type.value,
   price:form.elements.price.value.trim(),
   area:form.elements.area.value.trim(),
   location:form.elements.location.value,
   description:form.elements.description.value.trim(),
   imageCount:selectedImages.length,
   image:mainImage
 };

 /* Add instantly to the visible featured property list. */
 const suffix = property.mode==="Rent" ? "/ month" : (property.type==="Plot" ? "/ sq.ft" : "");
 const meta = [property.area ? property.area+" sq.ft" : "", property.type].filter(Boolean).join(" • ");
 data.unshift([property.title, property.location+(property.location.includes("Chennai")?"":", Chennai"), meta, property.price, suffix, mainImage, property.mode || "Buy"]);
 render(data);
 filterProperties();

 submissions.push(property);
 try{
   localStorage.setItem(submissionKey,JSON.stringify(submissions));
 }catch(storageErr){
   console.warn("Local storage full. Property is still visible in this session.", storageErr);
 }

 let synced=false;
 if(sheetUrl) synced=await pushPropertyToGoogleSheet({...property,image:""});

 selectedImages=[];
 renderImagePreviews();
 form.reset();
 closeModal();
 document.getElementById("properties").scrollIntoView({behavior:"smooth"});

 if(sheetUrl && synced){
   alert("Property added successfully to the featured list and saved to Google Sheet.");
 }else if(sheetUrl){
   alert("Property added to the featured list and saved locally, but Google Sheet sync failed. Check the Web App URL.");
 }else{
   alert("Property added successfully to the featured list.");
 }
});

function readFileAsDataURL(file){
 return new Promise((resolve,reject)=>{
   const reader=new FileReader();
   reader.onload=()=>resolve(reader.result);
   reader.onerror=reject;
   reader.readAsDataURL(file);
 });
}


/* Property data: local fallback + optional Google Apps Script live sync */
const CONFIGURED_SHEET_URL = "https://script.google.com/macros/s/AKfycbyDyV101tSACxLyzVGLEyVg8XnntuVe4Hm4Y7ws55ZIRqN5EKmniFYLy_Lf4tE3-lV1/exec";
const submissionKey = "ungaPropertySubmissions";
const sheetUrlKey = "ungaPropertySheetUrl";
let submissions = JSON.parse(localStorage.getItem(submissionKey) || "[]");
/* Restore locally posted properties into the featured list on page reload. */
if(Array.isArray(submissions) && submissions.length){
  const restored=submissions.slice().reverse().map((p)=>[
    p.title || "Property",
    (p.location || "") + ((p.location && !String(p.location).includes("Chennai")) ? ", Chennai" : ""),
    [p.area ? p.area+" sq.ft" : "", p.type || ""].filter(Boolean).join(" • "),
    p.price || "",
    p.mode==="Rent" ? "/ month" : (p.type==="Plot" ? "/ sq.ft" : ""),
    p.image || imgs[0],
    p.mode || "Buy"
  ]);
  data.unshift(...restored);
  render(data);
}

function getSheetUrl(){
  return (document.getElementById("googleSheetUrl")?.value || localStorage.getItem(sheetUrlKey) || CONFIGURED_SHEET_URL || "").trim();
}
function setSheetUrl(url){
  if(url) localStorage.setItem(sheetUrlKey,url);
}

function escapeCSV(value){
  const text = String(value ?? "");
  return '"' + text.replace(/"/g, '""') + '"';
}

function downloadPropertySpreadsheet(){
  if(!submissions.length){
    alert("No property submissions yet.");
    return;
  }
  const headers=["Submitted At","Name","Phone","Property Title","Listing Type","Property Type","Price / Rent","Area","Location","Description","Number of Images"];
  const rows=submissions.map(item=>[
    item.submittedAt,item.name,item.phone,item.title,item.mode,item.type,
    item.price,item.area || "",item.location,item.description,item.imageCount
  ]);
  const csv="\uFEFF"+[headers,...rows].map(row=>row.map(escapeCSV).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="unga-property-submissions.csv";
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}

async function syncFromGoogleSheet(){
  const url=getSheetUrl();
  const status=document.getElementById("sheetStatus");
  if(!url){
    status.textContent="No Google Sheet connection configured";
    alert("Add your Google Apps Script Web App URL in Post Property → Live Google Sheet connection.");
    return;
  }

  status.textContent="Syncing…";
  try{
    const response=await fetch(url+"?action=list", {cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const result=await response.json();

    if(!Array.isArray(result.properties)) throw new Error("Invalid sheet response");

    submissions=result.properties;
    localStorage.setItem(submissionKey,JSON.stringify(submissions));

    /* Convert sheet rows into the site's property cards when enough fields exist. */
    const liveData=submissions.map((p,i)=>[
      p.title || "Property",
      p.location || "",
      [p.type,p.area].filter(Boolean).join(" • "),
      p.price || "",
      p.mode==="Rent"?"/ month":"",
      p.image || imgs[i % imgs.length],
      p.mode || "Buy"
    ]);

    if(liveData.length){
      data.length=0;
      liveData.forEach(x=>data.push(x));
      render(data);
      filterProperties();
    }

    status.textContent=`Synced ${submissions.length} properties • ${new Date().toLocaleTimeString()}`;
  }catch(err){
    status.textContent="Sync failed";
    alert("Could not sync the Google Sheet. Check the Web App URL and its access settings.");
    console.error(err);
  }
}

async function pushPropertyToGoogleSheet(property){
  const url=getSheetUrl();
  if(!url) return false;

  setSheetUrl(url);
  try{
    const response=await fetch(url,{
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({action:"add",property})
    });
    if(!response.ok) throw new Error("HTTP "+response.status);
    const result=await response.json();
    return result.success===true;
  }catch(err){
    console.error(err);
    return false;
  }
}

const sheetInput = document.getElementById("googleSheetUrl");
if(sheetInput){
  sheetInput.value = localStorage.getItem(sheetUrlKey) || CONFIGURED_SHEET_URL;
}

document.getElementById("downloadSubmissions")?.addEventListener("click",downloadPropertySpreadsheet);
document.getElementById("syncSheetBtn")?.addEventListener("click",syncFromGoogleSheet);
async function checkGoogleSheetConnection(){
  const status=document.getElementById("sheetStatus");
  if(!status) return;
  try{
    const response=await fetch(CONFIGURED_SHEET_URL+"?action=list",{cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const result=await response.json();
    if(Array.isArray(result.properties)){
      status.textContent=`Connected to Google Sheet • ${result.properties.length} properties`;
    }
  }catch(err){
    status.textContent="Google Sheet connection needs checking";
    console.warn("Google Sheet connection:",err);
  }
}
checkGoogleSheetConnection();



document.getElementById("newsletter").onsubmit=e=>{
 e.preventDefault();
 alert("Demo newsletter signup.");
};
