const STAGE_LABELS = {
  queued: 'Starting…',
  extracting_audio: 'Extracting audio…',
  transcribing: 'Transcribing speech…',
  planning_broll: 'Planning B-roll…',
  generating_broll: 'Generating B-roll clips…',
  building_video: 'Building video…',
  applying_style: 'Applying style…',
  burning_captions: 'Adding captions…',
};

const STAGE_ORDER = [
  'queued',
  'extracting_audio',
  'transcribing',
  'planning_broll',
  'generating_broll',
  'building_video',
  'applying_style',
  'burning_captions',
];

export default function ProgressSteps({ stage, message, progress }) {
  const currentIndex = STAGE_ORDER.indexOf(stage);
  const label = stage ? (STAGE_LABELS[stage] ?? message ?? stage) : 'Processing…';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="animate-spin w-6 h-6 border-2 border-accent-lime border-t-transparent" />
        <span className="text-zinc-300 font-medium">{label}</span>
      </div>
      {progress != null && (
        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-lime transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {message && stage && STAGE_LABELS[stage] !== message && (
        <p className="text-sm text-zinc-500">{message}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {STAGE_ORDER.map((s, i) => (
          <span
            key={s}
            className={`text-xs px-2 py-1 rounded ${
              i < currentIndex ? 'bg-accent-lime/30 text-accent-lime' : ''
            } ${i === currentIndex ? 'bg-accent-lime text-black' : ''} ${
              i > currentIndex ? 'bg-zinc-800 text-zinc-600' : ''
            }`}
          >
            {STAGE_LABELS[s] ?? s}
          </span>
        ))}
      </div>
    </div>
  );
}
