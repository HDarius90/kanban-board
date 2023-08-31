import './App.css'
import Column from './Column';


function App() {
  const seedTasks = [
    {
      boardName: 'Board 1',
      text: "Go to sleep",
      state: 'todo',
      priority: "low",
      deadline: "2023-08-14",
    },
    {
      boardName: 'Board 1',
      text: "Go to bed",
      state: 'done',
      priority: "medium",
      deadline: "2023-08-14",
    },
    {
      boardName: 'Board 1',
      text: "Go to school",
      state: 'inprogress',
      priority: "high",
      deadline: "2023-08-14",
    },
    {
      boardName: 'Board 2',
      text: "Eat",
      state: 'done',
      priority: "medium",
      deadline: "2023-08-14",
    },
    {
      boardName: 'Board 2',
      text: "Test",
      state: 'done',
      priority: "medium",
      deadline: "2023-08-14",
    },
  ];

  return (
    <>
      <Column stateName='todo' allTask={seedTasks} />
      <Column stateName='inprogress' allTask={seedTasks} />
      <Column stateName='done' allTask={seedTasks} />
    </>
  )
}

export default App
