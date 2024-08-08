
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePathFirst = path.join(__dirname, '../../public', 'data-copy.json');
const dataFilePath = path.join(__dirname, '../../public', 'data.json');

const initializeData = async () => {
  try {
    await fs.copyFile(dataFilePathFirst, dataFilePath);
    console.log('Arquivo inicial copiado com sucesso');
  } catch (err) {
    console.error('Erro ao copiar arquivo inicial:', err);
  }
};

const deleteDataFile = async () => {
  try {
    await fs.unlink(dataFilePath);  // Tenta deletar o arquivo
    console.info(`Successfully removed file with the path of ${dataFilePath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.info("File doesn't exist, no need to delete.");
    } else if (err.code === 'EPERM') {
      console.error("Permission denied. Cannot delete the file.", err);
    } else {
      console.error("Something went wrong during deletion. Please try again later.", err);
    }
  }
};

export { initializeData, deleteDataFile, dataFilePath };
