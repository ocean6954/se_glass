import React, { useState } from "react";
import "./GitHubCalendar.css";
import { fetchData } from "../api/gitGraphQL";

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

const GitHubCalendar = () => {
  const [calendarData, setCalendarData] = useState<Week[]>([]);
  const [username, setUsername] = useState("ocean6954");
  const [period, setPeriod] = useState("6months");

  const handleSubmit = async (event) => {
    event.preventDefault(); // これを追加

    console.log("handleSubmitの呼び出し");
    if (username) {
      const weeks = await fetchData(username, period);
      // saveContributions(weeks);
      console.log("weeks : ", weeks);

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

  // useEffect(() => {
  //   createTable();

  //   // SQLiteからデータを取得して表示
  //   fetchContributions((contributions) => {
  //     if (contributions.length > 0) {
  //       setCalendarData(formatContributionsToWeeks(contributions));
  //     }
  //   });
  // }, []);

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
              // console.log("week is", week);
              // console.log("calendarData is", calendarData);
              // console.log("day is", day);

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
