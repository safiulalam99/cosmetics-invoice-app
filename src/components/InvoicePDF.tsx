import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
  },
  
  // Header Section Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '2 solid #e74c3c',
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
    color: '#e74c3c',
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
    color: '#e74c3c',
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
    color: '#e74c3c',
    marginBottom: 8,
  },
  
  buyerInfo: {
    padding: 10,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#f5f5f5',
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
  
  grandTotalSection: {
    marginTop: 5,
    alignItems: 'flex-end',
  },
  
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  
  // Terms & Conditions Section
  termsSection: {
    marginBottom: 10,
  },
  
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  
  termsContent: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },
  
  amountInWordsBox: {
    padding: 8,
    border: '1 solid #e3f2fd',
    backgroundColor: '#f8f9fa',
    marginTop: 10,
  },
  
  amountInWordsLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 4,
  },
  
  amountInWordsValue: {
    fontSize: 9,
    fontWeight: 'medium',
    fontStyle: 'italic',
    color: '#333333',
  },
  
  // Bank Details Section
  bankDetailsSection: {
    marginBottom: 10,
  },
  
  bankDetailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  
  bankDetailsContent: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  
  bankDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  bankDetailsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  
  bankDetailsValue: {
    fontSize: 9,
    color: '#333333',
    flex: 2,
    textAlign: 'right',
  },
  
  bankDetailsFullRow: {
    marginBottom: 4,
  },
  
  // Signature Section
  signatureSection: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  
  signatureBox: {
    alignItems: 'center',
    minHeight: 80,
  },
  
  signatureImage: {
    width: 80,
    height: 'auto',
    marginBottom: 6,
  },
  
  signatureLine: {
    borderTop: '1 solid #333333',
    width: 80,
    marginTop: 3,
  },
  
  signatureLabel: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginTop: 3,
  },
  
  signatureName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginTop: 2,
  },
  
  signaturePhone: {
    fontSize: 7,
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
    height: 40,
    backgroundColor: '#1a1a1a',
  },
  
  footerContent: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: '#2a2a2a',
  },
  
  footerBlueBar: {
    width: '30%',
    backgroundColor: '#3498db',
    height: 30,
  },
  
  footerContactInfo: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingLeft: 8,
    paddingTop: 4,
    height: 30,
  },
  
  footerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  
  footerIcon: {
    width: 4,
    height: 4,
    backgroundColor: '#ff6b35',
    marginRight: 4,
  },
  
  footerText: {
    fontSize: 6,
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

const InvoicePDF: React.FC<{ invoiceData: InvoiceData }> = ({ invoiceData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
              <Text>Due Date: {invoiceData.dueDate}</Text>
              <Text style={styles.invoiceNumber}>#{invoiceData.invoiceNumber}</Text>
            </View>
          </View>
        </View>
        
        {/* Content Section */}
        <View style={styles.content}>
          {/* Buyer Details Section */}
          <View style={styles.buyerSection}>
            <Text style={styles.buyerTitle}>Bill To:</Text>
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
                <Text style={styles.itemsTableHeaderCellRight}>Unit Price</Text>
                <Text style={styles.itemsTableHeaderCellRight}>Total</Text>
              </View>
              
              {/* Table Body */}
              {invoiceData.items.map((item, index) => (
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
                Subtotal: TK {invoiceData.items.reduce((total, item) => total + item.total, 0).toFixed(2)}
              </Text>
            </View>
            
            {/* Grand Total */}
            <View style={styles.grandTotalSection}>
              <Text style={styles.grandTotalLabel}>
                Grand Total: TK {invoiceData.items.reduce((total, item) => total + item.total, 0).toFixed(2)}
              </Text>
            </View>
            
            {/* Amount in Words */}
            <View style={styles.amountInWordsBox}>
              <Text style={styles.amountInWordsLabel}>Amount in Words:</Text>
              <Text style={styles.amountInWordsValue}>
                {(() => {
                  const grandTotal = invoiceData.items.reduce((total, item) => total + item.total, 0);
                  return grandTotal > 0 ? `${numberToWords(grandTotal)} taka only` : 'Zero taka only';
                })()}
              </Text>
            </View>
          </View>
          
          {/* Terms & Conditions Section */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsContent}>{invoiceData.terms}</Text>
          </View>
          
          {/* Bank Details Section */}
          <View style={styles.bankDetailsSection}>
            <Text style={styles.bankDetailsTitle}>Bank Details</Text>
            <View style={styles.bankDetailsContent}>
              <View style={styles.bankDetailsRow}>
                <Text style={styles.bankDetailsLabel}>Bank:</Text>
                <Text style={styles.bankDetailsValue}>{invoiceData.bankDetails}</Text>
              </View>
              {invoiceData.accountNumber && (
                <View style={styles.bankDetailsRow}>
                  <Text style={styles.bankDetailsLabel}>Account:</Text>
                  <Text style={styles.bankDetailsValue}>{invoiceData.accountNumber}</Text>
                </View>
              )}
              {invoiceData.routingNumber && (
                <View style={styles.bankDetailsRow}>
                  <Text style={styles.bankDetailsLabel}>Routing:</Text>
                  <Text style={styles.bankDetailsValue}>{invoiceData.routingNumber}</Text>
                </View>
              )}
              {invoiceData.additionalBankInfo && (
                <View style={styles.bankDetailsFullRow}>
                  <Text style={styles.bankDetailsValue}>{invoiceData.additionalBankInfo}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Signature Section */}
          <View style={styles.signatureSection}>
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
        </View>
        
        {/* Footer Section */}
        <View style={styles.footerSection}>
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

export default InvoicePDF;