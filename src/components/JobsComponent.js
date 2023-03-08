import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {AiFillDelete,AiOutlineEdit} from "react-icons/ai"
import {IoClose} from "react-icons/io5"
import "./css/allJobs.css"
const Jobs = (props)=>{
    const [errorMessage,setErrorMessage]=useState({errType:"",isError:false,msg:""})
    const [globalError,setGlobalError] = useState({isError:false,msg:""})
    const [createJob,setCreateJob] = useState(false)
    const [jobDelete,setJobDelete] = useState(false)
    const [newJob,setNewJob] = useState({company:"",position:"",status:"pending"})
    const user = (localStorage.getItem("User"))
    const auth = (localStorage.getItem("Token"))
    const [allJobs,setAllJobs] = useState(null)
    const getAllJobs = async()=>{
        try {
            const response = await axios.get(props.url+'/api/v1/jobs',{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            }) 
            setAllJobs(response.data.jobs)
        } catch (error) {
            if (error.response.status===401){
                setErrorMessage({errType:"auth",isError:true,msg:error.response.data.msg})
                setGlobalError({isError:true,msg:(<h1>Unauthenticated User Please <Link to='/login'>Log In</Link></h1>)})
            }   
        }
    }
    useEffect(()=>{
        getAllJobs()
    },[createJob,jobDelete])
    
    async function createNewJob (e){
        e.preventDefault()
        try {
            await axios.post(props.url+'/api/v1/jobs',newJob,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            setCreateJob(false)
            setNewJob({company:"",position:"",status:"pending"})
            setErrorMessage({errType:"",isError:false,msg:""})
        } catch (error) {
            let temperr = error.response.data.msg.split("Path").join(" ")
            setErrorMessage({errType:"create",isError:true,msg:temperr})
        }
      }
      function handleChange(e){
        setNewJob((val)=>{return {...val,[e.target.name]:e.target.value}})
      }
      const createJobForm =(<div className="create-job-form-wrapper">
      
      <div className="create-job-form">
        <div className="create-job-form-head">
            <div>
            <h1>Create new Job</h1>
            </div>
            <IoClose className="create-job-close" onClick={()=>{setCreateJob(false)
                setNewJob({company:"",position:"",status:"pending"})
                setErrorMessage({errType:"",isError:false,msg:""})}} />
        </div>
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
            {errorMessage.isError && errorMessage.errType==="create" && <p style={{color:'red',textAlign:"center",margin:"1rem 0 0 0"}}>{errorMessage.msg}</p> }
            <input className="create-submit" type={'submit'}></input>
        </form>
      </div>
      </div>
      )
      async function deleteJob(e){
        const id =e.target.parentNode.parentNode.value
        e.preventDefault()
        try {
            await axios.delete(props.url+`/api/v1/jobs/${id}`,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            setJobDelete(!jobDelete)
        } catch (error) {
            setErrorMessage({errType:"delete",isError:true,msg:"An error occured, please try again later.(Try to reload the page!)"})            
        }
      }
    return(<>

            {globalError.isError && <div className="global-error">{globalError.msg}</div>}
        <div className={globalError.isError?"jobs-container error":"jobs-container"}>
        <h1 className="jobs-user">Welcome {user}</h1>
        {errorMessage.isError && errorMessage.errType==="delete" && <p style={{color:'red',textAlign:"center",margin:"0 0 1rem 0"}}>{errorMessage.msg}</p> }
        {createJob && createJobForm}
        {!createJob && <button className="create-job-button" onClick={()=>{setCreateJob(true)}}>Create New Job</button>}
        <div className="job-display">
                {allJobs && allJobs.map((job)=>{
                    const {status,company,position,} =job
                    let bgcolor =""
                    if (status==="pending"){bgcolor="#d4d445"}
                    else if(status==="declined"){bgcolor="#ca111b"}
                    else{bgcolor="#09bc13"}
                    return(
                        <Link style={{backgroundColor:bgcolor}} to={`${job._id}`}>
                            <div className="job-card">
                                <p>Company: {company}</p>
                                <p>Position: {position}</p>
                                <p>Status: {status}</p>
                            </div>
                            <div className="job-options">
                            <button value={job._id}><AiFillDelete onClick={deleteJob} className="job-options-img" /></button>
                            <button ><AiOutlineEdit className="job-options-img" /></button>
                            </div>
                        </Link>
                    )
                })}
        </div>
        </div>
        </>
    )
}

export default Jobs;