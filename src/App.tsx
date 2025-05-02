import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import { Header, Footer, Checkout, ContactForm } from "./components";

// Pages
import MainContainer from "./Pages/Home";
import Menu from "./Pages/Menu";
import Admin from "./Pages/Admin";
import Profile from "./Pages/Profile";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Login from "./Pages/Auth/Login";
import { useStateValue } from "./context/StateProvider";
import { actionTypes } from "./context/reducer";
import { fetchCartData, fetchFoodData } from "./utils/functions";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [{ showCart, showContactForm }, dispatch] = useStateValue();
  
  useEffect(() => {
    setIsLoading(true);
    fetchFoodData(dispatch).then(() => {
      fetchCartData(dispatch).then(() => {
        setIsLoading(false);
      });
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      <div className="w-screen h-auto min-h-[100vh] flex flex-col bg-primary">
        <Header />
        <main className="mt-16 md:mt-16 px-3 md:px-8 md:py-4 py-4 w-full h-auto">
          <Routes>
            <Route path="/*" element={<MainContainer />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

          {showCart && <Checkout handler={() => dispatch({type: 'TOGGLE_CART', showCart: !showCart})} />}
          {showContactForm && <ContactForm />}
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AnimatePresence>
  );
}

export default App;
