import React,{useEffect, useState} from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./css/singleJob.css"
const SingleJobs = (props)=>{
    const nav = useNavigate()
    const { id }= useParams()
    const auth = (localStorage.getItem("Token"))
    const [globalError,setGlobalError] = useState({isError:false,msg:""})
    const [updateJob,setupdateJob] = useState({company:"",position:"",status:"pending"})
    const [errorMessage,setErrorMessage]=useState({errType:"",isError:false,msg:<></>})
    const [updated,setUpdated] =useState(false)
    useEffect(()=>{
        const temp = setTimeout(()=>{
            setUpdated(false)
        },2500)
        return ()=>{clearTimeout(temp)}
    },[updated])
    const getExistingJob =async()=>{
        try {
            const response = await axios.get(props.url+`/api/v1/jobs/${id}`,{headers:{
                'Accept': '*/*',
                'Content-Type':'application/json',
                'Authorization':'Bearer '+auth
            }})
            setupdateJob(response.data.job)
        } catch (error) {
            if (error.response.status===401){
                setErrorMessage({errType:"auth",isError:true,msg:error.response.data.msg})
                setGlobalError({isError:true,msg:(<h1>Unauthenticated User Please <Link to='/login'>Log In</Link></h1>)})
            }else if(error.response.status===404){
                setErrorMessage({errType:"notFound",isError:true,msg:error.response.data.msg})
                setGlobalError({isError:true,msg:(<h1>No job with id:{ id} found please go to <Link to='/jobs'>Jobs</Link></h1>)})
            }else{
                setErrorMessage({errType:"misc",isError:true,msg:"An error occured, please try again later"})
            }
            return (<>
                
            </>)
        }
    }
    async function createupdateJob (e){
        e.preventDefault()
        try {
            await axios.patch(props.url+`/api/v1/jobs/${id}`,updateJob,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            setUpdated(true)
            setErrorMessage({errType:"",isError:false,msg:""})
        } catch (error) {
            setErrorMessage({errType:"update",isError:true,msg:error.response.data.msg})        
        }
      }
      
    async function deleteJob(e){
        e.preventDefault()
        try {
            await axios.delete(props.url+`/api/v1/jobs/${id}`,{
                headers:{
                    'Accept': '*/*',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+auth
                }
            })
            nav('/jobs')
            setErrorMessage({errType:"",isError:false,msg:""})
        } catch (error) {
            setErrorMessage({errType:"delete",isError:true,msg:"An error occured, please try again later.(Try to reload the page!)"})        
        
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
        cursor:"pointer",
        display:globalError.isError?"none":""
    }
        }>back</button>
        <div className="global-error">
        {globalError.isError && globalError.msg}
        </div>
        <div className={globalError.isError?"single-job-view error":"single-job-view"}>
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
                <input className="update-job-button" type={'submit'}></input>
            </form>
            {errorMessage.isError && errorMessage.errType==="update" && <p style={{color:'red',textAlign:"center",margin:"1rem 0 0 0"}}>{errorMessage.msg}</p> }
            {errorMessage.isError && errorMessage.errType==="delete" && <p style={{color:'red',textAlign:"center",margin:"1rem 0 0 0"}}>{errorMessage.msg}</p> }

            <button onClick={deleteJob}>Delete Job?</button>
            {updated && <h1>Job Updated Successfully</h1>}
        </div>
      </>
    )

}


export default SingleJobs;