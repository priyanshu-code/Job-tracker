import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./css/auth.css"
const Login =(props)=>{
  const nav = useNavigate()
    useEffect(()=>{
    if (props.authintcated){
      nav('/jobs')
    }
    })
    const [errorMessage,setErrorMessage]=useState({isError:false,msg:""})
    const [user,setUser] = useState({email:"",password:""})
    async function handleSubmit (e){
      localStorage.removeItem("Token")
      e.preventDefault()
        try {
        const response = await axios.post(props.url+"/api/v1/auth/login",user,
        {headers:{
          'Accept': '*/*',
          'Content-Type':'application/json',
        }})
        localStorage.setItem("Token",response.data.token)
        localStorage.setItem("User",response.data.user.user)
        nav('/jobs')
      } catch (error) {
        setErrorMessage({isError:true,msg:error.response.data.msg})  
      }
    }
    function handleChange(e){
      setUser((val)=>{return {...val,[e.target.name]:e.target.value}})
    }
    return ( <div className="login-wrapper">
        <h1>Login User</h1>
        <form className="login-form" action='/jobs' method='post' onSubmit={handleSubmit}>
              <label className="login-form-child" htmlFor='email'>E-mail</label>
              <input className="login-form-child" onChange={handleChange} name='email' type='email' value={user.email} ></input>
              <label className="login-form-child" htmlFor='password'>Password</label>
              <input className="login-form-child" onChange={handleChange} name='password' type='password' value={user.password}></input>
              <input className="login-submit-button" type={'submit'}></input>
        </form>
        {errorMessage.isError && <p style={{color:'red',textAlign:"center"}}>{errorMessage.msg}</p> }
        <Link to="/register">Not Registered?</Link>
      </div>

    );
}

const Register =(props)=>{
  const [errorMessage,setErrorMessage]=useState({isError:false,msg:""})
    const nav = useNavigate()
    useEffect(()=>{
      if (props.authintcated){
        nav('/jobs')
      }
      })
    const [user,setUser] = useState({name:"",email:"",password:""})
    async function handleSubmit (e){
      localStorage.removeItem("Token")
      e.preventDefault()
        try {
        const response = await axios.post(props.url+"/api/v1/auth/register",user,
        {headers:{
          'Accept': '*/*',
          'Content-Type':'application/json',
        }})
        localStorage.setItem("Token",response.data.token)
        localStorage.setItem("User",response.data.user.user)
        nav('/jobs')
      } catch (error) {
        if(error.response.status===400){
          setErrorMessage({msg:error.response.data.msg,isError:true})
        }      
      }
    }
    function handleChange(e){
      setUser((val)=>{return {...val,[e.target.name]:e.target.value}})
    }
    return (
     <div className="login-wrapper">
      {props.authintcated?<p>Loading!</p>:
      <>
        <h1>Register User</h1>
        <form className="login-form" action='/jobs' method='post' onSubmit={handleSubmit}>
              <label className="login-form-child" htmlFor='name'>Name</label>
              <input className="login-form-child" onChange={handleChange} id="name" name="name" value={user.name}></input>
              <label className="login-form-child" htmlFor='email'>E-mail</label>
              <input className="login-form-child" onChange={handleChange} name='email' type='email' value={user.email} ></input>
              <label className="login-form-child" htmlFor='password'>Password</label>
              <input className="login-form-child" onChange={handleChange} name='password' type='password' value={user.password}></input>
              <input className="login-submit-button" type={'submit'}></input>
        </form>
        {errorMessage.isError && <p style={{color:'red',textAlign:"center"}}>{errorMessage.msg}</p> }
        <Link to='/login'>Already have an Account?</Link></>
        }
      </div>

    );
}

export  {Login,Register}