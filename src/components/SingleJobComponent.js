import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./css/singleJob.css"
const SingleJobs = ()=>{
    const nav = useNavigate()
    const { id }= useParams()
    const url = 'https://jobs-api-kx3t.onrender.com'
    const auth = (localStorage.getItem("Token"))
    const [updateJob,setupdateJob] = useState({company:"",position:"",status:"pending"})
    const [updated,setUpdated] =useState(false)
    useEffect(()=>{
        const temp = setTimeout(()=>{
            setUpdated(false)
        },2500)
        return ()=>{clearTimeout(temp)}
    },[updated])
    const getExistingJob =async()=>{
        try {
            const response = await axios.get(url+`/api/v1/jobs/${id}`,{headers:{
                'Accept': '*/*',
                'Content-Type':'application/json',
                'Authorization':'Bearer '+auth
            }})
            setupdateJob(response.data.job)
        } catch (error) {
            console.log(error)
        }
    }
    async function createupdateJob (e){
        e.preventDefault()
        try {
            await axios.patch(url+`/api/v1/jobs/${id}`,updateJob,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            setUpdated(true)
        } catch (error) {
            console.log(error)            
        }
      }
      
    async function deleteJob(e){
        e.preventDefault()
        try {
            await axios.delete(url+`/api/v1/jobs/${id}`,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            nav('/jobs')
        } catch (error) {
            console.log(error)            
        }
      }
      function handleChange(e){
        setupdateJob((val)=>{return {...val,[e.target.name]:e.target.value}})
      }
    useEffect(()=>{
        getExistingJob()
    },[])

    return(<>
    <button onClick={()=>{nav('/jobs')}} style={{
        margin:"3rem 0 0 5rem",
        transform:"scale(200%)",
        cursor:"pointer"}}>back</button>
        <div className="single-job-view">
            <p> Update/Delete Job</p>
            <form action='/jobs' method='post' onSubmit={createupdateJob}>
                <label htmlFor="company">Company</label>
                <input onChange={handleChange} name="company" value={updateJob.company}></input>
                <label htmlFor='position'>Position</label>
                <input onChange={handleChange} name='position'  value={updateJob.position} ></input>
                <label htmlFor='status'>status</label>
                <select name="status" value={updateJob.status} onChange={handleChange}>
                    <option value='pending'>Pending</option>
                    <option value='interview'>Interview</option>
                    <option value='declined'>Declined</option>
                </select>
                <input type={'submit'}></input>
            </form>
            <button onClick={deleteJob}>Delete Job?</button>
            {updated && <h1>Job Updated Successfully</h1>}
      </div>
      </>
    )

}


export default SingleJobs;