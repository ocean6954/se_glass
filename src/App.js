import "./App.css";
// import GitHubContributions from "./api/gitAPI";
// import GitHubCommits from "./components/commits";
import GitHubCalendar from "./components/GitHubCalendar";

function App() {
  return (
    <div>
      <h1>GitHub Contributions</h1>
      {/* <GitHubContributions username="ocean6954" /> */}
      {/* <GitHubCommits username="ocean6954" /> */}
      <GitHubCalendar />
    </div>
  );
}

export default App;
