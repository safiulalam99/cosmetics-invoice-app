// Utility function to convert numbers to words
const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const scales = ['', 'thousand', 'million', 'billion'];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num > 99) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }
  
  if (num > 19) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += ' ' + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }
  
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  let scaleIndex = 0;
  let remaining = integerPart;
  
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex > 0) {
        result = chunkWords + ' ' + scales[scaleIndex] + (result ? ' ' + result : '');
      } else {
        result = chunkWords;
      }
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }
  
  if (decimalPart > 0) {
    result += ' and ' + convertHundreds(decimalPart) + ' cents';
  }
  
  return result;
}
