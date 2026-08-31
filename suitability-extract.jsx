/*
 * Suitability section — extracted from the Client Intake app (src/App.jsx)
 * for insertion into the Trade Blotter app.
 * State dependencies: suitability/setSuitability object, accounts and
 * lifePolicies arrays (for the auto product-type breakdown), plus shared
 * components Panel, Row, F, Lbl and style constants IS, BORDER, INK, MUTED.
 */
        <Panel title="Suitability" id="section-suitability">
          {/* ── INVESTMENT PROFILE ── */}
          <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Investment Profile</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Risk Tolerance" />
              <select value={suitability.riskTolerance} onChange={e => setSuitability(p => ({ ...p, riskTolerance: e.target.value }))} style={{ ...IS, width: 216 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Conservative</option>
                <option>Moderately Conservative</option>
                <option>Moderate</option>
                <option>Moderately Aggressive</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Investment Objective" />
              <select value={suitability.investmentObjective} onChange={e => setSuitability(p => ({ ...p, investmentObjective: e.target.value }))} style={{ ...IS, width: 200 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Capital Preservation</option>
                <option>Income</option>
                <option>Growth &amp; Income</option>
                <option>Growth</option>
                <option>Aggressive Growth</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Lbl t="Time Horizon" />
              <select value={suitability.timeHorizon} onChange={e => setSuitability(p => ({ ...p, timeHorizon: e.target.value }))} style={{ ...IS, width: 234 }} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Short-Term (0–3 yrs)</option>
                <option>Medium-Term (3–7 yrs)</option>
                <option>Long-Term (7–15 yrs)</option>
                <option>Very Long-Term (15+ Years)</option>
              </select>
            </div>
          </div>
          <Row cols={3}>
            <F>
              <Lbl t="Liquidity Needs" />
              <select value={suitability.liquidityNeeds} onChange={e => setSuitability(p => ({ ...p, liquidityNeeds: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>None</option>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Very High</option>
              </select>
            </F>
            <F>
              <Lbl t="Investment Experience" />
              <select value={suitability.investmentExperience} onChange={e => setSuitability(p => ({ ...p, investmentExperience: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>None</option>
                <option>Limited</option>
                <option>Moderate</option>
                <option>Good</option>
                <option>Extensive</option>
              </select>
            </F>
            <F>
              <Lbl t="Federal Tax Bracket" />
              <select value={suitability.taxBracket} onChange={e => setSuitability(p => ({ ...p, taxBracket: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>10%</option>
                <option>12%</option>
                <option>22%</option>
                <option>24%</option>
                <option>32%</option>
                <option>35%</option>
                <option>37%</option>
              </select>
            </F>
          </Row>

          {/* ── GOALS ── */}
          <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14, fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Goals & Priorities</div>
          <Row cols={2}>
            <F>
              <Lbl t="Primary Goal" />
              <select value={suitability.primaryGoal} onChange={e => setSuitability(p => ({ ...p, primaryGoal: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Retirement Income</option>
                <option>Wealth Accumulation</option>
                <option>Capital Preservation</option>
                <option>Estate Transfer</option>
                <option>Education Funding</option>
                <option>Tax Reduction</option>
                <option>Charitable Giving</option>
                <option>Business Succession</option>
                <option>Other</option>
              </select>
            </F>
            <F>
              <Lbl t="Secondary Goal" />
              <select value={suitability.secondaryGoal} onChange={e => setSuitability(p => ({ ...p, secondaryGoal: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Retirement Income</option>
                <option>Wealth Accumulation</option>
                <option>Capital Preservation</option>
                <option>Estate Transfer</option>
                <option>Education Funding</option>
                <option>Tax Reduction</option>
                <option>Charitable Giving</option>
                <option>Business Succession</option>
                <option>Other</option>
              </select>
            </F>
          </Row>
          <Row cols={2}>
            <F>
              <Lbl t="Need for Income?" />
              <select value={suitability.incomeNeed} onChange={e => setSuitability(p => ({ ...p, incomeNeed: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>No — reinvest all returns</option>
                <option>Some — partial distributions</option>
                <option>Yes — regular income required</option>
              </select>
            </F>
            <F>
              <Lbl t="Growth Requirement" />
              <select value={suitability.growthNeed} onChange={e => setSuitability(p => ({ ...p, growthNeed: e.target.value }))} style={IS} data-lpignore="true">
                <option value="">— Select —</option>
                <option>Not important</option>
                <option>Modest growth acceptable</option>
                <option>Growth is important</option>
                <option>Maximum growth desired</option>
              </select>
            </F>
          </Row>

          {/* ── DETAILED PORTFOLIO BREAKDOWN ── */}
          <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14, fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Portfolio Breakdown by Product Type</div>
          {(() => {
            const pd = v => parseInt((v || "").replace(/[^0-9]/g, "") || 0);
            let fia = 0, fixed = 0, cvli = 0, cash = 0, qual = 0, nonqual = 0;
            const QUAL = new Set(["Traditional IRA","Roth IRA","Inherited IRA","401(k)","Roth 401(k)","403(b)","457(b)","SEP IRA","SIMPLE IRA","HSA","529 / Education","Pension / Defined Benefit"]);
            accounts.forEach(a => {
              const bal = pd(a.balance);
              if (!bal) return;
              const t = a.type || "", iv = a.investmentType || "";
              if (t === "Annuity (Fixed Indexed)" || iv === "Fixed Indexed Annuity") fia += bal;
              else if (t === "Annuity (Fixed)" || iv === "Fixed Annuity") fixed += bal;
              else if (t === "Life Insurance (Cash Value)") cvli += bal;
              else if (["Checking","Savings","Money Market","CD"].includes(t) || ["CDs","Money Market","Cash"].includes(iv)) cash += bal;
              if (QUAL.has(t) || a.qualified === "Qualified") qual += bal;
              else nonqual += bal;
            });
            cvli += lifePolicies.reduce((t, lp) => t + pd(lp.cashValue), 0);
            const four = fia + fixed + cvli + cash;
            const qn = qual + nonqual;
            const pct = (v, tot) => tot ? Math.round(v / tot * 1000) / 10 : 0;
            const Box = ({ label, val, tot }) => (
              <F>
                <Lbl t={label} />
                <div style={{ ...IS, background: "#f2f4f7", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{val ? "$" + val.toLocaleString() : "—"}</span>
                  <span style={{ color: "#2e3d66" }}>{val && tot ? pct(val, tot) + "%" : ""}</span>
                </div>
              </F>
            );
            return (<>
              <Row cols={2}>
                <Box label="Fixed Indexed Annuities" val={fia} tot={four} />
                <Box label="Fixed Annuities" val={fixed} tot={four} />
              </Row>
              <Row cols={2}>
                <Box label="Cash Value Life Insurance" val={cvli} tot={four} />
                <Box label="Checking, Savings, Money Market, CD" val={cash} tot={four} />
              </Row>
              <div style={{ marginTop: 18, borderTop: "1px solid " + BORDER, paddingTop: 14, fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Qualified vs. Non-Qualified</div>
              <Row cols={2}>
                <Box label="Qualified Money (IRA / 401k / etc.)" val={qual} tot={qn} />
                <Box label="Non-Qualified Money" val={nonqual} tot={qn} />
              </Row>
            </>);
          })()}

          <Row cols={1}>
            <F>
              <Lbl t="Suitability Notes" />
              <textarea value={suitability.notes} onChange={e => setSuitability(p => ({ ...p, notes: e.target.value }))} style={{ ...IS, minHeight: 80, resize: "vertical" }} placeholder="Additional suitability notes, special circumstances, or advisor observations..." autoComplete="new-password" data-lpignore="true" />
            </F>
          </Row>
        </Panel>
