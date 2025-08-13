// pages/proposal-template.js
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "proposalTemplateContent";

// Embedded fallback template (what loads first if nothing saved yet)
const DEFAULT_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>FSG Solutions – Proposal Template</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root{--ink:#111;--muted:#666;--brand:#0d3b66;--accent:#1e90ff;--border:#d6d6d6;}
  *{box-sizing:border-box}
  html,body{height:100%}
  body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial;color:var(--ink);margin:0;background:#fff;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:32px;}
  .page{max-width:800px;margin:0 auto}
  header{border-bottom:3px solid var(--brand);padding-bottom:12px;margin-bottom:20px}
  .brand{font-weight:800;font-size:24px;color:var(--brand);letter-spacing:.3px}
  .contact{color:var(--muted);font-size:13px;margin-top:4px}
  h1,h2,h3{margin:.8em 0 .35em}
  h1{font-size:26px}
  h2{font-size:20px;color:var(--brand)}
  h3{font-size:16px}
  p{margin:.5em 0}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:12px;border:1px solid var(--border);border-radius:8px;background:#fafafa;margin:18px 0}
  .meta b{display:block;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#eef6ff;color:#084298;border:1px solid #b6daff;font-size:12px}
  .toc{border:1px solid var(--border);border-radius:8px;overflow:hidden;margin:22px 0}
  .toc h3{background:#f5f7fb;margin:0;padding:10px 12px;border-bottom:1px solid var(--border)}
  .toc ol{margin:0;padding:10px 28px}
  .callout{border-left:4px solid var(--accent);background:#f6fbff;padding:12px 14px;margin:12px 0}
  table{width:100%;border-collapse:collapse;margin:12px 0}
  th,td{border:1px solid var(--border);padding:8px;vertical-align:top}
  .pagebreak{border:0;border-top:1px dashed var(--border);margin:28px 0;page-break-after:always}
  footer{margin-top:28px;color:var(--muted);font-size:12px}
  @media print{body{padding:0.6in}header{border-color:var(--brand)}.no-print{display:none!important}}
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="brand">FSG SOLUTIONS LLC</div>
    <div class="contact">
      <div>123 YOUR STREET • YOUR CITY, ST 12345</div>
      <div>(123) 456-7890 • EXAMPLE@FSGSOLUTIONS.NET</div>
    </div>
  </header>

  <h1>Proposal</h1>

  <div class="meta">
    <div><b>Date</b><div>September 04, 2025</div></div>
    <div><b>Proposed For</b><div>COMPANY NAME — COMPANY ADDRESS</div></div>
    <div><b>Contract</b><div>NAME OF CONTRACT <span class="pill">(CONTRACT #)</span></div></div>
    <div><b>Company Identifiers</b><div>Set-Asides: <span class="pill">WOSB</span> <span class="pill">SDVOSB</span> &nbsp;|&nbsp; CAGE: ______ &nbsp;|&nbsp; NAICS: ______</div></div>
  </div>

  <div class="toc">
    <h3>Table of Contents</h3>
    <ol>
      <li>Transmittal Letter</li>
      <li>Executive Summary</li>
      <li>Explanation of Services</li>
      <li>Solicitation Requirements</li>
    </ol>
  </div>

  <h2>Transmittal Letter</h2>
  <p>FSG SOLUTIONS LLC is a WIN-WIN focused business and intentional in its approach ... (your letter text here)</p>

  <hr class="pagebreak" />

  <h2>Executive Summary</h2>
  <p><em>(One-paragraph overview tailored to this opportunity ...)</em></p>
  <div class="callout">
    <strong>Key Points</strong>
    <ul>
      <li>Mission alignment with agency objectives</li>
      <li>Experienced team and proven processes</li>
      <li>Low risk, high value, compliant proposal</li>
    </ul>
  </div>

  <h2>Explanation of Services</h2>
  <p><strong>Statement of Agreement:</strong> We agree to all the terms ...</p>

  <table>
    <thead><tr><th>Workstream</th><th>Activities</th><th>Deliverables</th><th>Quality/SLAs</th></tr></thead>
    <tbody>
      <tr><td>Planning</td><td>Kickoff, schedule, risk register</td><td>Project Plan</td><td>On-time, accepted</td></tr>
      <tr><td>Execution</td><td>Service delivery tasks…</td><td>Monthly Reports</td><td>&ge; 99% on SLAs</td></tr>
      <tr><td>Closeout</td><td>Transition, lessons learned</td><td>Closeout Package</td><td>Accepted by CO</td></tr>
    </tbody>
  </table>

  <h2>Solicitation Requirements</h2>
  <p><em>Respond to the requirements of the solicitation ...</em></p>
  <table>
    <thead><tr><th>RFP Reference</th><th>Requirement</th><th>Our Response / Where Addressed</th></tr></thead>
    <tbody>
      <tr><td>Sec. L – Instructions</td><td>Page limits, volumes, formatting</td><td>Compliant (see Vol. I–III)</td></tr>
      <tr><td>Sec. M – Evaluation</td><td>LPTA or Best Value factors</td><td>Meets/Exceeds; strengths listed</td></tr>
      <tr><td>Sec. C/SOW</td><td>Technical tasks & outcomes</td><td>Mapped to our work plan</td></tr>
    </tbody>
  </table>

  <footer>FSG SOLUTIONS LLC • www.fsgsolutions.net • Proposal Template</footer>
</div>
</body>
</html>`;

export default function ProposalTemplate() {
  const editorRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved content or fallback template
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const html = saved || DEFAULT_TEMPLATE_HTML;
    if (editorRef.current) {
      editorRef.current.innerText = "";          // ensure empty
      editorRef.current.innerHTML = html;        // load
      setLoaded(true);
    }
  }, []);

  const exec = (cmd, val = null) => document.execCommand(cmd, false, val);

  const insertTable = () => {
    const rows = 3, cols = 3;
    let html = '<table><tbody>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) html += '<td>&nbsp;</td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    pasteHtmlAtCursor(html);
  };

  const insertPageBreak = () => {
    pasteHtmlAtCursor('<hr class="pagebreak" />');
  };

  const pasteHtmlAtCursor = (html) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const el = document.createElement("div");
    el.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node, lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleSave = () => {
    const html = editorRef.current?.innerHTML || "";
    localStorage.setItem(STORAGE_KEY, html);
    alert("Saved!");
  };

  const handleClear = () => {
    if (!confirm("Clear current document?")) return;
    editorRef.current.innerHTML = DEFAULT_TEMPLATE_HTML;
    localStorage.setItem(STORAGE_KEY, DEFAULT_TEMPLATE_HTML);
  };

  const handleExport = () => {
    const html = editorRef.current?.innerHTML || "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposal_template.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printToPDF = () => {
    // open new window to print just the document content
    const win = window.open("", "_blank");
    win.document.write(editorRef.current.innerHTML);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-3">Proposal Template (Editable)</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => exec("bold")} className="border px-2 py-1">Bold</button>
        <button onClick={() => exec("italic")} className="border px-2 py-1">Italic</button>
        <button onClick={() => exec("underline")} className="border px-2 py-1">Underline</button>
        <button onClick={() => exec("formatBlock","H1")} className="border px-2 py-1">H1</button>
        <button onClick={() => exec("formatBlock","H2")} className="border px-2 py-1">H2</button>
        <button onClick={() => exec("formatBlock","H3")} className="border px-2 py-1">H3</button>
        <button onClick={() => exec("insertUnorderedList")} className="border px-2 py-1">• List</button>
        <button onClick={() => exec("insertOrderedList")} className="border px-2 py-1">1. List</button>
        <button onClick={insertTable} className="border px-2 py-1">Insert 3×3 Table</button>
        <button onClick={insertPageBreak} className="border px-2 py-1">Insert Page Break</button>
        <button onClick={handleSave} className="border px-2 py-1 bg-blue-600 text-white">Save</button>
        <button onClick={handleClear} className="border px-2 py-1">Clear</button>
        <button onClick={handleExport} className="border px-2 py-1">Export HTML</button>
        <button onClick={printToPDF} className="border px-2 py-1">Print to PDF</button>
      </div>

      {/* Editor Surface */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[70vh] border rounded p-3"
        style={{ background: "#fff" }}
      />

      {!loaded && <p className="text-sm text-gray-500 mt-2">Loading…</p>}
    </div>
  );
}
