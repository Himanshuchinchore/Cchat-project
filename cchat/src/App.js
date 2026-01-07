import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join from "./Component/Join/Join";
import Chat from "./Component/Chat/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />        {/* Use element prop */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
