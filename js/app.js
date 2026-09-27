(() => {
  const slides=[...document.querySelectorAll(".slide")], prev=document.getElementById("prevBtn"), next=document.getElementById("nextBtn");
  const cur=document.getElementById("currentPage"), total=document.getElementById("totalPages"), dotsWrap=document.getElementById("pageDots");
  const theme=document.getElementById("themeBtn"), full=document.getElementById("fullscreenBtn");
  const lightbox=document.getElementById("lightbox"), lightImg=document.getElementById("lightboxImage"), close=document.getElementById("lightboxClose");
  let index=0, touchX=0, touchY=0, wheelLock=false;
  total.textContent=slides.length;

  slides.forEach((s,i)=>{const d=document.createElement("button");d.className="page-dot";d.title=`${i+1}페이지 ${s.dataset.title||""}`;d.addEventListener("click",()=>go(i));dotsWrap.appendChild(d)});
  const dots=[...dotsWrap.children];

  function go(i){
    index=(i+slides.length)%slides.length;
    slides.forEach((s,n)=>s.classList.toggle("active",n===index));
    dots.forEach((d,n)=>d.classList.toggle("active",n===index));
    cur.textContent=index+1; history.replaceState(null,"",`#${index+1}`);
  }
  const nextPage=()=>go(index+1), prevPage=()=>go(index-1);
  prev.addEventListener("click",prevPage);next.addEventListener("click",nextPage);

  document.addEventListener("keydown",e=>{
    if(lightbox.classList.contains("open")){if(e.key==="Escape"||e.key==="Enter")closeBox();return}
    if(["ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault();nextPage()}
    else if(["ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();prevPage()}
    else if(e.key==="Home"){e.preventDefault();go(0)}
    else if(e.key==="End"){e.preventDefault();go(slides.length-1)}
    else if(["d","D"].includes(e.key))toggleTheme()
    else if(["f","F"].includes(e.key))toggleFull()
    else if(e.key==="Escape"&&document.fullscreenElement)document.exitFullscreen()
  });

  document.addEventListener("click",e=>{
    if(e.target.closest("button,.image-container,.controls,.page-dots,.image-lightbox"))return;
    if(e.clientX<innerWidth*.27)prevPage();else if(e.clientX>innerWidth*.73)nextPage();
  });

  document.addEventListener("wheel",e=>{
    if(lightbox.classList.contains("open")||wheelLock||Math.abs(e.deltaY)<20)return;
    wheelLock=true;e.deltaY>0?nextPage():prevPage();setTimeout(()=>wheelLock=false,450);
  },{passive:true});

  document.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].screenX;touchY=e.changedTouches[0].screenY},{passive:true});
  document.addEventListener("touchend",e=>{
    if(lightbox.classList.contains("open"))return;
    const dx=e.changedTouches[0].screenX-touchX,dy=e.changedTouches[0].screenY-touchY;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))dx<0?nextPage():prevPage();
  },{passive:true});

  document.querySelectorAll(".image-container img").forEach(img=>img.addEventListener("click",e=>{
    if(img.style.display==="none")return;e.stopPropagation();lightImg.src=img.src;lightImg.alt=img.alt;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
  }));
  function closeBox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");lightImg.src=""}
  close.addEventListener("click",closeBox);lightbox.addEventListener("click",e=>{if(e.target===lightbox||e.target===lightImg)closeBox()});

  const saved=localStorage.getItem("haha-osaka-theme");if(saved==="dark")document.body.classList.add("dark");
  function themeIcon(){theme.textContent=document.body.classList.contains("dark")?"☀":"☾"}
  function toggleTheme(){document.body.classList.toggle("dark");localStorage.setItem("haha-osaka-theme",document.body.classList.contains("dark")?"dark":"light");themeIcon()}
  theme.addEventListener("click",toggleTheme);themeIcon();

  async function toggleFull(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){}}
  full.addEventListener("click",toggleFull);

  const h=parseInt(location.hash.replace("#",""),10);go(Number.isInteger(h)?h-1:0);
})();
