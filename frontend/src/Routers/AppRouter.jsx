import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import {AuthProvider} from '../API/auth'
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import AddCar from "../Admin/Cars/AddCar";
import UpdateCar from "../Admin/Cars/UpdateCar";
import CarList from "../Pages/CarList";
import Admin from "../Admin/AdminPage";
import AdminCarList from "../Admin/Cars/AdminCarList";
import UsersList from "../Admin/Users/UserList";
import GetCar from "../Pages/GetCar";
import AdminLayout from '../Layout/AdminLayout';
import UserLayout from '../Layout/UserLayout';
import Search from '../Pages/Search';
import PriceFilter from '../component/PriceFilter/PriceFilter';
import Recommendations from '../component/Recommendation/Recommendation';
import TrendingCar from '../component/Recommendation/TrendingCar';
import SimilarCar from '../component/Recommendation/SimilarCar';
import MostVisitedCar from '../component/Recommendation/MostVisited';
import LastSearch from '../component/Recommendation/LastSearch';
import FavoriteCars from '../component/Recommendation/Favoutite';
import Map from '../Pages/Map';
import Contact_Us from '../Admin/Contact/Contact_Us';
import Success from '../Pages/Success';
import Success1 from '../Pages/Success1';
import Cancel from '../Pages/Cancel';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Purchase from '../Admin/Purchase/Purchase';
import PurchaseDetails from '../Admin/Purchase/PurchaseDetails';
import UserPurchase from '../Pages/UserPurchase';
import ForgotPassword from '../component/ForgotPassword/ForgotPassword';
import ResetPassword from '../component/ForgotPassword/ResetPassword';
import ReviewsPage from '../Admin/Reviews/ReviewPage';


function AppRouter() {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin") === "true";

    return (
        // <AuthProvider>
        <Routes>
            {/* Common Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot password" element={<ForgotPassword/> }/> 
            <Route path="/reset-password" element={<ResetPassword/> }/>

            {/* User Routes */}
            {!admin && (
                <>
                    <Route path="/" element={<UserLayout><Home /></UserLayout>} />
                    <Route path="/user-cars" element={<UserLayout><CarList /></UserLayout>} />
                    <Route path="/cars/details/:name" element={<UserLayout><GetCar /></UserLayout>} />
                    <Route path="/search-results" element={<UserLayout><Search /></UserLayout>} />
                    <Route path="/filter" element={<UserLayout><PriceFilter /></UserLayout>} />
                    <Route path="/recommendation" element={<UserLayout><Recommendations /></UserLayout>} />
                    <Route path="/trending" element={<UserLayout><TrendingCar /></UserLayout>} />
                    <Route path="/similar-cars" element={<UserLayout><SimilarCar/> </UserLayout>}/>
                    <Route path="/mostvisited-cars" element={<UserLayout><MostVisitedCar/> </UserLayout>}/>
                    <Route path="/lastsearch" element={<UserLayout><LastSearch/> </UserLayout>}/>
                    <Route path="/favourites" element={<UserLayout><FavoriteCars/> </UserLayout>}/>
                    <Route path="/maps" element={<UserLayout><Map/></UserLayout>} />
                    <Route path="/success" element={<UserLayout><Success/></UserLayout>}/>
                    <Route path="/success1" element={<UserLayout><Success1/></UserLayout>}/>
                    <Route path="/cancel" element={<UserLayout><Cancel/></UserLayout>}/>
                    <Route path="/about" element={<UserLayout><About/></UserLayout>}/>
                    <Route path="/contact" element={<UserLayout><Contact/></UserLayout>}/>
                    <Route path="/purchase-remain/:email" element={<UserLayout><UserPurchase/></UserLayout>}/>
                </>
            )}

            {/* Admin Routes */}
            {admin && (
                <>
                    <Route path="/admin-dashboard" element={<AdminLayout><Admin /></AdminLayout>} />
                    <Route path="/admin/cars" element={<AdminLayout><AdminCarList /></AdminLayout>} />
                    <Route path="/admin/users" element={<AdminLayout><UsersList /></AdminLayout>} />
                    <Route path="/cars/add" element={<AdminLayout><AddCar /></AdminLayout>} />
                    <Route path="/cars/update/:name" element={<AdminLayout><UpdateCar /></AdminLayout>} />
                    <Route path="/admin/contact" element={<AdminLayout><Contact_Us/></AdminLayout>} />
                    <Route path="/admin/purchase" element={<AdminLayout><Purchase/></AdminLayout>}/>
                    <Route path="/purchase-details/:id" element={<AdminLayout><PurchaseDetails/></AdminLayout>}/>
                    <Route path="/admin/reviews" element={<AdminLayout><ReviewsPage/> </AdminLayout>} />
                </>
            )}

            {/* Fallback Route */}
            {/* <Route path="*" element={<Navigate to={token ? (isAdmin ? "/admin-dashboard" : "/") : "/login"} />} /> */}
        </Routes>
        // </AuthProvider>
    );
}


export default AppRouter;
