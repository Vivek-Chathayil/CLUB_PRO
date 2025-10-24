
import React, { useState } from 'react';
import { Payment } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UploadIcon } from '../ui/Icons';

interface SubmitProofFormProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  onProofSubmitted: (payment: Payment) => void;
}

export const SubmitProofForm: React.FC<SubmitProofFormProps> = ({ isOpen, onClose, payment, onProofSubmitted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if(selectedFile.size > 5 * 1024 * 1024) {
            setError("File size cannot exceed 5MB.");
            return;
        }
        setError('');
        setFile(selectedFile);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        }
        reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // In a real app, you'd upload to Cloudinary and get a URL.
      // Here, we'll just simulate it.
      const simulatedUrl = `https://res.cloudinary.com/demo/image/upload/${file.name}`;
      const updatedPayment = await api.submitPaymentProof(payment._id, simulatedUrl);
      onProofSubmitted(updatedPayment);
    } catch (err) {
      setError('Failed to submit proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Payment Proof">
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Please upload a receipt or screenshot of your payment for verification.</p>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-500 px-6 py-10">
            <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <div className="mt-4 flex text-sm leading-6 text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-cricket-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-cricket-green-600 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 hover:text-cricket-green-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-slate-500">PNG, JPG, PDF up to 5MB</p>
            </div>
        </div>
        {preview && <img src={preview} alt="Proof preview" className="mt-4 max-h-40 mx-auto rounded-md" />}
        {file && <p className="text-sm text-center text-slate-300">{file.name}</p>}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading} disabled={!file}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};
