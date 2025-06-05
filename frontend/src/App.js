import './App.css';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ResumeEditor from './ResumeEditor';

function App() {
  return (
    <div className="App">
      <TopBar></TopBar>
      <Sidebar></Sidebar>
      <ResumeEditor></ResumeEditor>
    </div>
  );
}

export default App;
