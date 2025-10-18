import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import LetterPDF from './LetterPDF';

interface LetterData {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyLogo?: string;

  // Letter Meta
  letterDate: string;
  subject?: string;

  // Letter Content
  content: string;

  // Signature
  signature?: string;
  signatureName?: string;
  signaturePhone?: string;

  // Footer
  companyPhone?: string;
  companyFooterAddress?: string;
}

const LetterPreview: React.FC<{ letterData: LetterData }> = ({ letterData }) => {
  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ddd' }}>
      <PDFViewer width="100%" height="100%" key={letterData.content}>
        <LetterPDF letterData={letterData} />
      </PDFViewer>
    </div>
  );
};

export default LetterPreview;
