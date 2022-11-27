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

export class Cell {
  public count: number;
  public isOpen: boolean;
  public isMine: boolean;
  public isFlag: boolean;

  constructor(
    count: number,
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
          row.push(new Cell(0, false, false, false));
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
          let pointX = Math.floor(Math.random() * this.width);
          let pointY = Math.floor(Math.random() * this.height);
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
        rows.forEach((cell: Cell, x: number) => {
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
    openField(): void {
      this.field.forEach((rows) => {
        rows.forEach((cell: Cell) => {
          cell.isFlag = false;
          cell.isOpen = true;
        });
      });
    },
    countOpenedCells(): number {
      let opendCells = 0;
      this.field.forEach((rows) => {
        rows.forEach((cell: Cell) => {
          if (cell.isOpen === true) {
            opendCells++;
          }
        });
      });
      return opendCells;
    },
    isLose(): boolean {
      let isLose = false;
      this.field.forEach((rows) => {
        rows.forEach((cell: Cell) => {
          if (cell.isOpen && cell.isMine) {
            isLose = true;
          }
        });
      });
      return isLose;
    },
    isWin(): boolean {
      const openedCells = this.countOpenedCells();
      return openedCells + this.mines === this.height * this.width;
    },
    checkGame(): void {
      if (this.isLose()) {
        this.game = 2;
        this.stopTimer();
        this.openField();
      }
      if (this.isWin()) {
        this.game = 3;
        this.stopTimer();
        this.openField();
      }
    },
    getArroundCell(x: number, y: number): [] {
      const arroundCells: any = [];
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
      arround.forEach((point) => {
        if (this.isInField(x - point[1], y - point[0])) {
          arroundCells.push(this.field[y - point[0]][x - point[1]]);
        }
      });
      return arroundCells;
    },
    getArroundPoints(x: number, y: number): [] {
      const arroundPoints: any = [];
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
      arround.forEach((point) => {
        if (
          this.isInField(x + point[0], y + point[1]) &&
          !this.field[y + point[1]][x + point[0]].isOpen
        ) {
          arroundPoints.push([x + point[0], y + point[1]]);
        }
      });
      return arroundPoints;
    },
    openArroundCells(x: number, y: number): void {
      const arroundPoints = this.getArroundPoints(x, y);
      let flags = 0;
      arroundPoints.forEach((point: [number, number]) => {
        if (this.atPoint(point[0], point[1]).isFlag) {
          flags++;
        }
      });

      let targetPoint: any = [];
      if (this.atPoint(x, y).isOpen && this.atPoint(x, y).count == flags) {
        arroundPoints.forEach((point: [number, number]) => {
          if (!this.field[point[1]][point[0]].isFlag) {
            this.field[point[1]][point[0]].isOpen = true;
            if (this.field[point[1]][point[0]].count === 0) {
              targetPoint.push([point[0], point[1]]);
            }
          }
        });
        targetPoint.forEach((point2: [number, number]) => {
          this.openEmptyCell(point2[0], point2[1]);
        });
        this.checkGame();
      }
    },
    openEmptyCell(x: number, y: number): void {
      let targetPoint: any = this.getArroundPoints(x, y);

      while (targetPoint.length > 0) {
        targetPoint.forEach((point: [number, number]) => {
          if (this.field[point[1]][point[0]].count === 0) {
            this.getArroundPoints(point[0], point[1]).forEach((p) => {
              if (!this.atPoint(p[0], p[1]).isFlag) {
                targetPoint.push(p);
              }
            });
          }
          this.field[point[1]][point[0]].isOpen = true;
          targetPoint = targetPoint.filter((v: [number, number]) => {
            return v != point;
          });
        });
      }
    },
    openCell(x: number, y: number): void {
      this.startGame(x, y);
      if (!this.atPoint(x, y).isFlag && !this.atPoint(x, y).isOpen) {
        this.atPoint(x, y).isOpen = true;
        if (this.atPoint(x, y).count === 0) {
          this.openEmptyCell(x, y);
        }
        this.checkGame();
      }
    },
    flagCell(x: number, y: number): void {
      if (this.game != 0 && !this.atPoint(x, y).isOpen) {
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
