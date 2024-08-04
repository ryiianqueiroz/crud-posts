/* eslint-disable no-undef */
import { fs } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(__dirname, '..', 'public', 'data.json');
const dataFilePathFirst = path.join(__dirname, '..', 'public', 'data-copy.json');

export default async (req, res) => {
  try {
    await fs.copyFile(dataFilePathFirst, dataFilePath);
    res.status(200).json({ message: 'Dados inicializados com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao inicializar dados' });
  }
};
