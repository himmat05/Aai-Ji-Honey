// import {createBrowserRouter ,Form,RouterProvider} from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Home from './components/Home'
// import About from './components/About'
// import Products from './components/Products'
// import Contact from './components/Contact'
// import OrderDashboard from './components/OrderDashboard'
// import './App.css'
// import Footer from './components/Footer'
// import AddProduct from './components/Addproduct'
// import Login from './components/Login'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {

//   const router = createBrowserRouter([
//     {
//       path: '/',
//       element: <><Navbar /><Home/></>,
//     },{
//       path: '/About',
//       element: <><Navbar /><About/></>,
//     },{
//       path: '/products',
//       element: <><Navbar /><Products/></>,
//     },{
//       path: '/Contact',
//       element: <><Navbar /><Contact/></>,
//     },{
//       path: '/add-product',
//       element: <><Navbar /><AddProduct/></>,
//     },{
//       path: '/login',
//       element: <Login />
//     },{
//       path: '/form',
//       element: <Form />
//     },{
//       path:'/orderDashboard',
//       element: <OrderDashboard />
//     },{
//       path: '/orders',
//       element: <OrderDashboard />
//     },{
//       path: '/orders/:id',
//       element: <OrderDashboard />
//     },{
//       path: '/products/:id',
//       element: <Products />
//     },{
//       path: '/products/:id/edit',
//       element: <AddProduct />
//     },{
//       path: '/products/:id/delete',
//       element: <AddProduct />
//     },{
//       path: '/products/:id/add',
//       element: <AddProduct />
//     },{
//       path: '/products/:id/update',
//       element: <AddProduct />
//     }
//   ])

//   return (
//     <div>
//       <RouterProvider router={router} />
//       <ToastContainer position="top-center" autoClose={3000} />
//       <Footer/>
//     </div>
//   )
// }

// export default App


import {createBrowserRouter ,Form,RouterProvider, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar /><Home/></>,
    },{
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
      element: <ProtectedRoute><><Navbar /><AddProduct/></></ProtectedRoute>,
    },{
      path: '/login',
      element: <Login />
    },{
      path: '/form',
      element: <Form />
    },{
      path:'/orderDashboard',
      element: <ProtectedRoute><OrderDashboard /></ProtectedRoute>
    },{
      path: '/orders',
      element: <ProtectedRoute><OrderDashboard /></ProtectedRoute>
    },{
      path: '/orders/:id',
      element: <ProtectedRoute><OrderDashboard /></ProtectedRoute>
    },{
      path: '/products/:id',
      element: <Products />
    },{
      path: '/products/:id/edit',
      element: <ProtectedRoute><AddProduct /></ProtectedRoute>
    },{
      path: '/products/:id/delete',
      element: <ProtectedRoute><AddProduct /></ProtectedRoute>
    },{
      path: '/products/:id/add',
      element: <ProtectedRoute><AddProduct /></ProtectedRoute>
    },{
      path: '/products/:id/update',
      element: <ProtectedRoute><AddProduct /></ProtectedRoute>
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