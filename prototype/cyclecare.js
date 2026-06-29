const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function toast(message){
  const el=$("#toast");if(!el)return;el.textContent=message;el.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400);
}
function submitLog(event,label){
  event.preventDefault();const button=event.submitter;button.disabled=true;button.textContent="Saving…";
  setTimeout(()=>{button.disabled=false;button.textContent=`Save ${label}`;toast(`${label} saved privately`);},500);
}
document.addEventListener("DOMContentLoaded",()=>{
  $$(".chip").forEach(chip=>chip.addEventListener("click",()=>chip.setAttribute("aria-pressed",chip.getAttribute("aria-pressed")!=="true")));
  $$(".day").forEach(day=>day.addEventListener("click",()=>{
    $$(".day").forEach(d=>d.removeAttribute("aria-current"));day.setAttribute("aria-current","date");
    const detail=$("#selected-date");if(detail)detail.textContent=`June ${day.textContent.trim()} · Select a log to add details`;
  }));
  $("#chat-form")?.addEventListener("submit",event=>{
    event.preventDefault();const input=$("#chat-input");if(!input.value.trim())return;
    const feed=$("#chat-feed");const user=document.createElement("p");user.className="bubble user";user.textContent=input.value;feed.append(user);
    input.value="";const pending=document.createElement("p");pending.className="bubble ai";pending.textContent="Thinking…";feed.append(pending);
    setTimeout(()=>{pending.textContent="Cycle patterns can vary, especially when recent cycles are irregular. I can help you review your logs, but I can’t diagnose a condition. Seek care for severe pain, very heavy bleeding, fainting, or pregnancy concerns.";pending.scrollIntoView({block:"nearest"});},650);
  });
  $$("[data-prompt]").forEach(button=>button.addEventListener("click",()=>{const input=$("#chat-input");input.value=button.dataset.prompt;input.focus();}));
});
