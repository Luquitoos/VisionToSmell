import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

/* Lista de arquivos utilitários */
const filesToCheck = [path.join(rootDir, 'utils', 'errorHandler.js'), path.join(rootDir, 'utils', 'fileHelper.js'), path.join(rootDir, 'services', 'conversionService.js')]; 

function addDefaultExport(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    /* Verifica se o arquivo já possui uma exportação padrão */
    if (content.includes('export default')) {
      console.log(`Arquivo já possui exportação padrão: ${filePath}`);
      return false;
    }

    /* Obtém o nome sem extensão para usar como nome da exportação padrão */
    const baseName = path.basename(filePath, path.extname(filePath));
    
    /* Adiciona exportação padrão ao final do arquivo */
    const defaultExportCode = `\n// Exportação padrão para compatibilidade const ${baseName} = { ${extractExportedFunctions(content).join(',\n  ')}};\n export default ${baseName};\n`;

    fs.writeFileSync(filePath, content + defaultExportCode);
    console.log(`Foi adicionado a exportação padrão a: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao processar arquivo ${filePath}:`, error);
    return false;
  }
}

function extractExportedFunctions(fileContent) {
  /* Regex simples para extrair nomes de funções exportadas de exportações nomeadas (Falei, inclusive no conversionController.js) */
  const exportRegex = /export\s+const\s+(\w+)/g;
  const exportedNames = [];
  let match;
  
  while ((match = exportRegex.exec(fileContent)) !== null) {
    exportedNames.push(match[1]);
  }
  
  return exportedNames;
}

/* Processa cada arquivo */
console.log('Adicionando exportações padrão aos arquivos utilitários...');
let modifiedCount = 0;

for (const file of filesToCheck) {
  if (addDefaultExport(file)) {
    modifiedCount++;
  }
}

console.log(`\nConcluído! Modificados ${modifiedCount}/${filesToCheck.length} arquivos.`);
