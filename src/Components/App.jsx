import '../Styles/App.css';
import Login from './Login';
import Home from './Home';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
