import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

class ResumeParserService {
  async parseFile(filePath, fileType) {
    try {
      if (fileType === 'pdf' || filePath.endsWith('.pdf')) {
        return await this.parsePDF(filePath);
      } else if (fileType === 'txt' || fileType === 'text' || filePath.endsWith('.txt')) {
        return await this.parseTXT(filePath);
      } else if (fileType === 'docx' || filePath.endsWith('.docx') || filePath.endsWith('.doc')) {
        return await this.parseDOCX(filePath);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      throw new Error(`Failed to parse file: ${error.message}`);
    }
  }

  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF parsing error: ${error.message}`);
    }
  }

  async parseTXT(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return text;
    } catch (error) {
      throw new Error(`TXT parsing error: ${error.message}`);
    }
  }

  async parseDOCX(filePath) {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX parsing error: ${error.message}`);
    }
  }

  cleanText(text) {
    // Remove extra whitespace and normalize
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}

export default new ResumeParserService();
