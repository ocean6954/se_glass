import React, { useState } from "react";
import "./GitHubCalendar.css";
import { fetchData } from "../api/gitGraphQL";

interface contributionDay {
  date: string;
  contributionCount: number;
}

interface week {
  contributionDays: contributionDay[];
}

const GitHubCalendar = () => {
  const [calendarData, setCalendarData] = useState<week[]>([]);
  const [username, setUsername] = useState("");

  const [period, setPeriod] = useState("6months");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username) {
      const weeks = await fetchData(username, period);
      setCalendarData(weeks);
    }
  };

  const handlePeriodChange = async (event) => {
    setPeriod(event.target.value);
    if (username) {
      const weeks = await fetchData(username, event.target.value);
      setCalendarData(weeks);
    }
  };

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
