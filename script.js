// Created by Swarup Mahato


var coins = 0;
var mario,objects,keyspressed=[], t1=false, t2=false, t3=false, t4=false, t5=false, t6=false, t7=false, t8=false, t9=false, t10=false, height=0, jumpHeight=15, speed=5, maxJump=20, maxSpeed=8, contact=true,gravity=1, contact = [], currentAccel=0, lost = false, creatureSpeed=3, won = false, currentLevel = 0, levelsOpened = [0],clickedSHButton=0, lvlBonus=[20,25,30,40,50], cbSpeed=15;
var originalPosition = {};
let abcd = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al','am','an','ao','ap','aq','ar','as','at','au','av','aw','ax','ay','az','ba','bb','bc','ca','cb','cc','cd','ce','cf','cg','ch','ci','cj','ck','cl','cm','cn','co','cp','cq','cr','cs','ct','cu','cv','cw','cx','cy','cz','da','db','dc','dd','de','ea','eb','ec','ed','ee','ef','eg','eh','ei','ej','ek','el','em','en','eo','ep','eq','er','es','et','eu','ev','ew','ex','ey','ez','fa','fb','fc','fd','fe','ff','ga','gb','gc','gd','ge','gf','gg','gh','gi','gj','gk','gl','gm','gn','go','gp','gq','gr','gs','gt','gu','gv','gw','gx','gy','gz','ha','hb','hc','hd','he','hf','hg','hh'];

var alertShown = {
    0: ["THE THORNS", "These are hidden, and can be anywhere (both on land as well as boxes), if mario steps on these, they will come up and you will lose.", "<div id = 'thorns' class = 'spikes ill'></div>", false],
    1: ["FAKE LAND", "The fake lands work similar to thorns, they can only be on land, they look same as normal land but as the mario steps on it, it goes down and mario falls.", "<div id = 'fake-land' class = 'land ill'></div>", false],
    2: ["CREATURES", "The creatures will walk around, they have some money in their bags(10), you can take away that money from them by jumping over them and they will vanish, but if you touched them on their side, they will take all your coins from your bag, and you will die, these might seem cute but they are very greedy. These creatures are not heavy enough to trigger traps.", "<div id = 'creature-ill'></div>", false],
    3: ["CANNON", "The cannon balls are very dangerous, they will take 5 coins from your bag if they hit you and you will die. You cannot defeat a cannon, you will have to dodge its shots.", "<div id = 'cb-ill'></div><div id = 'cannon-ill'></div>",false],
    4: ["MOVING LAND", "The moving land can never have traps. They will constantly move in their particular path. You will have to keep on moving at their speed in order not to fall from them.", "<div id = 'ml-ill'></div>",false],
}
var creatures = {
    "cd": [2, "cb", "cc", false],
    "cx": [2, "cu", "cw", false],
    "ey": [3, "es", "ez", false],
    "gh": [4, "gi", "gj", false],
}

var cannonballs = {
    "ef": [3,"eb","eg",false],
    "et": [3, "eq", "eu", false],
    "ev": [3, "ep", "ew", false],
    "gu": [4, "gq", "gv", false],
    "he": [4, "gp", "hf", false],
}
var movingLand = {
    "gm": [4, "gn", 200, 0, 5],
    "gs": [4, "gq", 0, 200, 3],
    "hd": [4, "gx", 700, 0, 5],
}

window.onload = function() {
    document.getElementById("load").style.display = "none";
    mario = document.getElementsByClassName("mario");
    objects = document.getElementsByClassName("object");
    for (let i of abcd) {
        let el = document.getElementById(i)
        originalPosition[i] = [el.offsetLeft+"px",el.offsetTop+"px"];
    }
    let i =1,el=document.getElementsByClassName("game");
    while (el[i]) {
        el[i].style.display = "none";
        i++;
    }
    Alert("SHOP", "Welcome to the game 'MARIO'! Here there are 5 levels that you have to complete, you can control the mario by using the buttons on the screen ONLY for mobiles or the keys on your keyboard (ArrowLeft-to move left, ArrowRight-to move right, ArrowUp-to jump). Laptops/PC are recommended to play this game, as the area of vision increases a lot and also the controls are easier to handle. There are different types of obstacles that will come in your way, you might have to try the same level many times to know about all the trap placements. Please don't get furstrated playing this game, actually the real game is known to make players mad xD. You will have to have some patience to finish the game. The shop is a very important part of the game, you will have to keep upgrading your mario in order to complete higher levels easily, for that you will have to collect coins kept on your path, each coin has a value of 5 in the first level and it will subsequently increase by 5 in the next levels, you get huge coin bonuses when you complete levels. You can unlock all the levels in just 10 coisn from the market. In order to see how to complete the levels there videos also at the bottom of the shop. By the way, all the images seen in this game are drawn by Swarup Mahato(CEO and Founder of Swarupinfotech)!", "");
    document.getElementById("btn-left").addEventListener("touchstart", function() {
        if (!lost && !won && !t1) {
            t1 = setInterval(MoveLeft, 25);
        }
    });
    document.getElementById("btn-right").addEventListener("touchstart", function() {
        if (!lost && !won && !t2) {
            t2 = setInterval(MoveRight, 25);
        }
    });
    document.getElementById("btn-up").addEventListener("touchstart", function() {
        if (!lost && !won && checkContact().includes("down")) {
            MoveUp();
        }
    });
    document.getElementById("btn-left").addEventListener("touchend", function() {
        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
        clearInterval(t4);
        t4 = false;
        clearInterval(t1);
        t1 = false;
    });
    document.getElementById("btn-right").addEventListener("touchend", function() {
        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
        clearInterval(t4);
        t4 = false;
        clearInterval(t2);
        t2 = false;
    });
};

function CannonBallMovement() {
    for (let i of Object.keys(cannonballs)) {
        if (cannonballs[i][0] === currentLevel) {
            let el = document.getElementById(i), el2=document.getElementById(cannonballs[i][1]);
            if (el.offsetLeft >= el2.offsetLeft+el2.offsetWidth-Math.ceil(cbSpeed/2)-40 && el.offsetLeft <= el2.offsetLeft+el2.offsetWidth+Math.ceil(cbSpeed/2)-40) {
                el.style.left = document.getElementById(cannonballs[i][2]).offsetLeft+20+"px";
                cannonballs[i][3]=true;
                setTimeout(function() {cannonballs[i][3]=false;},1000);
            }
            else {
                if (!cannonballs[i][3]) {
                    el.style.left = el.offsetLeft-cbSpeed + "px";
                }
            }
        }
    }
}

function LandMovement() {
    for (let i of Object.keys(movingLand).filter((x)=>movingLand[x][0]==currentLevel)) {
        //document.write("hello");
        let el=document.getElementById(i),el2=document.getElementById(movingLand[i][1]);
        if (movingLand[i][2]!=0) {
            if (el.offsetLeft<=el2.offsetLeft+el2.offsetWidth) {
                movingLand[i][4] = Math.abs(movingLand[i][4]);
            }
            if (el.offsetLeft>=el2.offsetLeft+el2.offsetWidth+movingLand[i][2]) {
                movingLand[i][4] = -Math.abs(movingLand[i][4]);
            }
            el.style.left = el.offsetLeft+movingLand[i][4]+"px";
        }
        else {
            if (el.offsetTop<=el2.offsetTop+el2.offsetHeight) {
                movingLand[i][4] = Math.abs(movingLand[i][4]);
            }
            if (el.offsetTop>=el2.offsetTop+el2.offsetHeight+movingLand[i][3]) {
                movingLand[i][4] = -Math.abs(movingLand[i][4]);
            }
            el.style.top = el.offsetTop+movingLand[i][4]+"px";
        }
    }
}

function HardGame() {
    if (coins>=50) {
        coins-=50;
        Notif("All thorns disclosed.");
        let i = 0, el=document.getElementsByClassName("spikes");
        while (el[i]) {
            el[i].style.zIndex = "50";
            i++;
        }
        document.getElementById("hard-game").style.display = "none";
    }
    else {
        Notif("Not enough money");
    }
}

function FollowYes() {
    let el = document.getElementById("follow");
    el.style.backgroundColor = "transparent";
    el.innerHTML = "<div id='plus100'>+100</div>";
    el.style.opacity = "0";
    coins+=100;
    setTimeout(function() {
        el.style.display = "none";
    }, 1000)
}

function FollowNo() {
    document.getElementById("follow").style.display = "none";
}

function restartLevel() {
    OpenLevel(currentLevel);
}

function CreaturesMovement() {
    let x = Object.keys(creatures);
    for (let i of x) {
        if (creatures[i][0] == currentLevel) {
            let el = document.getElementById(i),el2=document.getElementById(creatures[i][1]),el3=document.getElementById(creatures[i][2]);
            if (el.offsetLeft >= el2.offsetLeft+el2.offsetWidth-Math.ceil(creatureSpeed/2) && el.offsetLeft <= el2.offsetLeft+el2.offsetWidth+Math.ceil(creatureSpeed/2)) {
                el.style.transform = "none";
            }
            else if (el.offsetLeft >= el3.offsetLeft-Math.ceil(creatureSpeed/2)-30 && el.offsetLeft <= el3.offsetLeft+Math.ceil(creatureSpeed/2)-30) {
                el.style.transform = "rotateY(180deg)";
            }
            if (el.style.transform != "rotateY(180deg)") {
                el.style.left = el.offsetLeft+creatureSpeed+"px";
            }
            else {
                el.style.left = el.offsetLeft-creatureSpeed+"px";
            }
        }
    }
}

function Alert(heading, text, illustration) {
    document.getElementById("alert-background").style.display = "block";
    document.getElementById("alert-background").style.opacity = "1";
    document.getElementById("alert-heading").innerHTML = heading;
    document.getElementById("alert-text").innerHTML = text;
    if (illustration != "") {
        document.getElementById("alert-illustration").innerHTML = illustration;
        document.getElementById("alert-illustration").style.display = "block";
        document.getElementById("alert-text").style.height = "calc(100vh - 200px - 150px - 70px - 10px)";
    }
    else {
        document.getElementById("alert-illustration").style.display = "none";
        document.getElementById("alert-text").style.height = "calc(100vh - 200px - 150px)";
    }
}

const Close = () => {
    document.getElementById("alert-background").style.display = "none";
    document.getElementById("alert-background").style.opacity = "0";
}

setInterval(function() {
    document.getElementById("coins-count").innerHTML = `Coin balance:  ${coins}`;
}, 200);

function OpenShop() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("shop").style.display = "block";
    document.getElementById("speed-bar").style.width = speed/maxSpeed*100+"%";
    document.getElementById("jump-bar").style.width = jumpHeight/maxJump*100+"%";
}

function CloseShop() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("shop").style.display = "none";
}

function ShowHideButton() {
    clickedSHButton++;
    if (clickedSHButton%2) {
        document.getElementById("show-hide-btn").innerHTML = "SHOW BUTTONS";
        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("controls")[i].style.top = "100vh";
        }
    }
    else {
        document.getElementById("show-hide-btn").innerHTML = "HIDE BUTTONS";
        for (let i = 0; i < 3; i++) {
            if (i<2) {
                document.getElementsByClassName("controls")[i].style.top = "calc(100vh - 70px)";
            }
            else {
                document.getElementsByClassName("controls")[i].style.top = "calc(100vh - 140px)";
            }
        }
    }
}

function UnlockLevels() {
    if (coins >= 10) {
        coins-=10
        Notif("All levels unlocked!")
        document.getElementById("shop-unlock").style.display = "none";
        levelsOpened = [0,1,2,3,4];
        for (let i = 0; i < 5; i++) {
            let lvl = document.getElementsByClassName("lvl")[i];
            if (lvl.style.backgroundImage == 'url("https://drive.google.com/thumbnail?id=1i12uzb_yh6d2h2krRrc5rQRuNdpBPENb")') {
                lvl.style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1PG4nGFDphbA7WTmnWq2jtKGatXm1sEf7')";
            }
        }
    }
    else {
        Notif("Not enough money.");
    }
}

function speedInc() {
    let cost = document.getElementById("speed-inc-cost");
    if (cost.innerHTML <= coins && speed < maxSpeed) {
        coins-=cost.innerHTML;
        cost.innerHTML*=2;
        speed+=0.5;
        document.getElementById("speed-bar").style.width = speed/maxSpeed*100+"%";
    }
    else if (cost.innerHTML > coins) {
        Notif("Not enough money.")
    }
    else {
        Notif("max level reached.")
    }
}

function Progress() {
    let el = document.getElementsByClassName("flag")[currentLevel];
    let progress = (parseInt(originalPosition[el.id][0])-el.offsetLeft+50)/(parseInt(originalPosition[el.id][0])-document.getElementsByTagName("body")[0].offsetWidth*0.3)*100;
    document.getElementById("progress").style.width = progress+"%";
}

function jumpInc() {
    let cost = document.getElementById("jump-inc-cost");
    if (cost.innerHTML <= coins && jumpHeight < maxJump) {
        coins-=cost.innerHTML;
        cost.innerHTML=+cost.innerHTML+30;
        jumpHeight+=0.5;
        document.getElementById("jump-bar").style.width = jumpHeight/maxJump*100+"%";
    }
    else if (cost.innerHTML > coins) {
        Notif("Not enough money.")
    }
    else {
        Notif("Max level reached.")
    }
}

function Notif(a) {
    let n = document.getElementById("notif");
    n.innerHTML = a;
    n.style.display = "block";
    n.style.opacity = "1";
    setTimeout(function() {
        setTimeout(function() {
            n.style.display = "none";
        },500);
        n.style.opacity = "0";
    },2000)
}

function OpenLevel(x) {
    if (levelsOpened.includes(x)) {
        currentLevel = x;
        document.getElementById("menu").style.display = "none";
        let game = document.getElementsByClassName("game"), i = 0;
        while (game[i]) {
            game[i].style.display = "none";
            i++;
        }
        game[currentLevel].style.display = "block";
        document.getElementById("lost").style.top = "100vh";
        document.getElementById("won").style.top = "100vh";
        document.getElementById("dark").style.opacity = "0";
        lost = false;
        won = false;
        returnToOriginalPosition();
        if (!t5) {
            t5 = setInterval(Gravity, 25);
        }
        if (!t3) { 
            t3 = setInterval(AfterLost, 500);
        }
        if (!t6) {
            t6 = setInterval(AfterWon, 500);
        }
        if (!t7) {
            t7 = setInterval(Progress, 100);
        }
        if (!t8) {
            t8 = setInterval(CreaturesMovement, 50);
        }
        if (!t9) {
            t9 = setInterval(CannonBallMovement, 40);
        }
        if (!t10) {
            t10 = setInterval(LandMovement, 50);
        }
        mario[currentLevel].style.top = "60vh";
        if (alertShown[currentLevel][3] == false) {
            let x = alertShown[currentLevel];
            Alert(...x.slice(0,3));
            alertShown[currentLevel][3] = true;
        }
        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("controls")[i].style.display = "block";
        }
        document.getElementById("show-hide-btn").style.display = "block";
    }
}

function NextLevel() {
    currentLevel++;
    OpenLevel(currentLevel);
}

function ShowMenu() {
    document.getElementsByClassName("lvl")[Math.max(...levelsOpened)].style.backgroundImage = 'url("https://drive.google.com/thumbnail?id=1PG4nGFDphbA7WTmnWq2jtKGatXm1sEf7")';
    document.getElementById("menu").style.display = "block";
    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName("controls")[i].style.display = "none";
    }
    document.getElementById("show-hide-btn").style.display = "none";
    clearInterval(t7);
    t7 = false;
    clearInterval(t8);
    t8 = false;
    clearInterval(t9);
    t9 = false;
    clearInterval(t10);
    t10 = false;
}

function AfterLost() {
    if (mario[currentLevel].offsetTop >= document.getElementsByTagName("body")[0].offsetHeight) {
        clearInterval(t5);
        t5 = false;
        document.getElementById("lost").style.top = "0";
        document.getElementById("dark").style.opacity = "0.7";
        clearInterval(t3);
        t3 = false;
        clearInterval(t6);
        t6 = false;
    }
}

function AfterWon() {
    if (document.getElementsByClassName("flag")[currentLevel].offsetTop == Math.round(document.getElementsByTagName("body")[0].offsetHeight*0.6)) {
        clearInterval(t5);
        t5 = false;
        document.getElementById("won").style.top = "0";
        document.getElementsByClassName("next-lvl")[0].style.display = "block";
        document.getElementById("dark").style.opacity = "0.7";
        clearInterval(t3);
        t3 = false;
        clearInterval(t6);
        t6 = false;
        if (currentLevel != 4) {
            levelsOpened.push(currentLevel+1);
        }
        else {
            document.getElementsByClassName("next-lvl")[0].style.display = "none";
            document.getElementsByClassName("lvl")[currentLevel].style.backgroundImage = 'url("https://drive.google.com/thumbnail?id=1fAyA76nBef2L3I1F-CA4HxWyIVxNr1TH")';
        }
        document.getElementsByClassName("lvl")[currentLevel].style.backgroundImage = 'url("https://drive.google.com/thumbnail?id=1fAyA76nBef2L3I1F-CA4HxWyIVxNr1TH")';
        coins+=lvlBonus[currentLevel];
        lvlBonus[currentLevel] = 0;
    }
}

function Replay() {
    document.getElementById("lost").style.top = "100vh";
    document.getElementById("won").style.top = "100vh";
    document.getElementById("dark").style.opacity = "0";
    document.getElementsByClassName("flag")[currentLevel].style.top = "calc(60vh - 50px)";
    lost = false;
    won = false;
    returnToOriginalPosition();
    setTimeout(function() {
        t5 = setInterval(Gravity, 25);
        t3 = setInterval(AfterLost, 500);
        t6 = setInterval(AfterWon, 500);
        mario[currentLevel].style.top = "60vh";
    }, 1000);
}

function returnToOriginalPosition() {
    let keys = Object.keys(originalPosition), values = Object.values(originalPosition);
    for (let i=0; i < keys.length; i++) {
        document.getElementById(keys[i]).style.left = values[i][0];
        document.getElementById(keys[i]).style.top = values[i][1];
    }
}

window.addEventListener("keydown", function(e) {
    keyspressed.push(e.key);
    if (!lost && !won && keyspressed.includes("ArrowLeft") && !t1) {
        t1 = setInterval(MoveLeft, 25);
    }
    if (!lost && !won && keyspressed.includes("ArrowRight") && !t2) {
        t2 = setInterval(MoveRight, 25);
    }
    if (!lost && !won && keyspressed.includes("ArrowUp") && checkContact().includes("down")) {
        MoveUp()
    }
    keyspressed.splice(keyspressed.indexOf(e.key), 1);
});

window.addEventListener("keyup", function(e) {
    if (e.key != "ArrowUp") {
        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
        clearInterval(t4);
        t4 = false;
    }
    if (e.key == "ArrowLeft") {
        clearInterval(t1);
        t1 = false;
    }
    if (e.key == "ArrowRight") {
        clearInterval(t2);
        t2 = false;
    }
});

function CoinTouched(x,y,z=5+5*currentLevel) {
    var plusTen = document.getElementById("plus-ten");
    plusTen.style.left = x;
    plusTen.style.top = y;
    plusTen.innerHTML = "+"+z;
    plusTen.style.display = "block";
    plusTen.style.opacity = "1";
    setTimeout(function() {
        plusTen.style.top = plusTen.offsetTop-50 + "px";
        plusTen.style.opacity = "0";
        setTimeout(function() {plusTen.style.display = "none";},500);
    }, 500)
}

function checkContact() {
    let i = 0;
    contact = [];
    while (objects[i]) {
        if (document.getElementsByClassName("game")[currentLevel].contains(objects[i])) {
            if (!lost && mario[currentLevel].offsetTop >= objects[i].offsetTop-51-currentAccel/2-(objects[i].classList.contains("up-down") ? 3 : 0) && mario[currentLevel].offsetTop <= objects[i].offsetTop-49+currentAccel/2+(objects[i].classList.contains("up-down") ? 3 : 0) && mario[currentLevel].offsetLeft > objects[i].offsetLeft-35 && mario[currentLevel].offsetLeft < objects[i].offsetLeft+objects[i].offsetWidth-15 && currentAccel >= 0) {
                if (objects[i].classList.contains("coin")) {
                    CoinTouched(objects[i].offsetLeft+"px", objects[i].offsetTop+"px");
                    coins+=5+5*currentLevel;
                    objects[i].style.top = "-50px";
                    objects[i].style.left = "0";
                    originalPosition[objects[i].id] = ["0", "-50px"];
                }
                else if (objects[i].classList.contains("creature")) {
                    if (!creatures[objects[i].id][3]) {
                        coins+=10;
                        CoinTouched(objects[i].offsetLeft+"px", objects[i].offsetTop+"px", 10);
                        creatures[objects[i].id][3] = true;
                    }
                    objects[i].style.top = "-50px";
                    objects[i].style.left = "0";
                }
                else if (objects[i].classList.contains("cannonball")) {
                    if (coins>=5) {coins-=5;}
                    currentAccel = -jumpHeight;
                    mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                    mario[currentLevel].style.top = objects[i].offsetTop-50+currentAccel+"px";
                    clearInterval(t1);
                    clearInterval(t2);
                    clearInterval(t4);
                    t1 = t2 = t4 = false;
                    lost = true;
                }
                else {
                    contact.push("down");
                    mario[currentLevel].style.top = objects[i].offsetTop-50+"px";
                    if (objects[i].classList.contains("spikes")) {
                        currentAccel = -jumpHeight;
                        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                        mario[currentLevel].style.top = objects[i].offsetTop-50+currentAccel+"px";
                        objects[i].style.top = objects[i].offsetTop-50+"px";
                        clearInterval(t1);
                        clearInterval(t2);
                        clearInterval(t4);
                        t1 = t2 = t4 = false;
                        lost = true;
                    }
                    if (objects[i].classList.contains("weak-land")) {
                        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                        objects[i].style.top = "100vh";
                        clearInterval(t1);
                        clearInterval(t2);
                        clearInterval(t4);
                        t1 = t2 = t4 = false;
                        lost = true;
                    }
                }
            }
            if (!lost && !won && mario[currentLevel].offsetTop >= objects[i].offsetTop+objects[i].offsetHeight+currentAccel/2 && mario[currentLevel].offsetTop <= objects[i].offsetTop+objects[i].offsetHeight-currentAccel/2 && mario[currentLevel].offsetLeft > objects[i].offsetLeft-35 && mario[currentLevel].offsetLeft < objects[i].offsetLeft+objects[i].offsetWidth-15 && currentAccel <= 0) {
                if (objects[i].classList.contains("coin")) {
                    coins+=5+5*currentLevel;
                    CoinTouched(objects[i].offsetLeft+"px", objects[i].offsetTop+"px");
                    objects[i].style.top = "-50px";
                    objects[i].style.left = "0";
                    originalPosition[objects[i].id] = ["0", "-50px"];
                }
                else {
                    contact.push("up");
                    mario[currentLevel].style.top = objects[i].offsetTop+objects[i].offsetHeight+1+"px";
                    currentAccel = 0;
                }   
            }
            if (!lost && !won && Object.values(cannonballs).map((x)=>x[0]).includes(currentLevel)) {
                for (let i of Object.keys(cannonballs).filter((x)=>cannonballs[x][0]==currentLevel)) {
                    let el = document.getElementById(i);
                    if (mario[currentLevel].offsetLeft >= el.offsetLeft-50 && mario[currentLevel].offsetLeft <= el.offsetLeft-20 && mario[currentLevel].offsetTop >= el.offsetTop-30 && mario[currentLevel].offsetTop <= el.offsetTop+30) {
                        if (coins>=5) {coins-=5;}
                        currentAccel = -jumpHeight;
                        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                        mario[currentLevel].style.top = objects[i].offsetTop-50+currentAccel+"px";
                        clearInterval(t1);
                        clearInterval(t2);
                        clearInterval(t4);
                        t1 = t2 = t4 = false;
                        lost = true;
                    }
                }
            }
            if (!lost && !won && mario[currentLevel].offsetLeft >= objects[i].offsetLeft-35-Math.ceil(speed/2) && mario[currentLevel].offsetLeft <= objects[i].offsetLeft-35+Math.ceil(speed/2) && mario[currentLevel].offsetTop >= objects[i].offsetTop-49+currentAccel/2 && mario[currentLevel].offsetTop <= objects[i].offsetTop+objects[i].offsetHeight-1-currentAccel/2) {
                if (objects[i].classList.contains("coin")) {
                    coins+=5+5*currentLevel;
                    CoinTouched(objects[i].offsetLeft+"px", objects[i].offsetTop+"px");
                    objects[i].style.top = "-50px";
                    objects[i].style.left = "0";
                    originalPosition[objects[i].id] = ["0", "-50px"];
                }
                else if (objects[i].classList.contains("creature")) {
                    coins = 0;
                    currentAccel = -jumpHeight;
                    mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                    mario[currentLevel].style.top = mario.offsetTop+currentAccel+"px";
                    clearInterval(t1);
                    clearInterval(t2);
                    clearInterval(t4);
                    t1 = t2 = t4 = false;
                    lost = true;
                }
                else {                
                    mario[currentLevel].style.left = objects[i].offsetLeft-35+"px";
                    contact.push("right");
                    if (objects[i].classList.contains("end")) {
                        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                        mario[currentLevel].style.top = "calc(60vh)";
                        setTimeout(function() {
                            mario[currentLevel].style.top = "calc(60vh)";
                        }, 50);
                        clearInterval(t5);
                        t5 = false;
                        document.getElementsByClassName("flag")[currentLevel].style.top = "calc(60vh)";
                        won = true;
                        clearInterval(t1);
                        clearInterval(t2);
                        clearInterval(t4);
                        t1 = t2 = t4 = false;
                    }
                }
            }
            if (!lost && !won && mario[currentLevel].offsetLeft >= objects[i].offsetLeft+objects[i].offsetWidth-15-Math.ceil(speed/2) && mario[currentLevel].offsetLeft <= objects[i].offsetLeft+objects[i].offsetWidth-15+Math.ceil(speed/2) && mario[currentLevel].offsetTop >= objects[i].offsetTop-49+currentAccel/2 && mario[currentLevel].offsetTop <= objects[i].offsetTop+objects[i].offsetHeight-1-currentAccel/2) {
                if (objects[i].classList.contains("coin")) {
                    coins+=5+5*currentLevel;
                    CoinTouched(objects[i].offsetLeft+"px", objects[i].offsetTop+"px");
                    objects[i].style.top = "-50px";
                    objects[i].style.left = "0";
                    originalPosition[objects[i].id] = ["0", "-50px"];
                }
                else if (objects[i].classList.contains("creature")) {
                    coins=0;
                    currentAccel = -jumpHeight;
                    mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
                    mario[currentLevel].style.top = mario.offsetTop+currentAccel+"px";
                    clearInterval(t1);
                    clearInterval(t2);
                    clearInterval(t4);
                    t1 = t2 = t4 = false;
                    lost = true;
                }
                else {
                    mario[currentLevel].style.left = objects[i].offsetLeft+objects[i].offsetWidth-15+"px";
                    contact.push("left");
                }
            }
        }
        i++;
    }
    return contact;
}

function MoveLeft() {
    mario[currentLevel].style.transform = "rotateY(180deg)";
    if (!t4) {
        t4 = setInterval(Walk, 200);
        mario[currentLevel].style.backgroundImage = "url('https://i.ibb.co/NnZ6LWj/mario.png')";
        setTimeout(function() {
            mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
        }, 100);
    }
    if (!checkContact().includes("left")) {
        let i = 0;
        while (objects[i]) {
            objects[i].style.left = `${objects[i].offsetLeft+speed}px`;
            i++;
        }
    }
}

function MoveRight() {
    mario[currentLevel].style.transform = "none";
    if (!t4) {
        mario[currentLevel].style.backgroundImage = "url('https://i.ibb.co/NnZ6LWj/mario.png')";
        setTimeout(function() {
            mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
        }, 100);
        t4 = setInterval(Walk, 200);
    }
    if (!checkContact().includes("right")) {
        let i = 0;
        while (objects[i]) {
            objects[i].style.left = `${objects[i].offsetLeft-speed}px`;
            i++;
        }
    }
}

function MoveUp() {
    mario[currentLevel].style.top = `${mario[currentLevel].offsetTop-jumpHeight}px`;
    currentAccel = -jumpHeight;
}

function Gravity() {
    if (!checkContact().includes("down") || lost) {
        currentAccel+=gravity;
        mario[currentLevel].style.top = mario[currentLevel].offsetTop+currentAccel+"px";
    }
    else {
        currentAccel = 0;
    }
}

function Walk() {
    mario[currentLevel].style.backgroundImage = "url('https://i.ibb.co/NnZ6LWj/mario.png')";
    setTimeout(function() {
        mario[currentLevel].style.backgroundImage = "url('https://drive.google.com/thumbnail?id=1Y2USixLoQlYpEHiONc3vTJfLcP5UZMV4')";
    }, 100)
}