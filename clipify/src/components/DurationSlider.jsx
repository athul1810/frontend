import { useState, useRef, useCallback, useEffect } from 'react';

const PRESETS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
];
const MIN = 5;
const MAX = 60;
const STEP = 1;

export default function DurationSlider({ value, onChange, label = 'Duration' }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(() => Number(value) || 5);

  useEffect(() => {
    const v = Number(value) || 5;
    setLocalValue(Math.min(MAX, Math.max(MIN, v)));
  }, [value]);

  const percent = ((localValue - MIN) / (MAX - MIN)) * 100;

  const valueToPercent = useCallback((v) => ((v - MIN) / (MAX - MIN)) * 100);
  const percentToValue = useCallback((p) => Math.round(MIN + (p / 100) * (MAX - MIN)));

  const updateFromEvent = useCallback(
    (clientX) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = percentToValue(x * 100);
      const clamped = Math.min(MAX, Math.max(MIN, val));
      setLocalValue(clamped);
      onChange?.(String(clamped));
    },
    [onChange, percentToValue]
  );

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromEvent(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateFromEvent(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) =>
      updateFromEvent(e.touches ? e.touches[0].clientX : e.clientX);
    const handleEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateFromEvent]);

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white/70">{label}</span>
          <span
            className={`text-lg font-bold tabular-nums transition-all duration-200 ${
              isDragging ? 'text-accent-lime scale-110' : 'text-accent-lime'
            }`}
          >
            {localValue}s
          </span>
        </div>
      )}
      {/* Track + thumb */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center cursor-pointer select-none group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={localValue}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const v = Math.max(MIN, localValue - (e.shiftKey ? 5 : 1));
            setLocalValue(v);
            onChange?.(String(v));
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const v = Math.min(MAX, localValue + (e.shiftKey ? 5 : 1));
            setLocalValue(v);
            onChange?.(String(v));
          }
        }}
      >
        {/* Background track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-white/10 overflow-hidden" />
        {/* Fill track */}
        <div
          className="absolute left-0 h-2 rounded-l-full bg-gradient-to-r from-accent-lime/60 to-accent-lime transition-[width] duration-75 ease-out"
          style={{ width: `${percent}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-x-0 h-2 flex justify-between px-1 pointer-events-none">
          {[5, 15, 30, 45, 60].map((t) => (
            <div
              key={t}
              className="w-px h-full bg-white/20"
              style={{ marginLeft: t === 5 ? 0 : -1 }}
            />
          ))}
        </div>
        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 -ml-3 rounded-full bg-accent-lime shadow-[0_0_20px_rgba(207,255,0,0.5)] transition-transform duration-150 border-2 border-black/20 ${
            isDragging
              ? 'scale-125 shadow-[0_0_30px_rgba(207,255,0,0.7)] ring-4 ring-accent-lime/30'
              : 'group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(207,255,0,0.6)]'
          }`}
          style={{ left: `${percent}%` }}
        />
      </div>
      {/* Quick presets */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => {
              setLocalValue(p.value);
              onChange?.(String(p.value));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              localValue === p.value
                ? 'bg-accent-lime text-black shadow-lg shadow-accent-lime/30 scale-105'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90 border border-white/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
