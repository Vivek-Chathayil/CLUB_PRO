import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../services/api';
import { UploadIcon } from '../ui/Icons';
import { Spinner } from '../ui/Spinner';

interface SetPaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SetPaymentQRModal: React.FC<SetPaymentQRModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate');
  
  // State for generating QR
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  
  // State for uploading QR
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // General state
  const [qrToSave, setQrToSave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setActiveTab('generate');
      setUpiId('');
      setPayeeName('');
      setUploadedFile(null);
      setUploadPreview(null);
      setError('');
      setLoading(true);
      api.getPaymentQRCode()
        .then(setQrToSave)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleGenerate = () => {
      if (!upiId || !payeeName) {
          setError("UPI ID and Payee Name are required to generate a QR code.");
          return;
      }
      setError('');
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;
      setQrToSave(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("File size cannot exceed 2MB.");
        return;
      }
      setError('');
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadPreview(result);
        setQrToSave(result); // Set the base64 data URL to be saved
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!qrToSave) {
      setError('Please generate or upload a QR code before saving.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.setPaymentQRCode(qrToSave);
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Club Payment QR Code">
        <div className="flex border-b border-slate-700 mb-4">
            <button onClick={() => setActiveTab('generate')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'generate' ? 'border-b-2 border-cricket-green-500 text-white' : 'text-slate-400'}`}>Generate QR</button>
            <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'upload' ? 'border-b-2 border-cricket-green-500 text-white' : 'text-slate-400'}`}>Upload Image</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Form Section */}
            <div>
                {activeTab === 'generate' && (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Enter UPI details to generate a payment QR code.</p>
                        <Input id="upiId" label="UPI ID" type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourclub@upi" />
                        <Input id="payeeName" label="Payee Name" type="text" value={payeeName} onChange={e => setPayeeName(e.target.value)} placeholder="Cricket Club Name" />
                        <Button onClick={handleGenerate}>Generate</Button>
                    </div>
                )}
                {activeTab === 'upload' && (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Upload an existing QR code image.</p>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-500 px-6 py-10">
                            <div className="text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <label htmlFor="qr-upload" className="relative cursor-pointer rounded-md font-semibold text-cricket-green-400 hover:text-cricket-green-500">
                                    <span>Upload an image</span>
                                    <input id="qr-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                                </label>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 2MB</p>
                            </div>
                        </div>
                        {uploadedFile && <p className="text-xs text-center text-slate-300">{uploadedFile.name}</p>}
                    </div>
                )}
            </div>

            {/* Preview Section */}
            <div className="text-center">
                <h3 className="font-semibold text-slate-200 mb-2">QR Code Preview</h3>
                <div className="w-48 h-48 bg-white p-2 rounded-lg mx-auto flex items-center justify-center">
                    {loading ? <Spinner /> : qrToSave ? <img src={qrToSave} alt="QR Code Preview" /> : <p className="text-xs text-slate-500">No QR code set</p>}
                </div>
            </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        <div className="flex justify-end space-x-2 pt-6 mt-4 border-t border-slate-700">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Save QR Code</Button>
        </div>
    </Modal>
  );
};