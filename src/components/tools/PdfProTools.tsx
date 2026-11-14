import React, { useState, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import {
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Plus,
  RotateCw,
  Scissors,
  Combine,
} from 'lucide-react';

// -------------------------------------------------------------
// 1. Real PDF Merger, Splitter & Rotator (powered by pdf-lib)
// -------------------------------------------------------------
interface QueuedPdf {
  id: string;
  file: File;
  pageCount: number;
}

export const PdfMergeSplitTool: React.FC = () => {
  const [mode, setMode] = useState<'merge' | 'split'>('merge');

  // Merge state
  const [pdfs, setPdfs] = useState<QueuedPdf[]>([]);
  const [merging, setMerging] = useState(false);

  // Split / Rotate state
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singlePages, setSinglePages] = useState(0);
  const [pageRange, setPageRange] = useState('1-2');
  const [rotateDeg, setRotateDeg] = useState<0 | 90 | 180 | 270>(0);
  const [splitting, setSplitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddMergePdfs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const files = Array.from(e.target.files || []);
    const loaded: QueuedPdf[] = [];
    for (const f of files) {
      try {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        loaded.push({
          id: `${Date.now()}-${Math.random()}`,
          file: f,
          pageCount: doc.getPageCount(),
        });
      } catch {
        setErrorMsg(`Could not load "${f.name}". Make sure it is a valid PDF.`);
      }
    }
    setPdfs((prev) => [...prev, ...loaded]);
  };

  const movePdf = (index: number, dir: -1 | 1) => {
    const next = [...pdfs];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setPdfs(next);
  };

  const mergeAndDownload = async () => {
    if (pdfs.length < 2) return;
    setMerging(true);
    setErrorMsg('');
    try {
      const merged = await PDFDocument.create();
      for (const item of pdfs) {
        const bytes = await item.file.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const outBytes = await merged.save();
      const blob = new Blob([outBytes.slice().buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'asbily-merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Failed to merge one of the PDFs. Check if it is password-protected.');
    } finally {
      setMerging(false);
    }
  };

  const handleSinglePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const count = doc.getPageCount();
      setSingleFile(f);
      setSinglePages(count);
      setPageRange(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch {
      setErrorMsg('Could not read PDF file. Ensure it is a valid unencrypted PDF.');
    }
  };

  const parsePageIndices = (rangeStr: string, total: number): number[] => {
    const indices = new Set<number>();
    const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = Math.max(1, parseInt(startStr, 10) || 1);
        const end = Math.min(total, parseInt(endStr, 10) || total);
        for (let p = start; p <= end; p++) indices.add(p - 1);
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= total) indices.add(p - 1);
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const splitAndDownload = async () => {
    if (!singleFile) return;
    setSplitting(true);
    setErrorMsg('');
    try {
      const src = await PDFDocument.load(await singleFile.arrayBuffer(), { ignoreEncryption: true });
      const indices = parsePageIndices(pageRange, src.getPageCount());
      if (indices.length === 0) {
        setErrorMsg(`Please enter valid page numbers between 1 and ${singlePages}.`);
        setSplitting(false);
        return;
      }
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => {
        if (rotateDeg !== 0) {
          p.setRotation(degrees(p.getRotation().angle + rotateDeg));
        }
        out.addPage(p);
      });
      const outBytes = await out.save();
      const blob = new Blob([outBytes.slice().buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asbily-extracted-${singleFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Error processing PDF pages.');
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setMode('merge')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            mode === 'merge' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500'
          }`}
        >
          <Combine className="w-3.5 h-3.5" />
          <span>Merge PDFs</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('split')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            mode === 'split' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Split / Extract & Rotate</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] border border-black/15 dark:border-white/15 text-xs text-[#000000] dark:text-[#FFFFFF]">
          {errorMsg}
        </div>
      )}

      {mode === 'merge' ? (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F6F6F6] dark:hover:bg-white/5 transition">
            <Upload className="w-7 h-7 text-[#000000] dark:text-[#FFFFFF] mb-2" />
            <span className="text-sm font-semibold">Select 2 or more PDF files to combine</span>
            <span className="text-xs text-neutral-400 mt-1">Merged locally inside your browser — zero uploads</span>
            <input type="file" multiple accept="application/pdf" onChange={handleAddMergePdfs} className="hidden" />
          </label>

          {pdfs.length > 0 && (
            <div className="space-y-3">
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                {pdfs.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 text-xs bg-white dark:bg-[#090909]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-neutral-400 w-5">{idx + 1}.</span>
                      <FileText className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF] shrink-0" />
                      <span className="font-medium truncate">{item.file.name}</span>
                      <span className="text-neutral-400 tabular-nums shrink-0">({item.pageCount} pages)</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => movePdf(idx, -1)} className="p-1 hover:bg-[#F6F6F6] dark:hover:bg-white/10 rounded cursor-pointer" title="Move Up">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => movePdf(idx, 1)} className="p-1 hover:bg-[#F6F6F6] dark:hover:bg-white/10 rounded cursor-pointer" title="Move Down">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setPdfs((p) => p.filter((x) => x.id !== item.id))} className="p-1 text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 rounded cursor-pointer" title="Remove">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={mergeAndDownload}
                disabled={pdfs.length < 2 || merging}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{merging ? 'Merging PDFs...' : `Merge ${pdfs.length} PDFs & Download`}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F6F6F6] dark:hover:bg-white/5 transition">
            <Upload className="w-7 h-7 text-[#000000] dark:text-[#FFFFFF] mb-2" />
            <span className="text-sm font-semibold">
              {singleFile ? `${singleFile.name} (${singlePages} pages)` : 'Select a PDF file to extract or rotate pages'}
            </span>
            <input type="file" accept="application/pdf" onChange={handleSinglePdfUpload} className="hidden" />
          </label>

          {singleFile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                  Pages to Extract (1–{singlePages})
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-[#090909] text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                  Rotate Pages
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {([0, 90, 180, 270] as const).map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotateDeg(deg)}
                      className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer flex items-center justify-center gap-1 ${
                        rotateDeg === deg
                          ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                          : 'bg-white dark:bg-[#090909] border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{deg}°</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={splitAndDownload}
                  disabled={splitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{splitting ? 'Processing...' : 'Extract & Download PDF'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. Real Upgraded PDF Inspector (powered by pdf-lib)
// -------------------------------------------------------------
export const PdfInspectorProTool: React.FC = () => {
  const [info, setInfo] = useState<{
    name: string;
    sizeKb: string;
    pages: number;
    pageSize: string;
    title: string;
    author: string;
    creator: string;
    producer: string;
    created: string;
  } | null>(null);
  const [err, setErr] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr('');
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const pages = doc.getPages();
      const first = pages[0];
      const { width, height } = first ? first.getSize() : { width: 0, height: 0 };
      const mmW = (width * 0.352778).toFixed(0);
      const mmH = (height * 0.352778).toFixed(0);

      setInfo({
        name: f.name,
        sizeKb: `${(f.size / 1024).toFixed(1)} KB (${(f.size / (1024 * 1024)).toFixed(2)} MB)`,
        pages: doc.getPageCount(),
        pageSize: `${Math.round(width)} × ${Math.round(height)} pt (${mmW} × ${mmH} mm)`,
        title: doc.getTitle() || 'Not specified',
        author: doc.getAuthor() || 'Not specified',
        creator: doc.getCreator() || 'Not specified',
        producer: doc.getProducer() || 'Not specified',
        created: doc.getCreationDate()?.toLocaleString() || 'Not specified',
      });
    } catch {
      setErr('Failed to parse PDF metadata. Ensure the file is a valid PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <label className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#F6F6F6] dark:hover:bg-white/10 inline-flex items-center gap-2">
        <Upload className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
        <span>Inspect Local PDF File</span>
        <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      </label>

      {err && <div className="text-xs text-[#000000] dark:text-[#FFFFFF]">{err}</div>}

      {info && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-xs">
          {[
            ['File Name', info.name],
            ['Exact Page Count', String(info.pages)],
            ['Page Dimensions', info.pageSize],
            ['File Size', info.sizeKb],
            ['Document Title', info.title],
            ['Author', info.author],
            ['Creator App', info.creator],
            ['PDF Producer', info.producer],
            ['Created Date', info.created],
          ].map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200/70 dark:border-neutral-800">
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">{k}</div>
              <div className="font-mono tabular-nums mt-0.5 break-all font-medium">{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. ATS Resume & CV Builder with Live Preview + PDF Export
// -------------------------------------------------------------
interface ExpItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string;
}

interface EduItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export const ResumeBuilderTool: React.FC = () => {
  const [fullName, setFullName] = useState(() => localStorage.getItem('asbily_cv_name') || 'Tariq Hasan');
  const [headline, setHeadline] = useState('Full-Stack Software Engineer');
  const [email, setEmail] = useState('tariq@example.com');
  const [phone, setPhone] = useState('+880 1700-000000');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [summary, setSummary] = useState(
    'Product-focused software engineer with 4+ years building fast web applications, scalable APIs, and responsive user interfaces.'
  );
  const [skills, setSkills] = useState('TypeScript, React, Next.js, Node.js, PostgreSQL, Tailwind CSS, Docker');

  const [experiences, setExperiences] = useState<ExpItem[]>([
    {
      id: '1',
      role: 'Senior Frontend Engineer',
      company: 'Apex Digital Ltd.',
      period: '2024 – Present',
      bullets: 'Led architecture migration to React 19 and TypeScript, reducing bundle size by 32%.\nBuilt accessible design system components used across 6 product teams.',
    },
  ]);

  const [education, setEducation] = useState<EduItem[]>([
    {
      id: '1',
      degree: 'B.Sc. in Computer Science & Engineering',
      school: 'Dhaka University of Engineering',
      year: '2022',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('asbily_cv_name', fullName);
  }, [fullName]);

  const exportCvPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 18;
    const margin = 16;
    const maxW = 178;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(fullName, margin, y);
    y += 6.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(82, 82, 82);
    doc.text(headline, margin, y);
    y += 5.5;

    doc.setFontSize(9.5);
    doc.setTextColor(115, 115, 115);
    doc.text(`${email}  |  ${phone}  |  ${location}`, margin, y);
    y += 4;

    doc.setDrawColor(237, 237, 237);
    doc.line(margin, y, margin + maxW, y);
    y += 7;

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const sumLines = doc.splitTextToSize(summary, maxW);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 4.5 + 5;

    // Experience
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('EXPERIENCE', margin, y);
    y += 5.5;

    experiences.forEach((exp) => {
      if (y > 265) {
        doc.addPage();
        y = 18;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.role} — ${exp.company}`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.period, margin + maxW, y, { align: 'right' });
      y += 4.5;

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9.5);
      exp.bullets.split('\n').filter(Boolean).forEach((b) => {
        const bLines = doc.splitTextToSize(`• ${b}`, maxW - 3);
        doc.text(bLines, margin + 2, y);
        y += bLines.length * 4.3;
      });
      y += 3;
    });

    // Education
    if (y > 255) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('EDUCATION', margin, y);
    y += 5.5;

    education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(edu.degree, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(edu.year, margin + maxW, y, { align: 'right' });
      y += 4.5;
      doc.setTextColor(51, 65, 85);
      doc.text(edu.school, margin, y);
      y += 6;
    });

    // Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('SKILLS', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const skLines = doc.splitTextToSize(skills, maxW);
    doc.text(skLines, margin, y);

    doc.save(`${fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950" />
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Job Title" className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950" />
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950" />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="sm:col-span-2 p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Summary</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-xs" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Experience</span>
            <button
              type="button"
              onClick={() => setExperiences((e) => [...e, { id: String(Date.now()), role: 'Role', company: 'Company', period: '2025', bullets: 'Key achievement...' }])}
              className="text-xs text-[#000000] dark:text-[#FFFFFF] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={exp.role} onChange={(e) => setExperiences((arr) => arr.map((x, i) => (i === idx ? { ...x, role: e.target.value } : x)))} placeholder="Role" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
                <input type="text" value={exp.company} onChange={(e) => setExperiences((arr) => arr.map((x, i) => (i === idx ? { ...x, company: e.target.value } : x)))} placeholder="Company" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
                <input type="text" value={exp.period} onChange={(e) => setExperiences((arr) => arr.map((x, i) => (i === idx ? { ...x, period: e.target.value } : x)))} placeholder="Period" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
              </div>
              <textarea value={exp.bullets} onChange={(e) => setExperiences((arr) => arr.map((x, i) => (i === idx ? { ...x, bullets: e.target.value } : x)))} rows={2} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Education</span>
            <button
              type="button"
              onClick={() => setEducation((ed) => [...ed, { id: String(Date.now()), degree: 'Degree', school: 'University', year: '2024' }])}
              className="text-xs text-[#000000] dark:text-[#FFFFFF] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>
          {education.map((edu, idx) => (
            <div key={edu.id} className="grid grid-cols-3 gap-2 text-xs">
              <input type="text" value={edu.degree} onChange={(e) => setEducation((arr) => arr.map((x, i) => (i === idx ? { ...x, degree: e.target.value } : x)))} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
              <input type="text" value={edu.school} onChange={(e) => setEducation((arr) => arr.map((x, i) => (i === idx ? { ...x, school: e.target.value } : x)))} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
              <input type="text" value={edu.year} onChange={(e) => setEducation((arr) => arr.map((x, i) => (i === idx ? { ...x, year: e.target.value } : x)))} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-[#090909]" />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Skills (Comma separated)</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-[#090909] text-xs" />
        </div>
      </div>

      {/* Live A4 Preview & Export */}
      <div className="space-y-4">
        <div className="p-6 rounded-xl border border-black/10 bg-[#FFFFFF] text-[#000000] shadow-sm space-y-4 text-xs leading-relaxed">
          <div className="border-b border-black/10 pb-3">
            <div className="text-xl font-bold text-[#000000]">{fullName}</div>
            <div className="text-sm font-semibold text-neutral-700">{headline}</div>
            <div className="text-[11px] text-neutral-500 mt-1">{email} · {phone} · {location}</div>
          </div>
          <div>
            <div className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Summary</div>
            <p className="text-neutral-700">{summary}</p>
          </div>
          <div>
            <div className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">Experience</div>
            {experiences.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between font-semibold">
                  <span>{e.role} — {e.company}</span>
                  <span className="text-neutral-500">{e.period}</span>
                </div>
                <ul className="list-disc pl-4 text-neutral-700 mt-1 space-y-0.5">
                  {e.bullets.split('\n').filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <div className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Education</div>
            {education.map((ed) => (
              <div key={ed.id} className="flex justify-between mb-1">
                <span><strong>{ed.degree}</strong>, {ed.school}</span>
                <span className="text-neutral-500">{ed.year}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Skills</div>
            <p className="text-neutral-700">{skills}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={exportCvPdf}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download ATS Resume PDF</span>
        </button>
      </div>
    </div>
  );
};
