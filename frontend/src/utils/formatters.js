/*Formate o tamanho do arquivo em bytes*/
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/*Formatar data para formato melhor*/
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString(undefined, options);
};

/*Obter extensão de arquivo a partir do nome do arquivo*/
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/*Truncar texto com reticências se for maior que maxLength*/
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/*Obter cor de status com base no status da conversão*/
export const getStatusColor = (status) => {
  const statusColors = {
    'concluído': 'text-green-400',
    'processando': 'text-blue-400',
    'pendente': 'text-yellow-400',
    'falha': 'text-red-400'
  };
  
  return statusColors[status?.toLowerCase()] || 'text-gray-400';
};

/* Duração do formato em segundos para formato legível */
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
