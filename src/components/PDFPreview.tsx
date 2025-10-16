import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
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

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    position: 'relative',
  },

  backgroundImage: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    width: 350,
    height: 'auto',
    opacity: 0.6,
    zIndex: -1,
    objectFit: 'contain',
    marginLeft: -175,
    marginTop: '-15%',
  },
  
  // Header Section Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '2 solid #1a44a0',
  },
  
  companyInfo: {
    flex: 1,
  },
  
  companyLogo: {
    width: 250,
    height: 'auto',
    marginBottom: 15,
  },
  
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 5,
  },
  
  companyAddress: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.3,
  },
  
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  
  invoiceMeta: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginTop: 3,
  },
  
  // Content Section
  content: {
    flex: 1,
  },
  
  // Buyer Details Section
  buyerSection: {
    marginBottom: 20,
  },
  
  buyerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 8,
  },
  
  buyerInfo: {
    padding: 10,
    backgroundColor: 'rgba(248, 249, 250, 0.3)',
    borderRadius: 5,
  },
  
  buyerCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  
  buyerAddress: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  
  buyerContact: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  
  // Items Table Section
  itemsSection: {
    marginBottom: 20,
  },
  
  itemsTable: {
    width: '100%',
  },
  
  itemsTableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ddd',
    paddingVertical: 6,
  },
  
  itemsTableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 245, 245, 0.3)',
    borderBottom: '2 solid #ddd',
    paddingVertical: 8,
  },
  
  itemsTableHeaderCell: {
    flex: 3,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'left',
  },
  
  itemsTableHeaderCellCenter: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  
  itemsTableHeaderCellRight: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },
  
  itemsTableCell: {
    flex: 3,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#333333',
    textAlign: 'left',
  },
  
  itemsTableCellCenter: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
  },
  
  itemsTableCellRight: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#333333',
    textAlign: 'right',
  },
  
  subtotalSection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },

  subtotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },

  vatSection: {
    marginTop: 5,
    alignItems: 'flex-end',
  },

  vatLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },

  grandTotalSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a44a0',
  },
  
  // Terms & Conditions Section
  termsSection: {
    marginBottom: 10,
  },
  
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 8,
  },
  
  termsContent: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },

  termsLine: {
    marginBottom: 2,
  },

  termsHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
  },

  termsText: {
    fontSize: 9,
    color: '#333333',
  },
  
  amountInWordsValue: {
    fontSize: 9,
    fontWeight: 'medium',
    fontStyle: 'italic',
    color: '#333333',
  },
  
  // Signature and Bank Details Section - Side by Side
  signatureAndBankSection: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 20,
  },

  // Left Column - Signature
  signatureColumn: {
    flex: 1,
  },

  signatureBox: {
    alignItems: 'flex-start',
    minHeight: 120,
  },

  // Right Column - Bank Details
  bankDetailsColumn: {
    flex: 1,
  },

  bankDetailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 8,
  },

  bankDetailsContent: {
    marginTop: 4,
  },

  bankDetailsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },

  bankDetailsLabel: {
    fontSize: 9,
    color: '#333333',
  },

  bankDetailsValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 4,
  },

  bankDetailsText: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },

  bankDetailsFullRow: {
    marginTop: 2,
  },
  
  signatureImage: {
    width: 80,
    height: 'auto',
    marginBottom: 0,
  },

  signatureLine: {
    borderTop: '1 solid #333333',
    width: 80,
    marginTop: 0,
  },
  
  signatureLabel: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginTop: 3,
  },
  
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginTop: 2,
  },

  signaturePhone: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginTop: 1,
  },
  
  // Footer Section
  footerSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#2a2a2a',
  },

  footerContent: {
    flexDirection: 'row',
    height: 50,
    position: 'relative',
  },

  // Left decorative section with angular design
  footerLeftDecoration: {
    width: '35%',
    height: 50,
    position: 'relative',
  },

  // Angular "K" shape design
  footerVerticalLine1: {
    position: 'absolute',
    left: 40,
    top: 5,
    width: 3,
    height: 20,
    backgroundColor: '#1a44a0',
  },

  footerDiagonalLine1: {
    position: 'absolute',
    left: 43,
    top: 12,
    width: 25,
    height: 3,
    backgroundColor: '#1a44a0',
    transform: 'rotate(-25deg)',
  },

  footerDiagonalLine2: {
    position: 'absolute',
    left: 43,
    top: 18,
    width: 30,
    height: 3,
    backgroundColor: '#1a44a0',
    transform: 'rotate(35deg)',
  },

  // Middle script text area
  footerMiddleText: {
    position: 'absolute',
    left: 90,
    top: 12,
    width: 80,
    height: 25,
  },

  footerScriptText: {
    fontSize: 16,
    color: '#1a44a0',
    fontWeight: 'bold',
  },

  // Right curved line decoration
  footerRightCurve: {
    position: 'absolute',
    right: 40,
    top: 20,
    width: 60,
    height: 3,
    backgroundColor: '#1a44a0',
    borderRadius: 2,
  },

  footerBlueBar: {
    width: '30%',
    backgroundColor: '#1a44a0',
    height: 50,
  },

  footerContactInfo: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingLeft: 12,
    paddingTop: 8,
    height: 50,
    justifyContent: 'center',
  },

  footerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  footerIcon: {
    width: 4,
    height: 4,
    backgroundColor: '#ff6b35',
    marginRight: 6,
  },

  footerText: {
    fontSize: 7,
    color: '#cccccc',
  },

  footerBottomBar: {
    height: 10,
    backgroundColor: '#1a1a1a',
  },
  
  // Placeholder for other sections
  placeholder: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 50,
  },
});

const PDFDocument: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        <Image src="/image.png" style={styles.backgroundImage} fixed />

        {/* Header Section */}
        <View style={styles.header}>
          {/* Company Information */}
          <View style={styles.companyInfo}>
            {invoiceData.companyLogo && (
              <Image
                src={invoiceData.companyLogo}
                style={styles.companyLogo}
              />
            )}
            <Text style={styles.companyName}>{invoiceData.companyName}</Text>
            <Text style={styles.companyAddress}>{invoiceData.companyAddress}</Text>
          </View>
          
          {/* Invoice Information */}
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceMeta}>
              <Text>Date: {invoiceData.invoiceDate}</Text>
              <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>
        </View>
        
        {/* Content Section */}
        <View style={styles.content}>
          {/* Buyer Details Section */}
          <View style={styles.buyerSection}>
            <Text style={styles.buyerTitle}>To:</Text>
            <View style={styles.buyerInfo}>
              <Text style={styles.buyerCompany}>{invoiceData.buyerCompany}</Text>
              <Text style={styles.buyerAddress}>{invoiceData.buyerAddress}</Text>
              {invoiceData.buyerContact && (
                <Text style={styles.buyerContact}>{invoiceData.buyerContact}</Text>
              )}
            </View>
          </View>
          
          {/* Items Table Section */}
          <View style={styles.itemsSection}>
            <View style={styles.itemsTable}>
              {/* Table Header */}
              <View style={styles.itemsTableHeaderRow}>
                <Text style={styles.itemsTableHeaderCell}>Description</Text>
                <Text style={styles.itemsTableHeaderCellCenter}>Quantity</Text>
                <Text style={styles.itemsTableHeaderCellRight}>Unit Price (TK)</Text>
                <Text style={styles.itemsTableHeaderCellRight}>Total (TK)</Text>
              </View>
              
              {/* Table Body */}
              {invoiceData.items.map((item) => (
                <View key={item.id} style={styles.itemsTableRow}>
                  <Text style={styles.itemsTableCell}>{item.description}</Text>
                  <Text style={styles.itemsTableCellCenter}>{item.quantity}</Text>
                  <Text style={styles.itemsTableCellRight}>{item.unitPrice.toFixed(2)}</Text>
                  <Text style={styles.itemsTableCellRight}>{item.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
            
            {/* Subtotal */}
            <View style={styles.subtotalSection}>
              <Text style={styles.subtotalLabel}>
                Subtotal: {invoiceData.items.reduce((total, item) => total + item.total, 0).toFixed(2)}
              </Text>
            </View>

            {/* VAT */}
            <View style={styles.vatSection}>
              <Text style={styles.vatLabel}>
                VAT ({invoiceData.vatPercentage}%): {(() => {
                  const subtotal = invoiceData.items.reduce((total, item) => total + item.total, 0);
                  return ((subtotal * invoiceData.vatPercentage) / 100).toFixed(2);
                })()}
              </Text>
            </View>

            {/* Grand Total and Amount in Words */}
            <View style={styles.grandTotalSection}>
              {/* Amount in Words - Left Side */}
              <Text style={styles.amountInWordsValue}>
                {(() => {
                  const subtotal = invoiceData.items.reduce((total, item) => total + item.total, 0);
                  const vat = (subtotal * invoiceData.vatPercentage) / 100;
                  const grandTotal = subtotal + vat;
                  return grandTotal > 0 ? `${numberToWords(grandTotal)} taka only` : 'Zero taka only';
                })()}
              </Text>

              {/* Grand Total - Right Side */}
              <Text style={styles.grandTotalLabel}>
                Total: {(() => {
                  const subtotal = invoiceData.items.reduce((total, item) => total + item.total, 0);
                  const vat = (subtotal * invoiceData.vatPercentage) / 100;
                  return (subtotal + vat).toFixed(2);
                })()}
              </Text>
            </View>
          </View>
          
          {/* Terms & Conditions Section */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <View>
              {invoiceData.terms.split('\n').map((line, index) => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                  return (
                    <View key={index} style={styles.termsLine}>
                      <Text>
                        <Text style={styles.termsHeader}>{parts[0]}:</Text>
                        <Text style={styles.termsText}> {parts.slice(1).join(':').trim()}</Text>
                      </Text>
                    </View>
                  );
                }
                return <Text key={index} style={styles.termsContent}>{line}</Text>;
              })}
            </View>
          </View>
          
          {/* Signature and Bank Details Section - Side by Side */}
          <View style={styles.signatureAndBankSection}>
            {/* Left Side - Signature Section */}
            <View style={styles.signatureColumn}>
              <View style={styles.signatureBox}>
                {invoiceData.signature && (
                  <Image src={invoiceData.signature} style={styles.signatureImage} />
                )}
                <View style={styles.signatureLine} />
                {invoiceData.signatureName && (
                  <Text style={styles.signatureName}>{invoiceData.signatureName}</Text>
                )}
                {invoiceData.signaturePhone && (
                  <Text style={styles.signaturePhone}>{invoiceData.signaturePhone}</Text>
                )}
              </View>
            </View>

            {/* Right Side - Bank Details Section */}
            <View style={styles.bankDetailsColumn}>
              <Text style={styles.bankDetailsTitle}>Bank Details</Text>
              <View style={styles.bankDetailsContent}>
                <View style={styles.bankDetailsRow}>
                  <Text style={styles.bankDetailsLabel}>Bank Name:</Text>
                  <Text style={styles.bankDetailsValue}>{invoiceData.bankDetails}</Text>
                </View>
                {invoiceData.accountNumber && (
                  <View style={styles.bankDetailsRow}>
                    <Text style={styles.bankDetailsLabel}>Account Number:</Text>
                    <Text style={styles.bankDetailsValue}>{invoiceData.accountNumber}</Text>
                  </View>
                )}
                {invoiceData.routingNumber && (
                  <View style={styles.bankDetailsRow}>
                    <Text style={styles.bankDetailsLabel}>Routing Number:</Text>
                    <Text style={styles.bankDetailsValue}>{invoiceData.routingNumber}</Text>
                  </View>
                )}
                {invoiceData.additionalBankInfo && (
                  <View style={styles.bankDetailsFullRow}>
                    {invoiceData.additionalBankInfo.split('\n').map((line, index) => {
                      const parts = line.split(':');
                      if (parts.length >= 2) {
                        return (
                          <View key={index} style={styles.bankDetailsRow}>
                            <Text style={styles.bankDetailsLabel}>{parts[0]}:</Text>
                            <Text style={styles.bankDetailsValue}>{parts.slice(1).join(':').trim()}</Text>
                          </View>
                        );
                      }
                      return <Text key={index} style={styles.bankDetailsText}>{line}</Text>;
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        
        {/* Footer Section */}
        <View style={styles.footerSection} fixed>
          <View style={styles.footerContent}>
            <View style={styles.footerBlueBar} />
            <View style={styles.footerContactInfo}>
              {invoiceData.companyPhone && (
                <View style={styles.footerContactRow}>
                  <View style={styles.footerIcon} />
                  <Text style={styles.footerText}>{invoiceData.companyPhone}</Text>
                </View>
              )}
              {invoiceData.companyFooterAddress && (
                <View style={styles.footerContactRow}>
                  <View style={styles.footerIcon} />
                  <Text style={styles.footerText}>{invoiceData.companyFooterAddress}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.footerBottomBar} />
        </View>
      </Page>
    </Document>
  );
};

const PDFPreview: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => {
  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ddd' }}>
      <PDFViewer width="100%" height="100%">
        <PDFDocument invoiceData={invoiceData} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;