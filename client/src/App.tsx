import NotionTable from "./components/NotionTable/NotionTable";
import { useFetch } from "./lib/hooks";
import { getTasks } from "./lib/services/task";

function App() {
  const { data, loading, error } = useFetch(getTasks);

  return (
    <main className="py-10 flex flex-col">
      <h1 className="text-3xl font-bold text-center">Notion Integration</h1>

      <div className="mt-5 mx-auto w-full max-w-screen-xl">
        <NotionTable data={data} loading={loading} error={error} />
      </div>
    </main>
  );
}

export default App;
