import "./App.css";
import GitHubContributions from "./api/gitAPI";
import GitHubCommits from "./components/commits";

function App() {
  return (
    <div>
      <h1>GitHub Contributions</h1>
      <GitHubContributions username="ocean6954" />
      <GitHubCommits username="ocean6954" />
    </div>
  );
}

export default App;
