import { jsPDF } from "jspdf";

export function generatePdfReport(scanData: any) {
  if (!scanData) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const secondaryColor = [99, 102, 241]; // Indigo 500
  const lightBg = [248, 250, 252]; // Slate 50
  const textColor = [51, 65, 85]; // Slate 700
  const borderCol = [226, 232, 240]; // Slate 200

  let y = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  // --- HEADER COVER PAGE ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 60, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Shopify Store Audit Report", 20, 25);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Domain: ${scanData.domain}`, 20, 35);
  doc.text(`Scan Date: ${new Date(scanData.scannedAt).toLocaleDateString()}`, 20, 42);

  // Overall Score Badge
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(155, 12, 35, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`${scanData.scores.overall}`, 172.5, 30, { align: "center" });
  doc.setFontSize(8);
  doc.text("OVERALL GRADE", 172.5, 38, { align: "center" });

  y = 80;

  // --- EXECUTIVE SUMMARY ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 20, y);
  y += 6;

  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, y, 50, y);
  y += 8;

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const platformText = scanData.isShopify 
    ? `This website is verified to run on Shopify, utilizing the "${scanData.metadata.themeName}" theme.`
    : `This website does not appear to run on Shopify. Some audit metrics may be simulated or limited.`;
  
  const summaryParagraph = `${platformText} Our automated crawlers scanned the site and generated scores across six core modules: SEO, Shopify App Load, Theme Intelligence, Accessibility, Images, and PageSpeed Performance. We identified a total of ${scanData.allIssues.length} issues that could be resolved to optimize merchant conversion rate and search rankings.`;
  
  const splitSummary = doc.splitTextToSize(summaryParagraph, 170);
  doc.text(splitSummary, 20, y);
  y += splitSummary.length * 5 + 10;

  // --- SCORE CHART / GRID ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Module Scores", 20, y);
  y += 8;

  const modules = [
    { name: "Search Engine Optimization (SEO)", score: scanData.scores.seo },
    { name: "Shopify App Performance", score: scanData.scores.apps },
    { name: "Theme Structure Intelligence", score: scanData.scores.theme },
    { name: "Accessibility Compliance", score: scanData.scores.accessibility },
    { name: "Image Sizing & Formats", score: scanData.scores.images },
    { name: "Google PageSpeed Performance", score: scanData.scores.pagespeed },
    { name: "QA Automation Test", score: scanData.scores.qa },
    { name: "Competitor Benchmark", score: scanData.scores.benchmark },
    { name: "App Cost Analyzer", score: scanData.scores.cost },
    { name: "Conversion Rate Optimization (CRO)", score: scanData.scores.cro },
    { name: "Speed Optimization Planner", score: scanData.scores.speedPlanner },
  ];

  modules.forEach(m => {
    checkPageBreak(12);
    // Draw row label
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(m.name, 20, y + 4);

    // Draw background progress bar
    doc.setFillColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.rect(110, y, 60, 5, "F");

    // Choose color based on score
    let scoreColor = [34, 197, 94]; // Green 500
    if (m.score < 50) scoreColor = [239, 68, 68]; // Red 500
    else if (m.score < 90) scoreColor = [245, 158, 11]; // Amber 500

    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(110, y, (m.score / 100) * 60, 5, "F");

    // Write score value
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`${m.score}/100`, 175, y + 4);

    y += 10;
  });

  y += 5;

  // --- ISSUES & ACTION PLAN ---
  checkPageBreak(30);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Audit Action Plan & Issues", 20, y);
  y += 6;

  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, y, 50, y);
  y += 10;

  const criticalIssues = scanData.allIssues.filter((i: any) => i.severity === "critical");
  const warningIssues = scanData.allIssues.filter((i: any) => i.severity === "warning");

  const renderIssueList = (title: string, list: any[], color: number[]) => {
    if (list.length === 0) return;

    checkPageBreak(20);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, 20, y);
    y += 8;

    list.forEach((issue: any, index: number) => {
      const itemTitle = `${index + 1}. [${issue.category}] ${issue.title}`;
      const itemDesc = `Problem: ${issue.description}\nFix: ${issue.recommendation}`;
      const splitDesc = doc.splitTextToSize(itemDesc, 160);
      const neededH = 6 + splitDesc.length * 5 + 4;

      checkPageBreak(neededH);

      // Draw issue container
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(20, y, 170, neededH - 4, "F");

      // Draw left color accent
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(20, y, 1.5, neededH - 4, "F");

      // Draw Title
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(itemTitle, 24, y + 4.5);

      // Draw Description & Fix
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(splitDesc, 24, y + 9.5);

      y += neededH;
    });
    y += 5;
  };

  renderIssueList("Critical Security & Performance Fixes", criticalIssues, [220, 38, 38]);
  renderIssueList("Opportunities & Warnings", warningIssues, [217, 119, 6]);

  // Save the PDF
  const sanitizedDomain = scanData.domain.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`shopify_audit_${sanitizedDomain}.pdf`);
}
