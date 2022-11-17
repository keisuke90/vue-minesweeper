import { defineStore } from "pinia";

interface Mine {
  count: number;
  isOpen: boolean;
  isMine: boolean;
  isFlag: boolean;
}
interface State {
  field: [Mine[]];
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
      const mine: Mine = {
        count: 0,
        isOpen: false,
        isMine: false,
        isFlag: false,
      };
      for (let y = 0; y < 9; y++) {
        let row = [];
        for (let x = 0; x < 9; x++) {
          row.push(mine);
        }
        this.field.push(row);
      }
    },
  },
});
