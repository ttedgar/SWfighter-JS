// import { verticalMovement } from "./movement.js";  
import { positionToNumber } from "./utility.js";

function appendElement (parent, tagName, classes, text, attributes) {
  const elementName = document.createElement(tagName);
  parent.appendChild(elementName);
  if (classes) {
    if (typeof classes === 'string') {
      classes = [classes];
    }
    for (const className of classes) {
      elementName.classList.add(className);
    }
  }
  if (text) {
    elementName.textContent = text;
  }
  for (const attribute in attributes) {
    elementName[attribute] = attributes[attribute];
  }
  return elementName;
}

const keyState = {
  '1': false,
  '2': false,
  '3': false,
  '5': false,
  's': false
};

const deathstarState = {
  top: 0,
  left: 0
};

const xWingState = {
  top: window.innerHeight/2,
  left: 0
};

let deathstarHP = 50;
let playerHP = 10;


function deathstarShoot(deathstar, dsSpeed) {
  const shootInterval = setInterval(() => {
    deathstarHP < 1 ? clearInterval(shootInterval) : null;
    const laser = appendElement(root, 'img', 'dsLaser', null, {src: './images/laser6.png'});
    laser.style.position = 'fixed';
    laser.style.top = positionToNumber(deathstar.style.top) - 105 + 'px';
    laser.style.width = window.innerWidth + 300 + 'px';
    laser.style.left = '-329px';
    function moveLaser() {
      const shootDownInterval = setInterval(() => {
        deathstarHP < 1 ? clearInterval(shootInterval) : null;
        laser.style.top = positionToNumber(deathstar.style.top) - 105 + 'px';
        if (positionToNumber(deathstar.style.top) > window.innerHeight - 200) {
          laser.remove();
        }
      }, dsSpeed)
      setTimeout(() => {
        laser.remove();
      }, 800)
    }
    moveLaser();
  }, 3000);
}

function moveDeathstar(deathstar) {
  dsStyle = deathstar.style
  dsStyle.height = '200px'
  dsStyle.position = 'fixed';
  dsStyle.left = window.innerWidth - 220 + 'px';
  let dsSpeed;
  let dsDown = true;
  deathstarShoot(deathstar, dsSpeed);
  
  function moveDsDown() {
    dsSpeed = Math.round(10 + (Math.random() * 30));
    const down = setInterval(() => {
      deathstarHP < 0 ? clearInterval(down) : null;
      dsStyle.top = positionToNumber(dsStyle.top) + 2 + 'px';
      deathstarState.top = positionToNumber(dsStyle.top);
      if (positionToNumber(dsStyle.top) > window.innerHeight - 200) {
        dsDown = false;
        moveDsUp();
        clearInterval(down);
      }
    }, dsSpeed);
  }
  
  function moveDsUp() {
    dsSpeed = Math.round(10 + (Math.random() * 30));
    const up = setInterval(() => {
      deathstarHP < 0 ? clearInterval(up) : null;
      dsStyle.top = positionToNumber(dsStyle.top) - 2 + 'px';
      deathstarState.top = positionToNumber(dsStyle.top);
      if (positionToNumber(dsStyle.top) < 0) {
        dsDown = false;
        moveDsDown();
        clearInterval(up);
      }
    }, dsSpeed);
  }
  moveDsDown();
}


function controlXwing(xwing) {
  let xStyle = xwing.style;
  xStyle.position = 'relative';
  xStyle.top = window.innerHeight/2 + 'px';
  xStyle.height = '75px';
  function bottomBorder(elementStyle) {
    return elementStyle.top.split('p')[0] < window.innerHeight - 100
  }
  function topBorder(elementStyle) {
    return elementStyle.top.split('p')[0] > 30
  }
  function rightBorder(elementStyle) {
    return elementStyle.left.split('p')[0] < window.innerWidth - 200
  }
  function leftBorder(elementStyle) {
    return elementStyle.left.split('p')[0] > 0
  }

  function saveXwingPosition(xStyle) {
    xWingState.top = positionToNumber(xStyle.top);
    xWingState.left = positionToNumber(xStyle.left);
  }

  function hitDeathStar(deathStar, playerShot, shotStyle, interval) {
    if (deathStar) {
      if (
        positionToNumber(shotStyle.left) > window.innerWidth - 160 && 
        positionToNumber(shotStyle.left) < window.innerWidth - 130 && 
        positionToNumber(shotStyle.top) > deathstarState.top &&
        positionToNumber(shotStyle.top) < deathstarState.top + 200 &&
        deathstarHP >= 0
      ) {
        playerShot.src = './images/explosion.gif';
        playerShot.style.width = '30px';
        deathstarHP--;
        setTimeout(() => {
          playerShot.remove();
        }, 500)
        clearInterval(interval);
        if (deathstarHP <= 0) {
          deathStar.src = './images/deathstar-ruin.png';
          const bigBumm = appendElement(root, 'img', null, null, {src: './images/explosion.gif'});
          bigBumm.style.width = '150px'
          bigBumm.style.position = 'absolute'
          bigBumm.style.top = deathStar.style.top
          bigBumm.style.left = positionToNumber(deathStar.style.left) + 'px'
          deathStar.classList.add('active')
          setTimeout(() => {
            bigBumm.remove();
          }, 5000)
          setTimeout(() => {
            deathStar.remove();
          }, 5000)
        }
      }
    }
  }

  function hitTieFighter(playerShot) {
    const shotStyle = playerShot.style;
    const tieElements = Array.from(document.querySelectorAll('.tie'));
      tieElements.forEach((tie) => {
        if (positionToNumber(tie.style.top) < positionToNumber(shotStyle.top) + 10 &&
            positionToNumber(tie.style.top) > positionToNumber(shotStyle.top) - 30 &&
            positionToNumber(tie.style.left) < positionToNumber(shotStyle.left) + 20 &&
            positionToNumber(tie.style.left) > positionToNumber(shotStyle.left) - 20 &&
            tie.id !== 'deadTie') {
          const tieExplosion = appendElement(root, 'img', 'tieExp', null, {src: './images/explosion.gif'});
          tieExplosion.style.position = 'absolute';
          tieExplosion.style.width = '30px'; 
          tieExplosion.style.top = positionToNumber(tie.style.top) + 10 + 'px';
          tieExplosion.style.left = positionToNumber(tie.style.left) + 10 + 'px';
          tie.id = 'deadTie';
          tie.remove();
          setTimeout(() => {
            tieExplosion.remove();
          }, 300);
          setTimeout(() => {
            playerShot.remove();
          }, 10);
        }
      })
  }

  function playerShoot() {
    const playerShot = appendElement(root, 'img', 'shot', null, {src: './images/shot.png'});
    const deathStar = document.getElementById('deathstar');
    const shotStyle = playerShot.style;
    shotStyle.position = 'absolute';
    shotStyle.width = '10px';
    shotStyle.top = xWingState.top + 44 + 'px';
    shotStyle.left = xWingState.left + 50 + 'px';
    const interval = setInterval(() => {
      hitDeathStar(deathStar, playerShot, shotStyle, interval);
      hitTieFighter(playerShot)
      

      shotStyle.left = positionToNumber(shotStyle.left) + 20 + 'px';
      positionToNumber(shotStyle.left) > window.innerWidth - 10 ? (playerShot.remove(), clearInterval(interval)) : null;
    }, 20)

    
  }

  function handleKeyPress() {
    if (keyState['2'] && !keyState['3'] && !keyState['5'] && !keyState['1'] && bottomBorder(xStyle)) {
      xStyle.top = positionToNumber(xStyle.top) + 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (!keyState['2'] && !keyState['3'] && keyState['5'] && !keyState['1'] && topBorder(xStyle)) {
      xStyle.top = positionToNumber(xStyle.top) - 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (!keyState['2'] && keyState['3'] && !keyState['5'] && !keyState['1'] && rightBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) + 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (!keyState['2'] && !keyState['3'] && !keyState['5'] && keyState['1'] && leftBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) - 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (keyState['2'] && keyState['3'] && bottomBorder(xStyle) && rightBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) + 10 + 'px'
      xStyle.top = positionToNumber(xStyle.top) + 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (keyState['5'] && keyState['3'] && topBorder(xStyle) && rightBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) + 10 + 'px'
      xStyle.top = positionToNumber(xStyle.top) - 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (keyState['5'] && keyState['1'] && topBorder(xStyle) && leftBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) - 10 + 'px'
      xStyle.top = positionToNumber(xStyle.top) - 10 + 'px'
      saveXwingPosition(xStyle)
    } else if (keyState['1'] && keyState['2'] && leftBorder(xStyle) && bottomBorder(xStyle)) {
      xStyle.left = positionToNumber(xStyle.left) - 10 + 'px'
      xStyle.top = positionToNumber(xStyle.top) + 10 + 'px'
      saveXwingPosition(xStyle)
    }
  }

  function handleKeyDown(event) {
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '5' || event.key === 's') {
      keyState[event.key] = true;
      handleKeyPress();
    }
  }
  function handleKeyUp(event) {
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '5' || event.key === 's') {
      keyState[event.key] = false;  
    }
  }

  function handleShoot(event) {
    if (keyState['s'] || event.key === 's') {
      playerShoot();
    }
  }

  window.addEventListener('keypress', handleShoot);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

function tieShoot(tie, msBetweenshots) {
  const xwing = document.getElementById('xwing');
  const shotInterval = setInterval(() => {
    if (tie.id === 'deadTie') {
      clearInterval(shotInterval);
      return;
    }
    const shot = appendElement(root, 'img', 'tieShot', null, {src: './images/TIEshot.png'});
    shot.style.position = 'absolute';
    shot.style.height = '25px';
    shot.style.top = positionToNumber(tie.style.top) + 7 + 'px';
    shot.style.left = positionToNumber(tie.style.left) + 15 + 'px';
    let hit = false;
    let hitControl = false;
    const movementInterval = setInterval(() => {
      shot.style.left = positionToNumber(shot.style.left) - 4 + 'px';
        if (positionToNumber(shot.style.left) < 0) {
          shot.remove();
        }
        if (positionToNumber(shot.style.left) < positionToNumber(xwing.style.left) + 50 &&
            positionToNumber(shot.style.left) > positionToNumber(xwing.style.left) + 10 &&
            positionToNumber(shot.style.top) < positionToNumber(xwing.style.top) + 50 &&
            positionToNumber(shot.style.top) > positionToNumber(xwing.style.top) + 10) {
          gameOver();
          shot.src = './images/explosion.gif';
          hit = true;
          if (!hitControl && hit) {
            playerHP--;
            document.getElementById('lives').classList.add('active');
            setTimeout(() => {
              document.getElementById('lives').classList.remove('active');
            }, 1000)
          }
          hitControl = true;
          displayLives();
          console.log(playerHP);
          setTimeout(() => {
            shot.remove();
          }, 500)
        }
      }, 10)
    }, msBetweenshots)
}

function createTieFighter(horizontalPosition, speedLeft, speedVertical, msBetweenshots = 1000) {
  const tie = appendElement(root, 'img', 'tie', null, {src: './images/TIEfighter.png', id: 'tie'});
  tie.style.position = 'absolute';
  tie.style.top = horizontalPosition + 'px';
  tie.style.left = window.innerWidth - 100 + 'px';
  tieShoot(tie, msBetweenshots);
  function moveTieDown() {
    const down = setInterval(() => {
      tie.style.top = positionToNumber(tie.style.top) + speedVertical + 'px';
      tie.style.left = positionToNumber(tie.style.left) - speedLeft + 'px';
      positionToNumber(tie.style.top) > window.innerHeight - 50 ? (clearInterval(down), moveTieUp()) : null;
      positionToNumber(tie.style.left) < 0 ? tie.remove() : null
    }, 10)
  }
  function moveTieUp() {
    const up = setInterval(() => {
      tie.style.top = positionToNumber(tie.style.top) - speedVertical + 'px';
      tie.style.left = positionToNumber(tie.style.left) - speedLeft + 'px';
      positionToNumber(tie.style.top) < 10 ? (clearInterval(up), moveTieDown()) : null;
      positionToNumber(tie.style.left) < 0 ? tie.remove() : null
    }, 10)
  }
  moveTieDown();
}

function createTieFighters(horizontalPosition = 0, speedLeft = 0.5, speedVertical = 1, msBetweenTies = 1000, msBetweenshots = 1000) {
  let counter = 0
  const interval = setInterval(() => {
    counter++;
    createTieFighter(horizontalPosition, speedLeft, speedVertical, msBetweenshots);
    counter === 30 ? clearInterval(interval) : null
  }, msBetweenTies)
}

function displayLives() {
  clearLives();
  const lives = document.getElementById('lives');
  for (let i = 1; i < playerHP + 1; i++) {
    const life = appendElement(lives, 'img', 'life', null, {src: './images/Luke.png'});
  }
}

function clearLives() {
  const lifeArray = Array.from(document.getElementsByClassName("life"));
  lifeArray.forEach((life) => {
    life.remove();
  })
}

function gameOver() {
  if (playerHP === 0) {
    root.textContent = '';
    root.textContent = 'GAME OVER!';
  }
}

function handleStardestroyer(stardestroyer) {
  let sdStyle = stardestroyer.style
  let sdSpeed;
  let beam = appendElement(root, 'img', 'tractorbeam', null, {src: './images/beam2.png', id: 'beam'});
  beam.style.width = 1000 + 'px';
  beam.style.position = 'fixed'
  beam.style.display = 'none';
  let beamDuration = 1000;
  let beamPulse = 3000;

  setInterval(() => {
    setTimeout(() => {
      beam.style.display = 'none';
    }, beamDuration);
    beam.style.display = 'block';
  }, beamPulse);
  
  function moveDown() {
    sdSpeed = Math.round(20 + (Math.random() * 20));
    const down = setInterval(() => {
      beam.style.top = positionToNumber(sdStyle.top) - 400 + 'px';
      beam.style.left = positionToNumber(sdStyle.left) - window.innerWidth/2 + 'px';
      sdStyle.top = positionToNumber(sdStyle.top) + 2 + 'px';
      if (positionToNumber(sdStyle.top) > window.innerHeight - 200) {
        moveUp();
        clearInterval(down);
      }
    }, sdSpeed);
  }
  
  function moveUp() {
    sdSpeed = Math.round(20 + (Math.random() * 20));
    const up = setInterval(() => {
      beam.style.top = positionToNumber(sdStyle.top) - 400 + 'px';
      beam.style.left = positionToNumber(sdStyle.left) - window.innerWidth/2 + 'px';
      sdStyle.top = positionToNumber(sdStyle.top) - 2 + 'px';
      if (positionToNumber(sdStyle.top) < 0) {
        moveDown();
        clearInterval(up);
      }
    }, sdSpeed);
  }
  moveDown();
  tractorBeam(stardestroyer, beamDuration, beamPulse);
}

function tractorBeam(stardestroyer, beamDuration, beamPulse) {
  const xwing = document.getElementById('xwing');

  function pull(topOrLeft, plusOrMinus) {
    let clearCondition;
    
    const beamInterval = setInterval(() => {
      plusOrMinus > 0 
      ? clearCondition = positionToNumber(stardestroyer.style[topOrLeft]) < positionToNumber(xwing.style[topOrLeft])
      : clearCondition = positionToNumber(stardestroyer.style[topOrLeft]) > positionToNumber(xwing.style[topOrLeft])
      
      xwing.style[topOrLeft] = positionToNumber(xwing.style[topOrLeft]) + plusOrMinus + 'px'
      setTimeout(() => {
        clearInterval(beamInterval);
      }, beamDuration);
      if (clearCondition) {
        clearInterval(beamInterval);
      }
    }, 10);
  }

  const beamPause = setInterval(() => {
    if (positionToNumber(stardestroyer.style.left) > positionToNumber(xwing.style.left)) {
      pull('left', 0.5);
    } else {
      pull('left', -0.5);
    }
    if (positionToNumber(stardestroyer.style.top) > positionToNumber(xwing.style.top)) {
      pull('top', 0.5);   
    } else {
      pull('top', -0.5);
    }
  }, beamPulse)
}

function createStardestroyer() {
  const stardestroyer = appendElement(root, 'img', 'stradestroyer', null, {src: './images/stardestroyer.png', id: 'stardestroyer'});
  let sdStyle = stardestroyer.style;
  sdStyle.height = '100px';
  sdStyle.position = 'fixed';
  sdStyle.left = window.innerWidth/2 + 'px';
  handleStardestroyer(stardestroyer);
}

function main() {
  const root = document.getElementById('root');
  const infoBar = appendElement(root, 'div', 'infobar', null, {id: 'infobar'});
  const lives = appendElement(infoBar, 'div', 'lives', null, {id: 'lives'});
  displayLives();
  const xwing = appendElement(root, 'img', 'xWing', null, {src: './images/XWingright.png', id: 'xwing'});
  createStardestroyer();
  // const deathstar = appendElement(root, 'img', 'deathStar', null, {src: './images/deathstar.png', id: 'deathstar'});
  // moveDeathstar(deathstar);
  createTieFighters(0, 0.5, 1, 2000, 2000);
  createTieFighters(window.innerHeight-50, 0.5, 1, 2000, 2000);
  // createTieFighter(0, 0.1, 1, 300);
  controlXwing(xwing);
}

main();