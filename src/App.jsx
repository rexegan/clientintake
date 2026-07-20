import { useState } from "react";

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
  <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, marginTop: 10 }}>{t}</div>
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

function DatePicker({ value, onChange, label }) {
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
        <select data-lpignore="true" value={yyyy} onChange={e => set(mm, dd, e.target.value)} style={{ ...sel, flex: 1.4 }}>
          <option value="">Year</option>
          {Array.from({ length: 101 }, (_, i) => {
            const y = String(new Date().getFullYear() - i);
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
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
  dob:"", ssn:"", cell:"", homePhone:"", email:"",
  addressLine1:"", addressLine2:"", city:"", state:"", zip:"",
  hasPOBox: null, poBox:"", poBoxCity:"", poBoxState:"", poBoxZip:"", preferredMailing:"",
  dlNumber:"", dlState:"", dlIssueDate:"", dlExpDate:"",
};
const emptySpouse = { firstName:"", middleName:"", lastName:"", dob:"", ssn:"", cell:"", email:"", dlNumber:"", dlState:"", dlIssueDate:"", dlExpDate:"" };
const emptyEmployer = { employer:"", occupation:"", yearsEmployed:"", workPhone:"", workAddress:"", hasRetirement:null, retirementType:null, hasMatch:null, matchPct:"", retirementBalance:"", retirementCustodian:"" };
const emptyAuto = { year:"", make:"", model:"", value:"" };
const emptyRealEstate = { description:"", purchaseDate:"", purchasePrice:"", marketValue:"", mortgageBalance:"", address:"", mortgageCompany:"", originationDate:"", interestRate:"", monthlyPmt:"", propertyTaxes:"", insurance:"" };
const emptyAccount = { type:"", institution:"", balance:"", owner:"" };

const ACCOUNT_TYPES = [
  "Traditional IRA","Roth IRA","SEP IRA","SIMPLE IRA","401(k)","Roth 401(k)",
  "403(b)","457(b)","Pension / Defined Benefit","Non-Qualified Brokerage",
  "Annuity (Variable)","Annuity (Fixed)","Annuity (Indexed)","Life Insurance (Cash Value)",
  "HSA","529 / Education","Trust Account","Checking / Savings","CD","Other",
];

const INCOME_TYPES = [
  "Employment — W2","Self-Employment / 1099","Social Security","Pension",
  "Rental Income","Investment / Dividends","Alimony / Child Support","Other",
];

const emptyIncome      = { type:"", amount:"", owner:"" };
const emptyChild       = { firstName:"", middleName:"", lastName:"", dob:"" };
const emptyBeneficiary = { firstName:"", middleName:"", lastName:"", dob:"", relationship:"" };

const RELATIONSHIP_TYPES = [
  "Spouse","Child","Parent","Sibling","Grandchild","Grandparent",
  "Friend","Trust","Estate","Charity / Organization","Other",
];

function ClientRoster({ clients, onDelete, onOpen, onBack }) {
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE }}>
      <div style={{ background: NAV, padding: "24px 24px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell Wealth Group</h1>
            <p style={{ margin: 0, fontSize: 13, color: LIGHT_BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
            <div style={{ fontSize: 15, color: LIGHT_BLUE }}>No saved clients yet.</div>
          </div>
        ) : clients.map(c => {
          const totalAssets = [
            ...(c.accounts || []).map(a => parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0)),
            ...(c.realEstate || []).map(r => parseInt((r.marketValue || "").replace(/[^0-9]/g, "") || 0)),
          ].reduce((a, b) => a + b, 0);
          return (
            <div key={c.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: "18px 22px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: "bold", color: WHITE }}>{c.client.firstName} {c.client.lastName}</div>
                {c.hasSpouse === "yes" && c.spouse?.firstName && (
                  <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 2 }}>Spouse: {c.spouse.firstName} {c.spouse.lastName}</div>
                )}
                <div style={{ fontSize: 12, color: LIGHT_BLUE, marginTop: 4 }}>
                  {c.client.dob && <span style={{ marginRight: 12 }}>DOB: {c.client.dob}</span>}
                  {totalAssets > 0 && <span>Assets: ${totalAssets.toLocaleString()}</span>}
                </div>
                <div style={{ fontSize: 11, color: LIGHT_BLUE, marginTop: 4, fontStyle: "italic" }}>Saved {new Date(c.savedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onOpen(c)} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Open</button>
                <button onClick={() => onDelete(c.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
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

  const [clientEmp, setClientEmp] = useState({ ...emptyEmployer });
  const [spouseEmp, setSpouseEmp] = useState({ ...emptyEmployer });
  const [incomes, setIncomes] = useState([{ ...emptyIncome, id: 1 }]);
  const [autos, setAutos] = useState([{ ...emptyAuto, id: 1 }]);
  const [realEstate, setRealEstate] = useState([{ ...emptyRealEstate, id: 1 }]);
  const [accounts, setAccounts] = useState([{ ...emptyAccount, id: 1 }]);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

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

  const addBene = () => setBeneficiaries(p => [...p, { ...emptyBeneficiary, id: Date.now() }]);
  const delBene = id => setBeneficiaries(p => p.filter(x => x.id !== id));
  const updBene = (id, f, v) => setBeneficiaries(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  const handleSubmit = () => {
    if (!client.firstName.trim() || !client.lastName.trim()) {
      showToast("Client first and last name are required.", "#c0392b");
      return;
    }
    const record = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      client, spouse, hasSpouse, hasChildren, children,
      clientEmp, spouseEmp, incomes, autos, realEstate, accounts,
      beneficiaries, willsTrust, poa,
    };
    saveClient(record);
    setSubmitted(true);
  };

  const handleReset = () => {
    setClient({ ...emptyClient }); setSpouse({ ...emptySpouse });
    setClientEmp({ ...emptyEmployer }); setSpouseEmp({ ...emptyEmployer });
    setIncomes([{ ...emptyIncome, id: 1 }]);
    setAutos([{ ...emptyAuto, id: 1 }]);
    setRealEstate([{ ...emptyRealEstate, id: 1 }]);
    setAccounts([{ ...emptyAccount, id: 1 }]);
    setHasSpouse(null); setHasChildren(null); setChildren([]);
    setBeneficiaries([{ ...emptyBeneficiary, id: 1 }]);
    setWillsTrust({ hasWill:null, willDate:"", willAttorney:"", executor:"", altExecutor:"", willLocation:"", willUpdated:null, willUpdateDate:"", willNotes:"", trustName:"", trustType:null, trustDate:"", trustee:"", successorTrustee:"", trustAttorney:"", assetsTitled:null, trustLocation:"", trustNotes:"" });
    setPoa({ hasPOA:null, poaType:null, agentName:"", agentRelationship:null, agentPhone:"", altAgent:"", poaDate:"", poaAttorney:"", poaLocation:"", poaNotes:"" });
    setSubmitted(false);
  };

  if (view === "roster") {
    return (
      <ClientRoster
        clients={savedClients}
        onOpen={(record) => {
          setClient(record.client || { ...emptyClient });
          setSpouse(record.spouse || { ...emptySpouse });
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
          <div style={{ fontSize: 15, color: LIGHT_BLUE, marginBottom: 4 }}>
            <span style={{ color: WHITE, fontWeight: "bold" }}>{client.firstName} {client.lastName}</span>'s profile has been recorded.
          </div>
          {hasSpouse === "yes" && (
            <div style={{ fontSize: 15, color: LIGHT_BLUE, marginBottom: 4 }}>
              Spouse <span style={{ color: WHITE, fontWeight: "bold" }}>{spouse.firstName} {spouse.lastName}</span> also recorded.
            </div>
          )}
          {totalAssets > 0 && (
            <div style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8, padding: "12px 18px", marginTop: 16, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Total Assets Captured</div>
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

      <div style={{ background: NAV, padding: "24px 24px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell Wealth Group</h1>
            <p style={{ margin: 0, fontSize: 13, color: LIGHT_BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              New Client Intake · Confidential
            </p>
          </div>
          <button onClick={() => setView("roster")} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}>
            Saved Clients ({savedClients.length})
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>

        {/* ── CLIENT PROFILE ── */}
        <Panel title="Client Profile">
          <Row cols={3}>
            <F><Lbl t="First Name" /><input value={client.firstName} onChange={setC("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Middle Name" /><input value={client.middleName} onChange={setC("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Last Name" /><input value={client.lastName} onChange={setC("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><DatePicker label="Date of Birth" value={client.dob} onChange={v => setClient(p => ({ ...p, dob: v }))} /></F>
            <F><Lbl t="Social Security #" /><input value={client.ssn} onChange={e => setClient(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Email" /><input value={client.email} onChange={setC("email")} type="email" style={IS} autoComplete="new-password" data-lpignore="true" data-lpignore="true" /></F>
          </Row>
          <Row cols={2}>
            <F><Lbl t="Cell Phone" /><input value={client.cell} onChange={e => setClient(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Home Phone" /><input value={client.homePhone} onChange={e => setClient(p => ({ ...p, homePhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
          </Row>

          <Sec t="Driver's License" />
          <Row cols={2}>
            <F><Lbl t="License Number" /><input value={client.dlNumber} onChange={setC("dlNumber")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Issuing State" /><input value={client.dlState} onChange={setC("dlState")} maxLength={2} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={2}>
            <F><DatePicker label="Issue Date" value={client.dlIssueDate} onChange={v => setClient(p => ({ ...p, dlIssueDate: v }))} /></F>
            <F><DatePicker label="Expiration Date" value={client.dlExpDate} onChange={v => setClient(p => ({ ...p, dlExpDate: v }))} /></F>
          </Row>

          <Sec t="Home Address" />
          <Row cols={2}>
            <F><Lbl t="Street Address" /><input value={client.addressLine1} onChange={setC("addressLine1")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Apt / Suite (optional)" /><input value={client.addressLine2} onChange={setC("addressLine2")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><Lbl t="City" /><input value={client.city} onChange={setC("city")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="State" /><input value={client.state} onChange={setC("state")} maxLength={2} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
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
                <F><Lbl t="State" /><input value={client.poBoxState} onChange={setC("poBoxState")} maxLength={2} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
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
              </Row>
            </div>
          )}
        </Panel>

        {/* ── FAMILY ── */}
        <Panel title="Family">
          <Row cols={2}>
            <F>
              <Lbl t="Married?" />
              <select data-lpignore="true" value={hasSpouse || ""} onChange={e => setHasSpouse(e.target.value || null)} style={IS}>
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
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

          {hasSpouse === "yes" && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Spouse Details</div>
              <Row cols={3}>
                <F><Lbl t="First Name" /><input value={spouse.firstName} onChange={setS("firstName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle Name" /><input value={spouse.middleName} onChange={setS("middleName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last Name" /><input value={spouse.lastName} onChange={setS("lastName")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F><DatePicker label="Date of Birth" value={spouse.dob} onChange={v => setSpouse(p => ({ ...p, dob: v }))} /></F>
                <F><Lbl t="Social Security #" /><input value={spouse.ssn} onChange={e => setSpouse(p => ({ ...p, ssn: fmtSSN(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Email" /><input value={spouse.email} onChange={setS("email")} type="email" style={IS} autoComplete="new-password" data-lpignore="true" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Cell Phone" /><input value={spouse.cell} onChange={e => setSpouse(p => ({ ...p, cell: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F />
              </Row>
              <Sec t="Driver's License" />
              <Row cols={2}>
                <F><Lbl t="License Number" /><input value={spouse.dlNumber} onChange={setS("dlNumber")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Issuing State" /><input value={spouse.dlState} onChange={setS("dlState")} maxLength={2} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><DatePicker label="Issue Date" value={spouse.dlIssueDate} onChange={v => setSpouse(p => ({ ...p, dlIssueDate: v }))} /></F>
                <F><DatePicker label="Expiration Date" value={spouse.dlExpDate} onChange={v => setSpouse(p => ({ ...p, dlExpDate: v }))} /></F>
              </Row>
            </div>
          )}

          {hasChildren === "yes" && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              {children.map((ch, i) => (
                <div key={ch.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Child {i + 1}</div>
                    {children.length > 1 && (
                      <button onClick={() => setChildren(p => p.filter(x => x.id !== ch.id))} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                    )}
                  </div>
                  <Row cols={3}>
                    <F><Lbl t="First Name" /><input value={ch.firstName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, firstName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Middle Name" /><input value={ch.middleName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, middleName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                    <F><Lbl t="Last Name" /><input value={ch.lastName} onChange={e => setChildren(p => p.map(x => x.id === ch.id ? { ...x, lastName: e.target.value } : x))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                  </Row>
                  <Row cols={2}>
                    <F><DatePicker label="Date of Birth" value={ch.dob} onChange={v => setChildren(p => p.map(x => x.id === ch.id ? { ...x, dob: v } : x))} /></F>
                    <F />
                  </Row>
                </div>
              ))}
              <button onClick={() => setChildren(p => [...p, { ...emptyChild, id: Date.now() }])} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
                + Add Child
              </button>
            </div>
          )}
        </Panel>

        {/* ── BENEFICIARIES ── */}
        <Panel title="Beneficiaries">
          {beneficiaries.map((b, i) => (
            <div key={b.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Beneficiary {i + 1}</div>
                {beneficiaries.length > 1 && (
                  <button onClick={() => delBene(b.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={3}>
                <F><Lbl t="First Name" /><input value={b.firstName} onChange={e => updBene(b.id, "firstName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Middle Name" /><input value={b.middleName} onChange={e => updBene(b.id, "middleName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Last Name" /><input value={b.lastName} onChange={e => updBene(b.id, "lastName", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><DatePicker label="Date of Birth" value={b.dob} onChange={v => updBene(b.id, "dob", v)} /></F>
                <F>
                  <Lbl t="Relationship" />
                  <select data-lpignore="true" value={b.relationship} onChange={e => updBene(b.id, "relationship", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </F>
              </Row>
            </div>
          ))}
          <button onClick={addBene} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Beneficiary
          </button>
        </Panel>

        {/* ── EMPLOYMENT ── */}
        <Panel title="Employment">
          {hasSpouse === "yes" && (
            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              {client.firstName || "Client"}
            </div>
          )}
          <Row cols={2}>
            <F><Lbl t="Employer Name" /><input value={clientEmp.employer} onChange={setCE("employer")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Occupation / Title" /><input value={clientEmp.occupation} onChange={setCE("occupation")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><Lbl t="Years Employed" /><input value={clientEmp.yearsEmployed} onChange={setCE("yearsEmployed")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
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
          <Lbl t="Work Address" /><input value={clientEmp.workAddress} onChange={setCE("workAddress")} style={IS} autoComplete="new-password" data-lpignore="true" />

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
                  <F>
                    <Lbl t="Employer Match?" />
                    <select data-lpignore="true" value={clientEmp.hasMatch || ""} onChange={e => setClientEmp(p => ({ ...p, hasMatch: e.target.value || null }))} style={IS}>
                      <option value="">— Select —</option>
                      <option value="yes">Yes</option><option value="no">No</option>
                    </select>
                  </F>
                  {clientEmp.hasMatch === "yes" && (
                    <F><Lbl t="Match %" /><input value={clientEmp.matchPct} onChange={e => setClientEmp(p => ({ ...p, matchPct: e.target.value.replace(/[^0-9.]/g, "") }))} style={IS} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
                  )}
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

          {hasSpouse === "yes" && (
            <>
              <div style={{ borderTop: "2px solid " + ACCENT, marginTop: 18, paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{spouse.firstName || "Spouse"}</div>
              </div>
              <Row cols={2}>
                <F><Lbl t="Employer Name" /><input value={spouseEmp.employer} onChange={setSE("employer")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Occupation / Title" /><input value={spouseEmp.occupation} onChange={setSE("occupation")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={3}>
                <F><Lbl t="Years Employed" /><input value={spouseEmp.yearsEmployed} onChange={setSE("yearsEmployed")} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
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
              <Lbl t="Work Address" /><input value={spouseEmp.workAddress} onChange={setSE("workAddress")} style={IS} autoComplete="new-password" data-lpignore="true" />
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
                      <F>
                        <Lbl t="Employer Match?" />
                        <select data-lpignore="true" value={spouseEmp.hasMatch || ""} onChange={e => setSpouseEmp(p => ({ ...p, hasMatch: e.target.value || null }))} style={IS}>
                          <option value="">— Select —</option>
                          <option value="yes">Yes</option><option value="no">No</option>
                        </select>
                      </F>
                      {spouseEmp.hasMatch === "yes" && (
                        <F><Lbl t="Match %" /><input value={spouseEmp.matchPct} onChange={e => setSpouseEmp(p => ({ ...p, matchPct: e.target.value.replace(/[^0-9.]/g, "") }))} style={IS} inputMode="decimal" autoComplete="new-password" data-lpignore="true" /></F>
                      )}
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
        </Panel>

        {/* ── ANNUAL INCOME ── */}
        <Panel title="Income">
          {incomes.map((inc, i) => (
            <div key={inc.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Income Source {i + 1}</div>
                {incomes.length > 1 && (
                  <button onClick={() => delIncome(inc.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Row cols={2}>
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
                  </select>
                </F>
              </Row>
              {inc.frequency && (
                <Row cols={2}>
                  <F>
                    <Lbl t={inc.frequency === "annual" ? "Annual Amount" : "Monthly Amount"} />
                    <input value={inc.amount} onChange={e => updIncome(inc.id, "amount", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" />
                  </F>
                  <F>
                    <Lbl t={inc.frequency === "annual" ? "Monthly Equivalent" : "Annual Equivalent"} />
                    <div style={{ ...IS, background: NAV, color: LIGHT_BLUE, display: "flex", alignItems: "center" }}>
                      {(() => {
                        const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0);
                        if (!raw) return "—";
                        return "$" + (inc.frequency === "annual" ? Math.round(raw / 12) : raw * 12).toLocaleString();
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
            const totalAnnual = incomes.reduce((sum, inc) => {
              const raw = parseInt((inc.amount || "").replace(/[^0-9]/g, "") || 0);
              if (!raw || !inc.frequency) return sum;
              return sum + (inc.frequency === "annual" ? raw : raw * 12);
            }, 0);
            if (!totalAnnual) return null;
            const married = hasSpouse === "yes";
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
                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                  Estimated Tax Summary — Filing {married ? "Married Filing Jointly" : "Single"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: LIGHT_BLUE }}>Total Gross Income</span>
                  <span style={{ fontSize: 15, fontWeight: "bold", color: WHITE }}>${totalAnnual.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: LIGHT_BLUE }}>Marginal Tax Bracket</span>
                  <span style={{ fontSize: 20, fontWeight: "bold", background: rateColor, color: WHITE, borderRadius: 7, padding: "3px 16px" }}>{bracket.rate}%</span>
                </div>
                <div style={{ fontSize: 11, color: LIGHT_BLUE, marginTop: 10, fontStyle: "italic" }}>
                  Based on 2024 IRS brackets · Does not account for deductions, credits, or other adjustments
                </div>
              </div>
            );
          })()}
        </Panel>

        {/* ── REAL ESTATE ── */}
        <Panel title="Real Estate">
          {realEstate.map((r, i) => (
            <div key={r.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Property {i + 1}</div>
                {realEstate.length > 1 && (
                  <button onClick={() => delRE(r.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              <Lbl t="Property Description" />
              <select data-lpignore="true" value={r.description} onChange={e => updRE(r.id, "description", e.target.value)} style={IS}>
                <option value="">— Select —</option>
                <option>Personal Residence</option><option>Land</option><option>Acreage</option><option>Rental Property</option>
              </select>
              <Lbl t="Property Address" /><input value={r.address} onChange={e => updRE(r.id, "address", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" />
              <Row cols={3}>
                <F><DatePicker label="Purchase Date" value={r.purchaseDate} onChange={v => updRE(r.id, "purchaseDate", v)} /></F>
                <F><Lbl t="Purchase Price" /><input value={r.purchasePrice} onChange={e => updRE(r.id, "purchasePrice", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Market Value" /><input value={r.marketValue} onChange={e => updRE(r.id, "marketValue", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Mortgage Balance" /><input value={r.mortgageBalance} onChange={e => updRE(r.id, "mortgageBalance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Net Equity" />
                  <div style={{ ...IS, background: NAV, color: LIGHT_BLUE, display: "flex", alignItems: "center" }}>
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
                <F />
              </Row>
            </div>
          ))}
          <button onClick={addRE} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Property
          </button>
        </Panel>

        {/* ── INVESTMENT & BANK ACCOUNTS ── */}
        <Panel title="Investment & Bank Accounts">
          {accounts.map((a, i) => (
            <div key={a.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Account {i + 1}</div>
                {accounts.length > 1 && (
                  <button onClick={() => delAcct(a.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
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
                    <option>Jackson Nat'l</option><option>American Funds</option><option>Franklin Templeton</option>
                    <option>Voya</option><option>F&amp;G</option><option>Nationwide</option><option>Athene</option><option>Other</option>
                  </select>
                </F>
              </Row>
              {a.institution === "Other" && (
                <><Lbl t="Specify Institution" /><input value={a.institutionOther || ""} onChange={e => updAcct(a.id, "institutionOther", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></>
              )}
              <Row cols={2}>
                <F><Lbl t="Balance" /><input value={a.balance} onChange={e => updAcct(a.id, "balance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F>
                  <Lbl t="Owner" />
                  <select data-lpignore="true" value={a.owner} onChange={e => updAcct(a.id, "owner", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="Client">Client</option>
                    {hasSpouse === "yes" && <option value="Spouse">Spouse</option>}
                    <option value="Joint">Joint</option>
                  </select>
                </F>
              </Row>
            </div>
          ))}
          {accounts.some(a => a.balance) && (
            <div style={{ background: NAV, border: "2px solid " + ACCENT, borderRadius: 8, padding: "12px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Investment Assets</span>
              <span style={{ fontSize: 18, fontWeight: "bold", color: WHITE }}>
                ${accounts.reduce((sum, a) => sum + parseInt((a.balance || "").replace(/[^0-9]/g, "") || 0), 0).toLocaleString()}
              </span>
            </div>
          )}
          <button onClick={addAcct} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Account
          </button>
        </Panel>

        {/* ── WILLS & TRUST ── */}
        <Panel title="Wills & Trust">
          <Lbl t="Do you have a Will or Trust?" />
          <select data-lpignore="true" value={willsTrust.hasWill || ""} onChange={e => setWillsTrust(p => ({ ...p, hasWill: e.target.value || null }))} style={IS}>
            <option value="">— Select —</option>
            <option value="will">Yes — Will</option>
            <option value="trust">Yes — Trust</option>
            <option value="both">Yes — Both Will &amp; Trust</option>
            <option value="no">No</option>
          </select>
          {(willsTrust.hasWill && willsTrust.hasWill !== "no") && (
            <div style={{ marginTop: 18, borderTop: "2px solid " + ACCENT, paddingTop: 16 }}>
              {(willsTrust.hasWill === "will" || willsTrust.hasWill === "both") && (
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
              {(willsTrust.hasWill === "trust" || willsTrust.hasWill === "both") && (
                <div style={{ marginTop: willsTrust.hasWill === "both" ? 20 : 0, borderTop: willsTrust.hasWill === "both" ? "2px solid " + ACCENT : "none", paddingTop: willsTrust.hasWill === "both" ? 16 : 0 }}>
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
        </Panel>

        {/* ── POWER OF ATTORNEY ── */}
        <Panel title="Power of Attorney">
          <Lbl t="Do you have a Power of Attorney?" />
          <select data-lpignore="true" value={poa.hasPOA || ""} onChange={e => setPoa(p => ({ ...p, hasPOA: e.target.value || null }))} style={IS}>
            <option value="">— Select —</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
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
        </Panel>

        {/* ── AUTOMOBILES ── */}
        <Panel title="Automobiles">
          {autos.map((a, i) => (
            <div key={a.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Vehicle {i + 1}</div>
                {autos.length > 1 && (
                  <button onClick={() => delAuto(a.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
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
        </Panel>

        <button onClick={handleSubmit} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "13px 32px", fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", width: "100%", marginBottom: 10 }}>
          Save Client Record
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: LIGHT_BLUE, paddingBottom: 32, letterSpacing: "0.06em" }}>
          RUSSELL WEALTH GROUP · CONFIDENTIAL CLIENT DATA
        </div>
      </div>

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
