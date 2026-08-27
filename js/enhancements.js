/* UngaProperty interactive enhancements */
const UP_LOCATIONS = [
 "Avadi","Thirunindravur","Thirumalisai","Vepampattu","Thiruvallur","Sevaipettai","Thamaraipakkam"
];

function upNormalize(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g,"").trim();}
function upDistance(a,b){
  a=upNormalize(a); b=upNormalize(b);
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i;
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function upLocationMatches(q){
  const x=upNormalize(q);
  if(!x)return UP_LOCATIONS.slice(0,12);
  return UP_LOCATIONS.map(name=>{
    const n=upNormalize(name);
    const starts=n.startsWith(x), contains=n.includes(x);
    const d=upDistance(x,n);
    const score=starts?0:contains?1:Math.min(d,8)+2;
    return {name,score,d};
  }).filter(o=>o.score<7 || (x.length<=2 && o.name.toLowerCase().startsWith(x)))
    .sort((a,b)=>a.score-b.score || a.d-b.d || a.name.localeCompare(b.name))
    .filter((o,i,arr)=>x.length<=2 ? o.name.toLowerCase().startsWith(x) : i<10).map(o=>o.name);
}
let UP_SELECTED_LOCATIONS = [];
function upSyncLocationInput(input){
  input.value = UP_SELECTED_LOCATIONS.join(", ");
  input.setAttribute("aria-label", UP_SELECTED_LOCATIONS.length
    ? `Selected locations: ${UP_SELECTED_LOCATIONS.join(", ")}`
    : "Select or enter location");
  const chips=document.getElementById("locationChips");
  if(chips){
    chips.innerHTML = UP_SELECTED_LOCATIONS.length
      ? UP_SELECTED_LOCATIONS.map((name,i)=>`<span class="location-chip" data-location-index="${i}"><span class="location-chip-name">${name}</span><button type="button" class="location-chip-remove" aria-label="Remove ${name}" title="Remove ${name}">×</button></span>`).join("")
      : '<span class="location-placeholder">Select or enter location</span>';
  }
}
function setupLocationSuggest(inputId,suggestId){
  const input=document.getElementById(inputId), box=document.getElementById(suggestId);
  const toggle=document.getElementById("locationToggle");
  const wrap=document.getElementById("locationInputWrap");
  if(!input||!box)return;

  function setOpen(open){
    box.classList.toggle("open",open);
    input.closest(".location-field")?.classList.toggle("location-open",open);
    if(toggle){
      toggle.textContent=open?"⌃":"⌄";
      toggle.setAttribute("aria-expanded",String(open));
      toggle.setAttribute("aria-label",open?"Close location options":"Open location options");
    }
  }

  function draw(forceOpen=true){
    const matches=upLocationMatches(UP_SELECTED_LOCATIONS.length ? "" : input.value);
    const maxReached=UP_SELECTED_LOCATIONS.length>=3;
    box.innerHTML = `
      <div class="location-select-help">Select up to 3 locations</div>
      ${matches.map(name=>{
        const selected=UP_SELECTED_LOCATIONS.includes(name);
        const disabled=maxReached && !selected;
        return `<button type="button" role="option" aria-selected="${selected}" class="${selected?"active":""} ${disabled?"disabled":""}" ${disabled?"disabled":""}>
          <span>${name}</span><span class="location-check">${selected?"✓":""}</span>
        </button>`;
      }).join("")}`;
    if(forceOpen && matches.length) setOpen(true);

    box.querySelectorAll("button[role=option]").forEach(btn=>btn.onclick=()=>{
      const name=btn.querySelector("span")?.textContent?.trim();
      if(!name)return;
      const idx=UP_SELECTED_LOCATIONS.indexOf(name);
      if(idx>=0){
        UP_SELECTED_LOCATIONS.splice(idx,1);
      }else if(UP_SELECTED_LOCATIONS.length<3){
        UP_SELECTED_LOCATIONS.push(name);
      }
      upSyncLocationInput(input);
      input.dispatchEvent(new Event("change",{bubbles:true}));
      draw(true);
    });
  }

  input.addEventListener("focus",()=>draw(true));
  input.addEventListener("click",()=>draw(true));
  wrap?.addEventListener("click",e=>{
    const remove=e.target.closest(".location-chip-remove");
    if(remove){
      e.preventDefault();
      e.stopPropagation();
      const chip=remove.closest(".location-chip");
      const idx=Number(chip?.dataset.locationIndex);
      if(Number.isInteger(idx) && idx>=0 && idx<UP_SELECTED_LOCATIONS.length){
        UP_SELECTED_LOCATIONS.splice(idx,1);
        upSyncLocationInput(input);
        input.dispatchEvent(new Event("change",{bubbles:true}));
        draw(true);
      }
      return;
    }
    input.focus();
    draw(true);
  });
  input.addEventListener("keydown",e=>{
    if(e.key==="Escape"){setOpen(false);return;}
    if(e.key==="Backspace" && !input.value.trim() && UP_SELECTED_LOCATIONS.length){
      UP_SELECTED_LOCATIONS.pop();
      upSyncLocationInput(input);
      input.dispatchEvent(new Event("change",{bubbles:true}));
      draw(true);
    }
  });
  toggle?.addEventListener("click",e=>{
    e.preventDefault();
    e.stopPropagation();
    if(box.classList.contains("open")) setOpen(false);
    else { input.focus(); draw(true); }
  });
  document.addEventListener("click",e=>{
    if(!box.contains(e.target) && e.target!==input && e.target!==toggle && !wrap?.contains(e.target)) setOpen(false);
  });
}

setupLocationSuggest("location","locationSuggestions");
upSyncLocationInput(document.getElementById("location"));

/* Match every hero dropdown to the Location dropdown style. */
function setupHeroSelects(){
  document.querySelectorAll('.up-select').forEach(wrapper=>{
    const id=wrapper.dataset.select;
    const hidden=document.getElementById(id);
    const trigger=wrapper.querySelector('.up-select-trigger');
    const menu=wrapper.querySelector('.up-select-menu');
    if(!hidden||!trigger||!menu)return;

    const setValue=(value,label)=>{
      hidden.value=value;
      trigger.textContent=label;
      menu.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===value));
      hidden.dispatchEvent(new Event('change',{bubbles:true}));
    };

    trigger.addEventListener('click',e=>{
      e.preventDefault();
      if(wrapper.classList.contains('is-disabled')) return;
      document.querySelectorAll('.up-select.open').forEach(x=>{
        if(x!==wrapper)x.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });

    menu.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      if(wrapper.classList.contains('is-disabled')) return;
      setValue(btn.dataset.value,btn.textContent.trim());
      wrapper.classList.remove('open');
    }));

    hidden.addEventListener('change',()=>{
      const opt=hidden.options[hidden.selectedIndex];
      if(opt) trigger.textContent=opt.textContent;
      updateBhkForPropertyType();
    });
  });

  function updateBhkForPropertyType(){
    const type=document.getElementById('type');
    const bhk=document.getElementById('bhk');
    const bhkWrap=document.querySelector('.up-select[data-select="bhk"]');
    const bhkTrigger=bhkWrap?.querySelector('.up-select-trigger');
    if(!type||!bhk||!bhkWrap||!bhkTrigger)return;

    const isPlot=type.value==='Plot';
    bhkWrap.classList.toggle('is-disabled',isPlot);
    bhkTrigger.disabled=isPlot;
    bhk.setAttribute('aria-disabled',String(isPlot));

    if(isPlot){
      bhk.value='';
      bhkTrigger.textContent='Any';
      bhkWrap.classList.remove('open');
      bhkWrap.querySelectorAll('.up-select-menu button').forEach(b=>b.classList.toggle('active',b.dataset.value===''));
      // Keep the disabled BHK field visually and logically reset without firing a recursive change event.
    }
  }

  document.addEventListener('click',e=>{
    if(!e.target.closest('.up-select')){
      document.querySelectorAll('.up-select.open').forEach(x=>x.classList.remove('open'));
    }
  });

  updateBhkForPropertyType();
}

setupHeroSelects();


function upMoney(p){
  const raw=String(p[3]||"").replace(/[^\d.]/g,"");
  const n=parseFloat(raw)||0;
  const unit=String(p[4]||"");
  if(unit.includes("sq.ft")) return n*1000; // rough comparable value for plot filtering
  if(unit.includes("month")) return n*12;   // annualized rental comparison
  return n;
}
function upBhk(p){
  const s=(String(p[0])+" "+String(p[2])).toLowerCase();
  const m=s.match(/(\d+)\s*bhk/); return m?parseInt(m[1],10):0;
}
function upType(p){
  const s=(String(p[2])+" "+String(p[0])).toLowerCase();
  if(s.includes("plot")) return "Plot";
  if(s.includes("villa")) return "Villa";
  if(s.includes("apartment")||s.includes("flat")) return "Apartment";
  if(s.includes("independent house")||s.includes("house")) return "House";
  if(s.includes("commercial")) return "Commercial Building";
  if(s.includes("office")) return "Office";
  if(s.includes("shop")) return "Shop";
  if(s.includes("pg")) return "PG";
  return "Other";
}
function upMatchesBudget(p,limit){
  if(!limit)return true;
  const n=upMoney(p);
  if(limit==="2000000")return n<2000000;
  if(limit==="5000000")return n>=2000000&&n<=5000000;
  if(limit==="10000000")return n>5000000&&n<=10000000;
  if(limit==="10000001")return n>10000000;
  return true;
}

function renderAllProperties(){
  const cards=document.getElementById("allPropertyCards");
  if(!cards)return;
  const loc=upNormalize(document.getElementById("allLocation").value);
  const type=document.getElementById("allType").value;
  const budget=document.getElementById("allBudget").value;
  const bhk=document.getElementById("allBhk").value;
  const sort=document.getElementById("allSort").value;
  let list=data.filter(p=>{
    const locationOK=!loc||upNormalize(p[1]).includes(loc)||upNormalize(p[0]).includes(loc);
    const typeOK=!type||upType(p)===type;
    const bhkOK=!bhk||(bhk==="4"?upBhk(p)>=4:upBhk(p)===parseInt(bhk,10));
    return locationOK&&typeOK&&upMatchesBudget(p,budget)&&bhkOK;
  });
  if(sort==="priceLow")list.sort((a,b)=>upMoney(a)-upMoney(b));
  if(sort==="priceHigh")list.sort((a,b)=>upMoney(b)-upMoney(a));
  if(sort==="location")list.sort((a,b)=>String(a[1]).localeCompare(String(b[1])));
  document.getElementById("allPropertiesCount").textContent=`${list.length} properties found`;
  cards.innerHTML=list.length?list.map(p=>card(p,data.indexOf(p))).join(""):`<p style="grid-column:1/-1;text-align:center;padding:45px;color:#66736d">No properties match these filters. Try another location, budget, BHK or property type.</p>`;
}
function openAllProperties(e){if(e)e.preventDefault();document.getElementById("allPropertiesModal").classList.add("open");renderAllProperties();}
function closeAllProperties(){document.getElementById("allPropertiesModal").classList.remove("open");}
document.getElementById("viewAllProperties")?.addEventListener("click",openAllProperties);
document.querySelectorAll("#allFilters select,#allFilters input").forEach(el=>el.addEventListener("input",renderAllProperties));
document.getElementById("resetAllFilters")?.addEventListener("click",()=>{
  document.getElementById("allLocation").value="";
  document.getElementById("allType").value="";
  document.getElementById("allBudget").value="";
  document.getElementById("allBhk").value="";
  document.getElementById("allSort").value="newest";
  renderAllProperties();
});
document.getElementById("allPropertiesModal")?.addEventListener("click",e=>{if(e.target.id==="allPropertiesModal")closeAllProperties();});

function upSearchFilter(){
  const selectedLocs=UP_SELECTED_LOCATIONS.map(upNormalize).filter(Boolean);
  const typedLoc=upNormalize(document.getElementById("location").value);
  const locs=selectedLocs.length ? selectedLocs : (typedLoc ? [typedLoc] : []);
  const type=document.getElementById("type").value;
  const budget=document.getElementById("budget").value;
  const bhk=document.getElementById("bhk").value;
  let results=data.filter(p=>{
    const modeOK=currentMode==="Buy" ? (p[6]==="Buy" || p[6]==="Rent") : p[6]===currentMode;
    const locationOK=!locs.length||locs.some(loc=>upNormalize(p[1]).includes(loc)||upNormalize(p[0]).includes(loc));
    const typeOK=!type||upType(p)===type;
    const bhkOK=!bhk||(bhk==="4"?upBhk(p)>=4:upBhk(p)===parseInt(bhk,10));
    return modeOK&&locationOK&&typeOK&&upMatchesBudget(p,budget)&&bhkOK;
  });
  const cards=document.getElementById("cards");
  if(!results.length)cards.innerHTML="<p style='grid-column:1/-1;text-align:center;padding:45px;color:#66736d'>No properties found. Try a different location or filter.</p>";
  else cards.innerHTML=results.map(p=>card(p,data.indexOf(p))).join("");
}
const sf=document.getElementById("searchForm");
if(sf)sf.addEventListener("submit",e=>{e.preventDefault();upSearchFilter();document.getElementById("properties").scrollIntoView({behavior:"smooth"});});
["location","type","budget","bhk"].forEach(id=>document.getElementById(id)?.addEventListener("change",upSearchFilter));

/* Authentication: local account flow + mobile OTP demo flow. */
const AUTH_KEY="ungaPropertyAuthUsers";
function getUsers(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||"{}")}catch(e){return {}}}
function saveUsers(u){localStorage.setItem(AUTH_KEY,JSON.stringify(u))}
function normalizePhone(v){
  const raw=String(v||"").trim();
  const digits=raw.replace(/\D/g,"");
  if(digits.length===10)return "+91"+digits;
  if(digits.length===12 && digits.startsWith("91"))return "+"+digits;
  return raw.replace(/[^\d+]/g,"");
}
function openAuth(view="loginView"){
  document.getElementById("authModal").classList.add("open"); showAuthView(view);
}
function closeAuth(){document.getElementById("authModal").classList.remove("open")}
function showAuthView(view){
  document.querySelectorAll(".auth-view").forEach(v=>v.classList.toggle("active",v.id===view));
  document.querySelectorAll(".auth-tab").forEach(t=>t.classList.toggle("active",t.dataset.authView===view));
  document.getElementById("authTitle").textContent=view==="signupView"?"Create Account":view==="resetView"?"Reset Password":"Login";
  document.getElementById("authSubtitle").textContent=view==="signupView"?"Create your UngaProperty account.":view==="resetView"?"Set a new password for your account.":"Sign in to manage your UngaProperty account.";
  ["loginMessage","signupMessage","resetMessage","otpMessage"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=""});
}
document.getElementById("login")?.addEventListener("click",()=>openAuth("loginView"));
document.querySelectorAll(".auth-tab").forEach(t=>t.addEventListener("click",()=>showAuthView(t.dataset.authView)));
document.querySelectorAll("[data-open-signup]").forEach(b=>b.addEventListener("click",()=>showAuthView("signupView")));
document.querySelectorAll("[data-open-login]").forEach(b=>b.addEventListener("click",()=>showAuthView("loginView")));
document.getElementById("forgotPasswordBtn")?.addEventListener("click",()=>showAuthView("resetView"));
document.getElementById("authModal")?.addEventListener("click",e=>{if(e.target.id==="authModal")closeAuth();});

document.getElementById("signupForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const u=getUsers(), username=upNormalize(document.getElementById("signupUsername").value);
  const phone=normalizePhone(document.getElementById("signupPhone").value);
  const pass=document.getElementById("signupPassword").value, confirm=document.getElementById("signupConfirm").value;
  const msg=document.getElementById("signupMessage");
  const phoneDigits=phone.replace(/\D/g,"");
  if(phoneDigits.length!==10 && phoneDigits.length!==12){msg.textContent="Please enter a valid 10-digit mobile number.";return}
  if(pass!==confirm){msg.textContent="Passwords do not match.";return}
  if(pass.length<6){msg.textContent="Password must be at least 6 characters.";return}
  if(u[username]){msg.textContent="This username/email is already registered.";return}
  const duplicate=Object.values(u).some(x=>x.phone===phone);
  if(duplicate){msg.textContent="This mobile number is already registered.";return}
  u[username]={name:document.getElementById("signupName").value.trim(),phone,password:pass};
  saveUsers(u); msg.textContent="Account created successfully. You can now login with password or mobile OTP.";
  setTimeout(()=>showAuthView("loginView"),900);
});

document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const u=getUsers(), username=upNormalize(document.getElementById("loginUsername").value), pass=document.getElementById("loginPassword").value;
  const msg=document.getElementById("loginMessage");
  if(u[username]&&u[username].password===pass){
    localStorage.setItem("ungaPropertySession",JSON.stringify({username,name:u[username].name}));
    updateAuthUI(); msg.textContent="Login successful."; setTimeout(closeAuth,500);
  }else msg.textContent="Invalid username/email or password.";
});

/* Mobile OTP login. In this static HTML version the OTP is simulated locally.
   A real SMS OTP requires a server-side SMS provider (Firebase/Twilio/etc.). */
let pendingOtpPhone="";
let pendingOtpCode="";
function setOtpMode(enabled){
  document.getElementById("otpModeBtn")?.classList.toggle("active",enabled);
  document.getElementById("passwordModeBtn")?.classList.toggle("active",!enabled);
  document.getElementById("loginForm")?.style.setProperty("display",enabled?"none":"grid");
  document.getElementById("otpRequestStep")?.classList.toggle("active",enabled);
  if(!enabled){
    document.getElementById("otpVerifyStep")?.classList.remove("active");
    const m=document.getElementById("otpMessage"); if(m)m.textContent="";
  }
}
document.getElementById("passwordModeBtn")?.addEventListener("click",()=>setOtpMode(false));
document.getElementById("otpModeBtn")?.addEventListener("click",()=>setOtpMode(true));

function issueOtp(){
  const phone=normalizePhone(document.getElementById("loginPhone").value);
  const msg=document.getElementById("otpMessage"), users=getUsers();
  const user=Object.values(users).find(x=>normalizePhone(x.phone)===phone);
  if(!user){msg.textContent="No account found with this mobile number. Please sign up first.";return}
  if(phone.replace(/\D/g,"").length<10){msg.textContent="Enter a valid mobile number.";return}
  pendingOtpPhone=phone;
  pendingOtpCode=String(Math.floor(100000+Math.random()*900000));
  document.getElementById("otpRequestStep")?.classList.remove("active");
  document.getElementById("otpVerifyStep")?.classList.add("active");
  msg.textContent="OTP sent successfully. For this local demo, your OTP is "+pendingOtpCode+".";
}
document.getElementById("sendOtpBtn")?.addEventListener("click",issueOtp);
document.getElementById("resendOtpBtn")?.addEventListener("click",issueOtp);
document.getElementById("verifyOtpBtn")?.addEventListener("click",()=>{
  const entered=document.getElementById("loginOtp").value.trim(), msg=document.getElementById("otpMessage"), users=getUsers();
  if(!pendingOtpCode||entered!==pendingOtpCode){msg.textContent="Invalid OTP. Please try again.";return}
  const entry=Object.entries(users).find(([k,x])=>normalizePhone(x.phone)===pendingOtpPhone);
  if(!entry){msg.textContent="Account could not be found.";return}
  const [username,user]=entry;
  localStorage.setItem("ungaPropertySession",JSON.stringify({username,name:user.name,phone:user.phone,provider:"otp"}));
  updateAuthUI(); msg.textContent="OTP verified. Login successful."; setTimeout(closeAuth,700);
});

document.getElementById("resetForm")?.addEventListener("submit",e=>{
  e.preventDefault(); const u=getUsers(), username=upNormalize(document.getElementById("resetUsername").value);
  const p=document.getElementById("resetPassword").value, c=document.getElementById("resetConfirm").value, msg=document.getElementById("resetMessage");
  if(!u[username]){msg.textContent="No account found for this username/email.";return}
  if(p!==c){msg.textContent="Passwords do not match.";return}
  if(p.length<6){msg.textContent="Password must be at least 6 characters.";return}
  u[username].password=p;saveUsers(u);msg.textContent="Password reset successfully.";
  setTimeout(()=>showAuthView("loginView"),700);
});
function updateAuthUI(){
  const session=JSON.parse(localStorage.getItem("ungaPropertySession")||"null"), badge=document.getElementById("userBadge"), login=document.getElementById("login");
  if(session){badge.style.display="block";badge.textContent=session.name||session.username;login.style.display="none";badge.onclick=()=>{localStorage.removeItem("ungaPropertySession");updateAuthUI();};}
  else {badge.style.display="none";login.style.display="block";}
}
updateAuthUI();

/* Replace the Google button with real Google Identity Services when a Client ID is supplied. */
const GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
function handleGoogleCredential(response){
  try{
    const payload=JSON.parse(atob(response.credential.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
    const name=payload.name||payload.email||"Google User";
    localStorage.setItem("ungaPropertySession",JSON.stringify({username:payload.email,name,provider:"google"}));
    updateAuthUI(); closeAuth(); alert(`Welcome, ${name}! Google sign-in successful.`);
  }catch(e){alert("Google sign-in response could not be processed.");}
}
function initGoogleLogin(){
  if(!window.google?.accounts?.id)return;
  if(!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith("YOUR_"))return;
  google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:handleGoogleCredential});
  const host=document.getElementById("googleButtonHost");
  if(host){
    host.innerHTML="";
    google.accounts.id.renderButton(host,{theme:"outline",size:"large",width:350,text:"continue_with",shape:"rectangular",logo_alignment:"left"});
  }
}
window.addEventListener("load",initGoogleLogin);

/* Ensure service cards have no icon and all phone links are callable. */
document.querySelectorAll(".header-phone a").forEach(a=>a.setAttribute("href","tel:+917200686551"));

/* Final owner-only spreadsheet visibility. Static front-end recognition; use real server auth for production security. */
const OWNER_IDS=["ungaproperty360@gmail.com","9894252417","9566050017","+919894251017","+919566050017"];
function isOwnerIdentity(session){
 if(!session)return false;
 const vals=[session.username,session.email,session.phone].filter(Boolean).map(v=>String(v).toLowerCase().replace(/\s+/g,""));
 return vals.some(v=>OWNER_IDS.includes(v));
}
function updateOwnerControls(){
 const session=JSON.parse(localStorage.getItem("ungaPropertySession")||"null");
 const owner=isOwnerIdentity(session);
 document.querySelectorAll(".owner-only").forEach(el=>el.classList.toggle("owner-visible",owner));
}
const _oldUpdateAuthUI=window.updateAuthUI;
if(typeof _oldUpdateAuthUI==="function"){
 const original=window.updateAuthUI;
 window.updateAuthUI=function(){original();updateOwnerControls();};
}
updateOwnerControls();

/* Seed owner role when a recognised owner identifier logs in or signs up. */
const _loginForm=document.getElementById("loginForm");
_loginForm?.addEventListener("submit",()=>setTimeout(()=>{
 const s=JSON.parse(localStorage.getItem("ungaPropertySession")||"null"); if(s&&isOwnerIdentity(s)){s.role="owner";localStorage.setItem("ungaPropertySession",JSON.stringify(s));updateOwnerControls();}
},650));
const _signupForm=document.getElementById("signupForm");
_signupForm?.addEventListener("submit",()=>setTimeout(()=>{
 const s=JSON.parse(localStorage.getItem("ungaPropertySession")||"null"); if(s&&isOwnerIdentity(s)){s.role="owner";localStorage.setItem("ungaPropertySession",JSON.stringify(s));updateOwnerControls();}
},1000));

/* Search options: Any Property always first; rent removes Plot and uses monthly rent budgets. */
function refreshHeroSearchOptions(){
 const typeWrap=document.querySelector('.up-select[data-select="type"]');
 const budgetWrap=document.querySelector('.up-select[data-select="budget"]');
 if(!typeWrap||!budgetWrap)return;
 const types=currentMode==="Rent"?["","Apartment","Villa","House","PG","Commercial Building","Office","Shop"]:["","Apartment","Villa","House","Plot","PG","Commercial Building","Office","Shop"];
 const labels={"":"Any Property"};
 const menu=typeWrap.querySelector('.up-select-menu'); const select=document.getElementById('type');
 menu.innerHTML=types.map(v=>`<button type="button" data-value="${v}">${labels[v]||v}</button>`).join("");
 select.innerHTML=types.map(v=>`<option value="${v}">${labels[v]||v}</option>`).join("");
 typeWrap.querySelector('.up-select-trigger').textContent="Any Property"; select.value="";
 const budgets=currentMode==="Rent"?[["","Any Budget"],["rent10000","Under ₹10,000"],["rent20000","Under ₹20,000"],["rent30000","Under ₹30,000"],["rent50000","Under ₹50,000"],["rent50001","Above ₹50,000"]]:[["","Any Budget"],["2000000","Under ₹20 Lakhs"],["5000000","₹20–50 Lakhs"],["10000000","₹50 Lakhs–₹1 Crore"],["10000001","Above ₹1 Crore"]];
 const bmenu=budgetWrap.querySelector('.up-select-menu'); const bselect=document.getElementById('budget');
 bmenu.innerHTML=budgets.map(([v,l])=>`<button type="button" data-value="${v}">${l}</button>`).join("");
 bselect.innerHTML=budgets.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
 budgetWrap.querySelector('.up-select-trigger').textContent="Any Budget"; bselect.value="";
 /* rebind custom menu buttons because the original menu was rebuilt */
 bmenu.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{bselect.value=btn.dataset.value;bmenu.parentElement.classList.remove('open');budgetWrap.querySelector('.up-select-trigger').textContent=btn.textContent.trim();bselect.dispatchEvent(new Event('change',{bubbles:true}));}));
 menu.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{select.value=btn.dataset.value;menu.parentElement.classList.remove('open');typeWrap.querySelector('.up-select-trigger').textContent=btn.textContent.trim();select.dispatchEvent(new Event('change',{bubbles:true}));}));
}
document.querySelectorAll('.tabs .tab').forEach(t=>t.addEventListener('click',()=>setTimeout(refreshHeroSearchOptions,0)));
refreshHeroSearchOptions();
const _oldUpMatchesBudget=upMatchesBudget;
upMatchesBudget=function(p,limit){
 if(String(limit).startsWith('rent')){
   const n=parseFloat(String(p[3]||'').replace(/[^\d.]/g,''))||0;
   const threshold={rent10000:10000,rent20000:20000,rent30000:30000,rent50000:50000,rent50001:50000}[limit];
   return limit==='rent50001'?n>50000:n>0&&n<=threshold;
 }
 return _oldUpMatchesBudget(p,limit);
};
