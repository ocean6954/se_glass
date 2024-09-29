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
const sqlite3 = require("sqlite3").verbose(); // verbose モードを使用してデバッグしやすくする
const db = new sqlite3.Database("Contributions.db", (error) => {
  if (error) {
    console.error("データベースが開けませんでした！", error);
  } else {
    console.log("データベースが開きました！");
  }
});

// テーブル作成のヘルパー関数
export const createTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      contributionCount INTEGER NOT NULL
    );`,
    [],
    (error) => {
      if (error) {
        console.error("テーブル作成中にエラーが発生しました！", error);
      } else {
        console.log("テーブルが作成されました！");
      }
    }
  );
};

export const saveContributions = (weeks: Week[]) => {
  console.log("受け取ったweeks : ", weeks);

  db.serialize(() => {
    weeks.forEach((week) => {
      console.log("weeksの中のweek : ", weeks);

      week.contributionDays.forEach((day) => {
        console.log("weekの中のday : ", day);
        db.run(
          "INSERT INTO contributions (date, contributionCount) VALUES (?, ?);",
          [day.date, day.contributionCount],
          (error) => {
            if (error) {
              console.error(
                "Contributionの保存中にエラーが発生しました : ",
                error
              );
            } else {
              console.log("Contributionが保存されました!");
            }
          }
        );
      });
    });
  });
};

export const fetchContributions = (
  callback: (contributions: Contribution[]) => void
): void => {
  console.log("fetchContributionsのコールバック : ", callback);

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM contributions ORDER BY date DESC;",
      [],
      (_tx, results) => {
        let contributions: Contribution[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          contributions.push(results.rows.item(i));
        }
        console.log("fetchContributionsのcontributions : ", contributions);
        callback(contributions);
      },
      (error) => {
        console.error("Error fetching contributions:", error);
      }
    );
  });
};
