import { useState } from 'react';

const PRESETS = {
  Classic: { text_color: 'white', bg_color: 'black', font_size: 56, border_width: 3 },
  Vibrant: { text_color: 'yellow', bg_color: 'transparent', font_size: 56, border_width: 3 },
  Ocean: { text_color: '#06b6d4', bg_color: '#0c4a6e', font_size: 52, border_width: 2 },
  Sunset: { text_color: '#f97316', bg_color: '#451a03', font_size: 54, border_width: 2 },
  Forest: { text_color: '#22c55e', bg_color: '#052e16', font_size: 52, border_width: 2 },
  Fire: { text_color: '#fbbf24', bg_color: '#78350f', font_size: 56, border_width: 3 },
};

function findPresetName(style) {
  if (!style) return 'Classic';
  return Object.keys(PRESETS).find(
    (name) =>
      (PRESETS[name].text_color === style.text_color || toHex(PRESETS[name].text_color) === toHex(style.text_color)) &&
      PRESETS[name].bg_color === style.bg_color
  ) || null;
}

function toHex(c) {
  if (!c || (typeof c === 'string' && c.startsWith('#'))) return c || '#ffffff';
  if (c === 'white') return '#ffffff';
  if (c === 'yellow') return '#eab308';
  return c;
}

export default function CaptionStyleForm({ value, onChange }) {
  const style = value || PRESETS.Classic;
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [sampleText, setSampleText] = useState('Your caption will look like this');
  const effectivePreset = selectedPreset || findPresetName(style) || 'Classic';

  const applyPreset = (name) => {
    setSelectedPreset(name);
    onChange?.(PRESETS[name]);
  };

  const updateStyle = (key, val) => {
    setSelectedPreset(null);
    const next = { ...style, [key]: val };
    onChange?.(next);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">Caption style</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => applyPreset(name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                effectivePreset === name
                  ? 'bg-accent-lime text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/10'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Font size (30–80)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={30}
              max={80}
              value={style.font_size ?? 56}
              onChange={(e) => updateStyle('font_size', Number(e.target.value))}
              className="flex-1 h-2 bg-white/10 appearance-none cursor-pointer [accent-color:#fff]"
            />
            <span className="text-white font-medium w-8 text-right">{style.font_size ?? 56}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Text color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={toHex(style.text_color)}
              onChange={(e) => updateStyle('text_color', e.target.value)}
              className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer bg-transparent"
            />
            <span className="text-white/50 text-sm">{style.text_color || 'Custom'}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
        <label className="block text-sm font-medium text-white/70 mb-3">Sample caption</label>
        <div
          className="w-full rounded-lg p-4 flex items-center justify-center min-h-[80px]"
          style={{
            backgroundColor: style.bg_color === 'transparent' ? 'rgba(0,0,0,0.3)' : style.bg_color,
          }}
        >
          <span
            className="font-bold text-center max-w-full truncate px-2"
            style={{
              color: toHex(style.text_color),
              fontSize: Math.min((style.font_size ?? 56) * 0.4, 24),
              WebkitTextStroke: `${Math.max(1, (style.border_width || 3) * 0.5)}px black`,
              textShadow: style.bg_color === 'transparent' ? '0 1px 3px rgba(0,0,0,0.8)' : 'none',
            }}
          >
            {sampleText}
          </span>
        </div>
        <input
          type="text"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value.slice(0, 50))}
          placeholder="Type to preview..."
          className="mt-2 w-full px-3 py-2 bg-black border border-white/20 text-white text-sm placeholder-white/30 focus:border-white focus:outline-none"
        />
      </div>
    </div>
  );
}
