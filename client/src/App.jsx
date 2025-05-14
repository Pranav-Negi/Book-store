import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Profile from './pages/Profile';
import History from './pages/History';
import Market from './pages/Market';
import Update from './pages/Update';
import Books from './pages/Books';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/History" element={<History />} />
        <Route path="/Market" element={<Market />} />
        <Route path="/Update" element={<Update />} />
        <Route path="/Books" element={<Books />} />
      </Routes>
    </Router>
  );
};

export default App;
