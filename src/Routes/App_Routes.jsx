import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import BookingConcert from "../pages/concert/BookingConcert";
import BookerDashboard from "../pages/dashboard/BookerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import SellStatus from "../components/AdminDashboard/SellStatus";
import AddSans from "../components/AdminDashboard/AddSans";
import Layout from "../components/Layout";
import EditInformation from "../components/UserDashboard/EditInformation";
import EventHistory from "../components/UserDashboard/EventHistory";
import ReservCheirHistory from "../components/UserDashboard/ReservCheirHistory";
import PaymentHistory from "../components/UserDashboard/PaymentHistory";
import EmptySans from "../components/BookerDashboard/EmptySans";
import EventHistory2 from "../components/BookerDashboard/EventHistory";
import Verify_Email from "../components/Verify-Email";
import Landing from '../pages/Landing'
import Navigatation from "../components/Naigate";

const App_Routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "*",
                element: <Navigatation />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "Landing",
                element: <Landing />
            },
            {
                path: "user-dashboard",
                element: <UserDashboard />,
                children: [
                    {
                        path: "EditInformation",
                        element: <EditInformation />
                    },
                    {
                        path: "eventHistory",
                        element: <EventHistory />
                    },
                    {
                        path: "reservCheirHistory",
                        element: <ReservCheirHistory />
                    },
                    {
                        path: "paymentHistory",
                        element: <PaymentHistory />
                    }
                    
                ]
            },
            {
                path: "admin-dashboard",
                element: <AdminDashboard />,
                children: [
                    {
                        path: "sellStatus",
                        element: <SellStatus />
                    },
                    {
                        path: "addSans",
                        element: <AddSans />
                    },
                ]
            },
            {
                path: "artist-dashboard",
                element: <BookerDashboard />,
                children : [
                    {
                        path: "emptySans",
                        element: <EmptySans />
                    },
                    {
                        path: "eventHistory",
                        element: <EventHistory2 />
                    },
                    
                ]
            },
            {
                path: "booking",
                element: <BookingConcert />
            },
            {
                path: "verify-email",
                element: <Verify_Email />
            }
        ]
    }
])

export default App_Routes;