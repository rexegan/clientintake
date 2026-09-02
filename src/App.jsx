import { useState, useEffect, useRef, useCallback } from "react";
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from "pdf-lib";

const PAGE_BG = "#f4f6f9";
const NAV     = "#ffffff";
const CARD    = "#ffffff";
const INPUT_BG = "#ffffff";
const ACCENT  = "#2f3a4a";
const INK     = "#151b28";
const MUTED   = "#697180";
const BORDER  = "#e1e4ea";
const DANGER  = "#d64545";
const SUCCESS = "#2fa76f";

const IS = {
  background: INPUT_BG, border: "1px solid #cfd5de", borderRadius: 10,
  padding: "9px 12px", color: "#000", fontSize: 14, fontWeight: 500,
  width: "100%", boxSizing: "border-box", caretColor: "#000",
  boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
  WebkitAppearance: "none", MozAppearance: "none", appearance: "none",
};

const BRAND_NAVY = "#2e3d66";
const BRAND_SERIF = "Georgia, 'Times New Roman', serif";

const AcornMark = ({ size = 40, color = BRAND_NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M20.5 22.5C14 23.5 8.5 21 5.5 15.5C8.8 14.9 10.2 13.2 9.8 10.6C12.8 11.4 15 10.6 16.2 8.2C18.4 10 20.6 10.2 22.8 8.8C23.2 11.4 24.6 13 27 13.4C25.2 16.6 24.6 19.6 25.2 22.4Z" fill={color} opacity="0.92" />
    <path d="M20 23C16.5 26.5 14.5 30.5 14 35" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M25.5 21.5C25.8 16.8 29.6 13.6 34.4 13.9C39.2 14.2 42.6 17.8 42.3 22.5C42.25 23.4 41.6 23.9 40.7 23.85L27 23C26.1 22.95 25.45 22.4 25.5 21.5Z" fill={color} />
    <path d="M34.8 13.8C35.4 11.6 36.6 10.2 38.5 9.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M26.5 25.3L41.6 26.2C41.2 32 37.8 37.4 33.6 39.5C29.6 36.9 26.6 31.2 26.5 25.3Z" fill={color} />
  </svg>
);

const BrandLockup = ({ mark = 44 }) => (
  <div style={{ textAlign: "center" }}>
    <AcornMark size={mark} />
    <div style={{ fontFamily: BRAND_SERIF, fontSize: 18, letterSpacing: "0.2em", marginLeft: "0.2em", color: BRAND_NAVY, marginTop: 2, lineHeight: 1.1 }}>RUSSELL</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 4 }}>
      <span style={{ flex: "0 0 20px", height: 1, background: BRAND_NAVY, opacity: 0.5 }} />
      <span style={{ fontFamily: BRAND_SERIF, fontSize: 8.5, letterSpacing: "0.3em", marginLeft: "0.3em", color: BRAND_NAVY, whiteSpace: "nowrap" }}>WEALTH GROUP</span>
      <span style={{ flex: "0 0 20px", height: 1, background: BRAND_NAVY, opacity: 0.5 }} />
    </div>
  </div>
);

const Lbl = ({ t }) => (
  <div style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginBottom: 5, marginTop: 12 }}>{t}</div>
);

const Sec = ({ t }) => (
  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK, borderBottom: "1px solid " + BORDER, paddingBottom: 7, marginTop: 24, marginBottom: 8 }}>{t}</div>
);

const Row = ({ children, cols = 2 }) => (
  <div className="rg" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0 16px" }}>
    {children}
  </div>
);

const F = ({ children }) => <div>{children}</div>;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function DatePicker({ value, onChange, label, futureYears = 0, compact = false, monthW, dayW, yearW }) {
  const parts = (value || "").split("/");
  const mm = parts[0] || "";
  const dd = parts[1] || "";
  const yyyy = parts[2] || "";

  const daysInMonth = mm && yyyy
    ? new Date(parseInt(yyyy), parseInt(mm), 0).getDate()
    : 31;

  const set = (newMm, newDd, newYyyy) => {
    if (!newMm && !newDd && !newYyyy) { onChange(""); return; }
    onChange(`${newMm}/${newDd}/${newYyyy}`);
  };

  const sel = { ...IS, width: "auto" };

  return (
    <>
      {label && <Lbl t={label} />}
      <div style={{ display: "flex", gap: 6, width: compact ? "fit-content" : "100%", flexWrap: "wrap" }}>
        <select className="sel-compact" data-lpignore="true" value={mm} onChange={e => set(e.target.value, dd, yyyy)} style={{ ...sel, flex: compact ? "none" : "1.25 1 0%", width: compact ? (monthW || 72) : undefined, minWidth: compact ? undefined : 64 }}>
          <option value="">Mo</option>
          {MONTHS.map((m, i) => {
            const v = String(i + 1).padStart(2, "0");
            return <option key={v} value={v}>{m}</option>;
          })}
        </select>
        <select className="sel-compact" data-lpignore="true" value={dd} onChange={e => set(mm, e.target.value, yyyy)} style={{ ...sel, flex: compact ? "none" : "1 1 0%", width: compact ? (dayW || 66) : undefined, minWidth: compact ? undefined : 56 }}>
          <option value="">Day</option>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const v = String(i + 1).padStart(2, "0");
            return <option key={v} value={v}>{i + 1}</option>;
          })}
        </select>
        <input
          data-lpignore="true"
          autoComplete="new-password"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="Year"
          value={yyyy}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
            set(mm, dd, v);
          }}
          style={{ ...sel, flex: compact ? "none" : "1 1 0%", width: compact ? (yearW || 68) : undefined, minWidth: compact ? undefined : 56 }}
        />
      </div>
    </>
  );
}

const MailLink = ({ email }) => email
  ? <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "none" }} onMouseEnter={e => e.target.style.textDecoration="underline"} onMouseLeave={e => e.target.style.textDecoration="none"}>{email}</a>
  : null;

const SmartCombo = ({ value, onChange, onBlur, options, placeholder, style }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setQuery(value || ""); }, [value]);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = typing && query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()))
    : options;
  const handleSelect = (opt) => { setQuery(opt); onChange(opt); setOpen(false); setTyping(false); };
  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      setTyping(false);
      if (onBlur) onBlur(query.trim());
      if (query.trim() && query.trim() !== value) onChange(query.trim());
    }, 150);
  };
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); setTyping(true); }}
        onFocus={() => { setOpen(true); setTyping(false); }}
        onBlur={handleBlur}
        placeholder={placeholder || "Type or select…"}
        autoComplete="off"
        data-lpignore="true"
        style={{ ...style, paddingRight: 30 }}
      />
      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 11, color: "#697180", lineHeight: 1 }}>▾</span>
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 9000, background: "#1a1f2b", border: "1px solid #3a4155", borderRadius: 8, marginTop: 2, maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              style={{ padding: "9px 14px", fontSize: 13, color: "#e8ecf2", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #272d3d" }}
              onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const TaskDropdown = ({ value, onChange, options, placeholder = "— Select —" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", width: 240 }}>
      <div onClick={() => setOpen(o => !o)} style={{ ...IS, width: 240, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
        <span style={{ color: value ? "#000" : "#9aa3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
        <span style={{ fontSize: 11, color: "#697180", marginLeft: 8, flexShrink: 0 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, width: 240, zIndex: 9200, background: "#fff", border: "1px solid #cfd5de", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.13)", maxHeight: 280, overflowY: "auto" }}>
          {options.map(t => (
            <div key={t} onMouseDown={() => { onChange(t); setOpen(false); }}
              style={{ padding: "8px 14px", fontSize: 13, color: "#151b28", cursor: "pointer", background: value === t ? "#eef4ff" : "", fontWeight: value === t ? 600 : 400, whiteSpace: "nowrap" }}
              onMouseEnter={e => e.currentTarget.style.background = value === t ? "#eef4ff" : "#f4f6f9"}
              onMouseLeave={e => e.currentTarget.style.background = value === t ? "#eef4ff" : ""}>
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GroupedSelect = ({ value, onChange, groups, placeholder = "— Select —", style }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const allTypes = groups.flatMap(g => g.types);
  const label = allTypes.includes(value) ? value : placeholder;
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{ ...style, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
        <span style={{ color: value ? (style?.color || "#000") : "#9aa3af" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#697180", marginLeft: 8, flexShrink: 0 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, right: 0, zIndex: 9100, background: "#fff", border: "1px solid #cfd5de", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.13)", maxHeight: 280, overflowY: "auto" }}>
          <div onMouseDown={() => { onChange(""); setOpen(false); }} style={{ padding: "8px 12px", fontSize: 13, color: "#9aa3af", cursor: "pointer", borderBottom: "1px solid #eee" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f4f6f9"} onMouseLeave={e => e.currentTarget.style.background = ""}>
            {placeholder}
          </div>
          {groups.map(g => (
            <div key={g.group}>
              <div style={{ padding: "6px 12px 4px", fontSize: 11, fontWeight: 700, color: "#fff", background: "#2f3a4a", letterSpacing: "0.04em", textTransform: "uppercase" }}>{g.group}</div>
              {g.types.map(t => (
                <div key={t} onMouseDown={() => { onChange(t); setOpen(false); }}
                  style={{ padding: "8px 12px 8px 20px", fontSize: 13, color: "#151b28", cursor: "pointer", background: value === t ? "#eef4ff" : "", fontWeight: value === t ? 600 : 400, borderBottom: "1px solid #f0f2f5" }}
                  onMouseEnter={e => e.currentTarget.style.background = value === t ? "#eef4ff" : "#f4f6f9"}
                  onMouseLeave={e => e.currentTarget.style.background = value === t ? "#eef4ff" : ""}>
                  {t}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const fmtPhone = (r) => {
  const d = r.replace(/\D/g, "").slice(0, 10);
  if (!d.length) return "";
  if (d.length <= 3) return "(" + d;
  if (d.length <= 6) return "(" + d.slice(0,3) + ") " + d.slice(3);
  return "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
};
const fmtSSN = (r) => {
  const d = r.replace(/\D/g, "").slice(0,9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return d.slice(0,3) + "-" + d.slice(3);
  return d.slice(0,3) + "-" + d.slice(3,5) + "-" + d.slice(5);
};
const fmtDOB = (r) => {
  const d = r.replace(/\D/g, "").slice(0,8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.slice(0,2) + "/" + d.slice(2);
  return d.slice(0,2) + "/" + d.slice(2,4) + "/" + d.slice(4);
};
const fmtPOBox = (r) => {
  const stripped = r.replace(/^[Pp]\.?[Oo]\.?\s*[Bb][Oo][Xx]\.?\s*/i, "").trim();
  if (!stripped) return r;
  return "P.O. Box " + stripped;
};

const fmtDollar = (r) => {
  const d = r.replace(/[^0-9]/g, "");
  if (!d) return "";
  return "$" + parseInt(d, 10).toLocaleString();
};

const emptyClient = {
  firstName:"", middleName:"", lastName:"",
  dob:"", ssn:"", gender:"", filingStatus:"", cell:"", homePhone:"", email:"",
  addressLine1:"", addressLine2:"", city:"", state:"", zip:"",
  hasPOBox: null, poBox:"", poBoxCity:"", poBoxState:"", poBoxZip:"", preferredMailing:"",
  usCitizen:"", countryOfCitizenship:"", numDependents:"", idType:"",
  dlNumber:"", dlState:"", dlIssuerName:"", dlIssueDate:"", dlExpDate:"",
  knownSinceMonth:"", knownSinceDay:"", knownSinceYear:"",
  tcLastName:"", tcFirstName:"", tcMiddleInitial:"",
  tcAddress:"", tcCity:"", tcState:"", tcZip:"", tcCountry:"USA",
  tcRelationship:"", tcHomePhone:"", tcCell:"", tcEmail:"",
};
const emptySpouse = { firstName:"", middleName:"", lastName:"", dob:"", ssn:"", gender:"", cell:"", homePhone:"", email:"", usCitizen:"", countryOfCitizenship:"", numDependents:"", idType:"", dlNumber:"", dlState:"", dlIssuerName:"", dlIssueDate:"", dlExpDate:"", addressLine1:"", addressLine2:"", city:"", state:"", zip:"", hasPOBox:null, poBox:"", poBoxCity:"", poBoxState:"", poBoxZip:"", preferredMailing:"" };
const emptyEmployer = { employer:"", occupation:"", startDate:"", workPhone:"", workAddress:"", workCity:"", workState:"", workZip:"", hasRetirement:null, retirementType:null, hasMatch:null, matchPct:"", contributionAmt:"", retirementBalance:"", retirementCustodian:"", inServiceTransfer:"" };
const emptyDebt = { type:"", lender:"", balance:"", monthlyPayment:"", interestRate:"", notes:"" };
const emptyAuto = { year:"", make:"", model:"", value:"", hasKbb:null, kbbMileage:"", kbbCondition:"", hasLoan:null, loanBalance:"", lender:"", interestRate:"", monthlyPayment:"" };
const emptyLifePolicy = { carrier:"", policyType:"", insured:"", owner:"", deathBenefit:"", cashValue:"", premiumAmount:"", premiumFrequency:"monthly", policyNumber:"", issueDate:"", surrender:"" };
const DEFAULT_MORTGAGE_COS = [
  "Rocket Mortgage / Quicken Loans","United Wholesale Mortgage (UWM)","Wells Fargo Home Mortgage",
  "JPMorgan Chase Bank","loanDepot","Fairway Independent Mortgage","Pennymac","Bank of America",
  "U.S. Bank","Caliber Home Loans","Freedom Mortgage","Newrez / Shellpoint","Mr. Cooper / Nationstar",
  "CrossCountry Mortgage","Guild Mortgage","Finance of America Mortgage","Guaranteed Rate",
  "Movement Mortgage","Navy Federal Credit Union","Veterans United Home Loans",
];

const LIFE_CARRIERS = [
  "Aflac","AIG / American General","Allstate Life","American Equity","American Fidelity","American National (ANICO)",
  "Ameritas Life","Amica Life","Assurity Life","AXA / Equitable Life",
  "Banner Life (Legal & General)","Brighthouse Financial (MetLife)","Cincinnati Life",
  "Corebridge Financial (AIG)","Foresters Financial","Gerber Life",
  "Globe Life","Great-West Life / Empower","Guardian Life",
  "John Hancock","Kansas City Life","Lafayette Life","Liberty Mutual Life",
  "Lincoln Financial","MassMutual","Midland National","Minnesota Life (Securian)",
  "Mutual of Omaha","National Life Group","National Western Life",
  "New York Life","North American Company","Northwestern Mutual",
  "Ohio National","OneAmerica","Pacific Life","Penn Mutual",
  "Principal Financial","Protective Life","Primerica","Prudential",
  "ReliaStar (Voya)","Sammons Financial / Midland","Security Benefit",
  "Securian Financial","Sun Life Financial","Symetra","Transamerica",
  "Unum","USAA Life","Voya Financial","Western & Southern Life",
  "Other",
];

const AUTO_MODELS = {
  "Acura": ["ILX","MDX","MDX A-Spec","MDX Type S","NSX","RDX","RDX A-Spec","TLX","TLX A-Spec","TLX Type S","ZDX"],
  "Audi": ["A3","A3 Sedan","A4","A4 Allroad","A5","A5 Cabriolet","A6","A6 Allroad","A7","A8","e-tron","e-tron GT","e-tron S","e-tron Sportback","Q3","Q4 e-tron","Q5","Q5 Sportback","Q5 e-tron","Q7","Q8","Q8 e-tron","RS 3","RS 5","RS 5 Sportback","RS 6 Avant","RS 7","RS e-tron GT","RS Q8","S3","S4","S5","S5 Cabriolet","S6","S7","S8","SQ5","SQ5 Sportback","SQ7","SQ8","TT","TT RS","TTS"],
  "BMW": ["128i","228i","230i","240i","328i","330e","330i","340i","430i","440i","530e","530i","540i","550e","740i","750e","760i","840i","M2","M3","M3 Competition","M4","M4 Competition","M4 CSL","M5","M5 CS","M8","M8 Competition","X1","X1 sDrive28i","X1 xDrive28i","X2","X3","X3 M","X3 M40i","X3 xDrive30i","X4","X4 M","X4 M40i","X5","X5 M","X5 M60i","X5 xDrive40i","X6","X6 M","X6 M60i","X7","X7 M60i","XM","Z4 sDrive30i","Z4 M40i","i3","i4 eDrive35","i4 eDrive40","i4 M50","i5","i5 M60","i7","i7 M70","iX","iX M60","iX xDrive50"],
  "Buick": ["Enclave","Enclave Avenir","Enclave Essence","Enclave Premium","Encore","Encore GX","Encore GX Avenir","Encore GX Essence","Encore GX Select","Envision","Envision Avenir","Envision Essence","Envision Preferred","Envista","Envista Avenir","Envista Essence"],
  "Cadillac": ["CT4","CT4-V","CT4-V Blackwing","CT5","CT5-V","CT5-V Blackwing","Escalade","Escalade ESV","Escalade ESV Platinum","Escalade ESV Premium Luxury","Escalade ESV Sport","Escalade IQ","Escalade Platinum","Escalade Premium Luxury","Escalade Sport","Escalade Sport Platinum","Escalade V","Lyriq","Lyriq Luxury","Lyriq Sport","XT4","XT4 Luxury","XT4 Premium Luxury","XT4 Sport","XT5","XT5 Luxury","XT5 Platinum","XT5 Premium Luxury","XT5 Sport","XT6","XT6 Luxury","XT6 Platinum","XT6 Premium Luxury","XT6 Sport"],
  "Chevrolet": ["Blazer","Blazer EV","Blazer LT","Blazer RS","Blazer SS","Bolt EUV","Bolt EUV LT","Bolt EUV Premier","Bolt EV","Camaro","Camaro 1LT","Camaro 1SS","Camaro 2LT","Camaro 2SS","Camaro LT1","Camaro SS","Camaro ZL1","Colorado","Colorado LT","Colorado Trail Boss","Colorado Work Truck","Colorado Z71","Colorado ZR2","Corvette","Corvette 1LT","Corvette 2LT","Corvette 3LT","Corvette E-Ray","Corvette Stingray","Corvette Z06","Corvette ZR1","Equinox","Equinox EV","Equinox LT","Equinox Premier","Equinox RS","Express","Malibu","Malibu LT","Malibu RS","Silverado 1500","Silverado 1500 Custom","Silverado 1500 High Country","Silverado 1500 LT","Silverado 1500 LTZ","Silverado 1500 RST","Silverado 1500 Trail Boss","Silverado 1500 Work Truck","Silverado 1500 ZR2","Silverado 2500 HD","Silverado 2500 HD Custom","Silverado 2500 HD High Country","Silverado 2500 HD LT","Silverado 2500 HD LTZ","Silverado 2500 HD Work Truck","Silverado 3500 HD","Silverado 3500 HD High Country","Silverado 3500 HD LTZ","Silverado EV","Suburban","Suburban High Country","Suburban LT","Suburban Premier","Suburban RST","Suburban Z71","Tahoe","Tahoe High Country","Tahoe LT","Tahoe Premier","Tahoe RST","Tahoe Z71","TrailBlazer","TrailBlazer ACTIV","TrailBlazer LT","TrailBlazer RS","Traverse","Traverse High Country","Traverse LT","Traverse Premier","Traverse RS","Trax","Trax ACTIV","Trax LT","Trax RS"],
  "Chrysler": ["300","300C","300S","300 Touring","Pacifica","Pacifica Hybrid","Pacifica Hybrid Limited","Pacifica Hybrid Pinnacle","Pacifica Hybrid Touring","Pacifica Hybrid Touring L","Pacifica Limited","Pacifica Pinnacle","Pacifica Touring","Pacifica Touring L","Pacifica Touring L Plus","Voyager","Voyager LX"],
  "Dodge": ["Challenger","Challenger GT","Challenger R/T","Challenger R/T Scat Pack","Challenger R/T Scat Pack Widebody","Challenger SRT 392","Challenger SRT Demon","Challenger SRT Demon 170","Challenger SRT Hellcat","Challenger SRT Hellcat Redeye","Challenger SRT Hellcat Redeye Widebody","Charger","Charger Daytona","Charger Daytona R/T","Charger Daytona Scat Pack","Charger GT","Charger R/T","Charger R/T Road & Track","Charger Scat Pack","Charger Scat Pack Widebody","Charger SRT 392","Charger SRT Hellcat","Charger SRT Hellcat Redeye","Charger SRT Hellcat Widebody","Durango","Durango Citadel","Durango GT","Durango GT Plus","Durango Pursuit","Durango R/T","Durango R/T Plus","Durango SRT 392","Durango SRT Hellcat"],
  "Ford": ["Bronco","Bronco Badlands","Bronco Base","Bronco Big Bend","Bronco Black Diamond","Bronco Heritage","Bronco Heritage Limited","Bronco Outer Banks","Bronco Raptor","Bronco Wildtrak","Bronco Sport","Bronco Sport Badlands","Bronco Sport Base","Bronco Sport Big Bend","Bronco Sport Outer Banks","E-Transit","EcoSport","Edge","Edge SE","Edge SEL","Edge ST","Edge ST-Line","Edge Titanium","Escape","Escape Active","Escape Hybrid","Escape PHEV","Edge ST","Escape SE","Escape SEL","Escape ST-Line","Escape Titanium","Expedition","Expedition King Ranch","Expedition King Ranch Max","Expedition Limited","Expedition Limited Max","Expedition Max","Expedition Max King Ranch","Expedition Max Limited","Expedition Max Platinum","Expedition Max Timberline","Expedition Max XLT","Expedition Platinum","Expedition Timberline","Expedition XL","Expedition XLT","Explorer","Explorer Base","Explorer King Ranch","Explorer Platinum","Explorer ST","Explorer ST-Line","Explorer Timberline","Explorer XLT","F-150","F-150 King Ranch","F-150 Lariat","F-150 Lightning","F-150 Lightning Flash","F-150 Lightning Lariat","F-150 Lightning Platinum","F-150 Lightning Pro","F-150 Limited","F-150 Platinum","F-150 PowerBoost Hybrid","F-150 Raptor","F-150 Raptor R","F-150 Tremor","F-150 XL","F-150 XLT","F-250 King Ranch","F-250 Lariat","F-250 Platinum","F-250 Tremor","F-250 XL","F-250 XLT","F-350 King Ranch","F-350 Lariat","F-350 Platinum","F-350 Tremor","F-350 XL","F-350 XLT","F-450 King Ranch","F-450 Lariat","F-450 Platinum","Maverick","Maverick Lariat","Maverick Tremor","Maverick XL","Maverick XLT","Mustang","Mustang Dark Horse","Mustang EcoBoost","Mustang EcoBoost Premium","Mustang GT","Mustang GT Performance","Mustang GT Premium","Mustang Mach 1","Mustang Mach-E","Mustang Mach-E California Route 1","Mustang Mach-E GT","Mustang Mach-E GT Performance","Mustang Mach-E Premium","Mustang Mach-E Rally","Mustang Mach-E Select","Mustang Shelby GT350","Mustang Shelby GT350R","Mustang Shelby GT500","Ranger","Ranger Lariat","Ranger Raptor","Ranger XL","Ranger XLT","Transit","Transit Connect","Transit Connect Titanium","Transit Connect XL","Transit Connect XLT"],
  "GMC": ["Acadia","Acadia AT4","Acadia Denali","Acadia SLE","Acadia SLT","Canyon","Canyon AT4","Canyon AT4X","Canyon Denali","Canyon Elevation","Canyon SLE","Canyon SLT","Envoy","Envoy Denali","Envoy SLT","Sierra 1500","Sierra 1500 AT4","Sierra 1500 AT4X","Sierra 1500 Base","Sierra 1500 Denali","Sierra 1500 Denali Ultimate","Sierra 1500 Elevation","Sierra 1500 Pro","Sierra 1500 SLE","Sierra 1500 SLT","Sierra 2500 HD","Sierra 2500 HD AT4","Sierra 2500 HD AT4X","Sierra 2500 HD Denali","Sierra 2500 HD Pro","Sierra 2500 HD SLE","Sierra 2500 HD SLT","Sierra 3500 HD","Sierra 3500 HD AT4","Sierra 3500 HD AT4X","Sierra 3500 HD Denali","Sierra 3500 HD Pro","Sierra 3500 HD SLE","Sierra 3500 HD SLT","Sierra EV Denali","Terrain","Terrain AT4","Terrain Denali","Terrain SLE","Terrain SLT","Yukon","Yukon AT4","Yukon Denali","Yukon Denali Ultimate","Yukon SLE","Yukon SLT","Yukon XL","Yukon XL AT4","Yukon XL Denali","Yukon XL Denali Ultimate","Yukon XL SLE","Yukon XL SLT"],
  "Honda": ["Accord","Accord Hybrid","Accord Hybrid Sport","Accord Hybrid Touring","Accord Sport","Accord Sport 2.0T","Accord Touring","Accord Touring 2.0T","CR-V","CR-V EX","CR-V EX-L","CR-V Hybrid","CR-V Hybrid EX","CR-V Hybrid EX-L","CR-V Hybrid Sport","CR-V Hybrid Sport Touring","CR-V Hybrid Touring","CR-V LX","CR-V Sport","CR-V Sport Touring","Civic","Civic EX","Civic EX-L","Civic Hatchback","Civic LX","Civic Si","Civic Sport","Civic Sport Touring","Civic Touring","Civic Type R","HR-V","HR-V EX","HR-V EX-L","HR-V LX","HR-V Sport","Odyssey","Odyssey EX","Odyssey EX-L","Odyssey Elite","Odyssey LX","Odyssey Touring","Passport","Passport Elite","Passport EX-L","Passport Sport","Passport TrailSport","Pilot","Pilot Black Edition","Pilot EX","Pilot EX-L","Pilot Elite","Pilot LX","Pilot Sport","Pilot TrailSport","Pilot Touring","Prologue","Ridgeline","Ridgeline Black Edition","Ridgeline RTL","Ridgeline RTL-E","Ridgeline Sport","Ridgeline TrailSport"],
  "Hyundai": ["Elantra","Elantra Limited","Elantra N","Elantra N Line","Elantra SE","Elantra SEL","Ioniq 5","Ioniq 5 Limited","Ioniq 5 N","Ioniq 5 SE","Ioniq 5 SEL","Ioniq 6","Ioniq 6 Limited","Ioniq 6 SE","Ioniq 6 SEL","Kona","Kona Electric","Kona Essential","Kona Limited","Kona N","Kona N Line","Kona SEL","Palisade","Palisade Calligraphy","Palisade Limited","Palisade SE","Palisade SEL","Santa Cruz","Santa Cruz Limited","Santa Cruz SEL","Santa Cruz SEL Premium","Santa Cruz XRT","Santa Fe","Santa Fe Calligraphy","Santa Fe Hybrid","Santa Fe Limited","Santa Fe PHEV","Santa Fe SE","Santa Fe SEL","Sonata","Sonata Limited","Sonata N Line","Sonata SE","Sonata SEL","Tucson","Tucson Hybrid","Tucson Limited","Tucson N Line","Tucson PHEV","Tucson SE","Tucson SEL","Venue","Venue Denim","Venue SE","Venue SEL"],
  "Infiniti": ["Q50","Q50 Luxe","Q50 Red Sport 400","Q50 Sensory","Q60","Q60 Luxe","Q60 Red Sport 400","Q60 Sensory","QX50","QX50 Essential","QX50 Luxe","QX50 Sensory","QX55","QX55 Essential","QX55 Luxe","QX55 Sensory","QX60","QX60 Autograph","QX60 Luxe","QX60 Pure","QX60 Sensory","QX80","QX80 Autograph","QX80 Luxe","QX80 Sensory"],
  "Jeep": ["Cherokee","Cherokee Altitude","Cherokee Latitude","Cherokee Latitude Plus","Cherokee Limited","Cherokee Overland","Cherokee Trailhawk","Compass","Compass Altitude","Compass Latitude","Compass Latitude Lux","Compass Limited","Compass Trailhawk","Gladiator","Gladiator Mojave","Gladiator Overland","Gladiator Rubicon","Gladiator Sport","Gladiator Sport S","Gladiator Texas Trail","Grand Cherokee","Grand Cherokee 4xe","Grand Cherokee Altitude","Grand Cherokee L","Grand Cherokee L Altitude","Grand Cherokee L Limited","Grand Cherokee L Overland","Grand Cherokee L Summit","Grand Cherokee L Summit Reserve","Grand Cherokee L Trailhawk","Grand Cherokee Limited","Grand Cherokee Overland","Grand Cherokee Summit","Grand Cherokee Summit Reserve","Grand Cherokee Trailhawk","Grand Wagoneer","Grand Wagoneer L","Renegade","Renegade Altitude","Renegade Latitude","Renegade Limited","Renegade Sport","Renegade Trailhawk","Wrangler","Wrangler 4xe","Wrangler 4xe Rubicon","Wrangler Altitude","Wrangler Rubicon","Wrangler Rubicon 392","Wrangler Sahara","Wrangler Sport","Wrangler Sport S","Wrangler Unlimited","Wrangler Willys","Wrangler Willys Sport"],
  "Kia": ["Carnival","Carnival EX","Carnival EX+","Carnival LX","Carnival SX","Carnival SX Prestige","EV6","EV6 GT","EV6 GT-Line","EV6 Light","EV6 Wind","EV9","K5","K5 EX","K5 GT","K5 GT-Line","K5 LX","Niro","Niro EV","Niro EX","Niro EX Touring","Niro Hybrid","Niro PHEV","Niro Wind","Seltos","Seltos EX","Seltos LX","Seltos Nightfall","Seltos S","Seltos SX","Seltos SX Turbo","Sorento","Sorento EX","Sorento Hybrid","Sorento LX","Sorento PHEV","Sorento S","Sorento SX","Sorento SX Prestige","Soul","Soul EX","Soul GT-Line","Soul LX","Soul S","Sportage","Sportage EX","Sportage HEV","Sportage LX","Sportage PHEV","Sportage S","Sportage SX","Sportage SX Prestige","Sportage X-Line","Sportage X-Pro","Stinger","Stinger GT","Stinger GT-Line","Stinger GT1","Stinger GT2","Telluride","Telluride EX","Telluride LX","Telluride Nightfall","Telluride S","Telluride SX","Telluride SX Prestige","Telluride X-Line","Telluride X-Pro"],
  "Lexus": ["ES 250","ES 300h","ES 300h F Sport","ES 350","ES 350 F Sport","GS 350","GX 460","GX 460 Premium","GX 550","GX 550 Overtrail","GX 550 Overtrail+","GX 550 Premium Plus","IS 300","IS 350","IS 350 F Sport","IS 500 F Sport Performance","LC 500","LC 500 Convertible","LC 500 Inspiration Series","LC 500h","LS 500","LS 500 F Sport","LS 500h","LX 600","LX 600 F Sport","LX 600 Premium","LX 600 Ultra Luxury","NX 250","NX 250 F Sport","NX 350","NX 350 F Sport","NX 350h","NX 350h F Sport","NX 450h+","NX 450h+ F Sport","RC 300","RC 300 F Sport","RC 350","RC 350 F Sport","RC F","RC F Track Edition","RX 350","RX 350 F Sport","RX 350 Premium","RX 350h","RX 350h F Sport","RX 450h+","RX 450h+ F Sport","RX 500h F Sport Performance","TX 350","TX 350 F Sport","TX 500h","TX 550h+","UX 200","UX 200 F Sport","UX 250h","UX 250h F Sport","UX 300h"],
  "Lincoln": ["Aviator","Aviator Black Label","Aviator Grand Touring","Aviator Reserve","Aviator Standard","Corsair","Corsair Grand Touring","Corsair Reserve","Corsair Standard","Nautilus","Nautilus Black Label","Nautilus Reserve","Nautilus Standard","Navigator","Navigator Black Label","Navigator L","Navigator L Black Label","Navigator L Reserve","Navigator L Standard","Navigator Reserve","Navigator Standard"],
  "Mazda": ["CX-30","CX-30 Carbon Edition","CX-30 Preferred","CX-30 Premium","CX-30 Select","CX-5","CX-5 Carbon Edition","CX-5 Carbon Turbo","CX-5 Preferred","CX-5 Premium","CX-5 Premium Plus","CX-5 Select","CX-5 Turbo","CX-50","CX-50 Carbon Turbo","CX-50 Meridian","CX-50 Preferred","CX-50 Premium","CX-50 Select","CX-50 Turbo","CX-70","CX-90","CX-90 PHEV","Mazda3","Mazda3 Carbon Edition","Mazda3 Hatchback","Mazda3 Preferred","Mazda3 Premium","Mazda3 Select","Mazda6","MX-5 Miata","MX-5 Miata Club","MX-5 Miata Grand Touring","MX-5 Miata RF","MX-5 Miata RF Club","MX-5 Miata RF Grand Touring","MX-5 Miata Sport"],
  "Mercedes-Benz": ["A 220","AMG GT 43","AMG GT 53","AMG GT 63","AMG GT 63 S E Performance","C 300","C 300 4MATIC","C 43 AMG","C 63 S AMG","C 63 S E Performance AMG","CLA 250","CLA 250 4MATIC","CLA 35 AMG","CLA 45 S AMG","CLE 300","CLE 300 4MATIC","CLE 53 AMG","E 350","E 350 4MATIC","E 450","E 450 4MATIC","E 53 AMG","E 63 S AMG","EQB 250+","EQB 300","EQB 350","EQE 350","EQE 350+","EQE 500","EQE 53 AMG","EQS 450+","EQS 450 4MATIC","EQS 580 4MATIC","EQS 53 AMG","G 550","G 63 AMG","G 580 EQ","GLA 250","GLA 250 4MATIC","GLA 35 AMG","GLA 45 S AMG","GLB 250","GLB 250 4MATIC","GLB 35 AMG","GLC 300","GLC 300 4MATIC","GLC 300 Coupe","GLC 43 AMG","GLC 43 AMG 4MATIC","GLC 63 S AMG","GLE 350","GLE 350 4MATIC","GLE 450","GLE 450 4MATIC","GLE 53 AMG","GLE 580","GLE 63 S AMG","GLS 450","GLS 450 4MATIC","GLS 580","GLS 63 AMG","Metris","S 500","S 500 4MATIC","S 580","S 580 4MATIC","S 63 AMG","SL 43","SL 55 AMG","SL 63 AMG","Sprinter 1500","Sprinter 2500","Sprinter 3500"],
  "Nissan": ["Altima","Altima Platinum","Altima SR","Altima SR VC-Turbo","Altima SV","Altima SV VC-Turbo","Ariya","Ariya Engage","Ariya Engage+","Ariya Evolve","Ariya Evolve+","Ariya Venture+","Armada","Armada Platinum","Armada SL","Armada SV","Frontier","Frontier Crew Cab Pro-4X","Frontier Crew Cab SV","Frontier King Cab SV","Frontier Pro-4X","Frontier PRO-X","Frontier SV","Kicks","Kicks S","Kicks SR","Kicks SV","Leaf","Leaf Plus S","Leaf Plus SL","Leaf Plus SV","Leaf S","Leaf SL","Leaf SV","Maxima","Maxima Platinum","Maxima SR","Maxima SV","Murano","Murano Platinum","Murano SL","Murano SV","Pathfinder","Pathfinder Platinum","Pathfinder Rock Creek","Pathfinder S","Pathfinder SL","Pathfinder SV","Rogue","Rogue Midnight Edition","Rogue Platinum","Rogue S","Rogue SL","Rogue SV","Rogue SV Premium","Sentra","Sentra S","Sentra SR","Sentra SV","Titan","Titan Crew Cab Pro-4X","Titan Crew Cab SV","Titan Pro-4X","Titan SV","Titan XD","Titan XD Pro-4X","Titan XD SV","Versa","Versa S","Versa SR","Versa SV","Z","Z A-Spec","Z Nismo","Z Performance","Z Proto Spec","Z Sport"],
  "Ram": ["1500","1500 Big Horn","1500 Big Horn Night Edition","1500 Classic","1500 Classic Express","1500 Classic SLT","1500 Classic Tradesman","1500 Laramie","1500 Laramie G/T","1500 Laramie Longhorn","1500 Limited","1500 Limited 10th Anniversary","1500 Limited Longhorn","1500 Night Edition","1500 Rebel","1500 Rebel G/T","1500 RHO","1500 TRX","1500 Tradesman","2500","2500 Big Horn","2500 Laramie","2500 Laramie Longhorn","2500 Limited","2500 Power Wagon","2500 SLT","2500 Tradesman","3500","3500 Big Horn","3500 Laramie","3500 Laramie Longhorn","3500 Limited","3500 SLT","3500 Tradesman","ProMaster 1500","ProMaster 2500","ProMaster 3500","ProMaster City","ProMaster City Tradesman","ProMaster City Wagon"],
  "Subaru": ["Ascent","Ascent Limited","Ascent Onyx Edition","Ascent Onyx Edition Limited","Ascent Premium","Ascent Touring","BRZ","BRZ Limited","BRZ Premium","BRZ tS","Crosstrek","Crosstrek Hybrid","Crosstrek Limited","Crosstrek Premium","Crosstrek Sport","Forester","Forester Limited","Forester Onyx Edition","Forester Onyx Edition XT","Forester Premium","Forester Sport","Forester Touring","Impreza","Impreza Premium","Impreza RS","Impreza Sport","Legacy","Legacy Limited","Legacy Limited XT","Legacy Onyx Edition XT","Legacy Premium","Legacy Sport","Outback","Outback Limited","Outback Limited XT","Outback Onyx Edition","Outback Onyx Edition XT","Outback Premium","Outback Touring","Outback Touring XT","Outback Wilderness","Solterra","Solterra Premium","Solterra Touring","WRX","WRX GT","WRX Premium","WRX Sport","WRX TR"],
  "Tesla": ["Cybertruck","Cybertruck All-Wheel Drive","Cybertruck Beast","Cybertruck Foundation Series","Cybertruck Rear-Wheel Drive","Model 3","Model 3 Long Range All-Wheel Drive","Model 3 Performance","Model 3 Rear-Wheel Drive","Model S","Model S Long Range","Model S Plaid","Model X","Model X Long Range","Model X Plaid","Model Y","Model Y Long Range All-Wheel Drive","Model Y Performance","Model Y Rear-Wheel Drive","Roadster","Semi"],
  "Toyota": ["4Runner","4Runner Limited","4Runner Nightshade","4Runner SR5","4Runner SR5 Premium","4Runner TRD Off-Road","4Runner TRD Off-Road Premium","4Runner TRD Pro","4Runner Trailhunter","4Runner Venture","Avalon","Avalon Hybrid","Avalon Hybrid Limited","Avalon Hybrid XLE","Avalon Limited","Avalon XLE","Avalon XSE","bZ4X","bZ4X XLE","bZ4X XLE Premium","Camry","Camry Hybrid","Camry Hybrid LE","Camry Hybrid SE","Camry Hybrid XLE","Camry Hybrid XSE","Camry LE","Camry SE","Camry SE Nightshade","Camry TRD","Camry XLE","Camry XSE","Corolla","Corolla Cross","Corolla Cross Hybrid","Corolla Cross L","Corolla Cross LE","Corolla Cross S","Corolla Cross XLE","Corolla Hatchback","Corolla Hybrid","Corolla LE","Corolla SE","Corolla XLE","Corolla XSE","GR86","GR86 Premium","GR Corolla","GR Corolla Circuit Edition","GR Corolla Core","GR Corolla Morizo Edition","GR Supra","GR Supra 2.0","GR Supra 3.0","GR Supra A91-CF Edition","GR Supra A91-MT Edition","Highlander","Highlander Hybrid","Highlander Hybrid Limited","Highlander Hybrid Platinum","Highlander Hybrid XLE","Highlander L","Highlander LE","Highlander Limited","Highlander Platinum","Highlander XLE","Land Cruiser","Land Cruiser 1958","Prius","Prius LE","Prius Limited","Prius Night Shade","Prius PHEV","Prius Prime","Prius Prime Premium","Prius Prime SE","Prius Prime XSE","Prius XLE","RAV4","RAV4 Adventure","RAV4 Hybrid","RAV4 Hybrid Limited","RAV4 Hybrid SE","RAV4 Hybrid XLE","RAV4 Hybrid XLE Premium","RAV4 Hybrid XSE","RAV4 LE","RAV4 Limited","RAV4 Prime","RAV4 Prime SE","RAV4 Prime XSE","RAV4 TRD Off-Road","RAV4 XLE","RAV4 XLE Premium","Sequoia","Sequoia Capstone","Sequoia Limited","Sequoia Platinum","Sequoia SR5","Sequoia TRD Pro","Sienna","Sienna LE","Sienna Limited","Sienna Platinum","Sienna SE","Sienna XLE","Sienna XSE","Tacoma","Tacoma Limited","Tacoma PreRunner","Tacoma SR","Tacoma SR5","Tacoma TRD Off-Road","Tacoma TRD Pro","Tacoma TRD Sport","Tacoma Trailhunter","Tacoma Tundra Trail","Tundra","Tundra 1794 Edition","Tundra Capstone","Tundra Limited","Tundra Platinum","Tundra SR","Tundra SR5","Tundra TRD Pro","Venza","Venza LE","Venza Limited","Venza XLE"],
  "Volkswagen": ["Arteon","Arteon R-Line","Arteon SE","Arteon SEL","Arteon SEL Premium","Atlas","Atlas Cross Sport","Atlas Cross Sport Peak Edition","Atlas Cross Sport SE","Atlas Cross Sport SEL","Atlas Cross Sport SEL Premium","Atlas Peak Edition","Atlas SE","Atlas SE Technology","Atlas SEL","Atlas SEL Premium","Golf","Golf GTI","Golf GTI Autobahn","Golf GTI S","Golf GTI SE","Golf R","ID.4","ID.4 AWD Pro","ID.4 AWD Pro S","ID.4 Pro","ID.4 Pro S","ID.4 S","ID.4 Standard Range","ID.Buzz","Jetta","Jetta GLI","Jetta GLI Autobahn","Jetta R-Line","Jetta S","Jetta SE","Jetta SEL","Passat","Taos","Taos S","Taos SE","Taos SEL","Tiguan","Tiguan S","Tiguan SE","Tiguan SE R-Line Black","Tiguan SEL","Tiguan SEL Premium","Tiguan SEL R-Line"],
};
const emptyRealEstate = { description:"", descriptionNote:"", purchaseDate:"", purchasePrice:"", marketValue:"", mortgageBalance:"", address:"", addressLine2:"", city:"", state:"", zip:"", mortgageCompany:"", originationDate:"", interestRate:"", monthlyPmt:"", propertyTaxes:"", insurance:"", pmtIncludesTaxIns:null, hasOpt:null, optEvent:"", optTimeframe:"", hasZillow:null };
const emptyAccount = { type:"", institution:"", accountNumber:"", balance:"", owner:"", qualified:"", hasOpt:null, optEvent:"", optTimeframe:"", hasRmdOrContrib:null, rmdOrContrib:"", rmdContribAmount:"", rmdContribFrequency:"", linkedIncomeId:null, hasContributions:null, contribAmount:"", contribFrequency:"" };

const DEFAULT_INSTITUTIONS = ["Allianz","Ally Bank","American Century","American Equity","American Funds","Ameriprise","Ameritas","Athene","AXA","Bank of America","Betterment","BlackRock","BNY Mellon","Brighthouse Financial","Capital One","Charles Schwab","Chase / JPMorgan","Citibank","Corebridge Financial","Delaware Life","E*TRADE","Edward Jones","Empower","Equitable","F&G","Fidelity","Fifth Third Bank","Franklin Templeton","Global Atlantic","Goldman Sachs","Great American","Guggenheim","Interactive Brokers","Invesco","Jackson Nat'l","Janus Henderson","John Hancock","Lincoln Financial","LPL Financial","MassMutual","Merrill Lynch","MetLife","Midland National","Minnesota Life","Morgan Stanley","Mutual of Omaha","Nationwide","Navy Federal","New York Life","North American","Northwestern Mutual","Oppenheimer","Osaic","Pacific Life","Pershing","PNC Bank","Principal","Protective Life","Prudential","Raymond James","Regions Bank","Robinhood","Sammons / Midland","Security Benefit","State Farm","Stifel","Symetra","T. Rowe Price","TD Ameritrade","Thrivent","TIAA","Transamerica","Truist","TSP (Thrift Savings Plan)","UBS","US Bank","USAA","Vanguard","Veritas","Voya","Wealthfront","Wells Fargo","Western & Southern","Shopoff","Millgreen"];

const ACCOUNT_TYPE_GROUPS = [
  { group: "Cash & Cash Equivalents — Liquid Cash",      types: ["Checking","Savings","Money Market","CD"] },
  { group: "Mutual Funds — Investment Funds",            types: ["Mutual Fund (Equity)","Mutual Fund (Bond)","Mutual Fund (Balanced)","Mutual Fund (Index)"] },
  { group: "ETFs — Exchange-Traded Funds",               types: ["ETF (Stock)","ETF (Bond)"] },
  { group: "Stocks — Individual Stocks",                 types: ["Stocks (Individual)"] },
  { group: "Bonds — Fixed-Income Securities",            types: ["Bonds (Treasury)","Bonds (Municipal)","Bonds (Corporate)"] },
  { group: "Annuities — Insurance-Based Investments",    types: ["Annuity (Fixed)","Annuity (Fixed Indexed)","Annuity (Variable)","Annuity (RILA)"] },
  { group: "Retirement Accounts — Tax-Advantaged",       types: ["Traditional IRA","Roth IRA","401(k)","Roth 401(k)","403(b)","457(b)","SEP IRA","SIMPLE IRA","HSA","529 / Education","Pension / Defined Benefit"] },
  { group: "Real Estate — Real Property",                types: ["Personal Residence","Rental Property","Land / Lot"] },
  { group: "Alternative Investments — Non-Traditional",  types: ["Private Equity","REITs","Oil & Gas","Storage Funds","Non-Qualified Brokerage","Trust Account"] },
  { group: "Business Interests — Ownership",             types: ["LLC Interest","Partnership Interest","Corporate Shares"] },
  { group: "Insurance — Asset Value Only",               types: ["Life Insurance (Cash Value)"] },
  { group: "Personal Property — Optional",               types: ["Vehicle","Collectibles","Jewelry"] },
  { group: "Other",                                      types: ["Other"] },
];
const ACCOUNT_TYPES = ACCOUNT_TYPE_GROUPS.flatMap(g => g.types);
const ACCOUNT_REG_TYPES = ["N/A","Traditional IRA","Roth IRA","Inherited IRA","SEP IRA","SIMPLE IRA","401(k)","Roth 401(k)","403(b)","457(b)","Pension / Defined Benefit","HSA","529 / Education","UTMA / UGMA","Non-Qualified (Individual)","Non-Qualified (Joint)","Trust Account","Checking","Savings","Other"];
const INVESTMENT_TYPES = ["Stocks","Bonds","Mutual Funds","ETFs","CDs","Money Market","Cash","Fixed Annuity","Fixed Indexed Annuity","Variable Annuity","RILA Annuity","REITs","Alternative Investments","Private Equity","Oil & Gas","Other"];

const INCOME_TYPES = [
  "Account Withdrawal",
  "Alimony / Child Support",
  "Employment — W2",
  "Investment / Dividends",
  "Other",
  "Pension",
  "Rental Income",
  "Self-Employment / 1099",
  "Social Security",
  "TRS (Teacher Retirement)",
  "Withdrawal — NQ",
  "Withdrawal — Q",
];

const INCOME_SOURCES = [
  "Employer","Self-Employed","1099 — Contract / Freelance","Social Security","Pension",
  "TMRS (Texas Municipal Retirement)","TRS (Teacher Retirement System)","FERS (Federal Employee Retirement)",
  "CSRS (Civil Service Retirement)","Military Retirement","Railroad Retirement","State / Government Pension",
  "Annuity","Rental / Real Estate","Investment / Dividends","Trust Distribution","Inheritance",
  "Alimony / Child Support","Disability Income","Other",
];
const emptyIncome      = { type:"", source:"", amount:"", frequency:"", owner:"client", institution:"", futureIncome:"", futureIncomeDate:"" };
const emptyChild       = { firstName:"", middleName:"", lastName:"", dob:"", gender:"", isBeneficiary: false, ssn:"", relationship:"Child", percentage:"", designationType:"primary", email:"", phone:"", usCitizen:"", countryOfCitizenship:"", addressLine1:"", addressLine2:"", city:"", state:"", zip:"" };
const emptyBeneficiary = { firstName:"", middleName:"", lastName:"", dob:"", gender:"", ssn:"", relationship:"", percentage:"", designationType:"primary", email:"", addressSource:"manual", addressLine1:"", city:"", state:"", zip:"" };
// Backward-compat: old records used `type:"Primary"/"Contingent"`, new ones use `designationType`
const getDesignType = b => b.designationType || (b.type?.toLowerCase() === "contingent" ? "contingent" : "primary");

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ["DC","District of Columbia"],
];

const COUNTRIES = [
  "USA","Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts & Nevis","Saint Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const DropDown = ({ value, onChange, options, style, placeholder = "— Select —" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const chosen = options.find(o => (o.value !== undefined ? o.value : o) === value);
  const label = chosen ? (chosen.label != null ? chosen.label : String(chosen)) : "";
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ ...style, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}
      >
        <span style={{ color: label ? "inherit" : "#9aa3af" }}>{label || placeholder}</span>
        <span style={{ fontSize: 10, marginLeft: 6, opacity: 0.5 }}>▾</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 9999, background: "#fff", border: "1px solid #cfd5de", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "100%", maxHeight: 260, overflowY: "auto", marginTop: 2 }}>
          {options.map((o, i) => {
            const v = o.value !== undefined ? o.value : o;
            const l = o.label != null ? o.label : String(o);
            return (
              <div key={i} onMouseDown={() => { onChange(v); setOpen(false); }}
                style={{ padding: "8px 14px", fontSize: 13.5, cursor: "pointer", background: v === value ? "#f0f4ff" : "transparent", color: v === value ? "#2f3a4a" : "#151b28", fontWeight: v === value ? 600 : 400 }}
                onMouseEnter={e => e.currentTarget.style.background = "#f4f6f9"}
                onMouseLeave={e => e.currentTarget.style.background = v === value ? "#f0f4ff" : "transparent"}
              >{l || <span style={{ color: "#9aa3af" }}>{placeholder}</span>}</div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CountrySelect = ({ value, onChange, style }) => (
  <select data-lpignore="true" value={value || ""} onChange={onChange} style={style || IS}>
    <option value="">— Select —</option>
    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
);

const StateSelect = ({ value, onChange, style }) => (
  <select data-lpignore="true" value={value || ""} onChange={onChange} style={{ ...IS, width: 240, ...style }}>
    <option value="">— Select —</option>
    {US_STATES.map(([abbr, name]) => (
      <option key={abbr} value={abbr}>{abbr} — {name}</option>
    ))}
  </select>
);

const RELATIONSHIP_TYPES = [
  "Spouse","Domestic Partner",
  "Child","Stepchild","Adopted Child",
  "Grandchild","Great-Grandchild",
  "Parent","Stepparent","Grandparent",
  "Sibling","Half-Sibling","Step-Sibling",
  "Aunt / Uncle","Niece / Nephew","Cousin",
  "In-Law","Friend","Business Partner",
  "Trust","Estate","Charity / Organization","Other",
];

function ConfirmDialog({ message, confirmLabel = "Confirm", onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, pointerEvents: "none" }}>
      <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
        pointerEvents: "all", background: "#fff", border: "1px solid #e1e4ea",
        borderRadius: 14, padding: "22px 28px 20px", boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        maxWidth: 420, width: "90vw", textAlign: "center" }}>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#151b28", lineHeight: 1.6, whiteSpace: "pre-line" }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel}  style={{ padding: "8px 22px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1px solid #cfd5de", background: "#fff", color: "#151b28", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 22px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", background: "#2f3a4a", color: "#fff", cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ClientRoster({ clients, onDelete, onOpen, onDuplicate, onBack, onConfirm, onExport, onImport, currentName, currentType }) {
  const importRef = useRef(null);
  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh", color: INK }}>
      <div style={{ background: NAV, borderBottom: "1px solid " + BORDER, padding: "20px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}>Saved Clients</h1>
            <p style={{ margin: 0, marginTop: 3, fontSize: 13, color: MUTED }}>
              Russell Wealth Group · {clients.length} record{clients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input ref={importRef} type="file" accept=".json" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => { onImport(ev.target.result); }; r.readAsText(f); } e.target.value = ""; }} />
            <button onClick={() => importRef.current?.click()} style={{ background: "#fff", border: "1px solid " + BORDER, color: INK, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>⬆ Import Backup</button>
            <button onClick={() => { fetch(import.meta.env.BASE_URL + "server-backup.json").then(r => r.text()).then(t => onImport(t)).catch(() => alert("Could not load server backup.")); }} style={{ background: "#fff", border: "1px solid " + BORDER, color: INK, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>☁ Load Server Backup</button>
            <button onClick={onExport} style={{ background: "#fff", border: "1px solid " + BORDER, color: INK, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>⬇ Export Backup</button>
            <button onClick={onBack} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
              {currentName ? `← Return to ${currentName}` : "← New Intake"}
            </button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
        {clients.length === 0 ? (
          <div style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 14, padding: 36, textAlign: "center" }}>
            <div style={{ fontSize: 15, color: INK }}>No saved clients yet.</div>
          </div>
        ) : clients.filter(c => c && c.client).map(c => {
          const totalAssets = [
            ...(c.accounts || []).map(a => parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0)),
            ...(c.realEstate || []).map(r => parseInt((r.marketValue || "").replace(/[^0-9]/g, "") || 0)),
          ].reduce((a, b) => a + b, 0);
          return (
            <div key={c.id} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 14, padding: "18px 22px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 17, fontWeight: "bold", color: INK }}>{c.client?.firstName} {c.client?.lastName}</div>
                  <span style={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: c.recordType === "client" ? "#4caf50" : "#f0a500", border: `1px solid ${c.recordType === "client" ? "#4caf50" : "#f0a500"}`, borderRadius: 4, padding: "2px 7px" }}>
                    {c.recordType === "client" ? "Client" : "Prospect"}
                  </span>
                </div>
                {["married","domestic_partner"].includes(c.hasSpouse) && c.spouse?.firstName && (
                  <div style={{ fontSize: 13, color: INK, marginTop: 2 }}>Spouse: {c.spouse.firstName} {c.spouse.lastName}</div>
                )}
                <div style={{ fontSize: 12, color: INK, marginTop: 4 }}>
                  {c.client?.dob && <span style={{ marginRight: 12 }}>DOB: {c.client.dob}</span>}
                  {totalAssets > 0 && <span>Assets: ${totalAssets.toLocaleString()}</span>}
                </div>
                <div style={{ fontSize: 11, color: INK, marginTop: 4, fontStyle: "italic" }}>
                  Last saved: {c.savedAt ? new Date(c.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + new Date(c.savedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => onOpen(c)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Open</button>
                <button onClick={() => onOpen(c)} style={{ background: "#fff", border: "1px solid " + BORDER, color: INK, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Edit</button>
                <button onClick={() => onDuplicate(c)} style={{ background: "#fff", border: "1px solid " + BORDER, color: INK, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Duplicate</button>
                <button onClick={() => onConfirm("Delete this client? This cannot be undone.", () => onDelete(c.id), "Delete")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const openDataFile = (dataUrl, name) => {
  try {
    const [meta, b64] = String(dataUrl).split(",");
    const mime = (meta.match(/data:(.*?)[;,]/) || [])[1] || "application/octet-stream";
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([arr], { type: mime }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch {
    window.open(dataUrl, "_blank");
  }
};

function FileUpload({ section, files = [], onChange, hideLabel = false, onConfirm }) {
  const askConfirm = onConfirm || ((msg, cb) => { if (window.confirm(msg)) cb(); });
  const inputRef = useRef(null);
  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files);
    chosen.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange(section, [...files, {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: ev.target.result,
          uploadedAt: new Date().toISOString(),
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div style={{ marginTop: 16, borderTop: "1px solid " + BORDER, paddingTop: 14 }}>
      {!hideLabel && <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 8 }}>Uploaded Files</div>}
      {files.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {files.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, background: "#f2f4f7", borderRadius: 6, padding: "6px 10px" }}>
              <button onClick={() => openDataFile(f.data, f.name)} title="Click to view" style={{ background: "none", border: "none", padding: 0, color: "#2563eb", fontSize: 13, flex: 1, textAlign: "left", cursor: "pointer", wordBreak: "break-all", textDecoration: "underline" }}>📎 {f.name}</button>
              <a href={f.data} download={f.name} title="Download" style={{ color: INK, fontSize: 14, textDecoration: "none", flexShrink: 0 }}>⬇</a>
              <span style={{ fontSize: 11, color: INK, flexShrink: 0 }}>{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => askConfirm(`Remove "${f.name}"?`, () => onChange(section, files.filter(x => x.id !== f.id)))} style={{ background: "#faeaea", border: "none", color: DANGER, borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12, flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <input ref={inputRef} type="file" multiple style={{ display: "none" }} onChange={handleFiles} />
      <button onClick={() => inputRef.current.click()} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "7px 18px", fontSize: 13, cursor: "pointer" }}>
        + Upload File
      </button>
    </div>
  );
}

const IcSvg = ({ children }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const SECTION_META = {
  "section-profile":    { color: "#3b82f6", bg: "#eef4ff", icon: <IcSvg><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></IcSvg> },
  "section-citizenship":{ color: "#2563eb", bg: "#eff6ff", icon: <IcSvg><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M13 9h6M13 13h4"/></IcSvg> },
  "section-preferences":{ color: "#0d9488", bg: "#f0fdfa", icon: <IcSvg><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></IcSvg> },
  "section-family":     { color: "#8b5cf6", bg: "#f3efff", icon: <IcSvg><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6"/><path d="M17.8 14.6a6.5 6.5 0 0 1 3.7 5.4"/></IcSvg> },
  "section-bene":       { color: "#ec4899", bg: "#fdeef6", icon: <IcSvg><path d="M12 20.5S4 15.5 3 10.5a4.8 4.8 0 0 1 9-2.4 4.8 4.8 0 0 1 9 2.4c-1 5-9 10-9 10z"/></IcSvg> },
  "section-employment": { color: "#f59e0b", bg: "#fdf3e3", icon: <IcSvg><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></IcSvg> },
  "section-income":     { color: "#10b981", bg: "#e7f7f1", icon: <IcSvg><path d="M12 2v20"/><path d="M16.5 5.5h-6a3 3 0 0 0 0 6h3a3 3 0 0 1 0 6h-6"/></IcSvg> },
  "section-realestate": { color: "#14b8a6", bg: "#e6f7f5", icon: <IcSvg><path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/></IcSvg> },
  "section-accounts":   { color: "#6366f1", bg: "#eeeffe", icon: <IcSvg><path d="M12 3L3 9h18z"/><path d="M5 12v6M10 12v6M14 12v6M19 12v6"/><path d="M3 21h18"/></IcSvg> },
  "section-wills":      { color: "#a16207", bg: "#f8f1e2", icon: <IcSvg><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></IcSvg> },
  "section-autos":      { color: "#ef4444", bg: "#fdeeee", icon: <IcSvg><path d="M5 16l1.6-4.8A2 2 0 0 1 8.5 10h7a2 2 0 0 1 1.9 1.2L19 16"/><rect x="3.5" y="16" width="17" height="4" rx="1.5"/><circle cx="7.5" cy="20" r="1.4"/><circle cx="16.5" cy="20" r="1.4"/></IcSvg> },
  "section-debts":      { color: "#dc2626", bg: "#fdeeee", icon: <IcSvg><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></IcSvg> },
  "section-life":       { color: "#06b6d4", bg: "#e5f7fa", icon: <IcSvg><path d="M12 3l7 3v5.5c0 4.6-3.2 7.6-7 9.5-3.8-1.9-7-4.9-7-9.5V6z"/></IcSvg> },
  "section-networth":   { color: "#8b5cf6", bg: "#f0edfe", icon: <IcSvg><path d="M3 17l4-8 4 5 3-3 4 6"/><path d="M3 21h18"/></IcSvg> },
  "section-inheritance":{ color: "#0ea5e9", bg: "#e8f5fd", icon: <IcSvg><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></IcSvg> },
  "section-alerts":     { color: "#ef4444", bg: "#fef2f2", icon: <IcSvg><path d="M10.3 3.5L2.1 17A2 2 0 0 0 3.8 20h16.4a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></IcSvg> },
  "section-importantdates": { color: "#d97706", bg: "#fffbeb", icon: <IcSvg><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></IcSvg> },
  "section-apps":       { color: "#0d9488", bg: "#f0fdfa", icon: <IcSvg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></IcSvg> },
  "section-advisor":    { color: "#7c3aed", bg: "#f5f3ff", icon: <IcSvg><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></IcSvg> },
};

const IconChip = ({ id, size = 28 }) => {
  const meta = SECTION_META[id];
  if (!meta) return null;
  return (
    <span style={{ width: size, height: size, borderRadius: 8, background: meta.bg, color: meta.color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {meta.icon}
    </span>
  );
};

function Panel({ title, children, defaultOpen = true, id }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 14, marginBottom: 20, overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,0.05)" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 11, padding: "15px 22px", cursor: "pointer", userSelect: "none" }}>
        <IconChip id={id} />
        <div style={{ fontSize: 15, fontWeight: 600, color: INK, flex: 1 }}>{title}</div>
        <span style={{ color: MUTED, fontSize: 12, lineHeight: 1 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ padding: "0 22px 20px" }}>{children}</div>}
    </div>
  );
}

function parseDollar(s) {
  if (!s) return 0;
  return parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
}

function toAnnual(amount, freq) {
  const n = parseDollar(amount);
  if (!freq) return n;
  const map = { annual: 1, monthly: 12, bimonthly: 24, biweekly: 26, weekly: 52, quarterly: 4 };
  return n * (map[freq] || 1);
}

function fmt(n) {
  if (!n) return "—";
  return "$" + Math.round(n).toLocaleString();
}

function ClientReport({ data, onClose }) {
  const { client = {}, spouse = {}, hasSpouse, accounts = [], realEstate = [], incomes = [], autos = [], debts = [], businesses = [], beneficiaries = [], children = [], willsTrust = {}, poas = [], annualExpenses = { amount: "", frequency: "monthly" }, homeOwnership = {}, lifePolicies = [] } = data;

  const clientFirst = client.firstName || "";
  const clientLast  = client.lastName  || "";
  const spouseFirst = spouse.firstName || "";
  const spouseLast  = spouse.lastName  || clientLast;
  const clientName  = [clientFirst, client.middleName, clientLast].filter(Boolean).join(" ") || "Client";
  const spouseName  = [spouseFirst, spouse.middleName, spouseLast].filter(Boolean).join(" ") || "Spouse";
  const hasSpouseRecord = ["married","domestic_partner"].includes(hasSpouse);
  // Header: "Bob & Melody Carson" or just "Bob Carson"
  const headerName = (() => {
    if (!clientFirst && !clientLast) return "Client";
    if (!hasSpouseRecord || !spouseFirst) return [clientFirst, clientLast].filter(Boolean).join(" ") || "Client";
    if (clientLast && spouseLast === clientLast) return `${clientFirst} & ${spouseFirst} ${clientLast}`;
    return `${clientFirst} & ${spouseFirst} ${spouseLast}`.trim();
  })();
  const reportDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // ── ASSET CALCULATIONS ──
  const acctTotal = accounts.reduce((s, a) => s + parseDollar(a.balance), 0);
  const reTotal   = realEstate.reduce((s, r) => s + parseDollar(r.marketValue), 0);
  const autoTotal = autos.reduce((s, a) => s + parseDollar(a.value), 0);

  // liabilities
  const reMortgages = realEstate.reduce((s, r) => s + parseDollar(r.mortgageBalance), 0);
  const homeMortgage = parseDollar(homeOwnership.mortgageBalance);
  const debtTotal = debts.reduce((s, d) => s + parseDollar(d.balance), 0);
  const totalAssets = acctTotal + reTotal + autoTotal;
  const totalLiabilities = reMortgages + homeMortgage + debtTotal;
  const netWorth = totalAssets - totalLiabilities;

  // primary residence equity (for net worth ex-home)
  const primaryResidences = realEstate.filter(r => r.description === "Personal Residence");
  const primaryReValue = primaryResidences.reduce((s, r) => s + parseDollar(r.marketValue), 0);
  const primaryReMortgage = primaryResidences.reduce((s, r) => s + parseDollar(r.mortgageBalance), 0);
  const primaryReEquity = primaryReValue - primaryReMortgage;
  const netWorthExHome = netWorth - primaryReEquity;

  // liquid net worth — all accounts except illiquid alternatives and 529
  const ILLIQUID_TYPES = new Set(["Alternative Investments (Illiquid)", "529 / Education"]);
  const liquidAcctTotal = accounts.filter(a => !ILLIQUID_TYPES.has(a.type)).reduce((s, a) => s + parseDollar(a.balance), 0);

  // asset allocation buckets
  const CASH_TYPES    = new Set(["CD", "Checking / Savings", "Money Market"]);
  const QUAL_TYPES    = new Set(["401(k)","403(b)","457(b)","Traditional IRA","Roth IRA","Roth 401(k)","SEP IRA","SIMPLE IRA","Pension / Defined Benefit","HSA"]);
  const ANN_FIXED     = new Set(["Annuity (Fixed)"]);
  const ANN_INDEXED   = new Set(["Annuity (Fixed Indexed)","Annuity (Indexed)"]);
  const ANN_VAR       = new Set(["Annuity (Variable)"]);
  const ANN_RILA      = new Set(["Annuity (RILA)"]);
  const CVLI_TYPES    = new Set(["Life Insurance (Cash Value)"]);
  const ILLIQ_TYPES   = new Set(["Alternative Investments (Illiquid)"]);
  const MF_TYPES      = new Set(["Mutual Funds"]);
  const STOCK_IND     = new Set(["Stocks (Individual)"]);
  const BOND_IND      = new Set(["Bonds (Individual)"]);
  const BROK_TYPES    = new Set(["Non-Qualified Brokerage","Trust Account"]);

  const sumBy = (types) => accounts.filter(a => types.has(a.type)).reduce((s, a) => s + parseDollar(a.balance), 0);
  const cashVal     = sumBy(CASH_TYPES);
  const qualVal     = sumBy(QUAL_TYPES);
  const annFixVal   = sumBy(ANN_FIXED);
  const annIdxVal   = sumBy(ANN_INDEXED);
  const annVarVal   = sumBy(ANN_VAR);
  const annRilaVal  = sumBy(ANN_RILA);
  const cvliVal     = sumBy(CVLI_TYPES);
  const illiqVal    = sumBy(ILLIQ_TYPES);
  const mfVal       = sumBy(MF_TYPES);
  const stockIndVal = sumBy(STOCK_IND);
  const bondIndVal  = sumBy(BOND_IND);
  const brokVal     = sumBy(BROK_TYPES);
  const otherAcctVal = accounts.filter(a => {
    const allKnown = new Set([...CASH_TYPES,...QUAL_TYPES,...ANN_FIXED,...ANN_INDEXED,...ANN_VAR,...ANN_RILA,...CVLI_TYPES,...ILLIQ_TYPES,...MF_TYPES,...STOCK_IND,...BOND_IND,...BROK_TYPES]);
    return !allKnown.has(a.type);
  }).reduce((s, a) => s + parseDollar(a.balance), 0);

  const allocationRows = [
    { label: "Cash (Checking, Savings, Money Market, CDs)", val: cashVal },
    { label: "Individually Traded Stocks", val: stockIndVal },
    { label: "Individually Traded Bonds", val: bondIndVal },
    { label: "Mutual Funds", val: mfVal },
    { label: "Non-Qualified Brokerage / Trust", val: brokVal },
    { label: "Qualified Retirement Plans (401k, IRA, etc.)", val: qualVal },
    { label: "Annuities — Fixed", val: annFixVal },
    { label: "Annuities — Fixed Indexed", val: annIdxVal },
    { label: "Annuities — Variable", val: annVarVal },
    { label: "Annuities — RILA", val: annRilaVal },
    { label: "Cash Value Life Insurance", val: cvliVal },
    { label: "Illiquid Alternative Investments", val: illiqVal },
    { label: "Real Estate (all properties)", val: reTotal },
    { label: "Automobiles", val: autoTotal },
    { label: "Other / Unclassified", val: otherAcctVal },
  ].filter(r => r.val > 0);

  // ── INCOME ── (exclude future income from all calculations/reports)
  const activeIncomes = incomes;
  const annualIncome = activeIncomes.reduce((s, inc) => s + toAnnual(inc.amount, inc.frequency), 0);
  const annExpRaw = parseDollar(annualExpenses.amount) * ((annualExpenses.frequency === "monthly") ? 12 : 1);
  const surplusDeficit = annualIncome - annExpRaw;

  // ── ACCOUNT GROUPINGS ──
  const qualGroups = {};
  accounts.forEach(a => {
    const g = a.qualified || "Unspecified";
    if (!qualGroups[g]) qualGroups[g] = [];
    qualGroups[g].push(a);
  });

  // styles
  const P = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
  const NAVY = "#414f62";
  const BLUE = "#5b6e85";
  const LGRAY = "#f4f6fa";
  const DGRAY = "#4a5a6e";
  const BDR = "1px solid #e1e4ea";

  const s = {
    page: { fontFamily: P, color: "#151b28", background: "#fff", maxWidth: 900, margin: "0 auto", padding: "0 0 60px" },
    header: { background: NAVY, color: "#fff", padding: "32px 40px 24px", borderRadius: "10px 10px 0 0" },
    firmName: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c7d0db", marginBottom: 6 },
    clientName: { fontSize: 32, fontWeight: "bold", margin: "0 0 4px" },
    sub: { fontSize: 14, color: "#d5dce5", marginTop: 2 },
    reportTitle: { fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c7d0db", marginTop: 10 },
    body: { padding: "0 40px" },
    sectionHead: { fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: BLUE, borderBottom: "2px solid " + BLUE, paddingBottom: 6, marginTop: 32, marginBottom: 12, fontWeight: "bold", textAlign: "center" },
    kpiRow: { display: "flex", gap: 16, marginTop: 20, marginBottom: 8, flexWrap: "wrap" },
    kpi: { flex: 1, minWidth: 140, background: LGRAY, border: BDR, borderRadius: 8, padding: "14px 18px" },
    kpiLbl: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#697180", marginBottom: 4 },
    kpiVal: { fontSize: 22, fontWeight: "bold", color: NAVY, textAlign: "right" },
    kpiSub: { fontSize: 11, color: "#697180", marginTop: 2, textAlign: "right" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 },
    th: { textAlign: "center", padding: "7px 10px", background: DGRAY, color: "#fff", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" },
    td: { padding: "7px 10px", borderBottom: BDR, verticalAlign: "top" },
    tdr: { padding: "7px 10px", borderBottom: BDR, textAlign: "right", verticalAlign: "top" },
    tdTotal: { padding: "8px 10px", fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, background: LGRAY },
    tdTotalR: { padding: "8px 10px", fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, background: LGRAY, textAlign: "right" },
    netWorthBox: { background: NAVY, color: "#fff", borderRadius: 10, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 28 },
    nwLabel: { fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c7d0db" },
    nwValue: { fontSize: 36, fontWeight: "bold" },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" },
    tag: { display: "inline-block", background: "#e9edf2", color: NAVY, fontSize: 10, borderRadius: 4, padding: "2px 7px", marginLeft: 6, verticalAlign: "middle", letterSpacing: "0.06em" },
    tagGreen: { display: "inline-block", background: "#e6f4ea", color: "#1a5c2a", fontSize: 10, borderRadius: 4, padding: "2px 7px", marginLeft: 6, verticalAlign: "middle" },
  };

  const Row2 = ({ label, value, bold }) => (
    <tr>
      <td style={{ ...s.td, color: "#5a6575", width: "55%" }}>{label}</td>
      <td style={{ ...s.tdr, fontWeight: bold ? "bold" : "normal", color: bold ? NAVY : "#151b28" }}>{value}</td>
    </tr>
  );

  const acctsByOwner = (owner) => accounts.filter(a => (a.owner || "").toLowerCase() === owner.toLowerCase() || (owner === "all"));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000, overflowY: "auto", padding: "20px 0" }}>
      {/* toolbar */}
      <div id="rwg-print-toolbar" style={{ maxWidth: 900, margin: "0 auto 12px", display: "flex", gap: 10, justifyContent: "flex-end", padding: "0 10px" }}>
        <button onClick={() => {
          const el = document.getElementById("rwg-report");
          if (!el) return;
          const win = window.open("", "_blank", "width=960,height=800");
          win.document.write(`<!doctype html><html><head><title>Financial Summary</title><style>
            @page { margin: 0.6in 0.5in; size: letter portrait; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            body { margin: 0; padding: 0; font-family: 'DM Sans','Segoe UI',system-ui,sans-serif; color: #151b28; background: #fff; }
            @media print { body { padding: 0; } }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
          </style></head><body>`);
          win.document.write(el.outerHTML);
          win.document.write("</body></html>");
          win.document.close();
          win.focus();
          setTimeout(() => { win.print(); }, 600);
        }} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 7, padding: "9px 22px", fontFamily: P, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>🖨 Print / Save PDF</button>
        <button onClick={onClose} style={{ background: DANGER, color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontFamily: P, fontSize: 14, cursor: "pointer" }}>✕ Close</button>
      </div>

      <div id="rwg-report" style={s.page}>
        {/* ── HEADER ── */}
        <div className="rpt-pad" style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
          <div style={s.firmName}>Russell Wealth Group · Confidential</div>
          <div style={s.clientName}>{headerName}</div>
          <div style={s.reportTitle}>Financial Summary &amp; Net Worth Statement · Prepared {reportDate}</div>
          </div>
          <AcornMark size={46} color="#c7d0db" />
        </div>

        <div className="rpt-pad" style={s.body}>

          {/* ── NET WORTH SNAPSHOT ── */}
          <div style={s.kpiRow}>
            <div style={{ ...s.kpi, background: NAVY, border: "none" }}><div style={{ ...s.kpiLbl, color: "#c7d0db" }}>Total Net Worth</div><div style={{ ...s.kpiVal, color: "#fff", fontSize: 20 }}>{fmt(netWorth)}</div><div style={{ fontSize: 10, color: "#c7d0db", marginTop: 2 }}>All assets minus liabilities</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Net Worth (ex-Home)</div><div style={s.kpiVal}>{fmt(netWorthExHome)}</div><div style={{ ...s.kpiSub, whiteSpace: "nowrap" }}>Less Primary Residence Equity</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Liquid Net Worth</div><div style={s.kpiVal}>{fmt(liquidAcctTotal)}</div><div style={s.kpiSub}>Investment &amp; Bank Accounts</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Annual Income</div><div style={s.kpiVal}>{fmt(annualIncome)}</div>{annExpRaw > 0 && <div style={s.kpiSub}>Expenses: {fmt(annExpRaw)}</div>}</div>
          </div>

          {/* ── BALANCE SHEET ── */}
          <div style={s.sectionHead}>Balance Sheet</div>
          <div className="rpt-two" style={s.twoCol}>
            {/* ASSETS */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Assets</th><th style={{ ...s.th, textAlign: "right" }}>Value</th><th style={{ ...s.th, textAlign: "right" }}>%</th></tr></thead>
                <tbody>
                  {acctTotal > 0 && <tr><td style={{ ...s.td, color: "#5a6575", width: "55%" }}>Investment &amp; Bank Accounts</td><td style={s.tdr}>{fmt(acctTotal)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalAssets > 0 ? (acctTotal/totalAssets*100).toFixed(1) : "0.0"}%</td></tr>}
                  {reTotal > 0   && <tr><td style={{ ...s.td, color: "#5a6575" }}>Real Estate Holdings</td><td style={s.tdr}>{fmt(reTotal)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalAssets > 0 ? (reTotal/totalAssets*100).toFixed(1) : "0.0"}%</td></tr>}
                  {autoTotal > 0 && <tr><td style={{ ...s.td, color: "#5a6575" }}>Automobiles</td><td style={s.tdr}>{fmt(autoTotal)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalAssets > 0 ? (autoTotal/totalAssets*100).toFixed(1) : "0.0"}%</td></tr>}
                  <tr><td style={s.tdTotal}>Total Assets</td><td style={s.tdTotalR}>{fmt(totalAssets)}</td><td style={s.tdTotalR}>100.0%</td></tr>
                </tbody>
              </table>
            </div>
            {/* LIABILITIES */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Liabilities</th><th style={{ ...s.th, textAlign: "right" }}>Balance</th><th style={{ ...s.th, textAlign: "right" }}>%</th></tr></thead>
                <tbody>
                  {realEstate.filter(r => parseDollar(r.mortgageBalance) > 0).map((r, i) => {
                    const mb = parseDollar(r.mortgageBalance);
                    return <tr key={i}><td style={{ ...s.td, color: "#5a6575", width: "55%" }}>{r.descriptionNote || r.description || `Property ${i+1}`}</td><td style={s.tdr}>{fmt(mb)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalLiabilities > 0 ? (mb/totalLiabilities*100).toFixed(1) : "0.0"}%</td></tr>;
                  })}
                  {homeMortgage > 0 && <tr><td style={{ ...s.td, color: "#5a6575" }}>Personal Residence Mortgage</td><td style={s.tdr}>{fmt(homeMortgage)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalLiabilities > 0 ? (homeMortgage/totalLiabilities*100).toFixed(1) : "0.0"}%</td></tr>}
                  {debts.map((d, i) => {
                    const db = parseDollar(d.balance);
                    if (!db) return null;
                    return <tr key={"debt" + i}><td style={{ ...s.td, color: "#5a6575" }}>{(d.type || "Debt") + (d.lender ? " — " + d.lender : "")}</td><td style={s.tdr}>{fmt(db)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalLiabilities > 0 ? (db/totalLiabilities*100).toFixed(1) : "0.0"}%</td></tr>;
                  })}
                  {totalLiabilities === 0 && <tr><td style={s.td} colSpan={3}><em style={{ color: "#8a94a3" }}>No liabilities recorded</em></td></tr>}
                  <tr><td style={s.tdTotal}>Total Liabilities</td><td style={s.tdTotalR}>{fmt(totalLiabilities)}</td><td style={s.tdTotalR}>{totalLiabilities > 0 ? "100.0%" : "—"}</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: 0, padding: "16px 20px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "2px solid " + BLUE }}>
                <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>Estimated Net Worth</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: NAVY }}>{fmt(netWorth)}</div>
              </div>
            </div>
          </div>

          {/* ── NET WORTH DETAIL ── */}
          <div style={s.sectionHead}>Net Worth &amp; Income Summary</div>
          <div className="rpt-two" style={s.twoCol}>
            {/* NET WORTH BREAKDOWN */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Net Worth Breakdown</th><th style={{ ...s.th, textAlign: "right" }}>Amount</th><th style={{ ...s.th, textAlign: "right" }}>%</th></tr></thead>
                <tbody>
                  <tr><td style={{ ...s.td, color: "#5a6575", width: "55%" }}>Total Assets</td><td style={s.tdr}>{fmt(totalAssets)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>100.0%</td></tr>
                  <tr><td style={{ ...s.td, color: "#5a6575" }}>Total Liabilities</td><td style={s.tdr}>{fmt(totalLiabilities)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{totalAssets > 0 ? (totalLiabilities/totalAssets*100).toFixed(1) : "—"}%</td></tr>
                  <tr><td style={s.tdTotal}><strong>Total Net Worth</strong></td><td style={s.tdTotalR}><strong>{fmt(netWorth)}</strong></td><td style={s.tdTotalR}>{totalAssets > 0 ? (netWorth/totalAssets*100).toFixed(1) : "—"}%</td></tr>
                  <tr><td style={{ ...s.td, paddingTop: 16, color: "#5a6575" }} colSpan={3}><strong style={{ color: NAVY }}>Net Worth — Alternative Views</strong></td></tr>
                  <tr><td style={{ ...s.td, color: "#5a6575" }}>Net Worth (Ex-Primary Residence)</td><td style={s.tdr}>{fmt(netWorthExHome)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{netWorth !== 0 ? (netWorthExHome/netWorth*100).toFixed(1) : "—"}%</td></tr>
                  <tr><td style={{ ...s.td, color: "#5a6575" }}><strong>Liquid Net Worth (Investable Assets)</strong></td><td style={{ ...s.tdr, fontWeight: "bold", color: NAVY }}>{fmt(liquidAcctTotal)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{netWorth !== 0 ? (liquidAcctTotal/netWorth*100).toFixed(1) : "—"}%</td></tr>
                  {primaryReEquity > 0 && <tr><td style={{ ...s.td, color: "#5a6575", paddingLeft: 20 }}>Primary Residence Equity</td><td style={s.tdr}>{fmt(primaryReEquity)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{netWorth !== 0 ? (primaryReEquity/netWorth*100).toFixed(1) : "—"}%</td></tr>}
                </tbody>
              </table>
            </div>
            {/* INCOME & EXPENSES */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Annual Income &amp; Expenses</th><th style={{ ...s.th, textAlign: "right" }}>Amount</th><th style={{ ...s.th, textAlign: "right" }}>%</th></tr></thead>
                <tbody>
                  {activeIncomes.filter(i => i.type || i.source || i.amount).map((inc, i) => {
                    const ann = toAnnual(inc.amount, inc.frequency);
                    const pct = annualIncome > 0 ? (ann/annualIncome*100).toFixed(1) : "0.0";
                    return <tr key={i}><td style={{ ...s.td, color: "#5a6575", width: "55%" }}>{inc.type + (inc.owner === "spouse" ? ` (${spouseName})` : inc.owner === "joint" ? " (Joint)" : "")}</td><td style={s.tdr}>{fmt(ann)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{pct}%</td></tr>;
                  })}
                  <tr><td style={s.tdTotal}>Total Annual Income</td><td style={s.tdTotalR}>{fmt(annualIncome)}</td><td style={s.tdTotalR}>100.0%</td></tr>
                  {annExpRaw > 0 && (<>
                    <tr><td style={s.td} colSpan={3}></td></tr>
                    <tr><td style={{ ...s.td, color: "#5a6575" }}>Annual Household Expenses</td><td style={s.tdr}>{fmt(annExpRaw)}</td><td style={{ ...s.tdr, color: "#5a6575" }}>{annualIncome > 0 ? (annExpRaw/annualIncome*100).toFixed(1) : "—"}%</td></tr>
                    <tr>
                      <td style={s.tdTotal}>Annual Surplus / (Deficit)</td>
                      <td style={{ ...s.tdTotalR, color: surplusDeficit >= 0 ? "#1a5c2a" : "#b03a3a" }}>{surplusDeficit >= 0 ? "+" : ""}{fmt(surplusDeficit)}</td>
                      <td style={{ ...s.tdTotalR, color: surplusDeficit >= 0 ? "#1a5c2a" : "#b03a3a" }}>{annualIncome > 0 ? Math.abs(surplusDeficit/annualIncome*100).toFixed(1) : "—"}%</td>
                    </tr>
                  </>)}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── ASSET ALLOCATION ── */}
          {allocationRows.length > 0 && (<>
            <div style={s.sectionHead}>Asset Allocation Breakdown</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Asset Category</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Amount</th>
                  <th style={{ ...s.th, textAlign: "right", width: 80 }}>% of Total</th>
                  <th style={{ ...s.th, width: 200 }}>Allocation</th>
                </tr>
              </thead>
              <tbody>
                {allocationRows.map((row, i) => {
                  const pct = totalAssets > 0 ? (row.val / totalAssets * 100) : 0;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f4f6fa" }}>
                      <td style={s.td}>{row.label}</td>
                      <td style={s.tdr}><strong>{fmt(row.val)}</strong></td>
                      <td style={s.tdr}>{pct.toFixed(1)}%</td>
                      <td style={s.td}>
                        <div style={{ background: "#e9edf2", borderRadius: 4, height: 10, overflow: "hidden" }}>
                          <div style={{ background: NAVY, height: "100%", width: pct.toFixed(1) + "%", borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal}>Total Assets</td>
                  <td style={s.tdTotalR}>{fmt(totalAssets)}</td>
                  <td style={s.tdTotalR}>100%</td>
                  <td style={s.tdTotal}></td>
                </tr>
              </tbody>
            </table>
          </>)}

          {/* ── INVESTMENT & BANK ACCOUNTS ── */}
          <div style={s.sectionHead}>Investment &amp; Bank Accounts</div>
          {Object.entries(qualGroups).map(([group, accts]) => (
            <div key={group} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#5a6575", marginBottom: 6 }}>{group}</div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Account Type</th>
                    <th style={s.th}>Institution</th>
                    <th style={s.th}>Owner</th>
                    <th style={s.th}>Acct #</th>
                    <th style={s.th}>Transactions</th>
                    <th style={{ ...s.th, textAlign: "right" }}>Balance</th>
                    <th style={{ ...s.th, textAlign: "right" }}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {accts.map((a, i) => {
                    const bal = parseDollar(a.balance);
                    const pct = acctTotal > 0 ? (bal / acctTotal * 100).toFixed(1) : "0.0";
                    return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                      <td style={s.td}>{a.type || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.institution || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.owner || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.accountNumber ? "···" + String(a.accountNumber).slice(-4) : <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{(a.hasRmdOrContrib || "").replace(/^Contributing$/i, "Contrib.") || <em style={{ color: "#9aa" }}>—</em>}{a.rmdContribAmount ? <span style={{ color: "#5a6575" }}> · {a.rmdContribAmount}/{a.rmdContribFrequency || "—"}</span> : ""}</td>
                      <td style={s.tdr}>{a.balance ? <strong>{a.balance}</strong> : <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={{ ...s.tdr, color: "#5a6575" }}>{pct}%</td>
                    </tr>
                    );
                  })}
                  <tr>
                    <td style={s.tdTotal} colSpan={5}>{group} Subtotal</td>
                    <td style={s.tdTotalR}>{fmt(accts.reduce((s, a) => s + parseDollar(a.balance), 0))}</td>
                    <td style={s.tdTotalR}>{acctTotal > 0 ? (accts.reduce((s, a) => s + parseDollar(a.balance), 0) / acctTotal * 100).toFixed(1) : "0.0"}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          {accounts.length === 0 && <p style={{ color: "#8a94a3", fontStyle: "italic" }}>No accounts recorded.</p>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, paddingTop: 8 }}>
            <span>Total Account Holdings</span><span>{fmt(acctTotal)}</span>
          </div>

          {/* ── REAL ESTATE ── */}
          <div style={s.sectionHead}>Real Estate Holdings</div>
          {realEstate.length > 0 ? (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Property</th>
                  <th style={s.th}>Address</th>
                  <th style={s.th}>Purchase Date</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Purchase Price</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Market Value</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% of RE Total</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Mortgage Bal.</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Equity</th>
                </tr>
              </thead>
              <tbody>
                {realEstate.map((r, i) => {
                  const mv = parseDollar(r.marketValue);
                  const mb = parseDollar(r.mortgageBalance);
                  const equity = mv - mb;
                  const pct = reTotal > 0 ? (mv / reTotal * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                      <td style={s.td}>
                        <strong>{r.descriptionNote || r.description || `Property ${i+1}`}</strong>
                        {r.description && <div style={{ fontSize: 11, color: "#697180" }}>{r.description}</div>}
                      </td>
                      <td style={s.td}>{[r.address, r.city, r.state, r.zip].filter(Boolean).join(", ") || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{r.purchaseDate || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.tdr}>{r.purchasePrice || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.tdr}><strong>{r.marketValue || "—"}</strong></td>
                      <td style={{ ...s.tdr, color: "#5a6575" }}>{pct}%</td>
                      <td style={s.tdr}>{r.mortgageBalance || "—"}</td>
                      <td style={{ ...s.tdr, color: equity >= 0 ? "#1a5c2a" : "#b03a3a", fontWeight: "bold" }}>{fmt(equity)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal} colSpan={4}>Totals</td>
                  <td style={s.tdTotalR}>{fmt(reTotal)}</td>
                  <td style={s.tdTotalR}>100.0%</td>
                  <td style={s.tdTotalR}>{fmt(reMortgages)}</td>
                  <td style={{ ...s.tdTotalR, color: (reTotal - reMortgages) >= 0 ? "#1a5c2a" : "#b03a3a" }}>{fmt(reTotal - reMortgages)}</td>
                </tr>
              </tbody>
            </table>
          ) : <p style={{ color: "#8a94a3", fontStyle: "italic" }}>No real estate recorded.</p>}

          {/* ── DEBT / LIABILITIES ── */}
          <div style={s.sectionHead}>Debt &amp; Liabilities</div>
          {(() => {
            const pdv = v => parseInt((v || "").replace(/[^0-9]/g, "") || 0);
            const rows = [];
            if (pdv(homeOwnership.mortgageBalance)) rows.push(["Mortgage — Personal Residence", homeOwnership.mortgageCompany || "—", homeOwnership.monthlyPayment || "—", homeOwnership.mortgageBalance]);
            realEstate.forEach((r, i) => { if (pdv(r.mortgageBalance)) rows.push([`Mortgage — Property ${i + 1}`, r.mortgageCompany === "__other__" ? "—" : (r.mortgageCompany || "—"), r.monthlyPmt || "—", r.mortgageBalance]); });
            autos.forEach((a2, i) => { if (pdv(a2.loanBalance)) rows.push([`Auto Loan — ${[a2.year, a2.make, a2.model].filter(Boolean).join(" ") || "Vehicle " + (i + 1)}`, a2.lender || "—", a2.monthlyPayment || "—", a2.loanBalance]); });
            businesses.forEach((b2, i) => { if (pdv(b2.loanBalance)) rows.push([`${b2.loanType || "Business Loan"} — ${b2.name || "Business " + (i + 1)}`, b2.loanLender || "—", b2.loanPayment || "—", b2.loanBalance]); });
            debts.forEach(d => { if (pdv(d.balance) || d.type) rows.push([d.type || "Debt", d.lender || "—", d.monthlyPayment || "—", d.balance || "—"]); });
            const total = rows.reduce((t, r) => t + pdv(r[3]), 0);
            return rows.length > 0 ? (
              <table style={s.table}>
                <thead><tr><th style={s.th}>Debt</th><th style={s.th}>Lender</th><th style={{ ...s.th, textAlign: "right" }}>Monthly</th><th style={{ ...s.th, textAlign: "right" }}>Balance</th></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f4f6f9" }}>
                      <td style={s.td}>{r[0]}</td><td style={s.td}>{r[1]}</td><td style={s.tdr}>{r[2]}</td><td style={s.tdr}>{r[3]}</td>
                    </tr>
                  ))}
                  <tr><td style={{ ...s.td, fontWeight: 700 }}>Total</td><td style={s.td}></td><td style={s.tdr}></td><td style={{ ...s.tdr, fontWeight: 700 }}>{"$" + total.toLocaleString()}</td></tr>
                </tbody>
              </table>
            ) : <p style={{ color: "#8a94a3", fontStyle: "italic" }}>No debts recorded.</p>;
          })()}

          {/* ── INCOME ── */}
          <div style={s.sectionHead}>Income Summary</div>
          {activeIncomes.filter(i => i.type || i.source || i.amount).length > 0 ? (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Income Type</th>
                  <th style={s.th}>Institution / Source</th>
                  <th style={s.th}>Belongs To</th>
                  <th style={s.th}>Frequency</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Amount</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Annual</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% of Income</th>
                </tr>
              </thead>
              <tbody>
                {activeIncomes.filter(i => i.type || i.source || i.amount).map((inc, i) => {
                  const ann = toAnnual(inc.amount, inc.frequency);
                  const pct = annualIncome > 0 ? (ann / annualIncome * 100).toFixed(1) : "0.0";
                  return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{inc.type}</td>
                    <td style={s.td}>{inc.institution || <em style={{ color: "#9aa" }}>—</em>}</td>
                    <td style={s.td}>{inc.owner === "spouse" ? (spouse.firstName || spouseName) : inc.owner === "joint" ? "Joint" : (client.firstName || clientName)}</td>
                    <td style={s.td}>{inc.frequency ? inc.frequency.charAt(0).toUpperCase() + inc.frequency.slice(1) : "—"}</td>
                    <td style={s.tdr}>{inc.amount || "—"}</td>
                    <td style={s.tdr}><strong>{fmt(ann)}</strong></td>
                    <td style={{ ...s.tdr, color: "#5a6575" }}>{pct}%</td>
                  </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal} colSpan={5}>Total Annual Income</td>
                  <td style={s.tdTotalR}>{fmt(annualIncome)}</td>
                  <td style={s.tdTotalR}>100.0%</td>
                </tr>
              </tbody>
            </table>
          ) : <p style={{ color: "#8a94a3", fontStyle: "italic" }}>No income recorded.</p>}

          {/* ── AUTOMOBILES ── */}
          {autos.filter(a => a.make || a.model || a.value).length > 0 && (<>
            <div style={s.sectionHead}>Automobiles</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Year</th>
                  <th style={s.th}>Make</th>
                  <th style={s.th}>Model</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Est. Value</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {autos.filter(a => a.make || a.model || a.value).map((a, i) => {
                  const val = parseDollar(a.value);
                  const pct = autoTotal > 0 ? (val / autoTotal * 100).toFixed(1) : "0.0";
                  return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{a.year || "—"}</td>
                    <td style={s.td}>{a.make || "—"}</td>
                    <td style={s.td}>{a.model || "—"}</td>
                    <td style={s.tdr}>{a.value || "—"}</td>
                    <td style={{ ...s.tdr, color: "#5a6575" }}>{pct}%</td>
                  </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal} colSpan={3}>Total Auto Value</td>
                  <td style={s.tdTotalR}>{fmt(autoTotal)}</td>
                  <td style={s.tdTotalR}>100.0%</td>
                </tr>
              </tbody>
            </table>
          </>)}

          {/* ── LIFE INSURANCE ── */}
          {lifePolicies.filter(p => p.carrier || p.policyType || p.deathBenefit).length > 0 && (<>
            <div style={s.sectionHead}>Life Insurance</div>
            {(() => {
              const activePolicies = lifePolicies.filter(p => p.carrier || p.policyType || p.deathBenefit);
              const totalDB = activePolicies.reduce((s, p) => s + parseDollar(p.deathBenefit), 0);
              const totalCV = activePolicies.reduce((s, p) => s + parseDollar(p.cashValue), 0);
              const totalPrem = activePolicies.reduce((s, p) => s + toAnnual(p.premiumAmount, p.premiumFrequency), 0);
              return (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Carrier</th>
                  <th style={s.th}>Type</th>
                  <th style={s.th}>Insured</th>
                  <th style={s.th}>Owner</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Death Benefit</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% of DB</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Cash Value</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% of CV</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Annual Prem.</th>
                </tr>
              </thead>
              <tbody>
                {activePolicies.map((p, i) => {
                  const db = parseDollar(p.deathBenefit);
                  const cv = parseDollar(p.cashValue);
                  const prem = toAnnual(p.premiumAmount, p.premiumFrequency);
                  return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{p.carrier || "—"}</td>
                    <td style={s.td}>{p.policyType || "—"}</td>
                    <td style={s.td}>{p.insured || "—"}</td>
                    <td style={s.td}>{p.owner || "—"}</td>
                    <td style={s.tdr}>{p.deathBenefit || "—"}</td>
                    <td style={{ ...s.tdr, color: "#5a6575" }}>{totalDB > 0 ? (db/totalDB*100).toFixed(1) : "—"}%</td>
                    <td style={s.tdr}>{p.cashValue || "—"}</td>
                    <td style={{ ...s.tdr, color: "#5a6575" }}>{totalCV > 0 ? (cv/totalCV*100).toFixed(1) : "—"}%</td>
                    <td style={s.tdr}>{prem > 0 ? fmt(prem) : "—"}</td>
                  </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal} colSpan={4}>Totals</td>
                  <td style={s.tdTotalR}>{fmt(totalDB)}</td>
                  <td style={s.tdTotalR}>100.0%</td>
                  <td style={s.tdTotalR}>{fmt(totalCV)}</td>
                  <td style={s.tdTotalR}>{totalCV > 0 ? "100.0%" : "—"}</td>
                  <td style={s.tdTotalR}>{totalPrem > 0 ? fmt(totalPrem) : "—"}</td>
                </tr>
              </tbody>
            </table>
              );
            })()}
          </>)}

          {/* ── BENEFICIARIES ── */}
          {(beneficiaries.filter(b => b.firstName || b.lastName).length > 0 || children.filter(c => c.isBeneficiary).length > 0) && (() => {
            const allBenes = [
              ...children.filter(c => c.isBeneficiary).map(c => ({ name: [c.firstName, c.lastName].filter(Boolean).join(" "), relationship: c.relationship || "Child", dob: c.dob || "—", percentage: c.percentage || "", designationType: getDesignType(c) })),
              ...beneficiaries.filter(b => b.firstName || b.lastName).map(b => ({ name: [b.firstName, b.lastName].filter(Boolean).join(" "), relationship: b.relationship || "—", dob: b.dob || "—", percentage: b.percentage || "", designationType: getDesignType(b) })),
            ];
            const primaries   = allBenes.filter(b => b.designationType === "primary");
            const contingents = allBenes.filter(b => b.designationType === "contingent");
            const getPct = b => parseFloat((b.percentage || "").replace("%","")) || 0;
            const primTotal   = primaries.reduce((s, b) => s + getPct(b), 0);
            const contTotal   = contingents.reduce((s, b) => s + getPct(b), 0);
            const BeneTable = ({ rows, groupTotal, caption }) => (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: caption === "Primary" ? "#1a5c2a" : "#92400e", marginBottom: 6 }}>{caption} Beneficiaries</div>
                <table style={s.table}>
                  <thead><tr>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Relationship</th>
                    <th style={s.th}>Date of Birth</th>
                    <th style={{ ...s.th, textAlign: "right" }}>% to Inherit</th>
                    <th style={{ ...s.th, textAlign: "right" }}>% of {caption}</th>
                  </tr></thead>
                  <tbody>
                    {rows.map((b, i) => {
                      const p = getPct(b);
                      const sharePct = groupTotal > 0 ? (p / groupTotal * 100).toFixed(1) : "—";
                      return (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                          <td style={s.td}>{b.name}</td>
                          <td style={s.td}>{b.relationship}</td>
                          <td style={s.td}>{b.dob}</td>
                          <td style={s.tdr}>{b.percentage || "—"}</td>
                          <td style={{ ...s.tdr, color: "#5a6575" }}>{sharePct !== "—" ? sharePct + "%" : "—"}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td style={s.tdTotal} colSpan={3}>{caption} Total</td>
                      <td style={{ ...s.tdTotalR, color: groupTotal === 100 ? "#1a5c2a" : groupTotal > 100 ? "#b03a3a" : NAVY }}>{groupTotal > 0 ? groupTotal + "%" : "—"}{groupTotal === 100 ? " ✓" : groupTotal > 100 ? " ⚠" : ""}</td>
                      <td style={s.tdTotalR}>{groupTotal > 0 ? "100.0%" : "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
            return (<>
              <div style={s.sectionHead}>Beneficiaries</div>
              {primaries.length   > 0 && <BeneTable rows={primaries}   groupTotal={primTotal}  caption="Primary" />}
              {contingents.length > 0 && <BeneTable rows={contingents} groupTotal={contTotal}  caption="Contingent" />}
            </>);
          })()}

          {/* ── ESTATE PLANNING ── */}
          {(willsTrust.hasWillDoc || willsTrust.hasTrustDoc || poas.some(p => p.hasPOA === "yes")) && (<>
            <div style={s.sectionHead}>Estate Planning Documents</div>
            <div className="rpt-two" style={s.twoCol}>
              <table style={s.table}>
                <tbody>
                  {willsTrust.hasWillDoc && <Row2 label="Will on File" value={willsTrust.hasWillDoc === "yes" ? "✓ Yes" : "No"} />}
                  {willsTrust.willUpdated && <Row2 label="Will Last Updated" value={willsTrust.willUpdated} />}
                  {willsTrust.hasTrustDoc && <Row2 label="Trust on File" value={willsTrust.hasTrustDoc === "yes" ? "✓ Yes" : "No"} />}
                  {willsTrust.trustType && <Row2 label="Trust Type" value={willsTrust.trustType} />}
                  {willsTrust.assetsTitled && <Row2 label="Assets Titled in Trust" value={willsTrust.assetsTitled} />}
                </tbody>
              </table>
              <table style={s.table}>
                <tbody>
                  {poas.filter(p => p.hasPOA === "yes").map((p, i) => (<>
                    {poas.filter(x => x.hasPOA === "yes").length > 1 && <Row2 key={`lbl-${i}`} label={`POA ${i + 1}`} value="" />}
                    <Row2 key={`poa-${i}`} label="Power of Attorney" value="✓ Yes" />
                    {p.poaType && <Row2 key={`type-${i}`} label="POA Type" value={p.poaType} />}
                    {p.agentName && <Row2 key={`agent-${i}`} label="Agent Name" value={p.agentName} />}
                    {p.agentRelationship && <Row2 key={`rel-${i}`} label="Agent Relationship" value={p.agentRelationship} />}
                  </>))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ── FOOTER ── */}
          <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px solid #e1e4ea", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a94a3" }}>
            <span>Russell Wealth Group · Confidential · For Advisor Use Only</span>
            <span>Prepared {reportDate}</span>
          </div>

        </div>{/* /body */}
      </div>{/* /page */}

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          /* Remove the main app from flow entirely so it doesn't pad pages */
          #rwg-main-app { display: none !important; }
          /* Strip the screen overlay — make report flow naturally */
          #rwg-report-wrap { display: block !important; }
          #rwg-report-wrap > div {
            position: static !important;
            background: white !important;
            overflow: visible !important;
            padding: 0 !important;
            inset: auto !important;
            z-index: auto !important;
          }
          #rwg-print-toolbar { display: none !important; }
          #rwg-report {
            position: static !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          table { page-break-inside: avoid; }
          tr { page-break-inside: avoid; }
        }
        @page { margin: 0.6in 0.5in; size: letter portrait; }
        @media screen and (max-width: 700px) {
          .rpt-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .rpt-two { grid-template-columns: 1fr !important; }
          #rwg-report table { display: block; overflow-x: auto; }
          #rwg-report { margin: 0 8px !important; }
        }
      `}</style>
    </div>
  );
}

function SummaryReview({ data, onClose }) {
  const {
    client = {}, spouse = {}, hasSpouse, hasChildren, children = [],
    beneficiaries = [], clientEmp = {}, spouseEmp = {},
    incomes = [], realEstate = [], homeOwnership = {},
    accounts = [], willsTrust = {}, poas = [],
    autos = [], lifePolicies = [],
    nwState = {}, annualExpenses = { amount: "", frequency: "monthly" },
    inheritances = [], vaults = [], recordType = "client",
  } = data;
  const activeIncomes = incomes;

  const P = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
  const NAVY = "#414f62";
  const BLUE = "#5b6e85";
  const DGRAY = "#4a5a6e";
  const LGRAY = "#f4f6fa";
  const BDR = "1px solid #e1e4ea";
  const INK = "#151b28";
  const MUT = "#697180";

  const clientFirst = client.firstName || "";
  const clientLast  = client.lastName  || "";
  const spouseFirst = spouse.firstName || "";
  const spouseLast  = spouse.lastName  || clientLast;
  const hasSpouseRecord = ["married","domestic_partner"].includes(hasSpouse);
  const headerName = (() => {
    if (!clientFirst && !clientLast) return "Client";
    if (!hasSpouseRecord || !spouseFirst) return [clientFirst, clientLast].filter(Boolean).join(" ") || "Client";
    if (clientLast && spouseLast === clientLast) return `${clientFirst} & ${spouseFirst} ${clientLast}`;
    return `${clientFirst} & ${spouseFirst} ${spouseLast}`.trim();
  })();
  const reportDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const fmt = n => "$" + Math.round(n).toLocaleString();
  const parseDollar = v => { if (!v) return 0; return parseFloat(String(v).replace(/[^0-9.-]/g,"")) || 0; };

  const SH = ({ title }) => (
    <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: BLUE, borderBottom: "2px solid " + BLUE, paddingBottom: 6, marginTop: 32, marginBottom: 12, fontWeight: "bold", textAlign: "center" }}>{title}</div>
  );
  const Grid = ({ rows }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "6px 24px", marginBottom: 8 }}>
      {rows.filter(([,v]) => v).map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 1 }}>{k}</div>
          <div style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  );
  const thS = { textAlign: "center", padding: "7px 10px", background: DGRAY, color: "#fff", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" };
  const tdS = { padding: "7px 10px", borderBottom: BDR, verticalAlign: "top", fontSize: 13 };
  const Tbl = ({ cols, rows, emptyMsg }) => rows.length === 0
    ? <div style={{ fontSize: 12, color: MUT, fontStyle: "italic", marginBottom: 4 }}>{emptyMsg || "None recorded."}</div>
    : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 }}>
        <thead>
          <tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
              {r.map((cell, j) => <td key={j} style={tdS}>{cell || <span style={{ color: "#9aa" }}>—</span>}</td>)}
            </tr>
          ))}
        </tbody>
      </table>;

  const acctTotal = accounts.reduce((s, a) => s + parseDollar(a.balance), 0);
  const reTotal   = realEstate.reduce((s, r) => s + parseDollar(r.marketValue), 0);
  const autoTotal = autos.reduce((s, a) => s + parseDollar(a.value), 0);
  const lifeCV    = lifePolicies.reduce((s, p) => s + parseDollar(p.cashValue), 0);
  const reMort    = realEstate.reduce((s, r) => s + parseDollar(r.mortgageBalance), 0);
  const autoLoan  = autos.reduce((s, a) => s + parseDollar(a.loanBalance), 0);
  const totalAssets = acctTotal + reTotal + autoTotal + lifeCV;
  const totalLiab   = reMort + autoLoan;
  const netWorth    = totalAssets - totalLiab;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1100, overflowY: "auto", padding: "20px 0" }}>
      <div id="sr-print-toolbar" style={{ maxWidth: 900, margin: "0 auto 12px", display: "flex", gap: 10, justifyContent: "flex-end", padding: "0 10px" }}>
        <button onClick={() => {
          const el = document.getElementById("sr-report");
          if (!el) return;
          const win = window.open("", "_blank", "width=960,height=800");
          win.document.write(`<!doctype html><html><head><title>Summary Review</title><style>
            @page { margin: 0.6in 0.5in; size: letter portrait; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            body { margin: 0; padding: 0; font-family: 'DM Sans','Segoe UI',system-ui,sans-serif; color: #151b28; background: #fff; }
            @media print { body { padding: 0; } }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
          </style></head><body>`);
          win.document.write(el.outerHTML);
          win.document.write("</body></html>");
          win.document.close();
          win.focus();
          setTimeout(() => { win.print(); }, 600);
        }}
          style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 7, padding: "9px 22px", fontFamily: P, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>🖨 Print / Save PDF</button>
        <button onClick={onClose}
          style={{ background: "#d64545", color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontFamily: P, fontSize: 14, cursor: "pointer" }}>✕ Close</button>
      </div>

      <div id="sr-report" style={{ fontFamily: P, color: INK, background: "#fff", maxWidth: 900, margin: "0 auto", padding: "0 0 60px" }}>
        {/* Header */}
        <div className="rpt-pad" style={{ background: NAVY, color: "#fff", padding: "32px 40px 24px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c7d0db", marginBottom: 6 }}>Russell Wealth Group · Confidential</div>
            <div style={{ fontSize: 32, fontWeight: "bold", margin: "0 0 4px" }}>{headerName}</div>
            <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c7d0db", marginTop: 10 }}>
              {recordType === "prospect" ? "Prospect" : "Client"} Summary Review · Prepared {reportDate}
            </div>
          </div>
          <AcornMark size={46} color="#c7d0db" />
        </div>

        <div className="rpt-pad" style={{ padding: "0 40px" }}>

          {/* Profile */}
          <SH title={recordType === "prospect" ? "Prospect Profile" : "Client Profile"} />
          <Grid rows={[
            ["Full Name", [client.firstName, client.middleName, client.lastName].filter(Boolean).join(" ")],
            ["Date of Birth", client.dob],
            ["Gender", client.gender],
            ["Marital Status", client.filingStatus],
            ["SSN", client.ssn],
            ["Phone", client.phone],
            ["Alt Phone", client.altPhone],
            ["Email", client.email ? <MailLink email={client.email} /> : ""],
            ["Citizenship", client.citizenship],
            ["Address", [client.address, client.addressLine2, client.city, client.state, client.zip].filter(Boolean).join(", ")],
            ["Driver's License", client.driversLicense ? `${client.driversLicense} (${client.dlState || ""} exp. ${client.dlExpiration || ""})` : ""],
          ]} />

          {/* Family */}
          {(hasSpouseRecord || hasChildren) && <>
            <SH title="Family" />
            {hasSpouseRecord && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>Spouse</div>
                <Grid rows={[
                  ["Full Name", [spouse.firstName, spouse.middleName, spouse.lastName].filter(Boolean).join(" ")],
                  ["Date of Birth", spouse.dob],
                  ["Gender", spouse.gender],
                  ["SSN", spouse.ssn],
                  ["Phone", spouse.phone],
                  ["Email", spouse.email ? <MailLink email={spouse.email} /> : ""],
                ]} />
              </div>
            )}
            {hasChildren && children.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>Children</div>
                <Tbl cols={["Name", "DOB", "Relationship"]}
                  rows={children.map(c => [[c.firstName, c.lastName].filter(Boolean).join(" "), c.dob, c.relationship])} />
              </div>
            )}
          </>}

          {/* Beneficiaries */}
          <SH title="Beneficiaries" />
          <Tbl cols={["Name", "Designation", "%", "Relationship", "DOB"]}
            rows={beneficiaries.map(b => [
              [b.firstName, b.lastName].filter(Boolean).join(" "),
              b.designationType || "primary",
              b.percentage,
              b.relationship,
              b.dob,
            ])} emptyMsg="No beneficiaries recorded." />

          {/* Employment */}
          <SH title="Employment" />
          {[{ label: "Client", emp: clientEmp }, ...(hasSpouseRecord ? [{ label: "Spouse", emp: spouseEmp }] : [])].map(({ label, emp }) => emp.employer ? (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>{label}</div>
              <Grid rows={[
                ["Employer", emp.employer],
                ["Occupation", emp.occupation],
                ["Start Date", emp.startDate],
                ["Work Phone", emp.workPhone],
                ["Retirement Plan", emp.retirementType || (emp.hasRetirement === false ? "None" : "")],
                ["Retirement Balance", emp.retirementBalance],
                ["Contribution", emp.contributionAmt ? `${emp.contributionAmt}${emp.hasMatch ? ` (match ${emp.matchPct})` : ""}` : ""],
              ]} />
            </div>
          ) : null)}

          {/* Income */}
          <SH title="Income" />
          <Tbl cols={["Source / Type", "Owner", "Amount", "Frequency", "Start Date"]}
            rows={activeIncomes.filter(i => i.source || i.type || i.amount).map(inc => [inc.source || inc.type, inc.owner === "spouse" ? (spouse.firstName || "Spouse") : inc.owner === "joint" ? "Joint" : (client.firstName || "Client"), inc.amount, inc.frequency, inc.startDate])}
            emptyMsg="No income recorded." />

          {/* Real Estate */}
          <SH title="Real Estate" />
          {homeOwnership.ownOrRent && (
            <Grid rows={[
              ["Own or Rent", homeOwnership.ownOrRent === "own" ? "Owns" : "Rents"],
              ...(homeOwnership.ownOrRent === "own" ? [
                ["Mortgage Co.", homeOwnership.mortgageCompany],
                ["Balance", homeOwnership.mortgageBalance],
                ["Monthly Payment", homeOwnership.monthlyPayment],
                ["Interest Rate", homeOwnership.interestRate],
                ["Annual Property Taxes", homeOwnership.annualPropertyTaxes],
                ["Annual Insurance", homeOwnership.annualInsurance],
              ] : [
                ["Monthly Rent", homeOwnership.monthlyRent],
                ["Landlord", homeOwnership.landlordName],
              ]),
            ]} />
          )}
          <Tbl cols={["Address", "Type", "Market Value", "Mortgage Bal.", "Ownership"]}
            rows={realEstate.filter(r => r.address || r.marketValue).map(r => [r.address, r.propertyType, r.marketValue, r.mortgageBalance, r.ownership])}
            emptyMsg="No additional real estate recorded." />

          {/* Investment & Bank Accounts */}
          <SH title="Investment & Bank Accounts" />
          <Tbl cols={["Institution", "Type", "Owner", "Acct #", "Qualified", "Transactions", "Balance"]}
            rows={accounts.filter(a => a.institution || a.balance).map(a => [a.institution, a.type, a.owner, a.accountNumber ? "···" + String(a.accountNumber).slice(-4) : "", a.qualified, (a.hasRmdOrContrib || "").replace(/^Contributing$/i, "Contrib."), a.balance])}
            emptyMsg="No accounts recorded." />
          {acctTotal > 0 && <div style={{ textAlign: "right", fontWeight: 700, fontSize: 13, color: NAVY, marginTop: 4 }}>Total: {fmt(acctTotal)}</div>}

          {/* Wills & Trust */}
          <SH title="Wills, Trust & POA" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 32px" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>Will</div>
              <Grid rows={[
                ["Has Will", willsTrust.hasWill === true ? "Yes" : willsTrust.hasWill === false ? "No" : ""],
                ["Will Date", willsTrust.willDate],
                ["Attorney", willsTrust.willAttorney],
                ["Executor", willsTrust.executor],
                ["Alt. Executor", willsTrust.altExecutor],
                ["Location", willsTrust.willLocation],
              ]} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>Trust</div>
              <Grid rows={[
                ["Trust Name", willsTrust.trustName],
                ["Trust Type", willsTrust.trustType],
                ["Trust Date", willsTrust.trustDate],
                ["Trustee", willsTrust.trustee],
                ["Successor", willsTrust.successorTrustee],
                ["Location", willsTrust.trustLocation],
              ]} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUT, marginBottom: 6 }}>Power of Attorney</div>
              {poas.map((p, i) => (
                <div key={i} style={{ marginBottom: poas.length > 1 ? 8 : 0 }}>
                  {poas.length > 1 && <div style={{ fontSize: 10, color: MUT, marginBottom: 3 }}>POA {i + 1}</div>}
                  <Grid rows={[
                    ["Has POA", p.hasPOA === "yes" ? "Yes" : p.hasPOA === "no" ? "No" : ""],
                    ["POA Type", p.poaType],
                    ["Agent", p.agentName],
                    ["Relationship", p.agentRelationship],
                    ["Agent Phone", p.agentPhone],
                    ["Alt. Agent", p.altAgent],
                  ].filter(([,v]) => v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Autos */}
          <SH title="Vehicles" />
          <Tbl cols={["Year", "Make", "Model", "Owner", "Value", "Loan Balance", "Lender"]}
            rows={autos.filter(a => a.make || a.value).map(a => [a.year, a.make, a.model, a.owner, a.value, a.loanBalance, a.lender])}
            emptyMsg="No vehicles recorded." />

          {/* Life Insurance */}
          <SH title="Life Insurance" />
          <Tbl cols={["Insured", "Type", "Company", "Death Benefit", "Cash Value", "Premium", "Owner"]}
            rows={lifePolicies.filter(p => p.company || p.deathBenefit).map(p => [p.insured, p.type, p.company, p.deathBenefit, p.cashValue, p.premium ? `${p.premium}/${p.premiumFrequency || "mo"}` : "", p.owner])}
            emptyMsg="No life insurance recorded." />

          {/* Net Worth Summary */}
          <SH title="Net Worth Summary" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
            <div>
              <Tbl cols={["Assets", "Value"]} rows={[
                ...(acctTotal > 0 ? [["Investment & Bank Accounts", fmt(acctTotal)]] : []),
                ...(reTotal > 0 ? [["Real Estate", fmt(reTotal)]] : []),
                ...(autoTotal > 0 ? [["Vehicles", fmt(autoTotal)]] : []),
                ...(lifeCV > 0 ? [["Life Insurance (CV)", fmt(lifeCV)]] : []),
                ...(totalAssets > 0 ? [["Total Assets", fmt(totalAssets)]] : []),
              ]} emptyMsg="No assets recorded." />
            </div>
            <div>
              <Tbl cols={["Liabilities", "Balance"]} rows={[
                ...(reMort > 0 ? [["Mortgages", fmt(reMort)]] : []),
                ...(autoLoan > 0 ? [["Auto Loans", fmt(autoLoan)]] : []),
                ...(totalLiab > 0 ? [["Total Liabilities", fmt(totalLiab)]] : []),
              ]} emptyMsg="No liabilities recorded." />
              {netWorth !== 0 && (
                <div style={{ background: NAVY, color: "#fff", borderRadius: 10, padding: "16px 20px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c7d0db" }}>Total Net Worth</div>
                  <div style={{ fontSize: 28, fontWeight: "bold" }}>{fmt(netWorth)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Estate Planning */}
          {inheritances.some(i => Object.values(i).some(v => v && v !== 1)) && <>
            <SH title="Estate Planning" />
            {inheritances.map((inh, idx) => (
              <Grid key={idx} rows={[
                ["Expects Inheritance", inh.expectsInheritance],
                ["Est. Value", inh.estValue],
                ["Timeline", inh.timeline],
                ["Source", inh.source],
                ["Charitable Intent", inh.charitableIntent],
                ["Charitable Details", inh.charitableDetails],
                ["Special Needs", inh.specialNeedsFamily],
                ["LTC Insurance", inh.ltcInsurance],
                ["Notes", inh.additionalNotes],
              ]} />
            ))}
          </>}

          {/* Document Vault */}
          {vaults.length > 0 && <>
            <SH title="Document Vault Checklist" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {vaults.map(v => (
                <div key={v.id} style={{ fontSize: 12, background: LGRAY, borderRadius: 5, padding: "3px 10px", color: NAVY, fontWeight: 500 }}>✓ {v.category}</div>
              ))}
            </div>
          </>}

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px solid #e1e4ea", display: "flex", justifyContent: "space-between", fontSize: 11, color: MUT }}>
            <span>Russell Wealth Group · Confidential · For Advisor Use Only</span>
            <span>Prepared {reportDate}</span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #rwg-main-app { display: none !important; }
          #sr-report-wrap { display: block !important; }
          #sr-report-wrap > div {
            position: static !important;
            background: white !important;
            overflow: visible !important;
            padding: 0 !important;
            inset: auto !important;
            z-index: auto !important;
          }
          #sr-print-toolbar { display: none !important; }
          #sr-report {
            position: static !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          table { page-break-inside: avoid; }
          tr { page-break-inside: avoid; }
        }
        @page { margin: 0.6in 0.5in; size: letter portrait; }
        @media screen and (max-width: 700px) {
          .rpt-pad { padding-left: 16px !important; padding-right: 16px !important; }
          #sr-report table { display: block; overflow-x: auto; }
          #sr-report { margin: 0 8px !important; }
        }
      `}</style>
    </div>
  );
}

// Static account-type sets — defined at module level so they're always in scope
const CASH_TYPES_M  = new Set(["CD", "Checking / Savings", "Money Market"]);
const QUAL_TYPES_M  = new Set(["401(k)","403(b)","457(b)","Traditional IRA","Roth IRA","Roth 401(k)","SEP IRA","SIMPLE IRA","Pension / Defined Benefit","HSA"]);

export default function App() {
  const [view, setView] = useState("form");
  const [confirmState, setConfirmState] = useState({ open: false, message: "", confirmLabel: "Confirm", onConfirm: null });
  const showConfirm = (message, onConfirm, confirmLabel = "Confirm") => setConfirmState({ open: true, message, confirmLabel, onConfirm });
  const closeConfirm = () => setConfirmState(s => ({ ...s, open: false, onConfirm: null }));

  // Aggressively remove LastPass injected DOM elements
  useEffect(() => {
    const kill = () => {
      document.querySelectorAll(
        '[data-lastpass-icon-root],[data-lastpass-root],[id*="lastpass"],[class*="lastpass"],' +
        '[id*="LastPass"],[class*="LastPass"],[data-lp-id],[id*="__lpform_"],' +
        'div[id^="kw-"],div[class^="kw-"],iframe[src*="lastpass"]'
      ).forEach(el => el.remove());
      document.querySelectorAll('input').forEach(el => {
        el.setAttribute('data-lpignore', 'true');
      });
    };
    kill();
    const observer = new MutationObserver(kill);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const [savedClients, setSavedClients] = useState(
    () => JSON.parse(localStorage.getItem("rwg_clients") || "[]")
  );
  const [client,    setClient]    = useState({ ...emptyClient });
  const [hasSpouse, setHasSpouse] = useState(null);
  const [spouse,    setSpouse]    = useState({ ...emptySpouse });
  const [hasChildren, setHasChildren] = useState(null);
  const [children,    setChildren]    = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([{ ...emptyBeneficiary, id: 1 }]);
  const [willsTrust, setWillsTrust] = useState({
    hasWill: null,
    willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"",
    trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"",
  });
  const emptyPoa = { hasPOA: null, poaType: null, agentName: "", agentRelationship: null, agentPhone: "", altAgent: "", poaDate: "", poaAttorney: "", poaLocation: "", poaNotes: "" };
  const [poas, setPoas] = useState([{ ...emptyPoa, id: 1 }]);
  const addPoa = () => setPoas(p => [...p, { ...emptyPoa, id: Date.now() }]);
  const delPoa = id => setPoas(p => { const n = p.filter(x => x.id !== id); return n.length ? n : [{ ...emptyPoa, id: Date.now() }]; });
  const updPoa = (id, f, v) => setPoas(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const [clientEmails, setClientEmails] = useState([{ id: 1, tag: "personal", address: "" }]);
  const [spouseEmails, setSpouseEmails] = useState([{ id: 1, tag: "personal", address: "" }]);
  const [clientEmp, setClientEmp] = useState({ ...emptyEmployer });
  const [spouseEmp, setSpouseEmp] = useState({ ...emptyEmployer });
  const [empView, setEmpView] = useState("client");
  const [extraEmps, setExtraEmps] = useState([]);
  const [idView, setIdView] = useState("client");
  const [idPrimary, setIdPrimary] = useState("client");
  const [tcCopyAddr, setTcCopyAddr] = useState("");
  const [importantDates, setImportantDates] = useState({ anniversary:"", firstMeeting:"", portfolioReviews:[], rmdDates:[], renewalDates:[], familyNotes:"" });
  // rmdDates shape: { date:"", owner:"", linkedAcctId:"" }
  const [incomes, setIncomes] = useState([{ ...emptyIncome, id: 1 }]);
  const activeIncomes = incomes;
  const [autos, setAutos] = useState([{ ...emptyAuto, id: 1 }]);
  const [debts, setDebts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [lifePolicies, setLifePolicies] = useState([{ ...emptyLifePolicy, id: 1 }]);
  const emptyNwState = { totalAssets: "", totalLiabilities: "", liquidNetWorth: "", netWorthExHome: "", primaryEquity: "", pbCash: "", pbQualified: "", pbNonQual: "", pbAnnuities: "", pbCVLI: "", pbAlts: "", pbOther: "", notes: "" };
  const [nwState, setNwState] = useState({ ...emptyNwState });
  const emptyInheritance = { expectsInheritance: "", estValue: "", timeline: "", source: "", sourceDetails: "", numberOfSiblings: "", siblingsInvolved: "", specialNeedsFamily: "", specialNeedsTrust: "", specialNeedsDetails: "", nursingCare: "", ltcInsurance: "", nursingCareDetails: "", estatePlanning: "", trusteeArrangements: "", familyConflicts: "", conflictDetails: "", charitableIntent: "", charitableDetails: "", additionalNotes: "" };
  const [inheritances, setInheritances] = useState([{ ...emptyInheritance, id: 1 }]);
  const addInh = () => setInheritances(p => [...p, { ...emptyInheritance, id: Date.now() }]);
  const delInh = id => setInheritances(p => { const n = p.filter(x => x.id !== id); return n.length ? n : [{ ...emptyInheritance, id: Date.now() }]; });
  const updInh = (id, f, v) => setInheritances(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const emptyCallSheet = { fromCompany: "", fromPhone: "", fromAccountNum: "", fromRepName: "", fromRepPhone: "", toCompany: "", toPhone: "", toAccountNum: "", toRepName: "", toRepPhone: "", transferType: "", transferAmount: "", additionalNotes: "" };
  const emptyFollowUp = { task: "", who: [], why: "", status: "open", notes: "", callSheet: { ...emptyCallSheet } };
  const emptyWho = { name: "", when: "", how: "" };
  const [followUps, setFollowUps] = useState([{ ...emptyFollowUp, id: Date.now() }]);
  const addFollowUp = () => setFollowUps(p => [...p, { ...emptyFollowUp, id: Date.now() }]);
  const delFollowUp = id => setFollowUps(p => { const n = p.filter(x => x.id !== id); return n.length ? n : [{ ...emptyFollowUp, id: Date.now() }]; });
  const updFollowUp = (id, f, v) => setFollowUps(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const VAULT_CATEGORIES = [
    "Investment Statements",
    "Voided Check",
    "Driver's License / Photo ID",
    "Wills & Trust Documents",
    "Marriage License",
    "Death Certificate",
    "Power of Attorney",
    "Tax Returns",
    "Insurance Policies",
    "Social Security Card",
    "Birth Certificate",
    "Divorce Decree",
    "Business Documents",
    "Other Documents",
  ];
  const [vaults, setVaults] = useState([]);
  const [vaultPickerVal, setVaultPickerVal] = useState("");
  const addVault = (category) => { if (!category) return; setVaults(p => [...p, { id: Date.now(), category }]); setVaultPickerVal(""); };
  const delVault = id => setVaults(p => p.filter(x => x.id !== id));
  const [realEstate, setRealEstate] = useState([{ ...emptyRealEstate, id: 1 }]);
  const [accounts, setAccounts] = useState([{ ...emptyAccount, id: 1 }]);
  const [uploads, setUploads] = useState({});
  const [appDocs, setAppDocs] = useState(() => JSON.parse(localStorage.getItem("rwg_app_docs") || "[]"));
  const [appFillStatus, setAppFillStatus] = useState({});
  const [advisorInfo, setAdvisorInfo] = useState(() => JSON.parse(localStorage.getItem("rwg_advisor_info") || "{}"));
  const setAdv = f => field => e => setAdvisorInfo(p => { const n = { ...p, [field]: typeof e === "string" ? e : e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; });
  const [clientDlImage, setClientDlImage] = useState(null);
  const [spouseDlImage, setSpouseDlImage] = useState(null);
  const handleDlImageUpload = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const emptySuitability = { riskTolerance: "", investmentObjective: "", timeHorizon: "", liquidityNeeds: "", investmentExperience: "", taxBracket: "", pctEquities: "", pctFixedIncome: "", pctCash: "", pctAlternatives: "", pctAnnuities: "", pctFixedIndexedAnnuities: "", pctFixedAnnuities: "", pctCashValueLife: "", pctLiquidCash: "", pctQualified: "", pctNonQualified: "", lossComfort: "", esgPreference: "", primaryGoal: "", secondaryGoal: "", incomeNeed: "", growthNeed: "", notes: "" };
  const [suitability, setSuitability] = useState({ ...emptySuitability });
  const [homeOwnership, setHomeOwnership] = useState({ ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", annualPropertyTaxes: "", annualInsurance: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
  const [annualExpenses, setAnnualExpenses] = useState({ amount: "", frequency: "monthly" });
  const [recordType, setRecordType] = useState("client");
  const [customMortgageCos, setCustomMortgageCos] = useState(() => JSON.parse(localStorage.getItem("rwg_mortgage_cos") || "[]"));
  const allMortgageCos = [...DEFAULT_MORTGAGE_COS, ...customMortgageCos.filter(c => !DEFAULT_MORTGAGE_COS.includes(c))].sort((a, b) => a.localeCompare(b));
  const addCustomMortgageCo = (val) => {
    const trimmed = val.trim();
    if (!trimmed || DEFAULT_MORTGAGE_COS.includes(trimmed) || customMortgageCos.includes(trimmed)) return;
    const updated = [...customMortgageCos, trimmed].sort((a, b) => a.localeCompare(b));
    setCustomMortgageCos(updated);
    localStorage.setItem("rwg_mortgage_cos", JSON.stringify(updated));
  };
  const [customInstitutions, setCustomInstitutions] = useState(() => JSON.parse(localStorage.getItem("rwg_institutions") || "[]").filter(c => DEFAULT_INSTITUTIONS.includes(c) ? false : c.trim().length > 0));
  const allInstitutions = [...DEFAULT_INSTITUTIONS, ...customInstitutions.filter(c => !DEFAULT_INSTITUTIONS.includes(c))].sort((a, b) => a.localeCompare(b));
  const addCustomInstitution = (val) => {
    const trimmed = val.trim();
    if (!trimmed || DEFAULT_INSTITUTIONS.includes(trimmed) || customInstitutions.includes(trimmed)) return;
    const updated = [...customInstitutions, trimmed].sort((a, b) => a.localeCompare(b));
    setCustomInstitutions(updated);
    localStorage.setItem("rwg_institutions", JSON.stringify(updated));
  };
  const [customPropertyDescs, setCustomPropertyDescs] = useState(() => JSON.parse(localStorage.getItem("rwg_property_descs") || "[]").filter(c => c.trim().length > 0));
  const addCustomPropertyDesc = (val) => {
    const trimmed = val.trim();
    if (!trimmed || customPropertyDescs.includes(trimmed)) return;
    const updated = [...customPropertyDescs, trimmed].sort((a, b) => a.localeCompare(b));
    setCustomPropertyDescs(updated);
    localStorage.setItem("rwg_property_descs", JSON.stringify(updated));
  };
  const DEFAULT_LENDERS = [
    "American Express","Bank of America","Barclays","Capital One","Chase","Citi","Discover","Wells Fargo",
    "Sallie Mae","Navient","Nelnet","Mohela",
    "U.S. Bank","PNC Bank","Truist","TD Bank","Goldman Sachs","Fifth Third Bank","Regions Bank","Citizens Bank","Ally Bank","Synchrony Bank",
    "Navy Federal Credit Union","USAA","SoFi","LendingClub","Rocket Loans",
  ];
  const [customLenders, setCustomLenders] = useState(() => JSON.parse(localStorage.getItem("rwg_lenders") || "[]").filter(c => c.trim().length > 0));
  const allLenders = [...DEFAULT_LENDERS, ...customLenders.filter(c => !DEFAULT_LENDERS.includes(c))].sort((x, y) => x.localeCompare(y));
  const addCustomLender = (val) => {
    const trimmed = val.trim();
    if (!trimmed || DEFAULT_LENDERS.includes(trimmed) || customLenders.includes(trimmed)) return;
    const updated = [...customLenders, trimmed].sort((x, y) => x.localeCompare(y));
    setCustomLenders(updated);
    localStorage.setItem("rwg_lenders", JSON.stringify(updated));
  };
  const DEFAULT_PROPERTY_TYPES = ["Personal Residence","Vacation / Second Home","Farm","Ranch","Raw Land","Acreage","Rental Property","Commercial Property","Condo / Townhome","Duplex / Multi-Family","Mobile / Manufactured Home","Lake House","Investment / Flip","Timeshare","Mineral Rights"];
  const DEFAULT_PROPERTY_DESCS = ["Homestead","2 bed / 1 bath","3 bed / 2 bath","4 bed / 2 bath","4 bed / 3 bath","5+ bed","Barndominium","With acreage","With shop / barn"];
  const [customPropertyTypes, setCustomPropertyTypes] = useState(() => JSON.parse(localStorage.getItem("rwg_property_types") || "[]").filter(c => DEFAULT_PROPERTY_TYPES.includes(c) ? false : c.trim().length > 0));
  const allPropertyTypes = [...DEFAULT_PROPERTY_TYPES, ...customPropertyTypes.filter(c => !DEFAULT_PROPERTY_TYPES.includes(c))];
  const addCustomPropertyType = (val) => {
    const trimmed = val.trim();
    if (!trimmed || DEFAULT_PROPERTY_TYPES.includes(trimmed) || customPropertyTypes.includes(trimmed)) return;
    const updated = [...customPropertyTypes, trimmed].sort((a, b) => a.localeCompare(b));
    setCustomPropertyTypes(updated);
    localStorage.setItem("rwg_property_types", JSON.stringify(updated));
  };
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showSummaryReview, setShowSummaryReview] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const quickViewRef = useRef(null);
  useEffect(() => {
    if (!quickViewOpen) return;
    const handler = e => { if (quickViewRef.current && !quickViewRef.current.contains(e.target)) setQuickViewOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [quickViewOpen]);
  const [quickViewSection, setQuickViewSection] = useState("");
  const [quickViewSelected, setQuickViewSelected] = useState([]);
  const [quickViewPanelOpen, setQuickViewPanelOpen] = useState(false);
  const QV_SECTIONS = [
    ["section-profile",    () => recordType === "prospect" ? "Prospect Profile" : "Client Profile"],
    ["section-citizenship", () => "Driver's License & Citizenship"],
    ["section-family",     () => "Family"],
    ["section-bene",       () => "Beneficiaries"],
    ["section-employment", () => "Employment"],
    ["section-income",     () => "Income"],
    ["section-realestate", () => "Real Estate - Business Assets"],
    ["section-accounts",   () => "Investment & Bank"],
    ["section-wills",      () => "Wills & Trust"],
    ["section-autos",      () => "Autos"],
    ["section-life",       () => "Life Insurance"],
    ["section-networth",   () => "Net Worth / Portfolio"],
    ["section-inheritance",() => "Estate Planning"],
    ["section-alerts",     () => "Alerts"],
    ["section-preferences",() => "Client Preferences"],
    ["section-importantdates",() => "Important Dates / Information"],
    ["section-apps",       () => "Applications / Docs"],
  ];
  const [activeClientId, setActiveClientId] = useState(() => {
    const sid = localStorage.getItem("rwg_activeClientId") || sessionStorage.getItem("rwg_activeClientId");
    return sid ? Number(sid) : null;
  });

  const stateSnapshotRef = useRef({});
  const [sectionUpdatedAt, setSectionUpdatedAt] = useState({});
  const sectionMounted = useRef(false);
  const markSection = id => setSectionUpdatedAt(s => ({ ...s, [id]: new Date() }));

  const [activeSection, setActiveSection] = useState("section-profile");
  const sideRailRef = useRef(null);
  useEffect(() => {
    const ids = ["section-profile","section-citizenship","section-family","section-bene","section-employment","section-income","section-realestate","section-accounts","section-autos","section-debts","section-life","section-networth","section-wills","section-inheritance","section-alerts","section-preferences","section-importantdates","section-apps"];
    let ticking = false;
    const update = () => {
      ticking = false;
      const threshold = 140;
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = id;
      }
      if (!current) current = ids.find(id => document.getElementById(id)) || null;
      if (current) setActiveSection(current);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setTimeout(update, 300);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [view]);

  useEffect(() => {
    if (!sideRailRef.current || !activeSection) return;
    const btn = sideRailRef.current.querySelector(`[data-section="${activeSection}"]`);
    if (btn) btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSection]);

  const setActiveClient = (id) => {
    if (id == null) { localStorage.removeItem("rwg_activeClientId"); sessionStorage.removeItem("rwg_activeClientId"); }
    else { localStorage.setItem("rwg_activeClientId", String(id)); sessionStorage.setItem("rwg_activeClientId", String(id)); }
    setActiveClientId(id);
  };

  const capName = v => v.replace(/(?:^|\s)\S/g, c => c.toUpperCase());
  const setC = f => e => setClient(p => ({ ...p, [f]: e.target.value }));
  const setS = f => e => setSpouse(p => ({ ...p, [f]: e.target.value }));
  const setCN = f => e => setClient(p => ({ ...p, [f]: capName(e.target.value) }));
  const setSN = f => e => setSpouse(p => ({ ...p, [f]: capName(e.target.value) }));
  const setCE = f => e => setClientEmp(p => ({ ...p, [f]: e.target.value }));
  const addExtraEmp = () => setExtraEmps(p => [...p, { ...emptyEmployer, id: Date.now(), owner: empView }]);
  const updExtraEmp = (id, f, v) => setExtraEmps(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  const removeExtraEmp = (id) => showConfirm("Are you sure you're ready to delete this employment record?", () => setExtraEmps(p => p.filter(r => r.id !== id)), "Delete");
  const setSE = f => e => setSpouseEmp(p => ({ ...p, [f]: e.target.value }));

  const saveClient = (record) => {
    setSavedClients(prev => {
      const exists = prev.some(r => r.id === record.id);
      const updated = exists ? prev.map(r => r.id === record.id ? record : r) : [record, ...prev];
      localStorage.setItem("rwg_clients", JSON.stringify(updated));
      return updated;
    });
  };

  const fmtZip = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 9);
    if (d.length > 5) return d.slice(0, 5) + "-" + d.slice(5);
    return d;
  };

  const lookupZip = (zip, onResult) => {
    const base = zip.replace(/\D/g, "");
    if (base.length >= 5) {
      fetch(`https://api.zippopotam.us/us/${base.slice(0, 5)}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d && d.places && d.places[0]) {
            onResult(d.places[0]["place name"], d.places[0]["state abbreviation"]);
          }
        })
        .catch(() => {});
    } else {
      onResult("", "");
    }
  };

  const handleUploadChange = (section, files) => setUploads(p => ({ ...p, [section]: files }));

  // Track last-updated timestamps per sidebar section
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-profile"); }, [client, clientEmails]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-preferences"); }, [client]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-importantdates"); }, [importantDates]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-family"); }, [hasSpouse, spouse, spouseEmails, hasChildren, children]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-bene"); }, [beneficiaries]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-employment"); }, [clientEmp, spouseEmp, extraEmps]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-income"); }, [incomes]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-realestate"); }, [realEstate, homeOwnership]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-accounts"); }, [accounts]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-wills"); }, [willsTrust, poas]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-autos"); }, [autos]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-debts"); }, [debts]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-life"); }, [lifePolicies]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-networth"); }, [nwState, annualExpenses]);
  useEffect(() => { if (!sectionMounted.current) return; markSection("section-inheritance"); }, [inheritances, vaults]);
  useEffect(() => { sectionMounted.current = true; }, []);

  const buildSnapshot = useCallback(() => ({
    client, spouse, hasSpouse, hasChildren, children,
    clientEmails, spouseEmails,
    clientEmp, spouseEmp, extraEmps, incomes, autos, realEstate, accounts,
    beneficiaries, willsTrust, poas, uploads, homeOwnership, annualExpenses, lifePolicies, recordType, nwState, inheritances, vaults, suitability, followUps, importantDates,
  }), [client, spouse, hasSpouse, hasChildren, children, clientEmails, spouseEmails, clientEmp, spouseEmp, extraEmps, incomes, autos, debts, businesses, realEstate, accounts, beneficiaries, willsTrust, poas, uploads, homeOwnership, annualExpenses, lifePolicies, recordType, nwState, inheritances, vaults, suitability, followUps, importantDates]);

  const autoSave = useCallback(() => {
    const snap = buildSnapshot();
    const now = new Date().toISOString();
    localStorage.setItem("rwg_draft", JSON.stringify({ ...snap, savedAt: now }));
    if (activeClientId) {
      setSavedClients(prev => {
        const updated = prev.map(r => r.id === activeClientId ? { ...r, ...snap, savedAt: now } : r);
        localStorage.setItem("rwg_clients", JSON.stringify(updated));
        return updated;
      });
    } else {
      const newId = Date.now();
      const record = { ...snap, id: newId, savedAt: now };
      setSavedClients(prev => {
        const updated = [record, ...prev];
        localStorage.setItem("rwg_clients", JSON.stringify(updated));
        return updated;
      });
      setActiveClient(newId);
    }
    setLastSaved(new Date());
  }, [buildSnapshot, activeClientId]);

  useEffect(() => {
    const id = setInterval(autoSave, 15 * 1000);
    return () => clearInterval(id);
  }, [autoSave]);

  useEffect(() => {
    const t = setTimeout(autoSave, 1200);
    return () => clearTimeout(t);
  }, [autoSave]);

  useEffect(() => {
    if (!activeClientId) return;
    const all = JSON.parse(localStorage.getItem("rwg_clients") || "[]");
    const record = all.find(r => r.id === activeClientId);
    if (!record) return;
    setClient(record.client || { ...emptyClient });
    setSpouse(record.spouse || { ...emptySpouse });
    setClientEmails(record.clientEmails || [{ id: 1, tag: "personal", address: "" }]);
    setSpouseEmails(record.spouseEmails || [{ id: 1, tag: "personal", address: "" }]);
    setHasSpouse(record.hasSpouse || null);
    setHasChildren(record.hasChildren || null);
    setChildren(record.children || []);
    setClientEmp(record.clientEmp || { ...emptyEmployer });
    setSpouseEmp(record.spouseEmp || { ...emptyEmployer });
    setExtraEmps(record.extraEmps || []);
    setIncomes(record.incomes || [{ ...emptyIncome, id: 1 }]);
    setAutos(record.autos || [{ ...emptyAuto, id: 1 }]);
    setDebts(record.debts || []);
    setBusinesses(record.businesses || []);
    setRealEstate(record.realEstate || [{ ...emptyRealEstate, id: 1 }]);
    setAccounts(record.accounts || [{ ...emptyAccount, id: 1 }]);
    setBeneficiaries(record.beneficiaries || [{ ...emptyBeneficiary, id: 1 }]);
    setWillsTrust(record.willsTrust || { hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
    setPoas(record.poas || (record.poa ? [{ ...emptyPoa, ...record.poa, id: 1 }] : [{ ...emptyPoa, id: 1 }]));
    setHomeOwnership(record.homeOwnership || { ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", annualPropertyTaxes: "", annualInsurance: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
    setAnnualExpenses(record.annualExpenses || { amount: "", frequency: "monthly" });
    setLifePolicies(record.lifePolicies || [{ ...emptyLifePolicy, id: 1 }]);
    setRecordType(record.recordType || "client");
    setNwState(record.nwState || { ...emptyNwState });
    setInheritances(record.inheritances || (record.inheritance ? [{ ...record.inheritance, id: 1 }] : [{ ...emptyInheritance, id: 1 }]));
    setVaults(record.vaults || []);
    setFollowUps(record.followUps || [{ ...emptyFollowUp, id: Date.now() }]);
    setImportantDates(record.importantDates || { anniversary:"", firstMeeting:"", portfolioReviews:[], rmdDates:[], renewalDates:[], familyNotes:"" });
    setUploads(record.uploads || {});
    setClientDlImage(record.clientDlImage || null);
    setSpouseDlImage(record.spouseDlImage || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg, color) => {
    setToast({ msg, color: color || ACCENT });
    setTimeout(() => setToast(null), 2800);
  };

  const addIncome = () => setIncomes(p => [...p, { ...emptyIncome, id: Date.now() }]);
  const delIncome = id => setIncomes(p => p.filter(x => x.id !== id));
  const updIncome = (id, f, v) => setIncomes(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const addAuto = () => setAutos(p => [...p, { ...emptyAuto, id: Date.now() }]);
  const delAuto = id => setAutos(p => p.filter(x => x.id !== id));
  const updAuto = (id, f, v) => setAutos(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));
  const addLife = () => setLifePolicies(p => [...p, { ...emptyLifePolicy, id: Date.now() }]);
  const delLife = id => setLifePolicies(p => { const n = p.filter(x => x.id !== id); return n.length ? n : [{ ...emptyLifePolicy, id: Date.now() }]; });
  const updLife = (id, f, v) => setLifePolicies(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const addRE = () => setRealEstate(p => [...p, { ...emptyRealEstate, id: Date.now() }]);
  const delRE = id => setRealEstate(p => p.filter(x => x.id !== id));
  const updRE = (id, f, v) => setRealEstate(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const addAcct = () => setAccounts(p => [...p, { ...emptyAccount, id: Date.now() }]);
  const delAcct = id => setAccounts(p => p.filter(x => x.id !== id));
  const updAcct = (id, f, v) => setAccounts(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const INCOME_LINKED_TYPES = ["Withdrawals", "RMDs"];

  const toggleAcctRmd = (acct, txType) => {
    const needsIncome = INCOME_LINKED_TYPES.includes(txType);
    const prev = accounts.find(x => x.id === acct.id);
    if (prev?.linkedIncomeId) setIncomes(p => p.filter(x => x.id !== prev.linkedIncomeId));
    if (needsIncome) {
      const incId = Date.now();
      const incType = txType === "RMDs" ? "Pension" : "Account Withdrawal";
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: txType, linkedIncomeId: incId } : x));
      setIncomes(p => [...p, { ...emptyIncome, id: incId, type: incType, amount: acct.rmdContribAmount || "", frequency: acct.rmdContribFrequency || "", owner: (acct.owner || "").toLowerCase() === "spouse" ? "spouse" : "client", linkedAcctId: acct.id, institution: acct.institution || "", accountType: acct.type || "", txType }]);
    } else {
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: txType || null, linkedIncomeId: null } : x));
    }
  };

  const syncAcctIncome = (acct, field, value) => {
    updAcct(acct.id, field, value);
    if (!acct.linkedIncomeId) return;
    const incomeField = field === "rmdContribAmount" ? "amount" : field === "rmdContribFrequency" ? "frequency" : field === "institution" ? "institution" : field === "type" ? "accountType" : field === "owner" ? "owner" : null;
    if (incomeField) {
      setIncomes(p => p.map(x => x.id === acct.linkedIncomeId ? { ...x, [incomeField]: incomeField === "owner" ? ((value || "").toLowerCase() === "spouse" ? "spouse" : "client") : value } : x));
    }
  };

  const addBene = () => setBeneficiaries(p => [...p, { ...emptyBeneficiary, id: Date.now() }]);
  const delBene = id => setBeneficiaries(p => p.filter(x => x.id !== id));
  const updBene = (id, f, v) => setBeneficiaries(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const handleSubmit = () => {
    if (!client.firstName.trim() || !client.lastName.trim()) {
      showToast("Client first and last name are required.", DANGER);
      return;
    }

    const fullName = `${client.firstName.trim()} ${client.lastName.trim()}`.toLowerCase();
    const ssnLast4 = (client.ssn || "").replace(/\D/g, "").slice(-4);

    const duplicate = savedClients.find(r => {
      if (r.id === activeClientId) return false;
      const existingName = `${r.client?.firstName?.trim() || ""} ${r.client?.lastName?.trim() || ""}`.toLowerCase();
      const existingLast4 = (r.client?.ssn || "").replace(/\D/g, "").slice(-4);
      if (existingName === fullName) return true;
      if (ssnLast4.length === 4 && existingLast4.length === 4 && ssnLast4 === existingLast4) return true;
      return false;
    });

    const doSave = () => {
      const record = {
        ...buildSnapshot(),
        id: activeClientId || Date.now(),
        savedAt: new Date().toISOString(),
        clientDlImage, spouseDlImage,
      };
      saveClient(record);
      setActiveClient(record.id);
      setSubmitted(true);
    };

    if (duplicate) {
      const existingName = `${duplicate.client?.firstName || ""} ${duplicate.client?.lastName || ""}`;
      const savedDate = new Date(duplicate.savedAt).toLocaleDateString();
      showConfirm(
        `A client named "${existingName}" already exists (saved ${savedDate}).\n\nSave anyway as a new record?`,
        doSave, "Save Anyway"
      );
    } else {
      doSave();
    }
  };

  const loadSampleData = () => {
    setRecordType("client");
    setClient({ firstName:"James", middleName:"Robert", lastName:"Mitchell", dob:"03/15/1968", ssn:"472-88-3291", gender:"Male", filingStatus:"Married", phone:"(615) 482-9173", altPhone:"(615) 391-7204", address:"4821 Stonegate Drive", addressLine2:"", city:"Franklin", state:"TN", zip:"37064", citizenship:"US Citizen", driversLicense:"M420-38159-60317", dlState:"TN", dlExpiration:"03/15/2028", employer:"", occupation:"Regional Vice President" });
    setSpouse({ firstName:"Catherine", middleName:"Anne", lastName:"Mitchell", dob:"07/22/1971", ssn:"519-74-6082", gender:"Female", phone:"(615) 482-9174", altPhone:"", address:"4821 Stonegate Drive", addressLine2:"", city:"Franklin", state:"TN", zip:"37064", citizenship:"US Citizen", driversLicense:"M440-71225-48203", dlState:"TN", dlExpiration:"07/22/2027", occupation:"Middle School Science Teacher" });
    setHasSpouse("married");
    setClientEmails([{ id: 1, tag: "personal", address: "james.mitchell@gmail.com" }, { id: 2, tag: "work", address: "j.mitchell@pinnaclehealthgroup.com" }]);
    setSpouseEmails([{ id: 1, tag: "personal", address: "catherine.mitchell@gmail.com" }, { id: 2, tag: "work", address: "c.mitchell@wcs.edu" }]);
    setClientEmp({ employerName:"Pinnacle Healthcare Group", jobTitle:"Regional Vice President", workAddress:"1200 Meridian Blvd", workCity:"Nashville", workState:"TN", workZip:"37212", workPhone:"(615) 844-2200", startDate:"04/01/2014", payFrequency:"bimonthly", compensation:"$14,583", annualEquivalent:"$175,000" });
    setSpouseEmp({ employerName:"Williamson County Schools", jobTitle:"Middle School Science Teacher", workAddress:"701 Highway 96 West", workCity:"Franklin", workState:"TN", workZip:"37064", workPhone:"(615) 472-4000", startDate:"08/15/2004", payFrequency:"monthly", compensation:"$5,100", annualEquivalent:"$61,200" });
    setHasChildren("yes");
    setChildren([
      { id: 1, firstName:"Tyler", middleName:"James", lastName:"Mitchell", dob:"09/12/2002", age:"21", ssn:"601-33-8847", gender:"Male", dependent:"no", livingAt:"College — University of Tennessee, Knoxville" },
      { id: 2, firstName:"Olivia", middleName:"Grace", lastName:"Mitchell", dob:"04/28/2005", age:"19", ssn:"602-51-9034", gender:"Female", dependent:"yes", livingAt:"Home" },
    ]);
    setIncomes([
      { id: 1, type:"Salary / W-2", amount:"$14,583", frequency:"monthly", owner:"client", institution:"Pinnacle Healthcare Group" },
      { id: 2, type:"Salary / W-2", amount:"$5,100", frequency:"monthly", owner:"spouse", institution:"Williamson County Schools" },
      { id: 3, type:"Rental Income", amount:"$2,200", frequency:"monthly", owner:"joint", institution:"1203 Elm Creek Blvd Property" },
      { id: 4, type:"Investment / Dividends", amount:"$8,400", frequency:"annual", owner:"joint", institution:"Fidelity Investments" },
    ]);
    setAutos([
      { id: 1, year:"2022", make:"BMW", model:"X5 xDrive40i", vin:"5UXCR6C09N9K48321", color:"Alpine White", value:"$68,500", loanBalance:"$31,200", loanCompany:"BMW Financial Services", monthlyPayment:"$948", owner:"client" },
      { id: 2, year:"2021", make:"Toyota", model:"Highlander XLE", vin:"5TDJZRFH5MS128744", color:"Midnight Black", value:"$38,900", loanBalance:"$0", loanCompany:"", monthlyPayment:"$0", owner:"spouse" },
    ]);
    setRealEstate([
      { id: 1, description:"Personal Residence", descriptionNote:"Primary Home — Franklin TN", purchaseDate:"06/15/2012", purchasePrice:"$485,000", marketValue:"$892,000", mortgageBalance:"$187,400", netEquity:"$704,600", address:"4821 Stonegate Drive", addressLine2:"", city:"Franklin", state:"TN", zip:"37064", mortgageCompany:"Wells Fargo Home Mortgage", originationDate:"06/15/2012", interestRate:"3.625%", monthlyPmt:"$2,284", propertyTaxes:"$7,800", insurance:"$2,100", pmtIncludesTaxIns:"yes", hasOpt:null, optEvent:"", optTimeframe:"", hasZillow:"yes" },
      { id: 2, description:"Investment / Rental", descriptionNote:"Rental Property — Nashville TN", purchaseDate:"03/22/2018", purchasePrice:"$285,000", marketValue:"$374,000", mortgageBalance:"$198,600", netEquity:"$175,400", address:"1203 Elm Creek Blvd", addressLine2:"Unit A", city:"Nashville", state:"TN", zip:"37209", mortgageCompany:"Rocket Mortgage / Quicken Loans", originationDate:"03/22/2018", interestRate:"4.250%", monthlyPmt:"$1,403", propertyTaxes:"$4,200", insurance:"$1,600", pmtIncludesTaxIns:"no", hasOpt:null, optEvent:"", optTimeframe:"", hasZillow:"yes" },
    ]);
    setAccounts([
      { id: 1, type:"401(k)", institution:"Fidelity Investments", owner:"Client", accountNumber:"4401882937", balance:"$487,320", qualified:"Qualified Retirement", hasRmdOrContrib:"Contributing", rmdContribAmount:"$2,000", rmdContribFrequency:"monthly" },
      { id: 2, type:"Roth IRA", institution:"Fidelity Investments", owner:"Client", accountNumber:"4418839201", balance:"$112,480", qualified:"Qualified Retirement", hasRmdOrContrib:"Contributing", rmdContribAmount:"$583", rmdContribFrequency:"monthly" },
      { id: 3, type:"401(k)", institution:"Vanguard", owner:"Spouse", accountNumber:"7732049185", balance:"$198,750", qualified:"Qualified Retirement", hasRmdOrContrib:"Contributing", rmdContribAmount:"$800", rmdContribFrequency:"monthly" },
      { id: 4, type:"Roth IRA", institution:"Vanguard", owner:"Spouse", accountNumber:"7748201934", balance:"$44,320", qualified:"Qualified Retirement", hasRmdOrContrib:"Contributing", rmdContribAmount:"$583", rmdContribFrequency:"monthly" },
      { id: 5, type:"Non-Qualified Brokerage", institution:"Charles Schwab", owner:"Joint", accountNumber:"8812049302", balance:"$324,150", qualified:"Non-Qualified", hasRmdOrContrib:null, rmdContribAmount:"", rmdContribFrequency:"" },
      { id: 6, type:"Checking / Savings", institution:"Bank of America", owner:"Joint", accountNumber:"0042918833", balance:"$48,700", qualified:"Non-Qualified", hasRmdOrContrib:null, rmdContribAmount:"", rmdContribFrequency:"" },
      { id: 7, type:"Money Market", institution:"Bank of America", owner:"Joint", accountNumber:"0053920174", balance:"$85,000", qualified:"Non-Qualified", hasRmdOrContrib:null, rmdContribAmount:"", rmdContribFrequency:"" },
      { id: 8, type:"Annuity (Fixed Indexed)", institution:"North American Company", owner:"Client", accountNumber:"NA-7749021", balance:"$215,000", qualified:"Non-Qualified", hasRmdOrContrib:null, rmdContribAmount:"", rmdContribFrequency:"" },
    ]);
    setBeneficiaries([
      { id: 1, firstName:"Catherine", middleName:"Anne", lastName:"Mitchell", relationship:"Spouse", designationType:"primary", percentage:"100%", dob:"07/22/1971", ssn:"519-74-6082", email:"catherine.mitchell@gmail.com", addressSource:"manual", addressLine1:"4821 Stonegate Drive", city:"Franklin", state:"TN", zip:"37064" },
      { id: 2, firstName:"Tyler", middleName:"James", lastName:"Mitchell", relationship:"Child", designationType:"contingent", percentage:"50%", dob:"09/12/2002", ssn:"601-33-8847", email:"tyler.mitchell@utk.edu", addressSource:"manual", addressLine1:"1811 Cumberland Ave", city:"Knoxville", state:"TN", zip:"37916" },
      { id: 3, firstName:"Olivia", middleName:"Grace", lastName:"Mitchell", relationship:"Child", designationType:"contingent", percentage:"50%", dob:"04/28/2005", ssn:"602-51-9034", email:"olivia.mitchell@gmail.com", addressSource:"manual", addressLine1:"4821 Stonegate Drive", city:"Franklin", state:"TN", zip:"37064" },
    ]);
    setWillsTrust({ hasWill:"yes", willDate:"11/08/2019", willAttorney:"Bradford & Simmons Law Group", executor:"Catherine A. Mitchell", altExecutor:"Tyler J. Mitchell", willLocation:"Safe deposit box — Bank of America Franklin Branch", willUpdated:"yes", willUpdateDate:"11/08/2019", willNotes:"Pours over into living trust. Reviewed by attorney after second property purchase.", trustName:"Mitchell Family Living Trust", trustType:"revocable", trustDate:"11/08/2019", trustee:"James R. Mitchell & Catherine A. Mitchell", successorTrustee:"Tyler J. Mitchell", trustAttorney:"Bradford & Simmons Law Group", assetsTitled:"yes", trustLocation:"Safe deposit box — Bank of America Franklin Branch", trustNotes:"All real estate, brokerage, and non-qualified accounts titled in trust name." });
    setPoas([{ ...emptyPoa, id: 1, hasPOA:"yes", poaType:"Durable Power of Attorney", agentName:"Catherine A. Mitchell", agentRelationship:"spouse", agentPhone:"(615) 482-9174", altAgent:"Tyler J. Mitchell", poaDate:"11/08/2019", poaAttorney:"Bradford & Simmons Law Group", poaLocation:"Safe deposit box — Bank of America Franklin Branch", poaNotes:"Healthcare directive also on file with Vanderbilt University Medical Center." }]);
    setLifePolicies([
      { id: 1, carrier:"Lincoln Financial", policyType:"Term", termLength:"20", insured:"James R. Mitchell", owner:"Mitchell Family Living Trust", deathBenefit:"$1,000,000", cashValue:"", surrender:"", premiumAmount:"$148", premiumFrequency:"monthly", policyNumber:"LF-20-4482019", issueDate:"05/12/2014" },
      { id: 2, carrier:"Northwestern Mutual", policyType:"Whole Life", termLength:"", insured:"James R. Mitchell", owner:"James R. Mitchell", deathBenefit:"$250,000", cashValue:"$87,400", surrender:"$81,200", premiumAmount:"$612", premiumFrequency:"monthly", policyNumber:"NM-88-2031947", issueDate:"01/15/2005" },
      { id: 3, carrier:"Protective Life", policyType:"Term", termLength:"10", insured:"Catherine A. Mitchell", owner:"Mitchell Family Living Trust", deathBenefit:"$500,000", cashValue:"", surrender:"", premiumAmount:"$72", premiumFrequency:"monthly", policyNumber:"PL-10-7719384", issueDate:"09/22/2018" },
    ]);
    setHomeOwnership({ ownOrRent:"own", mortgageCompany:"Wells Fargo Home Mortgage", mortgageBalance:"$187,400", monthlyPayment:"$2,284", interestRate:"3.625%", loanOriginationDate:"06/15/2012", loanNumber:"WF-3812049-TN", monthlyRent:"", landlordName:"", landlordPhone:"" });
    setAnnualExpenses({ amount:"$12,500", frequency:"monthly" });
    setNwState({ totalAssets:"$2,489,120", totalLiabilities:"$417,200", liquidNetWorth:"$1,315,720", netWorthExHome:"$1,367,720", primaryEquity:"$704,600", pbCash:"$133,700", pbQualified:"$843,870", pbNonQual:"$324,150", pbAnnuities:"$215,000", pbCVLI:"$87,400", pbAlts:"", pbOther:"", notes:"Net worth calculated as of current market valuations. Primary residence per Zillow estimate. Annuity surrender value used for NW calculation. Life insurance CSV included in non-qualified bucket." });
    setInheritances([{ id: 1, expectsInheritance:"possibly", estValue:"$600,000", timeline:"6-10 years", source:"parent", sourceDetails:"Robert E. Mitchell Sr. (age 78, Brentwood TN) — estate estimated $1.2M split with one sibling", numberOfSiblings:"1", siblingsInvolved:"yes_equal", familyConflicts:"no", conflictDetails:"", specialNeedsFamily:"no", specialNeedsTrust:"na", specialNeedsDetails:"", nursingCare:"yes_parent", ltcInsurance:"no", nursingCareDetails:"Father Robert Mitchell Sr. is in early-stage Alzheimer's. Currently at home with part-time care aide. Long-term memory care facility likely within 2–4 years. No LTC insurance in place. Potential Medicaid planning needed.", estatePlanning:"yes_partial", trusteeArrangements:"client_is_executor", charitableIntent:"considering", charitableDetails:"Family has historically supported St. Jude Children's Research Hospital and local Williamson County food bank.", additionalNotes:"Mother Margaret Mitchell (age 74) is in good health. Family home on Granny White Pike in Brentwood is the primary estate asset. Brother David Mitchell (age 53) is co-executor." }]);
    setVaults([]);
    setActiveClient(null);
    setSubmitted(false);
    window.scrollTo(0, 0);
    showToast("Sample client loaded — James & Catherine Mitchell", SUCCESS);
  };

  const handleReset = () => {
    setClient({ ...emptyClient }); setSpouse({ ...emptySpouse });
    setClientEmails([{ id: 1, tag: "personal", address: "" }]);
    setSpouseEmails([{ id: 1, tag: "personal", address: "" }]);
    setClientEmp({ ...emptyEmployer }); setSpouseEmp({ ...emptyEmployer }); setExtraEmps([]);
    setIncomes([{ ...emptyIncome, id: 1 }]);
    setAutos([{ ...emptyAuto, id: 1 }]);
    setRealEstate([{ ...emptyRealEstate, id: 1 }]);
    setAccounts([{ ...emptyAccount, id: 1 }]);
    setHasSpouse(null); setHasChildren(null); setChildren([]);
    setBeneficiaries([{ ...emptyBeneficiary, id: 1 }]);
    setWillsTrust({ hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
    setPoas([{ ...emptyPoa, id: 1 }]);
    setUploads({});
    setClientDlImage(null);
    setSpouseDlImage(null);
    setLifePolicies([{ ...emptyLifePolicy, id: 1 }]);
    setRecordType("client");
    setNwState({ ...emptyNwState });
    setInheritances([{ ...emptyInheritance, id: 1 }]);
    setVaults([]);
    setFollowUps([{ ...emptyFollowUp, id: Date.now() }]);
    setImportantDates({ anniversary:"", firstMeeting:"", portfolioReviews:[], rmdDates:[], renewalDates:[], familyNotes:"" });
    setActiveClient(null);
    setSubmitted(false);
    setSectionUpdatedAt({});
  };

  if (view === "roster") {
    return (
      <>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 3000, maxWidth: "calc(100vw - 40px)", background: toast.color, color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, boxShadow: "0 8px 24px rgba(15,23,42,0.16)" }}>
          {toast.msg}
        </div>
      )}
      <ClientRoster
        clients={savedClients}
        onOpen={(record) => {
          setClient(record.client || { ...emptyClient });
          setSpouse(record.spouse || { ...emptySpouse });
          setClientEmails(record.clientEmails || [{ id: 1, tag: "personal", address: "" }]);
          setSpouseEmails(record.spouseEmails || [{ id: 1, tag: "personal", address: "" }]);
          setHasSpouse(record.hasSpouse || null);
          setHasChildren(record.hasChildren || null);
          setChildren(record.children || []);
          setClientEmp(record.clientEmp || { ...emptyEmployer });
          setSpouseEmp(record.spouseEmp || { ...emptyEmployer });
          setExtraEmps(record.extraEmps || []);
          setIncomes(record.incomes || [{ ...emptyIncome, id: 1 }]);
          setAutos(record.autos || [{ ...emptyAuto, id: 1 }]);
    setDebts(record.debts || []);
    setBusinesses(record.businesses || []);
          setRealEstate(record.realEstate || [{ ...emptyRealEstate, id: 1 }]);
          setAccounts(record.accounts || [{ ...emptyAccount, id: 1 }]);
          setBeneficiaries(record.beneficiaries || [{ ...emptyBeneficiary, id: 1 }]);
          setWillsTrust(record.willsTrust || { hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
          setPoas(record.poas || (record.poa ? [{ ...emptyPoa, ...record.poa, id: 1 }] : [{ ...emptyPoa, id: 1 }]));
          setUploads(record.uploads || {});
          setHomeOwnership(record.homeOwnership || { ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", annualPropertyTaxes: "", annualInsurance: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
          setAnnualExpenses(record.annualExpenses || { amount: "", frequency: "monthly" });
          setLifePolicies(record.lifePolicies || [{ ...emptyLifePolicy, id: 1 }]);
          setRecordType(record.recordType || "client");
          setNwState(record.nwState || { ...emptyNwState });
          setSuitability(record.suitability || { ...emptySuitability });
          setClientDlImage(record.clientDlImage || null);
          setSpouseDlImage(record.spouseDlImage || null);
          setActiveClient(record.id);
          setSubmitted(false);
          setSectionUpdatedAt({});
          sectionMounted.current = false;
          setTimeout(() => { sectionMounted.current = true; }, 50);
          setView("form");
          window.scrollTo(0, 0);
        }}
        onDuplicate={(record) => {
          const copy = { ...record, id: Date.now(), savedAt: new Date().toISOString(), client: { ...record.client, firstName: record.client?.firstName ? "Copy of " + record.client.firstName : "Copy" } };
          const updated = [copy, ...savedClients];
          localStorage.setItem("rwg_clients", JSON.stringify(updated));
          setSavedClients(updated);
          showToast("Record duplicated — open it from the list to edit.", ACCENT);
        }}
        onDelete={(id) => {
          const updated = savedClients.filter(c => c.id !== id);
          localStorage.setItem("rwg_clients", JSON.stringify(updated));
          setSavedClients(updated);
        }}
        onBack={() => setView("form")}
        onConfirm={showConfirm}
        currentName={[client.firstName, client.lastName].filter(Boolean).join(" ") || null}
        currentType={recordType}
        onExport={() => {
          const data = JSON.stringify(savedClients, null, 2);
          const blob = new Blob([data], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `rwg-clients-backup-${new Date().toISOString().slice(0,10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onImport={(text) => {
          try {
            const cleaned = String(text).replace(/^\uFEFF/, "").trim();
            if (cleaned.startsWith("<")) { showToast("That file is a web page, not the backup — download the RAW .json file and try again.", DANGER); return; }
            let imported = JSON.parse(cleaned);
            if (!Array.isArray(imported)) imported = [imported];
            imported = imported.filter(r => r && typeof r === "object" && (r.client || r.id));
            if (imported.length === 0) throw new Error("No client records found");
            showConfirm(
              `Import ${imported.length} record(s)? Existing records with the same ID will be updated; new records will be added.`,
              () => {
                const merged = [...savedClients];
                imported.forEach(rec => {
                  const idx = merged.findIndex(r => r.id === rec.id);
                  if (idx >= 0) merged[idx] = rec;
                  else merged.unshift(rec);
                });
                localStorage.setItem("rwg_clients", JSON.stringify(merged));
                setSavedClients(merged);
                showToast(`${imported.length} record(s) imported successfully.`, SUCCESS);
              },
              "Import"
            );
          } catch {
            showToast("Import failed — file is not a valid backup.", DANGER);
          }
        }}
      />
      {confirmState.open && (
        <ConfirmDialog
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          onConfirm={() => { closeConfirm(); confirmState.onConfirm && confirmState.onConfirm(); }}
          onCancel={closeConfirm}
        />
      )}
      </>
    );
  }

  if (submitted) {
    const totalAssets = [
      ...accounts.map(a => parseInt((a.balance || "$0").replace(/[^0-9]/g, "") || 0)),
      ...realEstate.map(r => parseInt((r.marketValue || "$0").replace(/[^0-9]/g, "") || 0)),
    ].reduce((a, b) => a + b, 0);
    return (
      <div style={{ background: PAGE_BG, minHeight: "100vh", color: INK, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 16, padding: 36, maxWidth: 500, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 14, color: SUCCESS }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>Intake Complete</div>
          <div style={{ fontSize: 15, color: INK, marginBottom: 4 }}>
            <span style={{ color: INK, fontWeight: "bold" }}>{client.firstName} {client.lastName}</span>'s profile has been recorded.
          </div>
          {["married","domestic_partner"].includes(hasSpouse) && (
            <div style={{ fontSize: 15, color: INK, marginBottom: 4 }}>
              Spouse <span style={{ color: INK, fontWeight: "bold" }}>{spouse.firstName} {spouse.lastName}</span> also recorded.
            </div>
          )}
          {totalAssets > 0 && (
            <div style={{ background: INPUT_BG, border: "1px solid " + BORDER, borderRadius: 8, padding: "12px 18px", marginTop: 16, marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginBottom: 4 }}>Total Assets Captured</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: INK }}>${totalAssets.toLocaleString()}</div>
            </div>
          )}
          <button onClick={handleReset} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 16 }}>
            Start New Intake
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div id="rwg-main-app" style={{ background: PAGE_BG, minHeight: "100vh", color: INK }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 3000, maxWidth: "calc(100vw - 40px)", background: toast.color, color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, boxShadow: "0 8px 24px rgba(15,23,42,0.16)" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "stretch" }}>

        {/* ── SIDEBAR ── */}
        <aside ref={sideRailRef} className="side-rail" style={{ width: 226, flexShrink: 0, background: NAV, borderRight: "1px solid " + BORDER, position: "sticky", top: 0, height: "100vh", overflowY: "auto", boxSizing: "border-box", padding: "18px 10px" }}>
          <div style={{ padding: "0 6px 10px" }}>
            <BrandLockup mark={42} />
            <div style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 5 }}>{recordType === "prospect" ? "Prospect Intake" : "Client Intake"}</div>
            {(() => {
              const married = ["married","domestic_partner"].includes(hasSpouse);
              const cFirst = (client.firstName || "").trim();
              const cLast = (client.lastName || "").trim();
              const sFirst = (spouse.firstName || "").trim();
              const sLast = (spouse.lastName || "").trim();
              let names = "";
              if (cFirst || cLast) {
                if (married && sFirst) {
                  names = (sLast && sLast !== cLast)
                    ? `${cFirst} ${cLast} & ${sFirst} ${sLast}`
                    : `${cFirst} & ${sFirst} ${cLast}`;
                } else {
                  names = `${cFirst} ${cLast}`.trim();
                }
              }
              return names ? (
                <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: INK, marginTop: 6 }}>{names}</div>
              ) : null;
            })()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Intake Sections</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Updated</span>
          </div>
          {[
            ["section-profile",   recordType === "prospect" ? "Prospect Profile" : "Client Profile"],
            ["section-citizenship", "Driver's License & Citizenship"],
            ["section-family",    "Family"],
            ["section-bene",      "Beneficiaries"],
            ["section-employment","Employment"],
            ["section-income",    "Income"],
            ["section-realestate","Real Estate - Business Assets"],
            ["section-accounts",  "Investment & Bank Acct"],
            ["section-autos",     "Automobiles"],
            ["section-debts",     "Debt / Liabilities"],
            ["section-life",      "Life Insurance"],
            ["section-networth",  "Net Worth / Portfolio"],
            ["section-wills",     "Wills & Trust"],
            ["section-inheritance", "Estate Planning"],
            ["section-alerts",     "Alerts"],
            ["section-preferences","Client Preferences"],
            ["section-importantdates","Important Dates / Information"],
            ["section-apps",       "Applications / Docs"],
          ].map(([id, label]) => {
            const ts = sectionUpdatedAt[id];
            return (
              <button
                key={id}
                onClick={() => {
                  const el = document.getElementById(id);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="side-nav"
                data-section={id}
                style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", textAlign: "left", background: activeSection === id ? "rgba(47,58,74,0.13)" : "transparent", border: "none", color: activeSection === id ? INK : "#39414f", borderRadius: 9, padding: "5px 6px", marginBottom: 1, fontSize: 12.5, fontWeight: activeSection === id ? 700 : 500, cursor: "pointer", lineHeight: 1.3 }}
              >
                <IconChip id={id} size={22} />
                <span style={{ flex: 1 }}>{label}</span>
                {ts && (
                  <span style={{ fontSize: 8.5, color: MUTED, fontWeight: 500, whiteSpace: "nowrap", lineHeight: 1.25, textAlign: "right" }}>
                    {ts.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}<br/>
                    {ts.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>

        {/* ── MOBILE TOP BAR ── */}
        <div className="mobile-top" style={{ display: "none", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", background: NAV, borderBottom: "1px solid " + BORDER }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AcornMark size={28} />
            <span style={{ fontFamily: BRAND_SERIF, fontSize: 14, letterSpacing: "0.12em", color: BRAND_NAVY }}>RUSSELL <span style={{ fontSize: 10, letterSpacing: "0.2em" }}>WEALTH GROUP</span></span>
          </span>
          <button onClick={() => setView("roster")} style={{ background: INPUT_BG, color: INK, border: "1px solid " + BORDER, borderRadius: 10, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Saved ({savedClients.length})
          </button>
        </div>

        <div className="main-col" style={{ maxWidth: 940, padding: "28px 28px 44px" }}>

        <div style={{ marginBottom: 16 }}>
          {/* Row 1: title only */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}>{recordType === "prospect" ? "Prospect Intake" : "Client Intake"}</h1>
            {recordType && (
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: recordType === "client" ? "#2fa76f" : BRAND_NAVY, border: `1px solid ${recordType === "client" ? "#2fa76f" : BRAND_NAVY}`, borderRadius: 5, padding: "2px 8px", whiteSpace: "nowrap" }}>
                {recordType === "client" ? "Client" : "Prospect"}
              </span>
            )}
          </div>
          {/* Row 2: subtitle left, buttons far right */}
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 6 }}>
            <span style={{ flex: 1, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
              Russell Wealth Group · Confidential
              <br />
              <span style={{ marginRight: 6 }}>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
              <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </span>
            {/* Button group */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexShrink: 0, marginLeft: 16 }}>
              {recordType === "prospect" && (
                <button onClick={() => showConfirm("Convert this prospect to a client?", () => setRecordType("client"), "Convert")}
                  style={{ background: "#2fa76f", color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Prospect → Client</button>
              )}
              {/* Column 1: Add Prospect / Add Client stacked */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={() => showConfirm("Start a new prospect record? Current form will be cleared.", () => { handleReset(); setRecordType("prospect"); window.scrollTo(0,0); })}
                  style={{ background: BRAND_NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Prospect</button>
                <button onClick={() => showConfirm("Start a new client record? Current form will be cleared.", () => { handleReset(); setRecordType("client"); window.scrollTo(0,0); })}
                  style={{ background: BRAND_NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Client</button>
              </div>
              {/* Column 2: Quick View / Saved Clients stacked */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div ref={quickViewRef} style={{ position: "relative" }}>
                  <button onClick={() => setQuickViewOpen(o => !o)}
                    style={{ background: "#64748b", color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, width: "100%" }}>
                    Quick View {quickViewSelected.length > 0 && <span style={{ background: "rgba(255,255,255,0.28)", borderRadius: 999, padding: "1px 6px", fontSize: 11 }}>{quickViewSelected.length}</span>} <span style={{ fontSize: 10, marginLeft: "auto" }}>{quickViewOpen ? "▲" : "▼"}</span>
                  </button>
                  {quickViewOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: "1px solid " + BORDER, borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.16)", zIndex: 3000, minWidth: 230, display: "flex", flexDirection: "column" }}>
                      <div style={{ padding: "8px 14px 6px", borderBottom: "1px solid " + BORDER, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Select Sections</span>
                        {quickViewSelected.length > 0 && (
                          <button onClick={() => setQuickViewSelected([])} style={{ background: "none", border: "none", fontSize: 11, color: DANGER, cursor: "pointer", padding: 0, fontWeight: 600 }}>Clear</button>
                        )}
                      </div>
                      <div style={{ overflowY: "auto", maxHeight: 280 }}>
                        {QV_SECTIONS.map(([id, getLabel]) => {
                          const label = getLabel();
                          const checked = quickViewSelected.includes(id);
                          return (
                            <label key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", cursor: "pointer", background: checked ? "#f0f4ff" : "none", borderLeft: checked ? "3px solid " + BRAND_NAVY : "3px solid transparent" }}
                              onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#f4f6f9"; }}
                              onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "none"; }}
                            >
                              <input type="checkbox" checked={checked} onChange={() => setQuickViewSelected(s => checked ? s.filter(x => x !== id) : [...s, id])}
                                style={{ accentColor: BRAND_NAVY, width: 14, height: 14, cursor: "pointer", flexShrink: 0 }} />
                              <span style={{ fontSize: 13, color: INK, fontWeight: checked ? 600 : 500 }}>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div style={{ padding: "8px 14px 10px", borderTop: "1px solid " + BORDER }}>
                        <button disabled={quickViewSelected.length === 0} onClick={() => { setQuickViewPanelOpen(true); setQuickViewOpen(false); }}
                          style={{ width: "100%", background: quickViewSelected.length === 0 ? "#ccc" : BRAND_NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: quickViewSelected.length === 0 ? "default" : "pointer" }}>
                          View Selected {quickViewSelected.length > 0 ? `(${quickViewSelected.length})` : ""}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setView("roster")}
                  style={{ background: BRAND_NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>Saved Clients</span>
                  <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{savedClients.length}</span>
                </button>
              </div>
              {/* Column 3: Load Sample + Summary Review */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={() => showConfirm("Load sample client data? This will overwrite the current form.", loadSampleData, "Load Sample")}
                  style={{ background: "#64748b", color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Load Sample</button>
                <button onClick={() => setShowSummaryReview(true)}
                  style={{ background: "#2e3d66", color: "#fff", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Summary Review</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CLIENT PROFILE ── */}
        <Panel title={recordType === "prospect" ? "Prospect Profile" : "Client Profile"} id="section-profile">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <F style={{ flex: "0 0 143px" }}><Lbl t="First" /><input value={client.firstName} onChange={setCN("firstName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 143px" }}><Lbl t="Middle" /><input value={client.middleName} onChange={setCN("middleName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 143px" }}><Lbl t="Last" /><input value={client.lastName} onChange={setCN("lastName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Nickname" />
              <input value={client.nickname || ""} onChange={setC("nickname")} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={client.dob} onChange={v => setClient(p => ({ ...p, dob: v }))} compact monthW={68} dayW={60} yearW={62} /></div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Social Security Number" />
              <input value={client.ssn} onChange={e => setClient(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={{ ...IS, width: 128 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Dependents" />
              <select data-lpignore="true" value={client.numDependents || ""} onChange={setC("numDependents")} style={{ ...IS, width: 62 }}>
                <option value="">—</option>
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Gender" />
              <select data-lpignore="true" value={client.gender || ""} onChange={setC("gender")} style={{ ...IS, width: 108 }}>
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Cell Phone" />
              <input value={client.cell} onChange={e => setClient(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={{ ...IS, width: 135 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Home Phone" />
              <input value={client.homePhone} onChange={e => setClient(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={{ ...IS, width: 135 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Known Client Since" />
              <div style={{ display: "flex", gap: 6 }}>
                <select value={client.knownSinceMonth || ""} onChange={setC("knownSinceMonth")} style={{ ...IS, width: 74 }} data-lpignore="true">
                  <option value="">Mo</option>
                  {MONTHS.map((m, i) => <option key={i} value={String(i + 1).padStart(2, "0")}>{m}</option>)}
                </select>
                <input value={client.knownSinceYear || ""} onChange={setC("knownSinceYear")} style={{ ...IS, width: 58 }} placeholder="Year" maxLength={4} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Marital Status" />
              <select data-lpignore="true" value={client.filingStatus || ""} onChange={setC("filingStatus")} style={{ ...IS, width: 165 }}>
                <option value="">— Select —</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
                <option value="Widower">Widower</option>
                <option value="Domestic Partner">Domestic Partner</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
            <F style={{ flex: "0 0 189px" }}><Lbl t="Physical Address" /><input value={client.tcAddress || ""} onChange={setC("tcAddress")} style={{ ...IS, width: 189 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 99px" }}><Lbl t="ZIP" /><input value={client.tcZip || ""} onChange={e => { const z = fmtZip(e.target.value); setClient(p => ({ ...p, tcZip: z })); lookupZip(z, (city, state) => setClient(p => ({ ...p, tcCity: city, tcState: state }))); }} style={{ ...IS, width: 99 }} inputMode="numeric" maxLength={10} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 140px" }}><Lbl t="City" /><input value={client.tcCity || ""} onChange={setC("tcCity")} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 224px" }}>
              <Lbl t="State" />
              <StateSelect value={client.tcState || ""} onChange={e => setClient(p => ({ ...p, tcState: e.target.value }))} style={{ width: 224 }} />
            </F>
            <F style={{ flex: "0 0 160px" }}><Lbl t="Country" /><CountrySelect value={client.tcCountry || "USA"} onChange={e => setClient(p => ({ ...p, tcCountry: e.target.value }))} style={{ ...IS, width: 160 }} /></F>
            <F style={{ flex: "0 0 114px" }}>
              <Lbl t="PO Box Pref?" />
              <select data-lpignore="true" value={client.mailPoPref || ""} onChange={setC("mailPoPref")} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
          </div>
          {client.mailPoPref === "yes" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="PO Box #" />
                <input value={client.mailPoBox || ""} onChange={setC("mailPoBox")} onBlur={e => setClient(p => ({ ...p, mailPoBox: fmtPOBox(e.target.value) }))} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="ZIP" />
                <input value={client.mailPoZip || ""} onChange={e => { const z = fmtZip(e.target.value); setClient(p => ({ ...p, mailPoZip: z })); lookupZip(z, (city, state) => setClient(p => ({ ...p, mailPoCity: city, mailPoState: state }))); }} maxLength={10} style={{ ...IS, width: 97 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="City" />
                <input value={client.mailPoCity || ""} onChange={setC("mailPoCity")} style={{ ...IS, width: 144 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="State" />
                <StateSelect value={client.mailPoState || ""} onChange={setC("mailPoState")} style={{ width: 224 }} />
              </div>
            </>
          </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ flex: "none" }}>
              <Lbl t="Email Addresses" />
              {clientEmails.map((em, i) => (
                <div key={em.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <select data-lpignore="true" value={em.tag} onChange={e => setClientEmails(p => p.map(x => x.id === em.id ? { ...x, tag: e.target.value } : x))} style={{ ...IS, width: 110, flex: "none" }}>
                    <option value="personal">Personal</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="spouse">Spouse</option>
                  </select>
                  <input value={em.address} onChange={e => setClientEmails(p => p.map(x => x.id === em.id ? { ...x, address: e.target.value } : x))} type="email" placeholder="email@example.com" style={{ ...IS, width: 240, flex: "none" }} autoComplete="new-password" data-lpignore="true" />
                  {em.address && <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(em.address)}`} target="_blank" rel="noreferrer" title="Send email" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "#e8f0fe", border: "1px solid #b3c8f5", borderRadius: 7, color: "#2563eb", textDecoration: "none", fontSize: 16 }}>✉</a>}
                  {clientEmails.length > 1 && (
                    <button onClick={() => showConfirm("Remove this email?", () => setClientEmails(p => p.filter(x => x.id !== em.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flex: "none" }}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setClientEmails(p => [...p, { id: Date.now(), tag: "personal", address: "" }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "6px 10px", fontSize: 13, cursor: "pointer" }}>
                + Add Email
              </button>
            </div>
          </div>

          <Sec t="Spouse" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <F style={{ flex: "0 0 143px" }}><Lbl t="First" /><input value={spouse.firstName} onChange={setSN("firstName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 143px" }}><Lbl t="Middle" /><input value={spouse.middleName} onChange={setSN("middleName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 143px" }}><Lbl t="Last" /><input value={spouse.lastName} onChange={setSN("lastName")} style={{ ...IS, width: 143 }} autoComplete="new-password" data-lpignore="true" /></F>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Nickname" />
              <input value={spouse.nickname || ""} onChange={setS("nickname")} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={spouse.dob} onChange={v => setSpouse(p => ({ ...p, dob: v }))} compact monthW={68} dayW={60} yearW={62} /></div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Social Security Number" />
              <input value={spouse.ssn} onChange={e => setSpouse(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={{ ...IS, width: 128 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Dependents" />
              <select data-lpignore="true" value={spouse.numDependents || ""} onChange={setS("numDependents")} style={{ ...IS, width: 62 }}>
                <option value="">—</option>
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Gender" />
              <select data-lpignore="true" value={spouse.gender || ""} onChange={setS("gender")} style={{ ...IS, width: 108 }}>
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Cell Phone" />
              <input value={spouse.cell} onChange={e => setSpouse(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={{ ...IS, width: 135 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Home Phone" />
              <input value={spouse.homePhone || ""} onChange={e => setSpouse(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={{ ...IS, width: 135 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Known Client Since" />
              <div style={{ display: "flex", gap: 6 }}>
                <select value={spouse.knownSinceMonth || ""} onChange={setS("knownSinceMonth")} style={{ ...IS, width: 74 }} data-lpignore="true">
                  <option value="">Mo</option>
                  {MONTHS.map((m, i) => <option key={i} value={String(i + 1).padStart(2, "0")}>{m}</option>)}
                </select>
                <input value={spouse.knownSinceYear || ""} onChange={setS("knownSinceYear")} style={{ ...IS, width: 58 }} placeholder="Year" maxLength={4} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Marital Status" />
              <select data-lpignore="true" value={spouse.filingStatus || ""} onChange={setS("filingStatus")} style={{ ...IS, width: 165 }}>
                <option value="">— Select —</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
                <option value="Widower">Widower</option>
                <option value="Domestic Partner">Domestic Partner</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
            <F style={{ flex: "0 0 114px" }}>
              <Lbl t="Copy Client Address" />
              <select data-lpignore="true" value={spouse.copyClientAddr || ""} onChange={e => {
                const v = e.target.value;
                setSpouse(p => v === "yes"
                  ? { ...p, copyClientAddr: v, mailingAddress: client.tcAddress || "", mailingZip: client.tcZip || "", mailingCity: client.tcCity || "", mailingState: client.tcState || "", mailingCountry: client.tcCountry || "USA" }
                  : { ...p, copyClientAddr: v });
              }} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
            <F style={{ flex: "0 0 178px" }}><Lbl t="Physical Address" /><input value={spouse.mailingAddress || ""} onChange={setS("mailingAddress")} style={{ ...IS, width: 178 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 99px" }}><Lbl t="ZIP" /><input value={spouse.mailingZip || ""} onChange={e => { const z = fmtZip(e.target.value); setSpouse(p => ({ ...p, mailingZip: z })); lookupZip(z, (city, state) => setSpouse(p => ({ ...p, mailingCity: city, mailingState: state }))); }} style={{ ...IS, width: 99 }} inputMode="numeric" maxLength={10} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 140px" }}><Lbl t="City" /><input value={spouse.mailingCity || ""} onChange={setS("mailingCity")} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 224px" }}>
              <Lbl t="State" />
              <StateSelect value={spouse.mailingState || ""} onChange={e => setSpouse(p => ({ ...p, mailingState: e.target.value }))} style={{ width: 224 }} />
            </F>
            <F style={{ flex: "0 0 160px" }}><Lbl t="Country" /><CountrySelect value={spouse.mailingCountry || "USA"} onChange={e => setSpouse(p => ({ ...p, mailingCountry: e.target.value }))} style={{ ...IS, width: 160 }} /></F>
            <F style={{ flex: "0 0 114px" }}>
              <Lbl t="PO Box Pref?" />
              <select data-lpignore="true" value={spouse.mailPoPref || ""} onChange={setS("mailPoPref")} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
          </div>
          {spouse.mailPoPref === "yes" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="PO Box #" />
                <input value={spouse.mailPoBox || ""} onChange={setS("mailPoBox")} onBlur={e => setSpouse(p => ({ ...p, mailPoBox: fmtPOBox(e.target.value) }))} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="ZIP" />
                <input value={spouse.mailPoZip || ""} onChange={e => { const z = fmtZip(e.target.value); setSpouse(p => ({ ...p, mailPoZip: z })); lookupZip(z, (city, state) => setSpouse(p => ({ ...p, mailPoCity: city, mailPoState: state }))); }} maxLength={10} style={{ ...IS, width: 97 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="City" />
                <input value={spouse.mailPoCity || ""} onChange={setS("mailPoCity")} style={{ ...IS, width: 144 }} autoComplete="new-password" data-lpignore="true" />
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="State" />
                <StateSelect value={spouse.mailPoState || ""} onChange={setS("mailPoState")} style={{ width: 224 }} />
              </div>
            </>
          </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ flex: "none" }}>
              <Lbl t="Email Addresses" />
              {spouseEmails.map((em, i) => (
                <div key={em.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <select data-lpignore="true" value={em.tag} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, tag: e.target.value } : x))} style={{ ...IS, width: 110, flex: "none" }}>
                    <option value="personal">Personal</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="spouse">Spouse</option>
                  </select>
                  <input value={em.address} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, address: e.target.value } : x))} type="email" placeholder="email@example.com" style={{ ...IS, width: 240, flex: "none" }} autoComplete="new-password" data-lpignore="true" />
                  {em.address && <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(em.address)}`} target="_blank" rel="noreferrer" title="Send email" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "#e8f0fe", border: "1px solid #b3c8f5", borderRadius: 7, color: "#2563eb", textDecoration: "none", fontSize: 16 }}>✉</a>}
                  {spouseEmails.length > 1 && (
                    <button onClick={() => showConfirm("Remove this email?", () => setSpouseEmails(p => p.filter(x => x.id !== em.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flex: "none" }}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setSpouseEmails(p => [...p, { id: Date.now(), tag: "personal", address: "" }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "6px 10px", fontSize: 13, cursor: "pointer" }}>
                + Add Email
              </button>
            </div>
          </div>

          <div id="section-citizenship" style={{ scrollMarginTop: 80, height: 1 }} />
          <Sec t="Driver's License & Citizenship" />
          {(() => {
            const idMeta = {
              "Driver's License":               { title: "Driver's License",            numLbl: "License Number",       locType: "state" },
              "State-Issued ID":                { title: "State-Issued ID",              numLbl: "ID Number",            locType: "state" },
              "Birth Certificate":              { title: "Birth Certificate",            numLbl: "Certificate Number",   locType: "state" },
              "Passport":                       { title: "Passport",                     numLbl: "Passport Number",      locType: "country" },
              "Passport Card":                  { title: "Passport Card",                numLbl: "Passport Card Number", locType: "country" },
              "U.S. Permanent Resident Card (Green Card)": { title: "Green Card",        numLbl: "Card Number",          locType: "country" },
              "Employment Authorization Card (EAD)":       { title: "EAD Card",          numLbl: "Card Number",          locType: "country" },
              "Military ID":                    { title: "Military ID",                  numLbl: "ID Number",            locType: "branch" },
              "Tribal ID":                      { title: "Tribal ID",                   numLbl: "ID Number",            locType: "authority" },
              "Veteran's ID Card":              { title: "Veteran's ID Card",            numLbl: "ID Number",            locType: "authority" },
              "Federal Government Employee ID": { title: "Federal Government Employee ID", numLbl: "ID Number",          locType: "authority" },
              "Social Security Card":           { title: "Social Security Card",         numLbl: "SSN",                  locType: "none" },
              "Other Government-Issued ID":     { title: "Government-Issued ID",         numLbl: "ID Number",            locType: "authority" },
            };
            const marriedNow = ["married","domestic_partner"].includes(hasSpouse);
            const showSpouseBlock = marriedNow && idView === "spouse";
            const renderIdBlock = (view, isFirst) => {
              const idPerson = view === "spouse" ? spouse : client;
              const setIdPerson = view === "spouse" ? setSpouse : setClient;
              const setIdField = view === "spouse" ? setS : setC;
              const dlImage = view === "spouse" ? spouseDlImage : clientDlImage;
              const setDlImage = view === "spouse" ? setSpouseDlImage : setClientDlImage;
              const imageAlt = view === "spouse" ? "Spouse ID" : "Client ID";
              const personName = view === "spouse"
                ? [spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"
                : [client.firstName, client.lastName].filter(Boolean).join(" ") || "Client";
              const meta = idMeta[idPerson.idType] || { title: "Driver's License", numLbl: "License Number", locType: "state" };
              const locLabel = { state: "Issuing State", country: "Issuing Country", branch: "Branch of Service", authority: "Issuing Authority", none: null }[meta.locType];
              return (<div key={view} style={view === "spouse" ? { marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14 } : undefined}>
                {/* Row 1: Person + US Citizen (+ Country if non-US) (+ Add Spouse? on client row) */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t={isFirst ? "Client or Spouse" : "Spouse or Client"} />
                    <select value={view} onChange={e => {
                      const val = e.target.value;
                      setIdPrimary(isFirst ? val : (val === "client" ? "spouse" : "client"));
                    }} style={{ ...IS, width: 200 }} data-lpignore="true">
                      <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                      {marriedNow && <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>}
                    </select>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="US Citizen?" />
                    <select data-lpignore="true" value={idPerson.usCitizen || ""} onChange={setIdField("usCitizen")} style={{ ...IS, width: 88 }}>
                      <option value="">—</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {idPerson.usCitizen === "no" && (
                    <div style={{ flexShrink: 0, flex: "1 1 180px", maxWidth: 260 }}>
                      <Lbl t="Country of Citizenship" />
                      <CountrySelect value={idPerson.countryOfCitizenship || ""} onChange={setIdField("countryOfCitizenship")} />
                    </div>
                  )}
                  {isFirst && marriedNow && (
                    <div style={{ flexShrink: 0 }}>
                      <Lbl t="Add Spouse?" />
                      <select value={idView === "spouse" ? "yes" : "no"} onChange={e => setIdView(e.target.value === "yes" ? "spouse" : "client")} style={{ ...IS, width: 88 }} data-lpignore="true">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  )}
                </div>
                {/* Row 2: Type of ID + License Number + Issuing State + Issuer Name */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Type of ID" />
                    <select data-lpignore="true" value={idPerson.idType || ""} onChange={setIdField("idType")} style={{ ...IS, width: 188 }}>
                      <option value="">— Select —</option>
                      <option>Driver's License</option>
                      <option>Passport</option>
                      <option>Passport Card</option>
                      <option>State-Issued ID</option>
                      <option>Military ID</option>
                      <option>U.S. Permanent Resident Card (Green Card)</option>
                      <option>Employment Authorization Card (EAD)</option>
                      <option>Tribal ID</option>
                      <option>Veteran's ID Card</option>
                      <option>Federal Government Employee ID</option>
                      <option>Social Security Card</option>
                      <option>Birth Certificate</option>
                      <option>Other Government-Issued ID</option>
                    </select>
                  </div>
                  <F style={{ flex: "0 0 130px" }}><Lbl t={meta.numLbl} /><input value={idPerson.dlNumber || ""} onChange={setIdField("dlNumber")} style={{ ...IS, width: 130 }} autoComplete="new-password" data-lpignore="true" /></F>
                  {meta.locType === "state"
                    ? <F style={{ flex: "0 0 224px" }}><Lbl t="Issuing State" /><StateSelect value={idPerson.dlState || ""} onChange={setIdField("dlState")} style={{ ...IS, width: 224 }} /></F>
                    : meta.locType !== "none"
                      ? <F style={{ flex: "0 0 196px" }}><Lbl t={locLabel} /><input value={idPerson.dlState || ""} onChange={setIdField("dlState")} style={{ ...IS, width: 196 }} autoComplete="new-password" data-lpignore="true" /></F>
                      : null}
                  <F style={{ flex: "0 0 150px" }}><Lbl t="Issuer Name" /><input value={idPerson.dlIssuerName || ""} onChange={setIdField("dlIssuerName")} style={{ ...IS, width: 150 }} autoComplete="new-password" data-lpignore="true" /></F>
                  <div style={{ flexShrink: 0 }}><DatePicker label="Issue Date" value={idPerson.dlIssueDate || ""} onChange={v => setIdPerson(p => ({ ...p, dlIssueDate: v }))} compact monthW={72} dayW={66} yearW={62} /></div>
                  <div style={{ flexShrink: 0, marginLeft: 20 }}><DatePicker label="Expiration Date" futureYears={10} value={idPerson.dlExpDate || ""} onChange={v => setIdPerson(p => ({ ...p, dlExpDate: v }))} compact monthW={72} dayW={66} yearW={62} /></div>
                </div>
                <div style={{ marginTop: 10, marginBottom: 4 }}>
                  <Lbl t={meta.title + " Image"} />
                  {dlImage ? (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
                      <img src={dlImage} alt={imageAlt} title="Click to view full size" onClick={() => openDataFile(dlImage, imageAlt)} style={{ maxWidth: 280, maxHeight: 180, borderRadius: 8, border: "1px solid " + BORDER, objectFit: "contain", background: "#f8f9fb", cursor: "zoom-in" }} />
                      <button onClick={() => setDlImage(null)} style={{ background: "none", border: "1px solid " + BORDER, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: DANGER, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>✕ Remove</button>
                    </div>
                  ) : (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 4, background: INPUT_BG, border: "1px dashed #aab0bb", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: MUTED, fontWeight: 500 }}>
                      📎 Upload {meta.title} Image
                      <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleDlImageUpload(setDlImage)} />
                    </label>
                  )}
                </div>
              </div>);
            };
            return (<>
              {renderIdBlock(idPrimary, true)}
              {showSpouseBlock && renderIdBlock(idPrimary === "client" ? "spouse" : "client", false)}
            </>);
          })()}

          <FileUpload section="client_profile" files={uploads.client_profile || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        <Panel title="Family" id="section-family">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <F style={{ flex: "none" }}>
              <Lbl t="Marital Status" />
              <select data-lpignore="true" value={hasSpouse || ""} onChange={e => setHasSpouse(e.target.value || null)} style={{ ...IS, width: 162 }}>
                <option value="">— Select —</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="domestic_partner">Domestic Partner</option>
              </select>
            </F>
            <F style={{ flex: "none" }}>
              <Lbl t="Children?" />
              <select data-lpignore="true" value={hasChildren || ""} onChange={e => {
                setHasChildren(e.target.value || null);
                if (e.target.value === "yes" && children.length === 0) setChildren([{ ...emptyChild, id: Date.now() }]);
                if (e.target.value === "no") setChildren([]);
              }} style={{ ...IS, width: 110 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
          </div>

          {["married","domestic_partner"].includes(hasSpouse) && (
            <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Client Details</div>
              <Row cols={3}>
                <F><Lbl t="First" /><input value={client.firstName} onChange={setC("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle" /><input value={client.middleName || ""} onChange={setC("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last" /><input value={client.lastName} onChange={setC("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={client.dob} onChange={v => setClient(p => ({ ...p, dob: v }))} compact /></div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="SSN" />
                  <input value={client.ssn} onChange={e => setClient(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={{ ...IS, width: 128 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Gender" />
                  <select data-lpignore="true" value={client.gender || ""} onChange={setC("gender")} style={{ ...IS, width: 106 }}>
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <F style={{ flex: "none" }}>
                  <Lbl t="Email Address" />
                  <input value={(clientEmails[0] && clientEmails[0].address) || ""} onChange={e => setClientEmails(p => p.length ? p.map((x, i) => i === 0 ? { ...x, address: e.target.value } : x) : [{ id: Date.now(), tag: "personal", address: e.target.value }])} type="email" style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" />
                </F>
                <F style={{ flex: "none" }}><Lbl t="Cell Phone" /><input value={client.cell} onChange={e => setClient(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </div>

              <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Spouse Details</div>
                </div>
                <Row cols={3}>
                  <F><Lbl t="First" /><input value={spouse.firstName} onChange={setSN("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  <F><Lbl t="Middle" /><input value={spouse.middleName} onChange={setSN("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  <F><Lbl t="Last" /><input value={spouse.lastName} onChange={setSN("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                </Row>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                  <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={spouse.dob} onChange={v => setSpouse(p => ({ ...p, dob: v }))} compact /></div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="SSN" />
                    <input value={spouse.ssn} onChange={e => setSpouse(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={{ ...IS, width: 128 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Gender" />
                    <select data-lpignore="true" value={spouse.gender || ""} onChange={setS("gender")} style={{ ...IS, width: 106 }}>
                      <option value="">— Select —</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <Lbl t="Email Addresses" />
                {spouseEmails.map((em) => (
                  <div key={em.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <select data-lpignore="true" value={em.tag} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, tag: e.target.value } : x))} style={{ ...IS, width: 130, flex: "none" }}>
                      <option value="personal">Personal</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="spouse">Spouse</option>
                    </select>
                    <input value={em.address} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, address: e.target.value } : x))} type="email" placeholder="email@example.com" style={{ ...IS, width: 220, flex: "none" }} autoComplete="new-password" data-lpignore="true" />
                    {em.address && <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(em.address)}`} target="_blank" rel="noreferrer" title="Send email" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "#e8f0fe", border: "1px solid #b3c8f5", borderRadius: 7, color: "#2563eb", textDecoration: "none", fontSize: 16 }}>✉</a>}
                    {spouseEmails.length > 1 && (
                      <button onClick={() => showConfirm("Remove this email?", () => setSpouseEmails(p => p.filter(x => x.id !== em.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flex: "none" }}>✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setSpouseEmails(p => [...p, { id: Date.now(), tag: "personal", address: "" }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer" }}>
                  + Add Email
                </button>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  <F style={{ flex: "none" }}><Lbl t="Cell Phone" /><input value={spouse.cell} onChange={e => setSpouse(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                  <F style={{ flex: "none" }}><Lbl t="Home Phone" /><input value={spouse.homePhone || ""} onChange={e => setSpouse(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                </div>
              </div>

            </div>
          )}

          {hasChildren === "yes" && (
            <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 16 }}>
              {children.map((ch, i) => (
                <div key={ch.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Child {i + 1}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setChildren(p => p.map(x => x.id === ch.id ? { ...x, lastName: client.lastName, addressLine1: client.addressLine1, addressLine2: client.addressLine2, city: client.city, state: client.state, zip: client.zip } : x))} style={{ background: INPUT_BG, border: "1px solid " + BORDER, color: INK, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12 }}>Copy Client Info</button>
                      {children.length > 1 && (
                        <button onClick={() => showConfirm("Remove this child?", () => setChildren(p => p.filter(x => x.id !== ch.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
                      )}
                    </div>
                  </div>
                  <Row cols={3}>
                    <F><Lbl t="First" /><input value={ch.firstName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, firstName: capName(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Middle" /><input value={ch.middleName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, middleName: capName(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Last" /><input value={ch.lastName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, lastName: capName(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                    <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={ch.dob} onChange={v => setChildren(p => p.map(x => x.id === ch.id ? { ...x, dob: v } : x))} compact /></div>
                    <div style={{ flexShrink: 0 }}>
                      <Lbl t="Gender" />
                      <select data-lpignore="true" value={ch.gender || ""} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, gender: e.target.value } : x))} style={{ ...IS, width: 106 }}>
                        <option value="">— Select —</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <Lbl t="Beneficiary?" />
                      <select data-lpignore="true" value={ch.isBeneficiary ? "yes" : "no"} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, isBeneficiary: e.target.value === "yes" } : x))} style={{ ...IS, width: 88 }}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                  {ch.isBeneficiary && (
                    <div style={{ marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 12 }}>Beneficiary Information</div>
                      <Row cols={4}>
                        <F><Lbl t="SSN" /><input value={ch.ssn} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, ssn: fmtSSN(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="XXX-XX-XXXX" /></F>
                        <F>
                          <Lbl t="Relationship" />
                          <select data-lpignore="true" value={ch.relationship} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, relationship: e.target.value } : x))} style={IS}>
                            <option value="Child">Child</option>
                            <option value="Stepchild">Stepchild</option>
                            <option value="Adopted Child">Adopted Child</option>
                            <option value="Grandchild">Grandchild</option>
                            <option value="Other">Other</option>
                          </select>
                        </F>
                        <F>
                          <Lbl t="Designation" />
                          <select data-lpignore="true" value={ch.designationType || "primary"} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, designationType: e.target.value } : x))} style={IS}>
                            <option value="primary">Primary</option>
                            <option value="contingent">Contingent</option>
                          </select>
                        </F>
                        <F>
                          <Lbl t={`% to Inherit (${getDesignType(ch) === "primary" ? "Primary" : "Contingent"})`} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              value={(ch.percentage || "").replace("%", "")}
                              onChange={e => { const raw = e.target.value.replace(/[^0-9.]/g, ""); setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: raw } : x)); }}
                              onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: Math.min(100, Math.max(0, n)) + "%" } : x)); else if (!e.target.value) setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: "" } : x)); }}
                              style={{ ...IS, width: "100%" }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" placeholder="0"
                            />
                            <span style={{ color: INK, fontSize: 15, whiteSpace: "nowrap" }}>%</span>
                          </div>
                        </F>
                      </Row>
                      <Row cols={2}>
                        <F><Lbl t="Email" /><div style={{ display: "flex", gap: 6, alignItems: "center" }}><input value={ch.email} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, email: e.target.value } : x))} type="email" style={{ ...IS, flex: 1 }} autoComplete="new-password" data-lpignore="true" />{ch.email && <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(ch.email)}`} target="_blank" rel="noreferrer" title="Send email" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "#e8f0fe", border: "1px solid #b3c8f5", borderRadius: 7, color: "#2563eb", textDecoration: "none", fontSize: 16, flexShrink: 0 }}>✉</a>}</div></F>
                        <F><Lbl t="Phone" /><input value={ch.phone} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, phone: fmtPhone(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="(555) 555-5555" /></F>
                      </Row>
                      <Row cols={3}>
                        <F>
                          <Lbl t="US Citizen?" />
                          <select data-lpignore="true" value={ch.usCitizen || ""} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, usCitizen: e.target.value } : x))} style={IS}>
                            <option value="">— Select —</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </F>
                        {ch.usCitizen === "no" && (
                          <F><Lbl t="Country of Citizenship" /><CountrySelect value={ch.countryOfCitizenship || ""} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, countryOfCitizenship: e.target.value } : x))} /></F>
                        )}
                      </Row>
                      <Row cols={2}>
                        <F><Lbl t="Street Address" /><input value={ch.addressLine1} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, addressLine1: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                        <F><Lbl t="Apt / Suite" /><input value={ch.addressLine2} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, addressLine2: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                      </Row>
                      <Row cols={3}>
                        <F>
                          <Lbl t="ZIP" />
                          <input value={ch.zip} onChange={e => { const z = fmtZip(e.target.value); setChildren(p => p.map(x => x.id === ch.id ? { ...x, zip: z } : x)); lookupZip(z, (city, state) => { if (city) setChildren(p => p.map(x => x.id === ch.id ? { ...x, city, state } : x)); }); }} maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true" />
                        </F>
                        <F><Lbl t="City" /><input value={ch.city} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, city: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                        <F><Lbl t="State" /><StateSelect value={ch.state} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, state: e.target.value } : x))} /></F>
                      </Row>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setChildren(p => [...p, { ...emptyChild, id: Date.now() }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
                + Add Child or New Beneficiary
              </button>
            </div>
          )}
          <FileUpload section="family" files={uploads.family || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── BENEFICIARIES ── */}
        <Panel title="Beneficiaries" id="section-bene">
          {children.filter(ch => ch.isBeneficiary && getDesignType(ch) === "primary").map((ch, i) => (
            <div key={ch.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Child Beneficiary — {ch.firstName} {ch.lastName}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 5, padding: "3px 8px", border: "1px solid " + BORDER, background: "#fff", color: INK }}>
                    {getDesignType(ch) === "primary" ? "Primary" : "Contingent"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: INK, fontStyle: "italic" }}>Edit in Family section</div>
              </div>
              <div className="rg" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", fontSize: 13, color: INK }}>
                {ch.firstName && <div><span style={{ color: INK }}>Name: </span>{ch.firstName} {ch.middleName} {ch.lastName}</div>}
                {ch.dob && <div><span style={{ color: INK }}>DOB: </span>{ch.dob}</div>}
                {ch.gender && <div><span style={{ color: INK }}>Gender: </span>{ch.gender}</div>}
                {ch.ssn && <div><span style={{ color: INK }}>SSN: </span>{ch.ssn}</div>}
                {ch.relationship && <div><span style={{ color: INK }}>Relationship: </span>{ch.relationship}</div>}
                {ch.percentage && <div><span style={{ color: INK }}>% to Inherit: </span>{ch.percentage}</div>}
                {ch.email && <div><span style={{ color: INK }}>Email: </span><MailLink email={ch.email} /></div>}
                {ch.phone && <div><span style={{ color: INK }}>Phone: </span>{ch.phone}</div>}
                {ch.addressLine1 && <div style={{ gridColumn: "span 2" }}><span style={{ color: INK }}>Address: </span>{ch.addressLine1}{ch.addressLine2 ? ", " + ch.addressLine2 : ""}{ch.city ? ", " + ch.city : ""}{ch.state ? ", " + ch.state : ""}{ch.zip ? " " + ch.zip : ""}</div>}
              </div>
            </div>
          ))}
          {[...beneficiaries].sort((a, z) => (getDesignType(a) === "primary" ? 0 : 1) - (getDesignType(z) === "primary" ? 0 : 1)).map((b, i) => {
            const childBeneCount = children.filter(c => c.isBeneficiary && getDesignType(c) === "primary").length;
            const beneNum = childBeneCount + i + 1;
            return (
            <div key={b.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Beneficiary {beneNum}</div>
                  <select data-lpignore="true" value={b.designationType || "primary"} onChange={e => updBene(b.id, "designationType", e.target.value)}
                    style={{ fontSize: 11, fontWeight: 700, border: "1px solid " + BORDER, borderRadius: 5, padding: "3px 8px", cursor: "pointer", background: "#fff", color: INK }}>
                    <option value="primary">Primary</option>
                    <option value="contingent">Contingent</option>
                  </select>
                  <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Add Client or Spouse as Beneficiary?</span>
                  <select data-lpignore="true" value={b.addClientSpouse || "no"} onChange={e => updBene(b.id, "addClientSpouse", e.target.value)}
                    style={{ fontSize: 11, fontWeight: 700, border: "1px solid " + BORDER, borderRadius: 5, padding: "3px 8px", cursor: "pointer", background: "#fff", color: INK }}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  {b.addClientSpouse === "yes" && (
                    <select data-lpignore="true" value="" onChange={e => {
                      const who = e.target.value;
                      if (!who) return;
                      const src = who === "spouse" ? spouse : client;
                      const email = who === "spouse"
                        ? ((spouseEmails[0] && spouseEmails[0].address) || "")
                        : ((clientEmails[0] && clientEmails[0].address) || "");
                      setBeneficiaries(p => p.map(x => x.id === b.id ? {
                        ...x,
                        firstName: src.firstName || "", middleName: src.middleName || "", lastName: src.lastName || "",
                        dob: src.dob || "", ssn: src.ssn || "", gender: src.gender || "",
                        email,
                        relationship: who === "spouse" ? "Spouse" : x.relationship,
                        addressSource: "manual",
                        addressLine1: client.addressLine1 || "", city: client.city || "", state: client.state || "", zip: client.zip || "",
                      } : x));
                    }}
                      style={{ fontSize: 11, fontWeight: 700, border: "1px solid #c7d2fe", borderRadius: 5, padding: "3px 8px", cursor: "pointer", background: "#e0e7ff", color: "#3730a3" }}>
                      <option value="">— Fill From —</option>
                      <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                      {["married","domestic_partner"].includes(hasSpouse) && (
                        <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                      )}
                    </select>
                  )}
                </div>
                <button onClick={() => showConfirm("Remove this beneficiary?", () => delBene(b.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
              </div>
              <Row cols={3}>
                <F><Lbl t="First" /><input value={b.firstName} onChange={e => updBene(b.id, "firstName", capName(e.target.value))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle" /><input value={b.middleName} onChange={e => updBene(b.id, "middleName", capName(e.target.value))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last" /><input value={b.lastName} onChange={e => updBene(b.id, "lastName", capName(e.target.value))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, alignItems: "flex-end" }}>
                <div style={{ flexShrink: 0 }}><DatePicker label="Date of Birth" value={b.dob} onChange={v => updBene(b.id, "dob", v)} compact /></div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Gender" />
                  <select data-lpignore="true" value={b.gender || ""} onChange={e => updBene(b.id, "gender", e.target.value)} style={{ ...IS, width: 124 }}>
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="SSN" />
                  <input value={b.ssn} onChange={e => updBene(b.id, "ssn", fmtSSN(e.target.value))} style={{ ...IS, width: 132 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="___-__-____" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Relationship" />
                  <select data-lpignore="true" value={b.relationship} onChange={e => updBene(b.id, "relationship", e.target.value)} style={{ ...IS, width: 172 }}>
                    <option value="">— Select —</option>
                    {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Email Address" />
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input value={b.email} onChange={e => updBene(b.id, "email", e.target.value)} type="email" style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" />
                    {b.email && <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(b.email)}`} target="_blank" rel="noreferrer" title="Send email" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "#e8f0fe", border: "1px solid #b3c8f5", borderRadius: 7, color: "#2563eb", textDecoration: "none", fontSize: 16, flexShrink: 0 }}>✉</a>}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t={`% to Inherit (${getDesignType(b) === "primary" ? "Primary" : "Contingent"})`} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      value={(b.percentage || "").replace("%", "")}
                      onChange={e => { const raw = e.target.value.replace(/[^0-9.]/g, ""); updBene(b.id, "percentage", raw); }}
                      onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) updBene(b.id, "percentage", Math.min(100, Math.max(0, n)) + "%"); else if (!e.target.value) updBene(b.id, "percentage", ""); }}
                      style={{ ...IS, width: 90 }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" placeholder="0"
                    />
                    <span style={{ color: INK, fontSize: 15, whiteSpace: "nowrap" }}>%</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>Address</span>
                <select data-lpignore="true" value={b.addressSource || "manual"} onChange={e => {
                const src = e.target.value;
                if (src === "client") {
                  updBene(b.id, "addressSource", "client");
                  updBene(b.id, "addressLine1", client.addressLine1);
                  updBene(b.id, "city", client.city);
                  updBene(b.id, "state", client.state);
                  updBene(b.id, "zip", client.zip);
                } else if (src === "spouse") {
                  updBene(b.id, "addressSource", "spouse");
                  updBene(b.id, "addressLine1", client.addressLine1);
                  updBene(b.id, "city", client.city);
                  updBene(b.id, "state", client.state);
                  updBene(b.id, "zip", client.zip); // spouse shares home address
                } else {
                  updBene(b.id, "addressSource", "manual");
                }
              }} style={{ fontSize: 11, fontWeight: 700, border: "1px solid " + BORDER, borderRadius: 5, padding: "3px 8px", cursor: "pointer", background: "#fff", color: INK }}>
                <option value="manual">Enter Manually</option>
                <option value="client">Same as {client.firstName || "Client"}</option>
                {["married","domestic_partner"].includes(hasSpouse) && <option value="spouse">Same as {spouse.firstName || "Spouse"}</option>}
                </select>
              </div>
              {(() => {
                const src = b.addressSource || "manual";
                const addrLine = src !== "manual" ? client.addressLine1 : b.addressLine1;
                const addrCity = src !== "manual" ? client.city : b.city;
                const addrState = src !== "manual" ? client.state : b.state;
                const addrZip = src !== "manual" ? client.zip : b.zip;
                const readOnly = b.addressSource !== "manual";
                const roStyle = { ...IS, background: NAV, color: INK };
                return readOnly ? (
                  <div style={{ marginTop: 6, background: NAV, border: "1px solid " + BORDER, borderRadius: 8, padding: "9px 13px", color: INK, fontSize: 14 }}>
                    {addrLine}{addrLine && (addrCity || addrState || addrZip) ? ", " : ""}{addrCity}{addrState ? ", " + addrState : ""}{addrZip ? " " + addrZip : ""}
                    {!addrLine && !addrCity && <span style={{ fontStyle: "italic", opacity: 0.6 }}>No address on file yet</span>}
                  </div>
                ) : (
                  <>
                    <input value={b.addressLine1} onChange={e => updBene(b.id, "addressLine1", e.target.value)} style={{ ...IS, marginTop: 6 }} autoComplete="new-password" data-lpignore="true" />
                    <Row cols={3}>
                      <F>
                        <Lbl t="ZIP" />
                        <input
                          value={b.zip}
                          onChange={e => {
                            const z = fmtZip(e.target.value);
                            updBene(b.id, "zip", z);
                            lookupZip(z, (city, state) => { updBene(b.id, "city", city); updBene(b.id, "state", state); });
                          }}
                          maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true"
                        />
                      </F>
                      <F><Lbl t="City" /><input value={b.city} onChange={e => updBene(b.id, "city", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                      <F><Lbl t="State" /><StateSelect value={b.state} onChange={e => updBene(b.id, "state", e.target.value)} /></F>
                    </Row>
                  </>
                );
              })()}
            </div>
            );
          })}
          {children.filter(ch => ch.isBeneficiary && getDesignType(ch) === "contingent").map((ch) => (
            <div key={ch.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Child Beneficiary — {ch.firstName} {ch.lastName}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 5, padding: "3px 8px", border: "1px solid " + BORDER, background: "#fff", color: INK }}>Contingent</span>
                </div>
                <div style={{ fontSize: 11, color: INK, fontStyle: "italic" }}>Edit in Family section</div>
              </div>
              <div className="rg" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", fontSize: 13, color: INK }}>
                {ch.firstName && <div><span style={{ color: INK }}>Name: </span>{ch.firstName} {ch.middleName} {ch.lastName}</div>}
                {ch.dob && <div><span style={{ color: INK }}>DOB: </span>{ch.dob}</div>}
                {ch.gender && <div><span style={{ color: INK }}>Gender: </span>{ch.gender}</div>}
                {ch.ssn && <div><span style={{ color: INK }}>SSN: </span>{ch.ssn}</div>}
                {ch.relationship && <div><span style={{ color: INK }}>Relationship: </span>{ch.relationship}</div>}
                {ch.percentage && <div><span style={{ color: INK }}>% to Inherit: </span>{ch.percentage}</div>}
                {ch.email && <div><span style={{ color: INK }}>Email: </span><MailLink email={ch.email} /></div>}
                {ch.phone && <div><span style={{ color: INK }}>Phone: </span>{ch.phone}</div>}
                {ch.addressLine1 && <div style={{ gridColumn: "span 2" }}><span style={{ color: INK }}>Address: </span>{ch.addressLine1}{ch.addressLine2 ? ", " + ch.addressLine2 : ""}{ch.city ? ", " + ch.city : ""}{ch.state ? ", " + ch.state : ""}{ch.zip ? " " + ch.zip : ""}</div>}
              </div>
            </div>
          ))}
          {(() => {
            const allBenes = [
              ...children.filter(c => c.isBeneficiary).map(c => ({ ...c, _src: "child" })),
              ...beneficiaries.map(b => ({ ...b, _src: "bene" })),
            ];
            const pct = b => { const n = parseFloat((b.percentage || "").replace("%", "") || 0); return isNaN(n) ? 0 : n; };
            const primaries   = allBenes.filter(b => getDesignType(b) === "primary");
            const contingents = allBenes.filter(b => getDesignType(b) === "contingent");
            const primTotal = primaries.reduce((s, b) => s + pct(b), 0);
            const contTotal = contingents.reduce((s, b) => s + pct(b), 0);
            if (!primTotal && !contTotal) return null;
            const Pill = ({ label, total }) => {
              const over = total > 100;
              return (
                <div style={{ flex: 1, background: NAV, border: "1px solid " + (over ? DANGER : BORDER), borderRadius: 8, padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{label} Total</span>
                  <span style={{ fontSize: 17, fontWeight: "bold", color: over ? DANGER : (total === 100 ? SUCCESS : INK) }}>{total}%{over ? " ⚠" : total === 100 ? " ✓" : ""}</span>
                </div>
              );
            };
            return (
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {primTotal > 0   && <Pill label="Primary"   total={primTotal} />}
                {contTotal > 0   && <Pill label="Contingent" total={contTotal} />}
              </div>
            );
          })()}
          <button onClick={addBene} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Beneficiary
          </button>
          <FileUpload section="beneficiaries" files={uploads.beneficiaries || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── EMPLOYMENT ── */}
        <Panel title="Employment" id="section-employment">
          {(!["married","domestic_partner"].includes(hasSpouse) || empView === "client") && <><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Employee" />
              <select value={empView} onChange={e => setEmpView(e.target.value)} style={{ ...IS, width: Math.max(150, Math.max([client.firstName, client.lastName].filter(Boolean).join(" ").length, [spouse.firstName, spouse.lastName].filter(Boolean).join(" ").length) * 10 + 56) }}>
                <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                {["married","domestic_partner"].includes(hasSpouse) && (
                  <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                )}
              </select>
            </div>
            <F style={{ flex: "0 0 240px" }}><Lbl t="Employer Name" /><input value={clientEmp.employer} onChange={setCE("employer")} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 200px" }}><Lbl t="Occupation" /><input value={clientEmp.occupation} onChange={setCE("occupation")} style={{ ...IS, width: 200 }} autoComplete="new-password" data-lpignore="true" /></F>
            <div style={{ flexShrink: 0 }}><DatePicker label="Start Date" value={clientEmp.startDate} onChange={v => setClientEmp(p => ({ ...p, startDate: v }))} compact /></div>
            <F style={{ flex: "0 0 145px" }}><Lbl t="Work Phone" /><input value={clientEmp.workPhone} onChange={e => setClientEmp(p => ({ ...p, workPhone: fmtPhone(e.target.value) }))} style={{ ...IS, width: 145 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 8 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Work Address" />
              <input value={clientEmp.workAddress} onChange={setCE("workAddress")} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="ZIP" />
              <input value={clientEmp.workZip} onChange={e => { const z = fmtZip(e.target.value); setClientEmp(p => ({ ...p, workZip: z })); lookupZip(z, (city, state) => setClientEmp(p => ({ ...p, workCity: city, workState: state }))); }} maxLength={10} style={{ ...IS, width: 90 }} autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="City" />
              <input value={clientEmp.workCity} onChange={setCE("workCity")} style={{ ...IS, width: 160 }} autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="State" />
              <StateSelect value={clientEmp.workState} onChange={setCE("workState")} style={{ width: 224 }} />
            </div>
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Employer Retirement Plan</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="Has Retirement Plan?" />
                <select data-lpignore="true" value={clientEmp.hasRetirement || ""} onChange={e => setClientEmp(p => ({ ...p, hasRetirement: e.target.value || null }))} style={{ ...IS, width: 76 }}>
                  <option value="">— Select —</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {clientEmp.hasRetirement === "yes" && (
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Type of Plan" />
                  <select data-lpignore="true" value={clientEmp.retirementType || ""} onChange={e => setClientEmp(p => ({ ...p, retirementType: e.target.value || null }))} style={{ ...IS, width: 245 }}>
                    <option value="">— Select —</option>
                    <option>401(k)</option><option>Roth 401(k)</option><option>403(b)</option><option>Roth 403(b)</option>
                    <option>457(b)</option><option>457(f)</option><option>TMRS</option><option>TRS</option>
                    <option>ORP</option><option>ESOP</option><option>SIMPLE IRA</option><option>SEP IRA</option>
                    <option>Pension / Defined Benefit</option><option>Stock Option / ESPP</option><option>Other</option>
                  </select>
                </div>
              )}
            </div>
            {clientEmp.hasRetirement === "yes" && (
              <>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 12 }}>
                  <div style={{ flexShrink: 0 }}><Lbl t="Monthly Employee Contribution" /><input value={clientEmp.contributionAmt} onChange={e => setClientEmp(p => ({ ...p, contributionAmt: fmtDollar(e.target.value) }))} style={{ ...IS, width: 240 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Employer Match %" />
                    <select data-lpignore="true" value={clientEmp.matchPct || ""} onChange={e => setClientEmp(p => ({ ...p, matchPct: e.target.value }))} style={{ ...IS, width: 170 }}>
                      <option value="">— Select —</option>
                      <option value="No Match">No Match</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                    </select>
                  </div>
                </div>
                {(() => {
                  const matchNum = parseInt((clientEmp.matchPct || "").replace(/[^0-9]/g, "") || 0);
                  const compAmt = parseInt((clientEmp.compensation || "").replace(/[^0-9]/g, "") || 0);
                  const mult = { weekly: 52, biweekly: 26, bimonthly: 24, monthly: 12 }[clientEmp.payFrequency] || 0;
                  const annualIncome = compAmt && mult ? compAmt * mult : 0;
                  const empMonthly = parseInt((clientEmp.contributionAmt || "").replace(/[^0-9]/g, "") || 0);
                  const maxMatchAnnual = annualIncome && matchNum ? Math.round(annualIncome * matchNum / 100) : 0;
                  const maxMatchMonthly = maxMatchAnnual ? Math.round(maxMatchAnnual / 12) : 0;
                  const totalMonthly = empMonthly + maxMatchMonthly;
                  if (!matchNum) return null;
                  const Tile = ({ label, val, accent }) => (
                    <div style={{ flex: 1, minWidth: 150, background: accent ? "#e8f0fb" : "#f4f6f9", border: "1px solid " + (accent ? "#b3c9ef" : BORDER), borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "#1a4a8a" : INK }}>{val || "—"}</div>
                    </div>
                  );
                  return (
                    <div style={{ marginBottom: 12 }}>
                      {annualIncome > 0 && <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Max employer match: <strong style={{ color: INK }}>${maxMatchAnnual.toLocaleString()}/yr</strong> &nbsp;({matchNum}% × ${annualIncome.toLocaleString()} annual income)</div>}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Tile label="Employee Contribution / mo" val={empMonthly ? "$" + empMonthly.toLocaleString() : null} />
                        <Tile label="Employer Match / mo" val={maxMatchMonthly ? "$" + maxMatchMonthly.toLocaleString() : null} />
                        <Tile label={"Total " + (clientEmp.retirementType || "Retirement Plan") + " / mo"} val={totalMonthly ? "$" + totalMonthly.toLocaleString() : null} accent />
                      </div>
                    </div>
                  );
                })()}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
                  <div style={{ flex: "0 0 160px" }}><Lbl t="Current Balance" /><input value={clientEmp.retirementBalance} onChange={e => setClientEmp(p => ({ ...p, retirementBalance: fmtDollar(e.target.value) }))} style={{ ...IS, width: 160 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Custodian / Plan Sponsor" />
                    <select data-lpignore="true" value={clientEmp.retirementCustodian || ""} onChange={e => setClientEmp(p => ({ ...p, retirementCustodian: e.target.value, retirementCustodianOther: "" }))} style={{ ...IS, width: 180 }}>
                      <option value="">— Select —</option>
                      <option>Fidelity</option><option>Empower</option><option>Vanguard</option><option>Schwab</option>
                      <option>T. Rowe Price</option><option>Principal</option><option>Prudential</option><option>Transamerica</option>
                      <option>Lincoln Financial</option><option>John Hancock</option><option>Nationwide</option><option>MassMutual</option>
                      <option>Ameritas</option><option>TIAA</option><option>PEBA / State Plan</option><option>Other</option>
                    </select>
                    {clientEmp.retirementCustodian === "Other" && (
                      <input value={clientEmp.retirementCustodianOther || ""} onChange={e => setClientEmp(p => ({ ...p, retirementCustodianOther: e.target.value }))} style={{ ...IS, marginTop: 6 }} placeholder="Specify custodian" autoComplete="new-password" data-lpignore="true" />
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t={<span>In Service<br/>Transfer Available</span>} />
                    <select value={clientEmp.inServiceTransfer || ""} onChange={e => setClientEmp(p => ({ ...p, inServiceTransfer: e.target.value }))} style={{ ...IS, width: 114 }} data-lpignore="true">
                      <option value="">— Select —</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
          </>}

          {["married","domestic_partner"].includes(hasSpouse) && empView === "spouse" && (
            <>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Employee" />
                  <select value={empView} onChange={e => setEmpView(e.target.value)} style={{ ...IS, width: Math.max(150, Math.max([client.firstName, client.lastName].filter(Boolean).join(" ").length, [spouse.firstName, spouse.lastName].filter(Boolean).join(" ").length) * 10 + 56) }}>
                    <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                  </select>
                </div>
                <F style={{ flex: "0 0 240px" }}><Lbl t="Employer Name" /><input value={spouseEmp.employer} onChange={setSE("employer")} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" /></F>
                <F style={{ flex: "0 0 200px" }}><Lbl t="Occupation" /><input value={spouseEmp.occupation} onChange={setSE("occupation")} style={{ ...IS, width: 200 }} autoComplete="new-password" data-lpignore="true" /></F>
                <div style={{ flexShrink: 0 }}><DatePicker label="Start Date" value={spouseEmp.startDate} onChange={v => setSpouseEmp(p => ({ ...p, startDate: v }))} compact /></div>
                <F style={{ flex: "0 0 145px" }}><Lbl t="Work Phone" /><input value={spouseEmp.workPhone} onChange={e => setSpouseEmp(p => ({ ...p, workPhone: fmtPhone(e.target.value) }))} style={{ ...IS, width: 145 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Work Address" />
                  <input value={spouseEmp.workAddress} onChange={setSE("workAddress")} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="ZIP" />
                  <input value={spouseEmp.workZip} onChange={e => { const z = fmtZip(e.target.value); setSpouseEmp(p => ({ ...p, workZip: z })); lookupZip(z, (city, state) => setSpouseEmp(p => ({ ...p, workCity: city, workState: state }))); }} maxLength={10} style={{ ...IS, width: 90 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="City" />
                  <input value={spouseEmp.workCity} onChange={setSE("workCity")} style={{ ...IS, width: 160 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="State" />
                  <StateSelect value={spouseEmp.workState} onChange={setSE("workState")} style={{ width: 224 }} />
                </div>
              </div>
              <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Employer Retirement Plan</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 12 }}>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Has Retirement Plan?" />
                    <select data-lpignore="true" value={spouseEmp.hasRetirement || ""} onChange={e => setSpouseEmp(p => ({ ...p, hasRetirement: e.target.value || null }))} style={{ ...IS, width: 76 }}>
                      <option value="">— Select —</option>
                      <option value="yes">Yes</option><option value="no">No</option>
                    </select>
                  </div>
                  {spouseEmp.hasRetirement === "yes" && (
                    <div style={{ flexShrink: 0 }}>
                      <Lbl t="Type of Plan" />
                      <select data-lpignore="true" value={spouseEmp.retirementType || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementType: e.target.value || null }))} style={{ ...IS, width: 245 }}>
                        <option value="">— Select —</option>
                        <option>401(k)</option><option>Roth 401(k)</option><option>403(b)</option><option>Roth 403(b)</option>
                        <option>457(b)</option><option>457(f)</option><option>TMRS</option><option>TRS</option>
                        <option>ORP</option><option>ESOP</option><option>SIMPLE IRA</option><option>SEP IRA</option>
                        <option>Pension / Defined Benefit</option><option>Stock Option / ESPP</option><option>Other</option>
                      </select>
                    </div>
                  )}
                </div>
                {spouseEmp.hasRetirement === "yes" && (
                  <>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 12 }}>
                      <div style={{ flexShrink: 0 }}><Lbl t="Monthly Employee Contribution" /><input value={spouseEmp.contributionAmt} onChange={e => setSpouseEmp(p => ({ ...p, contributionAmt: fmtDollar(e.target.value) }))} style={{ ...IS, width: 240 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t="Employer Match %" />
                        <select data-lpignore="true" value={spouseEmp.matchPct || ""} onChange={e => setSpouseEmp(p => ({ ...p, matchPct: e.target.value }))} style={{ ...IS, width: 170 }}>
                          <option value="">— Select —</option>
                          <option value="No Match">No Match</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                        </select>
                      </div>
                    </div>
                    {(() => {
                      const matchNum = parseInt((spouseEmp.matchPct || "").replace(/[^0-9]/g, "") || 0);
                      const compAmt = parseInt((spouseEmp.compensation || "").replace(/[^0-9]/g, "") || 0);
                      const mult = { weekly: 52, biweekly: 26, bimonthly: 24, monthly: 12 }[spouseEmp.payFrequency] || 0;
                      const annualIncome = compAmt && mult ? compAmt * mult : 0;
                      const empMonthly = parseInt((spouseEmp.contributionAmt || "").replace(/[^0-9]/g, "") || 0);
                      const maxMatchAnnual = annualIncome && matchNum ? Math.round(annualIncome * matchNum / 100) : 0;
                      const maxMatchMonthly = maxMatchAnnual ? Math.round(maxMatchAnnual / 12) : 0;
                      const totalMonthly = empMonthly + maxMatchMonthly;
                      if (!matchNum) return null;
                      const Tile = ({ label, val, accent }) => (
                        <div style={{ flex: 1, minWidth: 150, background: accent ? "#e8f0fb" : "#f4f6f9", border: "1px solid " + (accent ? "#b3c9ef" : BORDER), borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: 4 }}>{label}</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "#1a4a8a" : INK }}>{val || "—"}</div>
                        </div>
                      );
                      return (
                        <div style={{ marginBottom: 12 }}>
                          {annualIncome > 0 && <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Max employer match: <strong style={{ color: INK }}>${maxMatchAnnual.toLocaleString()}/yr</strong> &nbsp;({matchNum}% × ${annualIncome.toLocaleString()} annual income)</div>}
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <Tile label="Employee Contribution / mo" val={empMonthly ? "$" + empMonthly.toLocaleString() : null} />
                            <Tile label="Employer Match / mo" val={maxMatchMonthly ? "$" + maxMatchMonthly.toLocaleString() : null} />
                            <Tile label={"Total " + (spouseEmp.retirementType || "Retirement Plan") + " / mo"} val={totalMonthly ? "$" + totalMonthly.toLocaleString() : null} accent />
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
                      <div style={{ flex: "0 0 160px" }}><Lbl t="Current Balance" /><input value={spouseEmp.retirementBalance} onChange={e => setSpouseEmp(p => ({ ...p, retirementBalance: fmtDollar(e.target.value) }))} style={{ ...IS, width: 160 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t="Custodian / Plan Sponsor" />
                        <select data-lpignore="true" value={spouseEmp.retirementCustodian || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementCustodian: e.target.value, retirementCustodianOther: "" }))} style={{ ...IS, width: 180 }}>
                          <option value="">— Select —</option>
                          <option>Fidelity</option><option>Empower</option><option>Vanguard</option><option>Schwab</option>
                          <option>T. Rowe Price</option><option>Principal</option><option>Prudential</option><option>Transamerica</option>
                          <option>Lincoln Financial</option><option>John Hancock</option><option>Nationwide</option><option>MassMutual</option>
                          <option>Ameritas</option><option>TIAA</option><option>PEBA / State Plan</option><option>Other</option>
                        </select>
                        {spouseEmp.retirementCustodian === "Other" && (
                          <input value={spouseEmp.retirementCustodianOther || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementCustodianOther: e.target.value }))} style={{ ...IS, marginTop: 6 }} placeholder="Specify custodian" autoComplete="new-password" data-lpignore="true" />
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t={<span>In Service<br/>Transfer Available</span>} />
                        <select value={spouseEmp.inServiceTransfer || ""} onChange={e => setSpouseEmp(p => ({ ...p, inServiceTransfer: e.target.value }))} style={{ ...IS, width: 114 }} data-lpignore="true">
                          <option value="">— Select —</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <FileUpload section="employment" files={uploads.employment || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>

          {extraEmps.map((r, i) => (
            <div key={r.id} style={{ marginTop: 16, border: "1px solid " + BORDER, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Additional Employment Record {i + 1}</div>
                <button onClick={() => removeExtraEmp(r.id)} style={{ background: "none", border: "1px solid " + BORDER, borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#b3261e", cursor: "pointer" }}>✕ Delete</button>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Employee" />
                  <select value={r.owner || "client"} onChange={e => updExtraEmp(r.id, "owner", e.target.value)} style={{ ...IS, width: Math.max(150, Math.max([client.firstName, client.lastName].filter(Boolean).join(" ").length, [spouse.firstName, spouse.lastName].filter(Boolean).join(" ").length) * 10 + 56) }} data-lpignore="true">
                    <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    {["married","domestic_partner"].includes(hasSpouse) && (
                      <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                    )}
                  </select>
                </div>
                <F style={{ flex: "0 0 240px" }}><Lbl t="Employer Name" /><input value={r.employer} onChange={e => updExtraEmp(r.id, "employer", e.target.value)} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" /></F>
                <F style={{ flex: "0 0 200px" }}><Lbl t="Occupation" /><input value={r.occupation} onChange={e => updExtraEmp(r.id, "occupation", e.target.value)} style={{ ...IS, width: 200 }} autoComplete="new-password" data-lpignore="true" /></F>
                <div style={{ flexShrink: 0 }}><DatePicker label="Start Date" value={r.startDate} onChange={v => updExtraEmp(r.id, "startDate", v)} compact /></div>
                <F style={{ flex: "0 0 145px" }}><Lbl t="Work Phone" /><input value={r.workPhone} onChange={e => updExtraEmp(r.id, "workPhone", fmtPhone(e.target.value))} style={{ ...IS, width: 145 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Work Address" />
                  <input value={r.workAddress} onChange={e => updExtraEmp(r.id, "workAddress", e.target.value)} style={{ ...IS, width: 240 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="ZIP" />
                  <input value={r.workZip} onChange={e => { const z = fmtZip(e.target.value); updExtraEmp(r.id, "workZip", z); lookupZip(z, (city, state) => setExtraEmps(p => p.map(x => x.id === r.id ? { ...x, workCity: city, workState: state } : x))); }} maxLength={10} style={{ ...IS, width: 90 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="City" />
                  <input value={r.workCity} onChange={e => updExtraEmp(r.id, "workCity", e.target.value)} style={{ ...IS, width: 160 }} autoComplete="new-password" data-lpignore="true" />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="State" />
                  <StateSelect value={r.workState} onChange={e => updExtraEmp(r.id, "workState", e.target.value)} style={{ width: 224 }} />
                </div>
              </div>
              <div style={{ marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Employer Retirement Plan</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Has Retirement Plan?" />
                    <select data-lpignore="true" value={r.hasRetirement || ""} onChange={e => updExtraEmp(r.id, "hasRetirement", e.target.value || null)} style={{ ...IS, width: 76 }}>
                      <option value="">— Select —</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {r.hasRetirement === "yes" && (
                    <>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t="Type of Plan" />
                        <select data-lpignore="true" value={r.retirementType || ""} onChange={e => updExtraEmp(r.id, "retirementType", e.target.value || null)} style={{ ...IS, width: 245 }}>
                          <option value="">— Select —</option>
                          <option>401(k)</option><option>Roth 401(k)</option><option>403(b)</option><option>Roth 403(b)</option>
                          <option>457(b)</option><option>457(f)</option><option>TMRS</option><option>TRS</option>
                          <option>ORP</option><option>ESOP</option><option>SIMPLE IRA</option><option>SEP IRA</option>
                          <option>Pension / Defined Benefit</option><option>Stock Option / ESPP</option><option>Other</option>
                        </select>
                      </div>
                      <div style={{ flexShrink: 0 }}><Lbl t="Monthly Employee Contribution" /><input value={r.contributionAmt || ""} onChange={e => updExtraEmp(r.id, "contributionAmt", fmtDollar(e.target.value))} style={{ ...IS, width: 240 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t="Employer Match %" />
                        <select data-lpignore="true" value={r.matchPct || ""} onChange={e => updExtraEmp(r.id, "matchPct", e.target.value)} style={{ ...IS, width: 170 }}>
                          <option value="">— Select —</option>
                          <option value="No Match">No Match</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                        </select>
                      </div>
                      <div style={{ flex: "0 0 160px" }}><Lbl t="Current Balance" /><input value={r.retirementBalance} onChange={e => updExtraEmp(r.id, "retirementBalance", fmtDollar(e.target.value))} style={{ ...IS, width: 160 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t="Custodian / Plan Sponsor" />
                        <select data-lpignore="true" value={r.retirementCustodian || ""} onChange={e => updExtraEmp(r.id, "retirementCustodian", e.target.value)} style={{ ...IS, width: 180 }}>
                          <option value="">— Select —</option>
                          <option>Fidelity</option><option>Empower</option><option>Vanguard</option><option>Schwab</option>
                          <option>T. Rowe Price</option><option>Principal</option><option>Prudential</option><option>Transamerica</option>
                          <option>Lincoln Financial</option><option>John Hancock</option><option>Nationwide</option><option>MassMutual</option>
                          <option>Ameritas</option><option>TIAA</option><option>PEBA / State Plan</option><option>Other</option>
                        </select>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <Lbl t={<span>In Service<br/>Transfer Available</span>} />
                        <select value={r.inServiceTransfer || ""} onChange={e => updExtraEmp(r.id, "inServiceTransfer", e.target.value)} style={{ ...IS, width: 114 }} data-lpignore="true">
                          <option value="">— Select —</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <button onClick={addExtraEmp} style={{ background: "none", border: "1px dashed " + BORDER, borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: BRAND_NAVY, cursor: "pointer" }}>+ Add Another Employment Record</button>
          </div>
        </Panel>

        {/* ── ANNUAL INCOME ── */}
        <Panel title="Income" id="section-income">
          {incomes.map((inc, i) => (
            <div key={inc.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Income {i + 1}</div>
                  <select data-lpignore="true" value={inc.owner || "client"} onChange={e => updIncome(inc.id, "owner", e.target.value)}
                    style={{ fontSize: 11, fontWeight: 700, border: "1px solid " + BORDER, borderRadius: 5, padding: "3px 8px", cursor: "pointer", background: "#fff", color: INK }}>
                    <option value="">— Belongs To —</option>
                    <option value="client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    <option value="spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                    <option value="joint">Joint</option>
                  </select>
                </div>
                {incomes.length > 1 && (
                  <button onClick={() => showConfirm("Remove this income source?", () => delIncome(inc.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Income Type" />
                  <select data-lpignore="true" value={inc.type} onChange={e => updIncome(inc.id, "type", e.target.value)} style={{ ...IS, width: 220 }}>
                    <option value="">— Select —</option>
                    {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Source" />
                  <select data-lpignore="true" value={inc.source || ""} onChange={e => updIncome(inc.id, "source", e.target.value)} style={{ ...IS, width: 270 }}>
                    <option value="">— Select —</option>
                    {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Frequency" />
                  <select data-lpignore="true" value={inc.frequency || ""} onChange={e => updIncome(inc.id, "frequency", e.target.value)} style={{ ...IS, width: 230 }}>
                    <option value="">— Select —</option>
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="bimonthly">Bi-Monthly (twice/month)</option>
                    <option value="biweekly">Bi-Weekly (every 2 weeks)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                {inc.frequency && (<>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t={{ annual:"Annual Amount", monthly:"Monthly Amount", bimonthly:"Bi-Monthly Amount", biweekly:"Bi-Weekly Amount", weekly:"Weekly Amount" }[inc.frequency] || "Amount"} />
                    <input value={inc.amount} onChange={e => updIncome(inc.id, "amount", fmtDollar(e.target.value))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Annual" />
                    <div style={{ ...IS, width: 140, background: NAV, color: INK, display: "flex", alignItems: "center" }}>
                      {(() => {
                        const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0);
                        if (!raw) return "—";
                        const mult = { annual:1, monthly:12, bimonthly:24, biweekly:26, weekly:52 }[inc.frequency] || 1;
                        return "$" + (inc.frequency === "annual" ? raw : raw * mult).toLocaleString();
                      })()}
                    </div>
                  </div>
                </>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginTop: 4 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Future Income?" />
                  <select value={inc.futureIncome || ""} onChange={e => updIncome(inc.id, "futureIncome", e.target.value)} style={{ ...IS, width: 100 }} data-lpignore="true">
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="current">Current</option>
                  </select>
                </div>
                {inc.futureIncome === "yes" && (
                  <div style={{ flexShrink: 0 }}>
                    <DatePicker label="Future Income Start Date" value={inc.futureIncomeDate || ""} onChange={v => updIncome(inc.id, "futureIncomeDate", v)} compact />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button onClick={addIncome} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Income
          </button>
          {(() => {
            const toAnnual = inc => { const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0); if (!raw || !inc.frequency) return 0; const mult = { annual:1, monthly:12, bimonthly:24, biweekly:26, weekly:52 }[inc.frequency] || 1; return raw * mult; };
            const ownerOf = i => (i.owner || "client").toLowerCase();
            const clientAnnual = activeIncomes.filter(i => ownerOf(i) !== "spouse" && ownerOf(i) !== "joint").reduce((s, i) => s + toAnnual(i), 0);
            const spouseAnnual = activeIncomes.filter(i => ownerOf(i) === "spouse").reduce((s, i) => s + toAnnual(i), 0);
            const jointAnnual = activeIncomes.filter(i => ownerOf(i) === "joint").reduce((s, i) => s + toAnnual(i), 0);
            const totalAnnual = clientAnnual + spouseAnnual + jointAnnual;
            if (!totalAnnual) return null;
            const married = ["married","domestic_partner"].includes(hasSpouse);
            const brackets = married ? [
              { min: 0, max: 23200, rate: 10 },{ min: 23200, max: 94300, rate: 12 },
              { min: 94300, max: 201050, rate: 22 },{ min: 201050, max: 383900, rate: 24 },
              { min: 383900, max: 487450, rate: 32 },{ min: 487450, max: 731200, rate: 35 },
              { min: 731200, max: Infinity, rate: 37 },
            ] : [
              { min: 0, max: 11600, rate: 10 },{ min: 11600, max: 47150, rate: 12 },
              { min: 47150, max: 100525, rate: 22 },{ min: 100525, max: 191950, rate: 24 },
              { min: 191950, max: 243725, rate: 32 },{ min: 243725, max: 609350, rate: 35 },
              { min: 609350, max: Infinity, rate: 37 },
            ];
            const bracket = brackets.find(b => totalAnnual >= b.min && totalAnnual < b.max);
            if (!bracket) return null;
            const rateColor = bracket.rate <= 12 ? "#1a6a3a" : bracket.rate <= 22 ? "#7a6a00" : bracket.rate <= 24 ? "#8a4a2a" : "#8a1a1a";
            return (
              <div style={{ marginTop: 14, background: NAV, border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>
                  Estimated Tax Summary — Filing {married ? "Married Filing Jointly" : "Single"}
                </div>
                {clientAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: INK }}>Client Income ({client.firstName || "Client"})</span>
                    <span style={{ fontSize: 14, color: INK }}>${clientAnnual.toLocaleString()}</span>
                  </div>
                )}
                {spouseAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: INK }}>Spouse Income ({spouse.firstName || "Spouse"})</span>
                    <span style={{ fontSize: 14, color: INK }}>${spouseAnnual.toLocaleString()}</span>
                  </div>
                )}
                {jointAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: INK }}>Joint Income</span>
                    <span style={{ fontSize: 14, color: INK }}>${jointAnnual.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderTop: "1px solid " + BORDER, paddingTop: 8 }}>
                  <span style={{ fontSize: 13, color: INK }}>Total Gross Income</span>
                  <span style={{ fontSize: 15, fontWeight: "bold", color: INK }}>${totalAnnual.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: INK }}>Marginal Tax Bracket</span>
                  <span style={{ fontSize: 20, fontWeight: "bold", color: INK }}>{bracket.rate}%</span>
                </div>
                <div style={{ fontSize: 11, color: INK, marginTop: 10, fontStyle: "italic" }}>
                  Based on 2024 IRS brackets · Does not account for deductions, credits, or other adjustments
                </div>
              </div>
            );
          })()}
          {/* ── ANNUAL EXPENSES ── */}
          <Sec t="Annual Household Expenses" />
          <Row cols={3}>
            <F>
              <Lbl t="Expense Frequency" />
              <select value={annualExpenses.frequency} onChange={e => setAnnualExpenses(p => ({ ...p, frequency: e.target.value }))} style={IS}>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </F>
            <F>
              <Lbl t={{ monthly: "Monthly Expenses", annual: "Annual Expenses" }[annualExpenses.frequency] || "Expenses"} />
              <input value={annualExpenses.amount} onChange={e => setAnnualExpenses(p => ({ ...p, amount: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" />
            </F>
            <F>
              <Lbl t="Annual" />
              <div style={{ ...IS, background: NAV, color: INK, display: "flex", alignItems: "center" }}>
                {(() => {
                  const raw = parseInt((annualExpenses.amount || "").replace(/[^0-9]/g, "") || 0);
                  if (!raw) return "—";
                  return "$" + (annualExpenses.frequency === "monthly" ? raw * 12 : raw).toLocaleString();
                })()}
              </div>
            </F>
          </Row>
          <FileUpload section="income" files={uploads.income || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── REAL ESTATE ── */}
        <Panel title="Real Estate - Business Assets" id="section-realestate">
          {/* ── OWN OR RENT ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, fontWeight: 600, color: INK, borderBottom: "1px solid " + BORDER, paddingBottom: 7, marginTop: 24, marginBottom: 8 }}>
            <span>Personal Property</span>
            <button onClick={() => setHomeOwnership(p => ({ ...p, address: client.addressLine1 || client.address || "", address2: client.addressLine2 || "", city: client.city || "", state: client.state || "", zip: client.zip || "" }))} style={{ fontSize: 12, background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600 }}>Copy Home Address</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flex: "0 0 220px" }}>
              <Lbl t="Property Type" />
              <select data-lpignore="true" value={allPropertyTypes.includes(homeOwnership.propertyType) ? homeOwnership.propertyType : homeOwnership.propertyType ? "__other__" : ""} onChange={e => setHomeOwnership(p => ({ ...p, propertyType: e.target.value === "__other__" ? "__other__" : e.target.value }))} style={{ ...IS, width: 220 }}>
                <option value="">— Select —</option>
                {allPropertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="__other__">Other (type below)</option>
              </select>
              {(!allPropertyTypes.includes(homeOwnership.propertyType) && homeOwnership.propertyType) && (
                <input value={homeOwnership.propertyType === "__other__" ? "" : homeOwnership.propertyType} onChange={e => setHomeOwnership(p => ({ ...p, propertyType: e.target.value }))} onBlur={e => addCustomPropertyType(e.target.value)} style={{ ...IS, marginTop: 6 }} placeholder="Enter property type" autoComplete="new-password" data-lpignore="true" />
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Own or Rent?" />
              <select value={homeOwnership.ownOrRent || ""} onChange={e => setHomeOwnership(p => ({ ...p, ownOrRent: e.target.value || null }))} style={{ ...IS, width: 90 }}>
                <option value="">— Select —</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div style={{ flex: "0 0 280px" }}>
              <Lbl t="Description" />
              {(() => {
                const allDescs = [...DEFAULT_PROPERTY_DESCS, ...customPropertyDescs.filter(c => !DEFAULT_PROPERTY_DESCS.includes(c))];
                return (<>
                  <select data-lpignore="true" value={allDescs.includes(homeOwnership.description) ? homeOwnership.description : homeOwnership.description ? "__other__" : ""} onChange={e => setHomeOwnership(p => ({ ...p, description: e.target.value === "__other__" ? "__other__" : e.target.value }))} style={{ ...IS, width: 280 }}>
                    <option value="">— Select —</option>
                    {allDescs.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="__other__">Other (type below)</option>
                  </select>
                  {(!allDescs.includes(homeOwnership.description) && homeOwnership.description) && (
                    <input value={homeOwnership.description === "__other__" ? "" : homeOwnership.description} onChange={e => setHomeOwnership(p => ({ ...p, description: e.target.value }))} onBlur={e => addCustomPropertyDesc(e.target.value)} style={{ ...IS, marginTop: 6 }} placeholder="Enter description" autoComplete="new-password" data-lpignore="true" />
                  )}
                </>);
              })()}
            </div>
          </div>
          <Row cols={2}>
            <F><Lbl t="Street Address" /><input value={homeOwnership.address || ""} onChange={e => setHomeOwnership(p => ({ ...p, address: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Apt / Suite (optional)" /><input value={homeOwnership.address2 || ""} onChange={e => setHomeOwnership(p => ({ ...p, address2: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><Lbl t="ZIP" /><input value={homeOwnership.zip || ""} onChange={e => { const z = fmtZip(e.target.value); setHomeOwnership(p => ({ ...p, zip: z })); lookupZip(z, (city, state) => setHomeOwnership(p => ({ ...p, city, state }))); }} maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="City" /><input value={homeOwnership.city || ""} onChange={e => setHomeOwnership(p => ({ ...p, city: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="State" /><StateSelect value={homeOwnership.state || ""} onChange={e => setHomeOwnership(p => ({ ...p, state: e.target.value }))} /></F>
          </Row>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Zillow?" />
              <select value={homeOwnership.hasZillow || ""} onChange={e => setHomeOwnership(p => ({ ...p, hasZillow: e.target.value || null }))} style={{ ...IS, width: 104 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {homeOwnership.hasZillow === "yes" && (
              <div style={{ flexShrink: 0 }}>
                <Lbl t="Look Up on Zillow" />
                <button
                  type="button"
                  onClick={() => {
                    const addr = [homeOwnership.address, homeOwnership.city, homeOwnership.state, homeOwnership.zip].filter(Boolean).join(" ");
                    const q = encodeURIComponent(addr || "");
                    window.open("https://www.zillow.com/homes/" + q + "_rb/", "_blank");
                  }}
                  style={{ ...IS, width: 160, cursor: "pointer", textAlign: "center", background: "#006aff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: 6 }}
                >
                  Open Zillow ↗
                </button>
              </div>
            )}
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Mortgage?" />
              <select value={homeOwnership.hasMortgage || ""} onChange={e => setHomeOwnership(p => ({ ...p, hasMortgage: e.target.value || null }))} style={{ ...IS, width: 114 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}><DatePicker label="Purchase Date" value={homeOwnership.purchaseDate || ""} onChange={v => setHomeOwnership(p => ({ ...p, purchaseDate: v }))} compact /></div>
            <F style={{ flex: "0 0 150px" }}><Lbl t="Purchase Price" /><input value={homeOwnership.purchasePrice || ""} onChange={e => setHomeOwnership(p => ({ ...p, purchasePrice: fmtDollar(e.target.value) }))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
            <F style={{ flex: "0 0 150px" }}><Lbl t="Market Value" /><input value={homeOwnership.marketValue || ""} onChange={e => setHomeOwnership(p => ({ ...p, marketValue: fmtDollar(e.target.value) }))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
            <F style={{ flex: "0 0 150px" }}>
              <Lbl t="Net Equity" />
              <div style={{ ...IS, width: 150, background: "#f2f4f7", fontWeight: 700, display: "flex", alignItems: "center" }}>
                {(() => {
                  const mv = parseInt((homeOwnership.marketValue || "").replace(/[^0-9]/g, "") || 0);
                  const mb = parseInt((homeOwnership.mortgageBalance || "").replace(/[^0-9]/g, "") || 0);
                  return mv > 0 ? "$" + (mv - mb).toLocaleString() : "—";
                })()}
              </div>
            </F>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Opportunity?" />
              <select data-lpignore="true" value={homeOwnership.hasOpt || ""} onChange={e => setHomeOwnership(p => ({ ...p, hasOpt: e.target.value || null }))} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {homeOwnership.hasOpt === "yes" && (<>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="Event?" />
                <select data-lpignore="true" value={homeOwnership.optEvent || ""} onChange={e => setHomeOwnership(p => ({ ...p, optEvent: e.target.value }))} style={{ ...IS, width: 180 }}>
                  <option value="">— Select —</option>
                  <option value="Retire">Retire</option>
                  <option value="Sell Home">Sell Home</option>
                  <option value="Sell Business">Sell Business</option>
                  <option value="Sell Land">Sell Land</option>
                  <option value="Inheritance">Inheritance</option>
                  <option value="Settlement">Settlement</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Death of Spouse">Death of Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Lbl t="Time Frame / Date" />
                <input value={homeOwnership.optTimeframe || ""} onChange={e => setHomeOwnership(p => ({ ...p, optTimeframe: e.target.value }))} style={{ ...IS, width: 180 }} autoComplete="new-password" data-lpignore="true" placeholder="e.g. Jan 2026" />
              </div>
            </>)}
          </div>
          {homeOwnership.ownOrRent === "own" && (<>
            {homeOwnership.hasMortgage === "yes" && (<>
            <Row cols={3}>
              <F>
                <Lbl t="Mortgage Company" />
                <select value={allMortgageCos.includes(homeOwnership.mortgageCompany) ? homeOwnership.mortgageCompany : homeOwnership.mortgageCompany ? "__other__" : ""} onChange={e => setHomeOwnership(p => ({ ...p, mortgageCompany: e.target.value === "__other__" ? "__other__" : e.target.value }))} style={IS} data-lpignore="true">
                  <option value="">— Select —</option>
                  {allMortgageCos.map(co => <option key={co} value={co}>{co}</option>)}
                  <option value="__other__">Other (type below)</option>
                </select>
                {(!allMortgageCos.includes(homeOwnership.mortgageCompany) && homeOwnership.mortgageCompany) && (
                  <input value={homeOwnership.mortgageCompany === "__other__" ? "" : homeOwnership.mortgageCompany} onChange={e => setHomeOwnership(p => ({ ...p, mortgageCompany: e.target.value }))} onBlur={e => addCustomMortgageCo(e.target.value)} style={{ ...IS, marginTop: 6 }} placeholder="Enter mortgage company name" autoComplete="new-password" data-lpignore="true" />
                )}
              </F>
              <F><Lbl t="Mortgage Balance" /><input value={homeOwnership.mortgageBalance} onChange={e => setHomeOwnership(p => ({ ...p, mortgageBalance: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Monthly Payment" /><input value={homeOwnership.monthlyPayment} onChange={e => setHomeOwnership(p => ({ ...p, monthlyPayment: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
            <Row cols={3}>
              <F><Lbl t="Interest Rate" /><input value={homeOwnership.interestRate} onChange={e => setHomeOwnership(p => ({ ...p, interestRate: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="e.g. 6.5%" /></F>
              <F><DatePicker label="Loan Origination Date" value={homeOwnership.loanOriginationDate} onChange={v => setHomeOwnership(p => ({ ...p, loanOriginationDate: v }))} /></F>
              <F><Lbl t="Loan Number" /><input value={homeOwnership.loanNumber} onChange={e => setHomeOwnership(p => ({ ...p, loanNumber: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
            </>)}
            <Row cols={3}>
              <F><Lbl t="Annual Property Taxes" /><input value={homeOwnership.annualPropertyTaxes || ""} onChange={e => setHomeOwnership(p => ({ ...p, annualPropertyTaxes: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
              <F><Lbl t="Annual Insurance" /><input value={homeOwnership.annualInsurance || ""} onChange={e => setHomeOwnership(p => ({ ...p, annualInsurance: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
            </Row>
          </>)}
          {homeOwnership.ownOrRent === "rent" && (
            <Row cols={3}>
              <F><Lbl t="Monthly Rent" /><input value={homeOwnership.monthlyRent} onChange={e => setHomeOwnership(p => ({ ...p, monthlyRent: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Landlord Name" /><input value={homeOwnership.landlordName} onChange={e => setHomeOwnership(p => ({ ...p, landlordName: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Landlord Phone" /><input value={homeOwnership.landlordPhone} onChange={e => setHomeOwnership(p => ({ ...p, landlordPhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
          )}
          <Sec t="Additional Properties" />
          {realEstate.map((r, i) => (
            <div key={r.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Property {i + 1}</span>
                  <button onClick={() => { updRE(r.id, "address", client.addressLine1 || client.address || ""); updRE(r.id, "addressLine2", client.addressLine2 || ""); updRE(r.id, "city", client.city || ""); updRE(r.id, "state", client.state || ""); updRE(r.id, "zip", client.zip || ""); }} style={{ fontSize: 12, background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600 }}>Copy Home Address</button>
                </div>
                {realEstate.length > 1 && (
                  <button onClick={() => showConfirm("Remove this property?", () => delRE(r.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ flex: "0 0 220px" }}>
                  <Lbl t="Property Type" />
                  <select data-lpignore="true" value={allPropertyTypes.includes(r.description) ? r.description : r.description ? "__other__" : ""} onChange={e => updRE(r.id, "description", e.target.value === "__other__" ? "__other__" : e.target.value)} style={{ ...IS, width: 220 }}>
                    <option value="">— Select —</option>
                    {allPropertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="__other__">Other (type below)</option>
                  </select>
                  {(!allPropertyTypes.includes(r.description) && r.description) && (
                    <input value={r.description === "__other__" ? "" : r.description} onChange={e => updRE(r.id, "description", e.target.value)} onBlur={e => addCustomPropertyType(e.target.value)} style={{ ...IS, marginTop: 6 }} placeholder="Enter property type" autoComplete="new-password" data-lpignore="true" />
                  )}
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Own or Rent?" />
                  <select value={r.ownOrRent || ""} onChange={e => updRE(r.id, "ownOrRent", e.target.value || null)} style={{ ...IS, width: 114 }} data-lpignore="true">
                    <option value="">— Select —</option>
                    <option value="own">Own</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div style={{ flex: "1 1 240px" }}>
                  <Lbl t="Description" />
                  {(() => {
                    const allDescs = [...DEFAULT_PROPERTY_DESCS, ...customPropertyDescs.filter(c => !DEFAULT_PROPERTY_DESCS.includes(c))];
                    return (<>
                      <select data-lpignore="true" value={allDescs.includes(r.descriptionNote) ? r.descriptionNote : r.descriptionNote ? "__other__" : ""} onChange={e => updRE(r.id, "descriptionNote", e.target.value === "__other__" ? "__other__" : e.target.value)} style={IS}>
                        <option value="">— Select —</option>
                        {allDescs.map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="__other__">Other (type below)</option>
                      </select>
                      {(!allDescs.includes(r.descriptionNote) && r.descriptionNote) && (
                        <input value={r.descriptionNote === "__other__" ? "" : r.descriptionNote} onChange={e => updRE(r.id, "descriptionNote", e.target.value)} onBlur={e => addCustomPropertyDesc(e.target.value)} style={{ ...IS, marginTop: 6 }} placeholder="Enter description" autoComplete="new-password" data-lpignore="true" />
                      )}
                    </>);
                  })()}
                </div>
              </div>
              <div style={{ marginTop: 8, marginBottom: 4 }}>
                <Lbl t="Property Address" />
              </div>
              <Row cols={2}>
                <F><Lbl t="Street Address" /><input value={r.address} onChange={e => updRE(r.id, "address", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Apt / Suite (optional)" /><input value={r.addressLine2 || ""} onChange={e => updRE(r.id, "addressLine2", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F>
                  <Lbl t="ZIP" />
                  <input value={r.zip || ""} onChange={e => { const z = fmtZip(e.target.value); updRE(r.id, "zip", z); lookupZip(z, (city, state) => { updRE(r.id, "city", city); updRE(r.id, "state", state); }); }} maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true" />
                </F>
                <F><Lbl t="City" /><input value={r.city || ""} onChange={e => updRE(r.id, "city", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="State" /><StateSelect value={r.state || ""} onChange={e => updRE(r.id, "state", e.target.value)} /></F>
              </Row>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}><DatePicker label="Purchase Date" value={r.purchaseDate} onChange={v => updRE(r.id, "purchaseDate", v)} compact /></div>
                <F style={{ flex: "0 0 150px" }}><Lbl t="Purchase Price" /><input value={r.purchasePrice} onChange={e => updRE(r.id, "purchasePrice", fmtDollar(e.target.value))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F style={{ flex: "0 0 150px" }}><Lbl t="Market Value" /><input value={r.marketValue} onChange={e => updRE(r.id, "marketValue", fmtDollar(e.target.value))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <F style={{ flex: "0 0 150px" }}><Lbl t="Mortgage Balance" /><input value={r.mortgageBalance} onChange={e => updRE(r.id, "mortgageBalance", fmtDollar(e.target.value))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F style={{ flex: "0 0 150px" }}>
                  <Lbl t="Net Equity" />
                  <input
                    value={(() => {
                      const mv = parseInt((r.marketValue || "").replace(/[^0-9]/g, "") || 0);
                      const mb = parseInt((r.mortgageBalance || "").replace(/[^0-9]/g, "") || 0);
                      return mv > 0 ? "$" + (mv - mb).toLocaleString() : r.netEquity || "";
                    })()}
                    onChange={e => updRE(r.id, "netEquity", fmtDollar(e.target.value))}
                    style={{ ...IS, width: 150 }}
                    inputMode="numeric"
                    autoComplete="new-password"
                    data-lpignore="true"
                    placeholder="Auto"
                  />
                </F>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Zillow?" />
                  <select value={r.hasZillow || ""} onChange={e => updRE(r.id, "hasZillow", e.target.value || null)} style={{ ...IS, width: 114 }} data-lpignore="true">
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {r.hasZillow === "yes" && (
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Look Up on Zillow" />
                    <button
                      type="button"
                      onClick={() => {
                        const addr = [r.address, r.city, r.state, r.zip].filter(Boolean).join(" ");
                        const q = encodeURIComponent(addr || "");
                        window.open("https://www.zillow.com/homes/" + q + "_rb/", "_blank");
                      }}
                      style={{ ...IS, width: 150, cursor: "pointer", textAlign: "center", background: "#006aff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: 6 }}
                    >
                      Open Zillow ↗
                    </button>
                  </div>
                )}
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Mortgage?" />
                  <select value={r.hasMortgage || ""} onChange={e => updRE(r.id, "hasMortgage", e.target.value || null)} style={{ ...IS, width: 114 }} data-lpignore="true">
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              {r.hasMortgage === "yes" && (<>
              <Row cols={2}>
                <F>
                  <Lbl t="Mortgage Company" />
                  <SmartCombo
                    value={r.mortgageCompany === "__other__" ? "" : (r.mortgageCompany || "")}
                    options={["N/A", ...allMortgageCos]}
                    onChange={v => updRE(r.id, "mortgageCompany", v)}
                    onBlur={v => { if (v && v !== "N/A") addCustomMortgageCo(v); }}
                    style={IS}
                    placeholder="Type or select mortgage company"
                  />
                </F>
                <F><DatePicker label="Origination Date" value={r.originationDate} onChange={v => updRE(r.id, "originationDate", v)} /></F>
              </Row>
              <Row cols={3}>
                <F><Lbl t="Interest Rate (%)" /><input value={r.interestRate} onChange={e => updRE(r.id, "interestRate", e.target.value.replace(/[^0-9.]/g, ""))} style={IS} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Monthly Payment" /><input value={r.monthlyPmt} onChange={e => updRE(r.id, "monthlyPmt", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Loan Number" /><input value={r.loanNumber || ""} onChange={e => updRE(r.id, "loanNumber", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              </>)}
              {r.ownOrRent === "rent" && (
                <Row cols={3}>
                  <F><Lbl t="Monthly Rent" /><input value={r.monthlyRent || ""} onChange={e => updRE(r.id, "monthlyRent", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                  <F><Lbl t="Landlord Name" /><input value={r.landlordName || ""} onChange={e => updRE(r.id, "landlordName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  <F><Lbl t="Landlord Phone" /><input value={r.landlordPhone || ""} onChange={e => updRE(r.id, "landlordPhone", fmtPhone(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                </Row>
              )}
              <Row cols={3}>
                <F><Lbl t="Property Taxes (Annual)" /><input value={r.propertyTaxes} onChange={e => updRE(r.id, "propertyTaxes", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Insurance (Annual)" /><input value={r.insurance} onChange={e => updRE(r.id, "insurance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Total Annual Taxes & Insurance" />
                  <div style={{ ...IS, background: "#f2f4f7", color: INK, fontWeight: 700, display: "flex", alignItems: "center" }}>
                    {(() => {
                      const tax = parseInt((r.propertyTaxes || "").replace(/[^0-9]/g, "") || 0);
                      const ins = parseInt((r.insurance || "").replace(/[^0-9]/g, "") || 0);
                      return (tax || ins) ? "$" + (tax + ins).toLocaleString() : "—";
                    })()}
                  </div>
                </F>
                <F>
                  <Lbl t="Does Pmt Include Taxes & Ins?" />
                  <select data-lpignore="true" value={r.pmtIncludesTaxIns || ""} onChange={e => updRE(r.id, "pmtIncludesTaxIns", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="taxes_only">Taxes Only</option>
                    <option value="ins_only">Insurance Only</option>
                  </select>
                </F>
              </Row>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Opportunity?" />
                  <select data-lpignore="true" value={r.hasOpt || ""} onChange={e => updRE(r.id, "hasOpt", e.target.value || null)} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {r.hasOpt === "yes" && (<>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Event?" />
                    <select data-lpignore="true" value={r.optEvent || ""} onChange={e => updRE(r.id, "optEvent", e.target.value)} style={{ ...IS, width: 180 }}>
                      <option value="">— Select —</option>
                      <option value="Retire">Retire</option>
                      <option value="Sell Home">Sell Home</option>
                      <option value="Sell Business">Sell Business</option>
                      <option value="Sell Land">Sell Land</option>
                      <option value="Inheritance">Inheritance</option>
                      <option value="Settlement">Settlement</option>
                      <option value="Divorce">Divorce</option>
                      <option value="Death of Spouse">Death of Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Time Frame / Date" />
                    <input value={r.optTimeframe || ""} onChange={e => updRE(r.id, "optTimeframe", e.target.value)} style={{ ...IS, width: 180 }} autoComplete="new-password" data-lpignore="true" placeholder="e.g. Jan 2026" />
                  </div>
                </>)}
              </div>
            </div>
          ))}
          <button onClick={addRE} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Property
          </button>
          <Sec t="Business Assets" />
          {businesses.map((b, i) => (
            <div key={b.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Business {i + 1}</div>
                <button onClick={() => showConfirm("Remove this business?", () => setBusinesses(p => p.filter(x => x.id !== b.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <F style={{ flex: "0 0 220px" }}><Lbl t="Business Name" /><input value={b.name || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, name: e.target.value } : x))} style={{ ...IS, width: 220 }} autoComplete="new-password" data-lpignore="true" /></F>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Entity Type" />
                  <select data-lpignore="true" value={b.entityType || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, entityType: e.target.value } : x))} style={{ ...IS, width: 190 }}>
                    <option value="">— Select —</option>
                    <option>Sole Proprietorship</option>
                    <option>LLC</option>
                    <option>S-Corp</option>
                    <option>C-Corp</option>
                    <option>Partnership</option>
                    <option>Limited Partnership (LP)</option>
                    <option>Family Limited Partnership</option>
                    <option>Farm / Ranch Operation</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Ownership %" />
                  <select data-lpignore="true" value={b.ownershipPct || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, ownershipPct: e.target.value } : x))} style={{ ...IS, width: 100 }}>
                    <option value="">— % —</option>
                    {[5,10,15,20,25,30,33,40,50,60,66,70,75,80,90,100].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}><DatePicker label="Date Started" value={b.dateStarted || ""} onChange={v => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, dateStarted: v } : x))} compact /></div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Industry" />
                  <select data-lpignore="true" value={b.industry || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, industry: e.target.value } : x))} style={{ ...IS, width: 215 }}>
                    <option value="">— Select —</option>
                    <option>Agriculture / Ranching</option>
                    <option>Construction / Trades</option>
                    <option>Professional Services</option>
                    <option>Medical / Dental</option>
                    <option>Retail</option>
                    <option>Restaurant / Hospitality</option>
                    <option>Real Estate</option>
                    <option>Manufacturing</option>
                    <option>Transportation</option>
                    <option>Technology</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
                <F style={{ flex: "0 0 150px" }}><Lbl t="Estimated Value" /><input value={b.estValue || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, estValue: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                <F style={{ flex: "0 0 150px" }}><Lbl t="Annual Revenue" /><input value={b.annualRevenue || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, annualRevenue: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 150 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Buy-Sell Agreement?" />
                  <select data-lpignore="true" value={b.buySell || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, buySell: e.target.value } : x))} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Succession Plan?" />
                  <select data-lpignore="true" value={b.successionPlan || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, successionPlan: e.target.value } : x))} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Plan to Sell?" />
                  <select data-lpignore="true" value={b.planToSell || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, planToSell: e.target.value } : x))} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {b.planToSell === "yes" && (<>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Opportunity?" />
                    <select data-lpignore="true" value={b.hasOpt || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, hasOpt: e.target.value || null } : x))} style={{ ...IS, width: 114 }}>
                      <option value="">— Select —</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div style={{ flexShrink: 0 }}><DatePicker label="Expected Sale Date" value={b.expectedSaleDate || ""} onChange={v => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, expectedSaleDate: v } : x))} compact futureYears={15} /></div>
                  <F style={{ flex: "0 0 150px" }}><Lbl t="Timeframe / Notes" /><input value={b.saleTimeframe || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, saleTimeframe: e.target.value } : x))} style={{ ...IS, width: 150 }} autoComplete="new-password" data-lpignore="true" placeholder="e.g. Q3 2027" /></F>
                </>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginTop: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Loan Against Business?" />
                  <select data-lpignore="true" value={b.hasLoan || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, hasLoan: e.target.value || null } : x))} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {b.hasLoan === "yes" && (<>
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Loan Type" />
                    <select data-lpignore="true" value={b.loanType || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanType: e.target.value } : x))} style={{ ...IS, width: 170 }}>
                      <option value="">— Select —</option>
                      <option>Business Loan</option>
                      <option>SBA Loan</option>
                      <option>Commercial Mortgage</option>
                      <option>Equipment Loan</option>
                      <option>Line of Credit</option>
                      <option>Owner Financing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={{ flex: "0 0 200px" }}>
                    <Lbl t="Lender" />
                    <SmartCombo
                      value={b.loanLender || ""}
                      options={allLenders}
                      onChange={v => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanLender: v } : x))}
                      onBlur={v => addCustomLender(v)}
                      style={{ ...IS, width: 200 }}
                      placeholder="Type or select lender"
                    />
                  </div>
                  <F style={{ flex: "0 0 140px" }}><Lbl t="Loan Balance" /><input value={b.loanBalance || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanBalance: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                  <F style={{ flex: "0 0 140px" }}><Lbl t="Monthly Payment" /><input value={b.loanPayment || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanPayment: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                  <F style={{ flex: "0 0 110px" }}><Lbl t="Interest Rate" /><input value={b.loanRate || ""} onChange={e => setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanRate: e.target.value.replace(/[^0-9.]/g, "") } : x))} onBlur={e => { const v = e.target.value.replace(/[^0-9.]/g, ""); setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanRate: v ? v + "%" : "" } : x)); }} onFocus={e => { const v = (e.target.value || "").replace("%", ""); setBusinesses(p => p.map(x => x.id === b.id ? { ...x, loanRate: v } : x)); }} style={{ ...IS, width: 110 }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
                </>)}
              </div>
            </div>
          ))}
          <button onClick={() => setBusinesses(p => [...p, { id: Date.now() }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%", marginBottom: 12 }}>
            + Add Business
          </button>
          <FileUpload section="realestate" files={uploads.realestate || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── INVESTMENT & BANK ACCOUNTS ── */}
        <Panel title="Investment & Bank Accounts" id="section-accounts">
          {accounts.map((a, i) => (
            <div key={a.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              {/* Row 1: title + remove */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Account {i + 1}</div>
                {accounts.length > 1 && (
                  <button onClick={() => showConfirm("Remove this account?", () => delAcct(a.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
                )}
              </div>
              {/* Row 2: owner / NQ-Q / OPT / event / timeframe */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid " + BORDER }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Owner" />
                  <select data-lpignore="true" value={a.owner} onChange={e => updAcct(a.id, "owner", e.target.value)} style={{ ...IS, width: 160 }}>
                    <option value="">— Select —</option>
                    <option value="Client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    {["married","domestic_partner"].includes(hasSpouse) && (
                      <option value="Spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                    )}
                    <option value="Joint">Joint</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="NQ or Q?" />
                  <select data-lpignore="true" value={a.qualified || ""} onChange={e => updAcct(a.id, "qualified", e.target.value)} style={{ ...IS, width: 150 }}>
                    <option value="">— Select —</option>
                    <option value="Non-Qualified">Non-Qualified</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Opportunity?" />
                  <select data-lpignore="true" value={a.hasOpt || ""} onChange={e => updAcct(a.id, "hasOpt", e.target.value || null)} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Tax Filing" />
                  <select data-lpignore="true" value={a.taxFiling || ""} onChange={e => updAcct(a.id, "taxFiling", e.target.value)} style={{ ...IS, width: 114 }}>
                    <option value="">— Select —</option>
                    <option value="K-1">K-1</option>
                    <option value="1099">1099</option>
                    <option value="None">None</option>
                  </select>
                </div>
                {a.hasOpt === "yes" && (
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Event" />
                    <select data-lpignore="true" value={a.optEvent || ""} onChange={e => updAcct(a.id, "optEvent", e.target.value)} style={{ ...IS, width: 170 }}>
                      <option value="">— Select —</option>
                      <option value="Retire">Retire</option>
                      <option value="In Service Transfer">In Service Transfer</option>
                      <option value="Reposition Assets">Reposition Assets</option>
                      <option value="Sell Business">Sell Business</option>
                      <option value="Sell Land">Sell Land</option>
                      <option value="Inheritance">Inheritance</option>
                      <option value="Settlement">Settlement</option>
                      <option value="Divorce">Divorce</option>
                      <option value="Death of Spouse">Death of Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
                {a.hasOpt === "yes" && (
                  <div style={{ flexShrink: 0 }}>
                    <Lbl t="Expected Date of Event" />
                    <input
                      value={a.optTimeframe || ""}
                      onChange={e => updAcct(a.id, "optTimeframe", e.target.value)}
                      style={{ ...IS, width: 160 }}
                      autoComplete="new-password"
                      data-lpignore="true"
                      placeholder="e.g. Jan 2027"
                    />
                  </div>
                )}
                <div style={{ flex: "0 0 220px" }}>
                  <Lbl t="Account Type" />
                  <select data-lpignore="true" value={a.type || ""} onChange={e => updAcct(a.id, "type", e.target.value)} style={{ ...IS, width: 220 }}>
                    <option value="">— Select —</option>
                    {ACCOUNT_REG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    {a.type && !ACCOUNT_REG_TYPES.includes(a.type) && <option value={a.type}>{a.type}</option>}
                  </select>
                </div>
                <div style={{ flex: "0 0 208px" }}>
                  <Lbl t="Investment Type" />
                  <select data-lpignore="true" value={a.investmentType || ""} onChange={e => updAcct(a.id, "investmentType", e.target.value)} style={{ ...IS, width: 208 }}>
                    <option value="">— Select —</option>
                    {INVESTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flex: "0 0 200px" }}>
                  <Lbl t="Institution / Held At" />
                  <SmartCombo
                    value={a.institution}
                    options={allInstitutions}
                    onChange={v => syncAcctIncome(a, "institution", v)}
                    onBlur={v => addCustomInstitution(v)}
                    style={{ ...IS, width: 200 }}
                  />
                </div>
                <F style={{ flex: "0 0 144px" }}><Lbl t="Account Number" /><input value={a.accountNumber || ""} onChange={e => updAcct(a.id, "accountNumber", e.target.value)} style={{ ...IS, width: 144 }} autoComplete="new-password" data-lpignore="true" /></F>
                <F style={{ flex: "0 0 119px" }}><Lbl t="Balance" /><input value={a.balance} onChange={e => updAcct(a.id, "balance", fmtDollar(e.target.value))} style={{ ...IS, width: 119 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <F style={{ flex: "0 0 180px" }}>
                  <Lbl t="Transactions?" />
                  <select data-lpignore="true" value={a.hasRmdOrContrib || ""} onChange={e => toggleAcctRmd(a, e.target.value)} style={{ ...IS, width: 180 }}>
                    <option value="">— Select —</option>
                    <option value="None">None</option>
                    <option value="Contributions">Contributions</option>
                    <option value="Withdrawals">Withdrawals</option>
                    <option value="RMDs">RMDs</option>
                    <option value="Loans">Loans</option>
                    <option value="Other">Other</option>
                  </select>
                </F>
                {(INCOME_LINKED_TYPES.includes(a.hasRmdOrContrib) || a.hasRmdOrContrib === "Contributions") && (<>
                  <F style={{ flex: "0 0 140px" }}>
                    <Lbl t="Amount" />
                    <input value={a.rmdContribAmount || ""} onChange={e => syncAcctIncome(a, "rmdContribAmount", fmtDollar(e.target.value))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" />
                  </F>
                  <F style={{ flex: "0 0 130px" }}>
                    <Lbl t="Frequency" />
                    <select data-lpignore="true" value={a.rmdContribFrequency || ""} onChange={e => syncAcctIncome(a, "rmdContribFrequency", e.target.value)} style={{ ...IS, width: 130 }}>
                      <option value="">— Select —</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </F>
                </>)}
              </div>
            </div>
          ))}
          <button onClick={addAcct} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Account
          </button>
          {accounts.some(a => a.balance || a.type || a.owner) && (
            <div style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 8, padding: "10px 18px", marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 8, textAlign: "center" }}>Portfolio Summary</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, fontSize: 11, fontWeight: 700, color: MUTED, padding: "2px 0 4px", borderBottom: "1px solid " + BORDER }}>
                <span style={{ width: 34, flexShrink: 0 }}>ACCT</span>
                <span style={{ width: 110, flexShrink: 0 }}>Owner</span>
                <span style={{ width: 135, flexShrink: 0 }}>Account Type</span>
                <span style={{ width: 135, flexShrink: 0 }}>Investment Type</span>
                <span style={{ width: 135, flexShrink: 0 }}>Institution Held At</span>
                <span style={{ marginLeft: "auto", width: 48, flexShrink: 0 }}>OPP</span>
                <span style={{ width: 100, flexShrink: 0, textAlign: "right" }}>Value</span>
              </div>
              {accounts.map((a, i) => {
                const ownerName = a.owner === "Joint"
                  ? ([client.firstName, spouse.firstName].filter(Boolean).join(" & ") || "Joint")
                  : a.owner === "Spouse"
                    ? (spouse.firstName || "Spouse")
                    : a.owner === "Client"
                      ? (client.firstName || "Client")
                      : "—";
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: INK, padding: "4px 0", borderBottom: i < accounts.length - 1 ? "1px solid " + BORDER : "none" }}>
                    <span style={{ fontWeight: 600, width: 34, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ width: 110, flexShrink: 0 }}>{ownerName}</span>
                    <span style={{ width: 135, flexShrink: 0 }}>{a.type || "—"}</span>
                    <span style={{ width: 135, flexShrink: 0 }}>{a.investmentType || "—"}</span>
                    <span style={{ width: 135, flexShrink: 0 }}>{a.institution || "—"}</span>
                    <span style={{ marginLeft: "auto", width: 48, flexShrink: 0 }}>
                      <select data-lpignore="true" value={a.hasOpt || ""} onChange={e => updAcct(a.id, "hasOpt", e.target.value || null)} style={{ fontSize: 12, fontWeight: 700, border: "1px solid " + BORDER, borderRadius: 5, padding: "2px 4px", cursor: "pointer", width: 48, background: "#fff", color: a.hasOpt === "yes" ? "#1a6a3a" : INK }}>
                        <option value="">—</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </span>
                    <span style={{ width: 100, flexShrink: 0, textAlign: "right", fontWeight: 600 }}>{a.balance || "—"}</span>
                  </div>
                );
              })}
            </div>
          )}
          {accounts.some(a => a.balance) && (
            <div style={{ background: NAV, border: "1px solid " + BORDER, borderRadius: 8, padding: "12px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Total Investment Assets</span>
              <span style={{ fontSize: 18, fontWeight: "bold", color: INK }}>
                ${accounts.reduce((sum, a) => sum + parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0), 0).toLocaleString()}
              </span>
            </div>
          )}
          <FileUpload section="accounts" files={uploads.accounts || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── AUTOMOBILES ── */}
        <Panel title="Automobiles" id="section-autos">
          {autos.map((a, i) => (
            <div key={a.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Vehicle {i + 1}</div>
                {autos.length > 1 && (
                  <button onClick={() => showConfirm("Remove this vehicle?", () => delAuto(a.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
                )}
              </div>
              <Row cols={4}>
                <F><Lbl t="Year" /><input value={a.year} onChange={e => updAuto(a.id, "year", e.target.value)} maxLength={4} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Make" />
                  <select value={a.make} onChange={e => { updAuto(a.id, "make", e.target.value); updAuto(a.id, "model", ""); }} style={IS}>
                    <option value="">— Select Make —</option>
                    {Object.keys(AUTO_MODELS).sort().map(m => <option key={m} value={m}>{m}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </F>
                <F>
                  <Lbl t="Model" />
                  {a.make && AUTO_MODELS[a.make] ? (
                    <select value={a.model} onChange={e => updAuto(a.id, "model", e.target.value)} style={IS}>
                      <option value="">— Select Model —</option>
                      {AUTO_MODELS[a.make].map(m => <option key={m} value={m}>{m}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input value={a.model} onChange={e => updAuto(a.id, "model", e.target.value)} style={IS} autoComplete="off" data-lpignore="true" placeholder={a.make ? "Type model…" : "Select make first"} />
                  )}
                </F>
                <F><Lbl t="Est. Value" /><input value={a.value} onChange={e => updAuto(a.id, "value", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              {/* Row: Auto Loan? | Amount Owed | Financed With | Interest Rate */}
              <Row cols={4}>
                <F>
                  <Lbl t="Auto Loan?" />
                  <select value={a.hasLoan || ""} onChange={e => updAuto(a.id, "hasLoan", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No — Paid Off</option>
                  </select>
                </F>
                {a.hasLoan === "yes" && (<>
                  <F><Lbl t="Amount Owed" /><input value={a.loanBalance || ""} onChange={e => updAuto(a.id, "loanBalance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                  <F>
                    <Lbl t="Financed With" />
                    <select value={a.lender || ""} onChange={e => updAuto(a.id, "lender", e.target.value)} style={IS}>
                      <option value="">— Select Lender —</option>
                      {["Ally Financial","AmeriCredit (GM Financial)","Bank of America","Capital One Auto Finance","CarMax Auto Finance","Chase Auto","Credit Acceptance Corp","DriveTime","Fifth Third Bank","Ford Motor Credit","Honda Financial Services","Hyundai Motor Finance","Kia Finance America","Navy Federal Credit Union","Nissan Motor Acceptance","Pentagon Federal Credit Union","Santander Consumer USA","TD Auto Finance","Toyota Financial Services","US Bank"].map(l => <option key={l} value={l}>{l}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </F>
                  <F>
                    <Lbl t="Interest Rate" />
                    <input value={a.interestRate || ""} onChange={e => updAuto(a.id, "interestRate", e.target.value.replace(/[^0-9.]/g, ""))} onBlur={e => { let v = e.target.value.replace(/[^0-9.]/g, ""); if (v && !v.endsWith("%")) v = v + "%"; updAuto(a.id, "interestRate", v); }} style={IS} inputMode="decimal" autoComplete="new-password" data-lpignore="true" placeholder="0.00%" />
                  </F>
                </>)}
              </Row>
              {/* Row: Monthly Payment (if loan) | KBB? — always right of monthly payment */}
              <Row cols={4}>
                {a.hasLoan === "yes"
                  ? <F><Lbl t="Monthly Payment" /><input value={a.monthlyPayment || ""} onChange={e => updAuto(a.id, "monthlyPayment", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                  : <F />
                }
                <F>
                  <Lbl t="KBB?" />
                  <select value={a.hasKbb || ""} onChange={e => updAuto(a.id, "hasKbb", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
              </Row>
              {/* Row: KBB details if yes */}
              {a.hasKbb === "yes" && (
                <Row cols={4}>
                  <F>
                    <Lbl t="Mileage" />
                    <input value={a.kbbMileage || ""} onChange={e => updAuto(a.id, "kbbMileage", e.target.value.replace(/\D/g, ""))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="e.g. 45000" />
                  </F>
                  <F>
                    <Lbl t="Condition" />
                    <select value={a.kbbCondition || ""} onChange={e => updAuto(a.id, "kbbCondition", e.target.value)} style={IS}>
                      <option value="">— Select —</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </F>
                  <F>
                    <Lbl t="Open KBB" />
                    <button type="button" onClick={() => {
                      const make = (a.make || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                      const model = (a.model || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                      const year = a.year || "";
                      const mileage = a.kbbMileage || "";
                      const condition = (a.kbbCondition || "").toLowerCase().replace(/\s+/g, "-");
                      let url = "https://www.kbb.com/" + make + "/" + model + "/" + year + "/";
                      if (mileage) url += "?mileage=" + mileage;
                      if (condition) url += (mileage ? "&" : "?") + "condition=" + condition;
                      window.open(url, "_blank");
                    }} style={{ ...IS, cursor: "pointer", textAlign: "center", background: "#003087", color: "#fff", fontWeight: "bold", border: "none", borderRadius: 6 }}>
                      Open KBB ↗
                    </button>
                  </F>
                </Row>
              )}
            </div>
          ))}
          <button onClick={addAuto} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Vehicle
          </button>
          <FileUpload section="autos" files={uploads.autos || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        {/* ── DEBT / LIABILITIES ── */}
        <Panel title="Debt / Liabilities" id="section-debts">
          {(() => {
            const pd = v => parseInt((v || "").replace(/[^0-9]/g, "") || 0);
            const rows = [];
            if (pd(homeOwnership.mortgageBalance)) rows.push(["Mortgage — Personal Residence", homeOwnership.mortgageCompany || "—", homeOwnership.mortgageBalance, homeOwnership.monthlyPayment || "—"]);
            realEstate.forEach((r, i) => { if (pd(r.mortgageBalance)) rows.push([`Mortgage — Property ${i + 1}${r.description ? " (" + r.description + ")" : ""}`, r.mortgageCompany === "__other__" ? "—" : (r.mortgageCompany || "—"), r.mortgageBalance, r.monthlyPmt || "—"]); });
            autos.forEach((a, i) => { if (pd(a.loanBalance)) rows.push([`Auto Loan — ${[a.year, a.make, a.model].filter(Boolean).join(" ") || "Vehicle " + (i + 1)}`, a.lender || "—", a.loanBalance, a.monthlyPayment || "—"]); });
            businesses.forEach((b, i) => { if (pd(b.loanBalance)) rows.push([`${b.loanType || "Business Loan"} — ${b.name || "Business " + (i + 1)}`, b.loanLender || "—", b.loanBalance, b.loanPayment || "—"]); });
            const monthlyTotal = rows.reduce((t, r) => t + pd(r[3]), 0) + debts.reduce((t, d) => t + pd(d.monthlyPayment), 0);
            const loanTotal = rows.reduce((t, r) => t + pd(r[2]), 0) + debts.reduce((t, d) => t + pd(d.balance), 0);
            return rows.length > 0 ? (
              <div style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 8, padding: "10px 18px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Pulled from Real Estate, Automobiles & Business Assets</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 14, fontSize: 11, fontWeight: 700, color: MUTED, padding: "2px 0 4px", borderBottom: "1px solid " + BORDER }}>
                  <span style={{ flex: "1 1 240px" }}>Debt</span>
                  <span style={{ flex: "1 1 160px" }}>Lender</span>
                  <span style={{ width: 110, textAlign: "right", lineHeight: 1.2 }}>Monthly<br/>Obligation</span>
                  <span style={{ width: 120, textAlign: "right", lineHeight: 1.2 }}>Total<br/>Loan Value</span>
                </div>
                {rows.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: INK, padding: "4px 0", borderBottom: "1px solid " + BORDER }}>
                    <span style={{ flex: "1 1 240px", fontWeight: 600 }}>{r[0]}</span>
                    <span style={{ flex: "1 1 160px" }}>{r[1]}</span>
                    <span style={{ width: 110, textAlign: "right" }}>{pd(r[3]) ? r[3] : "—"}</span>
                    <span style={{ width: 120, textAlign: "right" }}>{r[2]}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13.5, fontWeight: 700, color: INK, padding: "6px 0 2px" }}>
                  <span style={{ flex: "1 1 240px" }}>Totals (incl. debts below)</span>
                  <span style={{ flex: "1 1 160px" }} />
                  <span style={{ width: 110, textAlign: "right" }}>${monthlyTotal.toLocaleString()}</span>
                  <span style={{ width: 120, textAlign: "right", color: "#b3261e" }}>${loanTotal.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 12 }}>No mortgages or auto loans entered yet — they appear here automatically.</div>
            );
          })()}
          {debts.map((d, i) => (
            <div key={d.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Debt {i + 1}</div>
                <button onClick={() => showConfirm("Remove this debt?", () => setDebts(p => p.filter(x => x.id !== d.id)), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Type of Debt" />
                  <select data-lpignore="true" value={d.type || ""} onChange={e => setDebts(p => p.map(x => x.id === d.id ? { ...x, type: e.target.value } : x))} style={{ ...IS, width: 155 }}>
                    <option value="">— Select —</option>
                    <option>Mortgage</option>
                    <option>Home Equity Loan</option>
                    <option>HELOC</option>
                    <option>Credit Card</option>
                    <option>Auto Loan</option>
                    <option>Student Loan</option>
                    <option>Business Loan</option>
                    <option>Personal Loan</option>
                    <option>Line of Credit</option>
                    <option>Medical Debt</option>
                    <option>IRS / Tax Debt</option>
                    <option>401(k) Loan</option>
                    <option>Land / Ag Loan</option>
                    <option>Equipment Loan</option>
                    <option>RV / Boat Loan</option>
                    <option>Timeshare Loan</option>
                    <option>Solar Loan</option>
                    <option>Buy Now Pay Later</option>
                    <option>Family / Private Loan</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ flex: "0 0 220px" }}>
                  <Lbl t="Lender / Description" />
                  <SmartCombo
                    value={d.lender || ""}
                    options={allLenders}
                    onChange={v => setDebts(p => p.map(x => x.id === d.id ? { ...x, lender: v } : x))}
                    onBlur={v => addCustomLender(v)}
                    style={{ ...IS, width: 220 }}
                    placeholder="Type or select lender"
                  />
                </div>
                <F style={{ flex: "0 0 140px" }}><Lbl t="Balance" /><input value={d.balance || ""} onChange={e => setDebts(p => p.map(x => x.id === d.id ? { ...x, balance: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                <F style={{ flex: "0 0 140px" }}><Lbl t="Monthly Payment" /><input value={d.monthlyPayment || ""} onChange={e => setDebts(p => p.map(x => x.id === d.id ? { ...x, monthlyPayment: fmtDollar(e.target.value) } : x))} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                <F style={{ flex: "0 0 110px" }}><Lbl t="Interest Rate" /><input value={d.interestRate || ""} onChange={e => setDebts(p => p.map(x => x.id === d.id ? { ...x, interestRate: e.target.value.replace(/[^0-9.]/g, "") } : x))} onBlur={e => { const v = e.target.value.replace(/[^0-9.]/g, ""); setDebts(p => p.map(x => x.id === d.id ? { ...x, interestRate: v ? v + "%" : "" } : x)); }} onFocus={e => { const v = (e.target.value || "").replace("%", ""); setDebts(p => p.map(x => x.id === d.id ? { ...x, interestRate: v } : x)); }} style={{ ...IS, width: 110 }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
              </div>
            </div>
          ))}
          <button onClick={() => setDebts(p => [...p, { ...emptyDebt, id: Date.now() }])} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Debt
          </button>
        </Panel>

        {/* ── LIFE INSURANCE ── */}
        <Panel title="Life Insurance" id="section-life">
          {lifePolicies.map((p, i) => (
            <div key={p.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Policy {i + 1}</div>
                <button onClick={() => showConfirm("Remove this policy?", () => delLife(p.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Insured" />
                  <select data-lpignore="true" value={p.insured || ""} onChange={e => updLife(p.id, "insured", e.target.value)} style={{ ...IS, width: "auto", minWidth: 170 }}>
                    <option value="">— Select —</option>
                    <option value={[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}>{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    {["married","domestic_partner"].includes(hasSpouse) && (
                      <option value={[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}>{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                    )}
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Owner" />
                  <select data-lpignore="true" value={p.owner || ""} onChange={e => updLife(p.id, "owner", e.target.value)} style={{ ...IS, width: "auto", minWidth: 170 }}>
                    <option value="">— Select —</option>
                    <option value={[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}>{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                    {["married","domestic_partner"].includes(hasSpouse) && (
                      <option value={[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}>{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                    )}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flex: "0 0 260px" }}>
                  <Lbl t="Carrier" />
                  <select value={p.carrier} onChange={e => updLife(p.id, "carrier", e.target.value)} style={{ ...IS, width: 260 }}>
                    <option value="">— Select Carrier —</option>
                    {LIFE_CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: "0 0 250px" }}>
                  <Lbl t="Policy Type" />
                  <select value={p.policyType} onChange={e => updLife(p.id, "policyType", e.target.value)} style={{ ...IS, width: 250 }}>
                    <option value="">— Select —</option>
                    <option value="Term">Term</option>
                    <option value="Whole Life">Whole Life</option>
                    <option value="Universal Life">Universal Life (UL)</option>
                    <option value="Indexed Universal Life">Indexed Universal Life (IUL)</option>
                    <option value="Variable Universal Life">Variable Universal Life (VUL)</option>
                    <option value="Variable Life">Variable Life (VL)</option>
                    <option value="Guaranteed UL">Guaranteed Universal Life (GUL)</option>
                    <option value="Final Expense">Final Expense</option>
                    <option value="Group Life">Group / Employer Life</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {p.policyType === "Term" && (
                  <div style={{ flex: "0 0 130px" }}>
                    <Lbl t="Length of Term" />
                    <select value={p.termLength || ""} onChange={e => updLife(p.id, "termLength", e.target.value)} style={{ ...IS, width: 130 }}>
                      <option value="">— Select —</option>
                      <option value="5">5 Years</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="25">25 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                  </div>
                )}
              </div>
              <Row cols={4}>
                <F><Lbl t="Death Benefit" /><input value={p.deathBenefit} onChange={e => updLife(p.id, "deathBenefit", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Cash Value" /><input value={p.cashValue} onChange={e => updLife(p.id, "cashValue", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="If applicable" /></F>
                <F><Lbl t="Surrender Value" /><input value={p.surrender} onChange={e => updLife(p.id, "surrender", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="If applicable" /></F>
              </Row>
              <Row cols={3}>
                <F><Lbl t="Premium Amount" /><input value={p.premiumAmount} onChange={e => updLife(p.id, "premiumAmount", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Premium Frequency" />
                  <select value={p.premiumFrequency || "monthly"} onChange={e => updLife(p.id, "premiumFrequency", e.target.value)} style={IS}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semiannually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </F>
              </Row>
              <Row cols={3}>
                <F><Lbl t="Policy Number" /><input value={p.policyNumber} onChange={e => updLife(p.id, "policyNumber", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><DatePicker label="Issue Date" value={p.issueDate} onChange={v => updLife(p.id, "issueDate", v)} /></F>
              </Row>
            </div>
          ))}
          <button onClick={addLife} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Policy
          </button>
          <FileUpload section="lifeInsurance" files={uploads.lifeInsurance || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        <Panel title="Net Worth, Portfolio Breakdown & Balance Sheet" id="section-networth">
          <Sec t="Net Worth Summary" />
          {(() => {
            const pd = v => parseInt((v || "").replace(/[^0-9]/g, "") || 0);
            const acctTotal = accounts.reduce((t, a) => t + pd(a.balance), 0);
            const reTotal = realEstate.reduce((t, r) => t + pd(r.marketValue), 0) + pd(homeOwnership.marketValue);
            const autoTotal = autos.reduce((t, a) => t + pd(a.value), 0);
            const assets = acctTotal + reTotal + autoTotal;
            const liabilities = pd(homeOwnership.mortgageBalance)
              + realEstate.reduce((t, r) => t + pd(r.mortgageBalance), 0)
              + autos.reduce((t, a) => t + pd(a.loanBalance), 0)
              + debts.reduce((t, d) => t + pd(d.balance), 0)
              + businesses.reduce((t, b) => t + pd(b.loanBalance), 0);
            const netWorth = assets - liabilities;
            const NONLIQUID = new Set(["Annuity (Fixed)","Annuity (Fixed Indexed)","Annuity (Variable)","Annuity (RILA)","Pension / Defined Benefit","Personal Residence","Rental Property","Land / Lot","Private Equity","Oil & Gas","Storage Funds","LLC Interest","Partnership Interest","Corporate Shares","Life Insurance (Cash Value)","Vehicle","Collectibles","Jewelry"]);
            const liquid = accounts.reduce((t, a) => t + ((NONLIQUID.has(a.type) || (a.investmentType || "").includes("Annuity") || ["Alternative Investments","Private Equity","Oil & Gas"].includes(a.investmentType)) ? 0 : pd(a.balance)), 0);
            const primaryEquity = (pd(homeOwnership.marketValue) ? pd(homeOwnership.marketValue) - pd(homeOwnership.mortgageBalance) : 0) + realEstate.filter(r => (r.description || "").toLowerCase().includes("personal residence")).reduce((t, r) => t + (pd(r.marketValue) - pd(r.mortgageBalance)), 0);
            const lessResidence = netWorth - primaryEquity;
            const Box = ({ label, val, accent }) => (
              <F>
                <Lbl t={label} />
                <div style={{ ...IS, fontWeight: 700, display: "flex", alignItems: "center", background: accent ? "#e8f0fb" : "#f2f4f7", color: INK }}>
                  {val !== 0 || assets || liabilities ? "$" + val.toLocaleString() : "—"}
                </div>
              </F>
            );
            return (<>
              <Row cols={3}>
                <Box label="Total Assets" val={assets} />
                <Box label="Total Liabilities" val={liabilities} />
                <Box label="Estimated Net Worth" val={netWorth} accent />
              </Row>
              <Row cols={3}>
                <Box label="Liquid Net Worth" val={liquid} />
                <Box label="Net Worth - Less Residence" val={lessResidence} />
                <Box label="Primary Residence Equity" val={primaryEquity} />
              </Row>
            </>);
          })()}

          <Sec t="Portfolio Breakdown" />
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Total investable assets by category.</div>
          {(() => {
            const pd = v => parseInt((v || "").replace(/[^0-9]/g, "") || 0);
            const CASH = new Set(["Checking","Savings","Money Market","CD"]);
            const QUAL = new Set(["Traditional IRA","Roth IRA","401(k)","Roth 401(k)","403(b)","457(b)","SEP IRA","SIMPLE IRA","HSA","529 / Education","Pension / Defined Benefit"]);
            const CVLI = new Set(["Life Insurance (Cash Value)"]);
            const ALTS = new Set(["Private Equity","REITs","Oil & Gas","Storage Funds","LLC Interest","Partnership Interest","Corporate Shares","Personal Residence","Rental Property","Land / Lot","Vehicle","Collectibles","Jewelry"]);
            const isAnnuity = t => (t || "").startsWith("Annuity");
            const sums = { cash: 0, qual: 0, nonqual: 0, ann: 0, cvli: 0, alts: 0 };
            accounts.forEach(a => {
              const bal = pd(a.balance);
              if (!bal) return;
              const t = a.type || "";
              const iv = a.investmentType || "";
              if (CASH.has(t) || ["CDs","Money Market","Cash"].includes(iv)) sums.cash += bal;
              else if (isAnnuity(t) || iv.includes("Annuity")) sums.ann += bal;
              else if (CVLI.has(t)) sums.cvli += bal;
              else if (ALTS.has(t) || ["REITs","Alternative Investments","Private Equity","Oil & Gas"].includes(iv)) sums.alts += bal;
              else if (QUAL.has(t) || a.qualified === "Qualified") sums.qual += bal;
              else sums.nonqual += bal;
            });
            sums.cvli += lifePolicies.reduce((t, lp) => t + pd(lp.cashValue), 0);
            const cats = [
              ["Cash (Checking, Savings, Money Market, CDs)", sums.cash],
              ["Qualified Plans (401k, IRA, Roth, etc.)", sums.qual],
              ["Non-Qualified / Taxable", sums.nonqual],
              ["Annuities (Fixed, Indexed, Variable, RILA)", sums.ann],
              ["Cash Value Life Insurance", sums.cvli],
              ["Alternative / Illiquid Investments", sums.alts],
            ];
            return (
              <Row cols={2}>
                {cats.map(([label, val]) => (
                  <F key={label}>
                    <Lbl t={label} />
                    <div style={{ ...IS, background: "#f2f4f7", fontWeight: 700, display: "flex", alignItems: "center" }}>
                      {val ? "$" + val.toLocaleString() : "—"}
                    </div>
                  </F>
                ))}
              </Row>
            );
          })()}

          <Sec t="Balance Sheet Notes" />
          <Row cols={1}>
            <F><Lbl t="Additional Notes / Observations" /><textarea value={nwState.notes || ""} onChange={e => setNwState(p => ({ ...p, notes: e.target.value }))} style={{ ...IS, minHeight: 90, resize: "vertical" }} placeholder="Any context, caveats, or observations about this client's balance sheet..." /></F>
          </Row>
        </Panel>

        {/* ── WILLS & TRUST ── */}
        <Panel title="Wills & Trust" id="section-wills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Will?" />
              <select data-lpignore="true" value={willsTrust.hasWillDoc || ""} onChange={e => setWillsTrust(p => ({ ...p, hasWillDoc: e.target.value || null }))} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Trust?" />
              <select data-lpignore="true" value={willsTrust.hasTrustDoc || ""} onChange={e => setWillsTrust(p => ({ ...p, hasTrustDoc: e.target.value || null }))} style={{ ...IS, width: 114 }}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {willsTrust.hasTrustDoc === "yes" && (
              <div style={{ flexShrink: 0 }}>
                <Lbl t="Type of Trust?" />
                <select data-lpignore="true" value={willsTrust.trustType || ""} onChange={e => setWillsTrust(p => ({ ...p, trustType: e.target.value }))} style={{ ...IS, width: 305 }}>
                  <option value="">— Select —</option>
                  <option>Revocable Living Trust</option>
                  <option>AB Trust</option>
                  <option>Irrevocable Trust</option>
                  <option>Irrevocable Life Insurance Trust (ILIT)</option>
                  <option>Charitable Remainder Trust</option>
                  <option>Charitable Lead Trust</option>
                  <option>Special Needs Trust</option>
                  <option>Spendthrift Trust</option>
                  <option>Qualified Personal Residence Trust</option>
                  <option>Grantor Retained Annuity Trust (GRAT)</option>
                  <option>Dynasty Trust</option>
                  <option>Testamentary Trust</option>
                  <option>QTIP Trust</option>
                  <option>Land Trust</option>
                  <option>Family Trust</option>
                  <option>Other</option>
                </select>
              </div>
            )}
          </div>
          {(willsTrust.hasWillDoc === "yes" || willsTrust.hasTrustDoc === "yes") && (
            <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 16 }}>
              {willsTrust.hasWillDoc === "yes" && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Will Details</div>
                  <Row cols={2}>
                    <F><DatePicker label="Date Will Was Executed" value={willsTrust.willDate} onChange={v => setWillsTrust(p => ({ ...p, willDate: v }))} /></F>
                    <F><Lbl t="Attorney / Firm" /><input value={willsTrust.willAttorney} onChange={e => setWillsTrust(p => ({ ...p, willAttorney: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                    <F style={{ flex: "0 0 280px" }}><Lbl t="Executor / Executrix" /><input value={willsTrust.executor} onChange={e => setWillsTrust(p => ({ ...p, executor: e.target.value }))} style={{ ...IS, width: 280 }} autoComplete="new-password" data-lpignore="true" /></F>
                    <F style={{ flex: "0 0 280px" }}><Lbl t="Alternate Executor / Executrix" /><input value={willsTrust.altExecutor} onChange={e => setWillsTrust(p => ({ ...p, altExecutor: e.target.value }))} style={{ ...IS, width: 280 }} autoComplete="new-password" data-lpignore="true" /></F>
                  </div>
                  <Lbl t="Location of Original Will" /><input value={willsTrust.willLocation} onChange={e => setWillsTrust(p => ({ ...p, willLocation: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" />
                  <Row cols={2}>
                    <F>
                      <Lbl t="Has the Will Been Updated?" />
                      <select data-lpignore="true" value={willsTrust.willUpdated || ""} onChange={e => setWillsTrust(p => ({ ...p, willUpdated: e.target.value || null }))} style={IS}>
                        <option value="">— Select —</option><option value="yes">Yes</option><option value="no">No</option>
                      </select>
                    </F>
                    {willsTrust.willUpdated === "yes" && (
                      <F><DatePicker label="Date of Most Recent Update" value={willsTrust.willUpdateDate} onChange={v => setWillsTrust(p => ({ ...p, willUpdateDate: v }))} /></F>
                    )}
                  </Row>
                  <Lbl t="Notes / Additional Details" />
                  <textarea data-lpignore="true" value={willsTrust.willNotes} onChange={e => setWillsTrust(p => ({ ...p, willNotes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
                </>
              )}
              {willsTrust.hasTrustDoc === "yes" && (
                <div style={{ marginTop: willsTrust.hasWillDoc === "yes" ? 20 : 0, borderTop: willsTrust.hasWillDoc === "yes" ? "1px solid " + BORDER : "none", paddingTop: willsTrust.hasWillDoc === "yes" ? 16 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Trust Details</div>
                  <Row cols={2}>
                    <F><Lbl t="Name of Trust" /><input value={willsTrust.trustName} onChange={e => setWillsTrust(p => ({ ...p, trustName: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F>
                      <Lbl t="Type of Trust" />
                      <select data-lpignore="true" value={willsTrust.trustType || ""} onChange={e => setWillsTrust(p => ({ ...p, trustType: e.target.value || null }))} style={IS}>
                        <option value="">— Select —</option>
                        <option>Revocable Living Trust</option><option>Irrevocable Trust</option><option>Testamentary Trust</option>
                        <option>Special Needs Trust</option><option>Charitable Trust</option><option>Spendthrift Trust</option><option>Other</option>
                      </select>
                    </F>
                  </Row>
                  <Row cols={2}>
                    <F><DatePicker label="Date Established" value={willsTrust.trustDate} onChange={v => setWillsTrust(p => ({ ...p, trustDate: v }))} /></F>
                    <F><Lbl t="Attorney / Firm" /><input value={willsTrust.trustAttorney} onChange={e => setWillsTrust(p => ({ ...p, trustAttorney: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={2}>
                    <F><Lbl t="Trustee" /><input value={willsTrust.trustee} onChange={e => setWillsTrust(p => ({ ...p, trustee: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Successor Trustee" /><input value={willsTrust.successorTrustee} onChange={e => setWillsTrust(p => ({ ...p, successorTrustee: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={2}>
                    <F>
                      <Lbl t="Assets Titled in Trust?" />
                      <select data-lpignore="true" value={willsTrust.assetsTitled || ""} onChange={e => setWillsTrust(p => ({ ...p, assetsTitled: e.target.value || null }))} style={IS}>
                        <option value="">— Select —</option><option value="yes">Yes</option><option value="no">No</option><option value="partial">Partially</option>
                      </select>
                    </F>
                    <F><Lbl t="Location of Trust Documents" /><input value={willsTrust.trustLocation} onChange={e => setWillsTrust(p => ({ ...p, trustLocation: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Lbl t="Notes / Additional Details" />
                  <textarea data-lpignore="true" value={willsTrust.trustNotes} onChange={e => setWillsTrust(p => ({ ...p, trustNotes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
                </div>
              )}
            </div>
          )}
          {poas.map((poa, poaIdx) => (
            <div key={poa.id} style={{ marginTop: 20, borderTop: "1px solid " + BORDER, paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Power of Attorney{poas.length > 1 ? ` ${poaIdx + 1}` : ""}</div>
                {poas.length > 1 && (
                  <button onClick={() => delPoa(poa.id)} style={{ background: "none", border: "none", color: DANGER, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "2px 6px" }}>Remove</button>
                )}
              </div>
              <Row cols={2}>
                <F>
                  <Lbl t="Has POA?" />
                  <select data-lpignore="true" value={poa.hasPOA || ""} onChange={e => updPoa(poa.id, "hasPOA", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                <F>
                  <Lbl t="Type of POA" />
                  <select data-lpignore="true" value={poa.poaType || ""} onChange={e => updPoa(poa.id, "poaType", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option>Durable Power of Attorney</option><option>Financial Power of Attorney</option>
                    <option>Healthcare / Medical POA</option><option>Limited Power of Attorney</option><option>Springing Power of Attorney</option>
                  </select>
                </F>
              </Row>
              {poa.hasPOA === "yes" && (<>
                <Row cols={2}>
                  <F><Lbl t="Agent (Attorney-in-Fact)" /><input value={poa.agentName} onChange={e => updPoa(poa.id, "agentName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  <F>
                    <Lbl t="Agent's Relationship" />
                    <select data-lpignore="true" value={poa.agentRelationship || ""} onChange={e => updPoa(poa.id, "agentRelationship", e.target.value || null)} style={IS}>
                      <option value="">— Select —</option>
                      {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </F>
                </Row>
                <Row cols={2}>
                  <F><Lbl t="Agent's Phone" /><input value={poa.agentPhone} onChange={e => updPoa(poa.id, "agentPhone", fmtPhone(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                  <F><Lbl t="Alternate Agent" /><input value={poa.altAgent} onChange={e => updPoa(poa.id, "altAgent", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                </Row>
                <Row cols={2}>
                  <F><DatePicker label="Date POA Was Executed" value={poa.poaDate} onChange={v => updPoa(poa.id, "poaDate", v)} /></F>
                  <F><Lbl t="Attorney / Firm" /><input value={poa.poaAttorney} onChange={e => updPoa(poa.id, "poaAttorney", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                </Row>
                <Lbl t="Location of POA Documents" /><input value={poa.poaLocation} onChange={e => updPoa(poa.id, "poaLocation", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" />
                <Lbl t="Notes / Additional Details" />
                <textarea data-lpignore="true" value={poa.poaNotes} onChange={e => updPoa(poa.id, "poaNotes", e.target.value)} rows={3} style={{ ...IS, resize: "vertical" }} />
              </>)}
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <button onClick={addPoa} style={{ background: "none", border: "1px dashed " + BORDER, borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: BRAND_NAVY, cursor: "pointer" }}>+ Add Another POA</button>
          </div>
          <FileUpload section="wills" files={uploads.wills || []} onChange={handleUploadChange}  onConfirm={showConfirm}/>
        </Panel>

        <Panel title="Estate Planning" id="section-inheritance">
          {inheritances.map((inh, i) => (
            <div key={inh.id} style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Inheritance {i + 1}</div>
                {inheritances.length > 1 && <button onClick={() => showConfirm("Remove this inheritance record?", () => delInh(inh.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13 }}>Remove</button>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Inheritance?" />
                  <select value={inh.expectsInheritance} onChange={e => updInh(inh.id, "expectsInheritance", e.target.value)} style={{ ...IS, width: 124 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="possibly">Possibly</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <F style={{ flex: "0 0 128px" }}><Lbl t="Estimated Value" /><input value={inh.estValue} onChange={e => updInh(inh.id, "estValue", fmtDollar(e.target.value))} style={{ ...IS, width: 128 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" className="dark-ph" /></F>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Anticipated Timeline" />
                  <select value={inh.timeline} onChange={e => updInh(inh.id, "timeline", e.target.value)} style={{ ...IS, width: 134 }}>
                    <option value="">— Select —</option>
                    <option value="0-2 years">0 – 2 Years</option>
                    <option value="3-5 years">3 – 5 Years</option>
                    <option value="6-10 years">6 – 10 Years</option>
                    <option value="10+ years">10+ Years</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Source of Inheritance" />
                  <select value={inh.source} onChange={e => updInh(inh.id, "source", e.target.value)} style={{ ...IS, width: 208 }}>
                    <option value="">— Select —</option>
                    <option value="parents_estate">Parents' Estate</option>
                    <option value="grandparents_estate">Grandparents' Estate</option>
                    <option value="other_relatives">Other Relatives</option>
                    <option value="trust">Existing Trust</option>
                    <option value="multiple">Multiple Sources</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <F style={{ flex: "1 1 480px" }}><Lbl t="Source Details / Name(s)" /><input value={inh.sourceDetails || ""} onChange={e => updInh(inh.id, "sourceDetails", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="e.g. Mother's estate, John Smith Trust" /></F>
              </div>

              <Sec t="Family Structure" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Number of Siblings" />
                  <select value={inh.numberOfSiblings} onChange={e => updInh(inh.id, "numberOfSiblings", e.target.value)} style={{ ...IS, width: 150 }}>
                    <option value="">— Select —</option>
                    <option value="0">0 — Only Child</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6+">6 or More</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Siblings Involved in Estate?" />
                  <select value={inh.siblingsInvolved} onChange={e => updInh(inh.id, "siblingsInvolved", e.target.value)} style={{ ...IS, width: 225 }}>
                    <option value="">— Select —</option>
                    <option value="yes_equal">Yes — Equal Split</option>
                    <option value="yes_unequal">Yes — Unequal Split</option>
                    <option value="no">No — Client is Sole Heir</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Family Conflicts / Disputes?" />
                  <select value={inh.familyConflicts} onChange={e => updInh(inh.id, "familyConflicts", e.target.value)} style={{ ...IS, width: 190 }}>
                    <option value="">— Select —</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="potential">Potential / Uncertain</option>
                  </select>
                </div>
              </div>
              {(inh.familyConflicts === "yes" || inh.familyConflicts === "potential") && (
                <Row cols={1}>
                  <F><Lbl t="Conflict Details" /><textarea value={inh.conflictDetails} onChange={e => updInh(inh.id, "conflictDetails", e.target.value)} style={{ ...IS, minHeight: 70, resize: "vertical" }} placeholder="Describe any known family disputes, contested wills, or relationship concerns..." /></F>
                </Row>
              )}

              <Sec t="Special Needs & Care Considerations" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Family Members / Special Needs" />
                  <select value={inh.specialNeedsFamily} onChange={e => updInh(inh.id, "specialNeedsFamily", e.target.value)} style={{ ...IS, width: 185 }}>
                    <option value="">— Select —</option>
                    <option value="no">No</option>
                    <option value="yes_child">Yes — Child</option>
                    <option value="yes_sibling">Yes — Sibling</option>
                    <option value="yes_parent">Yes — Parent</option>
                    <option value="yes_other">Yes — Other Relative</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Special Needs Trust in Place?" />
                  <select value={inh.specialNeedsTrust || ""} onChange={e => updInh(inh.id, "specialNeedsTrust", e.target.value)} style={{ ...IS, width: 170 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="needed">No — But Needed</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
              </div>
              {inh.specialNeedsFamily && inh.specialNeedsFamily !== "no" && (
                <Row cols={1}>
                  <F><Lbl t="Special Needs Details" /><textarea value={inh.specialNeedsDetails} onChange={e => updInh(inh.id, "specialNeedsDetails", e.target.value)} style={{ ...IS, minHeight: 70, resize: "vertical" }} placeholder="Describe the situation, any government benefits at risk, care requirements, etc." /></F>
                </Row>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Nursing Care / Long-Term Care?" />
                  <select value={inh.nursingCare} onChange={e => updInh(inh.id, "nursingCare", e.target.value)} style={{ ...IS, width: 290 }}>
                    <option value="">— Select —</option>
                    <option value="no">No</option>
                    <option value="yes_parent">Yes — Parent(s) in or nearing care</option>
                    <option value="yes_spouse">Yes — Spouse</option>
                    <option value="yes_self">Yes — Client (self)</option>
                    <option value="yes_other">Yes — Other Family Member</option>
                    <option value="future_concern">Future Concern / Planning Needed</option>
                  </select>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Long-Term Care Insurance in Place?" />
                  <select value={inh.ltcInsurance || ""} onChange={e => updInh(inh.id, "ltcInsurance", e.target.value)} style={{ ...IS, width: 245 }}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="partial">Partial / Being Arranged</option>
                    <option value="self_fund">Self-Funding / No Insurance</option>
                  </select>
                </div>
              </div>
              {inh.nursingCare && inh.nursingCare !== "no" && (
                <Row cols={1}>
                  <F><Lbl t="Care Details / Facility / Cost Concerns" /><textarea value={inh.nursingCareDetails} onChange={e => updInh(inh.id, "nursingCareDetails", e.target.value)} style={{ ...IS, minHeight: 70, resize: "vertical" }} placeholder="Describe care situation, estimated costs, facility name, Medicaid planning concerns, etc." /></F>
                </Row>
              )}

              <Sec t="Estate & Charitable Planning" />
              <Row cols={2}>
                <F>
                  <Lbl t="Documents in Place?" />
                  <select value={inh.estatePlanning} onChange={e => updInh(inh.id, "estatePlanning", e.target.value)} style={{ ...IS, width: 228 }}>
                    <option value="">— Select —</option>
                    <option value="yes_complete">Yes — Complete</option>
                    <option value="yes_partial">Yes — Partial / Outdated</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </F>
                <F>
                  <Lbl t="Trustee / Executor Arrangements" />
                  <select value={inh.trusteeArrangements} onChange={e => updInh(inh.id, "trusteeArrangements", e.target.value)} style={{ ...IS, width: 282 }}>
                    <option value="">— Select —</option>
                    <option value="client_is_executor">Client is Executor / Trustee</option>
                    <option value="professional">Professional / Corporate Trustee</option>
                    <option value="family_member">Family Member</option>
                    <option value="not_established">Not Yet Established</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </F>
              </Row>
              <Row cols={2}>
                <F>
                  <Lbl t="Charitable Giving Intent?" />
                  <select value={inh.charitableIntent} onChange={e => updInh(inh.id, "charitableIntent", e.target.value)} style={{ ...IS, width: 288 }}>
                    <option value="">— Select —</option>
                    <option value="no">No</option>
                    <option value="yes_donor_advised">Yes — Donor Advised Fund</option>
                    <option value="yes_direct">Yes — Direct Gifts</option>
                    <option value="yes_bequest">Yes — Charitable Bequest</option>
                    <option value="yes_crt">Yes — Charitable Remainder Trust</option>
                    <option value="considering">Considering / Open to It</option>
                  </select>
                </F>
                <F><Lbl t="Charitable Details / Organizations" /><input value={inh.charitableDetails} onChange={e => updInh(inh.id, "charitableDetails", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="Names of organizations, causes, or giving vehicles" /></F>
              </Row>

              <Sec t="Additional Notes" />
              <Row cols={1}>
                <F><Lbl t="Other Inheritance / Estate Notes" /><textarea value={inh.additionalNotes} onChange={e => updInh(inh.id, "additionalNotes", e.target.value)} style={{ ...IS, minHeight: 90, resize: "vertical" }} placeholder="Any other relevant details about expected inheritance, family dynamics, or planning considerations..." /></F>
              </Row>
            </div>
          ))}
          <button onClick={addInh} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", width: "100%" }}>
            + Add Inheritance
          </button>
        </Panel>




        <Panel title="Alerts" id="section-alerts">
          {(() => {
            const today = new Date();
            today.setHours(0,0,0,0);
            const hasSpouseRecord = ["married","domestic_partner"].includes(hasSpouse);
            const alerts = [];

            const parseDate = (str) => {
              if (!str) return null;
              const [m, d, y] = str.split("/").map(Number);
              if (!m || !d || !y) return null;
              const dt = new Date(y, m - 1, d);
              return isNaN(dt.getTime()) ? null : dt;
            };

            const daysUntil = (dt) => Math.round((dt - today) / 86400000);

            const parseDob = (dob) => {
              const dt = parseDate(dob);
              if (!dt) return null;
              let age = today.getFullYear() - dt.getFullYear();
              const m = today.getMonth() - dt.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < dt.getDate())) age--;
              return { dt, age };
            };

            const ageUntilBirthday = (dobStr, targetAge) => {
              const info = parseDob(dobStr);
              if (!info) return null;
              const bday = new Date(info.dt);
              bday.setFullYear(today.getFullYear() + (targetAge - info.age));
              if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
              return daysUntil(bday);
            };

            // ID / Document expiry alerts
            const checkIdExpiry = (person, personLabel, idType, dlExpDate) => {
              const exp = parseDate(dlExpDate);
              if (!exp) return;
              const days = daysUntil(exp);
              const label = idType || "Driver's License";
              if (days < 0) {
                alerts.push({ sev: "danger", title: `${personLabel} — ${label} Expired`, body: `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago on ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}.` });
              } else if (days <= 30) {
                alerts.push({ sev: "danger", title: `${personLabel} — ${label} Expiring in ${days} Day${days !== 1 ? "s" : ""}`, body: `Expires ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}. Renew immediately.` });
              } else if (days <= 90) {
                alerts.push({ sev: "warning", title: `${personLabel} — ${label} Expiring Soon`, body: `Expires in ${days} days on ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}.` });
              } else if (days <= 180) {
                alerts.push({ sev: "info", title: `${personLabel} — ${label} Expiring in 6 Months`, body: `Expires ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} (${days} days away).` });
              }
            };

            checkIdExpiry(client, client.firstName || "Client", client.idType, client.dlExpDate);
            if (hasSpouseRecord) checkIdExpiry(spouse, spouse.firstName || "Spouse", spouse.idType, spouse.dlExpDate);

            // RMD alerts — RMD age is 73 (SECURE 2.0 Act)
            const RMD_AGE = 73;
            const checkRmd = (personLabel, dob) => {
              const info = parseDob(dob);
              if (!info) return;
              const { age } = info;
              if (age >= RMD_AGE) {
                alerts.push({ sev: "danger", title: `${personLabel} — RMD Required`, body: `Age ${age} — Required Minimum Distributions must be taken annually. First RMD deadline was April 1 of the year after turning ${RMD_AGE}.` });
              } else if (age === RMD_AGE - 1) {
                const daysToRmd = ageUntilBirthday(dob, RMD_AGE);
                alerts.push({ sev: "warning", title: `${personLabel} — RMD Beginning in ${daysToRmd !== null ? daysToRmd + " Days" : "Less Than 1 Year"}`, body: `Turns ${RMD_AGE} in ${daysToRmd !== null ? daysToRmd + " days" : "under a year"}. First RMD must be taken by April 1 of the following year. Begin planning now.` });
              } else if (age >= RMD_AGE - 2) {
                const daysToRmd = ageUntilBirthday(dob, RMD_AGE);
                alerts.push({ sev: "info", title: `${personLabel} — RMD Approaching (Age ${age})`, body: `RMD begins at age ${RMD_AGE} — approximately ${daysToRmd !== null ? Math.round(daysToRmd / 30) + " months" : "2 years"} away. Begin distribution planning.` });
              }
            };

            checkRmd(client.firstName || "Client", client.dob);
            if (hasSpouseRecord) checkRmd(spouse.firstName || "Spouse", spouse.dob);

            // Life insurance expiry / term alerts
            lifePolicies.forEach((p, i) => {
              if (!p.carrier && !p.policyType) return;
              const label = [p.carrier, p.policyType].filter(Boolean).join(" — ") || `Policy ${i + 1}`;
              if (p.policyType && p.policyType.toLowerCase().includes("term")) {
                const exp = parseDate(p.issueDate);
                if (!exp) return;
                // Term policies typically 10/20/30yr — just flag if no term length on file
                alerts.push({ sev: "info", title: `Term Life — ${label}`, body: `Confirm term length and expiration date. No maturity date on file for this term policy.` });
              }
            });

            // DL expiry for autos — flag if no valid DL on file
            if (autos.length > 0 && !client.dlExpDate && !client.dlNumber) {
              alerts.push({ sev: "info", title: "No Driver's License on File", body: "Client has vehicle(s) recorded but no driver's license information has been entered." });
            }

            // Advisor license renewal alerts
            const licStates = (advisorInfo.licensedStates || []).map(x => typeof x === "string" ? { state: x, renewalDate: "" } : x);
            licStates.forEach(entry => {
              const exp = parseDate(entry.renewalDate);
              if (!exp) return;
              const days = daysUntil(exp);
              const stateLabel = US_STATES.find(([a]) => a === entry.state)?.[1] || entry.state;
              const title = `Insurance License Renewal — ${entry.state}`;
              if (days < 0) {
                alerts.push({ sev: "danger", title, body: `${stateLabel} insurance license expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago on ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}. Renew immediately to stay licensed.` });
              } else if (days <= 30) {
                alerts.push({ sev: "danger", title, body: `${stateLabel} insurance license expires in ${days} day${days !== 1 ? "s" : ""} on ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}. Renew now.` });
              } else if (days <= 90) {
                alerts.push({ sev: "warning", title, body: `${stateLabel} insurance license expires in ${days} days on ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}. Begin renewal process.` });
              } else if (days <= 180) {
                alerts.push({ sev: "info", title, body: `${stateLabel} insurance license expires ${exp.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} (${days} days away). Plan renewal.` });
              }
            });

            // CE alert — fire for any state where CE is marked No
            (advisorInfo.licensedStates || []).forEach(raw => {
              const entry = typeof raw === "string" ? { state: raw } : raw;
              if (entry.ceCurrent === "No") {
                const stateLabel = US_STATES.find(([a]) => a === entry.state)?.[1] || entry.state;
                alerts.push({ sev: "warning", title: `Continuing Education Not Current — ${entry.state}`, body: `CE is marked not current for ${stateLabel}. Complete required continuing education credits to maintain licensing eligibility in this state.` });
              }
            });

            if (alerts.length === 0) {
              return (
                <div style={{ textAlign: "center", padding: "32px 16px", color: MUTED }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: SUCCESS, marginBottom: 4 }}>No Active Alerts</div>
                  <div style={{ fontSize: 13 }}>All documents are current and no upcoming deadlines detected.</div>
                </div>
              );
            }

            const sevStyle = {
              danger:  { border: "#fca5a5", bg: "#fff1f1", icon: "🔴", label: "Action Required" },
              warning: { border: "#fcd34d", bg: "#fffbeb", icon: "🟡", label: "Attention Needed" },
              info:    { border: "#93c5fd", bg: "#eff6ff", icon: "🔵", label: "Heads Up" },
            };
            const order = { danger: 0, warning: 1, info: 2 };
            const activAlerts = alerts.filter(al => !localStorage.getItem(`rwg_alert_dismissed_${al.title.replace(/\s/g,"_")}`));
            alerts.length = 0; activAlerts.forEach(a => alerts.push(a));
            alerts.sort((a, b) => order[a.sev] - order[b.sev]);

            return alerts.map((al, i) => {
              const ss = sevStyle[al.sev];
              return (
                <div key={i} style={{ border: `1px solid ${ss.border}`, background: ss.bg, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{ss.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: INK, flex: 1 }}>{al.title}</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, fontWeight: 600 }}>{ss.label}</span>
                    <button
                      onClick={() => { const k = `rwg_alert_dismissed_${al.title.replace(/\s/g,"_")}`; localStorage.setItem(k, "1"); setClient(p => ({ ...p })); }}
                      style={{ fontSize: 11, background: "#fff", border: "1px solid #d1d5db", borderRadius: 6, padding: "3px 10px", cursor: "pointer", color: MUTED, fontWeight: 500, whiteSpace: "nowrap" }}
                    >Remove</button>
                  </div>
                  <div style={{ fontSize: 13, color: "#4b5563", paddingLeft: 24 }}>{al.body}</div>
                </div>
              );
            });
          })()}
        </Panel>

        {/* ── CLIENT PREFERENCES ── */}
        <Panel title="Client Preferences" id="section-preferences">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Meeting Preference" />
              <select value={client.meetingTimePref || ""} onChange={setC("meetingTimePref")} style={{ ...IS, width: 180 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Late Afternoon</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Location Preference" />
              <select value={client.meetingLocPref || ""} onChange={setC("meetingLocPref")} style={{ ...IS, width: 180 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Office</option>
                <option>Home</option>
                <option>Restaurant</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Religious Preference" />
              <select value={client.religiousPref || ""} onChange={setC("religiousPref")} style={{ ...IS, width: 220 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Christian — Protestant</option>
                <option>Christian — Catholic</option>
                <option>Christian — Non-Dnom.</option>
                <option>Jewish</option>
                <option>Atheist / Agnostic</option>
                <option>Spiritual / Non-Religious</option>
                <option>Other</option>
                <option>Prefer Not to Say</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Political Preference" />
              <select value={client.politicalPref || ""} onChange={setC("politicalPref")} style={{ ...IS, width: 170 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Republican</option>
                <option>Democrat</option>
                <option>Independent</option>
                <option>Libertarian</option>
                <option>Green Party</option>
                <option>Other</option>
                <option>Prefer Not to Say</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Referred From" />
              <select value={client.referredFrom || ""} onChange={setC("referredFrom")} style={{ ...IS, width: 200 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Existing Client</option>
                <option>Family Member</option>
                <option>Friend / Colleague</option>
                <option>Attorney Referral</option>
                <option>CPA / Accountant Referral</option>
                <option>Social Media</option>
                <option>Website / Online Search</option>
                <option>Seminar / Event</option>
                <option>Radio / TV</option>
                <option>Print / Advertisement</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Referred By (Name)" />
              <input value={client.referredByName || ""} onChange={setC("referredByName")} style={{ ...IS, width: 200 }} placeholder="Enter name..." autoComplete="new-password" data-lpignore="true" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <DatePicker label="Date Referred" value={client.referredDate || ""} onChange={v => setClient(p => ({ ...p, referredDate: v }))} compact />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Thank You Note Sent?" />
              <select value={client.referralThankYouSent || ""} onChange={setC("referralThankYouSent")} style={{ ...IS, width: 120 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </Panel>

        {/* ── IMPORTANT DATES / INFO ── */}
        <Panel title="Important Dates / Information" id="section-importantdates">

          {/* Auto-populated birthdays */}
          <Sec t="Birthdays" />
          <div style={{ background: "#f8f9fb", border: "1px solid " + BORDER, borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
            {[
              { label: [client.firstName, client.lastName].filter(Boolean).join(" ") || "Client", dob: client.dob },
              ...(["married","domestic_partner"].includes(hasSpouse) ? [{ label: [spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse", dob: spouse.dob }] : []),
              ...children.map((ch, i) => ({ label: [ch.firstName, ch.lastName].filter(Boolean).join(" ") || `Child ${i+1}`, dob: ch.dob })),
            ].map(({ label, dob }, idx) => (
              <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: INK, minWidth: 180 }}>{label}</span>
                <span style={{ fontSize: 13, color: dob ? INK : MUTED }}>{dob || "—"}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>Populated from Client Profile &amp; Family sections</div>
          </div>

          {/* Key dates */}
          <Sec t="Key Dates" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 14, alignItems: "flex-end" }}>
            <div style={{ flexShrink: 0 }}><DatePicker label="Wedding Anniversary" value={importantDates.anniversary} onChange={v => setImportantDates(p => ({ ...p, anniversary: v }))} compact /></div>
            <div style={{ flexShrink: 0 }}><DatePicker label="First Meeting with Advisor" value={importantDates.firstMeeting} onChange={v => setImportantDates(p => ({ ...p, firstMeeting: v }))} compact /></div>
          </div>

          {/* Portfolio Reviews */}
          <Sec t="Portfolio Reviews" />
          {importantDates.portfolioReviews.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flexShrink: 0 }}><DatePicker label={`Review ${i+1} Date`} value={r.date} onChange={v => setImportantDates(p => ({ ...p, portfolioReviews: p.portfolioReviews.map((x,j) => j===i ? {...x,date:v} : x) }))} compact /></div>
              <div style={{ flex: "1 1 200px" }}>
                <Lbl t="Notes" />
                <input value={r.notes} onChange={e => setImportantDates(p => ({ ...p, portfolioReviews: p.portfolioReviews.map((x,j) => j===i ? {...x,notes:e.target.value} : x) }))} style={{ ...IS, width: "100%" }} autoComplete="off" data-lpignore="true" />
              </div>
              <button onClick={() => setImportantDates(p => ({ ...p, portfolioReviews: p.portfolioReviews.filter((_,j) => j!==i) }))} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
            </div>
          ))}
          <button onClick={() => setImportantDates(p => ({ ...p, portfolioReviews: [...p.portfolioReviews, { date:"", notes:"" }] }))} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>+ Add Portfolio Review</button>

          {/* RMDs */}
          <Sec t="RMDs" />
          {(() => {
            const rmdOwnerOptions = [
              { value: `${client.firstName} ${client.lastName}`.trim(), label: `${client.firstName} ${client.lastName}`.trim() },
              ...(hasSpouse ? [{ value: `${spouse.firstName} ${spouse.lastName}`.trim(), label: `${spouse.firstName} ${spouse.lastName}`.trim() }] : []),
            ].filter(o => o.value.trim());
            const qualAccounts = accounts.filter(a => QUAL_TYPES_M.has(a.type));
            return (
              <>
                {importantDates.rmdDates.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ flexShrink: 0 }}><DatePicker label={`RMD ${i+1} Date`} value={r.date} onChange={v => setImportantDates(p => ({ ...p, rmdDates: p.rmdDates.map((x,j) => j===i ? {...x,date:v} : x) }))} compact /></div>
                    <div style={{ flex: "0 0 160px" }}>
                      <Lbl t="Owner" />
                      <select value={r.owner || ""} onChange={e => setImportantDates(p => ({ ...p, rmdDates: p.rmdDates.map((x,j) => j===i ? {...x,owner:e.target.value} : x) }))} style={{ ...IS, width: 160 }}>
                        <option value="">— Select —</option>
                        {rmdOwnerOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: "0 0 220px" }}>
                      <Lbl t="Account" />
                      <select value={r.linkedAcctId || ""} onChange={e => setImportantDates(p => ({ ...p, rmdDates: p.rmdDates.map((x,j) => j===i ? {...x,linkedAcctId:e.target.value} : x) }))} style={{ ...IS, width: 220 }}>
                        <option value="">— Select Account —</option>
                        {qualAccounts.map(a => <option key={a.id} value={a.id}>{[a.institution, a.type, a.owner].filter(Boolean).join(" — ")}</option>)}
                      </select>
                    </div>
                    <button onClick={() => setImportantDates(p => ({ ...p, rmdDates: p.rmdDates.filter((_,j) => j!==i) }))} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
                  </div>
                ))}
                <button onClick={() => setImportantDates(p => ({ ...p, rmdDates: [...p.rmdDates, { date:"", owner:"", linkedAcctId:"" }] }))} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>+ Add RMD Date</button>
              </>
            );
          })()}

          {/* Policy & Annuity Renewal Dates */}
          <Sec t="Policy & Annuity Renewal Dates" />
          {importantDates.renewalDates.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flexShrink: 0 }}><DatePicker label={`Renewal ${i+1} Date`} value={r.date} onChange={v => setImportantDates(p => ({ ...p, renewalDates: p.renewalDates.map((x,j) => j===i ? {...x,date:v} : x) }))} compact /></div>
              <div style={{ flex: "1 1 200px" }}>
                <Lbl t="Policy / Carrier" />
                <input value={r.policy} onChange={e => setImportantDates(p => ({ ...p, renewalDates: p.renewalDates.map((x,j) => j===i ? {...x,policy:e.target.value} : x) }))} style={{ ...IS, width: "100%" }} autoComplete="off" data-lpignore="true" />
              </div>
              <button onClick={() => setImportantDates(p => ({ ...p, renewalDates: p.renewalDates.filter((_,j) => j!==i) }))} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
            </div>
          ))}
          <button onClick={() => setImportantDates(p => ({ ...p, renewalDates: [...p.renewalDates, { date:"", policy:"" }] }))} style={{ background: "transparent", border: "1.5px dashed #b8c0cb", color: INK, borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>+ Add Renewal Date</button>

          {/* Family Notes */}
          <Sec t="Family Notes" />
          <div style={{ marginBottom: 8 }}>
            <Lbl t="Notes — illnesses, updates, important family details" />
            <textarea
              value={importantDates.familyNotes}
              onChange={e => setImportantDates(p => ({ ...p, familyNotes: e.target.value }))}
              rows={6}
              style={{ ...IS, width: "100%", resize: "vertical", fontFamily: "inherit", lineHeight: 1.55 }}
              placeholder="Add any important notes about the family here — health updates, life events, unique details…"
              data-lpignore="true"
            />
          </div>

        </Panel>

        {/* ── APPLICATIONS / DOCUMENTS ── */}
        <Panel title="Applications / Documents" id="section-apps">
          {(() => {
            const CARRIERS = [
              "Allianz","Athene","American Equity","American National","Nationwide","North American",
              "Pacific Life","Protective","Prudential","Securian","Transamerica","Lincoln Financial",
              "Jackson National","John Hancock","Midland National","Minnesota Life","Mutual of Omaha",
              "Penn Mutual","Principal","Symetra","TIAA","Other",
            ];
            const PRODUCT_TYPES = [
              "Fixed Index Annuity (FIA)","Fixed Annuity","Variable Annuity","RILA",
              "Term Life Insurance","Whole Life Insurance","Universal Life Insurance","Indexed Universal Life (IUL)",
              "Disability Income","Long-Term Care","Medicare Supplement",
              "Suitability / Know Your Customer","Transfer / 1035 Exchange","Beneficiary Change",
              "Other",
            ];

            const buildClientData = () => ({
              // Identity
              firstName: client.firstName, middleName: client.middleName, lastName: client.lastName,
              dob: client.dob, ssn: client.ssn, gender: client.gender,
              // Contact
              cell: client.cell, homePhone: client.homePhone,
              email: clientEmails[0]?.address || "",
              // Address
              addressLine1: client.addressLine1, addressLine2: client.addressLine2,
              city: client.city, state: client.state, zip: client.zip,
              // Spouse
              spouseFirstName: spouse.firstName, spouseLastName: spouse.lastName,
              spouseDob: spouse.dob, spouseSsn: spouse.ssn,
              // Employment
              employer: clientEmp.employer, occupation: clientEmp.occupation,
              // Beneficiaries (primary = first child or first standalone beneficiary)
              bene1FirstName: (children.find(c => c.isBeneficiary) || beneficiaries[0])?.firstName || "",
              bene1LastName: (children.find(c => c.isBeneficiary) || beneficiaries[0])?.lastName || "",
              bene1Relationship: (children.find(c => c.isBeneficiary) ? "Child" : beneficiaries[0]?.relationship) || "",
              bene1Pct: (children.find(c => c.isBeneficiary) || beneficiaries[0])?.percentage || "",
            });

            const handleDocUpload = (e) => {
              const file = e.target.files[0];
              if (!file || file.type !== "application/pdf") return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const doc = {
                  id: Date.now(),
                  name: file.name,
                  carrier: "",
                  productType: "",
                  notes: "",
                  uploadedAt: new Date().toISOString(),
                  dataUrl: ev.target.result,
                };
                const updated = [...appDocs, doc];
                setAppDocs(updated);
                localStorage.setItem("rwg_app_docs", JSON.stringify(updated));
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            };

            const updateDoc = (id, field, value) => {
              const updated = appDocs.map(d => d.id === id ? { ...d, [field]: value } : d);
              setAppDocs(updated);
              localStorage.setItem("rwg_app_docs", JSON.stringify(updated));
            };

            const removeDoc = (id) => {
              const updated = appDocs.filter(d => d.id !== id);
              setAppDocs(updated);
              localStorage.setItem("rwg_app_docs", JSON.stringify(updated));
            };

            const fillAndDownload = async (doc) => {
              setAppFillStatus(p => ({ ...p, [doc.id]: "filling" }));
              const existingPdfBytes = await fetch(doc.dataUrl).then(r => r.arrayBuffer());
              // Some carrier PDFs (e.g. Jackson National) have malformed internal structures
              // that cause pdf-lib to throw during load. Fall back to downloading the original.
              let pdfDoc = null;
              try { pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true, throwOnInvalidObject: false }); } catch { pdfDoc = null; }
              if (!pdfDoc) {
                const blob = new Blob([existingPdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = doc.name; a.click();
                URL.revokeObjectURL(url);
                setAppFillStatus(p => ({ ...p, [doc.id]: "downloaded original (PDF not fillable)" }));
                return;
              }
              try {
                let form = null;
                try { form = pdfDoc.getForm(); } catch { form = null; }
                let fields = [];
                if (form) { try { fields = form.getFields(); } catch { fields = []; } }
                const clientData = buildClientData();

                // Common field name patterns across carriers
                const FIELD_MAP = {
                  firstName:        ["first_name","firstname","first name","fname","owner_first","applicant_first","insured_first","given_name"],
                  middleName:       ["middle_name","middlename","middle_initial","mi","mname"],
                  lastName:         ["last_name","lastname","last name","lname","owner_last","applicant_last","insured_last","surname","family_name"],
                  // dob intentionally omitted — never auto-fill dates
                  ssn:              ["ssn","social_security","social_security_number","tax_id","tin","owner_ssn","insured_ssn"],
                  gender:           ["gender","sex","owner_gender","insured_gender","applicant_sex"],
                  cell:             ["cell","cell_phone","mobile","mobile_phone","phone","phone_number","daytime_phone"],
                  homePhone:        ["home_phone","home","telephone","phone2","alt_phone"],
                  email:            ["email","email_address","e_mail","owner_email"],
                  addressLine1:     ["address","address1","street","street_address","mailing_address","owner_address","residential_address"],
                  addressLine2:     ["address2","address_line_2","apt","suite"],
                  city:             ["city","owner_city","mailing_city","applicant_city"],
                  state:            ["state","owner_state","mailing_state","applicant_state"],
                  zip:              ["zip","zipcode","zip_code","postal_code","owner_zip"],
                  employer:         ["employer","employer_name","company","place_of_employment"],
                  occupation:       ["occupation","job_title","position","profession"],
                  spouseFirstName:  ["spouse_first","co_owner_first","joint_first","spouse_given_name"],
                  spouseLastName:   ["spouse_last","co_owner_last","joint_last","spouse_surname"],
                  // spouseDob intentionally omitted — never auto-fill dates
                  spouseSsn:        ["spouse_ssn","co_owner_ssn","joint_ssn"],
                  bene1FirstName:   ["bene1_first","beneficiary_first","primary_bene_first","beneficiary_1_first"],
                  bene1LastName:    ["bene1_last","beneficiary_last","primary_bene_last","beneficiary_1_last"],
                  bene1Relationship:["bene_relationship","bene1_relationship","beneficiary_relationship","primary_bene_relationship"],
                  bene1Pct:         ["bene_percent","bene1_pct","beneficiary_percent","primary_bene_pct","bene_percentage"],
                };

                let filled = 0;
                for (const field of fields) {
                  let rawName;
                  try { rawName = field.getName().toLowerCase().replace(/[\s\-\.\(\)\/]/g, "_"); } catch { continue; }
                  // Never fill date fields
                  if (/date|dob|birth|expir|issue|effective|inception|maturity/.test(rawName)) continue;
                  // Try to fill every text field — match against aliases first, fall back to best-guess
                  let matched = false;
                  for (const [dataKey, aliases] of Object.entries(FIELD_MAP)) {
                    if (aliases.some(a => rawName.includes(a)) && clientData[dataKey]) {
                      try {
                        if (field instanceof PDFTextField) {
                          field.setText(String(clientData[dataKey]));
                          filled++;
                        } else if (field instanceof PDFCheckBox && typeof clientData[dataKey] === "boolean") {
                          clientData[dataKey] ? field.check() : field.uncheck();
                          filled++;
                        } else if (field instanceof PDFDropdown) {
                          const opts = field.getOptions();
                          const val = String(clientData[dataKey]);
                          const match = opts.find(o => o.toLowerCase() === val.toLowerCase());
                          if (match) { field.select(match); filled++; }
                        } else if (field instanceof PDFRadioGroup) {
                          const opts = field.getOptions();
                          const val = String(clientData[dataKey]).toLowerCase();
                          const match = opts.find(o => o.toLowerCase() === val || o.toLowerCase().startsWith(val[0]));
                          if (match) { field.select(match); filled++; }
                        }
                      } catch {}
                      matched = true;
                      break;
                    }
                  }
                  // If no alias matched but it's a text field, try filling by partial field name similarity
                  if (!matched && field instanceof PDFTextField) {
                    for (const [dataKey, aliases] of Object.entries(FIELD_MAP)) {
                      if (clientData[dataKey] && aliases.some(a => a.split("_").some(part => part.length > 2 && rawName.includes(part)))) {
                        try { field.setText(String(clientData[dataKey])); filled++; } catch {}
                        break;
                      }
                    }
                  }
                }

                let pdfBytes = null;
                try { pdfBytes = await pdfDoc.save(); } catch { /* try fallback */ }
                if (!pdfBytes) { try { pdfBytes = await pdfDoc.save({ useObjectStreams: false }); } catch { /* give up on modified */ } }

                // If save failed entirely, fall back to downloading the original unmodified PDF
                const finalBytes = pdfBytes || existingPdfBytes;
                const finalName = pdfBytes ? `FILLED_${doc.name}` : doc.name;
                const finalStatus = pdfBytes ? `filled ${filled} field${filled !== 1 ? "s" : ""}` : "downloaded original (PDF could not be saved)";

                const blob = new Blob([finalBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = finalName;
                a.click();
                URL.revokeObjectURL(url);
                setAppFillStatus(p => ({ ...p, [doc.id]: finalStatus }));
              } catch (err) {
                // Last-resort fallback — download original rather than showing an error
                try {
                  const blob = new Blob([existingPdfBytes], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = doc.name; a.click();
                  URL.revokeObjectURL(url);
                  setAppFillStatus(p => ({ ...p, [doc.id]: "downloaded original (PDF not fillable)" }));
                } catch {
                  setAppFillStatus(p => ({ ...p, [doc.id]: "error: " + err.message }));
                }
              }
            };

            return (<>
              {/* Upload */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT, color: "#fff", borderRadius: 9, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  + Upload Application PDF
                  <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleDocUpload} />
                </label>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
                  Upload a blank carrier application PDF. If the PDF has fillable form fields, click <strong>Fill &amp; Download</strong> to auto-populate client data.
                </div>
              </div>

              {appDocs.length === 0 && (
                <div style={{ textAlign: "center", color: MUTED, fontSize: 14, padding: "32px 0" }}>
                  No applications uploaded yet. Upload a carrier PDF above to get started.
                </div>
              )}

              {appDocs.map(doc => (
                <div key={doc.id} style={{ background: "#fff", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: INK, marginBottom: 2 }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => removeDoc(doc.id)} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, marginLeft: 8 }}>Remove</button>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <a href={doc.dataUrl} download={doc.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f1f5f9", border: "1px solid " + BORDER, borderRadius: 7, padding: "7px 14px", fontSize: 13, fontWeight: 500, color: INK, textDecoration: "none" }}>
                      ⬇ Download Original
                    </a>
                    <button
                      onClick={() => fillAndDownload(doc)}
                      disabled={appFillStatus[doc.id] === "filling"}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0d9488", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                    >
                      {appFillStatus[doc.id] === "filling" ? "⏳ Filling…" : "✏ Fill & Download"}
                    </button>
                    {appFillStatus[doc.id] && appFillStatus[doc.id] !== "filling" && (
                      <span style={{ fontSize: 12, color: appFillStatus[doc.id].startsWith("error") ? DANGER : SUCCESS, fontWeight: 500 }}>
                        {appFillStatus[doc.id].startsWith("error") ? "⚠ " : "✓ "}{appFillStatus[doc.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 18, background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 9, padding: "12px 16px", fontSize: 13, color: "#0f766e" }}>
                <strong>How it works:</strong> Upload any carrier's blank PDF application. Click <strong>Fill &amp; Download</strong> and the app will scan every form field in the PDF, match field names to this client's data, and download a pre-populated copy ready for review. Works best with digitally-created fillable PDFs. Scanned paper applications will download as-is (no fillable fields to detect).
              </div>
            </>);
          })()}
        </Panel>

        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <button onClick={handleSubmit} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", flex: 1 }}>
            Save Client Record
          </button>
          <button onClick={() => setShowReport(true)} style={{ background: SUCCESS, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", flex: 1 }}>
            📊 View Financial Summary
          </button>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: MUTED, paddingBottom: 32 }}>
          Russell Wealth Group · Confidential client data
        </div>
        </div>{/* end main col */}
        </div>{/* end content col */}
      </div>{/* end shell */}

      {/* ── FLOATING SAVE BUTTON ── */}
      <div className="float-save" style={{ position: "fixed", top: 10, right: 12, zIndex: 2000, display: (showReport || showSummaryReview) ? "none" : "flex", alignItems: "center", gap: 8 }}>
        {lastSaved && (
          <div style={{ fontSize: 10, color: MUTED, background: "rgba(255,255,255,0.92)", border: "1px solid " + BORDER, borderRadius: 5, padding: "3px 8px", whiteSpace: "nowrap" }}>
            Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
        <button
          onClick={() => { autoSave(); showToast(activeClientId ? "File updated" : "Draft saved", ACCENT); }}
          style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(15,23,42,0.18)", whiteSpace: "nowrap" }}
        >
          💾 {activeClientId ? "Update File" : "Save Draft"}
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea, button { font-family: inherit; }
        input, select, textarea { caret-color: #151b28; transition: border-color 0.15s, box-shadow 0.15s; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #2f3a4a !important; box-shadow: 0 0 0 3px rgba(47,58,74,0.15) !important; }
        input::placeholder, textarea::placeholder { color: #9aa3b0 !important; opacity: 1; }
        input.dark-ph::placeholder { color: #151b28 !important; font-weight: 600; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23697180' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px !important; }
        select option { background: #ffffff !important; color: #151b28 !important; font-size: 14px; }
        select.sel-compact { padding-right: 24px !important; background-position: right 8px center !important; }
        select option:checked, select option:hover { background: #eef1f5 !important; color: #151b28 !important; }
        .side-nav:hover { background: #e9edf2 !important; color: #151b28 !important; }
        button { transition: filter 0.15s, background 0.15s; }
        button:hover { filter: brightness(0.97); }
        @media (max-width: 900px) {
          .side-rail { display: none; }
          .mobile-top { display: flex !important; }
          .rg { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .rg { grid-template-columns: 1fr !important; }
          .main-col { padding: 18px 12px 36px !important; }
          .float-save { top: 6px !important; right: 6px !important; }
        }
        [data-lastpass-icon-root], [data-lastpass-root], [id^="lastpass"], [id*="lastpass"],
        .lastpass-icon, .lp-icon, [class*="lastpass"], [data-lpignore-ext],
        div[style*="z-index: 2147483647"]:not([class]):not([id]) { display: none !important; }
      `}</style>
    </div>

    {showSummaryReview && (
      <div id="rwg-report-wrap">
        <ClientReport
          data={{ client, spouse, hasSpouse, accounts, realEstate, incomes, autos, debts, businesses, beneficiaries, children, willsTrust, poas, annualExpenses, homeOwnership, lifePolicies }}
          onClose={() => setShowSummaryReview(false)}
        />
      </div>
    )}
    {showReport && (
      <div id="rwg-report-wrap">
        <ClientReport
          data={{ client, spouse, hasSpouse, accounts, realEstate, incomes, autos, debts, businesses, beneficiaries, children, willsTrust, poas, annualExpenses, homeOwnership, lifePolicies }}
          onClose={() => setShowReport(false)}
        />
      </div>
    )}
    {quickViewPanelOpen && quickViewSelected.length > 0 && (() => {
      const QV_LABEL = { "section-profile": recordType === "prospect" ? "Prospect Profile" : "Client Profile", "section-family": "Family", "section-bene": "Beneficiaries", "section-employment": "Employment", "section-income": "Income", "section-realestate": "Real Estate", "section-accounts": "Investment & Bank", "section-wills": "Wills & Trust", "section-autos": "Autos", "section-life": "Life Insurance", "section-networth": "Net Worth / Portfolio", "section-inheritance": "Estate Planning" };
      const QvTable = ({ rows, labelWidth = 150 }) => (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>{rows.map(([k, v]) => <tr key={k}><td style={{ padding: "4px 0", color: MUTED, width: labelWidth, verticalAlign: "top", fontSize: 12 }}>{k}</td><td style={{ padding: "4px 0", fontWeight: 500, fontSize: 13 }}>{v}</td></tr>)}</tbody>
        </table>
      );
      const td = { padding: "5px 8px", borderBottom: "1px solid #e8ecf0", verticalAlign: "top", fontSize: 13 };
      const th = { padding: "5px 8px", background: "#eef1f6", color: BRAND_NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left" };
      const Tbl = ({ cols, rows, emptyMsg, foot }) => rows.length === 0
        ? <span style={{ color: MUTED, fontSize: 13, fontStyle: "italic" }}>{emptyMsg || "None recorded."}</span>
        : <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 6 }}>
            <thead><tr>{cols.map(c => <th key={c} style={th}>{c}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fb" }}>{r.map((cell, j) => <td key={j} style={td}>{cell || <span style={{ color: "#ccc" }}>—</span>}</td>)}</tr>)}</tbody>
            {foot && <tfoot><tr style={{ borderTop: "2px solid " + BRAND_NAVY }}>{foot.map((cell, j) => <td key={j} style={{ ...td, fontWeight: 700, color: BRAND_NAVY, borderBottom: "none" }}>{cell}</td>)}</tr></tfoot>}
          </table>;
      const Sub = ({ t }) => <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, margin: "10px 0 5px" }}>{t}</div>;
      const toAnn = (amt, freq) => { const map = { annual:1, monthly:12, bimonthly:24, biweekly:26, weekly:52, quarterly:4 }; return (parseDollar(amt) || 0) * (map[(freq||"").toLowerCase()] || 1); };
      const fmtN = n => n ? "$" + Math.round(n).toLocaleString() : "";
      const ownerName = o => o === "spouse" ? (spouse.firstName || "Spouse") : o === "joint" ? "Joint" : (client.firstName || "Client");
      const yn = v => v === true ? "Yes" : v === false ? "No" : "—";
      const hasSpouseRecord = ["married","domestic_partner"].includes(hasSpouse) || !!(spouse.firstName || spouse.lastName);

      const renderSection = id => {

        if (id === "section-profile") return (<>
          <Tbl cols={["Field","Value"]} rows={[
            ["Full Name", [client.firstName, client.middleName, client.lastName].filter(Boolean).join(" ")],
            ["Date of Birth", client.dob], ["SSN", client.ssn], ["Gender", client.gender], ["Marital / Filing Status", client.filingStatus],
            ["Cell Phone", client.cell], ["Home Phone", client.homePhone], ["Email", client.email ? <MailLink email={client.email} /> : ""],
            ["Address", [client.addressLine1, client.addressLine2, client.city, client.state, client.zip].filter(Boolean).join(", ")],
            ["PO Box", client.hasPOBox ? [client.poBox, client.poBoxCity, client.poBoxState, client.poBoxZip].filter(Boolean).join(", ") : ""],
            ["Preferred Mailing", client.preferredMailing],
            ["Driver's License #", client.dlNumber], ["DL State", client.dlState], ["DL Issuer", client.dlIssuerName], ["DL Issue Date", client.dlIssueDate], ["DL Expiration", client.dlExpDate],
          ].filter(([,v]) => v)} />
          {clientEmails?.filter(e => e.address).length > 0 && <>
            <Sub t="Email Addresses" />
            <Tbl cols={["Tag","Address"]} rows={clientEmails.filter(e => e.address).map(e => [e.tag, <MailLink email={e.address} />])} />
          </>}
        </>);

        if (id === "section-family") return (<>
          {hasSpouseRecord ? (<>
            <Sub t="Spouse" />
            <Tbl cols={["Field","Value"]} rows={[
              ["Full Name", [spouse.firstName, spouse.middleName, spouse.lastName].filter(Boolean).join(" ")],
              ["Date of Birth", spouse.dob], ["SSN", spouse.ssn], ["Gender", spouse.gender],
              ["Cell Phone", spouse.cell], ["Home Phone", spouse.homePhone], ["Email", spouse.email ? <MailLink email={spouse.email} /> : ""],
              ["Address", [spouse.addressLine1, spouse.addressLine2, spouse.city, spouse.state, spouse.zip].filter(Boolean).join(", ")],
              ["Driver's License #", spouse.dlNumber], ["DL State", spouse.dlState], ["DL Expiration", spouse.dlExpDate],
            ].filter(([,v]) => v)} emptyMsg="No spouse recorded." />
            {spouseEmails?.filter(e => e.address).length > 0 && <>
              <Sub t="Spouse Email Addresses" />
              <Tbl cols={["Tag","Address"]} rows={spouseEmails.filter(e => e.address).map(e => [e.tag, <MailLink email={e.address} />])} />
            </>}
          </>) : <span style={{ color: MUTED, fontSize: 13 }}>No spouse recorded.</span>}
          {hasChildren && children.length > 0 && (<>
            <Sub t="Children" />
            <Tbl cols={["Name","DOB","Relationship","Gender","SSN"]}
              rows={children.map(c => [[c.firstName, c.lastName].filter(Boolean).join(" "), c.dob, c.relationship, c.gender, c.ssn])} />
          </>)}
        </>);

        if (id === "section-bene") return (
          <Tbl cols={["Name","Designation","%","Relationship","DOB","SSN","Email","Address"]}
            rows={beneficiaries.map(b => [
              [b.firstName, b.middleName, b.lastName].filter(Boolean).join(" "),
              (b.designationType || "primary").charAt(0).toUpperCase() + (b.designationType || "primary").slice(1),
              b.percentage, b.relationship, b.dob, b.ssn, b.email ? <MailLink email={b.email} /> : "",
              [b.addressLine1, b.city, b.state, b.zip].filter(Boolean).join(", "),
            ])} emptyMsg="No beneficiaries recorded." />
        );

        if (id === "section-employment") {
          const EmpBlock = ({ label, emp }) => !emp?.employer ? null : (<>
            <Sub t={label} />
            <Tbl cols={["Field","Value"]} rows={[
              ["Employer", emp.employer], ["Occupation", emp.occupation], ["Start Date", emp.startDate], ["Work Phone", emp.workPhone],
              ["Work Address", [emp.workAddress, emp.workCity, emp.workState, emp.workZip].filter(Boolean).join(", ")],
              ["Retirement Plan", emp.hasRetirement === false ? "None" : emp.retirementType],
              ["Employer Match", emp.hasMatch === false ? "None" : emp.matchPct ? String(emp.matchPct).replace(/%/g, "").trim() + "%" : ""],
              ["Monthly Employee Contribution", emp.contributionAmt], ["Retirement Balance", emp.retirementBalance], ["Custodian", emp.retirementCustodian],
            ].filter(([,v]) => v)} />
          </>);
          return (<><EmpBlock label={`${client.firstName || "Client"} — Employment`} emp={clientEmp} /><EmpBlock label={`${spouse.firstName || "Spouse"} — Employment`} emp={hasSpouseRecord ? spouseEmp : null} /></>);
        }

        if (id === "section-income") {
          const totalAnnual = activeIncomes.reduce((s, inc) => s + toAnn(inc.amount, inc.frequency), 0);
          return <Tbl cols={["Source / Type","Owner","Amount","Frequency","Annual"]}
            rows={activeIncomes.filter(inc => inc.source || inc.type || inc.amount).map(inc => [
              inc.source || inc.type, ownerName(inc.owner), inc.amount,
              inc.frequency ? inc.frequency.charAt(0).toUpperCase() + inc.frequency.slice(1) : "",
              fmtN(toAnn(inc.amount, inc.frequency)),
            ])}
            foot={["Total Annual Income", "", "", "", fmtN(totalAnnual)]}
            emptyMsg="No income recorded." />;
        }

        if (id === "section-realestate") return (<>
          {homeOwnership.ownOrRent && (<>
            <Sub t="Primary Residence" />
            <Tbl cols={["Field","Value"]} rows={[
              ["Own or Rent", homeOwnership.ownOrRent === "own" ? "Owns" : "Rents"],
              ...(homeOwnership.ownOrRent === "own" ? [
                ["Mortgage Company", homeOwnership.mortgageCompany], ["Mortgage Balance", homeOwnership.mortgageBalance],
                ["Monthly Payment", homeOwnership.monthlyPayment], ["Interest Rate", homeOwnership.interestRate],
                ["Loan Origination", homeOwnership.loanOriginationDate], ["Loan Number", homeOwnership.loanNumber],
                ["Annual Property Taxes", homeOwnership.annualPropertyTaxes], ["Annual Insurance", homeOwnership.annualInsurance],
              ] : [
                ["Monthly Rent", homeOwnership.monthlyRent], ["Landlord", homeOwnership.landlordName], ["Landlord Phone", homeOwnership.landlordPhone],
              ]),
            ].filter(([,v]) => v)} />
          </>)}
          <Sub t="Additional Properties" />
          <Tbl cols={["Description","Address","Market Value","Purchase Price","Purchase Date","Mortgage Bal."]}
            rows={realEstate.filter(r => r.address || r.marketValue || r.description).map(r => [
              r.description, [r.address, r.city, r.state, r.zip].filter(Boolean).join(", "),
              r.marketValue, r.purchasePrice, r.purchaseDate, r.mortgageBalance,
            ])} emptyMsg="No additional properties recorded." />
        </>);

        if (id === "section-accounts") {
          const total = accounts.reduce((s, a) => s + parseDollar(a.balance), 0);
          return <Tbl cols={["Institution","Type","Owner","Acct #","Qualified","Transactions","Balance"]}
            rows={accounts.filter(a => a.institution || a.balance).map(a => [
              a.institution, a.type, a.owner,
              a.accountNumber ? "···" + String(a.accountNumber).slice(-4) : "",
              a.qualified, (a.hasRmdOrContrib || "").replace(/^Contributing$/i, "Contrib."),
              a.balance,
            ])}
            foot={["Total", "", "", "", "", "", fmtN(total)]}
            emptyMsg="No accounts recorded." />;
        }

        if (id === "section-wills") return (<>
          <Sub t="Will" />
          <Tbl cols={["Field","Value"]} rows={[
            ["Has Will", yn(willsTrust.hasWill)], ["Will Date", willsTrust.willDate], ["Attorney", willsTrust.willAttorney],
            ["Executor", willsTrust.executor], ["Alt. Executor", willsTrust.altExecutor], ["Location", willsTrust.willLocation],
            ["Needs Update", yn(willsTrust.willUpdated)], ["Update Date", willsTrust.willUpdateDate], ["Notes", willsTrust.willNotes],
          ].filter(([,v]) => v && v !== "—")} emptyMsg="No will information recorded." />
          <Sub t="Trust" />
          <Tbl cols={["Field","Value"]} rows={[
            ["Trust Name", willsTrust.trustName], ["Trust Type", willsTrust.trustType], ["Trust Date", willsTrust.trustDate],
            ["Trustee", willsTrust.trustee], ["Successor Trustee", willsTrust.successorTrustee], ["Attorney", willsTrust.trustAttorney],
            ["Assets Titled", yn(willsTrust.assetsTitled)], ["Location", willsTrust.trustLocation], ["Notes", willsTrust.trustNotes],
          ].filter(([,v]) => v && v !== "—")} emptyMsg="No trust information recorded." />
          <Sub t="Power of Attorney" />
          {poas.map((p, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              {poas.length > 1 && <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 4 }}>POA {i + 1}</div>}
              <Tbl cols={["Field","Value"]} rows={[
                ["Has POA", yn(p.hasPOA)], ["POA Type", p.poaType], ["Agent", p.agentName],
                ["Relationship", p.agentRelationship], ["Agent Phone", p.agentPhone], ["Alt. Agent", p.altAgent],
                ["Date", p.poaDate], ["Attorney", p.poaAttorney], ["Location", p.poaLocation], ["Notes", p.poaNotes],
              ].filter(([,v]) => v && v !== "—")} emptyMsg="No POA information recorded." />
            </div>
          ))}
        </>);

        if (id === "section-autos") {
          const totalVal = autos.reduce((s, a) => s + parseDollar(a.value), 0);
          const totalOwed = autos.reduce((s, a) => s + parseDollar(a.loanBalance), 0);
          return <Tbl cols={["Year","Make","Model","Est. Value","Loan?","Amount Owed","Financed With","Rate","Mo. Payment","KBB Mileage","Condition"]}
            rows={autos.filter(a => a.make || a.year).map(a => [
              a.year, a.make, a.model, a.value,
              a.hasLoan === "yes" ? "Yes" : a.hasLoan === "no" ? "Paid Off" : "",
              a.loanBalance, a.lender, a.interestRate, a.monthlyPayment,
              a.kbbMileage, a.kbbCondition,
            ])}
            foot={["", "", "Totals", fmtN(totalVal), "", fmtN(totalOwed), "", "", "", "", ""]}
            emptyMsg="No vehicles recorded." />;
        }

        if (id === "section-life") {
          const totalDB = lifePolicies.reduce((s, p) => s + parseDollar(p.deathBenefit), 0);
          const totalCV = lifePolicies.reduce((s, p) => s + parseDollar(p.cashValue), 0);
          return <Tbl cols={["Carrier","Type","Insured","Owner","Death Benefit","Cash Value","Premium","Frequency","Policy #","Issue Date","Surrender"]}
            rows={lifePolicies.filter(p => p.carrier || p.deathBenefit).map(p => [
              p.carrier, p.policyType, p.insured, p.owner, p.deathBenefit, p.cashValue,
              p.premiumAmount, p.premiumFrequency, p.policyNumber, p.issueDate, p.surrender,
            ])}
            foot={["", "", "", "Totals", fmtN(totalDB), fmtN(totalCV), "", "", "", "", ""]}
            emptyMsg="No life insurance recorded." />;
        }

        if (id === "section-networth") return (<>
          <Sub t="Balance Sheet Estimates" />
          <Tbl cols={["Field","Value"]} rows={[
            ["Total Assets", nwState.totalAssets], ["Total Liabilities", nwState.totalLiabilities],
            ["Liquid Net Worth", nwState.liquidNetWorth], ["Net Worth ex-Home", nwState.netWorthExHome],
            ["Primary Residence Equity", nwState.primaryEquity],
            ["Annual Expenses", annualExpenses.amount ? `${annualExpenses.amount} / ${annualExpenses.frequency}` : ""],
          ].filter(([,v]) => v)} emptyMsg="No net worth data entered." />
          <Sub t="Portfolio Breakdown" />
          <Tbl cols={["Category","Amount"]} rows={[
            ["Cash & Cash Equivalents", nwState.pbCash],
            ["Qualified Retirement Plans", nwState.pbQualified],
            ["Non-Qualified / Taxable Brokerage", nwState.pbNonQual],
            ["Annuities", nwState.pbAnnuities],
            ["Cash Value Life Insurance", nwState.pbCVLI],
            ["Alternative / Illiquid", nwState.pbAlts],
            ["Other / Unclassified", nwState.pbOther],
          ].filter(([,v]) => v)} emptyMsg="No portfolio breakdown entered." />
          {nwState.notes && <><Sub t="Notes" /><div style={{ fontSize: 13, color: INK }}>{nwState.notes}</div></>}
        </>);

        if (id === "section-inheritance") return (<>
          {inheritances.map((inh, idx) => (<div key={idx}>
            {inheritances.length > 1 && <Sub t={`Estate Planning Record ${idx + 1}`} />}
            <Tbl cols={["Field","Value"]} rows={[
              ["Expects Inheritance", inh.expectsInheritance], ["Est. Value", inh.estValue], ["Timeline", inh.timeline],
              ["Source", inh.source], ["Source Details", inh.sourceDetails], ["# of Siblings", inh.numberOfSiblings],
              ["Siblings Involved", inh.siblingsInvolved], ["Special Needs in Family", inh.specialNeedsFamily],
              ["Special Needs Trust", inh.specialNeedsTrust], ["Special Needs Details", inh.specialNeedsDetails],
              ["Nursing Care Concern", inh.nursingCare], ["LTC Insurance", inh.ltcInsurance], ["Nursing Care Details", inh.nursingCareDetails],
              ["Estate Planning Status", inh.estatePlanning], ["Trustee Arrangements", inh.trusteeArrangements],
              ["Family Conflicts", inh.familyConflicts], ["Conflict Details", inh.conflictDetails],
              ["Charitable Intent", inh.charitableIntent], ["Charitable Details", inh.charitableDetails],
              ["Additional Notes", inh.additionalNotes],
            ].filter(([,v]) => v)} emptyMsg="No estate planning data entered." />
          </div>))}
          {vaults.length > 0 && (<>
            <Sub t="Document Vault" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
              {vaults.map(v => <span key={v.id} style={{ fontSize: 12, background: "#eef1f6", borderRadius: 4, padding: "2px 8px", color: BRAND_NAVY, fontWeight: 500 }}>✓ {v.category}</span>)}
            </div>
          </>)}
        </>);


        return null;
      };
      const printQV = () => {
        const el = document.getElementById("qv-print-content");
        if (!el) return;
        const win = window.open("", "_blank", "width=900,height=700");
        win.document.write(`<!doctype html><html><head><title>Quick View</title><style>
          body { font-family: Georgia, 'Times New Roman', serif; color: #151b28; margin: 0; padding: 32px 40px; }
          h1 { font-size: 22px; margin: 0 0 4px; }
          .sub { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #697180; margin-bottom: 24px; }
          .sec-head { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #2e3d66; border-bottom: 2px solid #2e3d66; padding-bottom: 4px; margin: 20px 0 10px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
          td, th { padding: 5px 8px; border-bottom: 1px solid #e1e4ea; vertical-align: top; }
          th { background: #e9edf2; color: #2e3d66; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; }
          .lbl { color: #697180; width: 150px; }
          @page { margin: 0.6in 0.5in; size: letter portrait; }
          @media print { body { padding: 0; } }
        </style></head><body>`);
        win.document.write(`<h1>${[client.firstName, client.lastName].filter(Boolean).join(" ") || "Quick View"}</h1>`);
        win.document.write(`<div class="sub">Russell Wealth Group · Quick View · ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>`);
        win.document.write(el.innerHTML);
        win.document.write("</body></html>");
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
      };
      return (
        <div onClick={() => setQuickViewPanelOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 16px 56px rgba(0,0,0,0.22)", width: "100%", maxWidth: 620, maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid " + BORDER }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: INK }}>Quick View</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{quickViewSelected.map(id => QV_LABEL[id]).join(" · ")}</div>
              </div>
              <button onClick={() => setQuickViewPanelOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: MUTED, padding: "2px 6px" }}>✕</button>
            </div>
            <div id="qv-print-content" style={{ overflowY: "auto", padding: "4px 0 8px" }}>
              {quickViewSelected.map((id, idx) => (
                <div key={id} style={{ padding: "14px 22px 16px", borderBottom: idx < quickViewSelected.length - 1 ? "1px solid " + BORDER : "none" }}>
                  <div className="sec-head" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BRAND_NAVY, marginBottom: 10 }}>{QV_LABEL[id]}</div>
                  {renderSection(id)}
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 20px 14px", borderTop: "1px solid " + BORDER, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <button onClick={() => { setQuickViewPanelOpen(false); setQuickViewOpen(true); }}
                style={{ background: "none", border: "1px solid " + BORDER, borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: INK, cursor: "pointer" }}>← Edit Selection</button>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={printQV}
                  style={{ background: "#5b6e85", color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🖨 Print</button>
                <button onClick={() => setQuickViewPanelOpen(false)}
                  style={{ background: BRAND_NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      );
    })()}
    {confirmState.open && (
      <ConfirmDialog
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={() => { closeConfirm(); confirmState.onConfirm && confirmState.onConfirm(); }}
        onCancel={closeConfirm}
      />
    )}
    </>
  );
}
