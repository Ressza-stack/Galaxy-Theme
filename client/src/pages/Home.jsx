import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import GitHubProjects from '../sections/GitHubProjects'; // Ganti Projects
import MiniGame from '../sections/MiniGame';
import Contact from '../sections/Contact';
import api from '../services/api';

export default function Home() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { api.get('/profile').then(r => setProfile(r.data.data)).catch(() => {}); }, []);
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <About profile={profile} />
        <Skills />
        <GitHubProjects />
        <MiniGame />
        <Contact />
      </main>
      <Footer profile={profile} />
    </div>
  );
}