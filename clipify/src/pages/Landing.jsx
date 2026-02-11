import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useInView } from '../hooks/useInView.js';
import Header from '../components/Header.jsx';
import DurationSlider from '../components/DurationSlider.jsx';
import AspectRatioSelector from '../components/AspectRatioSelector.jsx';

const HAS_GOOGLE = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SMART_EXPAND_BY_TOPIC = {
  tutorial: [
    'Break down key steps with clear cutaways. Use bold on-screen text for each tip. Add a progress indicator feel.',
    'Highlight the before/after with side-by-side or transition shots. Caption each step with punchy, actionable text.',
    'Use zooms on critical moments. Add "Pro tip" captions in a distinct style. Include b-roll of tools or screens.',
  ],
  product: [
    'Show the product from multiple angles with smooth transitions. Use luxury-style captions and slow zooms on details.',
    'Emphasize features with quick cuts and bold callouts. Add lifestyle b-roll showing the product in use.',
    'Build desire with close-ups and ambient shots. Sync captions to highlight benefits and specs.',
  ],
  fitness: [
    'Match cuts to the beat. Use countdown or rep counters. Add motivational text that pops at key moments.',
    'Show form from multiple angles. Caption each movement with form cues. Include energizing transitions.',
    'Build intensity with faster cuts toward the climax. Bold captions for "Push it" and "One more" moments.',
  ],
  interview: [
    'Cut to relevant b-roll when the speaker mentions concepts. Use quote-style captions for memorable lines.',
    'Add reaction cuts or relevant footage. Highlight key insights with larger, standout captions.',
  ],
  vlog: [
    'Add comedic cuts and reaction moments. Use casual, punchy captions. Include b-roll from the day.',
    'Pace with the energy of the story. Captions that emphasize humor or surprise. Quick cuts for laughs.',
  ],
  default: [
    'Add cinematic B-roll that matches the pacing and emotion. Use bold, dynamic captions to highlight key moments.',
    'Include cutaway shots that emphasize the struggle and the win moment. Sync captions with speech for impact.',
    'Add smooth transitions between scenes. Use word-level captions with vibrant styling to keep viewers hooked.',
    'Emphasize the narrative arc with supportive B-roll. Apply Instagram-style captions with punchy text.',
    'Include atmospheric B-roll to build tension. Add captions that pop on screen at key phrases.',
    'Use dynamic B-roll that complements the talking points. Style captions with high contrast for readability.',
  ],
};

const DETECT_TOPIC = (text) => {
  const t = text.toLowerCase();
  if (/\b(tutorial|how to|step by step|guide|learn)\b/.test(t)) return 'tutorial';
  if (/\b(product|unboxing|review|buy|purchase)\b/.test(t)) return 'product';
  if (/\b(fitness|workout|gym|exercise|rep)\b/.test(t)) return 'fitness';
  if (/\b(interview|conversation|podcast|talk)\b/.test(t)) return 'interview';
  if (/\b(vlog|day in|travel|vlog)\b/.test(t)) return 'vlog';
  return 'default';
};

export default function Landing() {
  const { isAuthenticated, loginAsDev } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [aspectRatios, setAspectRatios] = useState(['instagram-reels']);
  const [audioOn, setAudioOn] = useState(true);
  const [expanding, setExpanding] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (isAuthenticated) {
      fileInputRef.current?.click();
    } else {
      handleGetStarted();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target?.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['mp4', 'mov', 'avi'].includes(ext)) return;
    if (file.size > 100 * 1024 * 1024) return;
    sessionStorage.setItem('clipify_landing_form', JSON.stringify({ prompt, duration, aspectRatios, audioOn }));
    navigate('/upload', { state: { file } });
  };

  const handleSmartExpand = () => {
    setExpanding(true);
    const current = prompt.trim();
    const topic = DETECT_TOPIC(current);
    const templates = SMART_EXPAND_BY_TOPIC[topic] || SMART_EXPAND_BY_TOPIC.default;
    const pick = templates[Math.floor(Math.random() * templates.length)];

    let expanded;
    if (!current) {
      expanded = pick;
    } else if (current.length < 80) {
      expanded = `${current}. ${pick}`;
    } else {
      const connectors = [' Weave in ', ' Layer in ', ' Add '];
      const c = connectors[Math.floor(Math.random() * connectors.length)];
      expanded = current + c.toLowerCase() + pick.toLowerCase().replace(/^./, (x) => x.toUpperCase());
    }
    setPrompt(expanded.slice(0, 3500));
    setTimeout(() => setExpanding(false), 400);
  };

  const handleGetStarted = () => {
    sessionStorage.setItem('clipify_landing_form', JSON.stringify({
      prompt,
      duration,
      aspectRatios,
      audioOn,
    }));
    if (HAS_GOOGLE) {
      navigate('/signin', { state: { from: { pathname: '/upload' } } });
    } else {
      loginAsDev();
      navigate('/upload');
    }
  };

  const handleGenerate = () => {
    handleGetStarted();
  };

  const handleCreateClipClick = () => {
    if (isAuthenticated) {
      document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleGetStarted();
    }
  };

  const [createRef, createInView] = useInView({ threshold: 0.05, rootMargin: '0px' });
  const [featureRef, featureInView] = useInView();
  const [toolsRef, toolsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Hero - dark + Zypit poppy orbs (purple, lime, coral) */}
      <section className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-[#1a0a2e] to-black flex flex-col overflow-hidden">
        <Header />

        {/* Floating orbs - Zypit poppy: purple, lime, coral */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-accent-purple/40 blur-3xl animate-float-blob" />
          <div className="absolute bottom-[25%] left-[10%] w-80 h-80 bg-accent-lime/25 blur-3xl animate-float-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute top-[50%] right-[30%] w-64 h-64 bg-accent-coral/35 blur-3xl animate-float-blob" style={{ animationDelay: '-2s' }} />
        </div>

        {/* Grid overlay for texture - pointer-events-none so it never blocks clicks */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Hero - left-aligned, staggered animations */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-24">
          <div className="max-w-3xl">
            <p className="hero-stagger-1 text-accent-lime text-xs font-semibold uppercase tracking-[0.3em] mb-6">
              AI clips. Zero hassle.
            </p>
            <h1 className="hero-stagger-2 font-display text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight mb-4">
              Turn long videos
              <br />
                <span className="inline-block bg-gradient-to-r from-accent-lime via-accent-purple to-accent-coral bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
                into clips
              </span>
            </h1>
            <p className="hero-stagger-3 inline-block px-4 py-2 rounded-full bg-accent-red text-white font-bold text-2xl tracking-tight mb-8">
              2026
            </p>
            <p className="hero-stagger-4 text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
              Upload once. Get B-roll, captions, and social-ready exports. Built for creators who move fast.
            </p>
            <div className="hero-stagger-5">
              <button
                onClick={handleCreateClipClick}
                className="group relative py-4 px-8 bg-accent-lime text-black font-bold text-lg rounded-xl hover:bg-accent-lime-dim hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(207,255,0,0.4)]"
                type="button"
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform inline-block">
                  {isAuthenticated ? 'Create clip' : 'Get started'}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </main>
      </section>

      {/* Create section - dark with lime accent, animations */}
      <section id="create" ref={createRef} className={`section-reveal relative py-24 text-white ${createInView ? 'is-visible' : ''}`}>
        {/* Subtle gradient mesh bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#141414] to-[#0d0d0d] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(207,255,0,0.06),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(207,255,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(207,255,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className={`text-accent-lime text-sm uppercase tracking-[0.2em] mb-2 ${createInView ? 'create-stagger-1' : ''}`}>Create</p>
          <div className={`h-0.5 w-16 bg-accent-lime mb-8 ${createInView ? 'create-stagger-2' : ''}`} />
          <h2 className={`font-display text-4xl font-bold mb-8 ${createInView ? 'create-stagger-3' : ''}`}>
            Describe it.<br /><span className="text-accent-lime">We clip it.</span>
          </h2>
          <div className="space-y-6">
            <div className={`rounded-xl border-2 border-white/20 bg-black/60 p-5 create-input-glow focus-within:border-accent-lime transition-all duration-300 backdrop-blur-sm ${createInView ? 'create-stagger-4' : ''}`}>
              <div className="flex gap-3">
                <span className="text-2xl opacity-70 flex-shrink-0 transition-transform duration-300 group-focus-within:scale-110">🖼</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 3500))}
                  placeholder="Try: &quot;Fitness tutorial, 3-minute ab workout&quot; or &quot;Product unboxing, luxury feel&quot;..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 placeholder:text-sm resize-none min-h-[90px]"
                  rows={2}
                />
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSmartExpand}
                  disabled={expanding}
                  className={`flex items-center gap-2 text-accent-lime text-xs font-bold uppercase hover:text-accent-lime-dim disabled:opacity-50 transition-all duration-200 hover:scale-105 ${!expanding ? 'smart-expand-ready' : ''}`}
                >
                  {expanding ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-accent-lime border-t-transparent rounded-full animate-spin" />
                      Expanding…
                    </>
                  ) : (
                    <>
                      <span className="text-sm">✨</span>
                      Smart Expand
                    </>
                  )}
                </button>
                <span className="text-white/40 text-sm tabular-nums">{prompt.length}/3500</span>
              </div>
            </div>
            <div className={`space-y-5 ${createInView ? 'create-stagger-5' : ''}`}>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-white/60 text-sm">Seed Video</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent-lime/50 text-accent-lime text-xs font-semibold uppercase hover:bg-accent-lime/10 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </button>
                <div className="min-w-0">
                  <AspectRatioSelector value={aspectRatios} onChange={setAspectRatios} compact />
                </div>
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <input type="checkbox" checked={audioOn} onChange={(e) => setAudioOn(e.target.checked)} className="accent-accent-lime w-4 h-4 rounded" />
                  <span className="text-white/60 text-sm group-hover/check:text-white transition">Audio</span>
                </label>
              </div>
              <DurationSlider value={duration} onChange={setDuration} label="Clip duration" />
            </div>
            <div className={createInView ? 'create-stagger-6' : ''}>
              <button
                onClick={handleGenerate}
                className="w-full py-4 bg-accent-lime text-black font-bold hover:bg-accent-lime-dim hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl hover:shadow-[0_0_40px_rgba(207,255,0,0.3)]"
                type="button"
              >
                Generate / credits: 0
              </button>
            </div>
            <p className="text-white/50 text-sm mt-4">MP4, MOV, AVI • Max 100 MB • Max 60 seconds</p>
          </div>
        </div>
      </section>

      {/* Feature section - Zypit purple */}
      <section ref={featureRef} className={`section-reveal relative py-24 bg-[#6A3DD2] overflow-hidden ${featureInView ? 'is-visible' : ''}`}>
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path className="draw-on-visible" d="M0 250 Q400 150 800 300 T1400 220" stroke="white" strokeWidth="80" fill="none" />
            <path className="draw-on-visible draw-delay-2" d="M-50 450 Q350 350 900 450 T1300 400" stroke="#CFFF00" strokeWidth="60" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-accent-lime text-sm uppercase tracking-[0.2em] mb-6">AI Clip Generator</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            One video.<br />Endless clips.
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Upload your talking video. Our AI adds B-roll and word-level captions. Export for Instagram Reels, YouTube Shorts, and more.
          </p>
          <div className="inline-block bg-black text-white font-bold px-6 py-3 rounded-lg mb-2">
            B-roll + captions. One click.
          </div>
          <p className="text-white/70 text-sm mt-6">
            MP4, MOV, AVI • Max 100 MB • Max 60 seconds
          </p>
          <button
            onClick={handleGenerate}
            className="mt-10 px-8 py-4 bg-accent-lime text-black font-bold hover:bg-accent-lime-dim hover:scale-105 transition-all rounded-lg uppercase tracking-wide"
            type="button"
          >
            Get started
          </button>
        </div>
      </section>

      {/* Third section - dark with accent */}
      <section ref={toolsRef} className={`section-reveal py-24 bg-black ${toolsInView ? 'is-visible' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-accent-lime text-sm uppercase tracking-[0.2em] mb-2">Creator Tools</p>
          <div className="h-0.5 w-20 mx-auto bg-accent-lime mb-8" />
          <h2 className="font-display text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
            Done in<br />minutes.
          </h2>
          <p className="text-white/90 text-lg mb-6">
            Create polished clips in minutes. AI B-roll, captions, and social-ready exports.
          </p>
          <p className="font-display text-6xl font-bold text-accent-purple mb-6 animate-pulse-subtle">5-7 MIN</p>
          <p className="text-white/80">
            You upload the video, <strong className="text-white">we do the rest</strong>. No awkward editing.
          </p>
        </div>
      </section>

      {/* Contact / CTA section */}
      <section ref={ctaRef} className={`section-reveal py-24 bg-black ${ctaInView ? 'is-visible' : ''}`}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-6xl sm:text-7xl font-extrabold text-accent-red mb-4">
            Let&apos;s go.
          </h2>
          <p className="text-white text-lg mb-10">
            Got a video? Drop it in and see the magic happen.
          </p>
          <button
            onClick={handleGenerate}
            className="group w-full max-w-md mx-auto block py-4 px-6 bg-[#222] text-accent-lime font-bold border-2 border-accent-lime hover:bg-accent-lime hover:text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(207,255,0,0.3)] transition-all duration-300 rounded-xl"
            type="button"
          >
            <span className="group-hover:tracking-wide transition-all duration-300">Create your first clip</span>
          </button>
        </div>
      </section>
    </div>
  );
}
