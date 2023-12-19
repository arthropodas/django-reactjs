import { createBrowserRouter } from 'react-router-dom';
import Login from '../../Login/login';
import Home from '../../pages/Home'
import Sidebar from '../Sidebar';


const routes = [
  {
    path: '/',
    element: <Login />
  },

 
  {
    path:'/home',
    element:<Home/>
    
  },


];

const router = createBrowserRouter(routes);
export default router;
