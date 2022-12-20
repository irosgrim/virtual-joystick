const swipe = document.getElementById("swipe");
const circle = document.getElementById("circle");


const distance = function (p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;

    return Math.sqrt((dx * dx) + (dy * dy));
};

class VirtualJoyStick {
  constructor() {
    this.swipe = "";
    this.direction = [0, 0]; // [x, y]
    this.touchStartCenter = {
      x: 0,
      y: 0,
    };
    this.touchEndCenter = {
      x: 0,
      y: 0,
    }
    this.el = {
      id: "circle",
      style: {
        top: 0,
        left: 0,
        size: 50,
        color: "red",
        opacity: 0.4,
        position: "absolute",
      }
    }
    this.threshold = 5; // minimum amount of movement from center to direction
    this.createJoystickBg();
    this.createJoystickElement();
  }
  createJoystickElement () {
    const div = document.createElement("div");
    div.setAttribute("id", this.el.id);
    div.style.top = this.el.style.top + "px";
    div.style.left = this.el.style.left + "px";
    div.style.width = this.el.style.size + "px";
    div.style.height = this.el.style.size + "px";
    div.style.backgroundColor = this.el.style.color;
    div.style.borderRadius = "50%";
    div.style.position = this.el.style.position;
    div.style.opacity = this.el.style.opacity;
    div.style.visibility = "hidden";
    document.body.appendChild(div);
  }
  createJoystickBg () {
    const div = document.createElement("div");
    div.setAttribute("id", "joy_bg");
    div.style.top = 0;
    div.style.left = 0;
    div.style.width = "70px";
    div.style.height = "70px";
    div.style.backgroundColor = "green";
    div.style.borderRadius = "50%";
    div.style.position = "absolute";
    div.style.opacity = "0.5";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
  }
  init () {
    const circle = document.getElementById("circle");
    const circleBg = document.getElementById("joy_bg");
   
    if (circle) {
      const bigCircleRadius = 35;
      const smallCircleRadius = 25;
      const touchRadius = {
        x: 0,
        y: 0,
      }
      document.addEventListener('touchstart', e => {
        touchRadius.x = e.touches[0].radiusX;
        touchRadius.y = e.touches[0].radiusY;

        const touchStartX = e.changedTouches[0].pageX - bigCircleRadius - touchRadius.x;
        const touchStartY = e.changedTouches[0].pageY - bigCircleRadius - touchRadius.y;

        this.touchStartCenter.x = touchStartX;
        this.touchStartCenter.y = touchStartY;

        console.log(e);
        document.body.style.overflow = "hidden";
        circle.style.visibility = "visible";
        circle.style.top = e.changedTouches[0].pageY - smallCircleRadius - touchRadius.y + "px";
        circle.style.left = e.changedTouches[0].pageX - smallCircleRadius - touchRadius.x + "px";
        
        circleBg.style.visibility = "visible";
        circleBg.style.top = touchStartY + "px";
        circleBg.style.left = touchStartX + "px";
          
      })
      addEventListener('touchmove', (e) => {
        const smallCircle = {
          x: e.changedTouches[0].pageX - smallCircleRadius - touchRadius.x,
          y: e.changedTouches[0].pageY - smallCircleRadius - touchRadius.y,
        }
        const d = distance(this.touchStartCenter, {x: smallCircle.x, y: smallCircle.y});

        if (d > 35) {
          const angle = Math.atan2(smallCircle.y - this.touchStartCenter.y, smallCircle.x - this.touchStartCenter.x);
          // Calculate the new x and y coordinates of the element
          const elementX = this.touchStartCenter.x + 40 * Math.cos(angle);
          const elementY = this.touchStartCenter.y + 40 * Math.sin(angle);

          // Update the position of the element
          circle.style.left = elementX + "px";
          circle.style.top = elementY + "px";
        } else {
          circle.style.top = smallCircle.y + "px";
          circle.style.left = smallCircle.x + "px";
        }

        // if (d <= 35) {
        //   circle.style.top = e.changedTouches[0].pageY - 25 - 11.5 + "px";
        //   circle.style.left = e.changedTouches[0].pageX - 25 - 11.5+ "px";
        // } else {
        //   circle.style.top = circle.style.top - 35 + "px";
        //   circle.style.left = circle.style.left - 35 + "px";
        // }

        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        const deltaX = endX - this.touchStartCenter.x;
        const deltaY = endY - this.touchStartCenter.y;

        // [x, y]
        let move = [0, 0];
        // moved horizontally
        if (Math.abs(deltaX) > Math.abs(deltaY) + this.threshold) {
          move[0] = deltaX < 0 ? -1 : 1;
        }
        // moved vertically
        else if (Math.abs(deltaX) + this.threshold < Math.abs(deltaY)) {
          move[1] = deltaY < 0 ? -1 : 1;
        } else {
          move = [0, 0];
        }

        if (move[0] > 0) {
          swipe.innerText = "right";
          window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowRight"}));
        }
        if (move[0] < 0) {
          swipe.innerText = "left";
          window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowLeft"}));
        }
        if (move[1] > 0) {
          swipe.innerText = "down";
          window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));
        }
        if (move[1] < 0) {
          swipe.innerText = "up";
          window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));
        }
        if (move[0] === 0 && move[1] === 0) {
          swipe.innerText = "center";
          // window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));
        }
      });
      document.addEventListener('touchend', e => {
        document.body.style.overflow = "auto";
        circle.style.visibility = "hidden"
        circleBg.style.visibility = "hidden"

      })
    }
    
  }
}

const joy = new VirtualJoyStick();
joy.init();
