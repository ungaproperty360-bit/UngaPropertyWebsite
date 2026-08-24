(function(){
  const toggle=document.getElementById('upChatToggle');
  const chat=document.getElementById('upChat');
  const close=document.getElementById('upChatClose');
  const messages=document.getElementById('upChatMessages');
  const form=document.getElementById('upChatForm');
  const input=document.getElementById('upChatInput');

  function openChat(){chat.classList.add('open');input.focus()}
  function addMessage(text,who){
    const el=document.createElement('div');
    el.className='upmsg '+who;
    el.textContent=text;
    messages.appendChild(el);
    messages.scrollTop=messages.scrollHeight;
  }

  function reply(q){
    const x=q.toLowerCase();
    if(/plot|land|site/.test(x)){
      return "Sure. Tell me your preferred area and budget. Example: “Plot in Poonamallee under ₹20 lakhs”. I can help narrow the search.";
    }
    if(/rent|rental|lease/.test(x)){
      return "I can help with rentals. Please share the area, monthly budget and whether you need a house, flat or commercial space.";
    }
    if(/cmda|dtcp|approval/.test(x)){
      return "CMDA and DTCP are planning/approval authorities used in different areas. Before buying, verify the layout approval, patta, title, EC and applicable planning approval for the property.";
    }
    if(/patta|document|registration|legal|ec|encumbrance/.test(x)){
      return "For a property purchase, important checks can include title documents, patta, encumbrance certificate (EC), survey details, approval status and registration records. For a specific property, share the details and I’ll guide you through the checks.";
    }
    if(/buy|buying|purchase|invest/.test(x)){
      return "I can help you compare properties and identify what to verify before purchase. Send the area, budget and property type.";
    }
    return "I can help you find properties and understand property-related topics. Try: “Plots in Avadi under ₹25 lakhs”, “Rental house in Porur”, or “What documents should I check before buying land?”";
  }

  toggle.onclick=openChat;
  close.onclick=()=>chat.classList.remove('open');

  document.querySelectorAll('.upchat-suggestions button').forEach(btn=>{
    btn.onclick=()=>{
      const q=btn.dataset.q;
      addMessage(q,'user');
      setTimeout(()=>addMessage(reply(q),'bot'),250);
    };
  });

  form.onsubmit=e=>{
    e.preventDefault();
    const q=input.value.trim();
    if(!q)return;
    addMessage(q,'user'); input.value='';
    setTimeout(()=>addMessage(reply(q),'bot'),250);
  };
})();
