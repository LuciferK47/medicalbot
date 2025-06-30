import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface HealthRecord {
  id: string;
  fileName: string;
  summary?: string;
  status: string;
  uploadDate: string;
  type: 'prescription' | 'lab-result' | 'medical-image' | 'report';
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState<string | null>(null);

  // Mock data for demo purposes
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      fileName: 'Blood_Test_Results_2024.pdf',
      summary: '**Blood Test Analysis Summary:**\n\n**Key Findings:**\n• Cholesterol levels: 185 mg/dL (Normal range)\n• Blood glucose: 92 mg/dL (Normal)\n• Hemoglobin: 14.2 g/dL (Normal)\n• White blood cell count: 6,800/μL (Normal)\n\n**Recommendations:**\n• Continue current healthy lifestyle\n• Regular exercise and balanced diet\n• Follow-up in 6 months\n\n**Important Notes:**\n• All values within normal ranges\n• No immediate concerns identified',
      status: 'completed',
      uploadDate: '2024-01-15',
      type: 'lab-result'
    },
    {
      id: '2',
      fileName: 'Prescription_Dr_Smith.jpg',
      summary: '**Prescription Analysis:**\n\n**Medicines:**\n1. Lisinopril 10mg - Once daily for blood pressure control\n2. Metformin 500mg - Twice daily with meals for diabetes management\n3. Vitamin D3 1000 IU - Once daily for bone health\n\n**Recommendations:**\n• Take Lisinopril at the same time each day\n• Monitor blood sugar levels regularly\n• Take Metformin with food to reduce stomach upset\n\n**Precautions:**\n• Watch for signs of low blood sugar\n• Stay hydrated while taking Lisinopril\n• Report any unusual side effects to your doctor',
      status: 'completed',
      uploadDate: '2024-01-10',
      type: 'prescription'
    },
    {
      id: '3',
      fileName: 'Chest_Xray_Report.pdf',
      summary: '',
      status: 'pending',
      uploadDate: '2024-01-20',
      type: 'medical-image'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        fileName: file.name,
        summary: '',
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0],
        type: 'report'
      };
      
      setRecords([newRecord, ...records]);
      setFile(null);
      setUploading(false);
    }, 2000);
  };

  const handleSummarize = async (id: string) => {
    setSummarizing(id);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const mockSummary = `**AI Analysis Complete:**\n\n**Document Type:** Medical Report\n\n**Key Findings:**\n• Document successfully processed\n• No critical abnormalities detected\n• Routine follow-up recommended\n\n**Recommendations:**\n• Continue current treatment plan\n• Schedule next appointment as advised\n• Monitor symptoms and report changes\n\n**Next Steps:**\n• Discuss results with your healthcare provider\n• Keep this record for future reference`;
      
      const updatedRecords = records.map((r) => 
        r.id === id 
          ? { ...r, summary: mockSummary, status: 'completed' }
          : r
      );
      setRecords(updatedRecords);
      setSummarizing(null);
    }, 3000);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription': return '💊';
      case 'lab-result': return '🧪';
      case 'medical-image': return '🩻';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Manage your health records and get AI-powered insights</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">📤</span>
            Upload New Record
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {file && (
                <p className="text-sm text-gray-400 mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * This is a demo - files are not actually uploaded to any server
          </p>
        </div>

        {/* Records Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-2">📋</span>
            Your Health Records ({records.length})
          </h2>
          
          {records.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">No records yet</h3>
              <p className="text-gray-400">Upload your first health record to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <div key={record.id} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getRecordIcon(record.type)}</span>
                      <div>
                        <h3 className="text-lg font-bold truncate max-w-[200px]" title={record.fileName}>
                          {record.fileName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Uploaded: {new Date(record.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-md mb-4 h-48 overflow-y-auto">
                    {record.summary ? (
                      <div className="text-gray-300 text-sm whitespace-pre-line">
                        {record.summary}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center flex items-center justify-center h-full">
                        <div>
                          <div className="text-3xl mb-2">🤖</div>
                          <p>No summary available</p>
                          <p className="text-xs">Click Analyze to generate AI summary</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {record.status !== 'completed' && (
                    <button
                      onClick={() => handleSummarize(record.id)}
                      disabled={summarizing === record.id}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {summarizing === record.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🧠</span>
                          Analyze with AI
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-12 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2">ℹ️</span>
            Demo Information
          </h3>
          <p className="text-blue-200 text-sm">
            This is a frontend-only demonstration of HealthBridge. In the full application:
          </p>
          <ul className="text-blue-200 text-sm mt-2 space-y-1 ml-4">
            <li>• Files would be securely uploaded to encrypted cloud storage</li>
            <li>• AI analysis would be performed using Google's Gemini API</li>
            <li>• User authentication would be handled via Google OAuth</li>
            <li>• All data would be stored in a secure database</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;