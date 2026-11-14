import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Upload, Plus, Trash2, FileText, Check, Receipt } from 'lucide-react';
import { PdfMergeSplitTool, PdfInspectorProTool, ResumeBuilderTool } from './PdfProTools';

interface PdfToolProps {
  toolId: string;
}

export const PdfDocumentTools: React.FC<PdfToolProps> = ({ toolId }) => {
  if (toolId === 'images-to-pdf') return <ImagesToPdfTool />;
  if (toolId === 'text-to-pdf') return <TextToPdfTool />;
  if (toolId === 'invoice-generator') return <InvoiceGeneratorTool />;
  if (toolId === 'quotation-generator') return <QuotationGeneratorTool />;
  if (toolId === 'pdf-info') return <PdfInspectorProTool />;
  if (toolId === 'pdf-merge-split') return <PdfMergeSplitTool />;
  if (toolId === 'resume-builder') return <ResumeBuilderTool />;

  return <div className="text-neutral-500">PDF tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Images to PDF
// -------------------------------------------------------------
const ImagesToPdfTool: React.FC = () => {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((f) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(f),
      file: f,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImg = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const item = images[i];

        // Load image onto canvas to get standard data URL
        const img = new Image();
        img.src = item.url;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Fit within margins
        const margin = 10;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;

        let w = img.width;
        let h = img.height;
        const ratio = Math.min(maxW / w, maxH / h);
        w = w * ratio;
        h = h * ratio;

        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        doc.addImage(img, 'JPEG', x, y, w, h);
      }

      doc.save('combined-images.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 inline-flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Add Images
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        {images.length > 0 && (
          <button
            onClick={generatePdf}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {generating ? 'Compiling PDF...' : `Download PDF (${images.length} pages)`}
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center text-neutral-400 text-sm">
          No images uploaded yet. Select one or multiple images to merge into a single PDF document.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-[#F6F6F6] dark:bg-[#090909] relative group">
              <div className="h-36 flex items-center justify-center overflow-hidden rounded bg-[#FFFFFF] dark:bg-[#050505]">
                <img src={img.url} alt={`Upload ${idx}`} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mt-2 px-1">
                <span>Page {idx + 1}</span>
                <button onClick={() => removeImg(img.id)} className="text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF]">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Text to PDF
// -------------------------------------------------------------
const TextToPdfTool: React.FC = () => {
  const [title, setTitle] = useState('Document Notes');
  const [content, setContent] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
  const [fontSize, setFontSize] = useState(12);

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title, 20, 20);

    doc.setFontSize(fontSize);
    const splitLines = doc.splitTextToSize(content, 170);
    doc.text(splitLines, 20, 35);

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Document Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Font Size ({fontSize}pt)</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          >
            <option value={10}>10 pt (Small)</option>
            <option value={12}>12 pt (Standard)</option>
            <option value={14}>14 pt (Large)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Document Body Text</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm leading-relaxed"
        />
      </div>

      <button
        onClick={downloadPdf}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg text-sm font-medium hover:opacity-90"
      >
        <Download className="w-4 h-4" />
        Generate & Download PDF
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Professional Invoice Generator
// -------------------------------------------------------------
const InvoiceGeneratorTool: React.FC = () => {
  const [invoiceNum, setInvoiceNum] = useState('INV-2026-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('$');

  const [fromName, setFromName] = useState('Asbily Platforms Inc.');
  const [fromEmail, setFromEmail] = useState('billing@asbily.com');
  const [fromAddress, setFromAddress] = useState('100 Innovation Blvd, Tech Hub');

  const [toName, setToName] = useState('Acme Corporation');
  const [toEmail, setToEmail] = useState('finance@acme.org');
  const [toAddress, setToAddress] = useState('500 Enterprise Way, Suite 400');

  const [items, setItems] = useState([
    { desc: 'Web Application Development', qty: 1, price: 1500 },
    { desc: 'UI/UX Design & Prototyping', qty: 1, price: 600 },
    { desc: 'Cloud Infrastructure Setup', qty: 1, price: 400 },
  ]);

  const [taxPercent, setTaxPercent] = useState(5);
  const [discount, setDiscount] = useState(0);

  const addItem = () => {
    setItems((prev) => [...prev, { desc: 'Consulting Service', qty: 1, price: 100 }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, val: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const subtotal = items.reduce((acc, it) => acc + (it.qty * it.price || 0), 0);
  const taxAmount = (subtotal * (taxPercent || 0)) / 100;
  const total = subtotal + taxAmount - (discount || 0);

  const generatePdf = () => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFontSize(22);
    doc.setTextColor(17, 17, 17);
    doc.text('INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice No: ${invoiceNum}`, 14, 30);
    doc.text(`Date: ${date}`, 14, 36);
    if (dueDate) doc.text(`Due Date: ${dueDate}`, 14, 42);

    // From / To columns
    doc.setFontSize(11);
    doc.setTextColor(17, 17, 17);
    doc.text('From:', 14, 54);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(fromName, 14, 60);
    doc.text(fromEmail, 14, 66);
    doc.text(fromAddress, 14, 72);

    doc.setFontSize(11);
    doc.setTextColor(17, 17, 17);
    doc.text('Billed To:', 120, 54);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(toName, 120, 60);
    doc.text(toEmail, 120, 66);
    doc.text(toAddress, 120, 72);

    // Table Header
    let y = 88;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(17, 17, 17);
    doc.setFontSize(10);
    doc.text('Description', 18, y + 5.5);
    doc.text('Qty', 120, y + 5.5);
    doc.text('Unit Price', 140, y + 5.5);
    doc.text('Amount', 170, y + 5.5);

    // Items rows
    y += 14;
    items.forEach((item) => {
      doc.setTextColor(50, 50, 50);
      doc.text(item.desc, 18, y);
      doc.text(String(item.qty), 122, y);
      doc.text(`${currency}${item.price}`, 142, y);
      doc.text(`${currency}${item.qty * item.price}`, 172, y);
      y += 8;
    });

    // Summary
    y += 10;
    doc.line(14, y, 196, y);
    y += 8;
    doc.text(`Subtotal:`, 140, y);
    doc.text(`${currency}${subtotal.toFixed(2)}`, 172, y);

    if (taxPercent > 0) {
      y += 6;
      doc.text(`Tax (${taxPercent}%):`, 140, y);
      doc.text(`${currency}${taxAmount.toFixed(2)}`, 172, y);
    }

    if (discount > 0) {
      y += 6;
      doc.text(`Discount:`, 140, y);
      doc.text(`-${currency}${discount.toFixed(2)}`, 172, y);
    }

    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(17, 17, 17);
    doc.text(`Total Due:`, 140, y);
    doc.text(`${currency}${total.toFixed(2)}`, 172, y);

    doc.save(`${invoiceNum.toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Invoice #</label>
          <input type="text" value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs">
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="৳">BDT (৳)</option>
            <option value="₹">INR (₹)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Your Details (Seller)</div>
          <input type="text" placeholder="Company Name" value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
          <input type="email" placeholder="Email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
          <input type="text" placeholder="Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Client Details (Buyer)</div>
          <input type="text" placeholder="Client Name" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
          <input type="email" placeholder="Client Email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
          <input type="text" placeholder="Client Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs" />
        </div>
      </div>

      {/* Line Items */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-900 flex justify-between items-center text-xs font-semibold uppercase">
          <span>Invoice Items</span>
          <button onClick={addItem} className="text-xs px-2.5 py-1 bg-white dark:bg-neutral-950 rounded border flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
        <div className="p-4 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Item description"
                value={item.desc}
                onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                className="flex-1 p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                className="w-16 p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-center"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                className="w-24 p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs"
              />
              <div className="w-24 text-xs font-mono font-bold text-right px-2">
                {currency}{(item.qty * item.price).toFixed(2)}
              </div>
              <button onClick={() => removeItem(idx)} className="p-2 text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 bg-[#F6F6F6] dark:bg-[#090909] border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax ({taxPercent}%):</span>
              <input type="number" min={0} max={100} value={taxPercent} onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)} className="w-14 p-1 border rounded text-right text-xs" />
            </div>
            <div className="flex justify-between items-center">
              <span>Discount:</span>
              <input type="number" min={0} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-20 p-1 border rounded text-right text-xs" />
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-sm text-[#000000] dark:text-[#FFFFFF]">
              <span>Total:</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generatePdf}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg text-sm font-medium hover:opacity-90"
      >
        <Download className="w-4 h-4" />
        Download Professional Invoice PDF
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Quotation & Estimate Maker
// -------------------------------------------------------------
const QuotationGeneratorTool: React.FC = () => {
  const [quoteNum, setQuoteNum] = useState('QT-2026-042');
  const [projectTitle, setProjectTitle] = useState('Enterprise Platform Modernization');
  const [client, setClient] = useState('Nexus Retail Group');
  const [amount, setAmount] = useState('4500');
  const [validity, setValidity] = useState('30 Days');
  const [scope, setScope] = useState('1. Architecture design and cloud migration.\n2. Automated CI/CD pipeline setup.\n3. Security auditing and load testing.');

  const downloadQuote = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('PROJECT QUOTATION', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Quotation #: ${quoteNum}`, 14, 30);
    doc.text(`Prepared for: ${client}`, 14, 36);
    doc.text(`Validity: ${validity}`, 14, 42);

    doc.setFontSize(14);
    doc.setTextColor(17, 17, 17);
    doc.text(`Project: ${projectTitle}`, 14, 56);
    doc.text(`Total Estimate: $${amount}`, 14, 64);

    doc.setFontSize(11);
    doc.text('Scope of Work:', 14, 78);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(scope, 170);
    doc.text(lines, 14, 86);

    doc.save(`${quoteNum.toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Quote #</label>
          <input type="text" value={quoteNum} onChange={(e) => setQuoteNum(e.target.value)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Client Name</label>
          <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Estimated Budget ($)</label>
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Project Scope & Deliverables</label>
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          rows={6}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
        />
      </div>

      <button
        onClick={downloadQuote}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg text-sm font-medium hover:opacity-90"
      >
        <Download className="w-4 h-4" />
        Download Project Quotation PDF
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: PDF Inspector & File Details
// -------------------------------------------------------------
const PdfInfoTool: React.FC = () => {
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string; lastModified: string } | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileDetails({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB (${(f.size / (1024 * 1024)).toFixed(2)} MB)`,
        type: f.type || 'application/pdf',
        lastModified: new Date(f.lastModified).toLocaleString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#F6F6F6] dark:hover:bg-[#090909] inline-flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Inspect Local PDF File
        <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      </label>

      {fileDetails && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-[#F6F6F6] dark:bg-[#090909] space-y-2 text-xs font-mono">
          <div>File Name: <strong className="text-[#000000] dark:text-[#FFFFFF]">{fileDetails.name}</strong></div>
          <div>Size: <strong className="text-[#000000] dark:text-[#FFFFFF]">{fileDetails.size}</strong></div>
          <div>MIME Type: <strong className="text-[#000000] dark:text-[#FFFFFF]">{fileDetails.type}</strong></div>
          <div>Last Modified: <strong className="text-[#000000] dark:text-[#FFFFFF]">{fileDetails.lastModified}</strong></div>
        </div>
      )}
    </div>
  );
};
