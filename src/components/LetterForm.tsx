import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Preview, PictureAsPdf } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { pdf } from '@react-pdf/renderer';
import LetterPDF from './LetterPDF';
import LetterPreview from './LetterPreview';

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

const LetterForm: React.FC = () => {
  const [letterData, setLetterData] = useState<LetterData>({
    companyName: 'FR Cosmetics Ltd.',
    companyAddress: 'Datiswar, Nangalkot, Cumilla, Bangladesh\nPhone: 01632211485, 01783321436, 01891598055',
    companyLogo: '/company_logo.png',

    letterDate: (() => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    })(),
    subject: '',
    content: '',

    signature: '/signature.png',
    signatureName: 'Md Khorshed Alam',
    signaturePhone: 'frcosmetics25@gmail.com',

    companyPhone: '01632211485, 01783321436, 01891598055',
    companyFooterAddress: 'Datiswar, Nangalkot, Cumilla, Bangladesh',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: letterData.content,
    onUpdate: ({ editor }) => {
      setLetterData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const handleInputChange = (field: keyof LetterData, value: any) => {
    setLetterData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLetterData(prev => ({ ...prev, companyLogo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG image file for the logo.');
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLetterData(prev => ({ ...prev, signature: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG image file for the signature.');
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<LetterPDF letterData={letterData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Letter-${letterData.letterDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (!editor) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Letter Generator
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Letter Information Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: 'rgb(26, 68, 160)', fontWeight: 'bold' }}>
            Letter Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Letter Date"
              value={letterData.letterDate}
              onChange={(e) => handleInputChange('letterDate', e.target.value)}
              required
              placeholder="dd-mm-yyyy"
              helperText="Format: dd-mm-yyyy (e.g., 18-10-2025)"
            />

            <TextField
              fullWidth
              label="Subject / Reference"
              value={letterData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="e.g., RE: Product Inquiry"
              helperText="Optional subject line or reference number"
            />
          </Box>
        </Box>

        <Divider />

        {/* Letter Content Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: 'rgb(26, 68, 160)', fontWeight: 'bold' }}>
            Letter Content
          </Typography>

          {/* Editor Toolbar */}
          <Box sx={{
            border: '1px solid #ddd',
            borderRadius: '4px 4px 0 0',
            p: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            backgroundColor: '#f5f5f5',
          }}>
            <Button
              size="small"
              variant={editor.isActive('bold') ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              sx={{ minWidth: '40px' }}
            >
              <strong>B</strong>
            </Button>
            <Button
              size="small"
              variant={editor.isActive('italic') ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              sx={{ minWidth: '40px' }}
            >
              <em>I</em>
            </Button>
            <Button
              size="small"
              variant={editor.isActive('underline') ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              sx={{ minWidth: '40px' }}
            >
              <u>U</u>
            </Button>

            <Divider orientation="vertical" flexItem />

            <Button
              size="small"
              variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              sx={{ minWidth: '40px' }}
            >
              ≡
            </Button>
            <Button
              size="small"
              variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              sx={{ minWidth: '40px' }}
            >
              ≣
            </Button>
            <Button
              size="small"
              variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              sx={{ minWidth: '40px' }}
            >
              ≡
            </Button>
            <Button
              size="small"
              variant={editor.isActive({ textAlign: 'justify' }) ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              sx={{ minWidth: '40px' }}
            >
              ≣
            </Button>

            <Divider orientation="vertical" flexItem />

            <Button
              size="small"
              variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </Button>
            <Button
              size="small"
              variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </Button>

            <Divider orientation="vertical" flexItem />

            <Button
              size="small"
              variant="outlined"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              ―
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              ↶
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              ↷
            </Button>
          </Box>

          {/* Editor Content */}
          <Box sx={{
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            minHeight: '300px',
            p: 2,
            backgroundColor: '#fff',
            '& .ProseMirror': {
              minHeight: '280px',
              outline: 'none',
              '& p': { margin: '0 0 1em 0' },
              '& ul, & ol': { paddingLeft: '1.5em' },
            }
          }}>
            <EditorContent editor={editor} />
          </Box>
        </Box>

        <Divider />

        {/* Signature Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: 'rgb(26, 68, 160)', fontWeight: 'bold' }}>
            Signature
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Authorized Signature (PNG)
              </Typography>
              <Box sx={{ border: '2px dashed #ccc', p: 2, textAlign: 'center', borderRadius: 1 }}>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleSignatureUpload}
                  style={{ display: 'none' }}
                  id="letter-signature-upload"
                />
                <label htmlFor="letter-signature-upload">
                  <Button variant="outlined" component="span">
                    Upload Signature
                  </Button>
                </label>
                {letterData.signature && (
                  <Box mt={2}>
                    <img
                      src={letterData.signature}
                      alt="Signature Preview"
                      style={{ width: '200px', height: 'auto', border: '1px solid #eee' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Signature Name"
              value={letterData.signatureName || ''}
              onChange={(e) => handleInputChange('signatureName', e.target.value)}
              placeholder="Enter signature holder's name"
            />

            <TextField
              fullWidth
              label="Signature Email"
              value={letterData.signaturePhone || ''}
              onChange={(e) => handleInputChange('signaturePhone', e.target.value)}
              placeholder="Enter signature holder's email"
            />
          </Box>
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Box>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={handlePreview}
              size="large"
            >
              {previewMode ? 'Hide Preview' : 'Preview Letter'}
            </Button>
            <Button
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={20} /> : <PictureAsPdf />}
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              size="large"
            >
              {isGenerating ? 'Generating...' : 'Generate PDF'}
            </Button>
          </Box>
        </Box>

        {/* Preview Section */}
        {previewMode && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Letter Preview
            </Typography>
            <LetterPreview letterData={letterData} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default LetterForm;
