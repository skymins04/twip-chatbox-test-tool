const intervals: any = {};

class CustomInterval {
  constructor(callback: () => void, intervalTime: number, randomMax?: number) {
    this.callback = callback;
    this.intervalTime = intervalTime;
    if (randomMax) {
      this.randomFlag = true;
      this.randomMax = randomMax;
    }
    this.set();
  }

  private callback: () => void;
  private randomFlag: boolean = false;
  private randomMax: number = 0;
  private intervalTime: number;
  private timer: NodeJS.Timeout | null = null;

  private set() {
    this.timer = setTimeout(
      () => {
        this.callback();
        this.set();
      },
      this.randomFlag
        ? this.intervalTime + this.randomMax * Math.random()
        : this.intervalTime
    );
  }

  clear() {
    if (this.timer) clearTimeout(this.timer);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.id) {
    const senderId = sender.id;

    if (request.runningState) {
      console.log("hello");
      const interval = new CustomInterval(() => {
        console.log("hello world");
      }, 2000);
      intervals[senderId] = interval;
    } else {
      console.log("world");
      intervals[senderId].clear();
    }
  }
});
