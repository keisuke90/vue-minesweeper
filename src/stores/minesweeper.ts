import { defineStore } from "pinia";

interface State {
  height: number;
  width: number;
  field: any[];
  game: 0 | 1 | 2 | 3; //0:初期状態,1:Play,2:ゲームオーバー,3:クリア
  mines: number;
  flags: number;
  playTime: number;
  startTime: number;
  timer: number;
}

export class Mine {
  public count: number;
  public isOpen: boolean;
  public isMine: boolean;
  public isFlag: boolean;

  constructor(
    count: null | number,
    isOpen: boolean,
    isMine: boolean,
    isFlag: boolean
  ) {
    this.count = 0;
    this.isOpen = false;
    this.isMine = false;
    this.isFlag = false;
  }
}

export const useMinesweeperStore = defineStore({
  id: "game",
  state: (): State => {
    return {
      height: 9,
      width: 9,
      field: [] as any,
      game: 0,
      mines: 10,
      flags: 0,
      playTime: 0,
      startTime: 0,
      timer: 0,
    };
  },
  getters: {
    remaining(): number {
      return this.mines - this.flags >= 0 ? this.mines - this.flags : 0;
    },
  },
  actions: {
    setField(): void {
      for (let y = 0; y < this.height; y++) {
        let row = [];
        for (let x = 0; x < this.width; x++) {
          row.push(new Mine(null, false, false, false));
        }
        this.field.push(row);
      }
    },
    initGame(): void {
      this.resetTimer();
      this.game = 0;
      this.flags = 0;
      this.field = [];
      this.setField();
    },
    atPoint(x: number, y: number) {
      return this.field[y][x];
    },
    setMine(x: number, y: number): void {
      for (let i = 0; i < this.mines; i++) {
        while (true) {
          let pointX = Math.floor(Math.random() * 9);
          let pointY = Math.floor(Math.random() * 9);
          if (
            x != pointX &&
            y != pointY &&
            this.atPoint(pointX, pointY).isMine === false
          ) {
            this.atPoint(pointX, pointY).isMine = true;
            break;
          }
        }
      }
    },
    isInField(x: number, y: number): boolean {
      return x < this.width && y < this.height && x >= 0 && y >= 0;
    },
    countMine(): void {
      let count: number = 0;
      const arround = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      this.field.forEach((rows, y) => {
        rows.forEach((cell: Mine, x: number) => {
          for (let i = 0; i < arround.length; i++) {
            if (this.isInField(x + arround[i][0], y + arround[i][1])) {
              if (this.field[y + arround[i][1]][x + arround[i][0]].isMine) {
                count++;
              }
            }
          }
          cell.count = count;
          count = 0;
        });
      });
    },
    startTimer(): void {
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        this.playTime = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);
    },
    stopTimer(): void {
      clearInterval(this.timer);
    },
    resetTimer() {
      this.stopTimer();
      this.playTime = 0;
      this.startTime = 0;
    },
    startGame(x: number, y: number): void {
      if (this.game === 0) {
        this.game = 1;
        this.startTimer();
        this.setMine(x, y);
        this.countMine();
      }
    },
    openCell(x: number, y: number): void {
      this.startGame(x, y);
      if (!this.atPoint(x, y).isFlag) {
        this.atPoint(x, y).isOpen = true;
      }
    },
    flagCell(x: number, y: number): void {
      if (!this.atPoint(x, y).isOpen) {
        this.atPoint(x, y).isFlag = !this.atPoint(x, y).isFlag;
        if (this.atPoint(x, y).isFlag) {
          this.flags++;
        } else {
          this.flags--;
        }
      }
    },
  },
});
