import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import { Preview, PictureAsPdf, AddAPhoto, ExpandMore, ExpandLess } from '@mui/icons-material';
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

  // VAT
  vatPercentage: number;

  // Terms and Payment
  terms: string;
  bankDetails: string;
  accountNumber?: string;
  routingNumber?: string;
  additionalBankInfo?: string;

  // Signature
  signature?: string;
  signatureName?: string;
  signaturePhone?: string;

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
    invoiceDate: (() => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    })(),
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`,
    dueDate: (() => {
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const day = String(dueDate.getDate()).padStart(2, '0');
      const month = String(dueDate.getMonth() + 1).padStart(2, '0');
      const year = dueDate.getFullYear();
      return `${day}-${month}-${year}`;
    })(), // 30 days from now
    
    // Buyer Information
    buyerCompany: 'Army Pharma Ltd.',
    buyerAddress: 'BMTF Ltd. Shimultoli, Joydevpur\nPS: Gazipur, Bangladesh',
    buyerContact: '',
    
    // Items
    items: [{ id: '1', description: '', quantity: 0, unitPrice: 0, total: 0 }],

    // VAT
    vatPercentage: 15,

    // Terms and Payment
    terms: '1. Terms of payment : Through Bank\n2. Payment Method : 50% Advance at time of order and rest 50% before delivery.\n3. Delivery Time : Normally 15 working days from approval\n4. Delivery Service : Free delivery within Dhaka City. The charge will be applicable for the delivery outside Dhaka.\n5. TAX : The above offer excluded all kinds of Govt. Duties, AIT, Vat &',
    bankDetails: 'Islami Bank Bangladesh PLC',
    accountNumber: '20504480100091802',
    routingNumber: '125193250',
    additionalBankInfo: 'Account Name: FR Cosmetics Ltd.\nSWIFT: IBBLBDDH\nBranch: Nangalkot Branch\nAddress: Nangalkot, Cumilla, Bangladesh',
    
    // Signature
    signature: '/signature.png',
    signatureName: 'Md Khorshed Alam',
    signaturePhone: 'frcosmetics25@gmail.com',
    
    // Footer
    companyPhone: '01632211485, 01783321436, 01891598055',
    companyFooterAddress: 'Datiswar, Nangalkot, Cumilla, Bangladesh',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Collapsible sections state
  const [companyInfoExpanded, setCompanyInfoExpanded] = useState(false);
  const [bankDetailsExpanded, setBankDetailsExpanded] = useState(false);
  const [footerInfoExpanded, setFooterInfoExpanded] = useState(false);

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

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => total + item.total, 0);
  };

  const calculateVAT = () => {
    return (calculateSubtotal() * invoiceData.vatPercentage) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateVAT();
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
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
        Invoice Generator
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
        {/* Header Section - Company Information */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h5" gutterBottom sx={{ 
              color: 'rgb(26, 68, 160)', 
              fontWeight: 'bold', 
              mb: 0,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}>
              Company Information
            </Typography>
            <IconButton
              onClick={() => setCompanyInfoExpanded(!companyInfoExpanded)}
              sx={{ color: 'rgb(26, 68, 160)', size: { xs: 'small', sm: 'medium' } }}
            >
              {companyInfoExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={companyInfoExpanded}>
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
                      style={{ 
                        width: '100%', 
                        maxWidth: '500px', 
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto'
                      }}
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
          </Collapse>
        </Box>

        <Divider />

        {/* Buyer Details Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'rgb(26, 68, 160)', 
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
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
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'rgb(26, 68, 160)', 
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
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

            {/* Invoice Date and Due Date - responsive layout */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="Invoice Date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                required
                placeholder="dd-mm-yyyy"
                helperText="Format: dd-mm-yyyy (e.g., 15-12-2024)"
              />
              <TextField
                fullWidth
                label="Due Date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                placeholder="dd-mm-yyyy"
                helperText="Format: dd-mm-yyyy (e.g., 15-01-2025)"
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Product/Items Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'rgb(26, 68, 160)', 
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
            Invoice Items
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Items Table Header - Responsive */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              fontWeight: 'bold', 
              color: '#333',
              overflowX: 'auto',
              minWidth: { xs: '100%', sm: 'auto' }
            }}>
              <Box sx={{ 
                flex: { xs: '0 0 40%', sm: 2 }, 
                p: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                minWidth: '120px'
              }}>
                Description
              </Box>
              <Box sx={{ 
                flex: { xs: '0 0 15%', sm: 1 }, 
                p: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1, 
                textAlign: 'center',
                minWidth: '60px'
              }}>
                Qty
              </Box>
              <Box sx={{ 
                flex: { xs: '0 0 20%', sm: 1 }, 
                p: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1, 
                textAlign: 'right',
                minWidth: '80px'
              }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Unit Price (TK)</Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Price</Box>
              </Box>
              <Box sx={{ 
                flex: { xs: '0 0 20%', sm: 1 }, 
                p: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1, 
                textAlign: 'right',
                minWidth: '80px'
              }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Total (TK)</Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Total</Box>
              </Box>
              <Box sx={{ 
                flex: { xs: '0 0 5%', sm: 0.5 }, 
                p: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1, 
                textAlign: 'center',
                minWidth: '40px'
              }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Action</Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>X</Box>
              </Box>
            </Box>

            {/* Items List - Responsive */}
            {invoiceData.items.map((item, index) => (
              <Box key={item.id} sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center',
                overflowX: 'auto',
                minWidth: { xs: '100%', sm: 'auto' }
              }}>
                <TextField
                  sx={{ 
                    flex: { xs: '0 0 40%', sm: 2 },
                    minWidth: '120px'
                  }}
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  size="small"
                />
                <TextField
                  sx={{ 
                    flex: { xs: '0 0 15%', sm: 1 },
                    minWidth: '60px'
                  }}
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  sx={{ 
                    flex: { xs: '0 0 20%', sm: 1 },
                    minWidth: '80px'
                  }}
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  sx={{ 
                    flex: { xs: '0 0 20%', sm: 1 },
                    minWidth: '80px'
                  }}
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
                  sx={{ 
                    flex: { xs: '0 0 5%', sm: 0.5 }, 
                    minWidth: '40px',
                    fontSize: { xs: '0.7rem', sm: '0.875rem' }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Remove</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>X</Box>
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
                  Subtotal: {calculateSubtotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* VAT */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <TextField
                type="number"
                label="VAT %"
                value={invoiceData.vatPercentage}
                onChange={(e) => handleInputChange('vatPercentage', parseFloat(e.target.value) || 0)}
                size="small"
                sx={{ width: '150px' }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                VAT ({invoiceData.vatPercentage}%): TK {calculateVAT().toFixed(2)}
              </Typography>
            </Box>

            {/* Grand Total and Amount in Words */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              {/* Amount in Words - Left Side */}
              <Typography variant="body1" sx={{ fontWeight: 'medium', fontStyle: 'italic' }}>
                {calculateGrandTotal() > 0 ? `${numberToWords(calculateGrandTotal())} taka only` : 'Zero taka only'}
              </Typography>

              {/* Grand Total - Right Side */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgb(26, 68, 160)' }}>
                Total: TK {calculateGrandTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Terms & Conditions Section */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'rgb(26, 68, 160)', 
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
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

        {/* Signature and Bank Details Section - Side by Side */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h5" gutterBottom sx={{ 
              color: 'rgb(26, 68, 160)', 
              fontWeight: 'bold', 
              mb: 0,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}>
              Signature & Bank Details
            </Typography>
            <IconButton
              onClick={() => setBankDetailsExpanded(!bankDetailsExpanded)}
              sx={{ color: 'rgb(26, 68, 160)', size: { xs: 'small', sm: 'medium' } }}
            >
              {bankDetailsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={bankDetailsExpanded}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 3 } 
            }}>
            {/* Left Side - Signature Section */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
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
                          style={{ 
                            width: '100%', 
                            maxWidth: '200px', 
                            height: 'auto', 
                            border: '1px solid #eee',
                            display: 'block',
                            margin: '0 auto'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Upload a PNG signature image with transparent background
                  </Typography>
                </Box>

                {/* Signature Name */}
                <TextField
                  fullWidth
                  label="Signature Name"
                  value={invoiceData.signatureName || ''}
                  onChange={(e) => handleInputChange('signatureName', e.target.value)}
                  placeholder="Enter signature holder's name"
                  helperText="Name of the person signing the invoice"
                />

                {/* Signature Email */}
                <TextField
                  fullWidth
                  label="Signature Email"
                  value={invoiceData.signaturePhone || ''}
                  onChange={(e) => handleInputChange('signaturePhone', e.target.value)}
                  placeholder="Enter signature holder's email"
                  helperText="Email address of the person signing the invoice"
                />
              </Box>
            </Box>

            {/* Right Side - Bank Details Section */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666' }}>
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
                  rows={4}
                  value={invoiceData.additionalBankInfo || ''}
                  onChange={(e) => handleInputChange('additionalBankInfo', e.target.value)}
                  placeholder="Account Name, SWIFT code, Branch, Address, etc."
                  helperText="Add account name, SWIFT code, branch, and address"
                />
              </Box>
            </Box>
            </Box>
          </Collapse>
        </Box>

        <Divider />

        {/* Footer Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h5" gutterBottom sx={{ 
              color: 'rgb(26, 68, 160)', 
              fontWeight: 'bold', 
              mb: 0,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}>
              Footer Information
            </Typography>
            <IconButton
              onClick={() => setFooterInfoExpanded(!footerInfoExpanded)}
              sx={{ color: 'rgb(26, 68, 160)', size: { xs: 'small', sm: 'medium' } }}
            >
              {footerInfoExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={footerInfoExpanded}>
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
          </Collapse>
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            justifyContent: 'center'
          }}>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={handlePreview}
              size="large"
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {previewMode ? 'Hide Preview' : 'Preview Invoice'}
            </Button>
            <Button
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={20} /> : <PictureAsPdf />}
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              size="large"
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
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