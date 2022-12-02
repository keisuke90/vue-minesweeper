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
  actions: {
    async prepareScoreList(): Promise<boolean> {
      const database = await getDatabase();
      const promise = new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction("scores", "readonly");
        const objectStore = transaction.objectStore("scores");
        const scoreList = new Map<number, Score>();
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
          const target = event.target as IDBRequest;
          const cursor = target.result as IDBCursorWithValue;
          if (cursor) {
            const id = cursor.key as number;
            const score = cursor.value as Score;
            scoreList.set(id, score);
            cursor.continue;
          }
        };
        transaction.oncomplete = () => {
          this.scoreList = scoreList;
          this.isLoading = false;
          resolve(true);
        };
        transaction.onerror = (event) => {
          console.log("error: データの取得に失敗しました。", event);
          reject(new Error("error: データ取得に失敗しました。"));
        };
      });
      return promise;
    },
    async addScore(score: Score): Promise<boolean> {
      const scoreAdd: Score = {
        ...score,
      };
      const database = await getDatabase();
      const promise = new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction("scores", "readwrite");
        const objectStore = transaction.objectStore("scores");
        objectStore.put(scoreAdd);
        transaction.oncomplete = () => {
          resolve(true);
        };
        transaction.onerror = (event) => {
          console.log("error: データ登録に失敗。", event);
          reject(new Error("error: データ登録に失敗。"));
        };
      });
      return promise;
    },
  },
});
