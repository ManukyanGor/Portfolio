const GameBox = document.getElementById('root');
const GameSize = 15;
const MinePercent = 15;
const Percent = Math.ceil(GameSize * GameSize / 100 * MinePercent);
const VirtualBoard = [];
const ZeroHistory = [];// changed to recursve array

//When clicked field is mine
const isMine = () => {
    const Items = document.getElementsByClassName('item');
    for (let i = 0; i < GameSize; i++) {
        for(let j = 0; j < GameSize; j++) {
            if (VirtualBoard[i][j] === '*') {
                Items[i * GameSize + j].textContent = '*';
            }
        }
    }
    winOrLoss('You Loss');
}

//Right click on mouse from set mine
const setMine = (event) => {
    event.preventDefault();
    if (event.target.getAttribute('class') === 'item mine') {
        event.target.setAttribute('class', 'item');
        event.target.setAttribute('onclick', 'check(event)');
        return;
    }
    if (event.target.getAttribute('class') !== 'item opened') {
        event.target.setAttribute('class', 'item mine');
        event.target.removeAttribute('onclick', 'check(event)');
    }
}

//End game function
const winOrLoss = (message) => {
    const win = document.getElementsByClassName('win_or_lose')[0];
    document.getElementById('message').textContent = message;
    win.style.width = `${(GameSize * (3.125 + .023))}em` ;
    win.style.height = `${(GameSize * (3.125 + .023))}em`;
    win.style.display = 'flex';
}

//Function for set winning
const youWinn = () => {
    const opened = document.getElementsByClassName('item opened').length;
    if (opened === GameSize * GameSize - Percent) {
        winOrLoss('You Winn');
    }
}


//Paint in board
const paintItem = (position) => {
    let positionI = Math.floor(position / GameSize);
    let positionJ = position % GameSize;
    const Items = document.getElementsByClassName('item');
    Items[position].textContent = VirtualBoard[positionI][positionJ] !== 0 ? VirtualBoard[positionI][positionJ] : '';
    Items[position].setAttribute('class', 'item opened');
}


//new game (trial version)
const newGame = () => {
    location.reload();
}

//Checking clicked field
const open = (position) => {
    let positionI = Math.floor(position / GameSize);
    let positionJ = position % GameSize; 
    const Items = document.getElementsByClassName('item');
    if (VirtualBoard[positionI][positionJ] !== 0) {
        paintItem(position);
        youWinn();
        return;
    }
    if (ZeroHistory.indexOf(position) !== -1) {
        return;
    }
    ZeroHistory.push(positionI * GameSize + positionJ);
    paintItem(position);
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            if ((positionI + i >= 0 && positionI + i < GameSize) && (positionJ + j >= 0 && positionJ + j < GameSize)) {
                paintItem(((positionI + i) * GameSize) + positionJ + j);
                youWinn();
                if(VirtualBoard[positionI + i][positionJ + j] === 0){
                    open(((positionI + i) * GameSize) + positionJ + j);
                }
            }
        }
    }
}

//click on field 
const check = (event) => {
    const position = Number(event.target.getAttribute('aria-index'));
    const positionI = Math.floor(position / GameSize);
    const positionJ = position % GameSize;    
    if (VirtualBoard[positionI][positionJ] === '*') {
        isMine();
    } else {
        open(position,positionI,positionJ);
    }
}

//Painting
for (let i = 0; i < GameSize; i++) {
    GameBox.style.width = `${(GameSize * (3.125 + .023))}em` ;
    GameBox.style.height = `${(GameSize * (3.125 + .023))}em`;
    VirtualBoard.push([]);
    for(let j = 0; j < GameSize; j++) {
        const Div = document.createElement('div');
        Div.setAttribute('class', 'item');
        Div.setAttribute('onclick', 'check(event)'); 
        Div.addEventListener('contextmenu', setMine);        
        Div.setAttribute('aria-index', `${ i * GameSize + j }`);
        GameBox.appendChild(Div);        
        VirtualBoard[i].push(0);
    }
}

//fill mines in virtual board
const fillMines = () => {    
    for (let index = 0; index < Percent; index++) {
        let position =  Math.floor(Math.random() * (GameSize * GameSize)); 
        let positionI = Math.floor(position / GameSize);
        let positionJ = position % GameSize;
        while (VirtualBoard[positionI][positionJ] === '*') {
            position =  Math.floor(Math.random() * (GameSize * GameSize));
            positionI = Math.floor(position / GameSize);
            positionJ = position % GameSize;
        }        
        VirtualBoard[positionI][positionJ] = '*';
    }    
    fillNumbers();
}

//fill mines count in virtual board
const fillNumbers = () => {
    for (let i = 0; i < GameSize; i++) {
        for (let j = 0; j < GameSize; j++) {
            if (VirtualBoard[i][j] === '*') {
                for(let k = -1; k <= 1; k++){
                    for(let l = -1; l <= 1; l++){
                        if(VirtualBoard[i+k] && VirtualBoard[j + l] &&  VirtualBoard[i+k][j + l] !== '*' ){
                            VirtualBoard[i+k][j + l] = VirtualBoard[i+k][j + l]+1;
                        }
                    }
                }
            }
        }
    }
}

fillMines();