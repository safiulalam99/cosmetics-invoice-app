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
import { Preview, PictureAsPdf, AddAPhoto } from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import PDFPreview from './PDFPreview';
import { numberToWords } from '../utils/numberToWords';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyLogo?: string;
  
  // Invoice Meta
  invoiceDate: string;
  invoiceNumber: string;
  dueDate: string;
  
  // Buyer Information
  buyerCompany: string;
  buyerAddress: string;
  buyerContact: string;
  
  // Items
  items: InvoiceItem[];
  
  // Terms and Payment
  terms: string;
  bankDetails: string;
  accountNumber?: string;
  routingNumber?: string;
  additionalBankInfo?: string;
  
  // Signature
  signature?: string;
  
  // Footer
  companyPhone?: string;
  companyFooterAddress?: string;
  additionalFooterInfo?: string;
}

const InvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    // Company Information
    companyName: 'FR Cosmetics Ltd.',
    companyAddress: 'Datiswar, Nangalkot, Cumilla, Bangladesh\nPhone: 01632211485, 01783321436, 01891598055',
    companyLogo: '/company_logo.png',
    
    // Invoice Meta
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    
    // Buyer Information
    buyerCompany: 'Army Pharma Ltd.',
    buyerAddress: 'BMTF Ltd. Chot, Shimultoli, Gazipur Sadar,\nPS: Gazipur-1700, Bangladesh',
    buyerContact: '',
    
    // Items
    items: [{ id: '1', description: '', quantity: 0, unitPrice: 0, total: 0 }],
    
    // Terms and Payment
    terms: '1. Terms of payment : Through Bank\n2. Payment Method : 50% Advance at time of order and rest 50% before delivery.\n3. Delivery Time : Normally 15 working days from approval\n4. Delivery Service : Free delivery within Dhaka City. The charge will be applicable for the delivery outside Dhaka.\n5. TAX : The above offer excluded all kinds of Govt. Duties, AIT, Vat &',
    bankDetails: 'Bank: [Bank Name]\nAccount: [Account Number]\nRouting: [Routing Number]',
    
    // Signature
    signature: '/signature.png',
    
    // Footer
    companyPhone: '01632211485, 01783321436, 01891598055',
    companyFooterAddress: 'Datiswar, Nangalkot, Cumilla, Bangladesh',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              [field]: value,
              total: field === 'quantity' || field === 'unitPrice' 
                ? (field === 'quantity' ? value : item.quantity) * (field === 'unitPrice' ? value : item.unitPrice)
                : item.total
            }
          : item
      )
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateGrandTotal = () => {
    return invoiceData.items.reduce((total, item) => total + item.total, 0);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInvoiceData(prev => ({ ...prev, companyLogo: e.target?.result as string }));
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
        setInvoiceData(prev => ({ ...prev, signature: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG image file for the signature.');
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceData.invoiceNumber}.pdf`;
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

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Generator
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header Section - Company Information */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Company Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Company Logo Upload */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Company Logo (PNG)
              </Typography>
              <Box sx={{ border: '2px dashed #ccc', p: 2, textAlign: 'center', borderRadius: 1 }}>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button variant="outlined" component="span">
                    Upload Company Logo
                  </Button>
                </label>
                {invoiceData.companyLogo && (
                  <Box mt={2}>
                    <img
                      src={invoiceData.companyLogo}
                      alt="Company Logo Preview"
                      style={{ width: '500px', height: 'auto' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Company Name */}
            <TextField
              fullWidth
              label="Company Name"
              value={invoiceData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              required
            />

            {/* Company Address */}
            <TextField
              fullWidth
              label="Company Address"
              multiline
              rows={3}
              value={invoiceData.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              required
            />
          </Box>
        </Box>

        <Divider />

        {/* Buyer Details Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Buyer Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Buyer Company Name */}
            <TextField
              fullWidth
              label="Buyer Company Name"
              value={invoiceData.buyerCompany}
              onChange={(e) => handleInputChange('buyerCompany', e.target.value)}
              required
              placeholder="Enter buyer company name"
            />

            {/* Buyer Address */}
            <TextField
              fullWidth
              label="Buyer Address"
              multiline
              rows={3}
              value={invoiceData.buyerAddress}
              onChange={(e) => handleInputChange('buyerAddress', e.target.value)}
              required
              placeholder="Enter complete buyer address"
            />

            {/* Buyer Contact */}
            <TextField
              fullWidth
              label="Buyer Contact Information"
              value={invoiceData.buyerContact}
              onChange={(e) => handleInputChange('buyerContact', e.target.value)}
              placeholder="Phone, email, or other contact details"
            />
          </Box>
        </Box>

        <Divider />

        {/* Invoice Meta Information Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Invoice Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Invoice Number */}
            <TextField
              fullWidth
              label="Invoice Number"
              value={invoiceData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              required
              placeholder="e.g., INV-2024-001"
            />

            {/* Invoice Date and Due Date in a row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Invoice Date"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Product/Items Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Invoice Items
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Items Table Header */}
            <Box sx={{ display: 'flex', gap: 1, fontWeight: 'bold', color: '#333' }}>
              <Box sx={{ flex: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                Description
              </Box>
              <Box sx={{ flex: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                Quantity
              </Box>
              <Box sx={{ flex: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'right' }}>
                Unit Price
              </Box>
              <Box sx={{ flex: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'right' }}>
                Total
              </Box>
              <Box sx={{ flex: 0.5, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                Action
              </Box>
            </Box>

            {/* Items List */}
            {invoiceData.items.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  sx={{ flex: 2 }}
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  size="small"
                />
                <TextField
                  sx={{ flex: 1 }}
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  sx={{ flex: 1 }}
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  sx={{ flex: 1 }}
                  type="number"
                  placeholder="Total"
                  value={item.total.toFixed(2)}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeItem(index)}
                  disabled={invoiceData.items.length === 1}
                  sx={{ flex: 0.5, minWidth: 'auto' }}
                >
                  Remove
                </Button>
              </Box>
            ))}

            {/* Add Item Button */}
            <Button
              variant="outlined"
              onClick={addItem}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Item
            </Button>

            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Subtotal: ৳{calculateGrandTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Grand Total */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e74c3c' }}>
                  Grand Total: ৳{calculateGrandTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Amount in Words */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ textAlign: 'right', p: 2, backgroundColor: '#f0f8ff', borderRadius: 1, border: '1px solid #e3f2fd', maxWidth: '400px' }}>
                <Typography variant="body2" sx={{ color: '#666', marginBottom: 1 }}>
                  Amount in Words:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', fontStyle: 'italic' }}>
                  {calculateGrandTotal() > 0 ? `${numberToWords(calculateGrandTotal())} taka only` : 'Zero taka only'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Terms & Conditions Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Terms & Conditions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Terms & Conditions"
              multiline
              rows={4}
              value={invoiceData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Enter terms and conditions for this invoice"
              helperText="Specify payment terms, late fees, return policy, etc."
            />
          </Box>
        </Box>

        <Divider />

        {/* Bank Details Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Bank Details
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Bank Name"
              value={invoiceData.bankDetails}
              onChange={(e) => handleInputChange('bankDetails', e.target.value)}
              placeholder="Enter bank name"
              helperText="Bank where payments should be sent"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Account Number"
                value={invoiceData.accountNumber || ''}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder="Enter account number"
              />
              <TextField
                fullWidth
                label="Routing Number"
                value={invoiceData.routingNumber || ''}
                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                placeholder="Enter routing number"
              />
            </Box>
            
            <TextField
              fullWidth
              label="Additional Bank Information"
              multiline
              rows={2}
              value={invoiceData.additionalBankInfo || ''}
              onChange={(e) => handleInputChange('additionalBankInfo', e.target.value)}
              placeholder="SWIFT code, IBAN, or other payment details"
              helperText="Optional: Add SWIFT code, IBAN, or other payment instructions"
            />
          </Box>
        </Box>

        <Divider />

        {/* Signature Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Signature
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Signature Upload */}
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
                  id="signature-upload"
                />
                <label htmlFor="signature-upload">
                  <Button variant="outlined" component="span" startIcon={<AddAPhoto />}>
                    Upload Signature
                  </Button>
                </label>
                {invoiceData.signature && (
                  <Box mt={2}>
                    <img
                      src={invoiceData.signature}
                      alt="Signature Preview"
                      style={{ width: '500px', height: 'auto', border: '1px solid #eee' }}
                    />
                  </Box>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Upload a PNG signature image with transparent background
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Footer Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
            Footer Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Company Phone Numbers"
              value={invoiceData.companyPhone || ''}
              onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              placeholder="e.g., 01783321436, 01891598055"
              helperText="Enter phone numbers separated by commas"
            />
            
            <TextField
              fullWidth
              label="Company Address"
              multiline
              rows={2}
              value={invoiceData.companyFooterAddress || ''}
              onChange={(e) => handleInputChange('companyFooterAddress', e.target.value)}
              placeholder="e.g., Dhatiaeso, Nangalkot, Cumilla, Bangladesh"
              helperText="Enter the complete company address for footer"
            />
            
            <TextField
              fullWidth
              label="Additional Footer Information"
              multiline
              rows={2}
              value={invoiceData.additionalFooterInfo || ''}
              onChange={(e) => handleInputChange('additionalFooterInfo', e.target.value)}
              placeholder="Website, email, or other contact information"
              helperText="Optional: Add website, email, or other contact details"
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
              {previewMode ? 'Hide Preview' : 'Preview Invoice'}
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
              Invoice Preview
            </Typography>
            <PDFPreview invoiceData={invoiceData} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default InvoiceForm;