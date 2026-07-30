import { useState, useEffect, useRef, useCallback } from "react";

const NAV        = "#1a2f5e";
const CARD       = "#1a2f5e";
const INPUT_BG   = "#213870";
const ACCENT     = "#4a90d9";
const WHITE      = "#ffffff";
const LIGHT_BLUE = "#a8c8f0";

const IS = {
  background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8,
  padding: "9px 13px", color: WHITE, fontSize: 15, fontFamily: "Georgia, serif",
  width: "100%", boxSizing: "border-box", caretColor: WHITE,
};

const Lbl = ({ t }) => (
  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, marginTop: 10 }}>{t}</div>
);

const Sec = ({ t }) => (
  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid " + ACCENT, paddingBottom: 5, marginTop: 20, marginBottom: 6 }}>{t}</div>
);

const Row = ({ children, cols = 2 }) => (
  <div className="rg" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0 16px" }}>
    {children}
  </div>
);

const F = ({ children }) => <div>{children}</div>;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function DatePicker({ value, onChange, label, futureYears = 0 }) {
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

  const sel = { ...IS, width: "auto", flex: 1 };

  return (
    <>
      {label && <Lbl t={label} />}
      <div style={{ display: "flex", gap: 8 }}>
        <select data-lpignore="true" value={mm} onChange={e => set(e.target.value, dd, yyyy)} style={sel}>
          <option value="">Mo</option>
          {MONTHS.map((m, i) => {
            const v = String(i + 1).padStart(2, "0");
            return <option key={v} value={v}>{m}</option>;
          })}
        </select>
        <select data-lpignore="true" value={dd} onChange={e => set(mm, e.target.value, yyyy)} style={sel}>
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
          style={{ ...sel, flex: 1.4 }}
        />
      </div>
    </>
  );
}

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
  dlNumber:"", dlState:"", dlIssuerName:"", dlIssueDate:"", dlExpDate:"",
};
const emptySpouse = { firstName:"", middleName:"", lastName:"", dob:"", ssn:"", gender:"", cell:"", homePhone:"", email:"", dlNumber:"", dlState:"", dlIssuerName:"", dlIssueDate:"", dlExpDate:"", addressLine1:"", addressLine2:"", city:"", state:"", zip:"", hasPOBox:null, poBox:"", poBoxCity:"", poBoxState:"", poBoxZip:"", preferredMailing:"" };
const emptyEmployer = { employer:"", occupation:"", startDate:"", workPhone:"", workAddress:"", workCity:"", workState:"", workZip:"", hasRetirement:null, retirementType:null, hasMatch:null, matchPct:"", contributionAmt:"", retirementBalance:"", retirementCustodian:"" };
const emptyAuto = { year:"", make:"", model:"", value:"" };
const emptyRealEstate = { description:"", purchaseDate:"", purchasePrice:"", marketValue:"", mortgageBalance:"", address:"", mortgageCompany:"", originationDate:"", interestRate:"", monthlyPmt:"", propertyTaxes:"", insurance:"", pmtIncludesTaxIns:null };
const emptyAccount = { type:"", institution:"", accountNumber:"", balance:"", owner:"", hasRmdOrContrib:null, rmdOrContrib:"", rmdContribAmount:"", rmdContribFrequency:"", linkedIncomeId:null, hasContributions:null, contribAmount:"", contribFrequency:"" };

const ACCOUNT_TYPES = [
  "401(k)","403(b)","457(b)",
  "Annuity (Fixed)","Annuity (Indexed)","Annuity (Variable)",
  "CD","Checking / Savings",
  "HSA",
  "Life Insurance (Cash Value)",
  "Money Market",
  "Non-Qualified Brokerage",
  "Pension / Defined Benefit",
  "Roth 401(k)","Roth IRA",
  "SEP IRA","SIMPLE IRA",
  "529 / Education",
  "Traditional IRA","Trust Account",
  "Other",
];

const INCOME_TYPES = [
  "Alimony / Child Support",
  "Employment — W2",
  "Investment / Dividends",
  "Other",
  "Pension",
  "Rental Income",
  "Self-Employment / 1099",
  "Social Security",
  "TRS (Teacher Retirement)",
];

const emptyIncome      = { type:"", amount:"", frequency:"", owner:"client" };
const emptyChild       = { firstName:"", middleName:"", lastName:"", dob:"", gender:"", isBeneficiary: false, ssn:"", relationship:"Child", percentage:"", email:"", phone:"", addressLine1:"", addressLine2:"", city:"", state:"", zip:"" };
const emptyBeneficiary = { firstName:"", middleName:"", lastName:"", dob:"", gender:"", ssn:"", relationship:"", percentage:"", email:"", addressSource:"manual", addressLine1:"", city:"", state:"", zip:"" };

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

const StateSelect = ({ value, onChange }) => (
  <select data-lpignore="true" value={value || ""} onChange={onChange} style={IS}>
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

function ClientRoster({ clients, onDelete, onOpen, onBack }) {
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE }}>
      <div style={{ background: NAV, padding: "24px 24px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell Wealth Group</h1>
            <p style={{ margin: 0, fontSize: 13, color: WHITE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Saved Clients · {clients.length} Record{clients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onBack} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>
            ← New Intake
          </button>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
        {clients.length === 0 ? (
          <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 36, textAlign: "center" }}>
            <div style={{ fontSize: 15, color: WHITE }}>No saved clients yet.</div>
          </div>
        ) : clients.filter(c => c && c.client).map(c => {
          const totalAssets = [
            ...(c.accounts || []).map(a => parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0)),
            ...(c.realEstate || []).map(r => parseInt((r.marketValue || "").replace(/[^0-9]/g, "") || 0)),
          ].reduce((a, b) => a + b, 0);
          return (
            <div key={c.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: "18px 22px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: "bold", color: WHITE }}>{c.client?.firstName} {c.client?.lastName}</div>
                {["married","domestic_partner"].includes(c.hasSpouse) && c.spouse?.firstName && (
                  <div style={{ fontSize: 13, color: WHITE, marginTop: 2 }}>Spouse: {c.spouse.firstName} {c.spouse.lastName}</div>
                )}
                <div style={{ fontSize: 12, color: WHITE, marginTop: 4 }}>
                  {c.client?.dob && <span style={{ marginRight: 12 }}>DOB: {c.client.dob}</span>}
                  {totalAssets > 0 && <span>Assets: ${totalAssets.toLocaleString()}</span>}
                </div>
                <div style={{ fontSize: 11, color: WHITE, marginTop: 4, fontStyle: "italic" }}>Saved {new Date(c.savedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onOpen(c)} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Open</button>
                <button onClick={() => window.confirm("Delete this client? This cannot be undone.") && onDelete(c.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FileUpload({ section, files = [], onChange }) {
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
    <div style={{ marginTop: 16, borderTop: "1px solid " + ACCENT, paddingTop: 14 }}>
      <div style={{ fontSize: 11, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Uploaded Files</div>
      {files.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {files.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, background: INPUT_BG, borderRadius: 6, padding: "6px 10px" }}>
              <a href={f.data} download={f.name} style={{ color: WHITE, fontSize: 13, flex: 1, textDecoration: "none", wordBreak: "break-all" }}>📎 {f.name}</a>
              <span style={{ fontSize: 11, color: WHITE, flexShrink: 0 }}>{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => window.confirm(`Remove "${f.name}"?`) && onChange(section, files.filter(x => x.id !== f.id))} style={{ background: "#5a1a1a", border: "none", color: WHITE, borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <input ref={inputRef} type="file" multiple style={{ display: "none" }} onChange={handleFiles} />
      <button onClick={() => inputRef.current.click()} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
        + Upload File
      </button>
    </div>
  );
}

function Panel({ title, children, defaultOpen = true, id }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", cursor: "pointer", userSelect: "none" }}>
        <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</div>
        <span style={{ color: ACCENT, fontSize: 18, lineHeight: 1 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ padding: "0 22px 20px" }}>{children}</div>}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("form");
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
  const [poa, setPoa] = useState({
    hasPOA: null, poaType:null, agentName:"", agentRelationship:null, agentPhone:"", altAgent:"", poaDate:"", poaAttorney:"", poaLocation:"", poaNotes:"",
  });

  const [clientEmails, setClientEmails] = useState([{ id: 1, tag: "personal", address: "" }]);
  const [spouseEmails, setSpouseEmails] = useState([{ id: 1, tag: "personal", address: "" }]);
  const [clientEmp, setClientEmp] = useState({ ...emptyEmployer });
  const [spouseEmp, setSpouseEmp] = useState({ ...emptyEmployer });
  const [incomes, setIncomes] = useState([{ ...emptyIncome, id: 1 }]);
  const [autos, setAutos] = useState([{ ...emptyAuto, id: 1 }]);
  const [realEstate, setRealEstate] = useState([{ ...emptyRealEstate, id: 1 }]);
  const [accounts, setAccounts] = useState([{ ...emptyAccount, id: 1 }]);
  const [uploads, setUploads] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeClientId, setActiveClientId] = useState(() => {
    const sid = sessionStorage.getItem("rwg_activeClientId");
    return sid ? Number(sid) : null;
  });

  const stateSnapshotRef = useRef({});

  const setActiveClient = (id) => {
    if (id == null) { sessionStorage.removeItem("rwg_activeClientId"); }
    else { sessionStorage.setItem("rwg_activeClientId", String(id)); }
    setActiveClientId(id);
  };

  const setC = f => e => setClient(p => ({ ...p, [f]: e.target.value }));
  const setS = f => e => setSpouse(p => ({ ...p, [f]: e.target.value }));
  const setCE = f => e => setClientEmp(p => ({ ...p, [f]: e.target.value }));
  const setSE = f => e => setSpouseEmp(p => ({ ...p, [f]: e.target.value }));

  const saveClient = (record) => {
    const updated = [record, ...savedClients];
    localStorage.setItem("rwg_clients", JSON.stringify(updated));
    setSavedClients(updated);
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

  const buildSnapshot = useCallback(() => ({
    client, spouse, hasSpouse, hasChildren, children,
    clientEmails, spouseEmails,
    clientEmp, spouseEmp, incomes, autos, realEstate, accounts,
    beneficiaries, willsTrust, poa, uploads,
  }), [client, spouse, hasSpouse, hasChildren, children, clientEmails, spouseEmails, clientEmp, spouseEmp, incomes, autos, realEstate, accounts, beneficiaries, willsTrust, poa, uploads]);

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
    const id = setInterval(autoSave, 2 * 60 * 1000);
    return () => clearInterval(id);
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
    setIncomes(record.incomes || [{ ...emptyIncome, id: 1 }]);
    setAutos(record.autos || [{ ...emptyAuto, id: 1 }]);
    setRealEstate(record.realEstate || [{ ...emptyRealEstate, id: 1 }]);
    setAccounts(record.accounts || [{ ...emptyAccount, id: 1 }]);
    setBeneficiaries(record.beneficiaries || [{ ...emptyBeneficiary, id: 1 }]);
    setWillsTrust(record.willsTrust || { hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
    setPoa(record.poa || { hasPOA:null, poaType:null, agentName:"", agentRelationship:null, agentPhone:"", altAgent:"", poaDate:"", poaAttorney:"", poaLocation:"", poaNotes:"" });
    setUploads(record.uploads || {});
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

  const addRE = () => setRealEstate(p => [...p, { ...emptyRealEstate, id: Date.now() }]);
  const delRE = id => setRealEstate(p => p.filter(x => x.id !== id));
  const updRE = (id, f, v) => setRealEstate(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const addAcct = () => setAccounts(p => [...p, { ...emptyAccount, id: Date.now() }]);
  const delAcct = id => setAccounts(p => p.filter(x => x.id !== id));
  const updAcct = (id, f, v) => setAccounts(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const toggleAcctRmd = (acct, yesNo) => {
    if (yesNo === "yes") {
      const incId = Date.now();
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: "yes", linkedIncomeId: incId } : x));
      setIncomes(p => [...p, { ...emptyIncome, id: incId, type: acct.rmdOrContrib === "RMD" ? "Pension" : "Investment / Dividends", amount: acct.rmdContribAmount || "", frequency: acct.rmdContribFrequency || "", owner: (acct.owner || "").toLowerCase() === "spouse" ? "spouse" : "client", linkedAcctId: acct.id }]);
    } else {
      const prev = accounts.find(x => x.id === acct.id);
      if (prev?.linkedIncomeId) setIncomes(p => p.filter(x => x.id !== prev.linkedIncomeId));
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: "no", linkedIncomeId: null } : x));
    }
  };

  const syncAcctIncome = (acct, field, value) => {
    updAcct(acct.id, field, value);
    if (!acct.linkedIncomeId) return;
    const incomeField = field === "rmdContribAmount" ? "amount" : field === "rmdContribFrequency" ? "frequency" : field === "rmdOrContrib" ? "type" : null;
    if (incomeField === "type") {
      const incType = value === "RMD" ? "Pension" : value === "Withdrawal" ? "Investment / Dividends" : "Investment / Dividends";
      setIncomes(p => p.map(x => x.id === acct.linkedIncomeId ? { ...x, type: incType } : x));
    } else if (incomeField) {
      setIncomes(p => p.map(x => x.id === acct.linkedIncomeId ? { ...x, [incomeField]: value } : x));
    }
  };

  const addBene = () => setBeneficiaries(p => [...p, { ...emptyBeneficiary, id: Date.now() }]);
  const delBene = id => setBeneficiaries(p => p.filter(x => x.id !== id));
  const updBene = (id, f, v) => setBeneficiaries(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const handleSubmit = () => {
    if (!client.firstName.trim() || !client.lastName.trim()) {
      showToast("Client first and last name are required.", "#c0392b");
      return;
    }

    const fullName = `${client.firstName.trim()} ${client.lastName.trim()}`.toLowerCase();
    const ssnLast4 = (client.ssn || "").replace(/\D/g, "").slice(-4);

    const duplicate = savedClients.find(r => {
      const existingName = `${r.client?.firstName?.trim() || ""} ${r.client?.lastName?.trim() || ""}`.toLowerCase();
      const existingLast4 = (r.client?.ssn || "").replace(/\D/g, "").slice(-4);
      if (existingName === fullName) return true;
      if (ssnLast4.length === 4 && existingLast4.length === 4 && ssnLast4 === existingLast4) return true;
      return false;
    });

    if (duplicate) {
      const existingName = `${duplicate.client?.firstName || ""} ${duplicate.client?.lastName || ""}`;
      const savedDate = new Date(duplicate.savedAt).toLocaleDateString();
      const proceed = window.confirm(
        `A client named "${existingName}" already exists (saved ${savedDate}).\n\nSave anyway as a new record?`
      );
      if (!proceed) return;
    }

    const record = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      client, spouse, hasSpouse, hasChildren, children,
      clientEmails, spouseEmails,
      clientEmp, spouseEmp, incomes, autos, realEstate, accounts,
      beneficiaries, willsTrust, poa,
    };
    saveClient(record);
    setActiveClient(record.id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setClient({ ...emptyClient }); setSpouse({ ...emptySpouse });
    setClientEmails([{ id: 1, tag: "personal", address: "" }]);
    setSpouseEmails([{ id: 1, tag: "personal", address: "" }]);
    setClientEmp({ ...emptyEmployer }); setSpouseEmp({ ...emptyEmployer });
    setIncomes([{ ...emptyIncome, id: 1 }]);
    setAutos([{ ...emptyAuto, id: 1 }]);
    setRealEstate([{ ...emptyRealEstate, id: 1 }]);
    setAccounts([{ ...emptyAccount, id: 1 }]);
    setHasSpouse(null); setHasChildren(null); setChildren([]);
    setBeneficiaries([{ ...emptyBeneficiary, id: 1 }]);
    setWillsTrust({ hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
    setPoa({ hasPOA:null, poaType:null, agentName:"", agentRelationship:null, agentPhone:"", altAgent:"", poaDate:"", poaAttorney:"", poaLocation:"", poaNotes:"" });
    setUploads({});
    setActiveClient(null);
    setSubmitted(false);
  };

  if (view === "roster") {
    return (
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
          setIncomes(record.incomes || [{ ...emptyIncome, id: 1 }]);
          setAutos(record.autos || [{ ...emptyAuto, id: 1 }]);
          setRealEstate(record.realEstate || [{ ...emptyRealEstate, id: 1 }]);
          setAccounts(record.accounts || [{ ...emptyAccount, id: 1 }]);
          setBeneficiaries(record.beneficiaries || [{ ...emptyBeneficiary, id: 1 }]);
          setWillsTrust(record.willsTrust || { hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
          setPoa(record.poa || { hasPOA:null, poaType:null, agentName:"", agentRelationship:null, agentPhone:"", altAgent:"", poaDate:"", poaAttorney:"", poaLocation:"", poaNotes:"" });
          setUploads(record.uploads || {});
          setActiveClient(record.id);
          setSubmitted(false);
          setView("form");
          window.scrollTo(0, 0);
        }}
        onDelete={(id) => {
          const updated = savedClients.filter(c => c.id !== id);
          localStorage.setItem("rwg_clients", JSON.stringify(updated));
          setSavedClients(updated);
        }}
        onBack={() => setView("form")}
      />
    );
  }

  if (submitted) {
    const totalAssets = [
      ...accounts.map(a => parseInt((a.balance || "$0").replace(/[^0-9]/g, "") || 0)),
      ...realEstate.map(r => parseInt((r.marketValue || "$0").replace(/[^0-9]/g, "") || 0)),
    ].reduce((a, b) => a + b, 0);
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 16, padding: 36, maxWidth: 500, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>Intake Complete</div>
          <div style={{ fontSize: 15, color: WHITE, marginBottom: 4 }}>
            <span style={{ color: WHITE, fontWeight: "bold" }}>{client.firstName} {client.lastName}</span>'s profile has been recorded.
          </div>
          {["married","domestic_partner"].includes(hasSpouse) && (
            <div style={{ fontSize: 15, color: WHITE, marginBottom: 4 }}>
              Spouse <span style={{ color: WHITE, fontWeight: "bold" }}>{spouse.firstName} {spouse.lastName}</span> also recorded.
            </div>
          )}
          {totalAssets > 0 && (
            <div style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8, padding: "12px 18px", marginTop: 16, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Total Assets Captured</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: WHITE }}>${totalAssets.toLocaleString()}</div>
            </div>
          )}
          <button onClick={handleReset} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", marginTop: 16 }}>
            Start New Intake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 3000, background: toast.color, color: WHITE, padding: "12px 20px", borderRadius: 10, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ position: "fixed", top: 90, right: 20, zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <button
          onClick={() => { autoSave(); showToast(activeClientId ? "File updated" : "Draft saved", ACCENT); }}
          style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
        >
          💾 {activeClientId ? "Update File" : "Save Draft"}
        </button>
        {lastSaved && (
          <div style={{ fontSize: 10, color: WHITE, textAlign: "right", background: "rgba(26,47,94,0.85)", borderRadius: 5, padding: "2px 8px" }}>
            Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      <div style={{ background: NAV, padding: "24px 24px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell Wealth Group</h1>
            <p style={{ margin: 0, fontSize: 13, color: WHITE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              New Client Intake · Confidential
            </p>
          </div>
          <button onClick={() => setView("roster")} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}>
            Saved Clients ({savedClients.length})
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* ── SIDEBAR NAV ── */}
        <div style={{ width: 170, flexShrink: 0, position: "sticky", top: 24 }}>
          {[
            ["section-profile",   "Client Profile"],
            ["section-family",    "Family"],
            ["section-bene",      "Beneficiaries"],
            ["section-employment","Employment"],
            ["section-income",    "Income"],
            ["section-realestate","Real Estate"],
            ["section-accounts",  "Investment & Bank"],
            ["section-autos",     "Automobiles"],
            ["section-wills",     "Wills & Trust"],
            ["section-poa",       "Power of Attorney"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ display: "block", width: "100%", textAlign: "left", background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 12, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: "0.04em", lineHeight: 1.3 }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>

        {/* ── CLIENT PROFILE ── */}
        <Panel title="Client Profile" id="section-profile">
          <Row cols={3}>
            <F><Lbl t="First Name" /><input value={client.firstName} onChange={setC("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Middle Name" /><input value={client.middleName} onChange={setC("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Last Name" /><input value={client.lastName} onChange={setC("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={4}>
            <F><DatePicker label="Date of Birth" value={client.dob} onChange={v => setClient(p => ({ ...p, dob: v }))} /></F>
            <F><Lbl t="SSN" /><input value={client.ssn} onChange={e => setClient(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            <F>
              <Lbl t="Gender" />
              <select data-lpignore="true" value={client.gender || ""} onChange={setC("gender")} style={IS}>
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </F>
            <F>
              <Lbl t="Tax Filing Status" />
              <select data-lpignore="true" value={client.filingStatus || ""} onChange={setC("filingStatus")} style={IS}>
                <option value="">— Select —</option>
                <option value="Single">Single</option>
                <option value="Married Filing Jointly">Married Filing Jointly</option>
                <option value="Married Filing Separately">Married Filing Separately</option>
                <option value="Head of Household">Head of Household</option>
                <option value="Qualifying Surviving Spouse">Qualifying Surviving Spouse</option>
              </select>
            </F>
          </Row>
          <Lbl t="Email Addresses" />
          {clientEmails.map((em, i) => (
            <div key={em.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <select data-lpignore="true" value={em.tag} onChange={e => setClientEmails(p => p.map(x => x.id === em.id ? { ...x, tag: e.target.value } : x))} style={{ ...IS, width: 130, flex: "none" }}>
                <option value="personal">Personal</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="spouse">Spouse</option>
              </select>
              <input value={em.address} onChange={e => setClientEmails(p => p.map(x => x.id === em.id ? { ...x, address: e.target.value } : x))} type="email" placeholder="email@example.com" style={{ ...IS, flex: 1 }} autoComplete="new-password" data-lpignore="true" />
              {clientEmails.length > 1 && (
                <button onClick={() => window.confirm("Remove this email?") && setClientEmails(p => p.filter(x => x.id !== em.id))} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif", flex: "none" }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={() => setClientEmails(p => [...p, { id: Date.now(), tag: "personal", address: "" }])} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            + Add Email
          </button>
          <Row cols={2}>
            <F><Lbl t="Cell Phone" /><input value={client.cell} onChange={e => setClient(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Home Phone" /><input value={client.homePhone} onChange={e => setClient(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
          </Row>

          <Sec t="Driver's License" />
          <Row cols={3}>
            <F><Lbl t="License Number" /><input value={client.dlNumber} onChange={setC("dlNumber")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Issuing State" /><StateSelect value={client.dlState} onChange={setC("dlState")} /></F>
            <F><Lbl t="Issuer Name" /><input value={client.dlIssuerName} onChange={setC("dlIssuerName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={2}>
            <F><DatePicker label="Issue Date" value={client.dlIssueDate} onChange={v => setClient(p => ({ ...p, dlIssueDate: v }))} /></F>
            <F><DatePicker label="Expiration Date" futureYears={10} value={client.dlExpDate} onChange={v => setClient(p => ({ ...p, dlExpDate: v }))} /></F>
          </Row>

          <Sec t="Home Address" />
          <Row cols={2}>
            <F><Lbl t="Street Address" /><input value={client.addressLine1} onChange={setC("addressLine1")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Apt / Suite (optional)" /><input value={client.addressLine2} onChange={setC("addressLine2")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F>
              <Lbl t="ZIP" />
              <input
                value={client.zip}
                onChange={e => {
                  const z = fmtZip(e.target.value);
                  setClient(p => ({ ...p, zip: z }));
                  lookupZip(z, (city, state) => setClient(p => ({ ...p, city, state })));
                }}
                maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true"
              />
            </F>
            <F><Lbl t="City" /><input value={client.city} onChange={setC("city")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="State" /><StateSelect value={client.state} onChange={setC("state")} /></F>
          </Row>

          <div className="rg" style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "0 16px" }}>
            <F>
              <Lbl t="PO Box?" />
              <select data-lpignore="true" value={client.hasPOBox || ""} onChange={e => setClient(p => ({ ...p, hasPOBox: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
            <F>
              <Lbl t="Preferred Mailing Address" />
              <select data-lpignore="true" value={client.preferredMailing || ""} onChange={e => setClient(p => ({ ...p, preferredMailing: e.target.value || "" }))} style={IS}>
                <option value="">— Select —</option>
                <option value="physical">Physical Address</option>
                <option value="pobox">P.O. Box</option>
              </select>
            </F>
          </div>
          {client.hasPOBox === "yes" && (
            <div style={{ marginTop: 14, borderTop: "2px solid " + ACCENT, paddingTop: 14 }}>
              <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>PO Box Address</div>
              <Row cols={2}>
                <F>
                  <Lbl t="PO Box Number" />
                  <input
                    value={client.poBox}
                    onChange={setC("poBox")}
                    onBlur={e => setClient(p => ({ ...p, poBox: fmtPOBox(e.target.value) }))}
                    style={IS} autoComplete="new-password" data-lpignore="true"
                  />
                </F>
                <F><Lbl t="City" /><input value={client.poBoxCity} onChange={setC("poBoxCity")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F>
                  <Lbl t="ZIP" />
                  <input
                    value={client.poBoxZip}
                    onChange={e => {
                      const z = fmtZip(e.target.value);
                      setClient(p => ({ ...p, poBoxZip: z }));
                      lookupZip(z, (city, state) => setClient(p => ({ ...p, poBoxCity: city, poBoxState: state })));
                    }}
                    maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true"
                  />
                </F>
                <F><Lbl t="State" /><StateSelect value={client.poBoxState} onChange={setC("poBoxState")} /></F>
              </Row>
            </div>
          )}
          <FileUpload section="client_profile" files={uploads.client_profile || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── FAMILY ── */}
        <Panel title="Family" id="section-family">
          <Row cols={2}>
            <F>
              <Lbl t="Marital Status" />
              <select data-lpignore="true" value={hasSpouse || ""} onChange={e => setHasSpouse(e.target.value || null)} style={IS}>
                <option value="">— Select —</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="domestic_partner">Domestic Partner</option>
              </select>
            </F>
            <F>
              <Lbl t="Children?" />
              <select data-lpignore="true" value={hasChildren || ""} onChange={e => {
                setHasChildren(e.target.value || null);
                if (e.target.value === "yes" && children.length === 0) setChildren([{ ...emptyChild, id: Date.now() }]);
                if (e.target.value === "no") setChildren([]);
              }} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
          </Row>

          {["married","domestic_partner"].includes(hasSpouse) && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Spouse Details</div>
              <Row cols={3}>
                <F><Lbl t="First Name" /><input value={spouse.firstName} onChange={setS("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle Name" /><input value={spouse.middleName} onChange={setS("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last Name" /><input value={spouse.lastName} onChange={setS("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F><DatePicker label="Date of Birth" value={spouse.dob} onChange={v => setSpouse(p => ({ ...p, dob: v }))} /></F>
                <F><Lbl t="SSN" /><input value={spouse.ssn} onChange={e => setSpouse(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Gender" />
                  <select data-lpignore="true" value={spouse.gender || ""} onChange={setS("gender")} style={IS}>
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </F>
              </Row>
              <Lbl t="Email Addresses" />
              {spouseEmails.map((em) => (
                <div key={em.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <select data-lpignore="true" value={em.tag} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, tag: e.target.value } : x))} style={{ ...IS, width: 130, flex: "none" }}>
                    <option value="personal">Personal</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="spouse">Spouse</option>
                  </select>
                  <input value={em.address} onChange={e => setSpouseEmails(p => p.map(x => x.id === em.id ? { ...x, address: e.target.value } : x))} type="email" placeholder="email@example.com" style={{ ...IS, flex: 1 }} autoComplete="new-password" data-lpignore="true" />
                  {spouseEmails.length > 1 && (
                    <button onClick={() => window.confirm("Remove this email?") && setSpouseEmails(p => p.filter(x => x.id !== em.id))} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif", flex: "none" }}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setSpouseEmails(p => [...p, { id: Date.now(), tag: "personal", address: "" }])} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                + Add Email
              </button>
              <Row cols={2}>
                <F><Lbl t="Cell Phone" /><input value={spouse.cell} onChange={e => setSpouse(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Home Phone" /><input value={spouse.homePhone || ""} onChange={e => setSpouse(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>

              <Sec t="Driver's License" />
              <Row cols={3}>
                <F><Lbl t="License Number" /><input value={spouse.dlNumber} onChange={setS("dlNumber")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Issuing State" /><StateSelect value={spouse.dlState} onChange={setS("dlState")} /></F>
                <F><Lbl t="Issuer Name" /><input value={spouse.dlIssuerName} onChange={setS("dlIssuerName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><DatePicker label="Issue Date" value={spouse.dlIssueDate} onChange={v => setSpouse(p => ({ ...p, dlIssueDate: v }))} /></F>
                <F><DatePicker label="Expiration Date" futureYears={10} value={spouse.dlExpDate} onChange={v => setSpouse(p => ({ ...p, dlExpDate: v }))} /></F>
              </Row>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 10, borderTop: "1px solid " + ACCENT, paddingTop: 12 }}>
                <Sec t="Home Address" />
                <button onClick={() => setSpouse(p => ({ ...p, addressLine1: client.addressLine1, addressLine2: client.addressLine2, city: client.city, state: client.state, zip: client.zip, hasPOBox: client.hasPOBox, poBox: client.poBox, poBoxCity: client.poBoxCity, poBoxState: client.poBoxState, poBoxZip: client.poBoxZip, preferredMailing: client.preferredMailing }))} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif", marginBottom: 10 }}>
                  Copy Client Address?
                </button>
              </div>
              <Row cols={2}>
                <F><Lbl t="Street Address" /><input value={spouse.addressLine1 || ""} onChange={setS("addressLine1")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Apt / Suite (optional)" /><input value={spouse.addressLine2 || ""} onChange={setS("addressLine2")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F>
                  <Lbl t="ZIP" />
                  <input
                    value={spouse.zip || ""}
                    onChange={e => {
                      const z = fmtZip(e.target.value);
                      setSpouse(p => ({ ...p, zip: z }));
                      lookupZip(z, (city, state) => setSpouse(p => ({ ...p, city, state })));
                    }}
                    maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true"
                  />
                </F>
                <F><Lbl t="City" /><input value={spouse.city || ""} onChange={setS("city")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="State" /><StateSelect value={spouse.state || ""} onChange={setS("state")} /></F>
              </Row>

              <div className="rg" style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "0 16px" }}>
                <F>
                  <Lbl t="PO Box?" />
                  <select data-lpignore="true" value={spouse.hasPOBox || ""} onChange={e => setSpouse(p => ({ ...p, hasPOBox: e.target.value || null }))} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                <F>
                  <Lbl t="Preferred Mailing Address" />
                  <select data-lpignore="true" value={spouse.preferredMailing || ""} onChange={e => setSpouse(p => ({ ...p, preferredMailing: e.target.value || "" }))} style={IS}>
                    <option value="">— Select —</option>
                    <option value="physical">Physical Address</option>
                    <option value="pobox">P.O. Box</option>
                  </select>
                </F>
              </div>
              {spouse.hasPOBox === "yes" && (
                <div style={{ marginTop: 14, borderTop: "2px solid " + ACCENT, paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>PO Box Address</div>
                  <Row cols={2}>
                    <F>
                      <Lbl t="PO Box Number" />
                      <input
                        value={spouse.poBox || ""}
                        onChange={setS("poBox")}
                        onBlur={e => setSpouse(p => ({ ...p, poBox: fmtPOBox(e.target.value) }))}
                        style={IS} autoComplete="new-password" data-lpignore="true"
                      />
                    </F>
                    <F><Lbl t="City" /><input value={spouse.poBoxCity || ""} onChange={setS("poBoxCity")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={2}>
                    <F>
                      <Lbl t="ZIP" />
                      <input
                        value={spouse.poBoxZip || ""}
                        onChange={e => {
                          const z = fmtZip(e.target.value);
                          setSpouse(p => ({ ...p, poBoxZip: z }));
                          lookupZip(z, (city, state) => setSpouse(p => ({ ...p, poBoxCity: city, poBoxState: state })));
                        }}
                        maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true"
                      />
                    </F>
                    <F><Lbl t="State" /><StateSelect value={spouse.poBoxState || ""} onChange={setS("poBoxState")} /></F>
                  </Row>
                </div>
              )}
            </div>
          )}

          {hasChildren === "yes" && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              {children.map((ch, i) => (
                <div key={ch.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Child {i + 1}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setChildren(p => p.map(x => x.id === ch.id ? { ...x, lastName: client.lastName, addressLine1: client.addressLine1, addressLine2: client.addressLine2, city: client.city, state: client.state, zip: client.zip } : x))} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif" }}>Copy Client Info</button>
                      {children.length > 1 && (
                        <button onClick={() => window.confirm("Remove this child?") && setChildren(p => p.filter(x => x.id !== ch.id))} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                      )}
                    </div>
                  </div>
                  <Row cols={3}>
                    <F><Lbl t="First Name" /><input value={ch.firstName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, firstName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Middle Name" /><input value={ch.middleName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, middleName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Last Name" /><input value={ch.lastName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, lastName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={3}>
                    <F><DatePicker label="Date of Birth" value={ch.dob} onChange={v => setChildren(p => p.map(x => x.id === ch.id ? { ...x, dob: v } : x))} /></F>
                    <F>
                      <Lbl t="Gender" />
                      <select data-lpignore="true" value={ch.gender || ""} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, gender: e.target.value } : x))} style={IS}>
                        <option value="">— Select —</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </F>
                    <F>
                      <Lbl t="Beneficiary?" />
                      <select data-lpignore="true" value={ch.isBeneficiary ? "yes" : "no"} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, isBeneficiary: e.target.value === "yes" } : x))} style={IS}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </F>
                  </Row>
                  {ch.isBeneficiary && (
                    <div style={{ marginTop: 14, borderTop: "2px solid " + ACCENT, paddingTop: 14 }}>
                      <div style={{ fontSize: 11, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Beneficiary Information</div>
                      <Row cols={3}>
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
                          <Lbl t="% to Inherit" />
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              value={(ch.percentage || "").replace("%", "")}
                              onChange={e => { const raw = e.target.value.replace(/[^0-9.]/g, ""); setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: raw } : x)); }}
                              onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: Math.min(100, Math.max(0, n)) + "%" } : x)); else if (!e.target.value) setChildren(p => p.map(x => x.id === ch.id ? { ...x, percentage: "" } : x)); }}
                              style={{ ...IS, width: "100%" }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" placeholder="0"
                            />
                            <span style={{ color: WHITE, fontSize: 15, whiteSpace: "nowrap" }}>%</span>
                          </div>
                        </F>
                      </Row>
                      <Row cols={2}>
                        <F><Lbl t="Email" /><input value={ch.email} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, email: e.target.value } : x))} type="email" style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                        <F><Lbl t="Phone" /><input value={ch.phone} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, phone: fmtPhone(e.target.value) } : x))} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="(555) 555-5555" /></F>
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
              <button onClick={() => setChildren(p => [...p, { ...emptyChild, id: Date.now() }])} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
                + Add Child
              </button>
            </div>
          )}
          <FileUpload section="family" files={uploads.family || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── BENEFICIARIES ── */}
        <Panel title="Beneficiaries" id="section-bene">
          {children.filter(ch => ch.isBeneficiary).map((ch, i) => (
            <div key={ch.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: "bold" }}>
                  Child Beneficiary — {ch.firstName} {ch.lastName}
                </div>
                <div style={{ fontSize: 11, color: WHITE, fontStyle: "italic" }}>Edit in Family section</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", fontSize: 13, color: WHITE }}>
                {ch.firstName && <div><span style={{ color: WHITE }}>Name: </span>{ch.firstName} {ch.middleName} {ch.lastName}</div>}
                {ch.dob && <div><span style={{ color: WHITE }}>DOB: </span>{ch.dob}</div>}
                {ch.gender && <div><span style={{ color: WHITE }}>Gender: </span>{ch.gender}</div>}
                {ch.ssn && <div><span style={{ color: WHITE }}>SSN: </span>{ch.ssn}</div>}
                {ch.relationship && <div><span style={{ color: WHITE }}>Relationship: </span>{ch.relationship}</div>}
                {ch.percentage && <div><span style={{ color: WHITE }}>% to Inherit: </span>{ch.percentage}</div>}
                {ch.email && <div><span style={{ color: WHITE }}>Email: </span>{ch.email}</div>}
                {ch.phone && <div><span style={{ color: WHITE }}>Phone: </span>{ch.phone}</div>}
                {ch.addressLine1 && <div style={{ gridColumn: "span 2" }}><span style={{ color: WHITE }}>Address: </span>{ch.addressLine1}{ch.addressLine2 ? ", " + ch.addressLine2 : ""}{ch.city ? ", " + ch.city : ""}{ch.state ? ", " + ch.state : ""}{ch.zip ? " " + ch.zip : ""}</div>}
              </div>
            </div>
          ))}
          {children.filter(ch => ch.isBeneficiary).length > 0 && (
            <div style={{ fontSize: 11, color: WHITE, fontStyle: "italic", marginBottom: 14, textAlign: "center" }}>
              ↑ Child beneficiaries added in Family section &nbsp;·&nbsp; Additional beneficiaries below
            </div>
          )}
          {beneficiaries.map((b, i) => (
            <div key={b.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Beneficiary {i + 1}</div>
                {beneficiaries.length > 1 && (
                  <button onClick={() => window.confirm("Remove this beneficiary?") && delBene(b.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={3}>
                <F><Lbl t="First Name" /><input value={b.firstName} onChange={e => updBene(b.id, "firstName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle Name" /><input value={b.middleName} onChange={e => updBene(b.id, "middleName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last Name" /><input value={b.lastName} onChange={e => updBene(b.id, "lastName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={4}>
                <F><DatePicker label="Date of Birth" value={b.dob} onChange={v => updBene(b.id, "dob", v)} /></F>
                <F>
                  <Lbl t="Gender" />
                  <select data-lpignore="true" value={b.gender || ""} onChange={e => updBene(b.id, "gender", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </F>
                <F><Lbl t="SSN" /><input value={b.ssn} onChange={e => updBene(b.id, "ssn", fmtSSN(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Relationship" />
                  <select data-lpignore="true" value={b.relationship} onChange={e => updBene(b.id, "relationship", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Email Address" /><input value={b.email} onChange={e => updBene(b.id, "email", e.target.value)} type="email" style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="% to Inherit" />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      value={(b.percentage || "").replace("%", "")}
                      onChange={e => { const raw = e.target.value.replace(/[^0-9.]/g, ""); updBene(b.id, "percentage", raw); }}
                      onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) updBene(b.id, "percentage", Math.min(100, Math.max(0, n)) + "%"); else if (!e.target.value) updBene(b.id, "percentage", ""); }}
                      style={{ ...IS, width: "100%" }} inputMode="decimal" autoComplete="new-password" data-lpignore="true" placeholder="0"
                    />
                    <span style={{ color: WHITE, fontSize: 15, whiteSpace: "nowrap" }}>%</span>
                  </div>
                </F>
              </Row>
              <Lbl t="Address" />
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
              }} style={IS}>
                <option value="manual">Enter Manually</option>
                <option value="client">Same as {client.firstName || "Client"}</option>
                {["married","domestic_partner"].includes(hasSpouse) && <option value="spouse">Same as {spouse.firstName || "Spouse"}</option>}
              </select>
              {(() => {
                const src = b.addressSource || "manual";
                const addrLine = src !== "manual" ? client.addressLine1 : b.addressLine1;
                const addrCity = src !== "manual" ? client.city : b.city;
                const addrState = src !== "manual" ? client.state : b.state;
                const addrZip = src !== "manual" ? client.zip : b.zip;
                const readOnly = b.addressSource !== "manual";
                const roStyle = { ...IS, background: NAV, color: WHITE };
                return readOnly ? (
                  <div style={{ marginTop: 6, background: NAV, border: "2px solid " + ACCENT, borderRadius: 8, padding: "9px 13px", color: WHITE, fontSize: 14 }}>
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
          ))}
          {(() => {
            const total = beneficiaries.reduce((sum, b) => {
              const n = parseFloat((b.percentage || "").replace("%", "") || 0);
              return sum + (isNaN(n) ? 0 : n);
            }, 0);
            if (!total) return null;
            const over = total > 100;
            return (
              <div style={{ background: NAV, border: "2px solid " + (over ? "#c0392b" : ACCENT), borderRadius: 8, padding: "10px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Allocated</span>
                <span style={{ fontSize: 17, fontWeight: "bold", color: over ? "#e74c3c" : (total === 100 ? "#2ecc71" : WHITE) }}>{total}%{over ? " — exceeds 100%" : total === 100 ? " ✓" : ""}</span>
              </div>
            );
          })()}
          <button onClick={addBene} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Beneficiary
          </button>
          <FileUpload section="beneficiaries" files={uploads.beneficiaries || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── EMPLOYMENT ── */}
        <Panel title="Employment" id="section-employment">
          {["married","domestic_partner"].includes(hasSpouse) && (
            <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              {client.firstName || "Client"}
            </div>
          )}
          <Row cols={2}>
            <F><Lbl t="Employer Name" /><input value={clientEmp.employer} onChange={setCE("employer")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Occupation / Title" /><input value={clientEmp.occupation} onChange={setCE("occupation")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><DatePicker label="Start Date" value={clientEmp.startDate} onChange={v => setClientEmp(p => ({ ...p, startDate: v }))} /></F>
            <F><Lbl t="Work Phone" /><input value={clientEmp.workPhone} onChange={e => setClientEmp(p => ({ ...p, workPhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            <F>
              <Lbl t="Pay Frequency" />
              <select data-lpignore="true" value={clientEmp.payFrequency || ""} onChange={e => setClientEmp(p => ({ ...p, payFrequency: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="bimonthly">Bi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </F>
          </Row>
          <Row cols={2}>
            <F>
              <Lbl t="ZIP" />
              <input value={clientEmp.workZip} onChange={e => { const z = fmtZip(e.target.value); setClientEmp(p => ({ ...p, workZip: z })); lookupZip(z, (city, state) => setClientEmp(p => ({ ...p, workCity: city, workState: state }))); }} maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true" />
            </F>
            <F><Lbl t="Work Street Address" /><input value={clientEmp.workAddress} onChange={setCE("workAddress")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={2}>
            <F><Lbl t="City" /><input value={clientEmp.workCity} onChange={setCE("workCity")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="State" /><StateSelect value={clientEmp.workState} onChange={setCE("workState")} /></F>
          </Row>

          <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Employer Retirement Plan</div>
            <Row cols={2}>
              <F>
                <Lbl t="Has Retirement Plan?" />
                <select data-lpignore="true" value={clientEmp.hasRetirement || ""} onChange={e => setClientEmp(p => ({ ...p, hasRetirement: e.target.value || null }))} style={IS}>
                  <option value="">— Select —</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </F>
              {clientEmp.hasRetirement === "yes" && (
                <F>
                  <Lbl t="Type of Plan" />
                  <select data-lpignore="true" value={clientEmp.retirementType || ""} onChange={e => setClientEmp(p => ({ ...p, retirementType: e.target.value || null }))} style={IS}>
                    <option value="">— Select —</option>
                    <option>401(k)</option><option>Roth 401(k)</option><option>403(b)</option><option>Roth 403(b)</option>
                    <option>457(b)</option><option>457(f)</option><option>TMRS</option><option>TRS</option>
                    <option>ORP</option><option>ESOP</option><option>SIMPLE IRA</option><option>SEP IRA</option>
                    <option>Pension / Defined Benefit</option><option>Stock Option / ESPP</option><option>Other</option>
                  </select>
                </F>
              )}
            </Row>
            {clientEmp.hasRetirement === "yes" && (
              <>
                <Row cols={2}>
                  <F><Lbl t="Employee Contribution" /><input value={clientEmp.contributionAmt} onChange={e => setClientEmp(p => ({ ...p, contributionAmt: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                  <F>
                    <Lbl t="Employer Match" />
                    <select data-lpignore="true" value={clientEmp.matchPct || ""} onChange={e => setClientEmp(p => ({ ...p, matchPct: e.target.value }))} style={IS}>
                      <option value="">— Select —</option>
                      <option value="No Match">No Match</option>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                    </select>
                  </F>
                </Row>
                <Row cols={2}>
                  <F><Lbl t="Current Balance" /><input value={clientEmp.retirementBalance} onChange={e => setClientEmp(p => ({ ...p, retirementBalance: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                  <F>
                    <Lbl t="Custodian / Plan Sponsor" />
                    <select data-lpignore="true" value={clientEmp.retirementCustodian || ""} onChange={e => setClientEmp(p => ({ ...p, retirementCustodian: e.target.value, retirementCustodianOther: "" }))} style={IS}>
                      <option value="">— Select —</option>
                      <option>Fidelity</option><option>Empower</option><option>Vanguard</option><option>Schwab</option>
                      <option>T. Rowe Price</option><option>Principal</option><option>Prudential</option><option>Transamerica</option>
                      <option>Lincoln Financial</option><option>John Hancock</option><option>Nationwide</option><option>MassMutual</option>
                      <option>Ameritas</option><option>TIAA</option><option>PEBA / State Plan</option><option>Other</option>
                    </select>
                    {clientEmp.retirementCustodian === "Other" && (
                      <input value={clientEmp.retirementCustodianOther || ""} onChange={e => setClientEmp(p => ({ ...p, retirementCustodianOther: e.target.value }))} style={{ ...IS, marginTop: 6 }} placeholder="Specify custodian" autoComplete="new-password" data-lpignore="true" />
                    )}
                  </F>
                </Row>
              </>
            )}
          </div>

          {["married","domestic_partner"].includes(hasSpouse) && (
            <>
              <div style={{ borderTop: "2px solid " + ACCENT, marginTop: 18, paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{spouse.firstName || "Spouse"}</div>
              </div>
              <Row cols={2}>
                <F><Lbl t="Employer Name" /><input value={spouseEmp.employer} onChange={setSE("employer")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Occupation / Title" /><input value={spouseEmp.occupation} onChange={setSE("occupation")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F><DatePicker label="Start Date" value={spouseEmp.startDate} onChange={v => setSpouseEmp(p => ({ ...p, startDate: v }))} /></F>
                <F><Lbl t="Work Phone" /><input value={spouseEmp.workPhone} onChange={e => setSpouseEmp(p => ({ ...p, workPhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Pay Frequency" />
                  <select data-lpignore="true" value={spouseEmp.payFrequency || ""} onChange={e => setSpouseEmp(p => ({ ...p, payFrequency: e.target.value || null }))} style={IS}>
                    <option value="">— Select —</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="bimonthly">Bi-Monthly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </F>
              </Row>
              <Row cols={2}>
                <F>
                  <Lbl t="ZIP" />
                  <input value={spouseEmp.workZip} onChange={e => { const z = fmtZip(e.target.value); setSpouseEmp(p => ({ ...p, workZip: z })); lookupZip(z, (city, state) => setSpouseEmp(p => ({ ...p, workCity: city, workState: state }))); }} maxLength={10} style={IS} autoComplete="new-password" data-lpignore="true" />
                </F>
                <F><Lbl t="Work Street Address" /><input value={spouseEmp.workAddress} onChange={setSE("workAddress")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="City" /><input value={spouseEmp.workCity} onChange={setSE("workCity")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="State" /><StateSelect value={spouseEmp.workState} onChange={setSE("workState")} /></F>
              </Row>
              <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Employer Retirement Plan</div>
                <Row cols={2}>
                  <F>
                    <Lbl t="Has Retirement Plan?" />
                    <select data-lpignore="true" value={spouseEmp.hasRetirement || ""} onChange={e => setSpouseEmp(p => ({ ...p, hasRetirement: e.target.value || null }))} style={IS}>
                      <option value="">— Select —</option>
                      <option value="yes">Yes</option><option value="no">No</option>
                    </select>
                  </F>
                  {spouseEmp.hasRetirement === "yes" && (
                    <F>
                      <Lbl t="Type of Plan" />
                      <select data-lpignore="true" value={spouseEmp.retirementType || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementType: e.target.value || null }))} style={IS}>
                        <option value="">— Select —</option>
                        <option>401(k)</option><option>Roth 401(k)</option><option>403(b)</option><option>Roth 403(b)</option>
                    <option>457(b)</option><option>457(f)</option><option>TMRS</option><option>TRS</option>
                    <option>ORP</option><option>ESOP</option><option>SIMPLE IRA</option><option>SEP IRA</option>
                    <option>Pension / Defined Benefit</option><option>Stock Option / ESPP</option><option>Other</option>
                      </select>
                    </F>
                  )}
                </Row>
                {spouseEmp.hasRetirement === "yes" && (
                  <>
                    <Row cols={2}>
                      <F><Lbl t="Employee Contribution" /><input value={spouseEmp.contributionAmt} onChange={e => setSpouseEmp(p => ({ ...p, contributionAmt: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" /></F>
                      <F>
                        <Lbl t="Employer Match" />
                        <select data-lpignore="true" value={spouseEmp.matchPct || ""} onChange={e => setSpouseEmp(p => ({ ...p, matchPct: e.target.value }))} style={IS}>
                          <option value="">— Select —</option>
                          <option value="No Match">No Match</option>
                          {[1,2,3,4,5,6].map(n => <option key={n} value={n + "%"}>{n}%</option>)}
                        </select>
                      </F>
                    </Row>
                    <Row cols={2}>
                      <F><Lbl t="Current Balance" /><input value={spouseEmp.retirementBalance} onChange={e => setSpouseEmp(p => ({ ...p, retirementBalance: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                      <F>
                        <Lbl t="Custodian / Plan Sponsor" />
                        <select data-lpignore="true" value={spouseEmp.retirementCustodian || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementCustodian: e.target.value, retirementCustodianOther: "" }))} style={IS}>
                          <option value="">— Select —</option>
                          <option>Fidelity</option><option>Empower</option><option>Vanguard</option><option>Schwab</option>
                          <option>T. Rowe Price</option><option>Principal</option><option>Prudential</option><option>Transamerica</option>
                          <option>Lincoln Financial</option><option>John Hancock</option><option>Nationwide</option><option>MassMutual</option>
                          <option>Ameritas</option><option>TIAA</option><option>PEBA / State Plan</option><option>Other</option>
                        </select>
                        {spouseEmp.retirementCustodian === "Other" && (
                          <input value={spouseEmp.retirementCustodianOther || ""} onChange={e => setSpouseEmp(p => ({ ...p, retirementCustodianOther: e.target.value }))} style={{ ...IS, marginTop: 6 }} placeholder="Specify custodian" autoComplete="new-password" data-lpignore="true" />
                        )}
                      </F>
                    </Row>
                  </>
                )}
              </div>
            </>
          )}
          <FileUpload section="employment" files={uploads.employment || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── ANNUAL INCOME ── */}
        <Panel title="Income" id="section-income">
          {incomes.map((inc, i) => (
            <div key={inc.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Income Source {i + 1}</div>
                {incomes.length > 1 && (
                  <button onClick={() => window.confirm("Remove this income source?") && delIncome(inc.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={3}>
                <F>
                  <Lbl t="Income Type" />
                  <select data-lpignore="true" value={inc.type} onChange={e => updIncome(inc.id, "type", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </F>
                <F>
                  <Lbl t="Frequency" />
                  <select data-lpignore="true" value={inc.frequency || ""} onChange={e => updIncome(inc.id, "frequency", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="bimonthly">Bi-Monthly (twice/month)</option>
                    <option value="biweekly">Bi-Weekly (every 2 weeks)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </F>
                <F>
                  <Lbl t="Belongs To" />
                  <select data-lpignore="true" value={inc.owner || "client"} onChange={e => updIncome(inc.id, "owner", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="client">{client.firstName || "Client"}</option>
                    <option value="spouse">{spouse.firstName || "Spouse"}</option>
                    <option value="joint">Joint</option>
                  </select>
                </F>
              </Row>
              {inc.frequency && (
                <Row cols={2}>
                  <F>
                    <Lbl t={{ annual:"Annual Amount", monthly:"Monthly Amount", bimonthly:"Bi-Monthly Amount", biweekly:"Bi-Weekly Amount", weekly:"Weekly Amount" }[inc.frequency] || "Amount"} />
                    <input value={inc.amount} onChange={e => updIncome(inc.id, "amount", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
                  </F>
                  <F>
                    <Lbl t="Annual Equivalent" />
                    <div style={{ ...IS, background: NAV, color: WHITE, display: "flex", alignItems: "center" }}>
                      {(() => {
                        const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0);
                        if (!raw) return "—";
                        const mult = { annual:1, monthly:12, bimonthly:24, biweekly:26, weekly:52 }[inc.frequency] || 1;
                        return "$" + (inc.frequency === "annual" ? raw : raw * mult).toLocaleString();
                      })()}
                    </div>
                  </F>
                </Row>
              )}
            </div>
          ))}
          <button onClick={addIncome} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Income Source
          </button>
          {(() => {
            const toAnnual = inc => { const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0); if (!raw || !inc.frequency) return 0; const mult = { annual:1, monthly:12, bimonthly:24, biweekly:26, weekly:52 }[inc.frequency] || 1; return raw * mult; };
            const clientAnnual = incomes.filter(i => (i.owner || "client") === "client").reduce((s, i) => s + toAnnual(i), 0);
            const spouseAnnual = incomes.filter(i => i.owner === "spouse").reduce((s, i) => s + toAnnual(i), 0);
            const jointAnnual = incomes.filter(i => i.owner === "joint").reduce((s, i) => s + toAnnual(i), 0);
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
              <div style={{ marginTop: 14, background: NAV, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                  Estimated Tax Summary — Filing {married ? "Married Filing Jointly" : "Single"}
                </div>
                {clientAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: WHITE }}>Client Income ({client.firstName || "Client"})</span>
                    <span style={{ fontSize: 14, color: WHITE }}>${clientAnnual.toLocaleString()}</span>
                  </div>
                )}
                {spouseAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: WHITE }}>Spouse Income ({spouse.firstName || "Spouse"})</span>
                    <span style={{ fontSize: 14, color: WHITE }}>${spouseAnnual.toLocaleString()}</span>
                  </div>
                )}
                {jointAnnual > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: WHITE }}>Joint Income</span>
                    <span style={{ fontSize: 14, color: WHITE }}>${jointAnnual.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderTop: "1px solid " + ACCENT, paddingTop: 8 }}>
                  <span style={{ fontSize: 13, color: WHITE }}>Total Gross Income</span>
                  <span style={{ fontSize: 15, fontWeight: "bold", color: WHITE }}>${totalAnnual.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: WHITE }}>Marginal Tax Bracket</span>
                  <span style={{ fontSize: 20, fontWeight: "bold", background: rateColor, color: WHITE, borderRadius: 7, padding: "3px 16px" }}>{bracket.rate}%</span>
                </div>
                <div style={{ fontSize: 11, color: WHITE, marginTop: 10, fontStyle: "italic" }}>
                  Based on 2024 IRS brackets · Does not account for deductions, credits, or other adjustments
                </div>
              </div>
            );
          })()}
          <FileUpload section="income" files={uploads.income || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── REAL ESTATE ── */}
        <Panel title="Real Estate" id="section-realestate">
          {realEstate.map((r, i) => (
            <div key={r.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Property {i + 1}</div>
                {realEstate.length > 1 && (
                  <button onClick={() => window.confirm("Remove this property?") && delRE(r.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Lbl t="Property Description" />
              <select data-lpignore="true" value={r.description} onChange={e => updRE(r.id, "description", e.target.value)} style={IS}>
                <option value="">— Select —</option>
                <option>Personal Residence</option><option>Land</option><option>Acreage</option><option>Rental Property</option>
              </select>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 4 }}>
                <Lbl t="Property Address" />
                {r.description === "Personal Residence" && (
                  <button onClick={() => updRE(r.id, "address", [client.addressLine1, client.addressLine2, client.city, client.state, client.zip].filter(Boolean).join(", "))} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif" }}>
                    Copy Client Address?
                  </button>
                )}
              </div>
              <input value={r.address} onChange={e => updRE(r.id, "address", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" />
              <Row cols={3}>
                <F><DatePicker label="Purchase Date" value={r.purchaseDate} onChange={v => updRE(r.id, "purchaseDate", v)} /></F>
                <F><Lbl t="Purchase Price" /><input value={r.purchasePrice} onChange={e => updRE(r.id, "purchasePrice", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Market Value" /><input value={r.marketValue} onChange={e => updRE(r.id, "marketValue", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Mortgage Balance" /><input value={r.mortgageBalance} onChange={e => updRE(r.id, "mortgageBalance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Net Equity" />
                  <div style={{ ...IS, background: NAV, color: WHITE, display: "flex", alignItems: "center" }}>
                    {(() => {
                      const mv = parseInt((r.marketValue || "").replace(/[^0-9]/g, "") || 0);
                      const mb = parseInt((r.mortgageBalance || "").replace(/[^0-9]/g, "") || 0);
                      return mv > 0 ? "$" + (mv - mb).toLocaleString() : "—";
                    })()}
                  </div>
                </F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Mortgage Company" /><input value={r.mortgageCompany} onChange={e => updRE(r.id, "mortgageCompany", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><DatePicker label="Origination Date" value={r.originationDate} onChange={v => updRE(r.id, "originationDate", v)} /></F>
              </Row>
              <Row cols={3}>
                <F><Lbl t="Interest Rate (%)" /><input value={r.interestRate} onChange={e => updRE(r.id, "interestRate", e.target.value.replace(/[^0-9.]/g, ""))} style={IS} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Monthly Payment" /><input value={r.monthlyPmt} onChange={e => updRE(r.id, "monthlyPmt", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Property Taxes (Annual)" /><input value={r.propertyTaxes} onChange={e => updRE(r.id, "propertyTaxes", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Insurance (Annual)" /><input value={r.insurance} onChange={e => updRE(r.id, "insurance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
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
            </div>
          ))}
          <button onClick={addRE} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Property
          </button>
          <FileUpload section="realestate" files={uploads.realestate || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── INVESTMENT & BANK ACCOUNTS ── */}
        <Panel title="Investment & Bank Accounts" id="section-accounts">
          {accounts.map((a, i) => (
            <div key={a.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Account {i + 1}</div>
                {accounts.length > 1 && (
                  <button onClick={() => window.confirm("Remove this account?") && delAcct(a.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={2}>
                <F>
                  <Lbl t="Account Type" />
                  <select data-lpignore="true" value={a.type} onChange={e => updAcct(a.id, "type", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </F>
                <F>
                  <Lbl t="Institution / Held At" />
                  <select data-lpignore="true" value={a.institution} onChange={e => updAcct(a.id, "institution", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option>Allianz</option>
                    <option>American Equity</option>
                    <option>American Funds</option>
                    <option>Ameritas</option>
                    <option>Athene</option>
                    <option>Bank of America</option>
                    <option>Chase / JPMorgan</option>
                    <option>Edward Jones</option>
                    <option>Empower</option>
                    <option>Equitable</option>
                    <option>F&G</option>
                    <option>Fidelity</option>
                    <option>Franklin Templeton</option>
                    <option>Global Atlantic</option>
                    <option>Jackson Nat'l</option>
                    <option>John Hancock</option>
                    <option>Lincoln Financial</option>
                    <option>MassMutual</option>
                    <option>Merrill Lynch</option>
                    <option>Midland National</option>
                    <option>Minnesota Life</option>
                    <option>Morgan Stanley</option>
                    <option>Mutual of Omaha</option>
                    <option>Nationwide</option>
                    <option>North American</option>
                    <option>Northwestern Mutual</option>
                    <option>Pacific Life</option>
                    <option>Principal</option>
                    <option>Protective Life</option>
                    <option>Prudential</option>
                    <option>Raymond James</option>
                    <option>Sammons / Midland</option>
                    <option>Schwab</option>
                    <option>Security Benefit</option>
                    <option>Symetra</option>
                    <option>T. Rowe Price</option>
                    <option>TIAA</option>
                    <option>Transamerica</option>
                    <option>Vanguard</option>
                    <option>Voya</option>
                    <option>Wells Fargo</option>
                    <option>Other</option>
                  </select>
                </F>
              </Row>
              {a.institution === "Other" && (
                <><Lbl t="Specify Institution" /><input value={a.institutionOther || ""} onChange={e => updAcct(a.id, "institutionOther", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></>
              )}
              <Row cols={3}>
                <F><Lbl t="Account Number" /><input value={a.accountNumber || ""} onChange={e => updAcct(a.id, "accountNumber", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Balance" /><input value={a.balance} onChange={e => updAcct(a.id, "balance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Owner" />
                  <select data-lpignore="true" value={a.owner} onChange={e => updAcct(a.id, "owner", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="Client">{client.firstName || "Client"}</option>
                    <option value="Spouse">{spouse.firstName || "Spouse"}</option>
                    <option value="Joint">Joint</option>
                  </select>
                </F>
              </Row>
              <Row cols={2}>
                <F>
                  <Lbl t="Making Contributions?" />
                  <select data-lpignore="true" value={a.hasRmdOrContrib || ""} onChange={e => { const v = e.target.value; if (v === "yes" || v === "no") { toggleAcctRmd(a, v); } else { updAcct(a.id, "hasRmdOrContrib", null); } }} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                <F>
                    <Lbl t="RMD or Withdrawal?" />
                    <select data-lpignore="true" value={a.rmdOrContrib || ""} onChange={e => syncAcctIncome(a, "rmdOrContrib", e.target.value)} style={IS}>
                      <option value="">— Select —</option>
                      <option value="RMD">RMD (Required Minimum Distribution)</option>
                      <option value="Withdrawal">Withdrawal</option>
                    </select>
                  </F>
              </Row>
              {a.hasRmdOrContrib === "yes" && (
                <Row cols={2}>
                  <F>
                    <Lbl t="Amount" />
                    <input value={a.rmdContribAmount || ""} onChange={e => syncAcctIncome(a, "rmdContribAmount", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" />
                  </F>
                  <F>
                    <Lbl t="Frequency" />
                    <select data-lpignore="true" value={a.rmdContribFrequency || ""} onChange={e => syncAcctIncome(a, "rmdContribFrequency", e.target.value)} style={IS}>
                      <option value="">— Select —</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </F>
                </Row>
              )}
              <Row cols={2}>
                <F>
                  <Lbl t="Making Contributions — How Much?" />
                  <input value={a.contribAmount || ""} onChange={e => updAcct(a.id, "contribAmount", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="$0" />
                </F>
                <F>
                  <Lbl t="Contribution Frequency" />
                  <select data-lpignore="true" value={a.contribFrequency || ""} onChange={e => updAcct(a.id, "contribFrequency", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </F>
              </Row>
            </div>
          ))}
          {accounts.some(a => a.balance) && (
            <div style={{ background: NAV, border: "2px solid " + ACCENT, borderRadius: 8, padding: "12px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Investment Assets</span>
              <span style={{ fontSize: 18, fontWeight: "bold", color: WHITE }}>
                ${accounts.reduce((sum, a) => sum + parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0), 0).toLocaleString()}
              </span>
            </div>
          )}
          <button onClick={addAcct} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Account
          </button>
          <FileUpload section="accounts" files={uploads.accounts || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── WILLS & TRUST ── */}
        <Panel title="Wills & Trust" id="section-wills">
          <Row cols={3}>
            <F>
              <Lbl t="Will?" />
              <select data-lpignore="true" value={willsTrust.hasWillDoc || ""} onChange={e => setWillsTrust(p => ({ ...p, hasWillDoc: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
            <F>
              <Lbl t="POA?" />
              <select data-lpignore="true" value={poa.hasPOA || ""} onChange={e => setPoa(p => ({ ...p, hasPOA: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
            <F>
              <Lbl t="Trust?" />
              <select data-lpignore="true" value={willsTrust.hasTrustDoc || ""} onChange={e => setWillsTrust(p => ({ ...p, hasTrustDoc: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </F>
          </Row>
          {(willsTrust.hasWillDoc === "yes" || willsTrust.hasTrustDoc === "yes") && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              {willsTrust.hasWillDoc === "yes" && (
                <>
                  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Will Details</div>
                  <Row cols={2}>
                    <F><DatePicker label="Date Will Was Executed" value={willsTrust.willDate} onChange={v => setWillsTrust(p => ({ ...p, willDate: v }))} /></F>
                    <F><Lbl t="Attorney / Firm" /><input value={willsTrust.willAttorney} onChange={e => setWillsTrust(p => ({ ...p, willAttorney: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={2}>
                    <F><Lbl t="Executor" /><input value={willsTrust.executor} onChange={e => setWillsTrust(p => ({ ...p, executor: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Alternate Executor" /><input value={willsTrust.altExecutor} onChange={e => setWillsTrust(p => ({ ...p, altExecutor: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
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
                <div style={{ marginTop: willsTrust.hasWillDoc === "yes" ? 20 : 0, borderTop: willsTrust.hasWillDoc === "yes" ? "2px solid " + ACCENT : "none", paddingTop: willsTrust.hasWillDoc === "yes" ? 16 : 0 }}>
                  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Trust Details</div>
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
          <FileUpload section="wills" files={uploads.wills || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── POWER OF ATTORNEY ── */}
        <Panel title="Power of Attorney" id="section-poa">
          {poa.hasPOA === "yes" && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              <Lbl t="Type of POA" />
              <select data-lpignore="true" value={poa.poaType || ""} onChange={e => setPoa(p => ({ ...p, poaType: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option>Durable Power of Attorney</option><option>Financial Power of Attorney</option>
                <option>Healthcare / Medical POA</option><option>Limited Power of Attorney</option><option>Springing Power of Attorney</option>
              </select>
              <Row cols={2}>
                <F><Lbl t="Agent (Attorney-in-Fact)" /><input value={poa.agentName} onChange={e => setPoa(p => ({ ...p, agentName: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Agent's Relationship" />
                  <select data-lpignore="true" value={poa.agentRelationship || ""} onChange={e => setPoa(p => ({ ...p, agentRelationship: e.target.value || null }))} style={IS}>
                    <option value="">— Select —</option>
                    {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Agent's Phone" /><input value={poa.agentPhone} onChange={e => setPoa(p => ({ ...p, agentPhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Alternate Agent" /><input value={poa.altAgent} onChange={e => setPoa(p => ({ ...p, altAgent: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><DatePicker label="Date POA Was Executed" value={poa.poaDate} onChange={v => setPoa(p => ({ ...p, poaDate: v }))} /></F>
                <F><Lbl t="Attorney / Firm" /><input value={poa.poaAttorney} onChange={e => setPoa(p => ({ ...p, poaAttorney: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Lbl t="Location of POA Documents" /><input value={poa.poaLocation} onChange={e => setPoa(p => ({ ...p, poaLocation: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" />
              <Lbl t="Notes / Additional Details" />
              <textarea data-lpignore="true" value={poa.poaNotes} onChange={e => setPoa(p => ({ ...p, poaNotes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
            </div>
          )}
          <FileUpload section="poa" files={uploads.poa || []} onChange={handleUploadChange} />
        </Panel>

        {/* ── AUTOMOBILES ── */}
        <Panel title="Automobiles" id="section-autos">
          {autos.map((a, i) => (
            <div key={a.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Vehicle {i + 1}</div>
                {autos.length > 1 && (
                  <button onClick={() => window.confirm("Remove this vehicle?") && delAuto(a.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={4}>
                <F><Lbl t="Year" /><input value={a.year} onChange={e => updAuto(a.id, "year", e.target.value)} maxLength={4} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Make" /><input value={a.make} onChange={e => updAuto(a.id, "make", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Model" /><input value={a.model} onChange={e => updAuto(a.id, "model", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Est. Value" /><input value={a.value} onChange={e => updAuto(a.id, "value", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
            </div>
          ))}
          <button onClick={addAuto} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Vehicle
          </button>
          <FileUpload section="autos" files={uploads.autos || []} onChange={handleUploadChange} />
        </Panel>

        <button onClick={handleSubmit} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "13px 32px", fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", width: "100%", marginBottom: 10 }}>
          Save Client Record
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: WHITE, paddingBottom: 32, letterSpacing: "0.06em" }}>
          RUSSELL WEALTH GROUP · CONFIDENTIAL CLIENT DATA
        </div>
        </div>{/* end flex content */}
      </div>{/* end flex row */}

      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { font-family: Georgia, serif; caret-color: #ffffff; }
        input:focus, textarea:focus, select:focus { outline: 3px solid #ffffff; outline-offset: 1px; background: #2a4a80 !important; }
        input::placeholder, textarea::placeholder { color: #a8c8f0 !important; opacity: 1; }
        select option { background: #1a2f5e; color: #ffffff; }
        @media (max-width: 600px) { .rg { grid-template-columns: 1fr !important; } }
        [data-lastpass-icon-root], [data-lastpass-root], [id^="lastpass"], [id*="lastpass"],
        .lastpass-icon, .lp-icon, [class*="lastpass"], [data-lpignore-ext],
        div[style*="z-index: 2147483647"]:not([class]):not([id]) { display: none !important; }
      `}</style>
    </div>
  );
}
