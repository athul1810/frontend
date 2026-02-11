import { useState, useCallback } from 'react';

const ACCEPT = '.mp4,.mov,.avi';
const MAX_SIZE_MB = 100;

export default function UploadZone({ onUploadSuccess, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['mp4', 'mov', 'avi'].includes(ext)) {
      setError('Invalid format. Use MP4, MOV, or AVI.');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB} MB.`);
      return false;
    }
    return true;
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (!file || !validateFile(file)) return;
      onUploadSuccess?.(file);
    },
    [validateFile, onUploadSuccess]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleChange = (e) => {
    const file = e.target?.files?.[0];
    handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
          dragActive
            ? 'border-accent-lime bg-accent-lime/10 scale-[1.02] shadow-lg shadow-accent-lime/20'
            : 'border-accent-lime/50 hover:border-accent-lime hover:bg-accent-lime/5 hover:scale-[1.01]'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          accept={ACCEPT}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="text-zinc-300">
          <span className="text-accent-lime font-bold">Drop video here</span>
          <span className="text-white/60"> or </span>
          <span className="text-accent-lime underline font-medium">browse</span>
        </div>
        <p className="text-sm text-zinc-500 mt-2">MP4, MOV, AVI • Max {MAX_SIZE_MB} MB • Max 60 seconds</p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
