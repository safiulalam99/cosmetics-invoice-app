// Utility function to convert numbers to words (Indian numbering system)
const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

function convertTwoDigits(num: number): string {
  if (num < 20) {
    return ones[num];
  }

  const tenDigit = Math.floor(num / 10);
  const oneDigit = num % 10;

  return tens[tenDigit] + (oneDigit > 0 ? ' ' + ones[oneDigit] : '');
}

function convertHundreds(num: number): string {
  if (num === 0) return '';

  let result = '';

  if (num > 99) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }

  if (num > 0) {
    result += convertTwoDigits(num);
  }

  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = '';
  let remaining = integerPart;

  // Handle crores (10,000,000)
  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000);
    result += convertHundreds(crores) + ' crore';
    remaining %= 10000000;
    if (remaining > 0) result += ' ';
  }

  // Handle lakhs (100,000)
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000);
    result += convertHundreds(lakhs) + ' lakh';
    remaining %= 100000;
    if (remaining > 0) result += ' ';
  }

  // Handle thousands (1,000)
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    result += convertHundreds(thousands) + ' thousand';
    remaining %= 1000;
    if (remaining > 0) result += ' ';
  }

  // Handle hundreds and below
  if (remaining > 0) {
    result += convertHundreds(remaining);
  }

  // Handle decimal part as taka (not paisa)
  if (decimalPart > 0) {
    result += ' point ' + convertHundreds(decimalPart);
  }

  return result.trim();
}

// Format numbers with Indian comma placement (e.g., 12,34,567.89)
export function formatIndianNumber(num: number): string {
  const [integerPart, decimalPart] = num.toFixed(2).split('.');

  if (integerPart.length <= 3) {
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  }

  // Get last 3 digits
  const lastThree = integerPart.slice(-3);
  // Get remaining digits
  const remaining = integerPart.slice(0, -3);

  // Add commas every 2 digits for remaining part
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return decimalPart
    ? `${formatted},${lastThree}.${decimalPart}`
    : `${formatted},${lastThree}`;
}
