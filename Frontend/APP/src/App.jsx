import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home";
import MainLayout from "./Components/Layouts/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddPost from "./Components/Feeds/AddPost";

const browserRouter = createBrowserRouter([
  {
    path: "/",
  
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path:"/AddPost",
    element:<AddPost/>
  }
]);

const App = () => {
  return <RouterProvider router={browserRouter} />;
};

export default App;
