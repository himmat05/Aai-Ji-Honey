import {createBrowserRouter ,Form,RouterProvider} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/HOme'
import About from './components/About'
import Products from './components/Products'
import Contact from './components/Contact'
import OrderDashboard from './components/OrderDashboard'
import './App.css'
import Footer from './components/Footer'
import AddProduct from './components/Addproduct'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar /><Home/></>,
    },
    {
      path: '/About',
      element: <><Navbar /><About/></>,
    },{
      path: '/products',
      element: <><Navbar /><Products/></>,
    },{
      path: '/Contact',
      element: <><Navbar /><Contact/></>,
    },{
      path: '/add-product',
      element: <><Navbar /><AddProduct/></>,
    },{
      path: '/login',
      element: <Login />
    },{
      path: '/form',
      element: <Form />
    },{
      path:'/orderDashboard',
      element: <OrderDashboard />
    },{
      path: '/orders',
      element: <OrderDashboard />
    },{
      path: '/orders/:id',
      element: <OrderDashboard />
    },{
      path: '/products/:id',
      element: <Products />
    },{
      path: '/products/:id/edit',
      element: <AddProduct />
    },{
      path: '/products/:id/delete',
      element: <AddProduct />
    },{
      path: '/products/:id/add',
      element: <AddProduct />
    },{
      path: '/products/:id/update',
      element: <AddProduct />
    }

  ])

  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer/>
    </div>
  )
}

export default App