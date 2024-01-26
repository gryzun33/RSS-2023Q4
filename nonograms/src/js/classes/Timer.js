import createHTMLElement from '../utils/createHTMLElement';

export default class Timer {
  constructor(parent) {
    this.timerId = null;
    this.timeData = {
      min: 0,
      sec: 0,
      // currMin: 0,
      // currSec: 0,
    };
    this.timeElem = null;
    this.createView(parent);
  }

  createView(parent) {
    // this.timerWrapper = createHTMLElement('div', 'timer-wrapper', parent);
    this.timeElem = createHTMLElement('div', 'timer', parent);
    this.timeElem.innerHTML = `<span>00</span><span>:</span><span>00</span>`;
  }

  runTimer() {
    this.timerId = setInterval(() => {
      if (this.timeData.sec === 59) {
        this.timeData.min += 1;
        this.timeData.sec = 0;
      } else {
        this.timeData.sec += 1;
      }
      // this.timeData.currMin = (parseInt(this.timeData.min, 10) < 10 ? '0' : '') + this.timeData.min;
      // this.timeData.currSec = (parseInt(this.timeData.sec, 10) < 10 ? '0' : '') + this.timeData.sec;
      this.updateTimerView(this.timeData.min, this.timeData.sec);
      // this.time.innerHTML = `${this.timeDatatimeData.currMin} : ${this.timeData.currSec}`;
    }, 1000);
  }

  updateTimer(min, sec) {
    this.updateTimerData(min, sec);
    this.updateTimerView(min, sec);
  }

  updateTimerView(min, sec) {
    this.timeData.currMin = (parseInt(min, 10) < 10 ? '0' : '') + min;
    this.timeData.currSec = (parseInt(sec, 10) < 10 ? '0' : '') + sec;
    // this.timeElem.innerHTML = `${this.timeData.currMin} : ${this.timeData.currSec}`;
    this.timeElem.innerHTML = `<span>${this.timeData.currMin}</span><span>:</span><span>${this.timeData.currSec}</span>`;
  }

  updateTimerData(min, sec) {
    this.timeData.min = min;
    this.timeData.sec = sec;
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  resetTimer() {
    clearInterval(this.timerId);
    this.updateTimer(0, 0);
  }
}
