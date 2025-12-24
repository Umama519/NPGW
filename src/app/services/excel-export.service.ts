import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  async exportToFile(
    jsonData: any[],
    fileName: string,
    headerMap?: Record<string, string>,
    format: 'excel' | 'csv' | 'pdf' = 'excel'
  ): Promise<void> {

    if (!jsonData || jsonData.length === 0) {
      console.warn('⚠️ No data to export');
      return;
    }

    let exportData = jsonData;
    if (headerMap) {
      exportData = jsonData.map(row => {
        const newRow: any = {};
        for (const key in headerMap) {
          const actualKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
          newRow[headerMap[key]] = actualKey ? row[actualKey] : '';
        }
        return newRow;
      });
    }

    const headers = Object.keys(exportData[0]);
    const currentDate = new Date().toLocaleDateString();

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName); // Sheet name = fileName

  // Header row
  worksheet.insertRow(1, headers);

  // Data rows
  exportData.forEach(data => worksheet.addRow(Object.values(data)));
  const headerRow = worksheet.getRow(1);

  headerRow.eachCell(cell => {
    cell.style = {};
  });

  headerRow.font = { bold: true, size: 10, color: { argb: '000000' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };

  headerRow.eachCell(cell => {
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
  });
  
  headerRow.commit();

  (worksheet.columns as any).forEach((column: any) => {
  let maxLength = 0;

  column.eachCell({ includeEmpty: true }, (cell: any) => {
    let cellValue = '';

    if (cell.value === null || cell.value === undefined) {
      cellValue = '';
    } else if (typeof cell.value === 'object' && cell.value.richText) {
      cellValue = cell.value.richText.map((t: any) => t.text).join('');
    } else {
      cellValue = cell.value.toString();
    }

    // calculate width
    const calculatedLength = cellValue.length;

    if (calculatedLength > maxLength) {
      maxLength = calculatedLength;
    }

    // apply font size every cell
    cell.font = { size: 10 };
  });

  column.width = maxLength < 10 ? 10 : maxLength + 1;
});


worksheet.eachRow((row, rowNumber) => {
  row.eachCell(cell => {
    cell.font = { size: 10 }; 
  });

  // if (rowNumber > 1 && rowNumber % 2 === 0) {
  //   row.eachCell(cell => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'F2F2F2' },
  //     };
  //   });
  // }
  // Har row ke liye (header ke baad)
if (rowNumber > 1) {
  const isEvenRow = rowNumber % 2 === 0;

  row.eachCell({ includeEmpty: true }, (cell) => {  // ← YE LINE SABSE ZAROORI HAI
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isEvenRow ? 'FFFFFF' : 'FFFFFF' }  // Even: gray, Odd: white
    };

    // Optional: border bhi laga do taake blank cells dikhein
    cell.border = {
      top:    { style: 'thin', color: { argb: 'FFFFFF' } },
      left:   { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      right:  { style: 'thin', color: { argb: 'FFFFFF' } }
    };
  });
}
});


  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
  return;
}

if (format === 'csv') {
  // File name "visual bold" ke liye decorate kar diya
  let csvContent = `*** ${fileName.toUpperCase()} ***\n`; // Top-left report name

  // Header "visual bold" (uppercase)
  csvContent += headers.map(h => h.toUpperCase()).join(',') + '\n';

  // Data
  exportData.forEach(row => {
    csvContent += Object.values(row).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
  return;
}

if (format === 'pdf') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });

  // Top-left: Report name
  doc.setFontSize(14);
  doc.setFont('', 'bold');
  doc.text(fileName, 40, 30);

  // Top-right: Date
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont('', 'normal');
  doc.text(`Date : ${currentDate}`, doc.internal.pageSize.getWidth() - 100, 30);

  // Table
  const tableBody = exportData.map(row => Object.values(row)) as (string | number)[][];
  autoTable(doc, {
    startY: 50,
    head: [headers],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200], textColor: [2, 0, 0] },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  doc.save(`${fileName}.pdf`);
  return;
}
  }
}