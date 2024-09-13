import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GitHubCalendar.css";

const getDateRange = (period) => {
  const toDate = new Date(); // 現在の日付
  let fromDate = new Date();

  if (period === "3months") {
    fromDate.setMonth(toDate.getMonth() - 3); // 3ヶ月前
  } else if (period === "6months") {
    fromDate.setMonth(toDate.getMonth() - 6); // 半年前
  } else if (period === "1year") {
    fromDate.setFullYear(toDate.getFullYear() - 1); // 1年前
  }

  return { from: fromDate.toISOString(), to: toDate.toISOString() };
};

const GitHubCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [username, setUsername] = useState("");

  const [period, setPeriod] = useState("6months");

  const fetchData = async (username, period) => {
    const { from, to } = getDateRange(period);

    const query = `
        {
          user(login: "${username}") {
            contributionsCollection(from: "${from}", to: "${to}") {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        { query },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      const weeks =
        response.data.data.user.contributionsCollection.contributionCalendar
          .weeks;
      setCalendarData(weeks);
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username) {
      fetchData(username, period);
    }
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    if (username) {
      fetchData(username, event.target.value);
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
            {week.contributionDays.map((day, dayIndex) => (
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
            ))}
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
