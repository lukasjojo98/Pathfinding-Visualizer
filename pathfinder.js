let wrapperDiv = document.getElementsByClassName("wrapper")[0];

let nodeElement = document.createElement("div");
nodeElement.className = "node";

const modalElement = document.querySelector('.modal');
const closeButton = document.querySelector('.modal-close-button');

closeButton.addEventListener('click', () => {
  modalElement.remove();
});

window.addEventListener('load', function() {
  var gif = document.getElementById('pathfinder-gif');
  var src = gif.src;
  gif.src = '';
  gif.src = src;
});

let clicktype = document.click.clicktype.value;
let animationIntervall;
let positionInList;

let startingPosition;
let nodesToAnimate = [];
var start;
var gridSize = 15;
var grid = [];

let state = {
    startPick: false,
    goalPick: false,
    obstaclePick: false
};
let existingNodes;

function chooseState(click){
    if(click == "start"){
        state.startPick = true;
        state.goalPick = false;
        state.obstaclePick = false;
    }
    else if(click == "goal"){
        state.startPick = false;
        state.goalPick = true;
        state.obstaclePick = false;
    }
    else if(click == "obstacle"){
        state.startPick = false;
        state.goalPick = false;
        state.obstaclePick = true;
    }
}
let isMousedown;

function detectMousedown(element){
    isMousedown = true;
    if(state.startPick == false && clicktype == "start"){
        element.className += " start";
        existingNodes = document.getElementsByClassName("node");
        existingNodes = Array.from(existingNodes);
        let position = existingNodes.indexOf(element, 0);
        startingPosition = position;
        let row = Math.floor(position / 15);
        let col = position % 15;
        start = [row, col];
        grid[row][col] = "Start";
        state.startPick = true;
    }
    else if(state.goalPick == false && clicktype == "goal"){
        element.className += " goal";
        existingNodes = document.getElementsByClassName("node");
        existingNodes = Array.from(existingNodes);
        let position = existingNodes.indexOf(element, 0);
        let row = Math.floor(position / 15);
        let col = position % 15;
        grid[row][col] = "Goal";
        state.goalPick = true;
    }
    
}

function detectMousemove(element){
    if(isMousedown && clicktype == "obstacle"){
        element.className += " obstacle scale-up-center";
        existingNodes = document.getElementsByClassName("node");
        existingNodes = Array.from(existingNodes);
        let position = existingNodes.indexOf(element, 0);
        let row = Math.floor(position / 15);
        let col = position % 15;
        grid[row][col] = "Obstacle";
    }   
}

function detectMouseup(){
    isMousedown = false;
}

function animateNodes(i, path){
    if(i < nodesToAnimate.length){
    existingNodes[nodesToAnimate[i]].className += " nodes-animated scale-up-center";
    return;
    }
    else{
        clearInterval(animationIntervall);
        let i = 0;
        positionInList = startingPosition;
        path.pop();
        animationIntervall = setInterval(() => {
            animatePath(path, i);
            i++;
        }, 100);
    }
}
function animatePath(path, i){
    if(i < path.length){
        if(path[i] == "North"){
            positionInList -= 15;
        }
        if(path[i] == "East"){
            positionInList += 1;
        }
        if(path[i] == "South"){
            positionInList += 15;
        }
        if(path[i] == "West"){
            positionInList -= 1;
        }
        existingNodes[positionInList].className = " node path puff-in-center";
    }
    else{
        clearInterval(animationIntervall);
    }
}

function clearBoard(){
  initBoard();
  nodesToAnimate = [];
  existingNodes = [];
  state = {
    startPick: false,
    goalPick: false,
    obstaclePick: false
};
}
document.addEventListener("DOMContentLoaded", () => {
    initBoard();
});

document.getElementById("clear").addEventListener("click", () => {
  clearBoard();
});
document.addEventListener("click", (event) => {
    clicktype = document.click.clicktype.value;
    //chooseState(clicktype);
});

document.getElementById("visualizePath").addEventListener("click", (event) => {
    let path = findShortestPath(start, grid);
    let i = 0;
    animationIntervall = setInterval(() => {
        animateNodes(i, path);
        i++;
    }, 20);
    
});

let initBoard = function(){
    for (var i=0; i<gridSize; i++) {
      grid[i] = [];
      for (var j=0; j<gridSize; j++) {
        grid[i][j] = 'Empty';
      }
    }
  wrapperDiv.innerHTML = "";
  for(var i = 0; i < 15; i++){
    let rowDiv = document.createElement("div");
    rowDiv.className = "row";
    for(var j = 0; j < 15; j++){
        rowDiv.innerHTML += "<div class='node' onmousedown='detectMousedown(this)' onmousemove='detectMousemove(this)' onmouseup='detectMouseup()'></div>";
    }
    wrapperDiv.appendChild(rowDiv);
  }

  }
  

var findShortestPath = function(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];
    
    var location = {
      distanceFromTop: distanceFromTop,
      distanceFromLeft: distanceFromLeft,
      path: [],
      status: 'Start'
    };
  
    var queue = [location];

    while (queue.length > 0) {

        var currentLocation = queue.shift();
  
        var newLocation = exploreInDirection(currentLocation, 'North', grid);
        if (newLocation.status === 'Goal') {
          return newLocation.path;
        } else if (newLocation.status === 'Valid') {
          queue.push(newLocation);
        }

        // Explore East
      var newLocation = exploreInDirection(currentLocation, 'East', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
  
      // Explore South
      var newLocation = exploreInDirection(currentLocation, 'South', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
  
      // Explore West
      var newLocation = exploreInDirection(currentLocation, 'West', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
    
    }
  
    // No valid path found
    return false;
  
  };
  
  var locationStatus = function(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;
  
    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {
  
      // location is not on the grid--return false
      return 'Invalid';
    } else if (grid[dft][dfl] === 'Goal') {
      return 'Goal';
    } else if (grid[dft][dfl] !== 'Empty') {
      // location is either an obstacle or has been visited
      return 'Blocked';
    } else {
      return 'Valid';
    }
  };
  
  
  var exploreInDirection = function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
  
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
    
    nodesToAnimate.push(15 * dft + dfl);

    if (direction === 'North') {
        dft -= 1;
    } else if (direction === 'East') {
        dfl += 1;
    } else if (direction === 'South') {
        dft += 1;
    } else if (direction === 'West') {
        dfl -= 1;
    }
  
    var newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid);
  
    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }
  
    return newLocation;
  };
  
