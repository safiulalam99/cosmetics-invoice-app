import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
    opacity: 0.08,
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

  letterInfo: {
    alignItems: 'flex-end',
  },

  letterDate: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 5,
  },

  // Content Section
  content: {
    flex: 1,
  },

  subjectSection: {
    marginBottom: 20,
  },

  subjectLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 5,
  },

  subjectText: {
    fontSize: 11,
    color: '#333333',
  },

  // Letter Body
  letterBody: {
    marginBottom: 30,
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
  },

  // Signature Section
  signatureSection: {
    marginTop: 30,
    marginBottom: 10,
  },

  signatureBox: {
    alignItems: 'flex-start',
    minHeight: 100,
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
    height: 45,
    backgroundColor: '#2a2a2a',
  },

  footerContent: {
    flexDirection: 'row',
    height: 38,
    position: 'relative',
  },

  footerBlueBar: {
    width: '30%',
    backgroundColor: '#1a44a0',
    height: 38,
  },

  footerContactInfo: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingLeft: 12,
    paddingTop: 6,
    height: 38,
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
    height: 7,
    backgroundColor: '#1a1a1a',
  },
});

const LetterPDF: React.FC<{ letterData: LetterData }> = ({ letterData }) => {
  // Convert HTML content to plain text paragraphs for PDF rendering
  const renderContent = () => {
    // Remove HTML tags and convert to plain text
    const plainText = letterData.content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    return plainText.split('\n').map((line, index) => (
      <Text key={index} style={{ marginBottom: line.trim() === '' ? 5 : 0 }}>
        {line || ' '}
      </Text>
    ));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        <Image src="/image.png" style={styles.backgroundImage} fixed />

        {/* Header Section */}
        <View style={styles.header}>
          {/* Company Information */}
          <View style={styles.companyInfo}>
            {letterData.companyLogo && (
              <Image
                src={letterData.companyLogo}
                style={styles.companyLogo}
              />
            )}
            <Text style={styles.companyName}>{letterData.companyName}</Text>
            <Text style={styles.companyAddress}>{letterData.companyAddress}</Text>
          </View>

          {/* Letter Date */}
          <View style={styles.letterInfo}>
            <Text style={styles.letterDate}>Date: {letterData.letterDate}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Subject Line */}
          {letterData.subject && (
            <View style={styles.subjectSection}>
              <Text style={styles.subjectLabel}>Subject:</Text>
              <Text style={styles.subjectText}>{letterData.subject}</Text>
            </View>
          )}

          {/* Letter Body */}
          <View style={styles.letterBody}>
            {renderContent()}
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              {letterData.signature && (
                <Image src={letterData.signature} style={styles.signatureImage} />
              )}
              <View style={styles.signatureLine} />
              {letterData.signatureName && (
                <Text style={styles.signatureName}>{letterData.signatureName}</Text>
              )}
              {letterData.signaturePhone && (
                <Text style={styles.signaturePhone}>{letterData.signaturePhone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection} fixed>
          <View style={styles.footerContent}>
            <View style={styles.footerBlueBar} />
            <View style={styles.footerContactInfo}>
              {letterData.companyPhone && (
                <View style={styles.footerContactRow}>
                  <View style={styles.footerIcon} />
                  <Text style={styles.footerText}>{letterData.companyPhone}</Text>
                </View>
              )}
              {letterData.companyFooterAddress && (
                <View style={styles.footerContactRow}>
                  <View style={styles.footerIcon} />
                  <Text style={styles.footerText}>{letterData.companyFooterAddress}</Text>
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

export default LetterPDF;
