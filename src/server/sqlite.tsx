// import SQLite from "react-native-sqlite-storage";

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface Contribution {
  id?: number;
  date: string;
  contributionCount: number;
}

// データベースの接続を開く
const sqlite3 = require("sqlite3");
const db = sqlite3.Database(
  {
    name: "Contributions.db",
    location: "default",
  },
  () => {
    console.log("Database が開きました！");
  },
  (error) => {
    console.error("データベースが開くのでエラー！！", error);
  }
);

// テーブル作成のヘルパー関数
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        contributionCount INTEGER NOT NULL
      );`,
      [],
      () => {
        console.log("テーブルを作りました！");
      },
      (error) => {
        console.error("テーブル作る過程でエラー！ :", error);
      }
    );
  });
};

export const saveContributions = (weeks: Week[]) => {
  console.log("受け取ったweeks : ", weeks);
  db.transaction((tx) => {
    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        console.log("weeksの中のday : ", day);
        tx.executeSql(
          "INSERT INTO contributions (date, contributionCount) VALUES (?, ?);",
          [day.date, day.contributionCount],
          () => {
            console.log("Contribution saved");
          },
          (error) => {
            console.error("Error saving contribution:", error);
          }
        );
      });
    });
  });
};

export const fetchContributions = (
  callback: (contributions: Contribution[]) => void
): void => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM contributions ORDER BY date DESC;",
      [],
      (_tx, results) => {
        let contributions: Contribution[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          contributions.push(results.rows.item(i));
        }
        console.log("contributions : ", contributions);
        callback(contributions);
      },
      (error) => {
        console.error("Error fetching contributions:", error);
      }
    );
  });
};
