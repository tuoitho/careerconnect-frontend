import React, { useRef, useState } from 'react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import { Download, Printer, Settings } from 'lucide-react';

const CVPreview = ({ cv, template }) => {
  const cvRef = useRef(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    format: 'a4',
    orientation: 'portrait',
    margin: 10,
    quality: 2
  });

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate cv={cv} />;
      case 'classic':
        return <ClassicTemplate cv={cv} />;
      case 'minimal':
        return <MinimalTemplate cv={cv} />;
      default:
        return <ModernTemplate cv={cv} />;
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setPdfOptions({
      ...pdfOptions,
      [name]: name === 'margin' || name === 'quality' ? Number(value) : value
    });
  };

  const exportToPDF = () => {
    try {
      if (!cvRef.current) {
        toast.error('CV content not found');
        return;
      }

      const cvElement = cvRef.current;
      const name = cv?.personalInfo?.fullName || 'Untitled';
      const filename = `${name.replace(/\s+/g, '_')}_CV.pdf`;

      // Set options for PDF generation
      const options = {
        margin: pdfOptions.margin,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: pdfOptions.quality, 
          useCORS: true, 
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: pdfOptions.format, 
          orientation: pdfOptions.orientation 
        }
      };

      // Add a class to the element for PDF-specific styling
      cvElement.classList.add('pdf-export');

      // Show loading toast
      toast.info('Generating PDF...');

      // Generate PDF
      html2pdf().from(cvElement).set(options).save()
        .then(() => {
          toast.success('PDF generated successfully');
          // Remove the PDF-specific class
          cvElement.classList.remove('pdf-export');
          setShowExportOptions(false);
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
          toast.error('Failed to generate PDF');
          // Remove the PDF-specific class
          cvElement.classList.remove('pdf-export');
        });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export CV to PDF');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6" ref={cvRef}>
        {renderTemplate()}
      </div>
      <div className="border-t p-4 bg-gray-50">
        {showExportOptions && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-3">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paper Format
                </label>
                <select
                  name="format"
                  value={pdfOptions.format}
                  onChange={handleOptionChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientation
                </label>
                <select
                  name="orientation"
                  value={pdfOptions.orientation}
                  onChange={handleOptionChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin (mm)
                </label>
                <input
                  type="number"
                  name="margin"
                  min="0"
                  max="50"
                  value={pdfOptions.margin}
                  onChange={handleOptionChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality
                </label>
                <select
                  name="quality"
                  value={pdfOptions.quality}
                  onChange={handleOptionChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={1}>Normal</option>
                  <option value={2}>High</option>
                  <option value={3}>Very High (slower)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <button
            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            <Settings size={16} className="mr-2" />
            {showExportOptions ? 'Hide Options' : 'Export Options'}
          </button>
          <div className="flex space-x-4">
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.print()}
            >
              <Printer size={16} className="mr-2" />
              Print
            </button>
            <button
              className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-600 hover:text-white"
              onClick={exportToPDF}
            >
              <Download size={16} className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;