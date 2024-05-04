import { positionToNumber } from "./utility.js";

function verticalMovement(element, shoot) {
  let elementStyle = element.style
  let elementSpeed;
  let dsDown = true;
  shoot ? shoot() : null;
  
  function moveDown() {
    elementSpeed = Math.round(20 + (Math.random() * 20));
    const down = setInterval(() => {
      elementStyle.top = positionToNumber(elementStyle.top) + 2 + 'px';
      element.top = positionToNumber(elementStyle.top);
      if (positionToNumber(elementStyle.top) > window.innerHeight - 200) {
        moveUp();
        clearInterval(down);
      }
    }, elementSpeed);
  }
  
  function moveUp() {
    elementSpeed = Math.round(20 + (Math.random() * 20));
    const up = setInterval(() => {
      elementStyle.top = positionToNumber(elementStyle.top) - 2 + 'px';
      if (positionToNumber(elementStyle.top) < 0) {
        moveDown();
        clearInterval(up);
      }
    }, elementSpeed);
  }
  moveDown();
}

export { verticalMovement };