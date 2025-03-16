//board
let board;  //access canvas tag
let boardwidth = 350; //dimensions are of the image background
let boardheight = 640;
let context; //drawing on our canvas


//bird
let birdwidth = 34; //width/height ratio 408/228 = 17/12 (size of the image of the bird)
let birdheight = 24; 
//bird's position
let birdX = boardwidth/8;
let birdY = boardheight/2;

let birdIMG;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height: birdheight
}

//pipes
let pipeArr = [];
let pipewidth = 64; // width/height ratio 384/3072 = 1/8
let pipeheight = 512; 
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let velocityX = -2; // pipes moving speed
let velocityY = 0; // bird jump speed
let gravity = 0.4; //gravity moves bird down


let gameover = false;
let score = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image 
    birdIMG = new Image();
    birdIMG.src = "./flappybird.png";
    birdIMG.onload = function() { // this actually loads the bird image
        context.drawImage(birdIMG, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2500); //call function place pipes every 2.5 seconds
    document.addEventListener("keydown", jumpBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0, board.width, board.height); //clears the previous frame

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y and cant go off the page
    context.drawImage(birdIMG, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){ //bird passes the height of the bird and falls down
        gameover = true;  // game is over
    }

    //pipes
    for(let i = 0; i < pipeArr.length; i++){
        let pipe = pipeArr[i];
        pipe.x += velocityX; //shifting the position of the pipes
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; //bc there are 2 pipes (0.5 * 2) = 1 
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameover = true;
        }
    }

    //clear pipes
    while(pipeArr.length > 0 && pipeArr[0].x < -pipewidth){
        pipeArr.shift(); //removes the first elem in the arr 
        //removes the pipes
    }

    //score
    context.fillStyle = "white";
    context.font= "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameover) {
        context.fillText("GAVE OVER", 5, 90);
    }
}

function placePipes() {
    if(gameover){
        return;
    }

    let randomPipeY = pipeY - pipeheight/4 - Math.random()*(pipeheight/2);

    let openingpspace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipewidth,
        height: pipeheight,
        passed: false
    }

    pipeArr.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openingpspace,
        width : pipewidth,
        height: pipeheight,
        passed: false

    }

    pipeArr.push(bottomPipe);
}

function jumpBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp"|| e.code== "KeyX"){
        //jump
        velocityY = -6;

        //reset game to the defaults
        if(gameover){
            bird.y = birdY;
            pipeArr = [];
            score = 0;
            gameover = false;
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}