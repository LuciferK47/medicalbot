import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

interface HealthRecord {
  id: string;
  fileName: string;
  summary?: string;
  status: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await apiClient.get('/records', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRecords(res.data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };
    fetchRecords();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('record', file);

    try {
      const res = await apiClient.post('/records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      setRecords([...records, res.data]);
      setFile(null);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async (id: string) => {
    setSummarizing(id);
    try {
      const res = await apiClient.post(`/records/${id}/summarize`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedRecords = records.map((r) => (r.id === id ? res.data : r));
      setRecords(updatedRecords);
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setSummarizing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-400 mb-10">Here is your health record dashboard.</p>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload New Record</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-grow p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Your Health Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {records.map((record) => (
              <div key={record.id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 truncate">{record.fileName}</h3>
                  <p className="text-sm text-gray-400 mb-4">Status: <span className={`font-semibold ${record.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{record.status}</span></p>
                  <div className="bg-gray-700 p-4 rounded-md mb-4 h-40 overflow-y-auto">
                    <p className="text-gray-300">{record.summary || 'No summary available. Click Summarize to generate one.'}</p>
                  </div>
                </div>
                {record.status !== 'completed' && (
                  <button
                    onClick={() => handleSummarize(record.id)}
                    disabled={summarizing === record.id}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {summarizing === record.id ? 'Summarizing...' : 'Summarize'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;