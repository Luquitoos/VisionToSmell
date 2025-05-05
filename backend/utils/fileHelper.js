import fs from 'fs';
import path from 'path';

export const fileExists = (filePath) => {
  try {
    if (!filePath) return false;
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking if file exists ${filePath}:`, error);
    return false;
  }
};

export const deleteFile = (filePath) => {
  try {
    if (!filePath) return false;
    
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }
    
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

export const ensureDirectoryExists = (dirPath) => {
  try {
    if (!dirPath) return false;
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
};

export const formatFileSize = (bytes) => {
  try {
    if (bytes === 0 || !bytes) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  } catch (error) {
    console.error(`Error formatting file size:`, error);
    return '0 Bytes';
  }
};

export const formatDuration = (seconds) => {
  try {
    if (!seconds || isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error(`Error formatting duration:`, error);
    return '00:00';
  }
};

const fileHelper = {
  fileExists,
  deleteFile,
  ensureDirectoryExists,
  formatFileSize,
  formatDuration
};

export default fileHelper;
