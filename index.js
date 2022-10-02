const gameContainer = document.querySelector('#gameContainer')
console.log(gameContainer)
tileNum = 400
let gameOver = false
let scoreCount = 0
let highScore = 0

if(!localStorage.getItem('high-score')){
    localStorage.setItem('high-score','0');
}
// Creating tiles

function gameCreator(){
    for (let i=0; i<tileNum; i++) {
        let tile = document.createElement('div')
        tile.classList.add('tile')
        i<4 && tile.classList.add('end') 
        i<4 && tile.classList.remove('tile')
        gameContainer.appendChild(tile)
    }
    
    // It will randomly allocate a black tile in each row and remove the 'tile' class to give an 'active' class instead
    
    const tileList = document.querySelectorAll('.tile')
    const letters = ['F', 'A', 'S', 'D']
    
    // 1, 2, 3, 4,--> 1%4 == 1, 2%4 == 2 , 3%4==3, 4%4==0              randomTile = 3      tileList[2]
    // 5, 6, 7, 8 --> 5%4 == 1, 6%4 == 2, 7%4 ==3, 8%4==0              randomTile = 0, 1, 2, 3    8%4 == 0
    // 9, 10, 11, 12
    // ....400
    
    function randomGen() {
        return Math.floor(Math.random()*4)
    }
    
    for (let i=1; i<tileList.length+1; i++){ 
        
        if (i%4==1){
            randomTile = randomGen()
        }
    
        if ((i%4)==randomTile){
            tileList[i-1].classList.remove('tile')       
            tileList[i-1].classList.add('active')
            tileList[i-1].innerHTML = `<div class = "tile-letter"> ${letters[i%4]}</div>`
        }
    }
    
    const activeTileList = document.querySelectorAll('.active')

    const activeList = Array.from(document.querySelectorAll('.active'))

    let visibleTiles = []
    // Clicking an 'active' tile will make it inactive

    for (let tile of activeTileList){
        tile.addEventListener('click', () => {
            increaseScore()
            tile.classList.remove('active')
            tile.classList.add('inactive')
            visibleTiles.shift()
            activeList.pop()
        })
    }

    // Scrolls all the way to the bottom
    gameContainer.scrollBy(0, 150*(tileNum/4))


    // Preventing scroll wheel action inside game container
    gameContainer.addEventListener("mousewheel", e => e.preventDefault())


    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    }


    const endTile = document.querySelector('.end')

    let accelerator = 1

    const lastTile = activeList.slice(-1)[0]
    lastTile.innerHTML += '<span>start</span>'

    let scrollInterval;

    lastTile.addEventListener('click', () => {
        scrollInterval = setInterval(() => {
            if (isInViewport(endTile)) {
                clearInterval(scrollInterval)
            }
            else {
                gameContainer.scrollBy(0, -(accelerator))
                accelerator +=0.001
            }
            // console.log(isInViewport(endTile))
            // console.log(accelerator)
        }, 10)
    })

    // let acceleratorInterval = setInterval(() => {
    //     if (isInViewport(endTile)){
    //         clearInterval(acceleratorInterval)
    //     }
    //     else{
            
    //     }
    // }, 100)

    // setInterval(() => {
    //     gameContainer.scrollBy(0, -2)
    //     console.log(accelerator)
    // }, 10)


    function increaseScore(){
        scoreCount +=1
        let score = document.getElementById("score")
        score.textContent = scoreCount
        // let highScore = 0

    }

    // GAME OVER POPUP

    function stopGame() {
        gameoverCard.classList.add("openPopup");
        clearInterval(scrollInterval);
        // clearInterval(acceleratorInterval);
        clearInterval(missingInterval)
    }

    let whiteTiles = document.querySelectorAll(".tile");
    let gameoverCard = document.querySelector(".gameover-popup");

    whiteTiles.forEach((item) => item.addEventListener("click", ()=>{
        item.style.backgroundColor = "red";
        stopGame()
    }))


    // Checking if an black tile is missed


    let options = {
        root: gameContainer,
        rootMargin: '0px',
        threshold: 1.0
      }
      
    let observer = new IntersectionObserver(()=> {
        console.log(activeList.slice(-1)[0])
        visibleTiles.push(activeList.slice(-1)[0])
        activeList.pop()
    }, options);

      
    let missingInterval = setInterval(() => {
        if (isInViewport(endTile)){
            clearInterval(missingInterval)
            console.log("YOU HAVE WON")
        }
        else{
            observer.observe(activeList.slice(-1)[0])
            
            if (visibleTiles.length>1 && !isInViewport(visibleTiles[0])){
                console.log(visibleTiles)
                stopGame()
            }
        }
    }, 10)



    document.getElementById("restart").addEventListener("click", ()=>{
        gameoverCard.classList.remove("openPopup");
        gameContainer.innerHTML = "";
        gameContainer.appendChild(gameoverCard)
        gameCreator();
    })
}

gameCreator();


function calculateHighScore(){
    if (score  > highScore){
        // ui highscore value will change
       highScore = score
       let highScoreDisplay = document.getElementById("high-score")
       highScoreDisplay.textContent = highScore
       // local storage will change
      localStorage.setItem("high-score",highScore.toString())

   }
}




