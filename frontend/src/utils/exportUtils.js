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

  // Strict Typed Columns Definition with generous column widths (at least 20, 25 for name)
  worksheet.columns = [
    { header: 'Subscription Name', key: 'name', width: 25 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Billing Cycle', key: 'cycle', width: 20 },
    { header: 'Next Renewal Date', key: 'renewal', width: 20 },
    { header: 'Price', key: 'price', width: 20 },
    { header: 'Currency', key: 'currency', width: 20 },
    { header: 'Status', key: 'status', width: 20 },
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

  // Currency Accounting Format
  const symbol = CURRENCY_SYMBOLS[displayCurrency] || '$';
  const currencyNumFmt = `"${symbol}"#,##0.00`;

  // Populate data rows
  subscriptions.forEach((sub, index) => {
    const priceStr = String(sub?.price || '0');
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
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

    const priceCell = row.getCell(5);
    priceCell.numFmt = currencyNumFmt;
    priceCell.alignment = { vertical: 'middle', horizontal: 'right' };

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

  // Total Row: Bold styling + top border + double bottom border to separate clearly from data
  const totalRowIndex = subscriptions.length + 2;
  const totalRow = worksheet.addRow({
    name: 'Total Monthly Projected',
    price: { formula: `SUM(E2:E${totalRowIndex - 1})` },
  });

  totalRow.height = 26;
  totalRow.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FF111827' } };
  totalRow.alignment = { vertical: 'middle' };

  const totalLabelCell = totalRow.getCell(1);
  totalLabelCell.alignment = { vertical: 'middle', horizontal: 'left' };

  const totalFormulaCell = totalRow.getCell(5);
  totalFormulaCell.numFmt = currencyNumFmt;
  totalFormulaCell.alignment = { vertical: 'middle', horizontal: 'right' };

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
// 3. Visual PDF Summary (jsPDF + autoTable)
// ─────────────────────────────────────────────────────────────
export const exportToPDF = (subscriptions = [], displayCurrency = 'USD') => {
  if (!subscriptions || subscriptions.length === 0) return false;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeSubs = subscriptions.filter((s) => s && s.status === 'Active');
  const pausedSubs = subscriptions.filter((s) => s && s.status === 'Paused');
  const trialSubs = subscriptions.filter((s) => s && s.status === 'Trial');

  // Calculate total monthly spend converted to display currency
  const totalSpendInUSD = activeSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const subCurr = sub?.currency || 'USD';
    const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
    return acc + (sub?.cycle === 'Yearly' || sub?.billingCycle === 'Yearly' ? valInUSD / 12 : valInUSD);
  }, 0);

  const convertedTotal = convertCurrency(totalSpendInUSD, 'USD', displayCurrency);

  // Top Indigo Brand Accent Line
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.rect(0, 0, 210, 4, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(31, 41, 55); // Dark Slate (RGB: 31, 41, 55 / #1F2937)
  doc.text('STArt - Subscription Summary', 14, 20);

  // Subtitle & Timestamp (Hard Y positioning)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(107, 114, 128); // Gray-500
  doc.text('Subscription Portfolio & Recurring Expense Breakdown', 14, 28);

  const dateStr = `Generated: ${new Date().toLocaleDateString()}`;
  doc.text(dateStr, 196, 28, { align: 'right' });

  // Summary Metrics Section (Hard Y=34 to Y=56)
  doc.setFillColor(249, 250, 251); // Gray-50
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.roundedRect(14, 34, 182, 22, 3, 3, 'FD');

  // KPI 1: Monthly Spend
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text(formatPrice(convertedTotal, displayCurrency), 22, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`Total Monthly Spend (${displayCurrency})`, 22, 50);

  // KPI 2: Active Subscriptions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129); // Emerald-500
  doc.text(String(activeSubs.length), 92, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Active Subscriptions', 92, 50);

  // KPI 3: Inactive / Trials
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(217, 119, 6); // Amber-600
  doc.text(`${trialSubs.length} Trial / ${pausedSubs.length} Paused`, 148, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Pending & Inactive', 148, 50);

  // Table Data Preparation
  const tableData = subscriptions.map((sub) => {
    const priceStr = String(sub?.price || '0');
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const formattedPrice = formatPrice(numericPrice, sub?.currency || displayCurrency);

    return [
      String(sub?.name || sub?.serviceName || 'Untitled'),
      String(sub?.category || 'General'),
      String(sub?.cycle || sub?.billingCycle || 'Monthly'),
      formatDateString(sub?.renewal || sub?.nextRenewalDate),
      formattedPrice,
      String(sub?.status || 'Active'),
    ];
  });

  // Render Table via autoTable with exact parameters and startY below summary metrics
  autoTable(doc, {
    startY: 66,
    theme: 'striped',
    head: [['Subscription', 'Category', 'Billing Cycle', 'Next Renewal', 'Price', 'Status']],
    body: tableData,
    headStyles: {
      fillColor: [79, 70, 229], // Indigo-600
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246], // Gray-100
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [31, 41, 55],
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      1: { cellWidth: 32 },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 28 },
      4: { halign: 'right', fontStyle: 'bold', cellWidth: 28 },
      5: { halign: 'center', cellWidth: 26 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const val = String(data.cell.raw);
        if (val === 'Active') {
          data.cell.styles.textColor = [16, 185, 129]; // Emerald
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Paused') {
          data.cell.styles.textColor = [107, 114, 128]; // Gray
        } else if (val === 'Trial') {
          data.cell.styles.textColor = [217, 119, 6]; // Amber
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Generated by STArt • Page ${data.pageNumber} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    },
  });

  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`subscriptions_visual_summary_${timestamp}.pdf`);
  return true;
};
