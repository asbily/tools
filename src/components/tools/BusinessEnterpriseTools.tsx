import React, { useState, useMemo, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Download,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  FileText,
  Clock,
  Package,
  TrendingUp,
  Briefcase,
  FileSignature,
} from 'lucide-react';

const CURRENCIES: Record<string, { symbol: string; label: string }> = {
  BDT: { symbol: 'BDT ', label: 'BDT (৳)' },
  USD: { symbol: '$', label: 'USD ($)' },
  EUR: { symbol: '€', label: 'EUR (€)' },
  GBP: { symbol: '£', label: 'GBP (£)' },
  INR: { symbol: 'INR ', label: 'INR (₹)' },
};

const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const esc = (val: string | number) => {
    const s = String(val ?? '');
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. EMPLOYEE PAYROLL & SALARY SLIP MAKER (PDF)
// ─────────────────────────────────────────────────────────────────────────────
const SalaryPayrollSlipTool: React.FC = () => {
  const [companyName, setCompanyName] = useState('Asbily Technologies Ltd.');
  const [companyAddress, setCompanyAddress] = useState('House 18, Road 4, Banani, Dhaka');
  const [payPeriod, setPayPeriod] = useState(() => {
    const d = new Date();
    return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
  });
  const [empName, setEmpName] = useState('Tariq Mahmud');
  const [empId, setEmpId] = useState('EMP-204');
  const [designation, setDesignation] = useState('Senior Operations Lead');
  const [department, setDepartment] = useState('Operations');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer · **** 4821');
  const [currency, setCurrency] = useState<string>('BDT');

  const [basicSalary, setBasicSalary] = useState(50000);
  const [houseRentPct, setHouseRentPct] = useState(40);
  const [medicalAllowance, setMedicalAllowance] = useState(4500);
  const [transportAllowance, setTransportAllowance] = useState(3000);
  const [overtimeHours, setOvertimeHours] = useState(8);
  const [overtimeRate, setOvertimeRate] = useState(350);
  const [performanceBonus, setPerformanceBonus] = useState(5000);
  const [taxDeduction, setTaxDeduction] = useState(2500);
  const [pfDeduction, setPfDeduction] = useState(2500);
  const [otherDeduction, setOtherDeduction] = useState(0);

  const sym = CURRENCIES[currency]?.symbol || '$';
  const houseRent = useMemo(() => Math.round((basicSalary * houseRentPct) / 100), [basicSalary, houseRentPct]);
  const overtimePay = useMemo(() => Math.round(overtimeHours * overtimeRate), [overtimeHours, overtimeRate]);
  const grossEarnings = basicSalary + houseRent + medicalAllowance + transportAllowance + overtimePay + performanceBonus;
  const totalDeductions = taxDeduction + pfDeduction + otherDeduction;
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName || 'Company Name', 15, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(companyAddress || '', 15, 23);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYSLIP', 195, 16, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pay Period: ${payPeriod}`, 195, 23, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(210, 210, 210);
    doc.setFillColor(246, 246, 246);
    doc.rect(15, 42, 180, 28, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Name:', 19, 50);
    doc.text('Employee ID:', 19, 57);
    doc.text('Designation:', 19, 64);
    doc.text('Department:', 112, 50);
    doc.text('Payment Method:', 112, 57);
    doc.text('Generated:', 112, 64);

    doc.setFont('helvetica', 'normal');
    doc.text(empName, 52, 50);
    doc.text(empId, 52, 57);
    doc.text(designation, 52, 64);
    doc.text(department, 145, 50);
    doc.text(paymentMethod, 145, 57);
    doc.text(new Date().toISOString().split('T')[0], 145, 64);

    let y = 82;
    doc.setFillColor(20, 20, 20);
    doc.rect(15, y, 86, 8, 'F');
    doc.rect(109, y, 86, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('EARNINGS', 19, y + 5.5);
    doc.text('AMOUNT', 97, y + 5.5, { align: 'right' });
    doc.text('DEDUCTIONS', 113, y + 5.5);
    doc.text('AMOUNT', 191, y + 5.5, { align: 'right' });

    y += 13;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const earningsRows: [string, number][] = [
      ['Basic Salary', basicSalary],
      [`House Rent (${houseRentPct}%)`, houseRent],
      ['Medical Allowance', medicalAllowance],
      ['Transport Allowance', transportAllowance],
      [`Overtime (${overtimeHours}h × ${overtimeRate})`, overtimePay],
      ['Performance Bonus', performanceBonus],
    ];
    const deductionRows: [string, number][] = [
      ['Income Tax (TDS)', taxDeduction],
      ['Provident Fund (PF)', pfDeduction],
      ['Other Deductions', otherDeduction],
    ];

    const maxRows = Math.max(earningsRows.length, deductionRows.length);
    for (let i = 0; i < maxRows; i++) {
      if (earningsRows[i]) {
        doc.text(earningsRows[i][0], 19, y);
        doc.text(`${sym}${earningsRows[i][1].toLocaleString()}`, 97, y, { align: 'right' });
      }
      if (deductionRows[i]) {
        doc.text(deductionRows[i][0], 113, y);
        doc.text(`${sym}${deductionRows[i][1].toLocaleString()}`, 191, y, { align: 'right' });
      }
      doc.setDrawColor(235, 235, 235);
      doc.line(15, y + 2.5, 195, y + 2.5);
      y += 9;
    }

    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Gross Earnings', 19, y);
    doc.text(`${sym}${grossEarnings.toLocaleString()}`, 97, y, { align: 'right' });
    doc.text('Total Deductions', 113, y);
    doc.text(`${sym}${totalDeductions.toLocaleString()}`, 191, y, { align: 'right' });

    y += 14;
    doc.setFillColor(10, 10, 10);
    doc.rect(15, y, 180, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('NET SALARY PAYABLE', 21, y + 11);
    doc.setFontSize(15);
    doc.text(`${sym}${netPay.toLocaleString()}`, 189, y + 11.5, { align: 'right' });

    y += 32;
    doc.setTextColor(110, 110, 110);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Employer Signature: _______________________', 15, y);
    doc.text('Employee Signature: _______________________', 195, y, { align: 'right' });
    doc.text('Computer-generated confidential payslip · Processed 100% locally in browser.', 105, 282, { align: 'center' });

    doc.save(`Payslip_${empName.replace(/\s+/g, '_')}_${payPeriod.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Company & Period</div>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Company Address" className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <div className="grid grid-cols-2 gap-2">
            <input value={payPeriod} onChange={(e) => setPayPeriod(e.target.value)} placeholder="Pay Period" className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]">
              {Object.entries(CURRENCIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Employee Details</div>
          <div className="grid grid-cols-2 gap-2">
            <input value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="Employee Name" className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
            <input value={empId} onChange={(e) => setEmpId(e.target.value)} placeholder="Employee ID" className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
            <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" className="p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          </div>
          <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Bank / Payment Method" className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border border-black/10 dark:border-white/10 rounded-xl space-y-3 bg-[#FFFFFF] dark:bg-[#090909]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">Earnings & Allowances</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="text-neutral-500">Basic Salary</span>
              <input type="number" min={0} value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1">
              <span className="text-neutral-500">House Rent (%) → {sym}{houseRent.toLocaleString()}</span>
              <input type="number" min={0} max={100} value={houseRentPct} onChange={(e) => setHouseRentPct(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1">
              <span className="text-neutral-500">Medical Allowance</span>
              <input type="number" min={0} value={medicalAllowance} onChange={(e) => setMedicalAllowance(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1">
              <span className="text-neutral-500">Transport / Conveyance</span>
              <input type="number" min={0} value={transportAllowance} onChange={(e) => setTransportAllowance(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1">
              <span className="text-neutral-500">Overtime Hours</span>
              <input type="number" min={0} value={overtimeHours} onChange={(e) => setOvertimeHours(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1">
              <span className="text-neutral-500">Overtime Rate / hr</span>
              <input type="number" min={0} value={overtimeRate} onChange={(e) => setOvertimeRate(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-neutral-500">Bonus / Commission</span>
              <input type="number" min={0} value={performanceBonus} onChange={(e) => setPerformanceBonus(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
            </label>
          </div>
        </div>

        <div className="p-4 border border-black/10 dark:border-white/10 rounded-xl space-y-4 bg-[#FFFFFF] dark:bg-[#090909] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">Deductions & Summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="space-y-1">
                <span className="text-neutral-500">Income Tax</span>
                <input type="number" min={0} value={taxDeduction} onChange={(e) => setTaxDeduction(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
              </label>
              <label className="space-y-1">
                <span className="text-neutral-500">Provident Fund</span>
                <input type="number" min={0} value={pfDeduction} onChange={(e) => setPfDeduction(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
              </label>
              <label className="space-y-1">
                <span className="text-neutral-500">Advance / Fine</span>
                <input type="number" min={0} value={otherDeduction} onChange={(e) => setOtherDeduction(Number(e.target.value) || 0)} className="w-full p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono" />
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF] space-y-2 border border-white/10">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Gross Earnings</span>
              <span className="font-mono">{sym}{grossEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Total Deductions</span>
              <span className="font-mono">- {sym}{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Net Payable</span>
              <span className="text-2xl font-extrabold font-mono">{sym}{netPay.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full py-3 px-4 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official A4 Salary Slip PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. PURCHASE ORDER (PO) & DELIVERY CHALLAN PDF BUILDER
// ─────────────────────────────────────────────────────────────────────────────
interface PoItem {
  id: string;
  sku: string;
  desc: string;
  qty: number;
  unitPrice: number;
}

const PurchaseOrderMakerTool: React.FC = () => {
  const [docType, setDocType] = useState<'PO' | 'CHALLAN'>('PO');
  const [docNumber, setDocNumber] = useState('PO-2026-0148');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [buyerName, setBuyerName] = useState('Asbily Commerce Solutions');
  const [buyerContact, setBuyerContact] = useState('procurement@asbily.com · +880 1700-000000');
  const [vendorName, setVendorName] = useState('Apex Industrial Supply Co.');
  const [vendorAddress, setVendorAddress] = useState('Plot 42, Tejgaon I/A, Dhaka 1208');
  const [currency, setCurrency] = useState('BDT');
  const [vatPct, setVatPct] = useState(5);
  const [shippingCost, setShippingCost] = useState(500);
  const [notes, setNotes] = useState('Deliver to Loading Dock B during 10 AM - 5 PM. Payment Net 15 upon GRN verification.');

  const [items, setItems] = useState<PoItem[]>([
    { id: '1', sku: 'SKU-401', desc: 'A4 Thermal Shipping Labels (Roll 500)', qty: 20, unitPrice: 450 },
    { id: '2', sku: 'SKU-812', desc: 'Corrugated Heavy Packing Boxes (Medium)', qty: 100, unitPrice: 65 },
  ]);

  const sym = CURRENCIES[currency]?.symbol || '$';
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.qty * it.unitPrice, 0), [items]);
  const vatAmount = useMemo(() => Math.round((subtotal * vatPct) / 100), [subtotal, vatPct]);
  const grandTotal = subtotal + vatAmount + shippingCost;

  const addItem = () =>
    setItems((p) => [...p, { id: String(Date.now()), sku: `SKU-${p.length + 101}`, desc: '', qty: 1, unitPrice: 0 }]);

  const updateItem = (id: string, field: keyof PoItem, val: string | number) =>
    setItems((p) => p.map((it) => (it.id === id ? { ...it, [field]: val } : it)));

  const removeItem = (id: string) => setItems((p) => p.filter((it) => it.id !== id));

  const generatePdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const title = docType === 'PO' ? 'PURCHASE ORDER' : 'DELIVERY CHALLAN';

    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref #: ${docNumber}   |   Date: ${issueDate}`, 15, 24);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(docType === 'PO' ? 'BUYER / ISSUED BY:' : 'DISPATCHED FROM:', 15, 44);
    doc.text(docType === 'PO' ? 'VENDOR / SUPPLIER:' : 'DELIVER TO (CONSIGNEE):', 112, 44);

    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(`${buyerName}\n${buyerContact}`, 85), 15, 50);
    doc.text(doc.splitTextToSize(`${vendorName}\n${vendorAddress}`, 85), 112, 50);

    let y = 72;
    const drawHeader = () => {
      doc.setFillColor(20, 20, 20);
      doc.rect(15, y, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('SKU', 18, y + 5.5);
      doc.text('ITEM DESCRIPTION', 44, y + 5.5);
      doc.text('QTY', 132, y + 5.5, { align: 'right' });
      if (docType === 'PO') {
        doc.text('UNIT COST', 162, y + 5.5, { align: 'right' });
        doc.text('TOTAL', 192, y + 5.5, { align: 'right' });
      }
      y += 13;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    };

    drawHeader();

    items.forEach((it) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
        drawHeader();
      }
      doc.text((it.sku || '-').slice(0, 14), 18, y);
      const descLines = doc.splitTextToSize(it.desc || 'Unnamed Item', 78);
      doc.text(descLines, 44, y);
      doc.text(String(it.qty), 132, y, { align: 'right' });
      if (docType === 'PO') {
        doc.text(`${sym}${it.unitPrice.toLocaleString()}`, 162, y, { align: 'right' });
        doc.text(`${sym}${(it.qty * it.unitPrice).toLocaleString()}`, 192, y, { align: 'right' });
      }
      const step = Math.max(8, descLines.length * 4.5 + 3);
      doc.setDrawColor(235, 235, 235);
      doc.line(15, y + step - 4, 195, y + step - 4);
      y += step;
    });

    if (y > 235) {
      doc.addPage();
      y = 20;
    }

    y += 4;
    if (docType === 'PO') {
      doc.setFontSize(9);
      doc.text('Subtotal:', 140, y);
      doc.text(`${sym}${subtotal.toLocaleString()}`, 192, y, { align: 'right' });
      y += 6;
      doc.text(`VAT / Tax (${vatPct}%):`, 140, y);
      doc.text(`${sym}${vatAmount.toLocaleString()}`, 192, y, { align: 'right' });
      y += 6;
      doc.text('Shipping & Handling:', 140, y);
      doc.text(`${sym}${shippingCost.toLocaleString()}`, 192, y, { align: 'right' });
      y += 8;
      doc.setFillColor(10, 10, 10);
      doc.rect(132, y - 5, 63, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('GRAND TOTAL', 136, y + 1.5);
      doc.text(`${sym}${grandTotal.toLocaleString()}`, 192, y + 1.5, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      y += 14;
    } else {
      const totalUnits = items.reduce((s, i) => s + i.qty, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Packages / Units Dispatched: ${totalUnits}`, 15, y);
      y += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DELIVERY NOTES & TERMS:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(notes, 180), 15, y + 5);

    doc.text('Authorized Signature: _____________________', 15, 276);
    doc.text('Receiver Signature & Stamp: _____________________', 195, 276, { align: 'right' });

    doc.save(`${docType}_${docNumber.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-black/15 dark:border-white/15 p-1 bg-[#F6F6F6] dark:bg-[#050505]">
          {(['PO', 'CHALLAN'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDocType(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                docType === m
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {m === 'PO' ? 'Purchase Order (PO)' : 'Delivery Challan (No Prices)'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="Doc #" className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] font-mono w-36" />
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]">
            {Object.entries(CURRENCIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {docType === 'PO' ? 'Buyer / Issuing Company' : 'Sender / Warehouse'}
          </div>
          <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <input value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {docType === 'PO' ? 'Vendor / Supplier' : 'Consignee / Delivery Address'}
          </div>
          <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <input value={vendorAddress} onChange={(e) => setVendorAddress(e.target.value)} className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Line Items</span>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex flex-col sm:flex-row gap-2 p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909]">
              <input value={it.sku} onChange={(e) => updateItem(it.id, 'sku', e.target.value)} placeholder="SKU" className="sm:w-28 p-2 text-xs font-mono border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
              <input value={it.desc} onChange={(e) => updateItem(it.id, 'desc', e.target.value)} placeholder="Item Description" className="flex-1 p-2 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={it.qty} onChange={(e) => updateItem(it.id, 'qty', Number(e.target.value) || 0)} placeholder="Qty" className="w-20 p-2 text-xs font-mono border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
                {docType === 'PO' && (
                  <input type="number" min={0} value={it.unitPrice} onChange={(e) => updateItem(it.id, 'unitPrice', Number(e.target.value) || 0)} placeholder="Cost" className="w-28 p-2 text-xs font-mono border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
                )}
                <button type="button" onClick={() => removeItem(it.id)} className="p-2 text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer" aria-label="Remove item">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-500 block">Delivery Instructions / Terms</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2.5 text-xs border border-black/15 dark:border-white/15 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]" />
        </div>

        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF] space-y-3">
          {docType === 'PO' ? (
            <>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="space-y-1">
                  <span className="text-neutral-400">VAT / Tax (%)</span>
                  <input type="number" min={0} value={vatPct} onChange={(e) => setVatPct(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-black border border-white/15 text-white font-mono" />
                </label>
                <label className="space-y-1">
                  <span className="text-neutral-400">Shipping Cost</span>
                  <input type="number" min={0} value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-black border border-white/15 text-white font-mono" />
                </label>
              </div>
              <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Total PO Value</span>
                <span className="text-xl font-extrabold font-mono">{sym}{grandTotal.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Total Dispatched Units</span>
              <span className="text-xl font-extrabold font-mono">{items.reduce((s, i) => s + i.qty, 0)} Units</span>
            </div>
          )}

          <button type="button" onClick={generatePdf} className="w-full py-2.5 rounded-xl bg-[#FFFFFF] text-[#000000] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#EDEDED] transition cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Download {docType === 'PO' ? 'Purchase Order' : 'Delivery Challan'} PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. BUSINESS BREAK-EVEN, ROI & RUNWAY CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const BreakEvenRoiCalcTool: React.FC = () => {
  const [fixedCost, setFixedCost] = useState(120000);
  const [unitVariableCost, setUnitVariableCost] = useState(320);
  const [unitPrice, setUnitPrice] = useState(650);
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [monthlyUnitsForecast, setMonthlyUnitsForecast] = useState(550);

  const contributionMargin = unitPrice - unitVariableCost;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : Infinity;
  const breakEvenRevenue = Number.isFinite(breakEvenUnits) ? breakEvenUnits * unitPrice : Infinity;
  const marginRatio = unitPrice > 0 ? ((contributionMargin / unitPrice) * 100).toFixed(1) : '0.0';

  const monthlyRevenue = monthlyUnitsForecast * unitPrice;
  const monthlyTotalCost = fixedCost + monthlyUnitsForecast * unitVariableCost;
  const monthlyNetProfit = monthlyRevenue - monthlyTotalCost;
  const paybackMonths = monthlyNetProfit > 0 ? (initialInvestment / monthlyNetProfit).toFixed(1) : 'N/A';
  const annualRoiPct = initialInvestment > 0 ? (((monthlyNetProfit * 12) / initialInvestment) * 100).toFixed(1) : '0.0';

  // Interactive SVG Chart Points
  const maxUnits = Math.max(100, Number.isFinite(breakEvenUnits) ? breakEvenUnits * 2 : monthlyUnitsForecast * 2, monthlyUnitsForecast * 1.4);
  const maxMoney = Math.max(fixedCost + maxUnits * unitVariableCost, maxUnits * unitPrice, 1);

  const toX = (u: number) => 45 + (u / maxUnits) * 435;
  const toY = (val: number) => 175 - (val / maxMoney) * 145;

  const beX = Number.isFinite(breakEvenUnits) ? toX(breakEvenUnits) : null;
  const beY = Number.isFinite(breakEvenRevenue) ? toY(breakEvenRevenue) : null;

  const exportProjectionCsv = () => {
    const rows: (string | number)[][] = [];
    for (let step = 0; step <= 10; step++) {
      const units = Math.round((maxUnits / 10) * step);
      const rev = units * unitPrice;
      const cost = fixedCost + units * unitVariableCost;
      rows.push([units, rev, cost, rev - cost]);
    }
    downloadCsv('break-even-analysis.csv', ['Units_Sold', 'Total_Revenue', 'Total_Cost', 'Net_Profit_Loss'], rows);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <label className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-1">
          <span className="text-neutral-500 font-medium">Fixed Cost / mo</span>
          <input type="number" min={0} value={fixedCost} onChange={(e) => setFixedCost(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 font-mono font-semibold" />
        </label>
        <label className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-1">
          <span className="text-neutral-500 font-medium">Variable Cost / Unit</span>
          <input type="number" min={0} value={unitVariableCost} onChange={(e) => setUnitVariableCost(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 font-mono font-semibold" />
        </label>
        <label className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-1">
          <span className="text-neutral-500 font-medium">Selling Price / Unit</span>
          <input type="number" min={0} value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 font-mono font-semibold" />
        </label>
        <label className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-1">
          <span className="text-neutral-500 font-medium">Initial CapEx / Investment</span>
          <input type="number" min={0} value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 font-mono font-semibold" />
        </label>
        <label className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-1">
          <span className="text-neutral-500 font-medium">Target Sales (Units/mo)</span>
          <input type="number" min={0} value={monthlyUnitsForecast} onChange={(e) => setMonthlyUnitsForecast(Number(e.target.value) || 0)} className="w-full p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 font-mono font-semibold" />
        </label>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF] border border-white/10">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Break-Even Point</div>
          <div className="text-2xl font-extrabold font-mono mt-1">
            {Number.isFinite(breakEvenUnits) ? `${breakEvenUnits.toLocaleString()} units` : 'Unreachable'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 font-mono">
            {Number.isFinite(breakEvenRevenue) ? `Rev: ${breakEvenRevenue.toLocaleString()}` : 'Price <= Variable Cost'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Contribution Margin</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{contributionMargin.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-mono">{marginRatio}% margin per unit</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Forecast Monthly Profit</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{monthlyNetProfit.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-mono">Rev: {monthlyRevenue.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Annual ROI & Payback</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{annualRoiPct}%</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-mono">Payback: {paybackMonths} mo</div>
        </div>
      </div>

      {/* Monochrome SVG Chart */}
      <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Revenue vs Total Cost Trajectory</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono">
            <span>— Solid: Revenue</span>
            <span>- - Dashed: Total Cost</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 500 200" className="w-full min-w-[340px] h-52 text-[#000000] dark:text-[#FFFFFF]">
            <line x1="45" y1="20" x2="45" y2="175" stroke="currentColor" strokeOpacity="0.2" />
            <line x1="45" y1="175" x2="485" y2="175" stroke="currentColor" strokeOpacity="0.2" />
            <line x1="45" y1={toY(fixedCost)} x2="480" y2={toY(fixedCost)} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 4" />
            {/* Cost Line */}
            <line x1={toX(0)} y1={toY(fixedCost)} x2={toX(maxUnits)} y2={toY(fixedCost + maxUnits * unitVariableCost)} stroke="currentColor" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="6 4" />
            {/* Revenue Line */}
            <line x1={toX(0)} y1={toY(0)} x2={toX(maxUnits)} y2={toY(maxUnits * unitPrice)} stroke="currentColor" strokeWidth="2.5" />
            {beX !== null && beY !== null && beX <= 485 && (
              <g>
                <line x1={beX} y1={beY} x2={beX} y2="175" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" />
                <circle cx={beX} cy={beY} r="5" fill="currentColor" />
                <text x={Math.min(beX + 8, 395)} y={Math.max(beY - 8, 28)} fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  BEP: {breakEvenUnits}u
                </text>
              </g>
            )}
            <text x="12" y="30" fill="currentColor" fontSize="9" opacity="0.6" fontFamily="monospace">High</text>
            <text x="20" y="177" fill="currentColor" fontSize="9" opacity="0.6" fontFamily="monospace">0</text>
            <text x="455" y="190" fill="currentColor" fontSize="9" opacity="0.6" fontFamily="monospace">{Math.round(maxUnits)}u</text>
          </svg>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={exportProjectionCsv} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Table (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. HR SHIFT, ATTENDANCE & OVERTIME TIMESHEET TRACKER
// ─────────────────────────────────────────────────────────────────────────────
interface ShiftEntry {
  id: string;
  employee: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakMins: number;
  hourlyRate: number;
}

const calcShiftStats = (entry: ShiftEntry, regThreshold: number, otMultiplier: number) => {
  const [inH, inM] = entry.clockIn.split(':').map(Number);
  const [outH, outM] = entry.clockOut.split(':').map(Number);
  let totalMins = outH * 60 + outM - (inH * 60 + inM);
  if (totalMins < 0) totalMins += 24 * 60; // night shift wrap
  totalMins = Math.max(0, totalMins - entry.breakMins);
  const totalHrs = totalMins / 60;
  const regularHrs = Math.min(regThreshold, totalHrs);
  const otHrs = Math.max(0, totalHrs - regThreshold);
  const pay = regularHrs * entry.hourlyRate + otHrs * entry.hourlyRate * otMultiplier;
  return { totalHrs, regularHrs, otHrs, pay };
};

const HrTimesheetOvertimeTool: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftEntry[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_hr_timesheets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [clockIn, setClockIn] = useState('09:00');
  const [clockOut, setClockOut] = useState('18:30');
  const [breakMins, setBreakMins] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(400);
  const [regThreshold, setRegThreshold] = useState(8);
  const [otMultiplier, setOtMultiplier] = useState(1.5);

  useEffect(() => {
    try {
      localStorage.setItem('asbily_hr_timesheets', JSON.stringify(shifts));
    } catch {
      // ignore quota errors
    }
  }, [shifts]);

  const addShift = () => {
    if (!employee.trim()) return;
    setShifts((p) => [
      { id: String(Date.now()), employee: employee.trim(), date, clockIn, clockOut, breakMins, hourlyRate },
      ...p,
    ]);
    setEmployee('');
  };

  const totals = useMemo(() => {
    return shifts.reduce(
      (acc, s) => {
        const st = calcShiftStats(s, regThreshold, otMultiplier);
        return {
          hours: acc.hours + st.totalHrs,
          otHours: acc.otHours + st.otHrs,
          pay: acc.pay + st.pay,
        };
      },
      { hours: 0, otHours: 0, pay: 0 }
    );
  }, [shifts, regThreshold, otMultiplier]);

  const handleExport = () => {
    const rows = shifts.map((s) => {
      const st = calcShiftStats(s, regThreshold, otMultiplier);
      return [s.employee, s.date, s.clockIn, s.clockOut, s.breakMins, st.totalHrs.toFixed(2), st.otHrs.toFixed(2), st.pay.toFixed(2)];
    });
    downloadCsv('hr-timesheet-overtime.csv', ['Employee', 'Date', 'Clock_In', 'Clock_Out', 'Break_Mins', 'Worked_Hours', 'OT_Hours', 'Gross_Pay'], rows);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF]">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Total Worked Hours</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{totals.hours.toFixed(2)} hrs</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Overtime Hours</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{totals.otHours.toFixed(2)} hrs</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Calculated Payroll</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{Math.round(totals.pay).toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Log Employee Shift</span>
          <div className="flex items-center gap-3 text-[11px]">
            <label className="flex items-center gap-1.5">
              <span className="text-neutral-500">Regular Limit (h):</span>
              <input type="number" min={1} max={16} value={regThreshold} onChange={(e) => setRegThreshold(Number(e.target.value) || 8)} className="w-14 p-1 rounded border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-neutral-500">OT Multiplier:</span>
              <input type="number" step="0.25" min={1} value={otMultiplier} onChange={(e) => setOtMultiplier(Number(e.target.value) || 1.5)} className="w-16 p-1 rounded border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-xs">
          <input value={employee} onChange={(e) => setEmployee(e.target.value)} placeholder="Employee / Task Name" className="lg:col-span-2 p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909]" />
          <div className="grid grid-cols-2 gap-1.5">
            <input type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <input type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <input type="number" min={0} value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value) || 0)} placeholder="Break m" title="Unpaid Break (mins)" className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <input type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value) || 0)} placeholder="Rate/h" title="Hourly Rate" className="p-2 border border-black/15 dark:border-white/15 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          </div>
          <button type="button" onClick={addShift} className="p-2.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Log Shift
          </button>
        </div>
      </div>

      {shifts.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export Timesheet CSV
          </button>
        </div>
      )}

      <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[600px]">
          <thead className="bg-[#F6F6F6] dark:bg-[#050505] border-b border-black/10 dark:border-white/10 text-neutral-500">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time (Break)</th>
              <th className="p-3 text-right">Hours</th>
              <th className="p-3 text-right">Overtime</th>
              <th className="p-3 text-right">Pay</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {shifts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">No shift logs recorded yet. Add an employee shift above.</td>
              </tr>
            ) : (
              shifts.map((s) => {
                const st = calcShiftStats(s, regThreshold, otMultiplier);
                return (
                  <tr key={s.id} className="hover:bg-[#F6F6F6] dark:hover:bg-white/[0.03]">
                    <td className="p-3 font-semibold">{s.employee}</td>
                    <td className="p-3 font-mono text-neutral-500">{s.date}</td>
                    <td className="p-3 font-mono">{s.clockIn} – {s.clockOut} ({s.breakMins}m)</td>
                    <td className="p-3 text-right font-mono">{st.totalHrs.toFixed(2)}h</td>
                    <td className="p-3 text-right font-mono font-semibold">{st.otHrs.toFixed(2)}h</td>
                    <td className="p-3 text-right font-mono font-bold">{Math.round(st.pay).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => setShifts((p) => p.filter((x) => x.id !== s.id))} className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer" aria-label="Delete shift">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. BUSINESS NDA, OFFER LETTER & SERVICE CONTRACT GENERATOR (PDF)
// ─────────────────────────────────────────────────────────────────────────────
type ContractType = 'nda' | 'offer' | 'service' | 'reminder';

const ContractNdaGeneratorTool: React.FC = () => {
  const [template, setTemplate] = useState<ContractType>('nda');
  const [partyA, setPartyA] = useState('Asbily Platforms Ltd.');
  const [partyB, setPartyB] = useState('Nadia Rahman');
  const [roleOrScope, setRoleOrScope] = useState('Full-Stack Web Platform Architecture & UI Modernization');
  const [compensation, setCompensation] = useState('BDT 95,000 / month (or Total Contract Fee)');
  const [jurisdiction, setJurisdiction] = useState('Dhaka, Bangladesh');
  const [effectiveDate, setEffectiveDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
    switch (template) {
      case 'nda':
        return `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

Effective Date: ${effectiveDate}

1. PARTIES
This Mutual Non-Disclosure Agreement ("Agreement") is entered into between ${partyA} ("First Party") and ${partyB} ("Second Party").

2. PURPOSE
The parties wish to explore a business and technical collaboration regarding: ${roleOrScope}, during which Confidential Information may be disclosed.

3. CONFIDENTIAL INFORMATION
"Confidential Information" includes source code, client lists, pricing structures, trade secrets, product roadmaps, financial data, and proprietary documents shared in written, digital, or oral form.

4. OBLIGATIONS
Each receiving party agrees to:
(a) Hold all Confidential Information in strict confidence for a period of three (3) years;
(b) Not disclose such information to third parties without prior written authorization;
(c) Use Confidential Information solely for evaluating and executing ${roleOrScope}.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}.

IN WITNESS WHEREOF, the parties execute this Agreement on ${effectiveDate}.

For ${partyA}: ___________________________
For ${partyB}: ___________________________`;

      case 'offer':
        return `FORMAL EMPLOYMENT OFFER LETTER

Date: ${effectiveDate}

Dear ${partyB},

On behalf of ${partyA}, we are delighted to extend a formal offer of employment for the position of:
Role / Position: ${roleOrScope}

1. COMPENSATION & BENEFITS
Gross Compensation: ${compensation}
Compensation is payable monthly via bank transfer subject to applicable statutory tax withholdings.

2. COMMENCEMENT & LOCATION
Effective Start Date: ${effectiveDate}
Primary Location / Jurisdiction: ${jurisdiction}

3. PROBATION & CONFIDENTIALITY
This offer is subject to a standard three (3) month review period and execution of company confidentiality and intellectual property guidelines.

Please sign below to confirm acceptance of this offer.

Sincerely,
Authorized Signatory, ${partyA}

Candidate Acceptance (${partyB}): ___________________________   Date: _______________`;

      case 'service':
        return `FREELANCE & VENDOR SERVICE AGREEMENT

Date: ${effectiveDate}

This Service Agreement is made between ${partyA} ("Client") and ${partyB} ("Service Provider").

1. SCOPE OF SERVICES
The Service Provider agrees to deliver the following work professionally:
${roleOrScope}

2. FEES & PAYMENT TERMS
Agreed Fee: ${compensation}
Client shall remit 50% upfront upon kickoff and 50% upon final deliverable sign-off.

3. INTELLECTUAL PROPERTY
Upon receipt of full payment, all custom deliverables and source assets produced under this engagement transfer exclusively to ${partyA}.

4. DISPUTE RESOLUTION
Both parties agree to resolve disputes amicably under the jurisdiction of ${jurisdiction}.

Client Signature (${partyA}): ___________________________
Provider Signature (${partyB}): ___________________________`;

      case 'reminder':
        return `FORMAL PAYMENT OVERDUE NOTICE

Date: ${effectiveDate}
Jurisdiction: ${jurisdiction}

To: ${partyB}
From: ${partyA}

Subject: Payment Reminder — ${roleOrScope}

Dear ${partyB},

Our accounting records indicate that an outstanding balance of ${compensation} relating to "${roleOrScope}" remains unpaid past its scheduled due date.

If payment has already been initiated, kindly share the transaction receipt so we may reconcile your ledger immediately. Otherwise, please arrange settlement within five (5) business days to prevent service interruption or late-fee accrual.

Thank you for your prompt attention to this matter.

Accounts Receivable Department
${partyA}`;
    }
  }, [template, partyA, partyB, roleOrScope, compensation, jurisdiction, effectiveDate]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(documentText, 176);
    let y = 20;
    lines.forEach((line: string) => {
      if (y > 278) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 17, y);
      y += 5.5;
    });
    doc.save(`${template.toUpperCase()}_${partyB.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'nda', label: 'Mutual NDA' },
          { id: 'offer', label: 'Job Offer Letter' },
          { id: 'service', label: 'Service Contract' },
          { id: 'reminder', label: 'Payment Reminder' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id as ContractType)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              template === t.id
                ? 'bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
                : 'bg-[#F6F6F6] dark:bg-[#050505] border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Company / First Party</span>
          <input value={partyA} onChange={(e) => setPartyA(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Counterparty / Recipient</span>
          <input value={partyB} onChange={(e) => setPartyB(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Effective Date</span>
          <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-neutral-500 font-medium">Role / Project Scope / Invoice Reference</span>
          <input value={roleOrScope} onChange={(e) => setRoleOrScope(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Jurisdiction / City</span>
          <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
        <label className="space-y-1 sm:col-span-3">
          <span className="text-neutral-500 font-medium">Compensation / Amount</span>
          <input value={compensation} onChange={(e) => setCompensation(e.target.value)} className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-[#F6F6F6] dark:bg-[#050505]" />
        </label>
      </div>

      <div className="p-5 rounded-xl border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <FileSignature className="w-4 h-4" /> Legal Document Preview
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCopy} className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#090909] cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button type="button" onClick={handleDownloadPdf} className="px-3.5 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-[#000000] dark:text-[#EDEDED] bg-[#FFFFFF] dark:bg-[#090909] p-4 sm:p-6 rounded-xl border border-black/10 dark:border-white/10">
          {documentText}
        </pre>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SHOP & WAREHOUSE INVENTORY / SKU STOCK MANAGER
// ─────────────────────────────────────────────────────────────────────────────
interface StockSku {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  reorderLevel: number;
  buyCost: number;
  sellPrice: number;
}

const InventoryStockManagerTool: React.FC = () => {
  const [items, setItems] = useState<StockSku[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_inventory_skus');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [qty, setQty] = useState(10);
  const [reorderLevel, setReorderLevel] = useState(5);
  const [buyCost, setBuyCost] = useState(250);
  const [sellPrice, setSellPrice] = useState(400);

  useEffect(() => {
    try {
      localStorage.setItem('asbily_inventory_skus', JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addSku = () => {
    if (!name.trim()) return;
    setItems((p) => [
      {
        id: String(Date.now()),
        sku: sku.trim() || `SKU-${p.length + 101}`,
        name: name.trim(),
        category: category.trim() || 'General',
        qty: Math.max(0, qty),
        reorderLevel: Math.max(0, reorderLevel),
        buyCost: Math.max(0, buyCost),
        sellPrice: Math.max(0, sellPrice),
      },
      ...p,
    ]);
    setSku('');
    setName('');
  };

  const adjustQty = (id: string, delta: number) => {
    setItems((p) => p.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((it) => {
      const matchesQ = !q || it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
      const matchesLow = !lowStockOnly || it.qty <= it.reorderLevel;
      return matchesQ && matchesLow;
    });
  }, [items, search, lowStockOnly]);

  const metrics = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        units: acc.units + it.qty,
        costVal: acc.costVal + it.qty * it.buyCost,
        retailVal: acc.retailVal + it.qty * it.sellPrice,
        lowCount: acc.lowCount + (it.qty <= it.reorderLevel ? 1 : 0),
      }),
      { units: 0, costVal: 0, retailVal: 0, lowCount: 0 }
    );
  }, [items]);

  const handleExportCsv = () => {
    downloadCsv(
      'warehouse-inventory.csv',
      ['SKU', 'Product_Name', 'Category', 'Qty', 'Reorder_Level', 'Buy_Cost', 'Sell_Price', 'Stock_Cost_Value', 'Potential_Profit'],
      items.map((it) => [it.sku, it.name, it.category, it.qty, it.reorderLevel, it.buyCost, it.sellPrice, it.qty * it.buyCost, it.qty * (it.sellPrice - it.buyCost)])
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF]">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Inventory Cost Value</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1">{metrics.costVal.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-400 mt-1">{metrics.units.toLocaleString()} total units</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Retail Stock Value</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1">{metrics.retailVal.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Projected Margin</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1">{(metrics.retailVal - metrics.costVal).toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Low Stock Alerts</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1">{metrics.lowCount} SKUs</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" /> Add Product / SKU
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 text-xs">
          <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU Code" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="lg:col-span-2 p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <div className="grid grid-cols-2 gap-1.5">
            <input type="number" min={0} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} title="Initial Stock Qty" placeholder="Qty" className="p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <input type="number" min={0} value={reorderLevel} onChange={(e) => setReorderLevel(Number(e.target.value) || 0)} title="Low Stock Alert Threshold" placeholder="Alert" className="p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <input type="number" min={0} value={buyCost} onChange={(e) => setBuyCost(Number(e.target.value) || 0)} title="Buy Cost" placeholder="Buy" className="p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <input type="number" min={0} value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value) || 0)} title="Sell Price" placeholder="Sell" className="p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          </div>
          <button type="button" onClick={addSku} className="p-2.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-semibold flex items-center justify-center gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add SKU
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by SKU or product..." className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505]" />
          </div>
          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
              lowStockOnly
                ? 'bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
                : 'border-black/15 dark:border-white/15 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Low Stock Only ({metrics.lowCount})
          </button>
        </div>

        {items.length > 0 && (
          <button type="button" onClick={handleExportCsv} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </div>

      <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[650px]">
          <thead className="bg-[#F6F6F6] dark:bg-[#050505] border-b border-black/10 dark:border-white/10 text-neutral-500">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Product</th>
              <th className="p-3">Stock Control</th>
              <th className="p-3 text-right">Buy / Sell</th>
              <th className="p-3 text-right">Stock Value</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400">No inventory SKUs match your view. Add items above to track warehouse stock.</td>
              </tr>
            ) : (
              filtered.map((it) => {
                const isLow = it.qty <= it.reorderLevel;
                return (
                  <tr key={it.id} className="hover:bg-[#F6F6F6] dark:hover:bg-white/[0.03]">
                    <td className="p-3 font-mono font-semibold">{it.sku}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{it.name}</div>
                      <div className="text-[11px] text-neutral-500">
                        {it.category} {isLow && <span className="ml-1 font-bold text-[#000000] dark:text-[#FFFFFF] underline">· LOW STOCK</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-2 border border-black/15 dark:border-white/15 rounded-lg px-1.5 py-1 bg-[#FFFFFF] dark:bg-[#090909]">
                        <button type="button" onClick={() => adjustQty(it.id, -1)} className="w-6 h-6 rounded bg-[#F6F6F6] dark:bg-[#050505] font-bold hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] cursor-pointer">-</button>
                        <span className="w-8 text-center font-mono font-bold">{it.qty}</span>
                        <button type="button" onClick={() => adjustQty(it.id, 1)} className="w-6 h-6 rounded bg-[#F6F6F6] dark:bg-[#050505] font-bold hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] cursor-pointer">+</button>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">{it.buyCost.toLocaleString()} / {it.sellPrice.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold">{(it.qty * it.buyCost).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer" aria-label="Delete SKU">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export const BusinessEnterpriseTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  switch (toolId) {
    case 'salary-payroll-slip':
      return <SalaryPayrollSlipTool />;
    case 'purchase-order-maker':
      return <PurchaseOrderMakerTool />;
    case 'break-even-roi-calc':
      return <BreakEvenRoiCalcTool />;
    case 'hr-timesheet-overtime':
      return <HrTimesheetOvertimeTool />;
    case 'contract-nda-generator':
      return <ContractNdaGeneratorTool />;
    case 'inventory-stock-manager':
      return <InventoryStockManagerTool />;
    default:
      return (
        <div className="p-6 text-xs text-neutral-500 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>Select a business enterprise tool.</span>
        </div>
      );
  }
};
