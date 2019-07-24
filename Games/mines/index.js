const GameBox = document.getElementById('root');

const GameSize = 15;
const MinePercent = 15;
const Percent = Math.ceil(GameSize * GameSize / 100 * MinePercent);
const VirtualBoard = [];
const ZeroHistory = [];

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

const winOrLoss = (message) => {
    const win = document.getElementsByClassName('win_or_lose')[0];
    document.getElementById('message').textContent = message;
    win.style.width = `${(GameSize * (3.125 + .023))}em` ;
    win.style.height = `${(GameSize * (3.125 + .023))}em`;
    win.style.display = 'flex';
}

const youWinn = () => {
    const opened = document.getElementsByClassName('item opened').length;
    if (opened === GameSize * GameSize - Percent) {
        winOrLoss('You Winn');
    }
}

const paintItem = (position) => {
    let positionI = Math.floor(position / GameSize);
    let positionJ = position % GameSize;
    const Items = document.getElementsByClassName('item');
    Items[position].textContent = VirtualBoard[positionI][positionJ] !== 0 ? VirtualBoard[positionI][positionJ] : '';
    Items[position].setAttribute('class', 'item opened');
}

const newGame = () => {
    location.reload();
}

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
    console.log(VirtualBoard);
    
}

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