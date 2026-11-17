import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, RefreshCw, Shield, Key, Lock, AlertTriangle, Download, FileCheck, CheckCircle2 } from 'lucide-react';
import { RandomStringGeneratorTool } from './ExtraSuiteTools';

interface SecurityToolProps {
  toolId: string;
}

export const SecurityPrivacyTools: React.FC<SecurityToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (toolId === 'password-generator') return <PasswordGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'password-strength') return <PasswordStrengthTool />;
  if (toolId === 'passphrase-generator') return <PassphraseGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'file-checksum') return <FileChecksumTool onCopy={copyText} />;
  if (toolId === 'privacy-generator') return <PrivacyGeneratorTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'random-string-generator') return <RandomStringGeneratorTool />;

  return <div className="text-neutral-500">Security tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Secure Password Generator (Web Crypto API)
// -------------------------------------------------------------
const PasswordGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }

    if (!chars) {
      setPassword('');
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-[#FFFFFF] dark:bg-[#050505] flex items-center justify-between gap-4">
        <div className="font-mono text-xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-wider break-all select-all">
          {password || 'Select options below'}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generate}
            className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-[#090909] transition"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            onClick={() => onCopy(password)}
            disabled={!password}
            className="p-2 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg hover:opacity-90 transition disabled:opacity-40"
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#F6F6F6] dark:bg-[#090909] space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase mb-1">
            <span>Password Length</span>
            <span className="font-mono text-[#000000] dark:text-[#FFFFFF]">{length} characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-black dark:accent-white"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-black dark:accent-white" />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="accent-black dark:accent-white" />
            Lowercase (a-z)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="accent-black dark:accent-white" />
            Numbers (0-9)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="accent-black dark:accent-white" />
            Symbols (!@#$%)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="accent-black dark:accent-white" />
            Avoid Ambiguous (1, l, O, 0)
          </label>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Password Strength & Entropy Meter
// -------------------------------------------------------------
const PasswordStrengthTool: React.FC = () => {
  const [pwd, setPwd] = useState('P@ssw0rd2026!');

  const analysis = useMemo(() => {
    if (!pwd) return { score: 0, label: 'Empty', entropy: 0, crackTime: 'Instant' };

    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;

    const entropy = Math.round(pwd.length * Math.log2(pool || 1));

    let score = 0;
    let label = 'Very Weak';
    let crackTime = 'A few seconds';

    if (entropy > 80) {
      score = 4;
      label = 'Very Strong';
      crackTime = 'Centuries';
    } else if (entropy > 60) {
      score = 3;
      label = 'Strong';
      crackTime = 'Several Years';
    } else if (entropy > 40) {
      score = 2;
      label = 'Fair';
      crackTime = 'Several Days';
    } else if (entropy > 25) {
      score = 1;
      label = 'Weak';
      crackTime = 'A few hours';
    }

    return { score, label, entropy, crackTime };
  }, [pwd]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">Enter Password to Test</label>
        <input
          type="text"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-[#F6F6F6] dark:bg-[#090909]">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Resilience Rating</div>
          <div className={`text-xl font-bold mt-1 ${analysis.score >= 3 ? 'text-[#000000] dark:text-[#FFFFFF]' : analysis.score >= 2 ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-500 underline decoration-dashed'}`}>
            {analysis.label}
          </div>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-[#F6F6F6] dark:bg-[#090909]">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Estimated Entropy</div>
          <div className="text-xl font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">{analysis.entropy} bits</div>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-[#F6F6F6] dark:bg-[#090909]">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Offline Brute Force Time</div>
          <div className="text-xl font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">{analysis.crackTime}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Memorable Passphrase Generator
// -------------------------------------------------------------
const PassphraseGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [passphrase, setPassphrase] = useState('');

  const wordlist = [
    'battery', 'staple', 'correct', 'horse', 'forest', 'galaxy', 'silver', 'winter',
    'beacon', 'rocket', 'falcon', 'summit', 'shadow', 'nebula', 'copper', 'tunnel',
    'island', 'stream', 'meadow', 'whisper', 'legend', 'glacier', 'matrix', 'crystal',
    'orbit', 'compass', 'thunder', 'timber', 'canyon', 'phoenix', 'anchor', 'voyage'
  ];

  const generate = () => {
    const array = new Uint32Array(wordCount);
    crypto.getRandomValues(array);
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      let w = wordlist[array[i] % wordlist.length];
      if (capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
      words.push(w);
    }
    setPassphrase(words.join(separator));
  };

  useEffect(() => {
    generate();
  }, [wordCount, separator, capitalize]);

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-[#FFFFFF] dark:bg-[#050505] flex items-center justify-between gap-4">
        <div className="font-mono text-lg font-bold text-[#000000] dark:text-[#FFFFFF] break-all select-all">
          {passphrase}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={generate} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-[#090909]">
            <RefreshCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button onClick={() => onCopy(passphrase)} className="p-2 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded-lg">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Words: {wordCount}</label>
          <input type="range" min={3} max={8} value={wordCount} onChange={(e) => setWordCount(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Separator</label>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="w-full p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950">
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
            <option value=" ">Space ( )</option>
          </select>
        </div>
        <div className="flex items-center pt-4">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="accent-black dark:accent-white" />
            Capitalize Each Word
          </label>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: File Checksum & Hash Verifier
// -------------------------------------------------------------
const FileChecksumTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [fileName, setFileName] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha1, setSha1] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [expectedHash, setExpectedHash] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setCalculating(true);

    try {
      const buffer = await f.arrayBuffer();

      const bufferToHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      const [hash256, hash1] = await Promise.all([
        crypto.subtle.digest('SHA-256', buffer),
        crypto.subtle.digest('SHA-1', buffer),
      ]);

      setSha256(bufferToHex(hash256));
      setSha1(bufferToHex(hash1));
    } finally {
      setCalculating(false);
    }
  };

  const isMatch = expectedHash.trim().toLowerCase() === sha256.toLowerCase() ||
                  expectedHash.trim().toLowerCase() === sha1.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 inline-flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          Choose File to Verify
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
        {fileName && <span className="text-xs text-neutral-500 font-mono truncate max-w-xs">{fileName}</span>}
      </div>

      {calculating && <div className="text-xs text-neutral-500">Computing cryptographically secure checksum in browser...</div>}

      {sha256 && (
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-[#F6F6F6] dark:bg-[#090909]">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase mb-1">
              <span>SHA-256 Hash</span>
              <button onClick={() => onCopy(sha256)} className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF]">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono text-xs break-all text-[#000000] dark:text-[#FFFFFF]">{sha256}</div>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-[#F6F6F6] dark:bg-[#090909]">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase mb-1">
              <span>SHA-1 Hash</span>
              <button onClick={() => onCopy(sha1)} className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF]">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono text-xs break-all text-[#000000] dark:text-[#FFFFFF]">{sha1}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Compare with Expected Hash</label>
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste official checksum here to compare..."
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-xs bg-[#FFFFFF] dark:bg-[#050505]"
            />
            {expectedHash && (
              <div className={`mt-2 text-xs font-semibold flex items-center gap-1.5 ${isMatch ? 'text-[#000000] dark:text-[#FFFFFF]' : 'text-neutral-500 underline decoration-dashed'}`}>
                {isMatch ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {isMatch ? 'Checksum MATCHES perfectly! The file is authentic and unaltered.' : 'Checksum MISMATCH! File may be corrupt or altered.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Privacy Policy & Terms Generator
// -------------------------------------------------------------
const PrivacyGeneratorTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [appName, setAppName] = useState('My Web Application');
  const [company, setCompany] = useState('My Company');
  const [contactEmail, setContactEmail] = useState('support@example.com');
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com');

  const policyMarkdown = useMemo(() => {
    return `# Privacy Policy for ${appName}

**Effective Date:** ${new Date().toLocaleDateString()}

**Company:** ${company}  
**Website:** ${websiteUrl}  
**Contact:** ${contactEmail}

---

## 1. Introduction
Welcome to ${appName}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle any information you provide when using our services.

## 2. Client-Side Operations
${appName} prioritizes client-side architecture. Tools that process files, images, code, or cryptographic hashes perform calculations entirely within your browser environment. Your sensitive inputs are not transmitted to or stored on our servers.

## 3. Data Collection
We do not sell, trade, or rent your personal identification information to third parties. We may store non-sensitive local preferences (such as theme choice and recent tools) solely within your browser's LocalStorage.

## 4. Contact Us
If you have any questions about this Privacy Policy, please contact us at **${contactEmail}**.
`;
  }, [appName, company, contactEmail, websiteUrl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">App / Website Name</label>
          <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Organization / Company</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Contact Email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Website URL</label>
          <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950" />
        </div>
      </div>

      <pre className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs overflow-auto max-h-72 whitespace-pre-wrap">
        {policyMarkdown}
      </pre>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(policyMarkdown)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-[#F6F6F6] dark:hover:bg-[#090909] transition"
        >
          {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
          Copy Markdown Policy
        </button>
        <button
          onClick={() => onDownload(policyMarkdown, 'privacy-policy.md')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Download className="w-4 h-4" />
          Download .md
        </button>
      </div>
    </div>
  );
};
