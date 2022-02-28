import "./styles.scss";

////////////////////////////////////////////////////////////////////////
// variables needed for calculation purposes during the game
let blockSize = 3; // default block size for the grid (3 * 3)
let steps = 0;
let startTime;
let timerFunction;
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// getting the dom elements
const shuffledGrid = document.getElementById("shuffled-image"); // div to display shuffled imaage
const emptyGrid = document.getElementById("draggable-image"); // empty div where user need to drag images
const changeImageButton = document.getElementById("change_image"); // button to change image 
const stepsCounter = document.getElementById("steps-counter"); // span for step counting
const timeCounter = document.getElementById("time-counter"); // span for displaying timer
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// callback function for radio inputs listeners which get the value from
// the radio input and sets the block size for the grid to increase/decrease
// the complexity of the game and restarts the game by calling the setShuffleGrid
// function with new block size
function setBlockSize(event) {
  blockSize = event.target.value;
  setshuffledGrid(blockSize);
}

// going through all the radio inputs and adding event listener.
document.querySelectorAll("input[name='level']").forEach((input) => {
  input.addEventListener("change", setBlockSize);
});
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// callback for the change button click event listener which reload the
// window
function reload() {
  window.location.reload(true);
}

// adding click event listener on change image button which simply reloads 
// the window
changeImageButton.addEventListener("click", reload);
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// GAME STARTING POINT
// this function is called when the page loads which starts the game.
setshuffledGrid(blockSize);


// 1 - setShuffledGrid function takes bSize which is the value of blockSize
// and it starts the game.
// 2 - This function initiates two grids according to the block size * block size
// 3 - One grid is for the shuffled image, one is for empty grid where user needs to
// drag the image pieces to solve the puzzel.
// 4 - After creating elements and setting the required styling and position this function
// calls three methods, one is to randomize the position of each image piece block, second
// is to add the required drag and drop listeners on the elements (DragAndDrop API is used),
// the last method is timeTick which calculates the elapsed time of the game.
function setshuffledGrid(bSize) {

  // start time of the game
  startTime = new Date().getTime();

  // dynamic images from unsplash which changes each time when window reloads
  // or user clicks the change butto
  let img = "http://source.unsplash.com/random/900x900"; 

  // reset steps to zero on each start
  steps = 0;

  bSize = bSize || 3; // If bSize is null or not passed, default it as 3.
  let percentage = 100 / (bSize - 1); // defining the percentage according to the blocksize

  // making innerHTML empty on each time game starts or restarts.
  shuffledGrid.innerHTML = "";
  emptyGrid.innerHTML = "";
  stepsCounter.textContent = steps;

  for (let i = 0; i < bSize * bSize; i++) {

    // determining x and y positions to place the blocks on the containers
    let xpos = percentage * (i % bSize) + "%";
    let ypos = percentage * Math.floor(i / bSize) + "%";

    // creating div item for both shuffle and empty containers.
    const shuffleListItem = document.createElement("div");
    const emptyListItem = document.createElement("div");

    // adding class to div
    shuffleListItem.classList.add('shuffleddiv')
    emptyListItem.classList.add('emptydiv')
    shuffleListItem.setAttribute('id', `shuffleddiv-${i}`)
    emptyListItem.setAttribute('id', `emptydiv-${i}`)

    // creating the img block element as span for each div
    const shuffleListItemImage = document.createElement('span');
    const emptyListItemImage = document.createElement('span');

    // data-index for each block is important part on which we decide whether
    // the image is arranged in correct order during the drop event
    shuffleListItemImage.setAttribute("data-index", i);
    shuffleListItemImage.setAttribute("draggable", true);
    shuffleListItemImage.setAttribute("id", `shuffle-${i}`);
    shuffleListItemImage.classList.add('draggable')

    emptyListItemImage.setAttribute("data-index", i);
    emptyListItemImage.setAttribute("draggable", true);
    emptyListItemImage.setAttribute("id", `empty-${i}`);
    emptyListItemImage.classList.add('draggable')

    // setting the background image, background size and background position
    // according to the x and y position %
    shuffleListItemImage.style["background-image"] = `url(${img})`;
    shuffleListItemImage.style["background-size"] = `${bSize * 100}%`;
    shuffleListItemImage.style["background-position"] = `${xpos} ${ypos}`;

    // no image for the empty grid
    emptyListItemImage.style["background-size"] = `${bSize * 100}%`;
    emptyListItemImage.style["background-position"] = `${xpos} ${ypos}`;

    // setting the width, height and border for each block
    shuffleListItemImage.style.width = 440 / bSize + "px";
    shuffleListItemImage.style.height = 440 / bSize + "px";
    shuffleListItemImage.style.border = 5 / bSize + "px" + " solid" + " #dd2a30";

    emptyListItemImage.style.width = 440 / bSize + "px";
    emptyListItemImage.style.height = 440 / bSize + "px";
    emptyListItemImage.style.border = 5 / bSize + "px" + " solid" + " #00ff00";

    // add the span (image blocks) to the their parent div
    shuffleListItem.appendChild(shuffleListItemImage);
    emptyListItem.appendChild(emptyListItemImage);

    // add the elements to their respective grids/lists (ul lists)
    shuffledGrid.appendChild(shuffleListItem);
    emptyGrid.appendChild(emptyListItem);
  }

  // random the postiton of each image block
  randomizeGrids();
  // add the event listeners on the elements.
  addEventListeners();
  // calculating the elapsed time
  timeTick()
}
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// going through the list children and calling a math random on it
// to shuffle it and append it back
function randomizeGrids() {

  for (let i = shuffledGrid.children.length; i >= 0; i--) {
    shuffledGrid.appendChild(shuffledGrid.children[(Math.random() * i) | 0]);
  }

  // for (let i = emptyGrid.children.length; i >= 0; i--) {
  //   emptyGrid.appendChild(emptyGrid.children[(Math.random() * i) | 0]);
  // }
}
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// this event cb is called on the block where drag starts,
// on drag start we are getting the target from event and setting it in
// dataTrasnfer object for event. In order to move this block we need id
// of the block so that we can get the element using id at the drop event.
function dragStart(event) {
  event.dataTransfer.setData("src", event.target.id); 
  event.dataTransfer.effectAllowed = 'move';
}

// this event cb is called when the dragged element (dragStart => target)
// moves over other draggable blocks
// we need to call preventDefault because default behaviour provokes the drop
// event
// we are also adding a css class named over which changes the backgroud color
// to see the effect
function dragOver(event) {
  event.preventDefault();
  this.classList.add("over");
  event.dataTransfer.effectAllowed = 'move';

}

// this event cb is called when the dragged element enters another draggable element
// we are setting the css class over to see the effect
function dragEnter() {
  this.classList.add("over");
}

// this event cb is called when the dragged element leaves the element where is enetered
// we are removing the over css class from here
function dragLeave() {
  this.classList.remove("over");
}

// The important event cb where whole GAME LOGIC lies
// this event is called when a element is dropped on a block
function dragDrop(event) {
  event.preventDefault();

  // get the src element which was moved with the dragEnter using getElementById
  let src = document.getElementById(event.dataTransfer.getData("src"));

  // get the parentNode for the src
  let srcParent = src.parentNode;

  // if user is swapping empty blocks or image blocks do nothing just return
  if (src.id.startsWith('empty') && event.target.id.startsWith('empty')) {
    this.classList.remove("over");
    return;
  }

  if (src.id.startsWith('shuffle') && event.target.id.startsWith('shuffle')) {
    this.classList.remove("over");
    return;
  }

  // replace event.target with src
  event.target.replaceWith(src)

  // move the current event.target to the srcParent using appendChild
  srcParent.appendChild(event.target)

  // remove the over class
  this.classList.remove("over");

  // here the game wining logic steps starts
  // get all the elements for the empty grid and filter out the empty blocks
  const currentGrid = [...document.querySelectorAll(".emptydiv .draggable")]
    .filter((ele) => !ele.getAttribute("id").startsWith("empty"))
  // now that we have the image blocks we map over those and get the data-index which
  // is just integer value that we assigned at the first place to each block and then
  // randomize it => the currentGridOrder will have the array of data-index for all image blocks
  const currentGridOrder =  currentGrid.map((ele) => ele.getAttribute("data-index"));

  // we increment the step on each drop
  steps = steps + 1;
  stepsCounter.textContent = steps;

  // here on each drop we check if the currentGridOrder array length is equal to
  // the total number of blocks or not (blockSize * blockSize), if yes this means
  // user have moved all the shuffled image pieces to the empty grid so now we can
  // check if they are in the correct order or not and decide if user has won the game
  if (currentGridOrder.length === blockSize * blockSize) {
    if (isInCorrectOrder(currentGridOrder)) {
      // if in correct order remove over class and clear the timeout and show alert box to user
      // that the game has ended and won with showing time taken and total step taken.
      this.classList.remove("over");
      clearTimeout(timerFunction);
      alert(
        `Congrats, You won the game. Total time taken ${timeCounter.textContent}, Total Steps: ${steps} `
      );
    }
  }
}

////////////////////////////////////////////////////////////////////////
// this function adds drag and drop event listeners on the images
function addEventListeners() {
  
  // selecting the spans (which have property of draggable) from both containers
  const draggableGameListItems = document.querySelectorAll(".emptydiv .draggable");
  const draggableShuffleListItems = document.querySelectorAll(".shuffleddiv .draggable");

  // adding events on the empty div container
  draggableGameListItems.forEach(item => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });

  // adding events on the shuffled container
  draggableShuffleListItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// timeTick function calculates the elapsed time and also sets a timeout
// of one second so that the game can show time taken to the user.
function timeTick() {
  let now = new Date().getTime();
  let elapsedTime = parseInt((now - startTime) / 1000, 10);
  timeCounter.textContent = elapsedTime;
  timerFunction = setTimeout(timeTick, 1000);
}
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// isInCorrectOrder is a simple function that takes an array as argument
// and just compares the array values to index i of a for loop and if they
// are the same, it means that user has arranged the blocks correctly and it
// returns true at the end else false if not every element matches with the
// index i value
function isInCorrectOrder(currentGrid) {
  for (let i = 0; i < currentGrid.length; i++) {
    if (currentGrid[i] != i) {
      return false;
    }
  }
  return true;
}
////////////////////////////////////////////////////////////////////////