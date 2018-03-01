window.onload = init;

//game mode viz. single-player or multi-player
function init() {
    matches = 0;
    p = document.querySelector("p");
    p.innerHTML = "How would you like to play?";
    buttons = document.querySelectorAll("button");
    buttons[0].innerHTML = "One Player";
    buttons[0].onclick = singlePlayer;
    buttons[1].innerHTML = "Two Player";
    buttons[1].onclick = multiPlayer;
}

function singlePlayer() {
    p.innerHTML = "Choose the level of difficulty!";
    buttons[0].innerHTML = "Beginner";
    buttons[1].innerHTML = "Expert";
    buttons[2].setAttribute("style", "display: all;");
    buttons[2].onclick = function() {
        this.setAttribute("style", "display: none;");
        mode = null;
        init();
    };
    for(var i=0; i<buttons.length-1; i++)
        buttons[i].onclick = function() {
            mode = this.innerHTML;
            p.innerHTML = "Would you like to be X or O?";
            buttons[0].innerHTML = "X";
            buttons[1].innerHTML = "O";
            buttons[2].onclick = singlePlayer;
            for(var i=0; i<buttons.length-1; i++)
                buttons[i].onclick = function() {
                    gameplay(this.innerHTML);
                };
        };
}

function multiPlayer() {
    p.innerHTML = "Player 1, would you like X or O?";
    buttons[0].innerHTML = "X";
    buttons[1].innerHTML = "O";
    buttons[2].setAttribute("style", "display: all;");
    buttons[2].onclick = function() {
        this.setAttribute("style", "display: none;");
        init();
    };
    for(var i=0; i<buttons.length-1; i++)
        buttons[i].onclick = function() {
            gameplay(this.innerHTML);
        };
}

//setting the stage for the game
function gameplay(choice) {
    var welcome = document.getElementById("welcome");
    var info = document.getElementById("info");
    var board = document.getElementById("board");
    var reset = document.querySelector("i");
    reset.onclick = function() {
        welcome.setAttribute("style", "display: all;");
        info.setAttribute("style", "display: none;");
        board.setAttribute("style", "display: none;");
        buttons[2].setAttribute("style", "display: none;");
        var update = document.getElementsByClassName("player")[0];
        update.innerHTML = "Player1: 0 <br>Player2: 0";
        clearBoard(false);
        init();
    };
    welcome.setAttribute("style", "display: none;");
    info.setAttribute("style", "display: all;");
    board.setAttribute("style", "display: all;");
    if(p.innerHTML.indexOf("1")<0){
        update = document.getElementsByClassName("player")[0];
        update.innerHTML = "You: 0 <br>Computer: 0";
        dialogue = document.getElementsByClassName("dialogue")[0];
        dialogue.innerHTML = "your turn!";
        single(choice);
    }
    else{
        update = document.getElementsByClassName("player")[0];
        update.innerHTML = "Player1: 0 <br>Player2: 0";
        dialogue = document.getElementsByClassName("dialogue")[0];
        dialogue.innerHTML = "player1's turn!";
        multi(choice);
    }
}

//singleplayer game model
function single(choice) {
    if(mode === "Beginner")
        dummy(choice);
    else
        genius(choice);
}

//beginner model
function dummy(choice) {
    initialWeapon = choice;
    var you = [];
    var computer = [];
    var index = [];
    var freeSpace = [];
    var virtualChoice;
    var nextMove = true;
    count = 0;
    matches++;
    var grid = document.querySelectorAll("td");
    if(matches%2 === 0)
        dummyComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer);
    for(var i=0; i<grid.length; i++)
        grid[i].onclick = function(){
            count++;
            if(matches%2===1)
                (count%2 === 1)?view(count%2+1, "single"):view(count%2+1, "single");
            else
                (count%2 === 1)?view(count%2, "single"):view(count%2+2, "single");
            index.push(this.className.match(/cell\d/g)[0].match(/\d/g).map(function(item){
                return Number(item);
            })[0]);
            this.innerHTML = choice;
            you.push(this.className.match(/\d/g).map(function(item){
                return Number(item);
            }).slice(0,2));
            if(count >= 5)
                nextMove = check(you, "single");
            setTimeout(function(){
                if(nextMove){
                    dummyComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer);
                    if(count >= 5)
                        check(computer, "single");
                }
            }, 300);
            this.onclick = function() {
                var thisGrid = this;
                var originalClass = this.className;
                this.setAttribute("class", "animated shake " + this.className);
                setTimeout(function(){
                    thisGrid.setAttribute("class", originalClass);
                }, 300);
            };
        };
}

//expert model
function genius(choice) {
    initialWeapon = choice;
    var you = [];
    var computer = [];
    var index = [];
    var freeSpace = [];
    var virtualChoice;
    var nextMove = true;
    count = 0;
    matches++;
    var grid = document.querySelectorAll("td");
    if(matches%2 === 0)
        geniusComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer);
    for(var i=0; i<grid.length; i++)
        grid[i].onclick = function(){
            count++;
            if(matches%2===1)
                (count%2 === 1)?view(count%2+1, "single"):view(count%2+1, "single");
            else
                (count%2 === 1)?view(count%2, "single"):view(count%2+2, "single");
            index.push(this.className.match(/cell\d/g)[0].match(/\d/g).map(function(item){
                return Number(item);
            })[0]);
            this.innerHTML = choice;
            you.push(this.className.match(/\d/g).map(function(item){
                return Number(item);
            }).slice(0,2));
            if(count >= 5)
                nextMove = check(you, "single");
            setTimeout(function(){
                if(nextMove){
                    geniusComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer);
                    if(count >= 5)
                        check(computer, "single");
                }
            }, 300);
            this.onclick = function() {
                var thisGrid = this;
                var originalClass = this.className;
                this.setAttribute("class", "animated shake " + this.className);
                setTimeout(function(){
                    thisGrid.setAttribute("class", originalClass);
                }, 300);
            };
        };
}

function dummyComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer) {
    count++;
    if(matches%2===1)
        (count%2 === 1)?view(count%2+1, "single"):view(count%2+1, "single");
    else
        (count%2 === 1)?view(count%2, "single"):view(count%2+2, "single");
    for(var j=0; j<grid.length; j++)
        if(index.indexOf(j)<0)
            freeSpace.push(j);
    virtualChoice = freeSpace[Math.floor(Math.random()*freeSpace.length)];
    while(freeSpace.length>0)
        freeSpace.pop();
    index.push(virtualChoice);
    if(virtualChoice !== undefined){
        grid[virtualChoice].innerHTML = (choice==="X"?"O":"X");
        computer.push(grid[virtualChoice].className.match(/\d/g).map(function(item){
            return Number(item);
        }).slice(0,2));
        grid[virtualChoice].onclick = function() {
            var thisGrid = this;
            var originalClass = this.className;
            this.setAttribute("class", "animated shake " + this.className);
            setTimeout(function(){
                thisGrid.setAttribute("class", originalClass);
            }, 300);
        };
    }
}

function geniusComputerTurn(grid, index, choice, virtualChoice, freeSpace, computer) {
    var possibleWin = [
                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],
                        [0, 4, 8],
                        [6, 4, 2],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8]
                    ];
    count++;
    if(matches%2===1)
        (count%2 === 1)?view(count%2+1, "single"):view(count%2+1, "single");
    else
        (count%2 === 1)?view(count%2, "single"):view(count%2+2, "single");
    for(var j=0; j<grid.length; j++)
        if(index.indexOf(j)<0)
            freeSpace.push(j);
    //virtualChoice is all that matter now to build this game!!!
    virtualChoice = freeSpace[Math.floor(Math.random()*freeSpace.length)];
    //will complete once both the idea and inspiration strikes
    while(freeSpace.length>0)
        freeSpace.pop();
    index.push(virtualChoice);

    if(virtualChoice !== undefined){
        grid[virtualChoice].innerHTML = (choice==="X"?"O":"X");
        computer.push(grid[virtualChoice].className.match(/\d/g).map(function(item){
            return Number(item);
        }).slice(0,2));
        grid[virtualChoice].onclick = function() {
            var thisGrid = this;
            var originalClass = this.className;
            this.setAttribute("class", "animated shake " + this.className);
            setTimeout(function(){
                thisGrid.setAttribute("class", originalClass);
            }, 300);
        };
    }
}

//multiplayer game model
function multi(choice) {
    initialWeapon = choice;
    var player1= [];
    var player2 = [];
    count = 0;
    matches++;
    var grid = document.querySelectorAll("td");
    for(var i=0; i<grid.length; i++){
        grid[i].onclick = function(){
            count++;
            if(matches%2===1)
                (count%2 === 1)?view(count%2+1):view(count%2+1);
            else
                (count%2 === 1)?view(count%2):view(count%2+2);
            this.innerHTML = choice;
            if(initialWeapon === choice)
                player1.push(this.className.match(/\d/g).map(function(item){
                    return Number(item);
                }).slice(0,2));
            else
                player2.push(this.className.match(/\d/g).map(function(item){
                    return Number(item);
                }).slice(0,2));
            if(count >= 5)
                (initialWeapon === choice)?check(player1, "multi"):check(player2, "multi");
            choice = (choice==="X"?"O":"X");
            this.onclick = function() {
                var thisGrid = this;
                var originalClass = this.className;
                this.setAttribute("class", "animated shake " + this.className);
                setTimeout(function(){
                    thisGrid.setAttribute("class", originalClass);
                }, 300);
            };
        };
    }
}

//checking for player input
function check(player, whichGame) {
    var rowStreak, colStreak, primaryDiagonalStreak, secondaryDiagonalStreak, i, j;
    primaryDiagonalStreak = secondaryDiagonalStreak = 0;
    for(var i=1; i<=3; i++){
        rowStreak = colStreak = 0;
        for(j=0; j<player.length; j++)
            if(player[j][0] === i)
                rowStreak++;
        for(j=0; j<player.length; j++)
            if(player[j][1] === i)
                colStreak++;
        if(rowStreak === 3){
            controller("row" + i, whichGame);
            proceed();
            return false;
        }
        else if(colStreak === 3){
            controller("col" + i, whichGame);
            proceed();
            return false;
        }
    }
    for(i=0; i<player.length; i++){
        if(player[i][0] === player[i][1]){
            primaryDiagonalStreak++;
            if(player[i][0] === 2 && primaryDiagonalStreak === 1){
                secondaryDiagonalStreak++;
                for(j=0; j<player.length; j++)
                    if(player[j][0] + player[j][1] === 4 && player[j][0] !==2)
                        secondaryDiagonalStreak++;
            }
        }
    }
    if(primaryDiagonalStreak === 3){
        controller("pridiag", whichGame);
        proceed();
        return false;
    }
    else if(secondaryDiagonalStreak === 3){
        controller("secdiag", whichGame);
        proceed();
        return false;
    }
    else if(count===9)
        controller(null, whichGame);
    return true;
}

//controls the match point and the gameplay
function controller(spot, whichGame) {
    var line = document.getElementsByClassName(spot);
    if(spot === null)
        setTimeout(function(){
            clearBoard(true, whichGame);
    }, 2000);
    else{
        for(var i=0; i<line.length; i++)
            line[i].setAttribute("style", "background-color: rgb(210, 255, 210); color: black");
        view(whichGame);
        setTimeout(function(){
            clearBoard(true, whichGame);
        }, 2000);
    }
}

//updating the view
function view() {
    var points = update.innerHTML.match(/\d+/g).map(function(item){
        return Number(item);
    });
    if(isNaN(arguments[0])){
        if(arguments[0] === "single"){
            if(matches%2===1){
                dialogue.innerHTML = "computer's turn!";
                if(count%2===1)
                    update.innerHTML = "You: " + (points[0]+1) + " <br>Computer: " + points[1];
                else
                    update.innerHTML = "You: " + points[0] + " <br>Computer: " + (points[1]+1);
            }
            else{
                dialogue.innerHTML = "your turn!";
                if(count%2===1)
                    update.innerHTML = "You: " + points[0] + " <br>Computer: " + (points[1]+1);
                else
                    update.innerHTML = "You: " + (points[0]+1) + " <br>Computer: " + points[1];
            }
        }
        if(arguments[0] === "multi"){
            if(matches%2===1){
                dialogue.innerHTML = "player2's turn!";
                if(count%2===1)
                    update.innerHTML = "Player1: " + (points[1]+1) + " <br>Player2: " + points[3];
                else
                    update.innerHTML = "Player1: " + points[1] + " <br>Player2: " + (points[3]+1);
            }
            else{
                dialogue.innerHTML = "player1's turn!";
                if(count%2===1)
                    update.innerHTML = "Player1: " + points[1] + " <br>Player2: " + (points[3]+1);
                else
                    update.innerHTML = "Player1: " + (points[1]+1) + " <br>Player2: " + points[3];
            }
        }
    }
    else{
        if(arguments[1] === "single")
            dialogue.innerHTML = (arguments[0]===1?"your ":"computer's ") + "turn!";
        else
            dialogue.innerHTML = "player" + arguments[0] + "'s turn!";
    }
}

//clearing the board and preparing for the next match
function clearBoard(query, whichGame) {
    var location = document.querySelectorAll("td");
    for(var i=0; i<location.length; i++){
        location[i].innerHTML = "";
        location[i].setAttribute("style", "background-color: rgba(0, 0, 0, 0.95); color: white");
    }
    if(query){
        if(whichGame === "single")
            (initialWeapon === "X")?single("O"):single("X");
        else
            (initialWeapon === "X")?multi("O"):multi("X");
    }
}

//blocks further turn once a match completes
function proceed(){
    var grid = document.querySelectorAll("td");
    for(var i=0; i<grid.length; i++)
        grid[i].onclick = null;
}