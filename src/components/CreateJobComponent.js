import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./css/createNewJob.css"
export default function CreateNewJob(props){
    const nav = useNavigate()
    const [newJob,setNewJob] = useState({company:"",position:"",status:"pending"})
    const [errorMessage,setErrorMessage]=useState({errType:"",isError:false,msg:""})
    const [globalError,setGlobalError] = useState({isError:false,msg:""})
    const auth = (localStorage.getItem("Token"))
    async function createNewJob (e){
        e.preventDefault()
        try {
            const response = await axios.post(props.url+'/api/v1/jobs',newJob,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            const temp_id = response.data.job._id
            setNewJob({company:"",position:"",status:"pending"})
            setErrorMessage({errType:"",isError:false,msg:""})
            setGlobalError({isError:false,msg:""})
            nav(`/jobs/${temp_id}`)
          } catch (error) {
            console.log(error.response.data)
            let temperr = error.response.data.msg.split("Path").join(" ")
            setErrorMessage({errType:"create",isError:true,msg:temperr})
            if (error.response.status===401){
                setErrorMessage({errType:"auth",isError:true,msg:error.response.data.msg})
                setGlobalError({isError:true,msg:(<h2 style={{textAlign:"center"}}>Unauthenticated User Please <Link to='/login'>Log In</Link></h2>)})
            }
        }
      }
      function handleChange(e){
        setNewJob((val)=>{return {...val,[e.target.name]:e.target.value}})
      }
      return(
      <div>
        <button onClick={()=>{nav('/jobs')}} style={{
        margin:"3rem 0 0 5rem",
        transform:"scale(200%)",
        cursor:"pointer",
        display:globalError.isError?"none":""
    }
        }>back</button>
        <div className="global-error">
            {globalError.isError && globalError.msg}
        </div>
        <div className={globalError.isError?"create-job-view error":"create-job-view"}>
            <h1>Create new Job</h1>
            <form action='/jobs' method='post' onSubmit={createNewJob}>
                <label htmlFor="company">Company</label>
                <input className="job-form-imputs" onChange={handleChange} name="company" value={newJob.company}></input>
                <label htmlFor='position'>Position</label>
                <input className="job-form-imputs" onChange={handleChange} name='position'  value={newJob.position} ></input>
                <label htmlFor='status'>Status</label>
                <select className="job-select" name="status" value={newJob.status} onChange={handleChange}>
                    <option value='pending'>Pending</option>
                    <option value='interview'>Interview</option>
                    <option value='declined'>Declined</option>
                </select>
                <input className="create-submit" type={'submit'}></input>
            </form>
                {errorMessage.isError && errorMessage.errType==="create" && <p style={{color:'red',textAlign:"center",margin:"1rem 0 0 0",fontSize:"0.8rem"}}>{errorMessage.msg}</p> }
        </div>
      </div>
      )
}