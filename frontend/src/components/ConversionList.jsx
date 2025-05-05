import React from 'react';
import { useConversion } from '../context/ConversionContext';
import ConversionItem from './ConversionItem';
import Spinner from './Spinner'; /* Assumindo que você tenha um componente de Spinner */

const ConversionList = () => {
  const { conversions, loading, dataFetched, error, refreshConversions } = useConversion();

  /* Mostrar spinner apenas durante o carregamento inicial ou refresh manual */
  if (loading && !dataFetched) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner />
        <p className="text-gray-500 mt-4">Carregando conversões...</p>
      </div>
    );
  }

  /* Mostrar mensagem de erro quando houver um erro */
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={refreshConversions}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  /* Mostrar mensagem de lista vazia quando não houver conversões */
  if (conversions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-white shadow-sm">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma conversão no histórico</h3>
        <p className="mt-1 text-gray-500">
          Faça upload de um vídeo para iniciar uma nova conversão.
        </p>
      </div>
    );
  }

  /* Mostrar a lista de conversões */
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex justify-center py-2">
          <Spinner size="small" />
          <span className="ml-2 text-sm text-gray-500">Atualizando...</span>
        </div>
      )}
      {conversions.map(conversion => (
        <ConversionItem key={conversion._id} conversion={conversion} />
      ))}
    </div>
  );
};

export default ConversionList;