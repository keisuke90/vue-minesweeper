import { defineStore } from "pinia";

interface Score {
  level: string;
  time: number;
  date: string;
}

interface State {
  scoreList: Map<number, Score>;
  isLoading: boolean;
}

async function getDatabase(): Promise<IDBDatabase> {
  const promise = new Promise<IDBDatabase>((resolve, reject): void => {
    const request = window.indexedDB.open("minesweeperdb", 1);
    request.onsuccess = (event) => {
      const target = event.target as IDBRequest;
      const _database = target.result as IDBDatabase;
      resolve(_database);
    };
    request.onerror = (event) => {
      console.log("error: DBをオープンできません。", event);
      reject(new Error("error: DBをオープンできません。"));
    };
  });
  return promise;
}

export const useScoreStore = defineStore({
  id: "score",
  state: (): State => {
    return {
      scoreList: new Map<number, Score>(),
      isLoading: true,
    };
  },
  getters: {},
  actions: {},
});
