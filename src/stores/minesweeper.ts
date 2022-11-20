import { defineStore } from "pinia";

interface State {
  height: number;
  width: number;
  field: [Mine[]];
  game: 0 | 1 | 2 | 3; //0:初期状態,1:Play,2:ゲームオーバー,3:クリア
  mines: number;
}

export class Mine {
  public count: null | number;
  public isOpen: boolean;
  public isMine: boolean;
  public isFlag: boolean;

  constructor(
    count: null | number,
    isOpen: boolean,
    isMine: boolean,
    isFlag: boolean
  ) {
    this.count = null;
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
    };
  },
  actions: {
    initFeild(): void {
      for (let y = 0; y < this.height; y++) {
        let row = [];
        for (let x = 0; x < this.width; x++) {
          row.push(new Mine(null, false, false, false));
        }
        this.field.push(row);
      }
    },
    atPoint(x: number, y: number) {
      return this.field[y][x];
    },
    setMine(): void {
      for (let i = 0; i < this.mines; i++) {
        while (true) {
          let x = Math.floor(Math.random() * 9);
          let y = Math.floor(Math.random() * 9);
          if (this.atPoint(x, y).isMine === false) {
            this.atPoint(x, y).isMine = true;
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
        rows.forEach((cell, x) => {
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
    startGame(): void {
      this.game = 1;
      this.setMine();
      this.countMine();
    },
    openCell(x: number, y: number): void {
      if (this.game === 0) {
        this.startGame();
      }
      if (!this.atPoint(x, y).isFlag) {
        this.atPoint(x, y).isOpen = true;
      }
    },
    flagCell(x: number, y: number): void {
      if (!this.atPoint(x, y).isOpen) {
        this.atPoint(x, y).isFlag = !this.atPoint(x, y).isFlag;
      }
    },
  },
});
