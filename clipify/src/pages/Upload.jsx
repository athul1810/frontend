import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import UploadZone from '../components/UploadZone.jsx';
import CaptionStyleForm from '../components/CaptionStyleForm.jsx';
import AspectRatioSelector from '../components/AspectRatioSelector.jsx';
import DurationSlider from '../components/DurationSlider.jsx';
import ProgressSteps from '../components/ProgressSteps.jsx';
import VideoPreview from '../components/VideoPreview.jsx';
import { uploadVideo, startJob, getJobStatus, processVideo } from '../api/upload.js';

const CAPTION_DEFAULTS = { text_color: 'yellow', bg_color: 'black', font_size: 56, border_width: 3 };

const SMART_EXPAND_BY_TOPIC = {
  tutorial: [
    'Break down key steps with clear cutaways. Use bold on-screen text for each tip. Add a progress indicator feel.',
    'Highlight the before/after with side-by-side or transition shots. Caption each step with punchy, actionable text.',
  ],
  product: [
    'Show the product from multiple angles with smooth transitions. Use luxury-style captions and slow zooms on details.',
    'Emphasize features with quick cuts and bold callouts. Add lifestyle b-roll showing the product in use.',
  ],
  fitness: [
    'Match cuts to the beat. Use countdown or rep counters. Add motivational text that pops at key moments.',
    'Show form from multiple angles. Caption each movement with form cues.',
  ],
  interview: [
    'Cut to relevant b-roll when the speaker mentions concepts. Use quote-style captions for memorable lines.',
  ],
  vlog: [
    'Add comedic cuts and reaction moments. Use casual, punchy captions.',
  ],
  default: [
    'Add cinematic B-roll that matches the pacing and emotion. Use bold, dynamic captions.',
    'Include cutaway shots. Apply Instagram-style captions with punchy text.',
  ],
};

const DETECT_TOPIC = (text) => {
  const t = text.toLowerCase();
  if (/\b(tutorial|how to|step by step|guide|learn)\b/.test(t)) return 'tutorial';
  if (/\b(product|unboxing|review|buy|purchase)\b/.test(t)) return 'product';
  if (/\b(fitness|workout|gym|exercise|rep)\b/.test(t)) return 'fitness';
  if (/\b(interview|conversation|podcast|talk)\b/.test(t)) return 'interview';
  if (/\b(vlog|day in|travel)\b/.test(t)) return 'vlog';
  return 'default';
};

const LANDING_FORM_KEY = 'clipify_landing_form';

export default function Upload() {
  const location = useLocation();
  const didProcessFileRef = useRef(false);
  const videoPreviewRef = useRef(null);
  const [step, setStep] = useState('upload');
  const [videoFile, setVideoFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [duration, setDuration] = useState('15');
  const [captionStyle, setCaptionStyle] = useState(CAPTION_DEFAULTS);
  const [aspectRatios, setAspectRatios] = useState(['instagram-reels']);
  const [model, setModel] = useState('clipify-pro');
  const [style, setStyle] = useState('auto');
  const [error, setError] = useState(null);
  const [processingState, setProcessingState] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const handleUploadSuccess = async (file) => {
    setError(null);
    setVideoFile(file);
    setUploading(true);
    try {
      const res = await uploadVideo(file);
      setVideoId(res.video_id);
      setUploadInfo(res);
      setStep('options');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const status = err?.response?.status;
      let msg = 'Upload failed.';
      if (err?.message === 'Network Error') {
        msg = "Couldn't reach the server. Is the backend running at " + (import.meta.env.VITE_API_URL || 'http://localhost:8000') + "?";
      } else if (status === 401) {
        msg = 'Session expired. Please sign in again.';
      } else if (Array.isArray(detail)) {
        msg = detail[0] || msg;
      } else if (typeof detail === 'string') {
        msg = detail;
      }
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(LANDING_FORM_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.prompt) setUserPrompt(data.prompt.slice(0, 800));
        if (data.aspectRatios && Array.isArray(data.aspectRatios)) setAspectRatios(data.aspectRatios);
        else if (data.aspectRatio) setAspectRatios(Array.isArray(data.aspectRatio) ? data.aspectRatio : [data.aspectRatio]);
        if (data.duration) setDuration(String(data.duration));
        sessionStorage.removeItem(LANDING_FORM_KEY);
      }
      if (!didProcessFileRef.current && location.state?.file instanceof File) {
        didProcessFileRef.current = true;
        const file = location.state.file;
        window.history.replaceState({}, '', location.pathname);
        handleUploadSuccess(file);
      }
    } catch {
      sessionStorage.removeItem(LANDING_FORM_KEY);
    }
  }, [location.state?.file]);

  const handleSmartExpand = () => {
    setExpanding(true);
    const current = userPrompt.trim();
    const topic = DETECT_TOPIC(current);
    const templates = SMART_EXPAND_BY_TOPIC[topic] || SMART_EXPAND_BY_TOPIC.default;
    const pick = templates[Math.floor(Math.random() * templates.length)];
    let expanded;
    if (!current) expanded = pick;
    else if (current.length < 80) expanded = `${current}. ${pick}`;
    else {
      const c = [' Weave in ', ' Layer in ', ' Add '][Math.floor(Math.random() * 3)];
      expanded = current + c.toLowerCase() + pick.toLowerCase().replace(/^./, (x) => x.toUpperCase());
    }
    setUserPrompt(expanded.slice(0, 800));
    setTimeout(() => setExpanding(false), 400);
  };

  const handleProcess = async () => {
    if (!videoId) return;
    setError(null);
    setStep('processing');
    setProcessingState({ blocking: true });
    try {
      let usedJobs = false;
      try {
        const { job_id } = await startJob({
          video_id: videoId,
          user_prompt: userPrompt || undefined,
          caption_style: captionStyle,
          duration_seconds: Number(duration) || undefined,
          aspect_ratios: aspectRatios?.length ? aspectRatios : undefined,
        });
        usedJobs = true;
        setProcessingState({ jobId: job_id, stage: 'queued' });
        const JOB_TIMEOUT_MS = 5 * 60 * 1000;
        const startTime = Date.now();
        const poll = async () => {
          if (Date.now() - startTime > JOB_TIMEOUT_MS) {
            setError('Processing took too long. Please try again.');
            setStep('options');
            setProcessingState(null);
            return;
          }
          const res = await getJobStatus(job_id);
          if (res.status === 'completed') {
            setResult(res);
            setStep('result');
            return;
          }
          if (res.status === 'failed') {
            setError(res.detail || 'Processing failed.');
            setStep('options');
            setProcessingState(null);
            return;
          }
          setProcessingState({ jobId: job_id, stage: res.stage, message: res.message, progress: res.progress });
          setTimeout(poll, 1500);
        };
        poll();
      } catch (jobErr) {
        if (jobErr?.response?.status === 404 || jobErr?.response?.status === 501) {
          usedJobs = false;
        } else throw jobErr;
      }
      if (!usedJobs) {
        const res = await processVideo({
          video_id: videoId,
          user_prompt: userPrompt || undefined,
          caption_style: captionStyle,
          duration_seconds: Number(duration) || undefined,
          aspect_ratios: aspectRatios?.length ? aspectRatios : undefined,
        });
        setResult(res);
        setStep('result');
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = err?.message === 'Network Error'
        ? "Couldn't reach the server. Check your connection and try again."
        : Array.isArray(detail) ? detail[0] : detail || 'Processing failed.';
      setError(msg);
      setStep('options');
      setProcessingState(null);
    }
  };

  const handleProcessAnother = () => {
    setStep('upload');
    setVideoFile(null);
    setVideoId(null);
    setUploadInfo(null);
    setUserPrompt('');
    setDuration('15');
    setAspectRatios(['instagram-reels']);
    setCaptionStyle(CAPTION_DEFAULTS);
    setError(null);
    setProcessingState(null);
    setResult(null);
  };

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreviewUrl(null);
    }
  }, [videoFile]);

  return (
    <div className="min-h-screen text-white flex flex-col bg-[#0a0a0a]">
      <Header />

      {/* CapCut-style editor layout */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Main workspace: Preview + Properties */}
        <div className="flex-1 flex min-h-0">
          {/* Preview canvas - center, takes most space */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d] border-r border-white/5">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
              <span className="text-white/60 text-sm font-medium">Preview</span>
              {step === 'options' && videoFile && (
                <span className="text-accent-lime text-xs font-semibold uppercase">
                  {videoFile.name}
                </span>
              )}
            </div>
            {/* Canvas area */}
            <div className="flex-1 flex items-center justify-center p-6 min-h-0 overflow-auto">
              {step === 'upload' && (
                <div className="w-full max-w-2xl">
                  <UploadZone onUploadSuccess={handleUploadSuccess} disabled={uploading} />
                  {uploading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-white/50">
                      <div className="animate-spin w-5 h-5 border-2 border-accent-lime border-t-transparent rounded-full" />
                      Uploading…
                    </div>
                  )}
                  {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
                </div>
              )}
              {step === 'options' && videoPreviewUrl && (
                <div className="w-full max-w-2xl aspect-[9/16] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                  <video
                    ref={videoPreviewRef}
                    src={videoPreviewUrl}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                  />
                </div>
              )}
              {step === 'processing' && (
                <div className="text-center py-12">
                  <ProgressSteps
                    stage={processingState?.stage}
                    message={processingState?.message}
                    progress={processingState?.progress}
                  />
                </div>
              )}
              {step === 'result' && result && (
                <div className="w-full max-w-2xl space-y-4">
                  <VideoPreview
                    outputVideoUrl={result.output_video_url}
                    processingTime={result.processing_time}
                    overlaysAdded={result.overlays_added}
                  />
                  <button
                    onClick={handleProcessAnother}
                    className="w-full py-3 border border-white/20 text-white/80 hover:bg-white/5 uppercase tracking-wide text-sm rounded-lg"
                  >
                    Create another
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Properties panel - right, CapCut "Adjustments" style */}
          <div
            className={`${
              panelCollapsed ? 'w-14' : 'w-[380px]'
            } flex-shrink-0 border-l border-white/5 bg-[#0a0a0a] transition-all duration-300 flex flex-col relative`}
          >
            <button
              onClick={() => setPanelCollapsed(!panelCollapsed)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-7 h-14 rounded-l-md bg-[#141414] border border-r-0 border-white/10 flex items-center justify-center text-white/50 hover:text-accent-lime hover:bg-[#1a1a1a] transition z-20 shadow-lg"
              aria-label={panelCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {panelCollapsed ? '→' : '←'}
            </button>
            {panelCollapsed && (
              <div className="flex-1 flex items-center justify-center -rotate-90 text-white/30 text-xs font-medium uppercase tracking-widest whitespace-nowrap">
                Settings
              </div>
            )}
            {!panelCollapsed && (
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <h2 className="font-display text-lg font-bold text-accent-lime mb-1">AI Clip Generator</h2>
                  <p className="text-white/50 text-xs">Edit settings • Generate</p>
                </div>

                {step === 'upload' && (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 px-3 py-2 rounded-lg text-white text-sm focus:border-accent-lime/50 outline-none"
                    >
                      <option value="clipify-pro" className="bg-zinc-900">Clipify Pro</option>
                      <option value="clipify-fast" className="bg-zinc-900">Clipify Fast</option>
                    </select>
                  </div>
                )}

                {(step === 'options' || step === 'upload') && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Prompt</label>
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="B-roll style, captions feel..."
                        className="w-full bg-[#141414] border border-white/10 px-3 py-2.5 rounded-lg text-white placeholder-white/30 resize-none min-h-[72px] text-sm focus:border-accent-lime/50 outline-none"
                        rows={2}
                      />
                      <div className="flex justify-between mt-1.5">
                        <button
                          type="button"
                          onClick={handleSmartExpand}
                          disabled={expanding}
                          className="text-xs text-accent-lime hover:text-accent-lime-dim disabled:opacity-50"
                        >
                          {expanding ? '…' : '✨ Smart Expand'}
                        </button>
                        <span className="text-white/40 text-xs">{userPrompt.length}/800</span>
                      </div>
                    </div>
                    <DurationSlider value={duration} onChange={setDuration} label="Clip duration" />
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Style</label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 px-3 py-2 rounded-lg text-white text-sm focus:border-accent-lime/50 outline-none"
                      >
                        <option value="auto" className="bg-zinc-900">Auto</option>
                        <option value="vibrant" className="bg-zinc-900">Vibrant</option>
                        <option value="cinematic" className="bg-zinc-900">Cinematic</option>
                        <option value="minimal" className="bg-zinc-900">Minimal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Caption</label>
                      <CaptionStyleForm value={captionStyle} onChange={setCaptionStyle} />
                    </div>
                    <AspectRatioSelector value={aspectRatios} onChange={setAspectRatios} />
                  </>
                )}

                <button
                  onClick={step === 'options' ? handleProcess : () => {}}
                  disabled={step !== 'options' || !videoId}
                  className={`w-full py-3.5 font-bold rounded-lg uppercase text-sm tracking-wide transition-all ${
                    step === 'options' && videoId
                      ? 'bg-accent-lime text-black hover:bg-accent-lime-dim hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent-lime/20'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {step === 'processing' ? 'Processing…' : step === 'options' ? '✨ Generate clip' : 'Upload video to start'}
                </button>

                {step === 'options' && (
                  <button
                    onClick={handleProcessAnother}
                    className="w-full py-2.5 border border-white/10 text-white/50 text-sm hover:bg-white/5 rounded-lg"
                  >
                    Change video
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timeline strip - CapCut-style bottom bar */}
        <div className="h-20 border-t border-white/5 bg-[#080808] flex items-center px-4 gap-4">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>0:00</span>
            <span className="text-white/20">—</span>
            <span>{Number(duration) || 15}s</span>
          </div>
          <div className="flex-1 h-10 rounded-lg overflow-hidden bg-[#141414] border border-white/5 flex">
            {videoFile ? (
              <div
                className="h-full bg-gradient-to-r from-accent-purple/40 to-accent-lime/30 flex items-center justify-center min-w-[120px]"
                style={{ width: `${Math.min(100, ((Number(duration) || 15) / 60) * 100)}%` }}
              >
                <span className="text-white/90 text-xs font-medium truncate px-2">{videoFile?.name?.slice(0, 12)}…</span>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/20 text-xs">
                Drop video to see timeline
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
