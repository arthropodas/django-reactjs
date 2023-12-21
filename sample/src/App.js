import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './components/router/Router';
import UserPanel from './UserPanel';
import OrganizerPanel from './OrganizerPanel';
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
function App() {
  return (
  
  <RouterProvider router={router}>
    <>
   
    </>
  </RouterProvider>

  
  );
}

export default App;
