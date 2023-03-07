import { Link } from "react-router-dom"
import "./css/home.css"
function Home(){
    return(
        <>
        <div className="home-container">
          <h1>Job Tracker</h1>
          <p>Keep Track of your Jobs!</p>
          <button className="home-container-button"><Link to="/login">Please Click here to Continue</Link></button>
          </div>
        </>
    )
}
export default Home