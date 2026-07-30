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
  WebkitAppearance: "none", MozAppearance: "none", appearance: "none",
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
const emptyAuto = { year:"", make:"", model:"", value:"", hasKbb:null, kbbMileage:"", kbbCondition:"" };

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

const DEFAULT_INSTITUTIONS = ["Allianz","American Equity","American Funds","Ameritas","Athene","Bank of America","Chase / JPMorgan","Edward Jones","Empower","Equitable","F&G","Fidelity","Franklin Templeton","Global Atlantic","Jackson Nat'l","John Hancock","Lincoln Financial","MassMutual","Merrill Lynch","Midland National","Minnesota Life","Morgan Stanley","Mutual of Omaha","Nationwide","North American","Northwestern Mutual","Pacific Life","Principal","Protective Life","Prudential","Raymond James","Sammons / Midland","Schwab","Security Benefit","Symetra","T. Rowe Price","TIAA","Transamerica","Vanguard","Voya","Wells Fargo"];

const ACCOUNT_TYPES = [
  "401(k)","403(b)","457(b)",
  "Alternative Investments (Illiquid)",
  "Annuity (Fixed)","Annuity (Fixed Indexed)","Annuity (Variable)","Annuity (RILA)",
  "Bonds (Individual)",
  "CD","Checking / Savings",
  "HSA",
  "Life Insurance (Cash Value)",
  "Money Market",
  "Mutual Funds",
  "Non-Qualified Brokerage",
  "Pension / Defined Benefit",
  "Roth 401(k)","Roth IRA",
  "SEP IRA","SIMPLE IRA",
  "529 / Education",
  "Stocks (Individual)",
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

const emptyIncome      = { type:"", amount:"", frequency:"", owner:"client", institution:"" };
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
                <div style={{ fontSize: 11, color: WHITE, marginTop: 4, fontStyle: "italic" }}>
                  Last saved: {c.savedAt ? new Date(c.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + new Date(c.savedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—"}
                </div>
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
  const { client = {}, spouse = {}, hasSpouse, accounts = [], realEstate = [], incomes = [], autos = [], beneficiaries = [], children = [], willsTrust = {}, poa = {}, annualExpenses = { amount: "", frequency: "monthly" }, homeOwnership = {} } = data;

  const clientName = [client.firstName, client.middleName, client.lastName].filter(Boolean).join(" ") || "Client";
  const spouseName = [spouse.firstName, spouse.middleName, spouse.lastName].filter(Boolean).join(" ") || "Spouse";
  const hasSpouseRecord = ["married","domestic_partner"].includes(hasSpouse);
  const reportDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // ── ASSET CALCULATIONS ──
  const acctTotal = accounts.reduce((s, a) => s + parseDollar(a.balance), 0);
  const reTotal   = realEstate.reduce((s, r) => s + parseDollar(r.marketValue), 0);
  const autoTotal = autos.reduce((s, a) => s + parseDollar(a.value), 0);

  // liabilities
  const reMortgages = realEstate.reduce((s, r) => s + parseDollar(r.mortgageBalance), 0);
  const homeMortgage = parseDollar(homeOwnership.mortgageBalance);
  const totalAssets = acctTotal + reTotal + autoTotal;
  const totalLiabilities = reMortgages + homeMortgage;
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

  // ── INCOME ──
  const annualIncome = incomes.reduce((s, inc) => s + toAnnual(inc.amount, inc.frequency), 0);
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
  const P = "Georgia, serif";
  const NAVY = "#1a2f5e";
  const BLUE = "#4a90d9";
  const LGRAY = "#f4f6fa";
  const DGRAY = "#2c3e60";
  const BDR = "1px solid #d0d8e8";

  const s = {
    page: { fontFamily: P, color: "#1a1a2e", background: "#fff", maxWidth: 900, margin: "0 auto", padding: "0 0 60px" },
    header: { background: NAVY, color: "#fff", padding: "32px 40px 24px", borderRadius: "10px 10px 0 0" },
    firmName: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8c8f0", marginBottom: 6 },
    clientName: { fontSize: 32, fontWeight: "bold", margin: "0 0 4px" },
    sub: { fontSize: 14, color: "#c0d8f0", marginTop: 2 },
    reportTitle: { fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8c8f0", marginTop: 10 },
    body: { padding: "0 40px" },
    sectionHead: { fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: BLUE, borderBottom: "2px solid " + BLUE, paddingBottom: 6, marginTop: 32, marginBottom: 12, fontWeight: "bold" },
    kpiRow: { display: "flex", gap: 16, marginTop: 20, marginBottom: 8, flexWrap: "wrap" },
    kpi: { flex: 1, minWidth: 140, background: LGRAY, border: BDR, borderRadius: 8, padding: "14px 18px" },
    kpiLbl: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6a7a9a", marginBottom: 4 },
    kpiVal: { fontSize: 22, fontWeight: "bold", color: NAVY },
    kpiSub: { fontSize: 11, color: "#6a7a9a", marginTop: 2 },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 },
    th: { textAlign: "left", padding: "7px 10px", background: DGRAY, color: "#fff", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" },
    td: { padding: "7px 10px", borderBottom: BDR, verticalAlign: "top" },
    tdr: { padding: "7px 10px", borderBottom: BDR, textAlign: "right", verticalAlign: "top" },
    tdTotal: { padding: "8px 10px", fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, background: LGRAY },
    tdTotalR: { padding: "8px 10px", fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, background: LGRAY, textAlign: "right" },
    netWorthBox: { background: NAVY, color: "#fff", borderRadius: 10, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 },
    nwLabel: { fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8c8f0" },
    nwValue: { fontSize: 36, fontWeight: "bold" },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" },
    tag: { display: "inline-block", background: "#e8f0fc", color: NAVY, fontSize: 10, borderRadius: 4, padding: "2px 7px", marginLeft: 6, verticalAlign: "middle", letterSpacing: "0.06em" },
    tagGreen: { display: "inline-block", background: "#e6f4ea", color: "#1a5c2a", fontSize: 10, borderRadius: 4, padding: "2px 7px", marginLeft: 6, verticalAlign: "middle" },
  };

  const Row2 = ({ label, value, bold }) => (
    <tr>
      <td style={{ ...s.td, color: "#4a5a7a", width: "55%" }}>{label}</td>
      <td style={{ ...s.tdr, fontWeight: bold ? "bold" : "normal", color: bold ? NAVY : "#1a1a2e" }}>{value}</td>
    </tr>
  );

  const acctsByOwner = (owner) => accounts.filter(a => (a.owner || "").toLowerCase() === owner.toLowerCase() || (owner === "all"));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,50,0.85)", zIndex: 1000, overflowY: "auto", padding: "20px 0" }}>
      {/* toolbar */}
      <div id="rwg-print-toolbar" style={{ maxWidth: 900, margin: "0 auto 12px", display: "flex", gap: 10, justifyContent: "flex-end", padding: "0 10px" }}>
        <button onClick={(e) => { e.currentTarget.disabled = true; setTimeout(() => { window.print(); e.currentTarget.disabled = false; }, 50); }} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 7, padding: "9px 22px", fontFamily: P, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>🖨 Print / Save PDF</button>
        <button onClick={onClose} style={{ background: "#5a1a1a", color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontFamily: P, fontSize: 14, cursor: "pointer" }}>✕ Close</button>
      </div>

      <div id="rwg-report" style={s.page}>
        {/* ── HEADER ── */}
        <div style={s.header}>
          <div style={s.firmName}>Russell Wealth Group · Confidential</div>
          <div style={s.clientName}>{clientName}{hasSpouseRecord ? <span style={{ fontWeight: 400, fontSize: 24 }}> &amp; {spouseName}</span> : ""}</div>
          <div style={s.reportTitle}>Financial Summary &amp; Net Worth Statement · Prepared {reportDate}</div>
        </div>

        <div style={s.body}>

          {/* ── NET WORTH SNAPSHOT ── */}
          <div style={s.kpiRow}>
            <div style={{ ...s.kpi, background: "#1a2f5e", border: "none" }}><div style={{ ...s.kpiLbl, color: "#a8c8f0" }}>Total Net Worth</div><div style={{ ...s.kpiVal, color: "#fff", fontSize: 20 }}>{fmt(netWorth)}</div><div style={{ fontSize: 10, color: "#a8c8f0", marginTop: 2 }}>All assets minus liabilities</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Net Worth (ex-Home)</div><div style={s.kpiVal}>{fmt(netWorthExHome)}</div><div style={s.kpiSub}>Excl. primary residence equity</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Liquid Net Worth</div><div style={s.kpiVal}>{fmt(liquidAcctTotal)}</div><div style={s.kpiSub}>Investment &amp; bank accounts</div></div>
            <div style={s.kpi}><div style={s.kpiLbl}>Annual Income</div><div style={s.kpiVal}>{fmt(annualIncome)}</div>{annExpRaw > 0 && <div style={s.kpiSub}>Expenses: {fmt(annExpRaw)}</div>}</div>
          </div>

          {/* ── BALANCE SHEET ── */}
          <div style={s.sectionHead}>Balance Sheet</div>
          <div style={s.twoCol}>
            {/* ASSETS */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Assets</th><th style={{ ...s.th, textAlign: "right" }}>Value</th></tr></thead>
                <tbody>
                  {acctTotal > 0 && <Row2 label="Investment &amp; Bank Accounts" value={fmt(acctTotal)} />}
                  {reTotal > 0   && <Row2 label="Real Estate Holdings" value={fmt(reTotal)} />}
                  {autoTotal > 0 && <Row2 label="Automobiles" value={fmt(autoTotal)} />}
                  <tr><td style={s.tdTotal}>Total Assets</td><td style={s.tdTotalR}>{fmt(totalAssets)}</td></tr>
                </tbody>
              </table>
            </div>
            {/* LIABILITIES */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Liabilities</th><th style={{ ...s.th, textAlign: "right" }}>Balance</th></tr></thead>
                <tbody>
                  {realEstate.filter(r => parseDollar(r.mortgageBalance) > 0).map((r, i) => (
                    <Row2 key={i} label={r.descriptionNote || r.description || `Property ${i+1}`} value={fmt(parseDollar(r.mortgageBalance))} />
                  ))}
                  {homeMortgage > 0 && <Row2 label="Personal Residence Mortgage" value={fmt(homeMortgage)} />}
                  {totalLiabilities === 0 && <tr><td style={s.td} colSpan={2}><em style={{ color: "#8a9ab0" }}>No liabilities recorded</em></td></tr>}
                  <tr><td style={s.tdTotal}>Total Liabilities</td><td style={s.tdTotalR}>{fmt(totalLiabilities)}</td></tr>
                </tbody>
              </table>
              <div style={{ ...s.netWorthBox, marginTop: 0, padding: "16px 20px", borderRadius: 8 }}>
                <div style={s.nwLabel}>Estimated Net Worth</div>
                <div style={{ ...s.nwValue, fontSize: 26 }}>{fmt(netWorth)}</div>
              </div>
            </div>
          </div>

          {/* ── NET WORTH DETAIL ── */}
          <div style={s.sectionHead}>Net Worth &amp; Income Summary</div>
          <div style={s.twoCol}>
            {/* NET WORTH BREAKDOWN */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th} colSpan={2}>Net Worth Breakdown</th></tr></thead>
                <tbody>
                  <Row2 label="Total Assets" value={fmt(totalAssets)} />
                  <Row2 label="Total Liabilities" value={fmt(totalLiabilities)} />
                  <Row2 label="Total Net Worth" value={fmt(netWorth)} bold />
                  <tr><td style={{ ...s.td, paddingTop: 16, color: "#4a5a7a" }} colSpan={2}><strong style={{ color: "#1a2f5e" }}>Net Worth — Alternative Views</strong></td></tr>
                  <Row2 label="Net Worth (Ex-Primary Residence)" value={fmt(netWorthExHome)} />
                  <Row2 label="Liquid Net Worth (Investable Assets)" value={fmt(liquidAcctTotal)} bold />
                  {primaryReEquity > 0 && <Row2 label="  Primary Residence Equity" value={fmt(primaryReEquity)} />}
                </tbody>
              </table>
            </div>
            {/* INCOME & EXPENSES */}
            <div>
              <table style={s.table}>
                <thead><tr><th style={s.th} colSpan={2}>Annual Income &amp; Expenses</th></tr></thead>
                <tbody>
                  {incomes.filter(i => i.type).map((inc, i) => (
                    <Row2 key={i} label={inc.type + (inc.owner === "spouse" ? ` (${spouseName})` : inc.owner === "joint" ? " (Joint)" : "")} value={fmt(toAnnual(inc.amount, inc.frequency))} />
                  ))}
                  <tr><td style={s.tdTotal}>Total Annual Income</td><td style={s.tdTotalR}>{fmt(annualIncome)}</td></tr>
                  {annExpRaw > 0 && (<>
                    <tr><td style={s.td} colSpan={2}></td></tr>
                    <Row2 label="Annual Household Expenses" value={fmt(annExpRaw)} />
                    <tr>
                      <td style={s.tdTotal}>Annual Surplus / (Deficit)</td>
                      <td style={{ ...s.tdTotalR, color: surplusDeficit >= 0 ? "#1a5c2a" : "#8b0000" }}>{surplusDeficit >= 0 ? "+" : ""}{fmt(surplusDeficit)}</td>
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
                  <th style={{ ...s.th, textAlign: "right" }}>Dollar Amount</th>
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
                        <div style={{ background: "#e8f0fc", borderRadius: 4, height: 10, overflow: "hidden" }}>
                          <div style={{ background: "#1a2f5e", height: "100%", width: pct.toFixed(1) + "%", borderRadius: 4 }} />
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
          <div style={s.sectionHead}>Investment &amp; Bank Account Holdings</div>
          {Object.entries(qualGroups).map(([group, accts]) => (
            <div key={group} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5a7a", marginBottom: 6 }}>{group}</div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Account Type</th>
                    <th style={s.th}>Institution</th>
                    <th style={s.th}>Owner</th>
                    <th style={s.th}>Acct #</th>
                    <th style={s.th}>Transactions</th>
                    <th style={{ ...s.th, textAlign: "right" }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accts.map((a, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                      <td style={s.td}>{a.type || <em style={{ color: "#9aa" }}>—</em>}{a.hasOpt === "yes" && <span style={s.tag}>OPT{a.optEvent ? ": " + a.optEvent : ""}</span>}</td>
                      <td style={s.td}>{a.institution || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.owner || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.accountNumber ? "···" + String(a.accountNumber).slice(-4) : <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{a.hasRmdOrContrib || <em style={{ color: "#9aa" }}>—</em>}{a.rmdContribAmount ? <span style={{ color: "#4a5a7a" }}> · {a.rmdContribAmount}/{a.rmdContribFrequency || "—"}</span> : ""}</td>
                      <td style={s.tdr}>{a.balance ? <strong>{a.balance}</strong> : <em style={{ color: "#9aa" }}>—</em>}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={s.tdTotal} colSpan={5}>{group} Subtotal</td>
                    <td style={s.tdTotalR}>{fmt(accts.reduce((s, a) => s + parseDollar(a.balance), 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          {accounts.length === 0 && <p style={{ color: "#8a9ab0", fontStyle: "italic" }}>No accounts recorded.</p>}
          <div style={{ textAlign: "right", fontSize: 13, fontWeight: "bold", color: NAVY, borderTop: "2px solid " + BLUE, paddingTop: 8 }}>
            Total Account Holdings: {fmt(acctTotal)}
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
                  <th style={{ ...s.th, textAlign: "right" }}>Mortgage Bal.</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Equity</th>
                </tr>
              </thead>
              <tbody>
                {realEstate.map((r, i) => {
                  const mv = parseDollar(r.marketValue);
                  const mb = parseDollar(r.mortgageBalance);
                  const equity = mv - mb;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                      <td style={s.td}>
                        <strong>{r.descriptionNote || r.description || `Property ${i+1}`}</strong>
                        {r.description && <div style={{ fontSize: 11, color: "#6a7a9a" }}>{r.description}</div>}
                        {r.hasOpt === "yes" && <span style={s.tag}>OPT{r.optEvent ? ": " + r.optEvent : ""}</span>}
                      </td>
                      <td style={s.td}>{[r.address, r.city, r.state, r.zip].filter(Boolean).join(", ") || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.td}>{r.purchaseDate || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.tdr}>{r.purchasePrice || <em style={{ color: "#9aa" }}>—</em>}</td>
                      <td style={s.tdr}><strong>{r.marketValue || "—"}</strong></td>
                      <td style={s.tdr}>{r.mortgageBalance || "—"}</td>
                      <td style={{ ...s.tdr, color: equity >= 0 ? "#1a5c2a" : "#8b0000", fontWeight: "bold" }}>{fmt(equity)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={s.tdTotal} colSpan={4}>Totals</td>
                  <td style={s.tdTotalR}>{fmt(reTotal)}</td>
                  <td style={s.tdTotalR}>{fmt(reMortgages)}</td>
                  <td style={{ ...s.tdTotalR, color: (reTotal - reMortgages) >= 0 ? "#1a5c2a" : "#8b0000" }}>{fmt(reTotal - reMortgages)}</td>
                </tr>
              </tbody>
            </table>
          ) : <p style={{ color: "#8a9ab0", fontStyle: "italic" }}>No real estate recorded.</p>}

          {/* ── INCOME ── */}
          <div style={s.sectionHead}>Income Summary</div>
          {incomes.filter(i => i.type).length > 0 ? (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Income Type</th>
                  <th style={s.th}>Institution / Source</th>
                  <th style={s.th}>Belongs To</th>
                  <th style={s.th}>Frequency</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Amount</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Annual Equiv.</th>
                </tr>
              </thead>
              <tbody>
                {incomes.filter(i => i.type).map((inc, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{inc.type}</td>
                    <td style={s.td}>{inc.institution || <em style={{ color: "#9aa" }}>—</em>}</td>
                    <td style={s.td}>{inc.owner === "spouse" ? spouseName : inc.owner === "joint" ? "Joint" : clientName}</td>
                    <td style={s.td}>{inc.frequency ? inc.frequency.charAt(0).toUpperCase() + inc.frequency.slice(1) : "—"}</td>
                    <td style={s.tdr}>{inc.amount || "—"}</td>
                    <td style={s.tdr}><strong>{fmt(toAnnual(inc.amount, inc.frequency))}</strong></td>
                  </tr>
                ))}
                <tr>
                  <td style={s.tdTotal} colSpan={5}>Total Annual Income</td>
                  <td style={s.tdTotalR}>{fmt(annualIncome)}</td>
                </tr>
              </tbody>
            </table>
          ) : <p style={{ color: "#8a9ab0", fontStyle: "italic" }}>No income recorded.</p>}

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
                </tr>
              </thead>
              <tbody>
                {autos.filter(a => a.make || a.model || a.value).map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{a.year || "—"}</td>
                    <td style={s.td}>{a.make || "—"}</td>
                    <td style={s.td}>{a.model || "—"}</td>
                    <td style={s.tdr}>{a.value || "—"}</td>
                  </tr>
                ))}
                <tr>
                  <td style={s.tdTotal} colSpan={3}>Total Auto Value</td>
                  <td style={s.tdTotalR}>{fmt(autoTotal)}</td>
                </tr>
              </tbody>
            </table>
          </>)}

          {/* ── BENEFICIARIES ── */}
          {(beneficiaries.filter(b => b.firstName || b.lastName).length > 0 || children.filter(c => c.isBeneficiary).length > 0) && (<>
            <div style={s.sectionHead}>Beneficiaries</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Relationship</th>
                  <th style={s.th}>Date of Birth</th>
                  <th style={{ ...s.th, textAlign: "right" }}>% to Inherit</th>
                </tr>
              </thead>
              <tbody>
                {children.filter(c => c.isBeneficiary).map((c, i) => (
                  <tr key={"ch-"+i} style={{ background: i % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{[c.firstName, c.lastName].filter(Boolean).join(" ")}</td>
                    <td style={s.td}>{c.relationship || "Child"}</td>
                    <td style={s.td}>{c.dob || "—"}</td>
                    <td style={s.tdr}>{c.percentage || "—"}</td>
                  </tr>
                ))}
                {beneficiaries.filter(b => b.firstName || b.lastName).map((b, i) => (
                  <tr key={"b-"+i} style={{ background: (children.filter(c=>c.isBeneficiary).length + i) % 2 === 0 ? "#fff" : LGRAY }}>
                    <td style={s.td}>{[b.firstName, b.lastName].filter(Boolean).join(" ")}</td>
                    <td style={s.td}>{b.relationship || "—"}</td>
                    <td style={s.td}>{b.dob || "—"}</td>
                    <td style={s.tdr}>{b.percentage || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}

          {/* ── ESTATE PLANNING ── */}
          {(willsTrust.hasWillDoc || willsTrust.hasTrustDoc || poa.hasPOA) && (<>
            <div style={s.sectionHead}>Estate Planning Documents</div>
            <div style={s.twoCol}>
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
                  {poa.hasPOA && <Row2 label="Power of Attorney" value={poa.hasPOA === "yes" ? "✓ Yes" : "No"} />}
                  {poa.poaType && <Row2 label="POA Type" value={poa.poaType} />}
                  {poa.agentName && <Row2 label="Agent Name" value={poa.agentName} />}
                  {poa.agentRelationship && <Row2 label="Agent Relationship" value={poa.agentRelationship} />}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ── FOOTER ── */}
          <div style={{ marginTop: 48, paddingTop: 16, borderTop: "1px solid #d0d8e8", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a9ab0" }}>
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
      `}</style>
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
  const [homeOwnership, setHomeOwnership] = useState({ ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
  const [annualExpenses, setAnnualExpenses] = useState({ amount: "", frequency: "monthly" });
  const [customInstitutions, setCustomInstitutions] = useState(() => JSON.parse(localStorage.getItem("rwg_institutions") || "[]"));
  const allInstitutions = [...DEFAULT_INSTITUTIONS, ...customInstitutions.filter(c => !DEFAULT_INSTITUTIONS.includes(c))].sort((a, b) => a.localeCompare(b));
  const addCustomInstitution = (val) => {
    const trimmed = val.trim();
    if (!trimmed || DEFAULT_INSTITUTIONS.includes(trimmed) || customInstitutions.includes(trimmed)) return;
    const updated = [...customInstitutions, trimmed].sort((a, b) => a.localeCompare(b));
    setCustomInstitutions(updated);
    localStorage.setItem("rwg_institutions", JSON.stringify(updated));
  };
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showReport, setShowReport] = useState(false);
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
    beneficiaries, willsTrust, poa, uploads, homeOwnership, annualExpenses,
  }), [client, spouse, hasSpouse, hasChildren, children, clientEmails, spouseEmails, clientEmp, spouseEmp, incomes, autos, realEstate, accounts, beneficiaries, willsTrust, poa, uploads, homeOwnership, annualExpenses]);

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
    setHomeOwnership(record.homeOwnership || { ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
    setAnnualExpenses(record.annualExpenses || { amount: "", frequency: "monthly" });
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

  const INCOME_LINKED_TYPES = ["Withdrawals", "RMDs"];

  const toggleAcctRmd = (acct, txType) => {
    const needsIncome = INCOME_LINKED_TYPES.includes(txType);
    const prev = accounts.find(x => x.id === acct.id);
    if (prev?.linkedIncomeId) setIncomes(p => p.filter(x => x.id !== prev.linkedIncomeId));
    if (needsIncome) {
      const incId = Date.now();
      const incType = txType === "RMDs" ? "Pension" : "Investment / Dividends";
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: txType, linkedIncomeId: incId } : x));
      setIncomes(p => [...p, { ...emptyIncome, id: incId, type: incType, amount: acct.rmdContribAmount || "", frequency: acct.rmdContribFrequency || "", owner: (acct.owner || "").toLowerCase() === "spouse" ? "spouse" : "client", linkedAcctId: acct.id, institution: acct.institution || "" }]);
    } else {
      setAccounts(p => p.map(x => x.id === acct.id ? { ...x, hasRmdOrContrib: txType || null, linkedIncomeId: null } : x));
    }
  };

  const syncAcctIncome = (acct, field, value) => {
    updAcct(acct.id, field, value);
    if (!acct.linkedIncomeId) return;
    const incomeField = field === "rmdContribAmount" ? "amount" : field === "rmdContribFrequency" ? "frequency" : field === "institution" ? "institution" : null;
    if (incomeField) {
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
          setHomeOwnership(record.homeOwnership || { ownOrRent: null, mortgageCompany: "", mortgageBalance: "", monthlyPayment: "", interestRate: "", loanOriginationDate: "", loanNumber: "", monthlyRent: "", landlordName: "", landlordPhone: "" });
          setAnnualExpenses(record.annualExpenses || { amount: "", frequency: "monthly" });
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
    <>
    <div id="rwg-main-app" style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 3000, background: toast.color, color: WHITE, padding: "12px 20px", borderRadius: 10, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ background: NAV, padding: "24px 24px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell Wealth Group</h1>
            <p style={{ margin: 0, fontSize: 13, color: WHITE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              New Client Intake · Confidential
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <button
                onClick={() => { autoSave(); showToast(activeClientId ? "File updated" : "Draft saved", ACCENT); }}
                style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}
              >
                💾 {activeClientId ? "Update File" : "Save Draft"}
              </button>
              {lastSaved && (
                <div style={{ fontSize: 10, color: "#a8c8f0", textAlign: "right" }}>
                  Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </div>
            <button onClick={() => setView("roster")} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}>
              Saved Clients ({savedClients.length})
            </button>
          </div>
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
            ["section-wills",     "Wills & Trust"],
            ["section-poa",       "Power of Attorney"],
            ["section-autos",     "Automobiles"],
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
          {/* ── OWN OR RENT ── */}
          <Sec t="Personal Property" />
          <Row cols={2}>
            <F>
              <Lbl t="Own or Rent?" />
              <select value={homeOwnership.ownOrRent || ""} onChange={e => setHomeOwnership(p => ({ ...p, ownOrRent: e.target.value || null }))} style={IS}>
                <option value="">— Select —</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>
            </F>
          </Row>
          {homeOwnership.ownOrRent === "own" && (<>
            <Row cols={3}>
              <F><Lbl t="Mortgage Company" /><input value={homeOwnership.mortgageCompany} onChange={e => setHomeOwnership(p => ({ ...p, mortgageCompany: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Mortgage Balance" /><input value={homeOwnership.mortgageBalance} onChange={e => setHomeOwnership(p => ({ ...p, mortgageBalance: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Monthly Payment" /><input value={homeOwnership.monthlyPayment} onChange={e => setHomeOwnership(p => ({ ...p, monthlyPayment: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
            <Row cols={3}>
              <F><Lbl t="Interest Rate" /><input value={homeOwnership.interestRate} onChange={e => setHomeOwnership(p => ({ ...p, interestRate: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="e.g. 6.5%" /></F>
              <F><DatePicker label="Loan Origination Date" value={homeOwnership.loanOriginationDate} onChange={v => setHomeOwnership(p => ({ ...p, loanOriginationDate: v }))} /></F>
              <F><Lbl t="Loan Number" /><input value={homeOwnership.loanNumber} onChange={e => setHomeOwnership(p => ({ ...p, loanNumber: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
          </>)}
          {homeOwnership.ownOrRent === "rent" && (
            <Row cols={3}>
              <F><Lbl t="Monthly Rent" /><input value={homeOwnership.monthlyRent} onChange={e => setHomeOwnership(p => ({ ...p, monthlyRent: fmtDollar(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Landlord Name" /><input value={homeOwnership.landlordName} onChange={e => setHomeOwnership(p => ({ ...p, landlordName: e.target.value }))} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
              <F><Lbl t="Landlord Phone" /><input value={homeOwnership.landlordPhone} onChange={e => setHomeOwnership(p => ({ ...p, landlordPhone: fmtPhone(e.target.value) }))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
            </Row>
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
              <Row cols={inc.linkedAcctId ? 4 : 3}>
                <F>
                  <Lbl t="Income Type" />
                  <select data-lpignore="true" value={inc.type} onChange={e => updIncome(inc.id, "type", e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </F>
                {inc.linkedAcctId && (
                  <F>
                    <Lbl t="Sending Institution" />
                    <input
                      list={`inc-inst-list-${inc.id}`}
                      value={inc.institution || ""}
                      onChange={e => updIncome(inc.id, "institution", e.target.value)}
                      onBlur={e => addCustomInstitution(e.target.value)}
                      style={IS}
                      autoComplete="off"
                      data-lpignore="true"
                      placeholder="e.g. Vanguard, Fidelity…"
                    />
                    <datalist id={`inc-inst-list-${inc.id}`}>
                      {allInstitutions.map(n => <option key={n} value={n} />)}
                    </datalist>
                  </F>
                )}
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
              <Lbl t="Annual Equivalent" />
              <div style={{ ...IS, background: NAV, color: WHITE, display: "flex", alignItems: "center" }}>
                {(() => {
                  const raw = parseInt((annualExpenses.amount || "").replace(/[^0-9]/g, "") || 0);
                  if (!raw) return "—";
                  return "$" + (annualExpenses.frequency === "monthly" ? raw * 12 : raw).toLocaleString();
                })()}
              </div>
            </F>
          </Row>
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
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ flexShrink: 0 }}>
                  <Lbl t="Type" />
                  <select data-lpignore="true" value={r.description} onChange={e => updRE(r.id, "description", e.target.value)} style={{ ...IS, width: 200 }}>
                    <option value="">— Select —</option>
                    <option>Personal Residence</option><option>Land</option><option>Acreage</option><option>Rental Property</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <Lbl t="Property Description" />
                  <input value={r.descriptionNote || ""} onChange={e => updRE(r.id, "descriptionNote", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="Enter description…" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 4 }}>
                <Lbl t="Property Address" />
                {r.description === "Personal Residence" && (
                  <button onClick={() => { updRE(r.id, "address", client.addressLine1); updRE(r.id, "addressLine2", client.addressLine2); updRE(r.id, "city", client.city); updRE(r.id, "state", client.state); updRE(r.id, "zip", client.zip); }} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif" }}>
                    Copy Client Address?
                  </button>
                )}
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
              <Row cols={3}>
                <F><DatePicker label="Purchase Date" value={r.purchaseDate} onChange={v => updRE(r.id, "purchaseDate", v)} /></F>
                <F><Lbl t="Purchase Price" /><input value={r.purchasePrice} onChange={e => updRE(r.id, "purchasePrice", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Market Value" /><input value={r.marketValue} onChange={e => updRE(r.id, "marketValue", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={2}>
                <F>
                  <Lbl t="Zillow?" />
                  <select value={r.hasZillow || ""} onChange={e => updRE(r.id, "hasZillow", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                {r.hasZillow === "yes" && (
                  <F>
                    <Lbl t="Look Up on Zillow" />
                    <button
                      type="button"
                      onClick={() => {
                        const addr = [r.address, r.city, r.state, r.zip].filter(Boolean).join(" ");
                        const q = encodeURIComponent(addr || "");
                        window.open("https://www.zillow.com/homes/" + q + "_rb/", "_blank");
                      }}
                      style={{ ...IS, cursor: "pointer", textAlign: "center", background: "#006aff", color: WHITE, fontWeight: "bold", border: "none", borderRadius: 6 }}
                    >
                      Open Zillow ↗
                    </button>
                  </F>
                )}
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
              <Row cols={2}>
                <F>
                  <Lbl t="OPT?" />
                  <select data-lpignore="true" value={r.hasOpt || ""} onChange={e => updRE(r.id, "hasOpt", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                {r.hasOpt === "yes" && (
                  <F>
                    <Lbl t="Event?" />
                    <select data-lpignore="true" value={r.optEvent || ""} onChange={e => updRE(r.id, "optEvent", e.target.value)} style={IS}>
                      <option value="">— Select —</option>
                      <option value="Retire">Retire</option>
                      <option value="Sell Business">Sell Business</option>
                      <option value="Sell Land">Sell Land</option>
                      <option value="Inheritance">Inheritance</option>
                      <option value="Settlement">Settlement</option>
                      <option value="Divorce">Divorce</option>
                      <option value="Death of Spouse">Death of Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </F>
                )}
              </Row>
              {r.hasOpt === "yes" && (
                <F>
                  <Lbl t="Time Frame / Date" />
                  <input value={r.optTimeframe || ""} onChange={e => updRE(r.id, "optTimeframe", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" placeholder="e.g. 6 months, Jan 2026…" />
                </F>
              )}
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
              {/* Row 1: title + remove */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em" }}>Account {i + 1}</div>
                {accounts.length > 1 && (
                  <button onClick={() => window.confirm("Remove this account?") && delAcct(a.id)} style={{ background: "#5a1a1a", border: "2px solid #c0392b", color: WHITE, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>Remove</button>
                )}
              </div>
              {/* Row 2: owner / NQ-Q / OPT / event / timeframe */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(74,144,217,0.35)" }}>
                <select data-lpignore="true" value={a.owner} onChange={e => updAcct(a.id, "owner", e.target.value)} style={{ ...IS, margin: 0, padding: "5px 32px 5px 10px", fontSize: 13, width: "auto", minWidth: 160 }}>
                  <option value="">— Owner —</option>
                  <option value="Client">{[client.firstName, client.lastName].filter(Boolean).join(" ") || "Client"}</option>
                  {["married","domestic_partner"].includes(hasSpouse) && (
                    <option value="Spouse">{[spouse.firstName, spouse.lastName].filter(Boolean).join(" ") || "Spouse"}</option>
                  )}
                  <option value="Joint">Joint (JNT)</option>
                </select>
                <select data-lpignore="true" value={a.qualified || ""} onChange={e => updAcct(a.id, "qualified", e.target.value)} style={{ ...IS, margin: 0, padding: "5px 32px 5px 10px", fontSize: 13, width: "auto", minWidth: 150 }}>
                  <option value="">— NQ or Q? —</option>
                  <option value="Non-Qualified">Non-Qualified</option>
                  <option value="Qualified">Qualified</option>
                </select>
                <select data-lpignore="true" value={a.hasOpt || ""} onChange={e => updAcct(a.id, "hasOpt", e.target.value || null)} style={{ ...IS, margin: 0, padding: "5px 32px 5px 10px", fontSize: 13, width: "auto", minWidth: 115 }}>
                  <option value="">— OPT? —</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {a.hasOpt === "yes" && (<>
                  <select data-lpignore="true" value={a.optEvent || ""} onChange={e => updAcct(a.id, "optEvent", e.target.value)} style={{ ...IS, margin: 0, padding: "5px 32px 5px 10px", fontSize: 13, width: "auto", minWidth: 160 }}>
                    <option value="">— Event? —</option>
                    <option value="Retire">Retire</option>
                    <option value="Sell Business">Sell Business</option>
                    <option value="Sell Land">Sell Land</option>
                    <option value="Inheritance">Inheritance</option>
                    <option value="Settlement">Settlement</option>
                    <option value="Divorce">Divorce</option>
                    <option value="Death of Spouse">Death of Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                  <input value={a.optTimeframe || ""} onChange={e => updAcct(a.id, "optTimeframe", e.target.value)} style={{ ...IS, margin: 0, padding: "5px 10px", fontSize: 13, width: "auto", minWidth: 170 }} autoComplete="new-password" data-lpignore="true" placeholder="Expected Date / Time Frame…" />
                </>)}
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
                  <input
                    list={`inst-list-${a.id}`}
                    value={a.institution}
                    onChange={e => syncAcctIncome(a, "institution", e.target.value)}
                    onBlur={e => addCustomInstitution(e.target.value)}
                    style={IS}
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="Type or select…"
                  />
                  <datalist id={`inst-list-${a.id}`}>
                    {allInstitutions.map(n => <option key={n} value={n} />)}
                  </datalist>
                </F>
              </Row>
              <Row cols={2}>
                <F><Lbl t="Account Number" /><input value={a.accountNumber || ""} onChange={e => updAcct(a.id, "accountNumber", e.target.value)} style={IS} autoComplete="new-password" data-lpignore="true" /></F>
                <F><Lbl t="Balance" /><input value={a.balance} onChange={e => updAcct(a.id, "balance", fmtDollar(e.target.value))} style={IS} inputMode="numeric" autoComplete="new-password" data-lpignore="true" /></F>
              </Row>
              <Row cols={1}>
                <F>
                  <Lbl t="Transactions?" />
                  <select data-lpignore="true" value={a.hasRmdOrContrib || ""} onChange={e => toggleAcctRmd(a, e.target.value)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="Contributions">Contributions</option>
                    <option value="Withdrawals">Withdrawals</option>
                    <option value="RMDs">RMDs</option>
                    <option value="Loans">Loans</option>
                    <option value="Other">Other</option>
                  </select>
                </F>
              </Row>
              {INCOME_LINKED_TYPES.includes(a.hasRmdOrContrib) && (
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
              <Row cols={4}>
                <F>
                  <Lbl t="KBB?" />
                  <select value={a.hasKbb || ""} onChange={e => updAuto(a.id, "hasKbb", e.target.value || null)} style={IS}>
                    <option value="">— Select —</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </F>
                {a.hasKbb === "yes" && (<>
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
                    <button
                      type="button"
                      onClick={() => {
                        const make = (a.make || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                        const model = (a.model || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                        const year = a.year || "";
                        const mileage = a.kbbMileage || "";
                        const condition = (a.kbbCondition || "").toLowerCase().replace(/\s+/g, "-");
                        let url = "https://www.kbb.com/" + make + "/" + model + "/" + year + "/";
                        if (mileage) url += "?mileage=" + mileage;
                        if (condition) url += (mileage ? "&" : "?") + "condition=" + condition;
                        window.open(url, "_blank");
                      }}
                      style={{ ...IS, cursor: "pointer", textAlign: "center", background: "#003087", color: WHITE, fontWeight: "bold", border: "none", borderRadius: 6 }}
                    >
                      Open KBB ↗
                    </button>
                  </F>
                </>)}
              </Row>
            </div>
          ))}
          <button onClick={addAuto} style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", width: "100%" }}>
            + Add Vehicle
          </button>
          <FileUpload section="autos" files={uploads.autos || []} onChange={handleUploadChange} />
        </Panel>

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <button onClick={handleSubmit} style={{ background: ACCENT, color: WHITE, border: "none", borderRadius: 8, padding: "13px 32px", fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", flex: 1 }}>
            Save Client Record
          </button>
          <button onClick={() => setShowReport(true)} style={{ background: "#1a5c2a", color: WHITE, border: "none", borderRadius: 8, padding: "13px 24px", fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", flex: 1 }}>
            📊 View Financial Summary
          </button>
        </div>
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
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a8c8f0' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px !important; }
        select option { background: #1a2f5e !important; color: #ffffff !important; font-family: Georgia, serif; font-size: 15px; }
        select option:checked, select option:hover { background: #2a4a80 !important; color: #ffffff !important; }
        @media (max-width: 600px) { .rg { grid-template-columns: 1fr !important; } }
        [data-lastpass-icon-root], [data-lastpass-root], [id^="lastpass"], [id*="lastpass"],
        .lastpass-icon, .lp-icon, [class*="lastpass"], [data-lpignore-ext],
        div[style*="z-index: 2147483647"]:not([class]):not([id]) { display: none !important; }
      `}</style>
    </div>

    {showReport && (
      <div id="rwg-report-wrap">
        <ClientReport
          data={{ client, spouse, hasSpouse, accounts, realEstate, incomes, autos, beneficiaries, children, willsTrust, poa, annualExpenses, homeOwnership }}
          onClose={() => setShowReport(false)}
        />
      </div>
    )}
    </>
  );
}
