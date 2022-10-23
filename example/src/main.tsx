import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

const keys = {
    term: {
        search: (term: string) => ["term", term]
    }
}

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Test />
    </QueryClientProvider>
  );
};

function Test() {
  const api = useApi();
  const [term, setTerm] = React.useState("");

  const query = useQuery({
    queryKey: ["term", term],
    queryFn: () => api.getRepositories(term).then((res) => res.json())
  });

  return (
    <div>
      <input value={term} onChange={(e) => setTerm(e.target.value)} />
      <ul>
        {query.data?.items.map((repo: any) => (
          <li key={repo.id}>
            <a href={repo.html_url}>{repo.full_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useApi() {
  return {
    getRepositories: (string: string) =>
      fetch(`https://api.github.com/search/repositories?q=${string}`)
  };
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
