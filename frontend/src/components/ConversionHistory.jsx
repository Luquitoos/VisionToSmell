import React, { useState } from 'react';
import { FaTrash, FaDownload, FaSync, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useConversion } from '../context/ConversionContext';
import { formatDate, formatFileSize, getStatusColor, truncateText } from '../utils/formatters';
import Button from './Button';
import Loader from './Loader';
import { downloadAudio } from '../services/api';

const ConversionHistory = () => {
  const { conversions, loading, handleDelete, refreshConversions } = useConversion();
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      setError(null);
      await downloadAudio(id);
    } catch (err) {
      const errorMessage = 'Falha ao baixar o arquivo de áudio';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro de download:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const confirmDelete = async (id) => {
    try {
      setDeletingId(id);
      setError(null);
      const success = await handleDelete(id);
      if (!success) {
        throw new Error('Falha na operação de exclusão');
      }
    } catch (err) {
      setError('Falha ao excluir a conversão');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleRefresh = async () => {
    try {
      setError(null);
      await refreshConversions();
    } catch (err) {
      setError('Falha ao atualizar conversões');
    }
  };

  if (loading) {
    return (
      <div className="card min-h-[200px] flex items-center justify-center">
        <Loader label="Carregando conversões" />
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="card min-h-[200px] flex flex-col items-center justify-center">
        <FaInfoCircle className="text-4xl text-gray-500 mb-3" aria-hidden="true" />
        <p className="text-gray-400 text-lg mb-4">Nenhum histórico de conversão encontrado</p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <FaSync className="mr-2" /> Atualizar
        </Button>
        
        {error && (
          <div className="mt-4 p-3 w-full bg-red-900 bg-opacity-30 rounded text-sm text-red-300 border border-red-700">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="history" className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Histórico de conversões</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <FaSync className="mr-2" /> Atualizar
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 rounded text-sm text-red-300 border border-red-700">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {conversions.map((conversion) => (
          <div 
            key={conversion._id} 
            className="bg-secondary-dark rounded-lg p-4 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="text-white font-medium">
                    {truncateText(conversion.originalName || conversion.originalFileName, 40)}
                  </h3>
                  <span 
                    className={`ml-3 text-sm px-2 py-0.5 rounded-full ${getStatusColor(conversion.status)} bg-opacity-20`}
                  >
                    {conversion.status}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-gray-400 space-y-1">
                  <p>Converted: {formatDate(conversion.createdAt)}</p>
                  {conversion.fileSize && (
                    <p>Size: {formatFileSize(conversion.fileSize)}</p>
                  )}
                </div>

                {expandedItem === conversion._id && conversion.error && (
                  <div className="mt-3 p-3 bg-red-900 bg-opacity-30 rounded text-sm text-red-300 border border-red-700">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-red-400 mr-2 mt-0.5" aria-hidden="true" />
                      <span>{conversion.error}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {conversion.status === 'concluído' && (
                  <Button 
                    onClick={() => handleDownload(conversion._id)}
                    variant="outline"
                    size="sm"
                    className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                    isLoading={downloadingId === conversion._id}
                    disabled={downloadingId === conversion._id}
                    aria-label="Download converted audio"
                  >
                    <FaDownload className="mr-1" /> Download
                  </Button>
                )}
                
                {conversion.status === 'falha' && (
                  <Button
                    onClick={() => toggleExpand(conversion._id)}
                    variant="secondary"
                    size="sm"
                    aria-expanded={expandedItem === conversion._id}
                    aria-controls={`error-${conversion._id}`}
                  >
                    {expandedItem === conversion._id ? 'Ocultar detalhes' : 'Mostrar erro'}
                  </Button>
                )}

                <Button 
                  onClick={() => confirmDelete(conversion._id)}
                  variant="secondary"
                  size="sm"
                  className="text-red-400 hover:bg-red-400 hover:bg-opacity-20"
                  isLoading={deletingId === conversion._id}
                  disabled={deletingId === conversion._id}
                  aria-label="Excluir conversão"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>

            {conversion.status === 'processando' && (
              <div className="mt-3">
                <div className="w-full bg-secondary rounded-full h-2.5" role="progressbar" aria-label="Progresso da conversão" aria-valuemin="0" aria-valuemax="100">
                  <div className="bg-primary h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Convertendo... Por favor aguarde</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {conversions.length > 5 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm">
            Ver todas as conversões
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversionHistory;
