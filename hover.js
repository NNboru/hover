const size=60;
const s=new Set();

function getdir(dir){
    if(dir=='n' || dir=='s') return ['w','e']
    if(dir=='e' || dir=='w') return ['n','s']

}

function addin(dir,elem,x,y){
    elem.style.top=y+'px';
    elem.style.left=x+'px';
    if(dir=='n'){
        elem.style.top=`${y - size}px`;
        y-=size;
    }
    else if(dir=='s'){
        elem.style.top=`${y + size}px`;
        y+=size;
    }
    else if(dir=='w'){
        elem.style.left=`${x - size}px`;
        x-=size;
    }
    else if(dir=='e'){
        elem.style.left=`${x + size}px`;
        x+=size;
    }
    return [x,y];
}
function newrgb(r,g,b){
    return [(r+35)%258,Math.pow(g%43,g%21)%260,(b+61)%251]
}


let start = document.getElementById('start'),hov = document.getElementById('clone').firstElementChild;
let level = document.getElementById('level'),re = document.querySelector('.alt>div');
let timediv = document.getElementById('timediv'),bdy = document.getElementById('bdy'),end;

bdy.onerror=e=>alert(e)
let h=bdy.offsetHeight, w=bdy.offsetWidth;

function cango(dir,x,y){
    if(dir=='n')
        return y-size<60?0:1;
    if(dir=='s')
        return y+2*size>h-20?0:1;
    if(dir=='e')
        return x+2*size>w-20?0:1;
    if(dir=='w')
        return x-size<20?0:1;
    
}


let x,y,path=16,fakepath=10, prob=1, lev=1, time=30, tid=0;

function creation(elem, path, dir, x, y, red,g,b, rot, pred, fake){
    let newx,newy;
    let [l,r]=getdir(dir);

    if(!pred && path>6 && Math.random()>prob){
        // creating deviation
        let p=Math.random(),d1,d2;
        if(p<.33) d1=l,d2=r;
        if(p<.66) d1=l,d2=dir;
        else d1=dir,d2=r;
        if(cango(d1,x,y) && cango(d2,x,y)){
            if(Math.random()<.5) [d1,d2]=[d2,d1];
            if(Math.random()<.5){
                creation(elem, fake?Math.trunc(path/2):path-2  , d1, x,y, red,g,b, rot, true, fake);//real
                creation(elem, fake?Math.trunc(path/2):fakepath, d2, x,y, red,g,b, rot, true, true);//fake
            }
            else{
                creation(elem, fake?Math.trunc(path/2):fakepath, d2, x,y, red,g,b, rot, true, true);//fake
                creation(elem, fake?Math.trunc(path/2):path-2  , d1, x,y, red,g,b, rot, true, fake);//real
            }
            
            return;
        }
    }

    let next = hov.cloneNode(true), newdir;
    elem.append(next);

    if(pred || (cango(dir,x,y) && Math.random()<.8)){
        //go forward
        [newx, newy] = addin(dir,next,x,y);
        newdir=dir;
    }
    else if(!cango(l,x,y) || (cango(r,x,y) && Math.random()<.5)){
        //go right
        [newx, newy] = addin(r,next,x,y);
        newdir=r;
    }
    else{
        //go left
        [newx, newy] = addin(l,next,x,y);
        newdir=l;
    }

    while(s.has(newx+','+newy+','+red+g+b)){
        [red,g,b] = newrgb(red,g,b);
        rot+=2;
    }
    s.add(newx+','+newy+','+red+g+b);
    
    if(--path==0){
        if(fake)
            next.classList.add('fake')
        else
            next.classList.add('end')
    }
    else{
        next.firstElementChild.style.background=`rgb(${red},${g},${b})`;
        next.firstElementChild.style.transform=`rotateZ(${rot}deg)`;
        creation(next,path,newdir,newx,newy, red,g,b, rot, false, fake);
    }
}

function nextlevel(){
    start.innerHTML= "<div class='tile'></div><div class='logo'><div>Help Me</div></div>";
    path=14 + lev*3;
    fakepath=6 + lev;
    time = 19+lev;
    level.innerHTML='Level '+lev;
    timediv.innerHTML=''+time.toFixed(1);
    x=20+Math.trunc(Math.random()*(w-100));
    y=80+Math.trunc(Math.random()*(h-160));
    start.style.left=x+'px';
    start.style.top=y+'px';
    s.clear();
    s.add(x+','+y+',10200250');
    
    creation(start,path,'s', x,y, 10,200,250, -10, false, false);
    prob-=(prob-.6)*.02;
    end = bdy.querySelector('.end');
    end.onmouseenter = onwin;
}

nextlevel();

start.onmouseenter=()=>{
    tid=setInterval(countdown,100);
    timediv.style.color='red';
    timediv.style.transform='scale(1.4)';
}
start.onmouseleave=()=>clearTime();
dlgpop.onclick=()=>dlgpop.close();
butyes.onmouseenter=()=>butyes.click();
butno.onmouseenter=()=>butno.click();
butre.onmouseenter=()=>butre.click();
butyes.onclick=()=>{
    setTimeout(()=>dlgre.close(),200);
    lev=1;
    prob=1;
    nextlevel(); // restart
}
butno.onclick=()=>setTimeout(()=>dlgre.close(),200);
butre.onclick=()=>{
    setTimeout(()=>dlgover.close(),200);
    lev=1;
    prob=1;
    nextlevel();
}
dlgpop.onanimationend=e=>{dlgpop.close();dlgpop.classList.remove('anipop');}
re.onmouseenter=()=>dlgre.showModal();

function countdown(){
    time-=.1;
    time=time.toFixed(1);
    timediv.innerHTML=''+time;
    if(time==0){
        clearTime();
        dlgover.showModal();
    }
}
function onwin(){
    clearTime();
    myalert('Level Completed')
    ++lev;
    setTimeout(()=>myalert('Level - '+ lev),1000);
    nextlevel();
}

function clearTime(){
    clearInterval(tid);
    timediv.style.color='lawngreen';
    timediv.style.transform='';
}

function myalert(txt){
	dlgpop.innerHTML=txt;
    dlgpop.classList.add('anipop');
    if(dlgpop.open) dlgpop.close();
	dlgpop.showModal();
}

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  setTimeout(()=>{
    alert(`This is a mini pc-game that uses mouse hover detection.
    On mobile/touch devices hover is equivalent to click which is not so fun playing.
    Use a pointing-device for better game play.`)
  },2000);
}

//preload
new Image().src="files/skull.png";
new Image().src="files/smile.png";


