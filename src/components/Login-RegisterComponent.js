import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Login =(props)=>{
    const nav = useNavigate()
    if (props.authintcated){
      nav('/jobs')
    }
    const [user,setUser] = useState({email:"",password:""})
    const url ='https://jobs-api-kx3t.onrender.com'
    async function handleSubmit (e){
      localStorage.removeItem("Token")
      e.preventDefault()
        try {
        const response = await axios.post(url+"/api/v1/auth/login",user,
        {headers:{
          'Accept': '*/*',
          'Content-Type':'application/json',
        }})
        localStorage.setItem("Token",response.data.token)
        localStorage.setItem("User",response.data.user.user)
        nav('/jobs')
      } catch (error) {
        console.log(error.response)      
      }
    }
    function handleChange(e){
      setUser((val)=>{return {...val,[e.target.name]:e.target.value}})
    }
    return ( <div className="App">
        <h1>Login User</h1>
        <form action='/jobs' method='post' onSubmit={handleSubmit}>
              <label htmlFor='email'>E-mail</label>
              <input onChange={handleChange} name='email' type='email' value={user.email} ></input>
              <label htmlFor='password'>Password</label>
              <input onChange={handleChange} name='password' type='password' value={user.password}></input>
              <input type={'submit'}></input>
        </form>
        <Link to="/register">Not Registered?</Link>
      </div>

    );
}

const Register =(props)=>{
    const nav = useNavigate()
    if (props.authintcated){
      nav('/jobs')
    }
    const url ='https://jobs-api-kx3t.onrender.com'
    const [user,setUser] = useState({name:"",email:"",password:""})
    async function handleSubmit (e){
      localStorage.removeItem("Token")
      e.preventDefault()
        try {
        const response = await axios.post(url+"/api/v1/auth/register",user,
        {headers:{
          'Accept': '*/*',
          'Content-Type':'application/json',
        }})
        localStorage.setItem("Token",response.data.token)
        localStorage.setItem("User",response.data.user.user)
        nav('/jobs')
      } catch (error) {
        console.log(error.response)      
      }
    }
    function handleChange(e){
      setUser((val)=>{return {...val,[e.target.name]:e.target.value}})
    }
    return (
     <div className="App">
        <h1>Register User</h1>
        <form action='/jobs' method='post' onSubmit={handleSubmit}>
              <label htmlFor='name'>Name</label>
              <input onChange={handleChange} id="name" name="name" value={user.name}></input>
              <label htmlFor='email'>E-mail</label>
              <input onChange={handleChange} name='email' type='email' value={user.email} ></input>
              <label htmlFor='password'>Password</label>
              <input onChange={handleChange} name='password' type='password' value={user.password}></input>
              <input type={'submit'}></input>
        </form>
        <Link to='/login'>Already have an Account?</Link>
      </div>

    );
}

export  {Login,Register}