import { Routes, Route } from 'react-router-dom'
import Categories from '../pages/Categories'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Expenses from '../pages/Expenses'
import PrivateRoute from './PrivateRoute'

function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element= {
                <Login />
            }/> 
            <Route path='/dashboard' element= {
               <PrivateRoute>
                   <Dashboard />
               </PrivateRoute>
            }/> 
            <Route path='/categories' element= {
               <PrivateRoute>
                   <Categories />
               </PrivateRoute>
            }/> 
            <Route path='/expenses' element= {
               <PrivateRoute>
                   <Expenses />
               </PrivateRoute>
            }/>
        </Routes>
    )
}

export default AppRoutes