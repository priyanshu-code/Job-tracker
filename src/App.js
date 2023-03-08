import { Route,Routes,Link } from 'react-router-dom';
import Home from './components/HomeComponent';
import Jobs from './components/JobsComponent';
import SingleJob from './components/SingleJobComponent';
import {Login,Register} from './components/Login-RegisterComponent';
import './App.css';
import axios from 'axios';
import { useState } from 'react';
function App() {
    const [authintcated,setAuthintcated] =useState(false)
    const auth = localStorage.getItem("Token")
    const url = 'https://jobs-api-kx3t.onrender.com'
    const authCheck =async ()=>{
      try {
        await axios.get(url+'/api/v1/jobs',{
          headers:{
              'Accept': '*/*',
              'Content-Type':'application/json',
              'Authorization':'Bearer '+auth}
      })  
      setAuthintcated(true)
      } catch (error) {
        console.log(error)  
        setAuthintcated(false)
      }
    }
    authCheck()
    return (
      <>
        <Routes>
          <Route path='/'  element ={<Home />}/>
          <Route path='/login'  element ={<Login authintcated={authintcated} />}/>
          <Route path='/register'  element ={<Register authintcated={authintcated} />}/>
          <Route path='/jobs'  element ={<Jobs />}/>
          <Route path='/jobs/:id'  element ={<SingleJob />}/>
        </Routes>
      </>
    );
}

export default App;
