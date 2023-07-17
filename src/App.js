import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Compiler from './Components/Compiler';


function App() {
  return (
    <div>
      <Navbar/>
      <BrowserRouter>
      <Routes>
        <Route  exact path='/' element={<Home/>}/>
        <Route  exact path='/login' element={<Login/>}/>
        <Route  exact path='/signup' element={<Signup/>}/>
        <Route exact path ='/Compiler' element={<Compiler/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;