import React from 'react';
import FileUploader from '../components/FileUploader';
import ConversionHistory from '../components/ConversionHistory';

const Home = () => {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Video to Audio</span> <span className="text-white">Converter</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Converta seus vídeos em arquivos de áudio com apenas alguns cliques. 
          Envie seu vídeo e minha API cuida do resto.
        </p>
      </section>
      
      {/* Seção de Converter */}
      <section>
        <FileUploader />
      </section>
      
      {/* Historico */}
      <section>
        <ConversionHistory />
      </section>
      
      {/* Seção de recursos */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="h-14 w-14 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-2xl font-bold">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload</h3>
          <p className="text-gray-400">
            Envie qualquer arquivo de vídeo. Suporta uma ampla variedade de formatos, incluindo MP4, AVI, MOV e muito mais.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="h-14 w-14 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-2xl font-bold">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Convert</h3>
          <p className="text-gray-400">
            Processará seu vídeo e extrairá a faixa de áudio, convertendo-a para o formato MP3.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="h-14 w-14 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-2xl font-bold">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Download</h3>
          <p className="text-gray-400">
            Quando a conversão estiver concluída, baixe seu arquivo de áudio e aproveite!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;