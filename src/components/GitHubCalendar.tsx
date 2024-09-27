import React, { useState, useEffect } from "react";
import "./GitHubCalendar.css";
import { fetchData } from "../api/gitGraphQL";

import {
  saveContributions,
  createTable,
  fetchContributions,
} from "../server/sqlite.tsx";

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

const formatContributionsToWeeks = (contributions: Contribution[]): Week[] => {
  const weeksMap: Record<string, ContributionDay[]> = {};

  contributions.forEach((contribution) => {
    const weekStart = getWeekStart(contribution.date); // 日付を週ごとにグループ化
    if (!weeksMap[weekStart]) {
      weeksMap[weekStart] = [];
    }
    weeksMap[weekStart].push({
      date: contribution.date,
      contributionCount: contribution.contributionCount,
    });
  });

  return Object.keys(weeksMap).map((weekStart) => ({
    contributionDays: weeksMap[weekStart],
  }));
};

// 週の開始日を取得するヘルパー関数
const getWeekStart = (date: string): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split("T")[0]; // YYYY-MM-DD形式で返す
};

const GitHubCalendar = () => {
  const [calendarData, setCalendarData] = useState<Week[]>([]);
  const [username, setUsername] = useState("");
  const [period, setPeriod] = useState("6months");

  const handleSubmit = async () => {
    if (username) {
      const weeks = await fetchData(username, period);
      saveContributions(weeks);
      setCalendarData(weeks);
    }
  };

  const handlePeriodChange = async (value) => {
    setPeriod(value);
    if (username) {
      const weeks = await fetchData(username, value);
      setCalendarData(weeks);
    }
  };

  useEffect(() => {
    createTable();

    // SQLiteからデータを取得して表示
    fetchContributions((contributions) => {
      if (contributions.length > 0) {
        setCalendarData(formatContributionsToWeeks(contributions));
      }
    });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Load Contributions</button>
      </form>
      <label htmlFor="periodSelect">期間を選択:</label>
      <select id="periodSelect" value={period} onChange={handlePeriodChange}>
        <option value="3months">3ヶ月</option>
        <option value="6months">半年</option>
        <option value="1year">1年</option>
      </select>

      <div className="calendar">
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className="week">
            {week.contributionDays.map((day, dayIndex) => {
              console.log("week is", week);
              // console.log("week  type is", typeof week);
              console.log("calendarData is", calendarData);
              // console.log("calendarData  type is", typeof calendarData);
              console.log("day is", day);

              return (
                <div
                  key={dayIndex}
                  className="day"
                  style={{
                    backgroundColor: getColorForContribution(
                      day.contributionCount
                    ),
                  }}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const getColorForContribution = (count) => {
  if (count >= 8) return "#216e39";
  if (count >= 5) return "#30a14e";
  if (count >= 3) return "#40c463";
  if (count >= 1) return "#9BE9A8";
  return "#ebedf0";
};

export default GitHubCalendar;
