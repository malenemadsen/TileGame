let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d'); 

//Images
let floor = new Image(); 
floor.src= 'images/floor.png'; 

let wall = new Image(); 
wall.src= 'images/wall.png'; 

let player = new Image(); 
player.src= 'images/player.png'; 

let goal = new Image(); 
goal.src= 'images/goal.png'; 

let wcpaper = new Image(); 
wcpaper.src= 'images/wcpaper.png'; 

//Level 1 (2-dimensionally array)
let maze = 
[
    [0,1,0,0,0,1,0,0,0,1,0,0],
    [0,1,0,4,1,1,0,1,1,1,4,0],
    [0,1,0,0,0,1,0,1,0,0,0,0],
    [1,1,1,1,1,1,0,1,0,1,1,3],
    [0,0,0,0,1,1,1,1,0,1,0,0],
    [1,1,4,0,1,0,1,0,0,1,0,4],
    [1,0,0,0,1,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1],
    [1,0,0,0,4,0,1,1,1,1,0,0],
    [2,1,1,0,0,0,1,0,0,1,1,1],
    [0,0,1,1,1,1,1,1,0,0,0,4],
    [1,1,1,0,0,0,0,1,1,1,0,0]
]

//Other varibels
let tileSize = 40;                               //The size of the induvidul tile
let empty=[];                                    //Empty array 
let result;                                      //The outcome message 
let htmlText = document.querySelector('#moves'); //Gets the moves id from the html
let moves = 100;                                 //Amount of moves you starts out with 
let oneMove = 1;                                 //The amount of points you are gonna lose pr. move


//Jeg ved ikke hvorfor den hedder 11 (i den orginale var det 9)
let playerPosition = {x:11, y:11};


function drawMaze(){

    for(let y= 0; y < maze.length; y++){
      for(let x = 0; x < maze[y].length; x++){
        if(maze[y][x] === 0){ //Wall
            ctx.drawImage(wall,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === 1){ //Floor
            ctx.drawImage(floor,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === 2){ //Player
            playerPosition = { y, x}; 
            ctx.drawImage(player,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === 3){ //Goal
            ctx.drawImage(goal,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === 4){ //Toilet Paper
            ctx.drawImage(wcpaper,x*tileSize,y*tileSize,tileSize,tileSize);
        }
      }
    }
}

//Sounds
function walk(){
    let gameSound = new Audio('gamesounds/walk.mp3');
    gameSound.play();
}

function bump(){
    let gameSound = new Audio('gamesounds/headbump.mp3');
    gameSound.play();
}

function point(){
    let gameSound = new Audio('gamesounds/point.mp3');
    gameSound.play();
}

function finish(){
    let gameSound = new Audio('gamesounds/goal.mp3');
    gameSound.play();
}

function lose(){
    let gameSound = new Audio('gamesounds/lose.mp3');
    gameSound.play();
}

window.addEventListener("keydown", (e)=>{
movesCountdown();
switch(e.keyCode){

    case 37: // left
    if(maze[playerPosition.y][playerPosition.x -1] === 1){
       maze[playerPosition.y ][playerPosition.x -1] = 2             //players position
       maze[playerPosition.y ][playerPosition.x] = 1                //players new position
       drawMaze();                                                  //Redeaws the maze after movement
       walk();                                                      //calls function with sound when the player moves
    }else if(maze[playerPosition.y][playerPosition.x -1] === 0){    //Player walks in to a wall
        bump();                                                     //Plays a bump sound when player walks in to a wall (moves in to a 0 tile)
        missedPaper();                                              //Runs the function 
    }else if(maze[playerPosition.y][playerPosition.x -1] === 4){    //Player walks in to toilet paper
        point();                                                    //Plays sound
        maze[playerPosition.y][playerPosition.x -1] =2;             //Players position
        maze[playerPosition.y][playerPosition.x] =1;                //Player gets new positon and toilet paper tile becomes floor
        drawMaze();   
    }else if(maze[playerPosition.y][playerPosition.x -1] === 3){    //Player walks in to the goal  
        toiletPaper();                                              //Runs the function, sound is played in the function this time, becouse of too outcomes                
    }
    break; 

    case 38: // up
    if(maze[playerPosition.y -1][playerPosition.x] === 1){
       maze[playerPosition.y -1 ][playerPosition.x] = 2
       maze[playerPosition.y ][playerPosition.x] = 1
       drawMaze();
       walk();
    }else if(maze[playerPosition.y-1][playerPosition.x] === 0){
        bump();
        missedPaper(); 
    }else if(maze[playerPosition.y-1][playerPosition.x] === 4){
        point();
        maze[playerPosition.y-1][playerPosition.x] =2;
        maze[playerPosition.y][playerPosition.x] =1;
        drawMaze();
    }else if(maze[playerPosition.y-1][playerPosition.x] === 3){
        toiletPaper();
    }
    break; 

    case 39: // right
    if(maze[playerPosition.y][playerPosition.x +1] === 1){
       maze[playerPosition.y ][playerPosition.x +1] = 2
       maze[playerPosition.y ][playerPosition.x] = 1
       drawMaze();
       walk();
    }else if(maze[playerPosition.y][playerPosition.x +1] === 0){
        bump();
        missedPaper(); 
    }else if(maze[playerPosition.y][playerPosition.x +1] === 4){
        point();
        maze[playerPosition.y][playerPosition.x +1] =2;
        maze[playerPosition.y][playerPosition.x] =1;
        drawMaze();
    }else if(maze[playerPosition.y][playerPosition.x +1] === 3){
        toiletPaper();
    }
    break; 

    case 40: // down
    if(maze[playerPosition.y+1][playerPosition.x] === 1){
       maze[playerPosition.y+1 ][playerPosition.x] = 2
       maze[playerPosition.y ][playerPosition.x] = 1
       drawMaze();
       walk();
    }else if(maze[playerPosition.y+1][playerPosition.x] === 0){
        bump();
        missedPaper(); 
    }else if(maze[playerPosition.y+1][playerPosition.x] === 4){
        point();
        maze[playerPosition.y+1][playerPosition.x] =2;
        maze[playerPosition.y][playerPosition.x] =1;
        drawMaze();
    }else if(maze[playerPosition.y+1][playerPosition.x] === 3){
        toiletPaper();
    }
    break; 
}
})

function toiletPaper(){                      //A function that checks if you got all the toilet paper
    for(y = 0; y<maze.length; y++){ 
        for(x = 0; x<maze[y].length; x++){
            if (maze[y][x] === 4){           // 4 = toilet paper
            empty = [y,x]; break;
            }
        }
    }
    if(typeof empty[0] == "undefined"){      //Checks if all the toilet paper is piced up  
        finish();//sound
        result = "Congratulation Karen.. You got enough toilet paper to get through the pandemic (and years to come) with " + moves + " moves to spare.";
        setTimeout(theEnd, 100);;
    } else {
        lose();//Sound
        result="Sorry, you dind't get enough toliet paper to survive the pandemic.";
        setTimeout(theEnd, 100);
    }
}

function missedPaper() {                                                                          //Functin when player runs in to the toilet paper tile
    wcpaper.src = floor.src;                                                                      //Switches the toilet paper tile to a floor tile, when the function runs
    drawMaze();                                                                                   //Makes sure that the maze is "drawen" with the new image
    result = "God dammit Karen!! You went the wrong way and missed out on all the toilet paper! " //Alert message
    setTimeout(theEnd, 100);                                                                      //setTimeout makes sure that the game is over and you get the message, time is set to 100 so the sound have time to be played before alert
}

function movesCountdown(){                                         //Function that countdown moves
    moves -= oneMove;                                              //Substracts one move from the total(orginal 100) every time you move
    htmlText.innerHTML = moves;                                    //Puts the information in to the html file
    if (moves <= 0) {                                              //If the moves get to 0 its game over(<= less than or equal to)
        lose();//Sound                                             //Plays the loser sound
        result = "You are out of moves and soon toilet paper too!" //Result will be shown (its called throug theEnd finction)
        setTimeout(theEnd, 100);
    }
}

function theEnd() {               
    alert(result);                                                 //An alert pops op with the result
    location.reload();                                             //Reloades the page after the alert
}

window.addEventListener("load", drawMaze);
window.addEventListener("load", movesCountdown);