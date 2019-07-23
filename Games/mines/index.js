const GameBox = document.getElementById('root');

const GameSize = 10;
const Percent = 20;
const VirtualBoard = [];

const isMine = () => {
    const Items = document.getElementsByClassName('item');
    for (let i = 0; i < GameSize; i++) {
        for(let j = 0; j < GameSize; j++) {
            if (VirtualBoard[i][j] === '*') {
                Items[i * GameSize + j].textContent = '*';
            }
        }
    }
    alert('Game Over');
}

const bacel = (position,positionI,positionJ) => { ///poxel anun@
    console.log(position, positionI, positionJ)
    const Items = document.getElementsByClassName('item');
    Items[position].textContent = VirtualBoard[positionI][positionJ];
    Items[position].setAttribute('class', 'item opened');
    if(VirtualBoard[positionI][positionJ] === 0){
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                if ((positionI + i >= 0 && positionI + i < GameSize) && (positionJ + j >= 0 && positionJ + j < GameSize)) {
                    Items[(positionI + i) * GameSize + positionJ + j].textContent = VirtualBoard[positionI + i][positionJ + j];
                    Items[(positionI + i) * GameSize + positionJ + j].setAttribute('class', 'item opened');
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
        bacel(position,positionI,positionJ);
    }
}



for (let i = 0; i < GameSize; i++) {
    VirtualBoard.push([]);
    for(let j = 0; j < GameSize; j++) {
        const Div = document.createElement('div');
        Div.setAttribute('class', 'item');
        Div.setAttribute('onclick', 'check(event)');        
        Div.setAttribute('aria-index', `${ i * GameSize + j }`);
        GameBox.appendChild(Div);        
        VirtualBoard[i].push(0);
    }
}

const fillMines = () => {    
    for (let index = 0; index < Percent; index++) {       
        let positionI = Math.floor(Math.random() * 10);
        let positionJ = Math.floor(Math.random() * 10);
        while (VirtualBoard[positionI][positionJ] === '*') {
            positionI = Math.floor(Math.random() * 10);
            positionJ = Math.floor(Math.random() * 10);
        }        
        VirtualBoard[positionI][positionJ] = '*';
    }    
    fillNumbers();
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