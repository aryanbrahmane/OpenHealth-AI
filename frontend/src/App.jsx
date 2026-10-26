import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import Radiology from './pages/Radiology';
import DietLifestyle from './pages/DietLifestyle';
import ClinicalBot from './pages/ClinicalBot';
import VivaMetrics from './pages/VivaMetrics';
import { fetchHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [selectedDisease, setSelectedDisease] = React.useState('diabetes');
  const [systemOnline, setSystemOnline] = React.useState(false);

  React.useEffect(() => {
    // Check backend health
    fetchHealth()
      .then(data => {
        if (data.status === 'online') {
          setSystemOnline(true);
        }
      })
      .catch(() => setSystemOnline(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFB] text-slate-800">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemOnline={systemOnline} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            setSelectedDisease={setSelectedDisease} 
          />
        )}

        {activeTab === 'diagnostics' && (
          <Diagnostics 
            selectedDisease={selectedDisease} 
            setSelectedDisease={setSelectedDisease} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'radiology' && (
          <Radiology />
        )}

        {activeTab === 'diet' && (
          <DietLifestyle />
        )}

        {activeTab === 'chatbot' && (
          <ClinicalBot />
        )}

        {activeTab === 'viva-metrics' && (
          <VivaMetrics setActiveTab={setActiveTab} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
