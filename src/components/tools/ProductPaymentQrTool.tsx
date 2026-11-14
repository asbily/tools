import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Printer,
  Share2,
  Receipt,
  CreditCard,
  ShoppingBag,
  Building,
  Landmark,
  Smartphone,
  Globe,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Sliders,
  DollarSign,
  ChevronRight,
  Eye,
  Layers,
  ArrowRight,
  FileText,
  Zap
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

type CurrencyCode = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SAR' | 'CAD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'BDT', symbol: '৳', name: 'BDT (Bangladeshi Taka)' },
  { code: 'USD', symbol: '$', name: 'USD (US Dollar)' },
  { code: 'EUR', symbol: '€', name: 'EUR (Euro)' },
  { code: 'GBP', symbol: '£', name: 'GBP (British Pound)' },
  { code: 'INR', symbol: '₹', name: 'INR (Indian Rupee)' },
  { code: 'AED', symbol: 'د.إ', name: 'AED (UAE Dirham)' },
  { code: 'SAR', symbol: '﷼', name: 'SAR (Saudi Riyal)' },
  { code: 'CAD', symbol: '$', name: 'CAD (Canadian Dollar)' },
];

type PaymentMethodType = 'bkash_nagad' | 'upi' | 'bank' | 'weblink' | 'crypto';

export const ProductPaymentQrTool: React.FC = () => {
  // Store & Order Identity
  const [storeName, setStoreName] = useState('Asbily Store');
  const [invoiceNo, setInvoiceNo] = useState(() => `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '৳';

  // Products list
  const [items, setItems] = useState<ProductItem[]>([
    { id: '1', name: 'Wireless Bluetooth Earbuds Pro', price: 2450, qty: 1 },
    { id: '2', name: 'Fast Charging Adapter 30W', price: 750, qty: 1 },
  ]);

  // Adjustments
  const [taxRate, setTaxRate] = useState<number>(5); // percentage
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(200);
  const [shippingFee, setShippingFee] = useState<number>(60);

  // Payment Setup
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bkash_nagad');

  // bKash / Nagad / Mobile Wallet
  const [mfsProvider, setMfsProvider] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [mfsAccountType, setMfsAccountType] = useState<'Merchant' | 'Personal' | 'Agent'>('Merchant');
  const [mfsNumber, setMfsNumber] = useState('01700000000');
  const [mfsReference, setMfsReference] = useState('');
  const [mfsCounter, setMfsCounter] = useState('1');

  // UPI
  const [upiId, setUpiId] = useState('asbily@okaxis');
  const [upiPayeeName, setUpiPayeeName] = useState('Asbily Store');

  // Bank
  const [bankName, setBankName] = useState('City Bank PLC');
  const [bankAccountName, setBankAccountName] = useState('Asbily Commercial Store');
  const [bankAccountNumber, setBankAccountNumber] = useState('1203498172001');
  const [bankBranchRouting, setBankBranchRouting] = useState('Gulshan Branch · Routing 225271987');

  // Web Payment Link
  const [webPayUrl, setWebPayUrl] = useState('https://tools.asbily.com/pay');

  // Crypto
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT (TRC20)');
  const [cryptoAddress, setCryptoAddress] = useState('TJ7zK9g8H1YvP6xLmN3qW2rT5eD4sA1bC9');

  // QR Design & State
  const [qrTheme, setQrTheme] = useState<'black' | 'dark' | 'charcoal' | 'graphite' | 'neutral'>('black');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeViewTab, setActiveViewTab] = useState<'qr_code' | 'stand_card' | 'bill_receipt'>('stand_card');

  // Copy feedback state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Financial Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
  const discountAmount = discountType === 'percentage'
    ? (subtotal * (Number(discountValue) || 0)) / 100
    : (Number(discountValue) || 0);
  const netAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (netAfterDiscount * (Number(taxRate) || 0)) / 100;
  const totalPayable = Math.max(0, netAfterDiscount + taxAmount + (Number(shippingFee) || 0));

  // Add line item
  const addItem = () => {
    const newItem: ProductItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      qty: 1,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ProductItem, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Generate new Invoice ID
  const regenerateInvoiceNo = () => {
    setInvoiceNo(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  // Compute QR Payload
  const getQrPayload = () => {
    const formattedAmount = totalPayable.toFixed(2);
    const ref = mfsReference || invoiceNo;

    if (paymentMethod === 'upi') {
      return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName || storeName)}&am=${formattedAmount}&cu=${currency}&tn=${encodeURIComponent(`${storeName} - ${invoiceNo}`)}`;
    }

    if (paymentMethod === 'bkash_nagad') {
      const ussdGuide = mfsProvider === 'bKash' && mfsAccountType === 'Merchant'
        ? `USSD: *247*3*${mfsNumber}*${Math.round(totalPayable)}*${ref}*${mfsCounter}#`
        : `USSD: *247*1*${mfsNumber}*${Math.round(totalPayable)}*${ref}#`;

      return `${mfsProvider} ${mfsAccountType} Payment\nAccount: ${mfsNumber}\nAmount: ${currencySymbol} ${formattedAmount} ${currency}\nReference: ${ref}\nStore: ${storeName}\nInvoice: ${invoiceNo}\n${ussdGuide}`;
    }

    if (paymentMethod === 'bank') {
      return `BANK TRANSFER PAYMENT\nBank: ${bankName}\nAccount Name: ${bankAccountName}\nAccount No: ${bankAccountNumber}\nBranch/Routing: ${bankBranchRouting}\nAmount: ${currencySymbol} ${formattedAmount} ${currency}\nReference: ${invoiceNo}\nStore: ${storeName}`;
    }

    if (paymentMethod === 'weblink') {
      const url = webPayUrl.includes('?')
        ? `${webPayUrl}&amount=${formattedAmount}&currency=${currency}&ref=${encodeURIComponent(invoiceNo)}`
        : `${webPayUrl}?amount=${formattedAmount}&currency=${currency}&ref=${encodeURIComponent(invoiceNo)}`;
      return url;
    }

    if (paymentMethod === 'crypto') {
      return `${cryptoAddress}?amount=${formattedAmount}&label=${encodeURIComponent(storeName)}`;
    }

    return `${storeName} Bill - ${invoiceNo}: ${currencySymbol} ${formattedAmount}`;
  };

  // QR Color mapping
  const getQrColors = () => {
    switch (qrTheme) {
      case 'dark':
        return { dark: '#090909', light: '#FFFFFF' };
      case 'charcoal':
        return { dark: '#262626', light: '#FFFFFF' };
      case 'graphite':
        return { dark: '#404040', light: '#FFFFFF' };
      case 'neutral':
        return { dark: '#525252', light: '#FFFFFF' };
      case 'black':
      default:
        return { dark: '#000000', light: '#FFFFFF' };
    }
  };

  // Re-render QR code whenever relevant parameters change
  useEffect(() => {
    const payload = getQrPayload();
    const colors = getQrColors();

    QRCode.toDataURL(payload, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: colors,
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [
    items,
    taxRate,
    discountType,
    discountValue,
    shippingFee,
    currency,
    paymentMethod,
    mfsProvider,
    mfsAccountType,
    mfsNumber,
    mfsReference,
    mfsCounter,
    upiId,
    upiPayeeName,
    bankName,
    bankAccountName,
    bankAccountNumber,
    bankBranchRouting,
    webPayUrl,
    cryptoAddress,
    storeName,
    invoiceNo,
    qrTheme,
  ]);

  // Download QR Code PNG
  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${storeName.toLowerCase().replace(/\s+/g, '-')}-${invoiceNo.toLowerCase()}-payment-qr.png`;
    a.click();
  };

  // Download QR Code SVG
  const downloadQrSvg = () => {
    const payload = getQrPayload();
    const colors = getQrColors();
    QRCode.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H',
      color: colors,
    }).then((svgString) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNo.toLowerCase()}-payment-qr.svg`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Print Bill / Stand
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp / SMS formatted summary
  const copyFormattedSummary = () => {
    const itemListText = items
      .map((it) => `• ${it.qty}x ${it.name || 'Item'} — ${currencySymbol}${(it.price * it.qty).toLocaleString()}`)
      .join('\n');

    let paymentDetailsText = '';
    if (paymentMethod === 'bkash_nagad') {
      paymentDetailsText = `📱 *Payment via ${mfsProvider} (${mfsAccountType})*\nNumber: \`${mfsNumber}\`\nReference: ${mfsReference || invoiceNo}${
        mfsProvider === 'bKash' && mfsAccountType === 'Merchant' ? `\nCounter: ${mfsCounter}` : ''
      }`;
    } else if (paymentMethod === 'upi') {
      paymentDetailsText = `📲 *UPI Scan & Pay*\nUPI ID: \`${upiId}\`\nPayee: ${upiPayeeName || storeName}`;
    } else if (paymentMethod === 'bank') {
      paymentDetailsText = `🏦 *Bank Transfer*\nBank: ${bankName}\nA/C Name: ${bankAccountName}\nA/C Number: \`${bankAccountNumber}\`\nBranch/Routing: ${bankBranchRouting}`;
    } else if (paymentMethod === 'weblink') {
      paymentDetailsText = `🔗 *Online Payment Link:*\n${webPayUrl}`;
    } else {
      paymentDetailsText = `🪙 *Crypto Wallet:*\n${cryptoNetwork}: \`${cryptoAddress}\``;
    }

    const summary = `🛍️ *${storeName} — Invoice #${invoiceNo}*
📅 Date: ${orderDate}
${customerName ? `👤 Customer: ${customerName}` : ''}
━━━━━━━━━━━━━━━━━━━━
📦 *Products & Services:*
${itemListText}
━━━━━━━━━━━━━━━━━━━━
💵 Subtotal: ${currencySymbol}${subtotal.toLocaleString()}
${discountAmount > 0 ? `🏷️ Discount: -${currencySymbol}${discountAmount.toLocaleString()}` : ''}
${taxAmount > 0 ? `🧾 VAT / Tax (${taxRate}%): +${currencySymbol}${taxAmount.toLocaleString()}` : ''}
${shippingFee > 0 ? `🚚 Delivery / Shipping: +${currencySymbol}${shippingFee.toLocaleString()}` : ''}
💳 *Total Payable: ${currencySymbol}${totalPayable.toLocaleString()} ${currency}*
━━━━━━━━━━━━━━━━━━━━
${paymentDetailsText}

🙏 Thank you for your business!`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Copy raw payload
  const copyRawPayload = () => {
    navigator.clipboard.writeText(getQrPayload());
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Preset Template Loader
  const loadPreset = (preset: 'ecommerce' | 'bkash_counter' | 'upi_retail' | 'freelance' | 'restaurant') => {
    regenerateInvoiceNo();
    setOrderDate(new Date().toISOString().split('T')[0]);

    if (preset === 'ecommerce') {
      setStoreName('Asbily Gadget Hub');
      setCurrency('BDT');
      setItems([
        { id: '1', name: 'Ultra Magnetic Phone Mount', price: 950, qty: 1 },
        { id: '2', name: 'Braided Type-C Fast Cable 2m', price: 420, qty: 2 },
      ]);
      setTaxRate(0);
      setDiscountType('fixed');
      setDiscountValue(100);
      setShippingFee(80);
      setPaymentMethod('bkash_nagad');
      setMfsProvider('bKash');
      setMfsAccountType('Merchant');
      setMfsNumber('01712345678');
      setQrTheme('black');
      setActiveViewTab('stand_card');
    } else if (preset === 'bkash_counter') {
      setStoreName('Chittagong Organic Mart');
      setCurrency('BDT');
      setItems([
        { id: '1', name: 'Sundarban Raw Honey 500g', price: 850, qty: 1 },
        { id: '2', name: 'Extra Virgin Mustard Oil 1L', price: 340, qty: 2 },
      ]);
      setTaxRate(0);
      setDiscountType('fixed');
      setDiscountValue(0);
      setShippingFee(0);
      setPaymentMethod('bkash_nagad');
      setMfsProvider('Nagad');
      setMfsAccountType('Personal');
      setMfsNumber('01888990011');
      setQrTheme('dark');
      setActiveViewTab('stand_card');
    } else if (preset === 'upi_retail') {
      setStoreName('Apex Books & Stationery');
      setCurrency('INR');
      setItems([
        { id: '1', name: 'Hardbound Dotted Notebook A5', price: 299, qty: 2 },
        { id: '2', name: 'Calligraphy Pen Set (12 colors)', price: 499, qty: 1 },
      ]);
      setTaxRate(5);
      setDiscountType('fixed');
      setDiscountValue(50);
      setShippingFee(0);
      setPaymentMethod('upi');
      setUpiId('apexbooks@okaxis');
      setUpiPayeeName('Apex Books');
      setQrTheme('charcoal');
      setActiveViewTab('stand_card');
    } else if (preset === 'freelance') {
      setStoreName('Studio Asbily Creative');
      setCurrency('USD');
      setItems([
        { id: '1', name: 'Landing Page UI/UX Design System', price: 650, qty: 1 },
        { id: '2', name: 'Custom React Web Component Pack', price: 450, qty: 1 },
      ]);
      setTaxRate(0);
      setDiscountType('percentage');
      setDiscountValue(10);
      setShippingFee(0);
      setPaymentMethod('bank');
      setBankName('JPMorgan Chase Bank');
      setBankAccountName('Asbily Creative Studio LLC');
      setBankAccountNumber('48912389102');
      setBankBranchRouting('Routing: 021000021 · SWIFT: CHASUS33');
      setQrTheme('black');
      setActiveViewTab('bill_receipt');
    } else if (preset === 'restaurant') {
      setStoreName('Cafe Horizon & Bistro');
      setCurrency('BDT');
      setItems([
        { id: '1', name: 'Smoked Chicken BBQ Platter', price: 480, qty: 2 },
        { id: '2', name: 'Cold Brew Hazelnut Latte', price: 220, qty: 2 },
        { id: '3', name: 'Chocolate Lava Cake', price: 260, qty: 1 },
      ]);
      setTaxRate(7.5);
      setDiscountType('fixed');
      setDiscountValue(0);
      setShippingFee(0);
      setPaymentMethod('bkash_nagad');
      setMfsProvider('bKash');
      setMfsAccountType('Merchant');
      setMfsNumber('01700112233');
      setQrTheme('graphite');
      setActiveViewTab('stand_card');
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Top Template Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
            1-Click Preset Templates:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => loadPreset('ecommerce')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition cursor-pointer"
          >
            🛒 bKash E-commerce
          </button>
          <button
            onClick={() => loadPreset('bkash_counter')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition cursor-pointer"
          >
            📱 Nagad Mart
          </button>
          <button
            onClick={() => loadPreset('upi_retail')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition cursor-pointer"
          >
            🇮🇳 UPI Scan & Pay
          </button>
          <button
            onClick={() => loadPreset('freelance')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition cursor-pointer"
          >
            💼 Freelance USD Bill
          </button>
          <button
            onClick={() => loadPreset('restaurant')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition cursor-pointer"
          >
            ☕ Cafe / Restaurant
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Store & Order Identity Card */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Store & Order Identity
                </h3>
              </div>
              <button
                onClick={regenerateInvoiceNo}
                className="text-[11px] font-medium text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
                title="Generate new invoice number"
              >
                <RefreshCw className="w-3 h-3" />
                <span>New Invoice #</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Store / Business Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Asbily Store"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Invoice / Bill Number
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="INV-2026-001"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Customer Phone (Optional)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>
            </div>
          </div>

          {/* 2. Product Items & Pricing */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Products & Services List ({items.length})
                </h3>
              </div>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Table of items */}
            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const lineTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder={`Product ${idx + 1} Name / Details`}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-mono">
                            {currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.price || ''}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                            className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-right focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                          />
                        </div>
                      </div>

                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                        />
                      </div>

                      <div className="w-24 text-right font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {currencySymbol}{lineTotal.toLocaleString()}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className={`p-1.5 rounded-lg text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer ${
                          items.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Discount
                </label>
                <div className="flex items-center gap-1">
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
                    className="px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="fixed">{currencySymbol} Flat</option>
                    <option value="percentage">% Off</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Tax / VAT (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Shipping / Delivery ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-right"
                />
              </div>
            </div>

            {/* Total summary strip */}
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-between text-xs font-semibold">
              <span className="text-neutral-600 dark:text-neutral-300">
                Grand Total Payable (সর্বমোট টাকা):
              </span>
              <span className="text-base font-black text-[#000000] dark:text-[#FFFFFF] font-mono">
                {currencySymbol}{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>

          {/* 3. Payment Method & Account Details */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Payment Method & Information
                </h3>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
              <button
                onClick={() => setPaymentMethod('bkash_nagad')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  paymentMethod === 'bkash_nagad'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                <span>bKash / Nagad / MFS</span>
              </button>

              <button
                onClick={() => setPaymentMethod('upi')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                <span>UPI Pay</span>
              </button>

              <button
                onClick={() => setPaymentMethod('bank')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  paymentMethod === 'bank'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                <span>Bank Transfer</span>
              </button>

              <button
                onClick={() => setPaymentMethod('weblink')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  paymentMethod === 'weblink'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                <span>Web / Pay Link</span>
              </button>

              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  paymentMethod === 'crypto'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                <span>Crypto / USDT</span>
              </button>
            </div>

            {/* Provider Form Switcher */}
            {paymentMethod === 'bkash_nagad' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Mobile Wallet Provider
                  </label>
                  <select
                    value={mfsProvider}
                    onChange={(e) => setMfsProvider(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Upay">Upay (উপায়)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={mfsAccountType}
                    onChange={(e) => setMfsAccountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  >
                    <option value="Merchant">Merchant (মার্চেন্ট পেমেন্ট)</option>
                    <option value="Personal">Personal (সেন্ড মানি)</option>
                    <option value="Agent">Agent (ক্যাশ ইন)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    {mfsProvider} Account Number
                  </label>
                  <input
                    type="text"
                    value={mfsNumber}
                    onChange={(e) => setMfsNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Reference Note
                  </label>
                  <input
                    type="text"
                    value={mfsReference}
                    onChange={(e) => setMfsReference(e.target.value)}
                    placeholder={`e.g. ${invoiceNo}`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="store@okaxis"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Payee Name
                  </label>
                  <input
                    type="text"
                    value={upiPayeeName}
                    onChange={(e) => setUpiPayeeName(e.target.value)}
                    placeholder="e.g. Asbily Store"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. City Bank PLC"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="e.g. Asbily Commercial Store"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Branch / Routing / SWIFT
                  </label>
                  <input
                    type="text"
                    value={bankBranchRouting}
                    onChange={(e) => setBankBranchRouting(e.target.value)}
                    placeholder="Gulshan Branch · Routing 225271987"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'weblink' && (
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Payment Link / Web Checkout URL
                </label>
                <input
                  type="url"
                  value={webPayUrl}
                  onChange={(e) => setWebPayUrl(e.target.value)}
                  placeholder="https://tools.asbily.com/pay"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
                />
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Network / Coin
                  </label>
                  <select
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="USDT (TRC20)">USDT (TRC20)</option>
                    <option value="USDT (BEP20)">USDT (BEP20)</option>
                    <option value="USDC (Polygon)">USDC (Polygon)</option>
                    <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                    <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    placeholder="Wallet public address"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive QR Preview & Output Tabs (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <button
              onClick={() => setActiveViewTab('stand_card')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeViewTab === 'stand_card'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              🏪 Counter Stand Card
            </button>
            <button
              onClick={() => setActiveViewTab('bill_receipt')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeViewTab === 'bill_receipt'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              🧾 Digital Bill Slip
            </button>
            <button
              onClick={() => setActiveViewTab('qr_code')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeViewTab === 'qr_code'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              ⚡ Pure QR Code
            </button>
          </div>

          {/* QR Code Style Selector */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="text-neutral-500 font-medium">QR Color Palette:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'black', color: '#000000', name: 'Pure Black' },
                { id: 'dark', color: '#090909', name: 'Dark Ink' },
                { id: 'charcoal', color: '#262626', name: 'Charcoal' },
                { id: 'graphite', color: '#404040', name: 'Graphite' },
                { id: 'neutral', color: '#525252', name: 'Neutral Gray' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setQrTheme(th.id as any)}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    qrTheme === th.id ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: th.color }}
                  title={th.name}
                />
              ))}
            </div>
          </div>

          {/* Card View 1: Retail Counter Table Stand (Pay Here Tent Card) */}
          {activeViewTab === 'stand_card' && (
            <div
              id="printable-stand-card"
              className="p-6 rounded-3xl border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#090909] text-center space-y-4 shadow-xl transition-all"
            >
              {/* Header Store Title */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  SCAN WITH ANY PAYMENT APP
                </div>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {storeName}
                </h2>
                <div className="text-xs text-neutral-500 font-medium">
                  {items.length === 1 ? items[0].name : `${items.length} Product Items · Invoice #${invoiceNo}`}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border border-neutral-100 dark:border-neutral-800">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Payment QR Code"
                    className="w-56 h-56 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-xs text-neutral-400">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Amount Box */}
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                  AMOUNT TO PAY
                </div>
                <div className="text-3xl font-black text-[#000000] dark:text-[#FFFFFF] font-mono tracking-tight">
                  {currencySymbol}{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </div>
              </div>

              {/* Payment Instructions Badge */}
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium space-y-1">
                {paymentMethod === 'bkash_nagad' && (
                  <div>
                    <span className="font-bold">{mfsProvider} ({mfsAccountType}):</span> <span className="font-mono">{mfsNumber}</span>
                    <div className="text-[10px] text-neutral-500">Ref: {mfsReference || invoiceNo}</div>
                  </div>
                )}
                {paymentMethod === 'upi' && (
                  <div>
                    <span className="font-bold">UPI ID:</span> <span className="font-mono">{upiId}</span>
                  </div>
                )}
                {paymentMethod === 'bank' && (
                  <div>
                    <span className="font-bold">{bankName}:</span> <span className="font-mono">{bankAccountNumber}</span>
                  </div>
                )}
                {paymentMethod === 'weblink' && (
                  <div className="truncate font-mono text-[10px]">
                    {webPayUrl}
                  </div>
                )}
                {paymentMethod === 'crypto' && (
                  <div>
                    <span className="font-bold">{cryptoNetwork}:</span>{' '}
                    <span className="font-mono break-all text-[10px]">{cryptoAddress}</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-neutral-400 tracking-wider uppercase pt-1">
                POWERED BY ASBILY FREE TOOLS · 100% PRIVATE & VERIFIED
              </div>
            </div>
          )}

          {/* Card View 2: Detailed Digital Invoice Slip */}
          {activeViewTab === 'bill_receipt' && (
            <div
              id="printable-bill-receipt"
              className="p-5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#090909] text-xs space-y-4 shadow-lg font-sans"
            >
              {/* Receipt Header */}
              <div className="flex items-start justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h3 className="font-black text-base text-neutral-900 dark:text-white">
                    {storeName}
                  </h3>
                  <div className="text-[11px] text-neutral-500 font-mono">Invoice #{invoiceNo}</div>
                  <div className="text-[10px] text-neutral-400">Date: {orderDate}</div>
                </div>
                {customerName && (
                  <div className="text-right text-[11px]">
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">{customerName}</div>
                    {customerPhone && <div className="text-neutral-400 font-mono">{customerPhone}</div>}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Item Description</span>
                  <span>Total</span>
                </div>
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 text-[11px]">
                    <span className="truncate pr-2">
                      {it.qty}x {it.name || 'Item'} (@ {currencySymbol}{it.price})
                    </span>
                    <span className="font-mono font-medium shrink-0">
                      {currencySymbol}{(it.price * it.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Tally */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1 text-[11px]">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                    <span>Discount:</span>
                    <span className="font-mono">-{currencySymbol}{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>VAT / Tax ({taxRate}%):</span>
                    <span className="font-mono">+{currencySymbol}{taxAmount.toLocaleString()}</span>
                  </div>
                )}
                {shippingFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery:</span>
                    <span className="font-mono">+{currencySymbol}{shippingFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-black text-sm text-neutral-900 dark:text-white">
                  <span>Total Payable:</span>
                  <span className="text-[#000000] dark:text-[#FFFFFF] font-mono">
                    {currencySymbol}{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* QR Code and Payment footer */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900/80 rounded-xl flex items-center gap-3 border border-neutral-200 dark:border-neutral-800">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="Scan to Pay"
                    className="w-20 h-20 bg-white p-1 rounded-lg shrink-0"
                  />
                )}
                <div className="text-[10px] space-y-0.5 min-w-0">
                  <div className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    SCAN TO PAY
                  </div>
                  {paymentMethod === 'bkash_nagad' && (
                    <div className="text-neutral-600 dark:text-neutral-400">
                      <div>Method: {mfsProvider} ({mfsAccountType})</div>
                      <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{mfsNumber}</div>
                      <div>Ref: {mfsReference || invoiceNo}</div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="text-neutral-600 dark:text-neutral-400">
                      <div>UPI ID: <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{upiId}</span></div>
                      <div>Payee: {upiPayeeName}</div>
                    </div>
                  )}
                  {paymentMethod === 'bank' && (
                    <div className="text-neutral-600 dark:text-neutral-400">
                      <div>{bankName}</div>
                      <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{bankAccountNumber}</div>
                    </div>
                  )}
                  {paymentMethod === 'weblink' && (
                    <div className="text-neutral-600 dark:text-neutral-400 truncate">
                      {webPayUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Card View 3: Pure High-Res QR Code */}
          {activeViewTab === 'qr_code' && (
            <div className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090909] text-center space-y-4 shadow-md">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Payment QR Code ({currencySymbol}{totalPayable.toFixed(2)})
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Ready to scan with any banking, bKash, UPI, or QR camera app.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border border-neutral-100 dark:border-neutral-800">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="Payment QR Code"
                    className="w-56 h-56 mx-auto object-contain"
                  />
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-left font-mono text-[10px] text-neutral-500 break-all select-all max-h-24 overflow-y-auto">
                {getQrPayload()}
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadQrCode}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={downloadQrSvg}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyFormattedSummary}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] rounded-xl text-xs font-bold hover:bg-[#EDEDED] dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied WhatsApp!' : 'Copy WhatsApp Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Stand / Bill</span>
              </button>
            </div>

            <button
              onClick={copyRawPayload}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              {copiedPayload ? <Check className="w-3 h-3 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPayload ? 'QR Payload Copied' : 'Copy Raw QR Data String'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
