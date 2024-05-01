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

function positionToNumber(position) {
  return Number(position.split('p')[0]);
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
}

const xWingState = {
  top: 0,
  left: 0
};

let deathstarHP = 1

function moveDeathstar(deathstar) {
  dsStyle = deathstar.style
  dsStyle.height = '200px'
  dsStyle.position = 'fixed';
  dsStyle.left = window.innerWidth - 220 + 'px';
  let dsSpeed;

  function moveDsDown() {
    dsSpeed = Math.round(10 + (Math.random() * 30));
    const down = setInterval(() => {
      deathstarHP < 0 ? clearInterval(down) : null;
      dsStyle.top = positionToNumber(dsStyle.top) + 2 + 'px';
      deathstarState.top = positionToNumber(dsStyle.top);
      if (positionToNumber(dsStyle.top) > window.innerHeight - 200) {
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
        moveDsDown();
        clearInterval(up);
      }
    }, dsSpeed);
  }
  moveDsDown();
}

function controlXwing(xwing) {
  xStyle = xwing.style;
  xStyle.position = 'relative';
  xStyle.height = '75px';
  function bottomBorder(elementStyle) {
    return elementStyle.top.split('p')[0] < window.innerHeight - 100
  }
  function topBorder(elementStyle) {
    return elementStyle.top.split('p')[0] > 0
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

  function hitDeathStar(deathStar, playerShot, shotStyle) {
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
        if (deathstarHP < 0) {
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

  function playerShoot() {
    const playerShot = appendElement(root, 'img', 'shot', null, {src: './images/shot.png'});
    const deathStar = document.getElementById('deathstar');
    const shotStyle = playerShot.style;
    shotStyle.position = 'absolute';
    shotStyle.width = '10px';
    shotStyle.top = xWingState.top + 44 + 'px';
    shotStyle.left = xWingState.left + 50 + 'px';
    const interval = setInterval(() => {
      hitDeathStar(deathStar, playerShot, shotStyle);

      const tieElements = Array.from(document.querySelectorAll('.tie'));
      tieElements.forEach((tie) => {
        if (positionToNumber(tie.style.top) < positionToNumber(shotStyle.top) + 10 &&
            positionToNumber(tie.style.top) > positionToNumber(shotStyle.top) - 30 &&
            positionToNumber(tie.style.left) < positionToNumber(shotStyle.left) + 20 &&
            positionToNumber(tie.style.left) > positionToNumber(shotStyle.left) - 20 &&
            tie.id !== 'deadTie'
          ) {
          tie.src = './images/explosion.gif';
          tie.id = 'deadTie'
          setTimeout(() => {
            playerShot.remove();
          }, 10);
          setTimeout(() => {
            tie.remove();
          }, 300);
        }
      })

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

function createTieFighter() {
  const tie = appendElement(root, 'img', 'tie', null, {src: './images/TIEfighter.png', id: 'tie'});
  tie.style.position = 'absolute';
  tie.style.left = window.innerWidth - 100 + 'px';
  function moveTieDown() {
    const down = setInterval(() => {
      tie.style.top = positionToNumber(tie.style.top) + 1 + 'px';
      tie.style.left = positionToNumber(tie.style.left) - 0.5 + 'px';
      positionToNumber(tie.style.top) > window.innerHeight - 50 ? (clearInterval(down), moveTieUp()) : null;
      positionToNumber(tie.style.left) < 0 ? tie.remove() : null
    }, 10)
  }
  function moveTieUp() {
    const up = setInterval(() => {
      tie.style.top = positionToNumber(tie.style.top) - 1 + 'px';
      tie.style.left = positionToNumber(tie.style.left) - 0.5 + 'px';
      positionToNumber(tie.style.top) < 10 ? (clearInterval(up), moveTieDown()) : null;
      positionToNumber(tie.style.left) < 0 ? tie.remove() : null
    }, 10)
  }
  moveTieDown();
}

function createTieFighters() {
  let counter = 0
  const interval = setInterval(() => {
    counter++;
    createTieFighter();
    counter === 30 ? clearInterval(interval) : null
  }, 1000)
}

function main() {
  const root = document.getElementById('root');
  const xwing = appendElement(root, 'img', 'xWing', null, {src: './images/XWingright.png'});
  // const deathstar = appendElement(root, 'img', 'deathStar', null, {src: './images/deathstar.png', id: 'deathstar'});
  // moveDeathstar(deathstar);
  createTieFighters();
  controlXwing(xwing);
}

main();
