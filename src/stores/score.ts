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

let _database: IDBDatabase;
async function getDatabase(): Promise<IDBDatabase> {
  const promise = new Promise<IDBDatabase>((resolve, reject): void => {
    if (_database != undefined) {
      resolve(_database);
    } else {
      const request = window.indexedDB.open("minesweeperdb", 1);
      request.onupgradeneeded = (event) => {
        const target = event.target as IDBRequest;
        const database = target.result as IDBDatabase;
        database.createObjectStore("scores", { keyPath: "id" });
      };
      request.onsuccess = (event) => {
        const target = event.target as IDBRequest;
        _database = target.result as IDBDatabase;
        resolve(_database);
      };
      request.onerror = (event) => {
        console.log("error: DBをオープンできません。", event);
        reject(new Error("error: DBをオープンできません。"));
      };
    }
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
