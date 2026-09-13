import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthProvider";
import WishlistProvider from "./Context/WishlistContext";
import ScrollToTop from "./Components/ScrollToTop";
import CheckoutModal from "./Components/CheckoutModal";
import CartDrawer from "./Components/CartDrawer";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Shop from "./Components/Shop";
import KitHighlights from "./Components/KitHighlights";
import ProductPage from "./Components/ProductPage";
import Contact from "./Components/Contact";
import AccountPage from "./Components/AccountPage";
import AdminPanel from "./Components/AdminPanel";

function Home() {
  return (
    <>
      <Hero />
      <Shop />
      <KitHighlights />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <WishlistProvider>
            <ScrollToTop />
            <CartDrawer /> {/* 2. Place CartDrawer here */}
            <CheckoutModal />
            <div className="min-w-screen min-h-screen text-white">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
              <Footer />
            </div>
          </WishlistProvider>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
