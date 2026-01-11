import { useState, useCallback } from 'react';
import { exportToCSV } from '../utils/statistics';

export default function useExport(tableData, statistics, statsRef) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleExportCSV = useCallback(() => {
    if (!tableData || tableData.length === 0) return;
    exportToCSV(tableData, 'statistika');
    setShowExportMenu(false);
  }, [tableData]);

  const handleExportPDF = useCallback(async () => {
    if (!statsRef?.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = statsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('statistika.pdf');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }, [statsRef]);

  const handleCopyShare = useCallback(() => {
    if (!statistics?.summary) return;

    const { summary } = statistics;
    const text = `Statistika volontiranja:
Volontera: ${summary.totalVolunteers}
Sati: ${summary.totalHours}
Djece: ${summary.totalChildren}
Termina: ${summary.totalSessions}`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  }, [statistics]);

  return {
    showExportMenu,
    setShowExportMenu,
    showShareCard,
    setShowShareCard,
    copiedShare,
    handleExportCSV,
    handleExportPDF,
    handleCopyShare,
  };
}
