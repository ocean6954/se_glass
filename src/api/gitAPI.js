import { useState, useEffect } from "react";
import axios from "axios";

const GitHubContributions = ({ username }) => {
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalCommits, setTotalCommits] = useState(0);

  useEffect(() => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.github.com/users/${username}/events`,
          { headers: { Authorization: `token ${token}` } }
        );
        setContributions(response.data);
        console.log("レスポンスの中身", response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const fetchCommitsCount = async (username, repo) => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/commits`,
        { headers: { Authorization: `token ${token}` } }
      );
      return response.data.length;
    } catch (error) {
      console.error(`Error fetching commits for ${repo}`, error);
      return 0;
    }
  };

  const fetchRepositories = async (username) => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        { headers: { Authorization: `token ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching repositories", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTotalCommits = async () => {
      try {
        const repos = await fetchRepositories(username);
        let commitsCount = 0;

        for (const repo of repos) {
          const count = await fetchCommitsCount(username, repo.name);
          commitsCount += count;
        }

        setTotalCommits(commitsCount);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTotalCommits();
  }, [username]);

  if (loading) return <p>loading....</p>;
  if (error) return <p>Error </p>;

  const groupByDate = (contributions) => {
    return contributions.reduce((acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };

  const contributionsByDate = groupByDate(contributions);

  return (
    <div>
      {/* <h1>{contributions.name}のGitHubプロフィール</h1>
      <img
        src={contributions.avatar_url}
        alt={`${contributions.name}のアバター`}
        style={{ width: "150px", borderRadius: "50%" }}
      />
      <p>{contributions.bio}</p>
      <p>公開リポジトリ数: {contributions.public_repos}</p>
      <p>フォロワー数: {contributions.followers}</p> */}
      {/* <GitHubContributionsCalender username={username} /> */}
      {/* <GithubCalender username="ocean6954" /> */}

      <h2>{username}のコントリビューション</h2>
      <p>総コミット数: {totalCommits}</p>
      {Object.keys(contributionsByDate).length > 0 ? (
        Object.keys(contributionsByDate).map((date) => (
          <div key={date}>
            <h3>{date}</h3>
            <p>コントリビューション数: {contributionsByDate[date].length}</p>
            <ul>
              {contributionsByDate[date].map((event) => (
                <li key={event.id}>{event.type}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <li>コントリビューションが見つかりません。</li>
      )}
    </div>
  );
};

export default GitHubContributions;
