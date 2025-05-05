import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { ConversionProvider } from './context/ConversionContext';

/*Gerencia o layout e as ''açoes'' da pagina*/
function App() {
  return (
    <ConversionProvider>
      <div className="flex flex-col min-h-screen bg-secondary">
        <Header />
        <main className="flex-grow container py-8">
          <Home />
        </main>
        <Footer />
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </ConversionProvider>
  );
}

export default App;
