import { defineStore } from "pinia";

interface State {
  gameLevel: { mines: number; height: number; width: number };
  field: any[];
  game: 0 | 1 | 2 | 3; //0:初期状態,1:Play,2:ゲームオーバー,3:クリア
  flags: number;
  openCells: number;
  miss: boolean;
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
      gameLevel: { mines: 10, height: 9, width: 9 },
      field: [] as any,
      game: 0,
      flags: 0,
      openCells: 0,
      miss: false,
      playTime: 0,
      startTime: 0,
      timer: 0,
    };
  },
  getters: {
    remaining(): number {
      return this.gameLevel.mines - this.flags >= 0
        ? this.gameLevel.mines - this.flags
        : 0;
    },
  },
  actions: {
    setField(): void {
      for (let y = 0; y < this.gameLevel.height; y++) {
        let row = [];
        for (let x = 0; x < this.gameLevel.width; x++) {
          row.push(new Cell(0, false, false, false));
        }
        this.field.push(row);
      }
    },
    initGame(): void {
      this.resetTimer();
      this.game = 0;
      this.flags = 0;
      this.openCells = 0;
      this.miss = false;
      this.field = [];
      this.setField();
    },
    atPoint(x: number, y: number) {
      return this.field[y][x];
    },
    setMine(x: number, y: number): void {
      for (let i = 0; i < this.gameLevel.mines; i++) {
        while (true) {
          let pointX = Math.floor(Math.random() * this.gameLevel.width);
          let pointY = Math.floor(Math.random() * this.gameLevel.height);
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
      return (
        x < this.gameLevel.width &&
        y < this.gameLevel.height &&
        x >= 0 &&
        y >= 0
      );
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
          arround.forEach((point) => {
            if (this.isInField(x + point[0], y + point[1])) {
              if (this.field[y + point[1]][x + point[0]].isMine) {
                count++;
              }
            }
          });
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
    countOpenCells(): void {
      this.openCells++;
    },
    isLose(): boolean {
      return this.miss;
    },
    isWin(): boolean {
      return (
        this.openCells + this.gameLevel.mines ===
        this.gameLevel.height * this.gameLevel.width
      );
    },
    canOpen(x: number, y: number): boolean {
      return !this.atPoint(x, y).isOpen && !this.atPoint(x, y).isFlag;
    },
    isMine(x: number, y: number): boolean {
      return this.atPoint(x, y).isMine;
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
    getArroundPoints(x: number, y: number): any[] {
      const arroundPoints: any[] = [];
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
        if (this.isInField(x + point[0], y + point[1])) {
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

      let targetPoints: any[] = [];
      if (this.atPoint(x, y).isOpen && this.atPoint(x, y).count === flags) {
        arroundPoints.forEach((point: [number, number]) => {
          if (this.canOpen(point[0], point[1])) {
            this.atPoint(point[0], point[1]).isOpen = true;
            this.countOpenCells();
            if (this.isMine(point[0], point[1])) {
              this.miss = true;
            }
            if (this.atPoint(point[0], point[1]).count === 0) {
              targetPoints.push([point[0], point[1]]);
            }
          }
        });
        targetPoints.forEach((targetPoint: [number, number]) => {
          this.openEmptyCell(targetPoint[0], targetPoint[1]);
        });
        this.checkGame();
      }
    },
    openEmptyCell(x: number, y: number): void {
      let targetPoints: any[] = this.getArroundPoints(x, y);

      while (targetPoints.length > 0) {
        targetPoints.forEach((point: [number, number]) => {
          if (this.atPoint(point[0], point[1]).count === 0) {
            this.getArroundPoints(point[0], point[1]).forEach(
              (arroundPoint) => {
                if (this.canOpen(point[0], point[1])) {
                  targetPoints.push(arroundPoint);
                }
              }
            );
          }
          if (this.canOpen(point[0], point[1])) {
            this.atPoint(point[0], point[1]).isOpen = true;
            this.countOpenCells();
          }
          targetPoints = targetPoints.filter(
            (targetPoint: [number, number]) => {
              return targetPoint != point;
            }
          );
        });
      }
    },
    openCell(x: number, y: number): void {
      this.startGame(x, y);
      if (this.canOpen(x, y)) {
        this.atPoint(x, y).isOpen = true;
        this.countOpenCells();

        if (this.isMine(x, y)) {
          this.miss = true;
        }
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
