import TasksTable from "./components/TasksTable";

function App() {
  return (
    <main className="py-10 flex flex-col">
      <h1 className="text-3xl font-bold text-center">Notion Integration</h1>

      <div className="mt-5 mx-auto w-full max-w-screen-xl">
        <TasksTable />
      </div>
    </main>
  );
}

export default App;
