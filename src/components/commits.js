import React, { useState, useEffect } from "react";
import axios from "axios";

// GitHubCommitsコンポーネント
const GitHubCommits = ({ username, repo }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/commits`,
          { headers: { Authorization: `token ${token}` } }
        );
        setCommits(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [username, repo]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // コミットを日付ごとにグループ化
  const groupByDate = (commits) => {
    return commits.reduce((acc, commit) => {
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(commit);
      return acc;
    }, {});
  };

  const commitsByDate = groupByDate(commits);

  return (
    <div>
      <h2>
        {username}/{repo} のコミット数
      </h2>
      {Object.keys(commitsByDate).length > 0 ? (
        Object.keys(commitsByDate).map((date) => (
          <div key={date}>
            <h3>{date}</h3>
            <p>コミット数: {commitsByDate[date].length}</p>
            <ul>
              {commitsByDate[date].map((commit) => (
                <li key={commit.sha}>{commit.commit.message}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>コミットが見つかりません。</p>
      )}
    </div>
  );
};

export default GitHubCommits;
