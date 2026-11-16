import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { AuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GalaxyBackground from './components/GalaxyBackground';
import LoadingScreen from './components/LoadingScreen';
import StardustTrail from './components/StardustTrail';
import './styles/globals.css';

function PageTransitions({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    // 1. Tampilkan Loading selama 3.8 detik
    const timer1 = setTimeout(() => {
      setIsLoading(false); // Matikan loader
      setShowFlash(true);  // Nyalakan efek Flash layar
    }, 3800);

    // 2. Matikan efek Flash setelah 4.2 detik (0.4 detik setelah loader hilang)
    const timer2 = setTimeout(() => {
      setShowFlash(false);
    }, 4200);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatePresence>
          {isLoading && <LoadingScreen key="loader" />}
        </AnimatePresence>

        {/* EFER FLASH WARNA BIRU/WHITE SAAT TRANSISI */}
        <AnimatePresence>
          {showFlash && (
            <motion.div 
              className="screen-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {!isLoading && (
          <>
            <motion.div className="progress-bar" style={{ scaleX }} />
            <GalaxyBackground />
            <StardustTrail />
            <PageTransitions>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </PageTransitions>
          </>
        )}
      </AuthProvider>
    </BrowserRouter>
  );
}