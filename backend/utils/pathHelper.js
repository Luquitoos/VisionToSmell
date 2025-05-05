/* Utilitário para lidar com caminhos de arquivos no sistema */
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/*Obtém o diretório do arquivo chamador*/
export const getDirname = (importMetaUrl) => {
  const filename = fileURLToPath(importMetaUrl);
  return dirname(filename);
};

/*Cria um caminho absoluto relativo ao projeto */
export const getProjectPath = (importMetaUrl, ...pathSegments) => {
  const currentDirname = getDirname(importMetaUrl);
  return path.join(currentDirname, ...pathSegments);
};

/* Exportação padrão para compatibilidade */
const pathHelper = {
  getDirname,
  getProjectPath
};

export default pathHelper;