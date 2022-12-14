import { defineStore } from "pinia";

export interface Score {
  level: string;
  time: number;
  date: string;
}

export interface Record {
  easy: number | null;
  normal: number | null;
  hard: number | null;
}

interface State {
  scoreList: Map<number, Score>;
  recordTime: Record;
  isLoading: boolean;
  nextDeleteId: number;
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
        database.createObjectStore("score", {
          keyPath: "id",
          autoIncrement: true,
        });
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
      recordTime: {
        easy: null,
        normal: null,
        hard: null,
      },
      isLoading: true,
      nextDeleteId: 0,
    };
  },
  persist: true,
  getters: {},
  actions: {
    async prepareScoreList(): Promise<boolean> {
      const database = await getDatabase();
      const promise = new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction("score", "readonly");
        const objectStore = transaction.objectStore("score");
        const scoreList = new Map<number, Score>();
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
          const target = event.target as IDBRequest;
          const cursor = target.result as IDBCursorWithValue;
          if (cursor) {
            const id = cursor.key as number;
            const score = cursor.value as Score;
            scoreList.set(id, score);
            cursor.continue();
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
        const transaction = database.transaction("score", "readwrite");
        const objectStore = transaction.objectStore("score");
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
    addNextDeleteId(): void {
      this.nextDeleteId++;
    },
    async deleteScore(id: number): Promise<boolean> {
      const database = await getDatabase();
      const promise = new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction("score", "readwrite");
        const objectStore = transaction.objectStore("score");
        objectStore.delete(id);
        transaction.oncomplete = () => {
          resolve(true);
        };
        transaction.onerror = (event) => {
          console.log("error: データ削除に失敗。", event);
          reject(new Error("error: データ削除に失敗。"));
        };
      });
      return promise;
    },
  },
});
