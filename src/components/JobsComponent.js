import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {AiFillDelete,AiOutlineEdit} from "react-icons/ai"
import "./css/allJobs.css"
const Jobs = (props)=>{
    const [errorMessage,setErrorMessage]=useState({errType:"",isError:false,msg:""})
    const [globalError,setGlobalError] = useState({isError:false,msg:""})
    const [jobDelete,setJobDelete] = useState(false)
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
                setGlobalError({isError:true,msg:(<h2 style={{textAlign:"center"}}>Unauthenticated User Please <Link to='/login'>Log In</Link></h2>)})
            }   
        }
    }
    useEffect(()=>{
        getAllJobs()
    },[jobDelete])
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
         <Link to ='/jobs/create'>
            <button className="create-job-button">Create New Job</button>
         </Link>
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