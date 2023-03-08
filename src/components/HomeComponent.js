import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./css/home.css"
function Home(props){
  
    return(
        <>
        <div className="home-container">
          <h1>Job Tracker</h1>
          <p>Keep Track of your Jobs!</p>
          <button className="home-container-button"><Link to={props.authintcated?"/jobs":"/login"}>Please Click here to Continue</Link></button>
          </div>
        </>
    )
}
export default Home