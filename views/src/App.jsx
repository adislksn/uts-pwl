import { Product } from './pages';
import { Routes, Route } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Product/>} />
    </Routes>
);
}

export default App
