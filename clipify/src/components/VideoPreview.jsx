import { getOutputVideoURL } from '../api/upload.js';

export default function VideoPreview({ outputVideoUrl, processingTime, overlaysAdded }) {
  const src = outputVideoUrl ? getOutputVideoURL(outputVideoUrl) : null;
  const downloadUrl = src;

  return (
    <div className="space-y-4">
      <div className="aspect-[9/16] max-w-md mx-auto bg-black border border-white/20 overflow-hidden">
        {src ? (
          <video
            src={src}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            No preview
          </div>
        )}
      </div>
      {(processingTime != null || overlaysAdded != null) && (
        <div className="flex gap-4 text-sm text-zinc-400">
          {processingTime != null && <span>Processed in {processingTime.toFixed(1)}s</span>}
          {overlaysAdded != null && <span>{overlaysAdded} overlays added</span>}
        </div>
      )}
      {downloadUrl && (
        <div className="flex gap-3">
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-lime text-black font-semibold hover:bg-accent-lime-dim rounded-lg transition uppercase text-sm"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
