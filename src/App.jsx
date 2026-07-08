import {useContext} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Category from "./pages/Category.jsx";
import Income from "./pages/Income.jsx";
import Expense from "./pages/Expense.jsx";
import Filter from "./pages/Filter.jsx";
import ActivationAccount from "./pages/ActivationAccount.jsx";
import { Toaster } from 'react-hot-toast';
import {AppContext} from "./context/AppContext.js";
import {LoaderCircle} from "lucide-react";

const App = () => {
    return (

        <>
            <Toaster/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Home/></ProtectedRoute>} />
                    <Route path="/signup" element={<Signup/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/activate-account" element={<ActivationAccount/>} />
                    <Route path="/category" element={<ProtectedRoute><Category/></ProtectedRoute>} />
                    <Route path="/income" element={<ProtectedRoute><Income/></ProtectedRoute>} />
                    <Route path="/expense" element={<ProtectedRoute><Expense/></ProtectedRoute>} />
                    <Route path="/filter" element={<ProtectedRoute><Filter/></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

const AuthLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <LoaderCircle className="h-8 w-8 animate-spin text-teal-300" />
    </div>
);

const ProtectedRoute = ({children}) => {
    const {user, authLoading} = useContext(AppContext);

    if (authLoading) {
        return <AuthLoader />;
    }

    return user ? children : <Navigate to="/login" replace />;
};

const Root = () => {
    const {user, authLoading} = useContext(AppContext);

    if (authLoading) {
        return <AuthLoader />;
    }

    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

export default App;
