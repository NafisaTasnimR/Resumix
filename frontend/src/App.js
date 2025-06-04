import './App.css';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ResumeEditor from './ResumeEditor';
import Preview from './Preview';

function App() {
  return (
    <div className="App">
      <TopBar></TopBar>
      <Sidebar></Sidebar>
      <ResumeEditor></ResumeEditor>
      <Preview></Preview>
    </div>
  );
}

export default App;
