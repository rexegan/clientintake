/*
 * Advisor Toolbox section — extracted from the Client Intake app (src/App.jsx)
 * for insertion into the Advisor Toolbox app.
 * State dependencies: advisorInfo/setAdvisorInfo (persisted to localStorage
 * key "rwg_advisor_info"), plus shared components Panel, Sec, Row, F, Lbl,
 * DatePicker, StateSelect and style constants IS, BORDER, INK, MUTED.
 */
        <Panel title="Advisor Toolbox" id="section-toolbox">

          <Sec t="Investment Professional" />
          <Row cols={3}>
            <F><Lbl t="First" /><input value={advisorInfo.firstName || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, firstName: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Middle" /><input value={advisorInfo.middleInitial || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, middleInitial: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 70 }} maxLength={2} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="Last" /><input value={advisorInfo.lastName || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, lastName: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><DatePicker label="Date of Birth" value={advisorInfo.dob || ""} onChange={v => setAdvisorInfo(p => { const n = { ...p, dob: v }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} /></F>
            <F><Lbl t="Social Security Number" /><input value={advisorInfo.ssn || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, ssn: fmtSSN(e.target.value) }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 140 }} inputMode="numeric" autoComplete="new-password" data-lpignore="true" placeholder="XXX-XX-XXXX" /></F>
            <F><Lbl t="Office Phone" /><input value={advisorInfo.officePhone || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, officePhone: fmtPhone(e.target.value) }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={1}>
            <F><Lbl t="Office Address" /><input value={advisorInfo.officeAddress || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, officeAddress: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={3}>
            <F><Lbl t="City" /><input value={advisorInfo.officeCity || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, officeCity: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            <F><Lbl t="State" /><StateSelect value={advisorInfo.officeState || ""} onChange={v => setAdvisorInfo(p => { const n = { ...p, officeState: v }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} /></F>
            <F><Lbl t="ZIP" /><input value={advisorInfo.officeZip || ""} onChange={e => { const z = fmtZip(e.target.value); setAdvisorInfo(p => { const n = { ...p, officeZip: z }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); lookupZip(z, (city, state) => setAdvisorInfo(p => { const n = { ...p, officeCity: city, officeState: state }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })); }} style={{ ...IS, width: 100 }} inputMode="numeric" maxLength={10} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>

          <Sec t="Broker / Dealer Information" />
          <Row cols={1}>
            <F><Lbl t="Broker Dealer Name" /><input value={advisorInfo.bdName || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdName: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <Row cols={1}>
            <F><Lbl t="BD Home Office Address" /><input value={advisorInfo.bdHomeOffice || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdHomeOffice: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
          </Row>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <F style={{ flex: "0 0 110px" }}>
              <Lbl t="ZIP" />
              <input value={advisorInfo.bdZip || ""} onChange={e => { const z = fmtZip(e.target.value); setAdvisorInfo(p => { const n = { ...p, bdZip: z }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); lookupZip(z, (city, state) => setAdvisorInfo(p => { const n = { ...p, bdCity: city, bdState: state }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })); }} style={{ ...IS, width: 110 }} inputMode="numeric" maxLength={10} autoComplete="new-password" data-lpignore="true" />
            </F>
            <F style={{ flex: "0 0 200px" }}>
              <Lbl t="City" />
              <input value={advisorInfo.bdCity || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdCity: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 200 }} autoComplete="new-password" data-lpignore="true" />
            </F>
            <F style={{ flex: "0 0 180px" }}>
              <Lbl t="State" />
              <StateSelect value={advisorInfo.bdState || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdState: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 180 }} />
            </F>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <F style={{ flex: "0 0 140px" }}><Lbl t="BD Rep Number" /><input value={advisorInfo.bdId || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdId: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 140px" }}><Lbl t="BD CRD Number" /><input value={advisorInfo.bdCrd || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, bdCrd: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 140px" }}><Lbl t="Advisor CRD Number" /><input value={advisorInfo.advisorCrd || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, advisorCrd: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
            <F style={{ flex: "0 0 140px" }}><Lbl t="Branch ID Number" /><input value={advisorInfo.branchId || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, branchId: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 140 }} autoComplete="new-password" data-lpignore="true" /></F>
          </div>

          <Sec t="Insurance License" />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <F style={{ flex: "none" }}>
              <Lbl t="NPN Number" />
              <input value={advisorInfo.npn || ""} onChange={e => setAdvisorInfo(p => { const n = { ...p, npn: e.target.value }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ ...IS, width: 110 }} autoComplete="new-password" data-lpignore="true" />
            </F>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Lbl t="Licensed States" />
            <div style={{ marginBottom: 8 }}>
              <select
                value=""
                onChange={e => { const v = e.target.value; if (!v) return; const cur = (advisorInfo.licensedStates || []).map(x => typeof x === "string" ? { state: x, renewalDate: "" } : x); if (!cur.find(x => x.state === v)) { const next = [...cur, { state: v, renewalDate: "" }].sort((a, b) => a.state.localeCompare(b.state)); setAdvisorInfo(p => { const n = { ...p, licensedStates: next }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); } }}
                style={{ ...IS, width: 200 }}
                data-lpignore="true"
              >
                <option value="">+ Add State</option>
                {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(advisorInfo.licensedStates || []).map(raw => {
                const entry = typeof raw === "string" ? { state: raw, renewalDate: "" } : raw;
                const fullName = US_STATES.find(([a]) => a === entry.state)?.[1] || "";
                return (
                  <div key={entry.state} style={{ display: "flex", alignItems: "center", gap: 10, background: "#e0e7ff", borderRadius: 7, padding: "6px 12px" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3730a3", minWidth: 160 }}>{entry.state}{fullName ? ` — ${fullName}` : ""}</span>
                    <input
                      value={entry.licenseNumber || ""}
                      onChange={e => { const val = e.target.value; setAdvisorInfo(p => { const updated = (p.licensedStates || []).map(x => { const s = typeof x === "string" ? { state: x, renewalDate: "", licenseNumber: "" } : x; return s.state === entry.state ? { ...s, licenseNumber: val } : s; }); const n = { ...p, licensedStates: updated }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); }}
                      placeholder="License #"
                      style={{ ...IS, width: 130, fontSize: 12, padding: "4px 8px", background: "#fff" }}
                      autoComplete="new-password"
                      data-lpignore="true"
                    />
                    <span style={{ fontSize: 12, color: "#4338ca", whiteSpace: "nowrap" }}>Renewal:</span>
                    <input
                      value={entry.renewalDate || ""}
                      onChange={e => { const val = fmtDOB(e.target.value); setAdvisorInfo(p => { const updated = (p.licensedStates || []).map(x => { const s = typeof x === "string" ? { state: x, renewalDate: "", licenseNumber: "" } : x; return s.state === entry.state ? { ...s, renewalDate: val } : s; }); const n = { ...p, licensedStates: updated }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); }}
                      placeholder="MM/DD/YYYY"
                      style={{ ...IS, width: 120, fontSize: 12, padding: "4px 8px", background: "#fff" }}
                      autoComplete="new-password"
                      data-lpignore="true"
                    />
                    <select
                      value={entry.ceCurrent || ""}
                      onChange={e => { const val = e.target.value; setAdvisorInfo(p => { const updated = (p.licensedStates || []).map(x => { const s = typeof x === "string" ? { state: x, renewalDate: "", licenseNumber: "", ceCurrent: "" } : x; return s.state === entry.state ? { ...s, ceCurrent: val } : s; }); const n = { ...p, licensedStates: updated }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; }); }}
                      style={{ ...IS, width: 100, fontSize: 12, padding: "4px 8px", background: "#fff" }}
                      data-lpignore="true"
                    >
                      <option value="">CE?</option>
                      <option value="Yes">CE ✓</option>
                      <option value="No">CE ✗</option>
                    </select>
                    <button onClick={() => setAdvisorInfo(p => { const updated = (p.licensedStates || []).filter(x => (typeof x === "string" ? x : x.state) !== entry.state); const n = { ...p, licensedStates: updated }; localStorage.setItem("rwg_advisor_info", JSON.stringify(n)); return n; })} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginBottom: 20, background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 9, padding: "10px 14px", fontSize: 12, color: "#6d28d9" }}>
            This information is saved to your browser and used to pre-populate carrier applications. It is not tied to any individual client record.
          </div>

          <Sec t="Client Document Vaults" />
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <select
              value={vaultPickerVal}
              onChange={e => setVaultPickerVal(e.target.value)}
              style={{ ...IS, flex: "1 1 220px", maxWidth: 320 }}
            >
              <option value="">— Select document category —</option>
              {VAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => addVault(vaultPickerVal)}
              disabled={!vaultPickerVal}
              style={{ background: BRAND_NAVY, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: vaultPickerVal ? "pointer" : "not-allowed", opacity: vaultPickerVal ? 1 : 0.45, whiteSpace: "nowrap" }}
            >
              + Add Vault
            </button>
          </div>

          {vaults.length === 0 && (
            <div style={{ textAlign: "center", padding: "28px 0", color: MUTED, fontSize: 13, border: "1.5px dashed #d0d5de", borderRadius: 10 }}>
              Select a category above and click <strong>+ Add Vault</strong> to create a document drawer.
            </div>
          )}

          {vaults.map((v, i) => {
            const uploadKey = `vault_${v.id}`;
            return (
              <div key={v.id} style={{ border: "1px solid " + BORDER, borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
                <div style={{ background: "#f1f3f6", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🗂</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK, flex: 1 }}>{v.category}</div>
                  <button onClick={() => showConfirm(`Remove "${v.category}" vault?`, () => delVault(v.id), "Remove")} style={{ background: "#fff", border: "1px solid #ecc8c8", color: DANGER, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12 }}>Remove</button>
                </div>
                <div style={{ padding: "10px 16px" }}>
                  <FileUpload section={uploadKey} files={uploads[uploadKey] || []} onChange={handleUploadChange} hideLabel  onConfirm={showConfirm}/>
                </div>
              </div>
            );
          })}
        </Panel>
