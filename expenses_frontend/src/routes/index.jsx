import { Routes, Route } from 'react-router-dom'
//import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
//import PrivateRoute from './PrivateRoute'

function AppRoutes(){
    return(
        <Routes>
            <Route path='/dashboard' element= {
               <Dashboard />
            }/> 
        </Routes>
    )
}

export default AppRoutes