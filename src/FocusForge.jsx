import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LayoutDashboard, ListTodo, Timer, BookOpen, BarChart3, History as HistoryIcon,
  Settings as SettingsIcon, Play, Pause, X, Plus, Search, Check, ChevronRight,
  Sun, Moon, Flame, Target, Shield, Trash2, Bookmark, AlertCircle, ChevronLeft
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ theme */

const THEMES = {
  dark: {
    bg: "#0B0E13", surface: "#12161D", surface2: "#171C25", line: "#242B38",
    text: "#E7EBF2", muted: "#8B95A7", faint: "#5C6577",
    acc: "#37A97F", accSoft: "#16302A", warn: "#C9853F", danger: "#C4574F",
  },
  light: {
    bg: "#F5F6F8", surface: "#FFFFFF", surface2: "#EEF0F4", line: "#E1E5EC",
    text: "#141821", muted: "#5E6879", faint: "#8A93A3",
    acc: "#1E8B64", accSoft: "#E1F1EA", warn: "#9E6528", danger: "#B0453D",
  },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.ff * { box-sizing: border-box; }
.ff {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg); color: var(--text);
  min-height: 100vh; -webkit-font-smoothing: antialiased;
}
.ff .mono { font-family: "IBM Plex Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
.ff .eyebrow {
  font-family: "IBM Plex Mono", monospace; font-size: 10px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--faint);
}
.ff button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
.ff button:focus-visible, .ff input:focus-visible, .ff textarea:focus-visible, .ff select:focus-visible {
  outline: 2px solid var(--acc); outline-offset: 2px;
}
.ff input, .ff textarea, .ff select {
  font-family: inherit; font-size: 14px; width: 100%;
  background: var(--surface2); color: var(--text);
  border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px;
}
.ff textarea { resize: vertical; }
.ff input::placeholder, .ff textarea::placeholder { color: var(--faint); }

.card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; }
.divider { height: 1px; background: var(--line); }

.btn { display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius: 9px; padding: 10px 16px; font-size: 14px; font-weight: 550;
  border: 1px solid var(--line); background: var(--surface2); color: var(--text);
  transition: transform .12s ease, opacity .12s ease; }
.btn:hover { opacity: .85; }
.btn:active { transform: translateY(1px); }
.btn-primary { background: var(--acc); color: #fff; border-color: var(--acc); }
.btn-ghost { background: transparent; border-color: transparent; color: var(--muted); }
.btn-ghost:hover { color: var(--text); background: var(--surface2); }
.btn-sm { padding: 6px 11px; font-size: 12.5px; border-radius: 7px; }

.chip { display:inline-flex; align-items:center; gap:5px; padding: 3px 8px; border-radius: 999px;
  font-size: 11px; font-weight: 550; border: 1px solid var(--line); color: var(--muted); }

.navitem { display:flex; align-items:center; gap:11px; padding: 9px 12px; border-radius: 9px;
  font-size: 14px; color: var(--muted); width: 100%; text-align: left; }
.navitem:hover { background: var(--surface2); color: var(--text); }
.navitem.on { background: var(--surface2); color: var(--text); font-weight: 550;
  box-shadow: inset 2px 0 0 var(--acc); }

.taskrow { display:flex; gap:12px; align-items:flex-start; padding: 13px 14px;
  border-bottom: 1px solid var(--line); }
.taskrow:last-child { border-bottom: none; }
.taskrow.drag { opacity: .4; }
.tick { width: 19px; height: 19px; border-radius: 6px; border: 1.5px solid var(--line);
  flex-shrink: 0; margin-top: 1px; display:flex; align-items:center; justify-content:center; }
.tick.done { background: var(--acc); border-color: var(--acc); color: #fff; }

.bar { height: 6px; border-radius: 999px; background: var(--surface2); overflow: hidden; }
.bar > i { display:block; height: 100%; background: var(--acc); border-radius: 999px;
  transition: width .5s cubic-bezier(.2,.7,.3,1); }

.overlay { position: fixed; inset: 0; z-index: 60; display:flex; align-items:center;
  justify-content:center; padding: 18px; background: rgba(4,6,10,.62); backdrop-filter: blur(3px); }
.sheet { width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 22px;
  animation: rise .22s cubic-bezier(.2,.7,.3,1); }
@keyframes rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }

.focus-root { position: fixed; inset: 0; z-index: 70; background: var(--bg);
  overflow-y: auto; animation: fade .3s ease; }
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
.dial { transform: rotate(-90deg); }
.dial circle { fill: none; stroke-linecap: round; }
.motiv { color: var(--faint); font-size: 13px; letter-spacing: .04em; animation: fade 1.2s ease; }

.yt { position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px;
  overflow: hidden; background: #000; border: 1px solid var(--line); }
.yt iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

.grid-stats { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0,1fr)); }
@media (min-width: 900px) { .grid-stats { grid-template-columns: repeat(4, minmax(0,1fr)); } }

.scrollx { overflow-x: auto; }
@media (prefers-reduced-motion: reduce) { .ff * { animation: none !important; transition: none !important; } }
`;

/* ------------------------------------------------------------------ utils */

const uid = () => Math.random().toString(36).slice(2, 10);
const dayKey = (d = new Date()) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const fmtMin = (m) => {
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  return h ? `${h}h ${mm}m` : `${mm}m`;
};
const clock = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
const timeOf = (iso) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const ytId = (url = "") => {
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
};

/* ---- ambient noise generator (Web Audio API, no external audio files) ---- */

const NOISE_TYPES = [
  { id: "off", label: "Off" },
  { id: "white", label: "White noise" },
  { id: "pink", label: "Pink noise" },
  { id: "brown", label: "Brown noise" },
  { id: "rain", label: "Rain" },
];

function makeNoiseEngine() {
  let ctx = null, node = null, gain = null, filterA = null, filterB = null;

  const buildBuffer = (audioCtx, kind) => {
    const len = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    if (kind === "white") {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } else if (kind === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else { // brown + rain both start from brown noise
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
    return buf;
  };

  const start = (kind) => {
    stop();
    if (kind === "off") return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    node = ctx.createBufferSource();
    node.buffer = buildBuffer(ctx, kind === "rain" ? "brown" : kind);
    node.loop = true;
    gain = ctx.createGain();
    gain.gain.value = 0.001;

    filterA = ctx.createBiquadFilter();
    filterA.type = "lowpass";
    filterA.frequency.value = kind === "rain" ? 3200 : kind === "brown" ? 900 : kind === "pink" ? 4000 : 9000;

    if (kind === "rain") {
      filterB = ctx.createBiquadFilter();
      filterB.type = "highpass";
      filterB.frequency.value = 700;
      node.connect(filterA); filterA.connect(filterB); filterB.connect(gain);
    } else {
      node.connect(filterA); filterA.connect(gain);
    }
    gain.connect(ctx.destination);
    node.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime);
  };

  const setVolume = (v) => {
    if (gain) gain.gain.setTargetAtTime(clamp(v, 0, 1) * 0.35, ctx.currentTime, 0.15);
  };

  const stop = () => {
    try { if (node) node.stop(); } catch (e) { /* already stopped */ }
    try { if (ctx) ctx.close(); } catch (e) { /* already closed */ }
    ctx = null; node = null; gain = null; filterA = null; filterB = null;
  };

  return { start, stop, setVolume };
}

const CATEGORIES = ["Internship", "College", "Coding", "NPTEL", "Personal", "Fitness", "Reading", "Other"];
const PRIORITIES = ["High", "Medium", "Low"];
const DISTRACTIONS = ["YouTube recommendation", "Instagram", "WhatsApp", "Random browsing", "Gaming", "Phone", "Hunger", "Tired", "Other"];
const EXIT_REASONS = ["Task completed early", "Need a genuine break", "Emergency", "Distracted", "Task was unclear", "Other"];
const MOTIVATION = ["One task. One session.", "Finish what you started.", "Stay with the task.", "The plan was made. Follow it.", "Nothing else needs you right now."];

const DEFAULT_SETTINGS = {
  focusMin: 25, shortBreak: 5, longBreak: 15, dailyGoal: 120, maxPriorities: 3,
  sound: true, notifications: false, autoStartBreaks: false, theme: "dark",
  strict: false, weeklySummary: true, tracking: true,
};

/* ------------------------------------------------------- demo seed data */

function seed() {
  const today = new Date();
  const t = (n) => dayKey(addDays(today, n));
  const course = {
    id: "c1", title: "Python Course", createdAt: new Date().toISOString(),
    lessons: [
      { id: "l1", title: "Python Basics", status: "done", url: "", estMin: 40, pomos: 2 },
      { id: "l2", title: "Variables", status: "done", url: "", estMin: 30, pomos: 1 },
      { id: "l3", title: "Data Types", status: "done", url: "", estMin: 45, pomos: 2 },
      { id: "l4", title: "Functions", status: "active", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I", estMin: 45, pomos: 2 },
      { id: "l5", title: "OOP", status: "todo", url: "", estMin: 60, pomos: 3 },
      { id: "l6", title: "File Handling", status: "todo", url: "", estMin: 40, pomos: 2 },
      { id: "l7", title: "APIs", status: "todo", url: "", estMin: 50, pomos: 2 },
      { id: "l8", title: "Projects", status: "todo", url: "", estMin: 120, pomos: 5 },
    ],
  };

  const tasks = [
    { title: "Python Course – Functions", category: "Coding", priority: "High", estMin: 45, pomoPlanned: 2, pomoDone: 2, status: "In Progress", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I", courseId: "c1", lessonId: "l4", desc: "Watch the lecture, then write 3 functions from memory." },
    { title: "Python Practice Problems", category: "Coding", priority: "High", estMin: 60, pomoPlanned: 3, pomoDone: 1, status: "In Progress", desc: "Solve 5 exercises on loops and functions." },
    { title: "NPTEL – Computer Networks Unit 3", category: "NPTEL", priority: "Medium", estMin: 45, pomoPlanned: 2, pomoDone: 0, status: "Not Started" },
    { title: "Internship assignment", category: "Internship", priority: "Medium", estMin: 90, pomoPlanned: 4, pomoDone: 0, status: "Not Started" },
    { title: "Read 20 pages – Deep Work", category: "Reading", priority: "Low", estMin: 30, pomoPlanned: 1, pomoDone: 0, status: "Not Started", due: t(2) },
    { title: "Revise DBMS normalisation", category: "College", priority: "Low", estMin: 40, pomoPlanned: 2, pomoDone: 0, status: "Not Started", due: null },
  ].map((x, i) => ({
    id: "t" + (i + 1), desc: "", due: x.due === undefined ? t(0) : x.due, courseId: null, lessonId: null,
    url: "", order: i, createdAt: new Date().toISOString(), completedAt: null, ...x,
  }));

  // Sessions: 7 previous days + today (85 focused minutes today).
  const sessions = [];
  const plan = [
    [-7, [["t1", 25, "completed", 1, 0], ["t2", 25, "completed", 0, 0], ["t3", 25, "completed", 1, 0]]],
    [-6, [["t1", 25, "completed", 0, 0], ["t4", 50, "completed", 2, 1], ["t2", 12, "abandoned", 0, 1]]],
    [-5, [["t2", 25, "completed", 1, 0], ["t3", 25, "completed", 0, 0]]],
    [-4, [["t1", 25, "completed", 1, 0], ["t1", 25, "completed", 0, 0], ["t4", 50, "completed", 1, 0], ["t2", 25, "completed", 0, 0]]],
    [-3, [["t3", 25, "completed", 0, 0], ["t2", 9, "abandoned", 0, 1]]],
    [-2, [["t4", 50, "completed", 2, 0], ["t1", 25, "completed", 1, 0], ["t2", 25, "completed", 0, 0]]],
    [-1, [["t2", 25, "completed", 1, 0], ["t3", 25, "completed", 1, 0], ["t1", 25, "completed", 0, 1]]],
    [0, [["t1", 25, "completed", 1, 0], ["t1", 25, "completed", 0, 0], ["t2", 25, "completed", 1, 0], ["t3", 10, "abandoned", 0, 1]]],
  ];
  const kinds = ["YouTube recommendation", "Instagram", "Random browsing", "WhatsApp", "Phone"];
  plan.forEach(([off, rows]) => {
    rows.forEach(([taskId, mins, status, resisted, left], i) => {
      const start = addDays(new Date(), off);
      start.setHours(17 + i, (i * 22) % 60, 0, 0);
      const end = new Date(start.getTime() + mins * 60000);
      const distractions = [];
      for (let k = 0; k < resisted + left; k++) {
        distractions.push({ type: kinds[(k + i + Math.abs(off)) % kinds.length], at: new Date(start.getTime() + 6e4 * 5 * (k + 1)).toISOString(), resisted: k < resisted });
      }
      const task = tasks.find((x) => x.id === taskId);
      sessions.push({
        id: uid(), taskId, taskTitle: task.title, objective: "Make real progress on " + task.title,
        anticipated: kinds[i % kinds.length], plannedMin: mins >= 50 ? 50 : 25, actualMin: mins,
        startedAt: start.toISOString(), endedAt: end.toISOString(), status, pauses: i % 2,
        distractions, exitReason: status === "abandoned" ? "Distracted" : null,
        outcome: status === "completed" ? (i % 4 === 3 ? "partial" : "yes") : "no",
      });
    });
  });

  const priorities = {};
  for (let i = -7; i <= 0; i++) priorities[t(i)] = ["t1", "t2", "t3"];

  return {
    v: 1, settings: { ...DEFAULT_SETTINGS }, tasks, sessions, courses: [course],
    notes: { t1: "• def keyword creates a function\n• parameters vs arguments\n• return sends a value back\n• practice recursion later" },
    later: [
      { id: uid(), text: "Check that new AI video", createdAt: new Date().toISOString(), done: false },
      { id: uid(), text: "Compare gaming laptops", createdAt: new Date().toISOString(), done: false },
    ],
    priorities, completedPriorities: {},
  };
}

/* --------------------------------------------------------------- storage */

const KEY = "focusforge:state:v1";

function useStore() {
  const [state, setState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      let loaded = null;
      try {
        const r = await window.storage.get(KEY);
        if (r && r.value) loaded = JSON.parse(r.value);
      } catch (e) { /* first run or storage unavailable */ }
      if (!live) return;
      setState(loaded && loaded.tasks ? loaded : seed());
      setReady(true);
    })();
    return () => { live = false; };
  }, []);

  const save = useCallback((next) => {
    setState(next);
    (async () => {
      try { await window.storage.set(KEY, JSON.stringify(next)); }
      catch (e) { console.error("Could not save your data", e); }
    })();
  }, []);

  const update = useCallback((fn) => setState((s) => {
    const next = fn(s);
    (async () => {
      try { await window.storage.set(KEY, JSON.stringify(next)); }
      catch (e) { console.error("Could not save your data", e); }
    })();
    return next;
  }), []);

  return { state, ready, update, save };
}

/* -------------------------------------------------------------- selectors */

function dayStats(state, key) {
  const s = state.sessions.filter((x) => dayKey(new Date(x.startedAt)) === key);
  const completed = s.filter((x) => x.status === "completed");
  const abandoned = s.filter((x) => x.status === "abandoned");
  const minutes = s.reduce((a, x) => a + x.actualMin, 0);
  const dist = s.flatMap((x) => x.distractions || []);
  const tasksDone = state.tasks.filter((t) => t.completedAt && dayKey(new Date(t.completedAt)) === key).length;
  const prio = state.priorities[key] || [];
  const prioDone = prio.filter((id) => {
    const t = state.tasks.find((x) => x.id === id);
    return t && t.status === "Completed";
  }).length;
  return {
    sessions: s, completed: completed.length, abandoned: abandoned.length, started: s.length,
    minutes, distractions: dist, resisted: dist.filter((d) => d.resisted).length,
    gaveIn: dist.filter((d) => !d.resisted).length, tasksDone, prio, prioDone,
  };
}

function focusScore(state, key) {
  const d = dayStats(state, key);
  if (!d.started && !d.prio.length) return { score: 0, parts: [], d };
  const pomoRate = d.started ? d.completed / d.started : 0;
  const prioRate = d.prio.length ? d.prioDone / d.prio.length : (d.tasksDone ? 1 : 0);
  const resist = d.distractions.length ? d.resisted / d.distractions.length : 1;
  const goal = state.settings.dailyGoal || 120;
  const consistency = clamp(d.minutes / goal, 0, 1);
  const score = Math.round(100 * (0.4 * pomoRate + 0.25 * prioRate + 0.2 * resist + 0.15 * consistency));
  return {
    score, d,
    parts: [
      { label: "Pomodoro completion", weight: 40, value: pomoRate },
      { label: "Planned tasks finished", weight: 25, value: prioRate },
      { label: "Distraction resistance", weight: 20, value: resist },
      { label: "Consistency vs daily goal", weight: 15, value: consistency },
    ],
  };
}

function streakOf(state) {
  const goal = state.settings.dailyGoal || 120;
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const key = dayKey(addDays(new Date(), -i));
    const d = dayStats(state, key);
    const ok = d.minutes >= Math.min(goal, 25) && (d.prioDone > 0 || d.tasksDone > 0 || d.completed > 0);
    if (ok) n++;
    else if (i > 0 || d.minutes === 0) break;
  }
  return n;
}

/* -------------------------------------------------------------- small UI */

const Stat = ({ label, value, sub, accent }) => (
  <div className="card" style={{ padding: 15 }}>
    <div className="eyebrow">{label}</div>
    <div className="mono" style={{ fontSize: 26, marginTop: 8, fontWeight: 600, color: accent ? "var(--acc)" : "var(--text)" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{sub}</div>}
  </div>
);

const Sheet = ({ children, onClose, wide }) => (
  <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
    <div className="sheet" style={wide ? { maxWidth: 700 } : undefined}>{children}</div>
  </div>
);

const SheetHead = ({ title, hint, onClose }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
    <div>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{title}</div>
      {hint && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{hint}</div>}
    </div>
    {onClose && <button className="btn-ghost" style={{ padding: 6, borderRadius: 8 }} onClick={onClose} aria-label="Close"><X size={17} /></button>}
  </div>
);

const Field = ({ label, children }) => (
  <label style={{ display: "block", marginBottom: 13 }}>
    <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
    {children}
  </label>
);

const Empty = ({ title, hint, action }) => (
  <div style={{ padding: "34px 20px", textAlign: "center" }}>
    <div style={{ fontWeight: 550, marginBottom: 5 }}>{title}</div>
    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: action ? 14 : 0 }}>{hint}</div>
    {action}
  </div>
);

/* ------------------------------------------------------------------- app */

export default function FocusForge() {
  const { state, ready, update } = useStore();
  const [view, setView] = useState("dashboard");
  const [active, setActive] = useState(null);       // live session
  const [now, setNow] = useState(Date.now());
  const [ritual, setRitual] = useState(null);       // {taskId}
  const [editing, setEditing] = useState(null);     // task draft
  const [quick, setQuick] = useState(false);
  const [pending, setPending] = useState(null);     // finished session awaiting review
  const [toast, setToast] = useState(null);
  const audio = useRef(null);

  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 400); return () => clearInterval(i); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const theme = state?.settings.theme || "dark";
  const C = THEMES[theme];
  const vars = useMemo(() => ({
    "--bg": C.bg, "--surface": C.surface, "--surface2": C.surface2, "--line": C.line,
    "--text": C.text, "--muted": C.muted, "--faint": C.faint, "--acc": C.acc,
    "--accSoft": C.accSoft, "--warn": C.warn, "--danger": C.danger,
  }), [C]);

  const beep = useCallback(() => {
    if (!state?.settings.sound) return;
    try {
      audio.current = audio.current || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audio.current, o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 660; o.type = "sine";
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
      o.start(); o.stop(ctx.currentTime + 1.15);
    } catch (e) { /* audio unavailable */ }
  }, [state]);

  const notify = useCallback((body) => {
    if (!state?.settings.notifications) return;
    try { if (window.Notification && Notification.permission === "granted") new Notification("FocusForge", { body }); }
    catch (e) { /* notifications unavailable */ }
  }, [state]);

  /* ------------ session control ------------ */

  const startSession = (cfg) => {
    const ms = cfg.minutes * 60000;
    setActive({
      id: uid(), taskId: cfg.taskId, plannedMin: cfg.minutes, objective: cfg.objective,
      anticipated: cfg.anticipated, startedAt: new Date().toISOString(),
      endsAt: Date.now() + ms, remainingMs: ms, paused: false, pauses: 0,
      distractions: [], mode: "focus",
    });
    setRitual(null);
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === cfg.taskId && t.status === "Not Started" ? { ...t, status: "In Progress" } : t)),
    }));
  };

  const finishSession = (status, extra = {}) => {
    if (!active) return;
    const elapsedMs = active.plannedMin * 60000 - remaining();
    const rec = {
      id: active.id, taskId: active.taskId,
      taskTitle: state.tasks.find((t) => t.id === active.taskId)?.title || "Untitled task",
      objective: active.objective, anticipated: active.anticipated, plannedMin: active.plannedMin,
      actualMin: Math.max(1, Math.round(elapsedMs / 60000)), startedAt: active.startedAt,
      endedAt: new Date().toISOString(), status, pauses: active.pauses,
      distractions: active.distractions, exitReason: extra.reason || null, outcome: null,
    };
    setActive(null);
    setPending(rec);
  };

  const commitSession = (rec) => {
    update((s) => ({
      ...s,
      sessions: [...s.sessions, rec],
      tasks: s.tasks.map((t) => (t.id === rec.taskId && rec.status === "completed"
        ? { ...t, pomoDone: (t.pomoDone || 0) + 1, status: t.status === "Completed" ? t.status : "In Progress" }
        : t)),
    }));
    setPending(null);
    if (rec.status === "completed") { beep(); notify("Focus session completed. Take a short break."); }
  };

  const remaining = () => {
    if (!active) return 0;
    return active.paused ? active.remainingMs : Math.max(0, active.endsAt - now);
  };

  useEffect(() => {
    if (active && !active.paused && active.endsAt - now <= 0) {
      finishSession(active.mode === "break" ? "break" : "completed");
    }
  }, [now]); // eslint-disable-line

  /* ------------ task helpers ------------ */

  const saveTask = (draft) => {
    update((s) => {
      const exists = s.tasks.some((t) => t.id === draft.id);
      return {
        ...s,
        tasks: exists ? s.tasks.map((t) => (t.id === draft.id ? { ...t, ...draft } : t))
          : [...s.tasks, { ...draft, order: s.tasks.length, createdAt: new Date().toISOString() }],
      };
    });
    setEditing(null);
    setToast(state.tasks.some((t) => t.id === draft.id) ? "Task updated" : "Task added");
  };

  const toggleTask = (id) => update((s) => ({
    ...s,
    tasks: s.tasks.map((t) => t.id === id
      ? (t.status === "Completed"
        ? { ...t, status: t.pomoDone ? "In Progress" : "Not Started", completedAt: null }
        : { ...t, status: "Completed", completedAt: new Date().toISOString() })
      : t),
  }));

  const deleteTask = (id) => update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

  const setPriorities = (ids) => update((s) => ({ ...s, priorities: { ...s.priorities, [dayKey()]: ids } }));

  const addLater = (text) => update((s) => ({
    ...s, later: [{ id: uid(), text, createdAt: new Date().toISOString(), done: false }, ...s.later],
  }));

  const setNote = (taskId, text) => update((s) => ({ ...s, notes: { ...s.notes, [taskId]: text } }));

  const setSettings = (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  if (!ready || !state) {
    return (
      <div className="ff" style={{ ...vars, display: "grid", placeItems: "center", height: "100vh" }}>
        <style>{CSS}</style>
        <div className="eyebrow">Loading your focus data</div>
      </div>
    );
  }

  const today = dayKey();
  const score = focusScore(state, today);
  const streak = streakOf(state);
  const st = score.d;
  const activeTask = active ? state.tasks.find((t) => t.id === active.taskId) : null;

  const NAV = [
    ["dashboard", "Dashboard", LayoutDashboard], ["tasks", "Tasks", ListTodo],
    ["focus", "Focus", Timer], ["courses", "Courses", BookOpen],
    ["analytics", "Analytics", BarChart3], ["history", "History", HistoryIcon],
    ["settings", "Settings", SettingsIcon],
  ];

  const shared = {
    state, update, C, today, score, streak, st, setView, setRitual, setEditing,
    toggleTask, deleteTask, setPriorities, addLater, setSettings, setToast, setQuick,
  };

  return (
    <div className="ff" style={vars}>
      <style>{CSS}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* sidebar (desktop) */}
        <aside className="ff-side" style={{
          width: 232, flexShrink: 0, borderRight: "1px solid var(--line)", padding: 18,
          position: "sticky", top: 0, height: "100vh", display: "none", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 6px 20px" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "var(--acc)", display: "grid", placeItems: "center" }}>
              <Target size={15} color="#fff" />
            </div>
            <div style={{ fontWeight: 650, letterSpacing: "-0.01em" }}>FocusForge</div>
          </div>
          <nav style={{ display: "grid", gap: 2 }}>
            {NAV.map(([k, label, Icon]) => (
              <button key={k} className={"navitem" + (view === k ? " on" : "")} onClick={() => setView(k)}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
            <button className="btn btn-sm" onClick={() => setQuick(true)}><Plus size={14} /> Quick task</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setSettings({ theme: theme === "dark" ? "light" : "dark" })}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />} {theme === "dark" ? "Light" : "Dark"} mode
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, paddingBottom: 78 }}>
          {/* mobile top bar */}
          <div className="ff-top" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderBottom: "1px solid var(--line)", position: "sticky", top: 0,
            background: "var(--bg)", zIndex: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: "var(--acc)", display: "grid", placeItems: "center" }}>
                <Target size={13} color="#fff" />
              </div>
              <span style={{ fontWeight: 650 }}>FocusForge</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="btn btn-sm btn-ghost" onClick={() => setQuick(true)}><Plus size={15} /></button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSettings({ theme: theme === "dark" ? "light" : "dark" })}>
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>

          <div style={{ padding: "22px 16px", maxWidth: 1080, margin: "0 auto" }}>
            {view === "dashboard" && <Dashboard {...shared} />}
            {view === "tasks" && <Tasks {...shared} />}
            {view === "focus" && <FocusHome {...shared} />}
            {view === "courses" && <Courses {...shared} />}
            {view === "analytics" && <Analytics {...shared} />}
            {view === "history" && <HistoryView {...shared} />}
            {view === "settings" && <SettingsView {...shared} />}
          </div>
        </main>
      </div>

      {/* bottom nav (mobile) */}
      <nav className="ff-bottom" style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 30,
        background: "var(--surface)", borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-around", padding: "7px 4px 9px",
      }}>
        {NAV.filter((n) => n[0] !== "history").map(([k, label, Icon]) => (
          <button key={k} onClick={() => setView(k)} style={{
            display: "grid", justifyItems: "center", gap: 3, padding: "5px 8px",
            color: view === k ? "var(--acc)" : "var(--muted)", fontSize: 10, fontWeight: 550,
          }}>
            <Icon size={19} /> {label}
          </button>
        ))}
      </nav>

      <style>{`
        @media (min-width: 860px) {
          .ff-side { display: flex !important; }
          .ff-top { display: none !important; }
          .ff-bottom { display: none !important; }
          .ff main { padding-bottom: 0 !important; }
        }
      `}</style>

      {/* overlays */}
      {ritual && <StartRitual {...shared} initialTaskId={ritual.taskId} onClose={() => setRitual(null)} onStart={startSession} />}
      {editing && <TaskEditor draft={editing} onClose={() => setEditing(null)} onSave={saveTask} courses={state.courses} />}
      {quick && <QuickCapture onClose={() => setQuick(false)} onSave={(t) => { saveTask(t); setQuick(false); }} />}
      {pending && <SessionReview rec={pending} settings={state.settings} onDone={commitSession} later={state.later} />}

      {active && (
        <FocusMode
          active={active} setActive={setActive} task={activeTask} remaining={remaining()}
          note={state.notes[active.taskId] || ""} setNote={setNote} addLater={addLater}
          later={state.later} settings={state.settings} onFinish={finishSession}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 92, left: "50%", transform: "translateX(-50%)", zIndex: 80,
          background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10,
          padding: "10px 16px", fontSize: 13, boxShadow: "0 8px 30px rgba(0,0,0,.25)",
        }}>{toast}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- dashboard */

function Dashboard({ state, score, streak, st, setView, setRitual, toggleTask, setPriorities, setEditing, addLater, update }) {
  const goal = state.settings.dailyGoal;
  const pct = clamp(Math.round((st.minutes / goal) * 100), 0, 100);
  const prioIds = state.priorities[dayKey()] || [];
  const [picking, setPicking] = useState(false);
  const todayTasks = state.tasks.filter((t) => t.due === dayKey() && t.status !== "Completed");
  const currentTask = todayTasks.find((t) => t.status === "In Progress") || todayTasks[0];
  const grade = score.score >= 85 ? "Excellent focus day" : score.score >= 70 ? "Good focus day" : score.score >= 50 ? "Mixed focus day" : "Rebuild tomorrow";

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <div className="eyebrow">{new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</div>
        <h1 style={{ fontSize: 27, fontWeight: 650, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
          {currentTask ? "Next up: " + currentTask.title : "Nothing planned yet"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
          Decide what you want to do before opening the internet.
        </p>
      </div>

      <button className="btn btn-primary" style={{ padding: "15px 20px", fontSize: 15, fontWeight: 600 }}
        onClick={() => setRitual({ taskId: currentTask?.id })}>
        <Play size={17} /> Start focus session
      </button>

      <div className="grid-stats">
        <Stat label="Focused today" value={fmtMin(st.minutes)} sub={`${pct}% of ${fmtMin(goal)} goal`} accent />
        <Stat label="Pomodoros" value={st.completed} sub={st.abandoned ? `${st.abandoned} abandoned` : "none abandoned"} />
        <Stat label="Tasks completed" value={`${st.tasksDone}/${state.tasks.filter((t) => t.due === dayKey()).length}`} sub="due today" />
        <Stat label="Distractions resisted" value={st.resisted} sub={st.gaveIn ? `${st.gaveIn} gave in` : "held every time"} />
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="eyebrow">Daily goal</div>
          <div className="mono" style={{ fontSize: 13 }}>{st.minutes} / {goal} min</div>
        </div>
        <div className="bar" style={{ marginTop: 12 }}><i style={{ width: pct + "%" }} /></div>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }} className="dash-cols">
        {/* Top 3 */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div>
              <div className="eyebrow">Today's top {state.settings.maxPriorities}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>
                What are the {state.settings.maxPriorities} things that will make today successful?
              </div>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => setPicking(true)}>Choose</button>
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {prioIds.length === 0 && <Empty title="No priorities set" hint="Pick a maximum of three. Everything else can wait."
              action={<button className="btn btn-sm" onClick={() => setPicking(true)}>Choose priorities</button>} />}
            {prioIds.map((id, i) => {
              const t = state.tasks.find((x) => x.id === id);
              if (!t) return null;
              const done = t.status === "Completed";
              return (
                <div key={id} style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--faint)", fontSize: 12 }}>{i + 1}</span>
                  <button className={"tick" + (done ? " done" : "")} onClick={() => toggleTask(id)} aria-label="Complete">
                    {done && <Check size={13} />}
                  </button>
                  <span style={{ fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "var(--muted)" : "var(--text)" }}>
                    {t.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus score */}
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">Focus score</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <div className="mono" style={{ fontSize: 42, fontWeight: 600, color: "var(--acc)" }}>{score.score}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>/ 100 · {grade}</div>
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 9 }}>
            {score.parts.map((p) => (
              <div key={p.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                  <span>{p.label}</span><span className="mono">{Math.round(p.value * 100)}% · weight {p.weight}</span>
                </div>
                <div className="bar" style={{ height: 4 }}><i style={{ width: Math.round(p.value * 100) + "%" }} /></div>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: "16px 0 12px" }} />
          <div style={{ fontSize: 12.5, color: "var(--muted)", display: "grid", gap: 4 }}>
            <div>+ {st.completed} focus sessions completed</div>
            <div>+ {st.prioDone} of {st.prio.length || 0} priorities finished</div>
            {st.abandoned > 0 && <div>− {st.abandoned} session abandoned</div>}
            {st.distractions.length > 0 && <div>− {st.distractions.length} distraction attempts ({st.resisted} resisted)</div>}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18 }} className="dash-cols">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Flame size={17} color="var(--acc)" />
            <div style={{ fontWeight: 600 }}>{streak} day focus streak</div>
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 14, flexWrap: "wrap" }}>
            {Array.from({ length: 21 }, (_, i) => {
              const key = dayKey(addDays(new Date(), i - 20));
              const d = dayStats(state, key);
              const hit = d.minutes >= Math.min(state.settings.dailyGoal, 25) && d.completed > 0;
              return <div key={key} title={`${key} · ${fmtMin(d.minutes)}`} style={{
                width: 15, height: 15, borderRadius: 4,
                background: hit ? "var(--acc)" : "var(--surface2)", border: "1px solid var(--line)",
              }} />;
            })}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 11 }}>
            A day counts when you finish at least one priority and hit your minimum focus time.
          </div>
        </div>

        <LaterList state={state} update={update} addLater={addLater} />
      </div>

      <button className="btn btn-ghost" style={{ justifySelf: "start" }} onClick={() => setView("tasks")}>
        Open the full task list <ChevronRight size={15} />
      </button>

      {picking && <PriorityPicker state={state} onClose={() => setPicking(false)}
        onSave={(ids) => { setPriorities(ids); setPicking(false); }} />}

      <style>{`@media (min-width: 860px) { .dash-cols { grid-template-columns: 1fr 1fr; } }`}</style>
    </div>
  );
}

function PriorityPicker({ state, onClose, onSave }) {
  const max = state.settings.maxPriorities;
  const [ids, setIds] = useState(state.priorities[dayKey()] || []);
  const options = state.tasks.filter((t) => t.status !== "Completed");
  const toggle = (id) => setIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= max ? cur : [...cur, id]);
  return (
    <Sheet onClose={onClose}>
      <SheetHead title={`Today's top ${max}`} hint="Three is the ceiling on purpose. A short list gets finished." onClose={onClose} />
      <div style={{ display: "grid", gap: 6, maxHeight: 320, overflowY: "auto" }}>
        {options.map((t) => (
          <button key={t.id} onClick={() => toggle(t.id)} style={{
            display: "flex", gap: 11, alignItems: "center", padding: "10px 12px", borderRadius: 9,
            border: "1px solid var(--line)", textAlign: "left",
            background: ids.includes(t.id) ? "var(--accSoft)" : "transparent",
          }}>
            <span className={"tick" + (ids.includes(t.id) ? " done" : "")}>{ids.includes(t.id) && <Check size={13} />}</span>
            <span style={{ fontSize: 14 }}>{t.title}</span>
            <span className="chip" style={{ marginLeft: "auto" }}>{t.category}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(ids)}>Set priorities</button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

function LaterList({ state, update, addLater }) {
  const [text, setText] = useState("");
  const open = state.later.filter((x) => !x.done);
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Bookmark size={16} color="var(--muted)" />
        <div style={{ fontWeight: 600 }}>Later list</div>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 5 }}>
        Something pulling at you mid-session? Save it here. Do it later.
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
        <input value={text} placeholder="Check that AI video" onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { addLater(text.trim()); setText(""); } }} />
        <button className="btn btn-sm" onClick={() => { if (text.trim()) { addLater(text.trim()); setText(""); } }}>Save</button>
      </div>
      <div style={{ marginTop: 13, display: "grid", gap: 7 }}>
        {open.length === 0 && <div style={{ fontSize: 13, color: "var(--muted)" }}>Nothing parked. Good.</div>}
        {open.slice(0, 6).map((x) => (
          <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5 }}>
            <button className="tick" onClick={() => update((s) => ({ ...s, later: s.later.map((y) => y.id === x.id ? { ...y, done: true } : y) }))} aria-label="Mark done" />
            <span style={{ flex: 1 }}>{x.text}</span>
            <button className="btn-ghost" style={{ padding: 4 }} aria-label="Delete"
              onClick={() => update((s) => ({ ...s, later: s.later.filter((y) => y.id !== x.id) }))}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- tasks */

const emptyTask = () => ({
  id: uid(), title: "", desc: "", category: "College", priority: "Medium", estMin: 30,
  due: dayKey(), status: "Not Started", pomoPlanned: 1, pomoDone: 0, url: "",
  courseId: null, lessonId: null, completedAt: null,
});

function Tasks({ state, update, setEditing, toggleTask, deleteTask, setRitual }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [prio, setPrio] = useState("All");
  const [drag, setDrag] = useState(null);

  const filtered = state.tasks
    .filter((t) => (cat === "All" || t.category === cat) && (prio === "All" || t.priority === prio))
    .filter((t) => !q || (t.title + " " + (t.desc || "")).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  const today = dayKey();
  const groups = [
    ["Today", filtered.filter((t) => t.status !== "Completed" && t.due === today)],
    ["Upcoming", filtered.filter((t) => t.status !== "Completed" && t.due && t.due > today)],
    ["Backlog", filtered.filter((t) => t.status !== "Completed" && (!t.due || t.due < today))],
    ["Completed", filtered.filter((t) => t.status === "Completed")],
  ];

  const onDrop = (targetId) => {
    if (!drag || drag === targetId) return;
    update((s) => {
      const list = [...s.tasks].sort((a, b) => a.order - b.order);
      const from = list.findIndex((t) => t.id === drag);
      const to = list.findIndex((t) => t.id === targetId);
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return { ...s, tasks: list.map((t, i) => ({ ...t, order: i })) };
    });
    setDrag(null);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow">Task manager</div>
          <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>Everything you've committed to</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing(emptyTask())}><Plus size={15} /> New task</button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: 12, color: "var(--faint)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" style={{ paddingLeft: 32 }} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ width: "auto" }}>
          {["All", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={prio} onChange={(e) => setPrio(e.target.value)} style={{ width: "auto" }}>
          {["All", ...PRIORITIES].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {groups.map(([name, list]) => (
        <div key={name}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{name} · {list.length}</div>
          <div className="card">
            {list.length === 0
              ? <Empty title={`Nothing in ${name.toLowerCase()}`} hint={name === "Today" ? "Add a task and give it today's date." : "This section is clear."} />
              : list.map((t) => (
                <TaskRow key={t.id} t={t} drag={drag} setDrag={setDrag} onDrop={onDrop}
                  onToggle={() => toggleTask(t.id)} onEdit={() => setEditing(t)}
                  onDelete={() => deleteTask(t.id)} onFocus={() => setRitual({ taskId: t.id })} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskRow({ t, drag, setDrag, onDrop, onToggle, onEdit, onDelete, onFocus }) {
  const done = t.status === "Completed";
  const pColor = t.priority === "High" ? "var(--danger)" : t.priority === "Medium" ? "var(--warn)" : "var(--faint)";
  return (
    <div className={"taskrow" + (drag === t.id ? " drag" : "")} draggable
      onDragStart={() => setDrag(t.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(t.id)}>
      <button className={"tick" + (done ? " done" : "")} onClick={onToggle} aria-label="Complete task">
        {done && <Check size={13} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, textDecoration: done ? "line-through" : "none", color: done ? "var(--muted)" : "var(--text)" }}>
          {t.title}
        </div>
        {t.desc && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{t.desc}</div>}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          <span className="chip">{t.category}</span>
          <span className="chip" style={{ color: pColor, borderColor: pColor }}>{t.priority}</span>
          <span className="chip mono">{t.pomoDone}/{t.pomoPlanned} pomo</span>
          <span className="chip mono">{t.estMin}m</span>
          {t.due && <span className="chip mono">{t.due === dayKey() ? "Today" : t.due}</span>}
          {ytId(t.url) && <span className="chip">Video attached</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {!done && <button className="btn btn-sm btn-ghost" onClick={onFocus} title="Start a focus session"><Play size={14} /></button>}
        <button className="btn btn-sm btn-ghost" onClick={onEdit} title="Edit">Edit</button>
        <button className="btn btn-sm btn-ghost" onClick={onDelete} title="Delete"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function TaskEditor({ draft, onClose, onSave, courses }) {
  const [d, setD] = useState(draft);
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  return (
    <Sheet onClose={onClose}>
      <SheetHead title={draft.title ? "Edit task" : "New task"} hint="Small, specific tasks get finished." onClose={onClose} />
      <Field label="Title"><input autoFocus value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="Python Course – Functions" /></Field>
      <Field label="Description"><textarea rows={2} value={d.desc} onChange={(e) => set("desc", e.target.value)} placeholder="What does done look like?" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Category"><select value={d.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Priority"><select value={d.priority} onChange={(e) => set("priority", e.target.value)}>{PRIORITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Estimated minutes"><input type="number" min={5} step={5} value={d.estMin} onChange={(e) => set("estMin", +e.target.value)} /></Field>
        <Field label="Due date"><input type="date" value={d.due || ""} onChange={(e) => set("due", e.target.value)} /></Field>
        <Field label="Pomodoros expected"><input type="number" min={1} value={d.pomoPlanned} onChange={(e) => set("pomoPlanned", +e.target.value)} /></Field>
        <Field label="Status"><select value={d.status} onChange={(e) => set("status", e.target.value)}>{["Not Started", "In Progress", "Completed"].map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Learning URL (optional)">
        <input value={d.url} onChange={(e) => set("url", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
      </Field>
      <Field label="Course (optional)">
        <select value={d.courseId || ""} onChange={(e) => set("courseId", e.target.value || null)}>
          <option value="">No course</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={!d.title.trim()} onClick={() => onSave(d)}>Save task</button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

function QuickCapture({ onClose, onSave }) {
  const [text, setText] = useState("");
  const parse = () => {
    const m = text.match(/(\d+)\s*min/i);
    return { ...emptyTask(), title: text.replace(/[–-]\s*\d+\s*min/i, "").trim(), estMin: m ? +m[1] : 30 };
  };
  return (
    <Sheet onClose={onClose}>
      <SheetHead title="Quick task" hint="Capture it, then get back to what you were doing." onClose={onClose} />
      <input autoFocus value={text} onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) onSave(parse()); }}
        placeholder="Practice Python loops – 30 min" />
      <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={!text.trim()} onClick={() => onSave(parse())}>Add to today</button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------- focus start flow */

function FocusHome({ state, setRitual, st, score }) {
  const open = state.tasks.filter((t) => t.status !== "Completed");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div className="eyebrow">Focus</div>
        <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>Pick one task. Nothing else.</h1>
      </div>
      <div className="grid-stats">
        <Stat label="Sessions today" value={st.completed} sub={`${st.started} started`} />
        <Stat label="Focused" value={fmtMin(st.minutes)} accent />
        <Stat label="Distractions" value={st.distractions.length} sub={`${st.resisted} resisted`} />
        <Stat label="Focus score" value={score.score} />
      </div>
      <div className="card">
        {open.length === 0 ? <Empty title="No open tasks" hint="Add a task first — sessions must be attached to one." /> :
          open.map((t) => (
            <div key={t.id} className="taskrow">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{t.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                  <span className="chip">{t.category}</span>
                  <span className="chip mono">{t.pomoDone}/{t.pomoPlanned} pomo</span>
                </div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setRitual({ taskId: t.id })}><Play size={13} /> Focus</button>
            </div>
          ))}
      </div>
    </div>
  );
}

function StartRitual({ state, initialTaskId, onClose, onStart }) {
  const open = state.tasks.filter((t) => t.status !== "Completed");
  const [taskId, setTaskId] = useState(initialTaskId || open[0]?.id || "");
  const [mode, setMode] = useState(state.settings.focusMin);
  const [custom, setCustom] = useState(state.settings.focusMin);
  const [objective, setObjective] = useState("");
  const [anticipated, setAnticipated] = useState("");
  const task = state.tasks.find((t) => t.id === taskId);
  const minutes = mode === "custom" ? clamp(+custom || 25, 1, 180) : mode;

  useEffect(() => { if (task && !objective) setObjective("Finish " + task.title); }, [taskId]); // eslint-disable-line

  return (
    <Sheet onClose={onClose}>
      <SheetHead title="Focus session" hint="A small commitment, made before you start." onClose={onClose} />
      <Field label="What are you working on?">
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          {open.length === 0 && <option value="">No open tasks — add one first</option>}
          {open.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </Field>
      <Field label="What will you accomplish?">
        <input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Finish the Functions lecture and take notes" />
      </Field>
      <Field label="Duration">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[[state.settings.focusMin, `${state.settings.focusMin}/${state.settings.shortBreak}`], [50, "50/10"], [90, "90/15"]].map(([m, label]) => (
            <button key={label} className={"btn btn-sm" + (mode === m ? " btn-primary" : "")} onClick={() => setMode(m)}>{label}</button>
          ))}
          <button className={"btn btn-sm" + (mode === "custom" ? " btn-primary" : "")} onClick={() => setMode("custom")}>Custom</button>
          {mode === "custom" && <input type="number" min={1} max={180} value={custom} onChange={(e) => setCustom(e.target.value)} style={{ width: 90 }} />}
        </div>
      </Field>
      <Field label="Possible distraction?">
        <select value={anticipated} onChange={(e) => setAnticipated(e.target.value)}>
          <option value="">Not sure</option>
          {DISTRACTIONS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Field>
      {task && ytId(task.url) && (
        <div className="chip" style={{ marginBottom: 14 }}>Learning video opens inside focus mode</div>
      )}
      <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontWeight: 600 }}
        disabled={!taskId} onClick={() => onStart({ taskId, minutes, objective, anticipated })}>
        Start focus · {minutes} min
      </button>
    </Sheet>
  );
}

/* ------------------------------------------------------------ focus mode */

function FocusMode({ active, setActive, task, remaining, note, setNote, addLater, later, settings, onFinish }) {
  const [phase, setPhase] = useState(null); // 'distract' | 'confirm' | 'exit' | 'park'
  const [kind, setKind] = useState(null);
  const [parkText, setParkText] = useState("");
  const [motiv, setMotiv] = useState(MOTIVATION[0]);
  const [draft, setDraft] = useState(note);
  const [noise, setNoise] = useState("off");
  const [volume, setVolume] = useState(0.5);
  const engineRef = useRef(null);
  const total = active.plannedMin * 60000;
  const pct = clamp(1 - remaining / total, 0, 1);
  const video = ytId(task?.url);

  useEffect(() => { const i = setInterval(() => setMotiv(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]), 90000); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setTimeout(() => setNote(active.taskId, draft), 700); return () => clearTimeout(t); }, [draft]); // autosave

  useEffect(() => {
    engineRef.current = makeNoiseEngine();
    return () => engineRef.current && engineRef.current.stop();
  }, []);
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.start(noise);
    engineRef.current.setVolume(volume);
  }, [noise]); // eslint-disable-line
  useEffect(() => { if (engineRef.current) engineRef.current.setVolume(volume); }, [volume]);

  const R = 92, CIRC = 2 * Math.PI * R;

  const recordDistraction = (resisted) => {
    setActive((a) => ({ ...a, distractions: [...a.distractions, { type: kind, at: new Date().toISOString(), resisted }] }));
    setPhase(null); setKind(null);
    if (!resisted) setActive((a) => ({ ...a, paused: true, remainingMs: Math.max(0, a.endsAt - Date.now()), pauses: a.pauses + 1 }));
  };

  const togglePause = () => setActive((a) => a.paused
    ? { ...a, paused: false, endsAt: Date.now() + a.remainingMs }
    : { ...a, paused: true, remainingMs: Math.max(0, a.endsAt - Date.now()), pauses: a.pauses + 1 });

  return (
    <div className="focus-root">
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 18px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="eyebrow">Focusing{active.paused ? " · paused" : ""}</div>
          <button className="btn btn-sm btn-ghost" onClick={() => setPhase("exit")}>End session</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 26 }}>
          {task?.courseId && <div className="eyebrow" style={{ marginBottom: 10 }}>Course session</div>}
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{task?.title || "Untitled task"}</div>
          {active.objective && <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 7 }}>Goal: {active.objective}</div>}
        </div>

        <div style={{ display: "grid", placeItems: "center", marginTop: 26 }}>
          <div style={{ position: "relative", width: 210, height: 210 }}>
            <svg className="dial" width="210" height="210" viewBox="0 0 210 210">
              <circle cx="105" cy="105" r={R} stroke="var(--surface2)" strokeWidth="6" />
              <circle cx="105" cy="105" r={R} stroke="var(--acc)" strokeWidth="6"
                strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
                style={{ transition: "stroke-dashoffset .5s linear" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div className="mono" style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em" }}>{clock(remaining)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 20 }}>
            <button className="btn" onClick={togglePause}>
              {active.paused ? <><Play size={15} /> Resume</> : <><Pause size={15} /> Pause</>}
            </button>
            <button className="btn" onClick={() => setPhase("distract")} style={{ color: "var(--warn)", borderColor: "var(--warn)" }}>
              <AlertCircle size={15} /> I feel distracted
            </button>
          </div>
          <div className="motiv" key={motiv} style={{ marginTop: 20 }}>{motiv}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, flexWrap: "wrap", justifyContent: "center" }}>
            {NOISE_TYPES.map((n) => (
              <button key={n.id} className={"chip" + (noise === n.id ? "" : "")} onClick={() => setNoise(n.id)}
                style={{ padding: "6px 12px", cursor: "pointer", borderColor: noise === n.id ? "var(--acc)" : "var(--line)", color: noise === n.id ? "var(--acc)" : "var(--muted)" }}>
                {n.label}
              </button>
            ))}
            {noise !== "off" && (
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => setVolume(+e.target.value)} style={{ width: 90 }} aria-label="Sound volume" />
            )}
          </div>
        </div>

        {video && (
          <div style={{ marginTop: 30 }}>
            <div className="yt">
              <iframe title="Learning video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
                src={`https://www.youtube-nocookie.com/embed/${video}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`} />
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 8, textAlign: "center" }}>
              Playing inside FocusForge. No feed, no recommendations, no comments.
            </div>
          </div>
        )}

        <div style={{ marginTop: 26, display: "grid", gap: 14 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 7 }}>Notes · saved automatically</div>
            <textarea rows={video ? 5 : 7} value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={"• key idea\n• thing to practise later"} style={{ background: "transparent", lineHeight: 1.6 }} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 7 }}>Park a thought for later</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={parkText} placeholder="Save it here. Do it later."
                onChange={(e) => setParkText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && parkText.trim()) { addLater(parkText.trim()); setParkText(""); } }} />
              <button className="btn btn-sm" onClick={() => { if (parkText.trim()) { addLater(parkText.trim()); setParkText(""); } }}>Park it</button>
            </div>
          </div>
        </div>
      </div>

      {phase === "distract" && (
        <Sheet onClose={() => setPhase(null)}>
          <SheetHead title="What's distracting you?" onClose={() => setPhase(null)} />
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {DISTRACTIONS.map((d) => (
              <button key={d} className={"btn btn-sm" + (kind === d ? " btn-primary" : "")} onClick={() => setKind(d)}>{d}</button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 18 }} disabled={!kind} onClick={() => setPhase("confirm")}>
            Continue
          </button>
        </Sheet>
      )}

      {phase === "confirm" && (
        <Sheet onClose={() => setPhase(null)}>
          <SheetHead title="Do you really need to leave this task?" hint={`${clock(remaining)} left on ${task?.title}.`} />
          <button className="btn btn-primary" style={{ width: "100%", padding: 15, fontSize: 15, fontWeight: 600 }}
            onClick={() => recordDistraction(true)}>Return to task</button>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => recordDistraction(false)}>
            I need a break
          </button>
        </Sheet>
      )}

      {phase === "exit" && (
        <ExitSheet remaining={remaining} plannedMin={active.plannedMin}
          onClose={() => setPhase(null)} onConfirm={(reason) => onFinish("abandoned", { reason })} />
      )}
    </div>
  );
}

function ExitSheet({ remaining, plannedMin, onClose, onConfirm }) {
  const [reason, setReason] = useState(null);
  const left = Math.round(remaining / 60000);
  return (
    <Sheet onClose={onClose}>
      <SheetHead title={`You're leaving ${left} minute${left === 1 ? "" : "s"} early`} hint="No judgement — the reason just makes your analytics honest." onClose={onClose} />
      <div style={{ display: "grid", gap: 7 }}>
        {EXIT_REASONS.map((r) => (
          <button key={r} className={"btn btn-sm" + (reason === r ? " btn-primary" : "")} style={{ justifyContent: "flex-start" }}
            onClick={() => setReason(r)}>{r}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
        <button className="btn" style={{ flex: 1 }} onClick={onClose}>Keep going</button>
        <button className="btn btn-primary" disabled={!reason} onClick={() => onConfirm(reason)}>End session</button>
      </div>
    </Sheet>
  );
}

function SessionReview({ rec, onDone, later }) {
  const [outcome, setOutcome] = useState(null);
  const parked = later.filter((x) => !x.done).slice(0, 5);
  const done = rec.status === "completed";
  return (
    <Sheet>
      <SheetHead title={done ? "Session complete" : "Session ended"}
        hint={`${rec.actualMin} minutes on ${rec.taskTitle}${rec.exitReason ? ` · ${rec.exitReason}` : ""}`} />
      <div className="eyebrow" style={{ marginBottom: 8 }}>Did you accomplish the objective?</div>
      <div style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 12 }}>{rec.objective || "No objective was set."}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Yes", "Partially", "No"].map((o) => (
          <button key={o} className={"btn btn-sm" + (outcome === o ? " btn-primary" : "")} style={{ flex: 1 }} onClick={() => setOutcome(o)}>{o}</button>
        ))}
      </div>
      {parked.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Waiting in your later list</div>
          <div style={{ display: "grid", gap: 5, fontSize: 13.5, color: "var(--muted)" }}>
            {parked.map((x) => <div key={x.id}>· {x.text}</div>)}
          </div>
        </div>
      )}
      <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} disabled={!outcome}
        onClick={() => onDone({ ...rec, outcome: outcome.toLowerCase() })}>Save session</button>
    </Sheet>
  );
}

/* --------------------------------------------------------------- courses */

function Courses({ state, update, setEditing, setRitual }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const setLesson = (courseId, lessonId, patch) => update((s) => ({
    ...s,
    courses: s.courses.map((c) => c.id !== courseId ? c
      : { ...c, lessons: c.lessons.map((l) => l.id === lessonId ? { ...l, ...patch } : l) }),
  }));

  const startLesson = (course, lesson) => {
    const existing = state.tasks.find((t) => t.lessonId === lesson.id);
    if (existing) { setRitual({ taskId: existing.id }); return; }
    setEditing({
      ...emptyTask(), title: `${course.title} – ${lesson.title}`, category: "Coding",
      priority: "High", estMin: lesson.estMin, pomoPlanned: lesson.pomos, url: lesson.url,
      courseId: course.id, lessonId: lesson.id,
    });
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div className="eyebrow">Courses</div>
          <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>What you're working through</h1>
        </div>
        <button className="btn btn-sm" onClick={() => setAdding(true)}><Plus size={14} /> Course</button>
      </div>

      {state.courses.length === 0 && <div className="card"><Empty title="No courses yet" hint="Add a course, then break it into lessons." /></div>}

      {state.courses.map((c) => {
        const done = c.lessons.filter((l) => l.status === "done").length;
        const pct = Math.round((done / Math.max(1, c.lessons.length)) * 100);
        return (
          <div key={c.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{pct}%</div>
            </div>
            <div className="bar" style={{ marginTop: 11 }}><i style={{ width: pct + "%" }} /></div>
            <div style={{ marginTop: 15, display: "grid", gap: 2 }}>
              {c.lessons.map((l) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
                  <button onClick={() => setLesson(c.id, l.id, { status: l.status === "done" ? "todo" : "done" })}
                    className={"tick" + (l.status === "done" ? " done" : "")} aria-label="Toggle lesson">
                    {l.status === "done" && <Check size={12} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: l.status === "done" ? "var(--muted)" : "var(--text)" }}>{l.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                      <span className="chip mono">{l.estMin}m</span>
                      <span className="chip mono">{l.pomos} pomo</span>
                      {l.status === "active" && <span className="chip" style={{ color: "var(--acc)", borderColor: "var(--acc)" }}>In progress</span>}
                    </div>
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => startLesson(c, l)}><Play size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {adding && (
        <Sheet onClose={() => setAdding(false)}>
          <SheetHead title="New course" hint="You can add lessons as you go." onClose={() => setAdding(false)} />
          <Field label="Course title"><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Computer Networks (NPTEL)" /></Field>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={!title.trim()} onClick={() => {
            update((s) => ({ ...s, courses: [...s.courses, { id: uid(), title: title.trim(), createdAt: new Date().toISOString(), lessons: [] }] }));
            setTitle(""); setAdding(false);
          }}>Add course</button>
        </Sheet>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- analytics */

function Analytics({ state, C }) {
  const days = Array.from({ length: 7 }, (_, i) => dayKey(addDays(new Date(), i - 6)));
  const rows = days.map((k) => {
    const d = dayStats(state, k);
    return {
      day: new Date(k).toLocaleDateString([], { weekday: "short" }),
      hours: +(d.minutes / 60).toFixed(2), tasks: d.tasksDone, pomos: d.completed,
      distractions: d.distractions.length, score: focusScore(state, k).score,
      rate: d.started ? Math.round((d.completed / d.started) * 100) : 0,
    };
  });

  const allDist = state.sessions.flatMap((s) => s.distractions || []);
  const byKind = {};
  allDist.forEach((d) => { byKind[d.type] = (byKind[d.type] || 0) + 1; });
  const pie = Object.entries(byKind).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 5);
  const distTotal = pie.reduce((a, x) => a + x.value, 0) || 1;

  const byCat = {};
  state.sessions.forEach((s) => {
    const t = state.tasks.find((x) => x.id === s.taskId);
    const c = t?.category || "Other";
    byCat[c] = (byCat[c] || 0) + s.actualMin;
  });
  const catRows = Object.entries(byCat).map(([name, mins]) => ({ name, mins })).sort((a, b) => b.mins - a.mins);

  const palette = [C.acc, C.warn, C.danger, C.muted, C.faint];
  const axis = { stroke: C.faint, fontSize: 11, fontFamily: "IBM Plex Mono" };
  const tip = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 12, color: C.text };

  // Weekly review, derived only from stored sessions
  const week = state.sessions.filter((s) => new Date(s.startedAt) >= addDays(new Date(), -7));
  const totalMin = week.reduce((a, s) => a + s.actualMin, 0);
  const bestDay = rows.reduce((a, b) => (b.hours > a.hours ? b : a), rows[0]);
  const hourBuckets = {};
  week.filter((s) => s.status === "completed").forEach((s) => {
    const h = new Date(s.startedAt).getHours();
    hourBuckets[h] = (hourBuckets[h] || 0) + s.actualMin;
  });
  const bestHour = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0];
  const long = week.filter((s) => s.plannedMin >= 50);
  const short = week.filter((s) => s.plannedMin < 50);
  const rate = (arr) => (arr.length ? Math.round((arr.filter((s) => s.status === "completed").length / arr.length) * 100) : null);
  const withObjective = week.filter((s) => s.objective);

  const insights = [];
  if (bestHour) insights.push(`Your strongest stretch is around ${((+bestHour[0] % 12) || 12)} ${+bestHour[0] < 12 ? "AM" : "PM"} — ${fmtMin(bestHour[1])} of completed focus time this week.`);
  if (long.length >= 2 && short.length >= 2 && rate(short) !== rate(long))
    insights.push(`You complete ${rate(short)}% of ${short[0].plannedMin}-minute sessions versus ${rate(long)}% of longer ones.`);
  if (pie[0]) insights.push(`${pie[0].name} accounts for ${Math.round((pie[0].value / distTotal) * 100)}% of your distraction moments.`);
  if (withObjective.length >= 3) insights.push(`${Math.round((withObjective.filter((s) => s.status === "completed").length / withObjective.length) * 100)}% of sessions with a written objective were completed.`);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <div className="eyebrow">Analytics</div>
        <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>What the last seven days actually looked like</h1>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Focus hours by day</div>
        <div style={{ height: 210 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid vertical={false} stroke={C.line} />
              <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tip} cursor={{ fill: C.surface2 }} />
              <Bar dataKey="hours" fill={C.acc} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18 }} className="dash-cols">
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Focus score trend</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid vertical={false} stroke={C.line} />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={axis} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={tip} />
                <Line type="monotone" dataKey="score" stroke={C.acc} strokeWidth={2} dot={{ r: 2.5, fill: C.acc }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Tasks and pomodoros</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid vertical={false} stroke={C.line} />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={tip} cursor={{ fill: C.surface2 }} />
                <Bar dataKey="pomos" fill={C.acc} radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill={C.muted} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18 }} className="dash-cols">
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>What pulls you away</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 150, height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" innerRadius={44} outerRadius={70} stroke="none" paddingAngle={2}>
                    {pie.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 160, display: "grid", gap: 8 }}>
              {pie.map((p, i) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: palette[i % palette.length] }} />
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span className="mono" style={{ color: "var(--muted)" }}>{Math.round((p.value / distTotal) * 100)}%</span>
                </div>
              ))}
              {pie.length === 0 && <div style={{ fontSize: 13, color: "var(--muted)" }}>No distractions logged yet.</div>}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Where the time goes</div>
          <div style={{ display: "grid", gap: 11 }}>
            {catRows.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span>{c.name}</span><span className="mono" style={{ color: "var(--muted)" }}>{fmtMin(c.mins)}</span>
                </div>
                <div className="bar" style={{ height: 5 }}>
                  <i style={{ width: Math.round((c.mins / catRows[0].mins) * 100) + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="eyebrow">Weekly review</div>
        <div className="grid-stats" style={{ marginTop: 14 }}>
          <Stat label="Total focus time" value={fmtMin(totalMin)} accent />
          <Stat label="Pomodoros" value={week.filter((s) => s.status === "completed").length} />
          <Stat label="Best focus day" value={bestDay?.day || "—"} sub={bestDay ? `${bestDay.hours}h` : ""} />
          <Stat label="Completion rate" value={(rate(week) ?? 0) + "%"} />
        </div>
        <div className="divider" style={{ margin: "18px 0 14px" }} />
        <div style={{ display: "grid", gap: 9 }}>
          {insights.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "var(--muted)" }}>
              <span className="mono" style={{ color: "var(--acc)" }}>—</span><span>{t}</span>
            </div>
          ))}
          {insights.length === 0 && <div style={{ fontSize: 13.5, color: "var(--muted)" }}>Run a few sessions and insights will appear here. Nothing is invented — every line comes from your own logged sessions.</div>}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- history */

function HistoryView({ state }) {
  const byDay = {};
  [...state.sessions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .forEach((s) => {
      const k = dayKey(new Date(s.startedAt));
      (byDay[k] = byDay[k] || []).push(s);
    });
  const keys = Object.keys(byDay).sort().reverse();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div className="eyebrow">Session history</div>
        <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>Every session, honestly logged</h1>
      </div>
      {keys.length === 0 && <div className="card"><Empty title="No sessions yet" hint="Your first focus session will show up here." /></div>}
      {keys.map((k) => (
        <div key={k}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {k === dayKey() ? "Today" : new Date(k).toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" })}
            {" · "}{fmtMin(byDay[k].reduce((a, s) => a + s.actualMin, 0))}
          </div>
          <div className="card">
            {byDay[k].map((s) => {
              const ok = s.status === "completed";
              const resisted = (s.distractions || []).filter((d) => d.resisted).length;
              return (
                <div key={s.id} className="taskrow" style={{ alignItems: "center" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--muted)", width: 108, flexShrink: 0 }}>
                    {timeOf(s.startedAt)}–{timeOf(s.endedAt)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14 }}>{s.taskTitle}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                      {s.actualMin} min · {ok ? (s.outcome === "yes" ? "objective met" : s.outcome === "partial" ? "partly met" : "completed") : `abandoned · ${s.exitReason || "no reason given"}`}
                      {resisted ? ` · ${resisted} distraction${resisted > 1 ? "s" : ""} resisted` : ""}
                    </div>
                  </div>
                  <span className="chip" style={{ color: ok ? "var(--acc)" : "var(--warn)", borderColor: ok ? "var(--acc)" : "var(--warn)" }}>
                    {ok ? "Completed" : "Abandoned"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- settings */

function SettingsView({ state, setSettings, update, setToast }) {
  const s = state.settings;
  const num = (key, label, min, max) => (
    <Field label={label}>
      <input type="number" min={min} max={max} value={s[key]} onChange={(e) => setSettings({ [key]: clamp(+e.target.value || min, min, max) })} />
    </Field>
  );
  const toggle = (key, label, hint) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
      <div>
        <div style={{ fontSize: 14 }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{hint}</div>}
      </div>
      <button onClick={async () => {
        if (key === "notifications" && !s.notifications) {
          try { if (window.Notification) await Notification.requestPermission(); } catch (e) { /* blocked */ }
        }
        setSettings({ [key]: !s[key] });
      }} style={{
        width: 42, height: 24, borderRadius: 999, flexShrink: 0, position: "relative",
        background: s[key] ? "var(--acc)" : "var(--surface2)", border: "1px solid var(--line)",
      }} aria-pressed={!!s[key]}>
        <span style={{
          position: "absolute", top: 2, left: s[key] ? 20 : 2, width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left .16s ease",
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <div className="eyebrow">Settings</div>
        <h1 style={{ fontSize: 23, fontWeight: 650, margin: "7px 0 0" }}>Tune it to how you actually work</h1>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Timing</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {num("focusMin", "Focus length (min)", 5, 180)}
          {num("shortBreak", "Short break (min)", 1, 30)}
          {num("longBreak", "Long break (min)", 5, 60)}
          {num("dailyGoal", "Daily focus goal (min)", 15, 720)}
          {num("maxPriorities", "Max daily priorities", 1, 5)}
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Behaviour</div>
        {toggle("sound", "Sound alerts", "A soft chime when a session ends.")}
        {toggle("notifications", "Desktop notifications", "Never sent during an active session.")}
        {toggle("autoStartBreaks", "Auto-start breaks")}
        {toggle("strict", "Strict focus mode", "Ending early always asks for a reason.")}
        {toggle("weeklySummary", "Weekly summary")}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0 2px" }}>
          <div style={{ fontSize: 14 }}>Appearance</div>
          <div style={{ display: "flex", gap: 7 }}>
            <button className={"btn btn-sm" + (s.theme === "light" ? " btn-primary" : "")} onClick={() => setSettings({ theme: "light" })}><Sun size={14} /> Light</button>
            <button className={"btn btn-sm" + (s.theme === "dark" ? " btn-primary" : "")} onClick={() => setSettings({ theme: "dark" })}><Moon size={14} /> Dark</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={16} color="var(--acc)" />
          <div style={{ fontWeight: 600 }}>Privacy</div>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.65 }}>
          FocusForge stores what you type and what you do inside the app: tasks, sessions, notes, distraction
          moments you log yourself, and the times sessions start and end. That's all. It does not watch your
          browsing, read other tabs, or track anything outside a session.
        </div>
        {toggle("tracking", "Behaviour tracking", "Turn this off and analytics stop recording new sessions.")}
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 12 }}>
          The future browser extension will need its own explicit permission, granted separately, before it can
          block or see any site.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn btn-sm"
            onClick={() => {
              update(() => seed());
              setToast("Data reset to the sample student profile");
            }}>Reset to demo data</button>
          <button className="btn btn-sm" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
            onClick={() => {
              if (!window.confirm("This clears every task, session, note, and course. This can't be undone. Continue?")) return;
              update(() => ({
                v: 1, settings: { ...state.settings }, tasks: [], sessions: [], courses: [],
                notes: {}, later: [], priorities: {}, completedPriorities: {},
              }));
              setToast("All data cleared");
            }}>Clear all data</button>
        </div>
      </div>
    </div>
  );
}
