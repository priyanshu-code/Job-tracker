import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/allJobs.css"
const Jobs = ()=>{
    const [createJob,setCreateJob] = useState(false)
    const [newJob,setNewJob] = useState({company:"",position:"",status:"pending"})
    const url = 'https://jobs-api-kx3t.onrender.com'
    const user = (localStorage.getItem("User"))
    const auth = (localStorage.getItem("Token"))
    const [allJobs,setAllJobs] = useState(null)
    const getAllJobs = async()=>{
        try {
            const response = await axios.get(url+'/api/v1/jobs',{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            }) 
            setAllJobs(response.data.jobs)
        } catch (error) {
            console.log(error.response)   
        }
    }
    useEffect(()=>{
        getAllJobs()
    },[createJob])
    async function createNewJob (e){
        e.preventDefault()
        try {
            await axios.post(url+'/api/v1/jobs',newJob,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            setCreateJob(false)
            setNewJob({company:"",position:"",status:"pending"})
        } catch (error) {
            console.log(error.response)            
        }
      }
      function handleChange(e){
        setNewJob((val)=>{return {...val,[e.target.name]:e.target.value}})
      }
      const createJobForm =(
      <div className="create-job-form">
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
      </div>
      )
    return(
        <div className="jobs-container">
        <h1 className="jobs-user">Welcome {user}</h1>
        {createJob && createJobForm}
        {!createJob && <button className="create-job-button" onClick={()=>{setCreateJob(true)}}>Create New Job</button>}
        <div className="job-display">
                {allJobs && allJobs.map((job)=>{
                    const {status,company,position} =job
                    let bgcolor =""
                    let color = "" 
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
                        </Link>
                    )
                })}
        </div>
        </div>
    )
}

export default Jobs;