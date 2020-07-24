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


document.addEventListener('DOMContentLoaded',function(){
    
    let start = document.getElementById('start'),hov = document.getElementById('clone').firstElementChild;
    let level = document.getElementById('level'),re = document.querySelector('.alt>div');
    let timediv = document.getElementById('timediv'),bdy = document.getElementById('bdy');
    let end = bdy.querySelector('.end');

    bdy.onerror=e=>alert(e)
    let h=bdy.offsetHeight, w=bdy.offsetWidth;

    function cango(dir,x,y){
        if(dir=='n')
            return y<60?0:1;
        if(dir=='s')
            return y>h-100?0:1;
        if(dir=='e')
            return x>w-100?0:1;
        if(dir=='w')
            return x<60?0:1;
        
    }

    
    let x,y,path=16,fakepath=10, prob=1, lev=1, time=30, tid;

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
                    creation(elem, fake?Math.trunc(path/2):path    , d1, x,y, red,g,b, rot, true, fake);//real
                    creation(elem, fake?Math.trunc(path/2):fakepath, d2, x,y, red,g,b, rot, true, true);//fake
                }
                else{
                    creation(elem, fake?Math.trunc(path/2):path    , d1, x,y, red,g,b, rot, true, true);//real
                    creation(elem, fake?Math.trunc(path/2):fakepath, d2, x,y, red,g,b, rot, true, fake);//fake
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
        path=16 + lev*5;
        fakepath=10 + lev*2;
        time = 18+lev*2;
        level.innerHTML='Level '+lev;
        timediv.innerHTML=''+time.toFixed(1);
        x=20+Math.trunc(Math.random()*(w-100));
        y=80+Math.trunc(Math.random()*(h-160));
        start.style.left=x+'px';
        start.style.top=y+'px';
        s.clear();
        s.add(x+','+y+',10200250');
        
        creation(start,path,'s', x,y, 10,200,250, -10, false, false);
        prob-=prob*.05;
    }

	nextlevel();
    
    function countdown(){
        time-=.1;
        time=time.toFixed(1);
        timediv.innerHTML=''+time;
        if(time==0){
            clearInterval(tid);
            // gameover();
            // restart();
        }
    }
    start.onmouseenter=()=>tid=setInterval(countdown,100);
    start.onmouseleave=()=>clearInterval(tid);

});