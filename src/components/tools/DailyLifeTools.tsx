import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  Calendar,
  Car,
  Utensils,
  Scale,
  PenTool,
  Search,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. LAND AREA CONVERTER (SHOTOK / KATHA / BIGHA / SQFT) & DEED ESTIMATOR
// ─────────────────────────────────────────────────────────────────────────────
const LAND_UNITS: { id: string; name: string; sqftFactor: number }[] = [
  { id: 'shotok', name: 'Shotok / Decimal (শতক / ডেসিম্যাল)', sqftFactor: 435.6 },
  { id: 'katha', name: 'Katha — BD Standard (কাঠা)', sqftFactor: 720 },
  { id: 'bigha', name: 'Bigha — BD Standard 20 Katha (বিঘা)', sqftFactor: 14400 },
  { id: 'sqft', name: 'Square Feet (বর্গফুট)', sqftFactor: 1 },
  { id: 'sqm', name: 'Square Meter (বর্গমিটার)', sqftFactor: 10.7639104 },
  { id: 'acre', name: 'Acre (একর · 100 Shotok)', sqftFactor: 43560 },
  { id: 'hectare', name: 'Hectare (হেক্টর)', sqftFactor: 107639.104 },
  { id: 'kani', name: 'Kani — 120 Shotok (কানি)', sqftFactor: 52272 },
  { id: 'gonda', name: 'Gonda — 2 Shotok (গণ্ডা)', sqftFactor: 871.2 },
  { id: 'ojutangsho', name: 'Ojutangsho (অযুতাংশ)', sqftFactor: 4.356 },
];

const LandAreaConverterTool: React.FC = () => {
  const [amount, setAmount] = useState(5);
  const [fromUnit, setFromUnit] = useState('katha');
  const [pricePerUnit, setPricePerUnit] = useState(2500000);
  const [regTaxPct, setRegTaxPct] = useState(8.5);
  const [copied, setCopied] = useState(false);

  const totalSqft = useMemo(() => {
    const unit = LAND_UNITS.find((u) => u.id === fromUnit) || LAND_UNITS[0];
    return Math.max(0, amount) * unit.sqftFactor;
  }, [amount, fromUnit]);

  const baseLandPrice = Math.max(0, amount) * Math.max(0, pricePerUnit);
  const registrationFee = Math.round((baseLandPrice * Math.max(0, regTaxPct)) / 100);
  const totalPropertyCost = baseLandPrice + registrationFee;

  const copySummary = () => {
    const lines = LAND_UNITS.map((u) => `${u.name}: ${(totalSqft / u.sqftFactor).toFixed(4)}`).join('\n');
    const full = `Land Measurement Summary (${amount} ${fromUnit}):\n${lines}\n\nBase Value: ${baseLandPrice.toLocaleString()}\nEst. Registration (${regTaxPct}%): ${registrationFee.toLocaleString()}\nTotal Cost: ${totalPropertyCost.toLocaleString()}`;
    navigator.clipboard?.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 text-xs">
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Land Quantity</span>
          <input type="number" min={0} step="any" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono font-bold text-sm" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Input Unit</span>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-medium">
            {LAND_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Price per Input Unit</span>
          <input type="number" min={0} value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Deed / Stamp Tax (%)</span>
          <input type="number" min={0} step="0.5" value={regTaxPct} onChange={(e) => setRegTaxPct(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {LAND_UNITS.map((u) => {
          const val = totalSqft / u.sqftFactor;
          const isActive = u.id === fromUnit;
          return (
            <div
              key={u.id}
              className={`p-3.5 rounded-xl border ${
                isActive
                  ? 'bg-[#090909] text-[#FFFFFF] border-[#090909]'
                  : 'bg-[#FFFFFF] dark:bg-[#090909] border-black/10 dark:border-white/10'
              }`}
            >
              <div className={`text-[11px] font-medium line-clamp-1 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {u.name}
              </div>
              <div className="text-lg font-extrabold font-mono mt-1">
                {val >= 1000 ? val.toLocaleString(undefined, { maximumFractionDigits: 2 }) : val.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-xl bg-[#090909] text-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Property Valuation & Registration Estimate
          </div>
          <div className="text-xs text-neutral-300 font-mono">
            Land Value: {baseLandPrice.toLocaleString()} + Est. Deed Tax ({regTaxPct}%): {registrationFee.toLocaleString()}
          </div>
          <div className="text-2xl font-extrabold font-mono">Total: {totalPropertyCost.toLocaleString()}</div>
        </div>
        <button type="button" onClick={copySummary} className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] text-[#000000] text-xs font-bold inline-flex items-center justify-center gap-1.5 hover:bg-[#EDEDED] cursor-pointer shrink-0">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Summary' : 'Copy Full Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. PERSONAL & SHOP DUE LEDGER (KHATA / HISAB BOOK)
// ─────────────────────────────────────────────────────────────────────────────
interface KhataTx {
  id: string;
  party: string;
  phone: string;
  type: 'gave' | 'got'; // 'gave' = receivable (+), 'got' = paid / payable (-)
  amount: number;
  note: string;
  date: string;
}

const DailyLedgerKhataTool: React.FC = () => {
  const [txs, setTxs] = useState<KhataTx[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_daily_khata');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [party, setParty] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'gave' | 'got'>('gave');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('asbily_daily_khata', JSON.stringify(txs));
    } catch {
      // ignore
    }
  }, [txs]);

  const addTx = () => {
    const val = parseFloat(amount);
    if (!party.trim() || !val || val <= 0) return;
    setTxs((p) => [
      {
        id: String(Date.now()),
        party: party.trim(),
        phone: phone.trim(),
        type,
        amount: val,
        note: note.trim(),
        date: new Date().toISOString().split('T')[0],
      },
      ...p,
    ]);
    setAmount('');
    setNote('');
  };

  const partyBalances = useMemo(() => {
    const map = new Map<string, { party: string; phone: string; net: number; count: number }>();
    txs.forEach((t) => {
      const key = t.party.toLowerCase();
      const prev = map.get(key) || { party: t.party, phone: t.phone, net: 0, count: 0 };
      const delta = t.type === 'gave' ? t.amount : -t.amount;
      map.set(key, {
        party: prev.party,
        phone: prev.phone || t.phone,
        net: prev.net + delta,
        count: prev.count + 1,
      });
    });
    return Array.from(map.values()).filter((p) => !search.trim() || p.party.toLowerCase().includes(search.toLowerCase()));
  }, [txs, search]);

  const totals = useMemo(() => {
    let receivable = 0;
    let payable = 0;
    partyBalances.forEach((b) => {
      if (b.net > 0) receivable += b.net;
      if (b.net < 0) payable += Math.abs(b.net);
    });
    return { receivable, payable };
  }, [partyBalances]);

  const copyReminder = (name: string, net: number) => {
    const msg = `Assalamu Alaikum / Hello ${name}, friendly reminder regarding your outstanding account balance of ${net.toLocaleString()}. Kindly settle when convenient. Thank you!`;
    navigator.clipboard?.writeText(msg);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const exportCsv = () => {
    const esc = (v: string | number) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const lines = ['Date,Party,Phone,Type,Amount,Note', ...txs.map((t) => [t.date, t.party, t.phone, t.type === 'gave' ? 'Due_Given' : 'Received', t.amount, t.note].map(esc).join(','))];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'khata-hisab-book.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF]">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">You Will Receive (পাওনা)</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{totals.receivable.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">You Will Pay (দেনা)</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{totals.payable.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Net Khata Balance</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{(totals.receivable - totals.payable).toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="Customer / Friend Name" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          <select value={type} onChange={(e) => setType(e.target.value as 'gave' | 'got')} className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-semibold">
            <option value="gave">You Gave (বাকি দিলাম)</option>
            <option value="got">You Got / Paid (জমা পেলাম)</option>
          </select>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Short Note (e.g. Rice, Loan)" className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={addTx} className="px-4 py-2 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-bold inline-flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Record Entry
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter person..." className="pl-8 pr-2.5 py-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
            </div>
            {txs.length > 0 && (
              <button type="button" onClick={exportCsv} className="px-3 py-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-semibold inline-flex items-center gap-1 cursor-pointer">
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {partyBalances.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {partyBalances.map((p) => (
            <div key={p.party} className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-sm truncate">{p.party}</div>
                <div className="text-[11px] text-neutral-500">{p.count} entries {p.phone ? `· ${p.phone}` : ''}</div>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <div className="font-mono font-extrabold text-sm">
                  {p.net >= 0 ? `Due: ${p.net.toLocaleString()}` : `Pay: ${Math.abs(p.net).toLocaleString()}`}
                </div>
                {p.net > 0 && (
                  <button type="button" onClick={() => copyReminder(p.party, p.net)} className="text-[11px] underline text-neutral-600 dark:text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer">
                    {copiedId === p.party ? 'Reminder Copied!' : 'Copy Reminder'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[520px]">
          <thead className="bg-[#F6F6F6] dark:bg-[#050505] border-b border-black/10 dark:border-white/10 text-neutral-500">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Person</th>
              <th className="p-3">Note</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {txs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400">Your Khata / Hisab ledger is empty. Add your first transaction above.</td>
              </tr>
            ) : (
              txs.map((t) => (
                <tr key={t.id}>
                  <td className="p-3 font-mono text-neutral-500">{t.date}</td>
                  <td className="p-3 font-semibold">{t.party}</td>
                  <td className="p-3 text-neutral-500">{t.note || '—'}</td>
                  <td className="p-3 font-semibold">{t.type === 'gave' ? 'Gave (+)' : 'Got (-)'}</td>
                  <td className="p-3 text-right font-mono font-bold">{t.amount.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={() => setTxs((p) => p.filter((x) => x.id !== t.id))} className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer" aria-label="Delete transaction">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. FUEL MILEAGE, TRIP COST & GROUP SPLIT CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const FuelTripPlannerTool: React.FC = () => {
  const [distance, setDistance] = useState(260);
  const [roundTrip, setRoundTrip] = useState(true);
  const [efficiency, setEfficiency] = useState(14);
  const [effMode, setEffMode] = useState<'kmpl' | 'l100km'>('kmpl');
  const [fuelPrice, setFuelPrice] = useState(130);
  const [tollsAndExtra, setTollsAndExtra] = useState(800);
  const [passengers, setPassengers] = useState(4);
  const [copied, setCopied] = useState(false);

  const effectiveDist = roundTrip ? distance * 2 : distance;
  const fuelNeeded = useMemo(() => {
    if (efficiency <= 0) return 0;
    return effMode === 'kmpl' ? effectiveDist / efficiency : (effectiveDist * efficiency) / 100;
  }, [effectiveDist, efficiency, effMode]);

  const fuelCost = fuelNeeded * fuelPrice;
  const totalTripCost = fuelCost + tollsAndExtra;
  const perPerson = passengers > 0 ? totalTripCost / passengers : totalTripCost;
  const costPerKm = effectiveDist > 0 ? totalTripCost / effectiveDist : 0;

  const copyPlan = () => {
    const text = `Trip Expense Split\nDistance: ${effectiveDist} km\nFuel Needed: ${fuelNeeded.toFixed(1)} L\nFuel Cost: ${Math.round(fuelCost).toLocaleString()}\nTolls & Parking: ${tollsAndExtra.toLocaleString()}\nTotal Cost: ${Math.round(totalTripCost).toLocaleString()}\nSplit (${passengers} people): ${Math.round(perPerson).toLocaleString()} / person`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 text-xs">
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">One-Way Distance (km)</span>
          <input type="number" min={0} value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
        <div className="space-y-1">
          <span className="text-neutral-500 font-medium block">Vehicle Fuel Efficiency</span>
          <div className="flex gap-1.5">
            <input type="number" min={0.1} step="0.5" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value) || 0)} className="flex-1 p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <select value={effMode} onChange={(e) => setEffMode(e.target.value as 'kmpl' | 'l100km')} className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]">
              <option value="kmpl">km / L</option>
              <option value="l100km">L / 100km</option>
            </select>
          </div>
        </div>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Fuel Price / Liter</span>
          <input type="number" min={0} step="0.5" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Bridge Tolls, Parking & Ferry</span>
          <input type="number" min={0} value={tollsAndExtra} onChange={(e) => setTollsAndExtra(Number(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Passengers Splitting Cost</span>
          <input type="number" min={1} value={passengers} onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
        </label>
        <div className="flex items-end">
          <label className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] flex items-center justify-between cursor-pointer font-semibold">
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Include Return Trip (2x)</span>
            <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="accent-black w-4 h-4" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#090909] text-[#FFFFFF]">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Cost Per Person</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{Math.round(perPerson).toLocaleString()}</div>
          <div className="text-[11px] text-neutral-400 mt-1">{passengers} passengers</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Trip Cost</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{Math.round(totalTripCost).toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500 mt-1">{costPerKm.toFixed(2)} / km</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Fuel Required</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{fuelNeeded.toFixed(2)} L</div>
          <div className="text-[11px] text-neutral-500 mt-1">{effectiveDist} km distance</div>
        </div>
        <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10">
          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Pure Fuel Spend</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{Math.round(fuelCost).toLocaleString()}</div>
        </div>
      </div>

      <button type="button" onClick={copyPlan} className="px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-bold inline-flex items-center gap-2 cursor-pointer">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Trip Summary Copied' : 'Copy Group Split Summary'}</span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DIGITAL E-SIGNATURE & SEAL PAD (PNG / VECTOR SVG)
// ─────────────────────────────────────────────────────────────────────────────
type Point = { x: number; y: number };

const ESignaturePadTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [inkColor, setInkColor] = useState<'#000000' | '#262626' | '#FFFFFF'>('#000000');
  const [transparentBg, setTransparentBg] = useState(true);

  const redraw = (allStrokes: Point[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!transparentBg) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    allStrokes.forEach((pts) => {
      if (pts.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i].x + pts[i + 1].x) / 2;
        const midY = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    });
  };

  useEffect(() => {
    redraw(strokes);
  }, [strokes, lineWidth, inkColor, transparentBg]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getCoords(e);
    currentStrokeRef.current = [pt, pt];
    redraw([...strokes, currentStrokeRef.current]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const pt = getCoords(e);
    currentStrokeRef.current.push(pt);
    redraw([...strokes, currentStrokeRef.current]);
  };

  const finishStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current.length > 0) {
      const done = [...currentStrokeRef.current];
      currentStrokeRef.current = [];
      setStrokes((prev) => [...prev, done]);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `signature-${transparentBg ? 'transparent' : 'white'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    const paths = strokes
      .map((pts) => {
        if (pts.length === 0) return '';
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length; i++) {
          d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
        }
        return `<path d="${d}" fill="none" stroke="${inkColor}" stroke-width="${lineWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
      })
      .join('\n  ');
    const bgRect = transparentBg ? '' : `<rect width="720" height="260" fill="#FFFFFF" />\n  `;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 260" width="720" height="260">\n  ${bgRect}${paths}\n</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signature.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Pen Weight ({lineWidth}px)</span>
            <input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="accent-black" />
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium mr-1">Ink:</span>
            {([
              { c: '#000000', label: 'Pure Black' },
              { c: '#262626', label: 'Charcoal' },
              { c: '#FFFFFF', label: 'White' },
            ] as const).map((item) => (
              <button
                key={item.c}
                type="button"
                onClick={() => setInkColor(item.c)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold cursor-pointer ${
                  inkColor === item.c ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'border-black/15 dark:border-white/15'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer font-medium">
            <input type="checkbox" checked={transparentBg} onChange={(e) => setTransparentBg(e.target.checked)} className="accent-black" />
            <span>Transparent PNG</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setStrokes((p) => p.slice(0, -1))} disabled={strokes.length === 0} className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 font-semibold disabled:opacity-40 cursor-pointer flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
          <button type="button" onClick={() => setStrokes([])} disabled={strokes.length === 0} className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 font-semibold disabled:opacity-40 cursor-pointer">
            Clear
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 overflow-hidden bg-[#FFFFFF] dark:bg-[#161616]">
        {strokes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-neutral-400 text-xs gap-1">
            <PenTool className="w-5 h-5 opacity-50" />
            <span>Draw your signature smoothly using Mouse, Touch, or Stylus</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={720}
          height={260}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          className="w-full h-56 sm:h-64 touch-none cursor-crosshair block"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={downloadPng} disabled={strokes.length === 0} className="px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-bold inline-flex items-center gap-2 disabled:opacity-40 cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Download PNG {transparentBg ? '(Transparent)' : '(White BG)'}</span>
        </button>
        <button type="button" onClick={downloadSvg} disabled={strokes.length === 0} className="px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 text-xs font-bold inline-flex items-center gap-2 hover:bg-[#F6F6F6] dark:hover:bg-white/10 disabled:opacity-40 cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Download Vector SVG</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. KITCHEN RECIPE SCALER & UNIT CONVERTER
// ─────────────────────────────────────────────────────────────────────────────
const parseLeadingNumber = (str: string): { value: number | null; rest: string } => {
  const mixed = str.match(/^\s*(\d+)\s+(\d+)\/(\d+)\s+(.*)$/);
  if (mixed) {
    const val = parseFloat(mixed[1]) + parseFloat(mixed[2]) / parseFloat(mixed[3]);
    return { value: val, rest: mixed[4] };
  }
  const frac = str.match(/^\s*(\d+)\/(\d+)\s+(.*)$/);
  if (frac) {
    return { value: parseFloat(frac[1]) / parseFloat(frac[2]), rest: frac[3] };
  }
  const dec = str.match(/^\s*(\d+(?:\.\d+)?)\s+(.*)$/);
  if (dec) {
    return { value: parseFloat(dec[1]), rest: dec[2] };
  }
  return { value: null, rest: str };
};

const CookingRecipeScalerTool: React.FC = () => {
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(10);
  const [rawIngredients, setRawIngredients] = useState(
    '500 g Basmati Rice\n2 tbsp Ghee / Clarified Butter\n1 1/2 cups Yogurt\n3/4 tsp Garam Masala\n250 ml Warm Milk\n4 Whole Cardamom Pods'
  );
  const [copied, setCopied] = useState(false);

  // Kitchen reference converter
  const [kitchenVal, setKitchenVal] = useState(1);
  const [kitchenType, setKitchenType] = useState<'cup-ml' | 'tbsp-ml' | 'tsp-ml' | 'oz-g' | 'lb-g' | 'c-f'>('cup-ml');

  const ratio = originalServings > 0 ? targetServings / originalServings : 1;

  const scaledLines = useMemo(() => {
    return rawIngredients
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const { value, rest } = parseLeadingNumber(line);
        if (value === null) return line;
        const scaled = value * ratio;
        const formatted = Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(2).replace(/\.?0+$/, '');
        return `${formatted} ${rest}`;
      });
  }, [rawIngredients, ratio]);

  const kitchenConverted = useMemo(() => {
    switch (kitchenType) {
      case 'cup-ml': return `${(kitchenVal * 236.59).toFixed(1)} ml (${(kitchenVal * 16).toFixed(1)} tbsp)`;
      case 'tbsp-ml': return `${(kitchenVal * 14.79).toFixed(1)} ml (${(kitchenVal * 3).toFixed(1)} tsp)`;
      case 'tsp-ml': return `${(kitchenVal * 4.93).toFixed(1)} ml`;
      case 'oz-g': return `${(kitchenVal * 28.35).toFixed(1)} grams`;
      case 'lb-g': return `${(kitchenVal * 453.59).toFixed(1)} grams`;
      case 'c-f': return `${((kitchenVal * 9) / 5 + 32).toFixed(1)} °F`;
    }
  }, [kitchenVal, kitchenType]);

  const copyScaled = () => {
    navigator.clipboard?.writeText(`Scaled Recipe (${targetServings} servings):\n` + scaledLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 text-xs">
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Original Recipe Servings</span>
          <input type="number" min={1} value={originalServings} onChange={(e) => setOriginalServings(Math.max(1, Number(e.target.value) || 1))} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono font-bold" />
        </label>
        <label className="space-y-1">
          <span className="text-neutral-500 font-medium">Target Servings Needed</span>
          <input type="number" min={1} value={targetServings} onChange={(e) => setTargetServings(Math.max(1, Number(e.target.value) || 1))} className="w-full p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono font-bold" />
        </label>
        <div className="p-3 rounded-lg bg-[#090909] text-[#FFFFFF] flex flex-col justify-center">
          <span className="text-[11px] text-neutral-400">Scale Multiplier</span>
          <span className="text-xl font-extrabold font-mono">{ratio.toFixed(2)}×</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Original Ingredients (Supports fractions e.g. 1 1/2 cups)</label>
          <textarea
            rows={8}
            value={rawIngredients}
            onChange={(e) => setRawIngredients(e.target.value)}
            className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Scaled List ({targetServings} Servings)</span>
            <button type="button" onClick={copyScaled} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy List'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] min-h-[200px] space-y-2 text-xs sm:text-sm font-mono">
            {scaledLines.map((line, i) => (
              <div key={i} className="pb-1.5 border-b border-black/5 dark:border-white/5 last:border-0">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <Utensils className="w-4 h-4" />
          <span>Quick Kitchen Converter:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" step="any" value={kitchenVal} onChange={(e) => setKitchenVal(Number(e.target.value) || 0)} className="w-20 p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
          <select value={kitchenType} onChange={(e) => setKitchenType(e.target.value as any)} className="p-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]">
            <option value="cup-ml">US Cups → ml</option>
            <option value="tbsp-ml">Tablespoons → ml</option>
            <option value="tsp-ml">Teaspoons → ml</option>
            <option value="oz-g">Ounces (oz) → Grams</option>
            <option value="lb-g">Pounds (lb) → Grams</option>
            <option value="c-f">Oven °C → °F</option>
          </select>
          <span className="px-3 py-2 rounded-lg bg-[#090909] text-[#FFFFFF] font-mono font-bold">= {kitchenConverted}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. IMPORTANT DATES, BILLS, EMI & WARRANTY TRACKER (.ICS EXPORT)
// ─────────────────────────────────────────────────────────────────────────────
interface DeadlineItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  amount: string;
}

const BillWarrantyCountdownTool: React.FC = () => {
  const [items, setItems] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_bill_deadlines');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Utility Bill');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [amount, setAmount] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('asbily_bill_deadlines', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = () => {
    if (!title.trim() || !dueDate) return;
    setItems((p) =>
      [...p, { id: String(Date.now()), title: title.trim(), category, dueDate, amount: amount.trim() }].sort((a, b) =>
        a.dueDate.localeCompare(b.dueDate)
      )
    );
    setTitle('');
    setAmount('');
  };

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const downloadIcs = (it: DeadlineItem) => {
    const dt = it.dueDate.replace(/-/g, '');
    const nextDate = new Date(it.dueDate + 'T00:00:00');
    nextDate.setDate(nextDate.getDate() + 1);
    const dtEnd = nextDate.toISOString().split('T')[0].replace(/-/g, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Asbily Free Tools//Deadline Tracker//EN',
      'BEGIN:VEVENT',
      `UID:${it.id}@tools.asbily.com`,
      `DTSTAMP:${dt}T090000Z`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:[${it.category}] ${it.title}${it.amount ? ` (${it.amount})` : ''}`,
      `DESCRIPTION:Tracked via Asbily Tools Bills & Warranty Countdown`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Due Tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${it.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-3 text-xs">
        <div className="font-bold uppercase tracking-wider">Add Bill, EMI, Subscription or Warranty Expiry</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. House Rent, Passport, Laptop Warranty)" className="lg:col-span-2 p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]">
            <option>Utility Bill</option>
            <option>Rent / EMI</option>
            <option>Warranty Expiry</option>
            <option>Domain / Hosting</option>
            <option>Document / License</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]" />
          <div className="flex gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amt (opt)" className="w-24 p-2.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono" />
            <button type="button" onClick={addItem} className="flex-1 p-2.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-bold flex items-center justify-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-10 rounded-xl border border-dashed border-black/15 dark:border-white/15 text-center text-xs text-neutral-400">
          No upcoming bills, warranties, or renewals added yet. Add one above to track countdowns and export Calendar reminders.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((it) => {
            const diff = getDaysDiff(it.dueDate);
            const badgeText = diff === 0 ? 'DUE TODAY' : diff < 0 ? `${Math.abs(diff)}d OVERDUE` : `${diff} days left`;
            return (
              <div key={it.id} className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{it.category}</span>
                    <span>·</span>
                    <span className="font-mono">{it.dueDate}</span>
                    {it.amount && <span>· {it.amount}</span>}
                  </div>
                  <div className="font-bold text-sm truncate">{it.title}</div>
                  <div className="inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]">
                    {badgeText}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => downloadIcs(it)} title="Add to Google / Apple Calendar (.ics)" className="px-2.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>.ICS</span>
                  </button>
                  <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="p-2 text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer" aria-label="Delete item">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export const DailyLifeTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  switch (toolId) {
    case 'land-area-converter':
      return <LandAreaConverterTool />;
    case 'daily-ledger-khata':
      return <DailyLedgerKhataTool />;
    case 'fuel-trip-planner':
      return <FuelTripPlannerTool />;
    case 'e-signature-pad':
      return <ESignaturePadTool />;
    case 'cooking-recipe-scaler':
      return <CookingRecipeScalerTool />;
    case 'bill-warranty-countdown':
      return <BillWarrantyCountdownTool />;
    default:
      return <div className="text-xs text-neutral-500">Select a daily utility.</div>;
  }
};
