import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { convertCurrency, formatPrice, CURRENCY_SYMBOLS } from './currency';

/**
 * Format raw date to YYYY-MM-DD string
 */
export const formatDateString = (rawDate) => {
  if (!rawDate) return 'N/A';
  try {
    if (typeof rawDate === 'string' && rawDate.includes('T')) {
      return rawDate.split('T')[0];
    }
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return String(rawDate).trim();
  } catch {
    return String(rawDate).trim();
  }
};

/**
 * Helper to parse a valid Date object from raw date input
 */
const parseValidDate = (rawDate) => {
  if (!rawDate) return null;
  const d = new Date(rawDate);
  return isNaN(d.getTime()) ? null : d;
};

// ─────────────────────────────────────────────────────────────
// 1. Raw CSV Export
// ─────────────────────────────────────────────────────────────
export const exportToCSV = (subscriptions = []) => {
  if (!subscriptions || subscriptions.length === 0) return false;

  const headers = [
    'Subscription Name',
    'Category',
    'Price',
    'Currency',
    'Billing Cycle',
    'Next Renewal Date',
    'Status',
  ];

  const rows = subscriptions.map((sub) => {
    const priceStr = String(sub?.price || '0');
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const cleanName = `"${String(sub?.name || sub?.serviceName || 'Untitled').replace(/"/g, '""')}"`;
    const cleanCategory = `"${String(sub?.category || 'General').replace(/"/g, '""')}"`;
    const currencyCode = `"${String(sub?.currency || 'USD').replace(/"/g, '""')}"`;
    const billingCycle = `"${String(sub?.cycle || sub?.billingCycle || 'Monthly').replace(/"/g, '""')}"`;
    const renewalDate = `"${formatDateString(sub?.renewal || sub?.nextRenewalDate)}"`;
    const status = `"${String(sub?.status || 'Active').replace(/"/g, '""')}"`;

    return [cleanName, cleanCategory, numericPrice.toFixed(2), currencyCode, billingCycle, renewalDate, status].join(',');
  });

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const timestamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `subscriptions_raw_${timestamp}.csv`);
  return true;
};

// ─────────────────────────────────────────────────────────────
// 2. Financial Excel Export (ExcelJS)
// ─────────────────────────────────────────────────────────────
export const exportToExcel = async (subscriptions = [], displayCurrency = 'USD') => {
  if (!subscriptions || subscriptions.length === 0) return false;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'STArt Application';
  workbook.lastModifiedBy = 'STArt Application';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Subscriptions', {
    properties: { tabColor: { argb: 'FF4F46E5' } },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  // ── Phase 2: Column Sizing & Readability (at least 20-25 characters wide) ─
  worksheet.columns = [
    { header: 'Subscription Name', key: 'name', width: 28 },
    { header: 'Category', key: 'category', width: 22 },
    { header: 'Billing Cycle', key: 'cycle', width: 18 },
    { header: 'Next Renewal Date', key: 'renewal', width: 20 },
    { header: 'Price', key: 'price', width: 18 },
    { header: 'Currency', key: 'currency', width: 15 },
    { header: 'Status', key: 'status', width: 16 },
  ];

  // Header Styling: Professional Indigo with bold white text
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' },
  };

  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF4338CA' } },
      left: { style: 'thin', color: { argb: 'FF4338CA' } },
      bottom: { style: 'medium', color: { argb: 'FF3730A3' } },
      right: { style: 'thin', color: { argb: 'FF4338CA' } },
    };
  });

  // Standard Financial Number Format (pure numeric, no currency symbol in price cell)
  const numberFormat = '#,##0.00';

  // ── Phase 1: Populate data rows with pure Number values ───────────────────
  subscriptions.forEach((sub, index) => {
    const rawPrice = parseFloat(String(sub?.price ?? sub?.cost ?? '0').replace(/[^0-9.]/g, '')) || 0;
    const numericPrice = Number(rawPrice.toFixed(2));
    const renewalDate = parseValidDate(sub?.renewal || sub?.nextRenewalDate);

    const row = worksheet.addRow({
      name: String(sub?.name || sub?.serviceName || 'Untitled'),
      category: String(sub?.category || 'General'),
      cycle: String(sub?.cycle || sub?.billingCycle || 'Monthly'),
      renewal: renewalDate || 'N/A',
      price: numericPrice,
      currency: String(sub?.currency || displayCurrency),
      status: String(sub?.status || 'Active'),
    });

    row.height = 22;
    row.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1F2937' } };
    row.alignment = { vertical: 'middle' };

    // Format individual cells
    const nameCell = row.getCell(1);
    nameCell.alignment = { vertical: 'middle', horizontal: 'left' };

    const categoryCell = row.getCell(2);
    categoryCell.alignment = { vertical: 'middle', horizontal: 'left' };

    const cycleCell = row.getCell(3);
    cycleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    const renewalCell = row.getCell(4);
    if (renewalDate) {
      renewalCell.numFmt = 'yyyy-mm-dd';
      renewalCell.alignment = { vertical: 'middle', horizontal: 'center' };
    } else {
      renewalCell.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // Price cell: pure Number data type with financial number formatting
    const priceCell = row.getCell(5);
    priceCell.value = numericPrice;
    priceCell.numFmt = numberFormat;
    priceCell.alignment = { vertical: 'middle', horizontal: 'right' };

    // Dedicated Currency column ensures Price remains mathematically usable
    const currencyCell = row.getCell(6);
    currencyCell.alignment = { vertical: 'middle', horizontal: 'center' };

    const statusCell = row.getCell(7);
    statusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Alternating Rows: Very faint gray fill for even rows (#F9FAFB)
    if (index % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9FAFB' },
      };
    }

    // Borders: Apply a thin, light-gray border to ALL data cells
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });
  });

  // ── Phase 3: Summary Row (TOTAL MONTHLY SPEND) ───────────────────────────
  // Calculate the total of all active subscriptions (normalized to monthly spend in displayCurrency)
  const activeSubs = subscriptions.filter((s) => s && s.status === 'Active');
  const totalMonthlySpend = activeSubs.reduce((acc, sub) => {
    const raw = parseFloat(String(sub?.price ?? sub?.cost ?? '0').replace(/[^0-9.]/g, '')) || 0;
    const subCurrency = sub?.currency || displayCurrency;
    const valInDisplay = convertCurrency(raw, subCurrency, displayCurrency);
    const isYearly = (sub?.cycle || sub?.billingCycle) === 'Yearly';
    return acc + (isYearly ? valInDisplay / 12 : valInDisplay);
  }, 0);
  const roundedTotal = Number(totalMonthlySpend.toFixed(2));

  const totalRow = worksheet.addRow({
    name: 'TOTAL MONTHLY SPEND',
    category: '',
    cycle: '',
    renewal: '',
    price: roundedTotal,
    currency: String(displayCurrency),
    status: `${activeSubs.length} Active`,
  });

  totalRow.height = 26;
  totalRow.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF111827' } };
  totalRow.alignment = { vertical: 'middle' };

  const totalLabelCell = totalRow.getCell(1);
  totalLabelCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Place numerical sum directly in Price column
  const totalPriceCell = totalRow.getCell(5);
  totalPriceCell.value = roundedTotal;
  totalPriceCell.numFmt = numberFormat;
  totalPriceCell.alignment = { vertical: 'middle', horizontal: 'right' };

  const totalCurrencyCell = totalRow.getCell(6);
  totalCurrencyCell.alignment = { vertical: 'middle', horizontal: 'center' };

  const totalStatusCell = totalRow.getCell(7);
  totalStatusCell.alignment = { vertical: 'middle', horizontal: 'center' };

  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF4F46E5' } },
      bottom: { style: 'double', color: { argb: 'FF4F46E5' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const timestamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `subscriptions_financial_report_${timestamp}.xlsx`);
  return true;
};

// ─────────────────────────────────────────────────────────────
// 3. Visual PDF Summary — Dark Mode Premium (jsPDF + autoTable)
// ─────────────────────────────────────────────────────────────
export const exportToPDF = (subscriptions = [], displayCurrency = 'USD') => {
  if (!subscriptions || subscriptions.length === 0) return false;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const PAGE_W = doc.internal.pageSize.width;   // 210 mm
  const PAGE_H = doc.internal.pageSize.height;  // 297 mm

  // ── Phase 1: Paint full dark canvas before any text ──────────────────────
  doc.setFillColor(15, 23, 42);  // Slate-900
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // ── Helpers: sanitise a raw price value to a plain ASCII string ──────────
  // Avoids ₹ / locale-formatted numbers causing wide character spacing in jsPDF
  const sanitisePrice = (rawVal, currCode = 'USD') => {
    const n = parseFloat(String(rawVal).replace(/[^0-9.]/g, '')) || 0;
    const symbolMap = {
      '₹': 'INR',
      '$': 'USD',
      '€': 'EUR',
      '£': 'GBP',
    };
    const cleanCode = symbolMap[currCode] || String(currCode).replace(/[^A-Za-z]/g, '') || 'USD';
    return `${String(Number(n).toFixed(2))} ${cleanCode}`;
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const activeSubs = subscriptions.filter((s) => s && s.status === 'Active');
  const pausedSubs = subscriptions.filter((s) => s && s.status === 'Paused');
  const trialSubs  = subscriptions.filter((s) => s && s.status === 'Trial');

  // Total monthly spend — Phase 4: no toLocaleString, no currency symbols
  const totalSpendUSD = activeSubs.reduce((acc, sub) => {
    const raw = parseFloat(String(sub?.price ?? sub?.cost ?? '0').replace(/[^0-9.]/g, '')) || 0;
    const valUSD = convertCurrency(raw, sub?.currency || 'USD', 'USD');
    return acc + (sub?.cycle === 'Yearly' || sub?.billingCycle === 'Yearly'
      ? valUSD / 12
      : valUSD);
  }, 0);
  const convertedTotal = convertCurrency(totalSpendUSD, 'USD', displayCurrency);
  const totalPriceStr  = sanitisePrice(convertedTotal, displayCurrency);

  // ── Top indigo accent bar ─────────────────────────────────────────────────
  doc.setFillColor(79, 70, 229);   // Indigo-600
  doc.rect(0, 0, PAGE_W, 4, 'F');

  // ── Header title — Slate-50 ───────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(248, 250, 252);  // Slate-50
  doc.text('STArt - Subscription Summary', 14, 20);

  // ── Subtitle & timestamp — Slate-400 ─────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);  // Slate-400
  doc.text('Subscription Portfolio & Recurring Expense Breakdown', 14, 28);

  const dateStr = `Generated: ${new Date().toISOString().split('T')[0]}`;
  doc.text(dateStr, PAGE_W - 14, 28, { align: 'right' });

  // ── Phase 2: Three individual Slate-800 rounded metric cards ─────────────
  //    Layout: three equal cards across the page (Y 34–56)
  //    Card widths: ~56 mm each with 7 mm gaps
  const cardY = 34;
  const cardH = 22;
  const cardW = 56;
  const cardGap = 7;
  const card1X = 14;
  const card2X = card1X + cardW + cardGap;
  const card3X = card2X + cardW + cardGap;

  // Card 1 — Total Monthly Spend
  doc.setFillColor(30, 41, 59);  // Slate-800
  doc.roundedRect(card1X, cardY, cardW, cardH, 4, 4, 'F');
  // Left accent strip (Indigo)
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(card1X, cardY, 2.5, cardH, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(248, 250, 252);  // Slate-50
  doc.text(totalPriceStr, card1X + 7, cardY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);  // Slate-400
  doc.text(`Monthly Spend (${displayCurrency})`, card1X + 7, cardY + 17);

  // Card 2 — Active Subscriptions
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(card2X, cardY, cardW, cardH, 4, 4, 'F');
  // Left accent strip (Emerald)
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(card2X, cardY, 2.5, cardH, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);   // Emerald-500
  doc.text(String(activeSubs.length), card2X + 7, cardY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Active Subscriptions', card2X + 7, cardY + 17);

  // Card 3 — Paused / Trials
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(card3X, cardY, cardW, cardH, 4, 4, 'F');
  // Left accent strip (Amber)
  doc.setFillColor(217, 119, 6);
  doc.roundedRect(card3X, cardY, 2.5, cardH, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(217, 119, 6);    // Amber-600
  doc.text(
    `${String(trialSubs.length)} Trial / ${String(pausedSubs.length)} Paused`,
    card3X + 7,
    cardY + 10
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Pending & Inactive', card3X + 7, cardY + 17);

  // ── Phase 4: Table data — sanitised prices, no locale strings ────────────
  const tableData = subscriptions.map((sub) => {
    const rawPrice  = parseFloat(String(sub?.price ?? sub?.cost ?? '0').replace(/[^0-9.]/g, '')) || 0;
    const cleanPrice = sanitisePrice(rawPrice, sub?.currency || displayCurrency);

    return [
      String(sub?.name || sub?.serviceName || 'Untitled'),
      String(sub?.category || 'General'),
      String(sub?.cycle || sub?.billingCycle || 'Monthly'),
      formatDateString(sub?.renewal || sub?.nextRenewalDate),
      cleanPrice,
      String(sub?.status || 'Active'),
    ];
  });

  // ── Phase 3: Premium dark autoTable ──────────────────────────────────────
  autoTable(doc, {
    startY: 66,
    head: [['Subscription', 'Category', 'Billing Cycle', 'Next Renewal', 'Price', 'Status']],
    body: tableData,

    // Base styles — dark canvas
    styles: {
      fillColor:   [15, 23, 42],    // Slate-900
      textColor:   [203, 213, 225], // Slate-300
      lineColor:   [51, 65, 85],    // Slate-700
      lineWidth:   0.1,
      font:        'helvetica',
      fontSize:    8.5,
      cellPadding: 3,
    },

    // Indigo header row
    headStyles: {
      fillColor:  [79, 70, 229],  // Indigo-600
      textColor:  255,
      fontStyle:  'bold',
      fontSize:   9,
      halign:     'left',
      cellPadding: 3.5,
    },

    // Alternate rows: Slate-800
    alternateRowStyles: {
      fillColor: [30, 41, 59],    // Slate-800
    },

    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      1: { cellWidth: 32 },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 28 },
      4: { halign: 'right',  fontStyle: 'bold', cellWidth: 30 },
      5: { halign: 'center', cellWidth: 24 },
    },

    // Status column colour coding
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const val = String(data.cell.raw);
        if (val === 'Active') {
          data.cell.styles.textColor = [16, 185, 129];  // Emerald-500
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Paused') {
          data.cell.styles.textColor = [148, 163, 184]; // Slate-400
        } else if (val === 'Trial') {
          data.cell.styles.textColor = [217, 119, 6];   // Amber-600
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Flagged') {
          data.cell.styles.textColor = [239, 68, 68];   // Rose-500
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },

    // Paint dark canvas on continuation pages before table content is drawn
    willDrawPage: (data) => {
      if (data.pageNumber > 1) {
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
        doc.setFillColor(79, 70, 229); // Indigo-600 top bar
        doc.rect(0, 0, PAGE_W, 4, 'F');
      }
    },

    // Footer drawn after page content is rendered
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);  // Slate-600
      doc.text(
        `Generated by STArt  •  Page ${data.pageNumber} of ${pageCount}`,
        PAGE_W / 2,
        PAGE_H - 7,
        { align: 'center' }
      );
    },
  });

  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`subscriptions_visual_summary_${timestamp}.pdf`);
  return true;
};

