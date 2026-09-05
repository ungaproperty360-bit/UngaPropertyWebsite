const imgs=["images/property-sample.webp","images/properties/Avni.webp","images/properties/Veppampattu.webp","images/properties/Bala-Kumaran-Nagar.webp"];

/* Fixed catalogue. Array positions: title, location, meta, price, unit, primary image, mode, gallery, description, details, map area */
const data=[
["Premium villa plot","Thirunindravur, Chennai","1092 sq.ft • Plot","₹3,000","/ sq.ft","images/property-sample.webp","Buy",
 ["images/property-sample.webp","images/properties/thirunindravur-2.webp","images/properties/thirunindravur-3.webp","images/properties/thirunindravur-4.webp","images/properties/thirunindravur-5.webp"],
 "Premium villa plot in Tamil Kumaran Nagar, Thirunindravur. A well-developed gated layout suitable for building your dream home.",
 {"Property Type":"Plot","Area":"1092 sq.ft","Property Age":"New","Facing":"South","Status":"Available","Layout":"Gated community"},"Thirunindravur, Chennai"],
["Avni – Premium villa plot","Thirumalisai, Chennai, Tamil Nadu","Plot • Posted recently","₹3,700","/ Sq.Ft","images/properties/Avni.webp","Buy",
 ["images/properties/Avni.webp","images/properties/avni-2.jpg","images/properties/avni-3.jpg","images/properties/avni-4.webp","images/properties/avni-5.jpg"],
 "Premium villa plot in Avni, Thirumazhisai, with developed roads, landscaping and community infrastructure.",
 {"Property Type":"Plot","Property Age":"New","Status":"Available","Location":"Thirumazhisai","Development":"Premium villa plot"},"Thirumazhisai, Chennai"],
["Duplex 3 BHK Spacious Villa","Vepampattu, Chennai","3 BHK • 1600 sq.ft • Duplex Villa","₹85,00,000","","images/properties/Veppampattu.webp","Buy",
 ["images/properties/Veppampattu.webp"],
 "Spacious duplex 3 BHK villa in Vepampattu with modern living spaces and parking.",
 {"Property Type":"Duplex Villa","BHK":"3 BHK","Area":"1600 sq.ft","Property Age":"New","Facing":"South","Parking":"2 Car Parking"},"Vepampattu, Chennai"],
["Bala Kumaran Nagar – Premium villa plot","Thirunindravur, Chennai, Tamil Nadu","Plot • Posted recently","₹2,800","/ Sq.Ft","images/properties/Bala-Kumaran-Nagar.webp","Buy",
 ["images/properties/Bala-Kumaran-Nagar.webp","images/properties/bala-2.webp","images/properties/bala-3.webp","images/properties/bala-4.webp","images/properties/bala-5.jpg"],
 "Premium villa plot at Bala Kumaran Nagar, Thirunindravur, with developed roads and residential surroundings.",
 {"Property Type":"Plot","Property Age":"New","Status":"Available","Location":"Thirunindravur"},"Thirunindravur, Chennai"]
 ["VR Westgate Premium residential plots","Thirunindravur, Chennai","850 - 1757 sq.ft • Plot","₹3,500","/ sq.ft","images/properties/westgate-1.jpg","Buy",
["images/properties/westgate-1.jpg","images/properties/westgate-2.jpg","images/properties/westgate-3.jpg","images/properties/westgate-4.jpg","images/properties/westgate-5.jpg","images/properties/westgate-6.jpg"],
"VR Westgate is a premium CMDA & RERA approved gated community plotted development by VR Foundation, strategically located in Thiruninravur, West Chennai. 80% of the plots are already sold. Phase 2 launching soon!",
{"Property Type":"Plot","Area":"850 - 1757 sq.ft","Property Age":"New","Status":"Available","Approval":"CMDA & RERA Approved","Development":"Gated Community","Other Details":"Grand Entrance arch, Black top road, street light, Avenue trees and landscaping, plot number board, EB poles, Fully Compounded, School and Hospital connectivity"},"Thirunindravur, Chennai"],
["SRI Balaji Nagar Extension","Tamaraipakkam to Tiruvallur Road","800 - 1600 sq.ft • Villa Plot","₹1,499","/ sq.ft","images/properties/balaji-nagar-1.jpg","Buy",
["images/properties/balaji-nagar-1.jpg","images/properties/balaji-nagar-2.jpg","images/properties/balaji-nagar-3.jpg","images/properties/balaji-nagar-4.jpg","images/properties/balaji-nagar-5.jpg"],
"Plots on Tamaraipakkam to Tiruvallur Road give you dream home or high-growth land. DTCP approved layout with clear title, right where Tiruvallur city is expanding. Fast appreciation with new infra + residential projects coming up.",
{"Property Type":"Villa Plot","Area":"800 - 1600 sq.ft","Property Age":"New","Status":"Available","Approval":"DTCP Approved","Other Details":"10 min from Tiruvallur Bus Stand & Railway Station, Immediate registration + patta, Blacktop roads, street lights, drainage, Near schools, colleges, SIPCOT, Perfect for home + investment"},"Tamaraipakkam, Tiruvallur"],
];

let currentMode="Buy";

function card(p,i){
 const priceBlock=p[3] ? `<div class="price">${p[3]} <small>${p[4]||''}</small></div>` : '';
 return `<article class="card" onclick="showDetail(${i})">
 <div class="pic" style="background-image:url('${p[5]}')">
 <span class="verified">✓ Verified</span>
 <button class="heart" onclick="event.stopPropagation();this.textContent=this.textContent==='♡'?'♥':'♡'">♡</button>
 </div>
 <div class="body"><h3>${p[0]}</h3><div class="loc">${p[1]}</div><div class="meta">${p[2]}</div>${priceBlock}</div>
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

function showDetail(index=0){
 const p=data[index] || data[0];
 document.querySelector(".home").classList.add("hidden");
 document.querySelector(".detail").classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
 const gallery=Array.isArray(p[7])&&p[7].length?p[7]:[p[5]];
 document.getElementById("mainphoto").style.backgroundImage=`url('${gallery[0]}')`;
 document.getElementById("thumbs").innerHTML=gallery.map((x,i)=>`<div class="thumb ${i===0?'active':''}" style="background-image:url('${x}');" onclick="mainPhoto('${x}',this)"></div>`).join("");
 document.getElementById("detailBreadcrumbTitle").textContent=p[0];
 document.getElementById("detailTitle").textContent=p[0];
 document.getElementById("detailLocation").textContent=p[1];
 document.getElementById("detailDescription").textContent=p[8]||"Property details are available on request.";
 document.getElementById("detailPrice").innerHTML=`${p[3]||"Price on request"} <small>${p[4]||""}</small>`;
 const details=p[9]||{};
 document.getElementById("detailTable").innerHTML=Object.entries(details).map(([k,v])=>`<div class="detailrow"><span>${k}</span><b>${v}</b></div>`).join("");
 document.getElementById("detailSpecs").innerHTML=Object.entries(details).slice(0,8).map(([k,v])=>`<div>• &nbsp;${k}: ${v}</div>`).join("");
 const area=p[10]||p[1];
 document.getElementById("detailMap").innerHTML=`<iframe title="${area} area map" src="https://www.google.com/maps?q=${encodeURIComponent(area)}&output=embed" style="width:100%;height:100%;border:0" loading="lazy"></iframe>`;
 document.getElementById("contactOwnerBtn").onclick=()=>openContactModal(p);
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

/* Remove the two old demo listings from previous versions. They are not part of the current 4-property catalogue. */
const removedDemoTitles = new Set(["CMDA", "Individual House for Sale"]);
submissions = Array.isArray(submissions) ? submissions.filter((p) => !removedDemoTitles.has(String(p?.title || "").trim())) : [];
try {
  localStorage.setItem(submissionKey, JSON.stringify(submissions));
} catch (e) {}

/* Restore only current locally posted properties into the featured list on page reload. */
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




/* Contact owner flow: collect viewer phone, then open WhatsApp to Unga Property. */
let contactProperty=null;
function openContactModal(p){contactProperty=p||data[0];document.getElementById("contactModal").classList.add("open");document.getElementById("visitorPhone").focus();}
function closeContactModal(){document.getElementById("contactModal").classList.remove("open");}
document.getElementById("contactModal")?.addEventListener("click",e=>{if(e.target.id==="contactModal")closeContactModal();});
document.getElementById("contactForm")?.addEventListener("submit",e=>{
 e.preventDefault();
 const phone=document.getElementById("visitorPhone").value.trim();
 const name=document.getElementById("visitorName").value.trim();
 const title=contactProperty?.[0]||"property";
 const loc=contactProperty?.[1]||"";
 const msg=`New property enquiry from UngaProperty website.%0AProperty: ${encodeURIComponent(title)}%0ALocation: ${encodeURIComponent(loc)}%0AViewer phone: ${encodeURIComponent(phone)}%0AViewer name: ${encodeURIComponent(name||"Not provided")}`;
 window.open(`https://wa.me/917200686551?text=${msg}`,"_blank");
 document.getElementById("contactMessage").textContent="WhatsApp opened. Your enquiry details are ready to send.";
});

document.getElementById("newsletter").onsubmit=e=>{
 e.preventDefault();
 alert("Demo newsletter signup.");
};
