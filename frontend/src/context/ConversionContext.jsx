import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchConversions, deleteConversion, uploadVideo } from '../services/api';

const ConversionContext = createContext();

export const useConversion = () => useContext(ConversionContext);

export const ConversionProvider = ({ children }) => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); /* Sinalizador para indicar se os dados foram obtidos pelo menos uma vez */
  
  /* Use referências para rastrear conversões de processamento e intervalo de pesquisa */
  const hasProcessingRef = useRef(false);
  const pollIntervalRef = useRef(null);
  const loadingRef = useRef(false); /* Ref para evitar múltiplas chamadas de API simultâneas */
  
  /* Lidar com erros de API de forma consistente */
  const handleApiError = (error, action, showToast = true) => {
    const message = error.response?.data?.message || `Erro durante ${action}`;
    console.error(`Erro durante ${action}:`, error);
    setError(message);
    if (showToast) {
      toast.error(message);
    }
  };
  
  /* Atualizar a lista de conversões*/
  const refreshConversions = useCallback(async (showErrors = true) => {
    /* Evite múltiplas solicitações simultâneas usando ref */
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchConversions();
      
      if (data && Array.isArray(data)) {
        setConversions(data);
        
        /* Atualizar ref para indicar se alguma conversão está sendo processada */
        hasProcessingRef.current = data.some(conv => conv.status === 'processando');
        
        /* Configure ou remova o intervalo de sondagem com base na necessidade */
        if (hasProcessingRef.current && !pollIntervalRef.current) {
          console.log('Início da sondagem para processamento de conversões');
          pollIntervalRef.current = setInterval(() => {
           
            (async () => {
              /* Não atualize o estado de carregamento durante a sondagem 'silenciosa' */
              loadingRef.current = true;
              try {
                const pollingData = await fetchConversions();
                if (pollingData && Array.isArray(pollingData)) {
                  setConversions(pollingData);
                  hasProcessingRef.current = pollingData.some(conv => conv.status === 'processando');
                  
                  if (!hasProcessingRef.current) {
                    console.log('Interrupção da sondagem, todas as conversões foram concluídas');
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                  }
                }
              } catch (error) {
                if (showErrors) {
                  handleApiError(error, 'atualização de conversões', false);
                }
              } finally {
                loadingRef.current = false;
              }
            })();
          }, 10000); /* sondagem a cada 10 segundos */
        } else if (!hasProcessingRef.current && pollIntervalRef.current) {
          console.log('Interrupção da sondagem, todas as conversões foram concluídas');
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } else {
        console.warn('Formato de dados inesperado da API:', data);
        setConversions([]);
      }
      
      /* Marcar que os dados foram obtidos pelo menos uma vez */
      setDataFetched(true);
    } catch (error) {
      handleApiError(error, 'Obtenção de conversões', showErrors);
      setConversions([]);
      /* Marcar como obtido mesmo em caso de erro para mostrar uma mensagem vazia em vez de um botão giratório */
      setDataFetched(true); 
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);
  
  /* Inicializar conversões e limpar o intervalo quando o componente for desmontado */
  useEffect(() => {
    refreshConversions(false);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [refreshConversions]);

  /*Lidar com o upload e a conversão de arquivos */
  const handleUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      await uploadVideo(formData);
      toast.success('Vídeo carregado e conversão iniciada');
      await refreshConversions();
    } catch (error) {
      handleApiError(error, 'upload de arquivos');
    } finally {
      setUploading(false);
    }
  };

  /*Excluir uma conversão*/
  const handleDelete = async (id) => {
    setError(null);
    try {
      await deleteConversion(id);
      setConversions(prevConversions => prevConversions.filter(conv => conv._id !== id));
      toast.success('Conversão excluída com êxito');
      return true;
    } catch (error) {
      handleApiError(error, 'exclusão da conversão');
      return false;
    }
  };

  /* Função de atualização manual para o usuário */
  const manualRefresh = () => {
    refreshConversions(true);
  };

  return (
    <ConversionContext.Provider
      value={{
        conversions,
        loading,
        uploading,
        error,
        dataFetched, /* Expor o novo sinalizador que indica se os dados foram obtidos */
        handleUpload,
        handleDelete,
        refreshConversions: manualRefresh 
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};

export default ConversionContext;
