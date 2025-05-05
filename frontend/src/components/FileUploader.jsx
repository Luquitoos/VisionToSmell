import React, { useState, useRef } from 'react';
import { FaUpload, FaFileVideo, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from './Button';
import { useConversion } from '../context/ConversionContext';
import { formatFileSize } from '../utils/formatters';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { handleUpload, uploading } = useConversion();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    setError(null); /* Limpar todos os erros anteriores */
    
    /* Verificar se o arquivo é um vídeo */
    const videoTypes = ['video/mp4', 'video/avi', 'video/mpeg', 'video/x-matroska', 'video/quicktime'];
    
    if (!videoTypes.includes(file.type)) {
      const errorMessage = 'Carregue um arquivo de vídeo válido.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    /* Check file size (100MB max) */
    const maxSize = 100 * 1024 * 1024; /* 100MB em bytes */
    if (file.size > maxSize) {
      const errorMessage = 'O tamanho do arquivo excede o limite máximo de 100 MB.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    setFile(file);
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        await handleUpload(file);
        clearFile();
      } catch (error) {
        /* O erro já é tratado no contexto, mas podemos adicionar um tratamento extra aqui, se necessário */
        console.error('Erro no FileUploader durante o envio:', error);
      }
    }
  };

  return (
    <div id="converter" className="card">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Converter vídeo em áudio</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 rounded text-sm text-red-300 border border-red-700">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-primary' : error ? 'border-red-400' : 'border-gray-700'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/*"
          onChange={handleChange}
          aria-label="Carregar arquivo de vídeo"
        />
        
        {!file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <FaUpload className="text-4xl text-primary" />
            </div>
            <div>
              <p className="text-white text-lg">Arraste e solte seu arquivo de vídeo aqui</p>
              <p className="text-gray-400 mt-1">ou</p>
            </div>
            <Button onClick={onButtonClick} variant="outline">
              Procurar arquivos
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Formatos compatíveis: MP4, AVI, MOV, MKV, etc.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <FaFileVideo className="text-3xl text-primary" />
              <div className="text-left">
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <Button onClick={clearFile} variant="secondary">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                isLoading={uploading}
                disabled={uploading}
              >
                {uploading ? 'Convertendo...' : 'Converter em áudio'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>Seu vídeo será convertido para o formato MP3. O arquivo convertido estará disponível para download assim que o processamento for concluído.</p>
      </div>
    </div>
  );
};

export default FileUploader;
