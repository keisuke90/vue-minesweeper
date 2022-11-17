import { defineStore } from "pinia";

interface State {
  field: [Mine[]];
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
      field: [] as any,
    };
  },
  actions: {
    initFeild(): void {
      for (let y = 0; y < 9; y++) {
        let row = [];
        for (let x = 0; x < 9; x++) {
          row.push(new Mine(null, false, false, false));
        }
        this.field.push(row);
      }
    },
    openCell(x: number, y: number): void {
      this.field[y][x].isOpen = true;
    },
  },
});
