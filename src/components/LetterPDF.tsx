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

  // Recipient Information (Optional)
  recipientCompany?: string;
  recipientAddress?: string;
  recipientContact?: string;

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

  // Recipient Section
  recipientSection: {
    marginBottom: 20,
  },

  recipientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a44a0',
    marginBottom: 8,
  },

  recipientInfo: {
    padding: 10,
    backgroundColor: 'rgba(248, 249, 250, 0.3)',
    borderRadius: 5,
  },

  recipientCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },

  recipientAddress: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.3,
    marginBottom: 4,
  },

  recipientContact: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
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

  paragraph: {
    marginBottom: 12,
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.8,
  },

  bold: {
    fontWeight: 'bold',
  },

  italic: {
    fontStyle: 'italic',
  },

  underline: {
    textDecoration: 'underline',
  },

  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  listBullet: {
    width: 20,
    fontSize: 11,
  },

  listContent: {
    flex: 1,
    fontSize: 11,
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
  // Parse HTML and render with formatting
  const renderContent = () => {
    if (!letterData.content || letterData.content.trim() === '') {
      return <Text>No content</Text>;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(letterData.content, 'text/html');
    const elements: any[] = [];

    const processInlineNode = (node: ChildNode, baseStyles: any = {}): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        return text ? <Text style={baseStyles}>{text}</Text> : null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const children = Array.from(element.childNodes);
        let newStyles = { ...baseStyles };

        switch (tagName) {
          case 'strong':
          case 'b':
            newStyles = { ...newStyles, fontWeight: 'bold' };
            break;
          case 'em':
          case 'i':
            newStyles = { ...newStyles, fontStyle: 'italic' };
            break;
          case 'u':
            newStyles = { ...newStyles, textDecoration: 'underline' };
            break;
        }

        if (tagName === 'br') {
          return '\n';
        }

        return children.map((child, idx) => (
          <React.Fragment key={idx}>{processInlineNode(child, newStyles)}</React.Fragment>
        ));
      }

      return null;
    };

    const processBlockNode = (node: ChildNode, index: number): any => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'p') {
          const children = Array.from(element.childNodes);
          const isEmpty = element.textContent?.trim() === '';

          return (
            <View key={index} style={isEmpty ? { height: 12 } : styles.paragraph}>
              {!isEmpty && (
                <Text style={{ fontSize: 11, lineHeight: 1.8 }}>
                  {children.map((child, idx) => (
                    <React.Fragment key={idx}>{processInlineNode(child)}</React.Fragment>
                  ))}
                </Text>
              )}
            </View>
          );
        }

        if (tagName === 'ul' || tagName === 'ol') {
          const items = Array.from(element.querySelectorAll('li'));
          return (
            <View key={index} style={{ marginBottom: 12, marginLeft: 10 }}>
              {items.map((li, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.listBullet}>
                    {tagName === 'ul' ? '•' : `${idx + 1}.`}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listContent}>
                      {Array.from(li.childNodes).map((child, i) => (
                        <React.Fragment key={i}>{processInlineNode(child)}</React.Fragment>
                      ))}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        }

        if (tagName === 'hr') {
          return (
            <View key={index} style={{ borderBottom: '1 solid #999', marginVertical: 12 }} />
          );
        }

        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          return (
            <View key={index} style={{ marginBottom: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {element.textContent}
              </Text>
            </View>
          );
        }
      }

      return null;
    };

    Array.from(doc.body.childNodes).forEach((node, index) => {
      const result = processBlockNode(node, index);
      if (result) {
        elements.push(result);
      }
    });

    return elements.length > 0 ? elements : <Text>No content</Text>;
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
          {/* Recipient Details Section (Optional) */}
          {letterData.recipientCompany && (
            <View style={styles.recipientSection}>
              <Text style={styles.recipientTitle}>To:</Text>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientCompany}>{letterData.recipientCompany}</Text>
                {letterData.recipientAddress && (
                  <Text style={styles.recipientAddress}>{letterData.recipientAddress}</Text>
                )}
                {letterData.recipientContact && (
                  <Text style={styles.recipientContact}>{letterData.recipientContact}</Text>
                )}
              </View>
            </View>
          )}

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
