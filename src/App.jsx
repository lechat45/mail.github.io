import React, { useState, useEffect, useCallback } from "react"
import {
  Calendar, Mail, Send, Inbox, Star, LogOut, Settings, Sparkles, Shield, AlertTriangle,
  Reply, X, Check, Loader2, Power, Zap, Globe, Thermometer, Lock, Eye,
  RefreshCw, Search, AlertCircle, ShieldCheck, ShieldAlert, Flame, Bell,
  BarChart3, BookOpen, Tag, Archive, Info, User, Building2, Briefcase,
  Sliders, Trash2, MailOpen, StarOff, Languages, PenLine, ListChecks,
  TrendingUp, Sun, Moon, Copy, Save, ChevronRight, Users, Clock, Bot,
  Wifi, WifiOff, Filter, ChevronDown, FileText, CheckSquare, Square,
  Minus, RotateCcw, Activity, Keyboard, Download,
} from "lucide-react"

// URL du backend — défini dans .env.local (local) ou VITE_API_URL (GitHub Pages)
const API = import.meta.env.VITE_API_URL || "http://localhost:8000"
const MAIN_CATS = ["Client","Personnel","Publicite","Spam"]
const CAT_META = {
  Client:    {color:"#3ECFCF",bg:"rgba(62,207,207,0.1)",  icon:"\uD83D\uDCBC",desc:"Pro"},
  Personnel: {color:"#6CA3F7",bg:"rgba(108,163,247,0.1)", icon:"\uD83D\uDC64",desc:"Perso"},
  Publicite: {color:"#B07EF8",bg:"rgba(176,126,248,0.1)", icon:"\uD83D\uDCE2",desc:"Promo"},
  Spam:      {color:"#F87171",bg:"rgba(248,113,113,0.1)", icon:"\uD83D\uDEAB",desc:"Spam"},
}
const EMAIL_CATS = {
  "Important":      {c:"#F87171",s:"rgba(248,113,113,0.12)",Icon:Flame},
  "Action requise": {c:"#FB923C",s:"rgba(251,146,60,0.12)", Icon:Bell},
  "Info":           {c:"#60A5FA",s:"rgba(96,165,250,0.12)", Icon:Info},
  "Newsletter":     {c:"#34D399",s:"rgba(52,211,153,0.12)", Icon:BookOpen},
  "Commercial":     {c:"#A78BFA",s:"rgba(167,139,250,0.12)",Icon:Tag},
  "Finance":        {c:"#FBBF24",s:"rgba(251,191,36,0.12)", Icon:BarChart3},
  "Technique":      {c:"#38BDF8",s:"rgba(56,189,248,0.12)", Icon:Settings},
  "RH":             {c:"#A78BFA",s:"rgba(167,139,250,0.12)",Icon:User},
  "Juridique":      {c:"#FBBF24",s:"rgba(251,191,36,0.12)", Icon:Shield},
  "Spam":           {c:"#94A3B8",s:"rgba(148,163,184,0.12)",Icon:Archive},
  "Suspect":        {c:"#F87171",s:"rgba(248,113,113,0.12)",Icon:ShieldAlert},
}
const PRI = {Haute:"#F87171",Normale:"#60A5FA",Basse:"#34D399"}
const SENT_C = {Urgent:"#F87171",Negatif:"#FB923C",Neutre:"#64748B",Positif:"#34D399"}
const THEMES = {
  dark:     {bg:"#080C18",bg2:"#0D1527",bg3:"#121E35",bg4:"#1A2845",
             border:"rgba(255,255,255,0.06)",borderHi:"rgba(255,255,255,0.14)",borderFocus:"rgba(99,179,255,0.55)",
             text:"#E8EDF8",textSub:"#94A3B8",textFaint:"#3D5068",bodyText:"#8FA8C8",
             sidebar:"#060A14",sidebarBorder:"rgba(255,255,255,0.05)",
             cardShadow:"0 2px 8px rgba(0,0,0,0.3),0 8px 32px rgba(0,0,0,0.4)",
             glassBg:"rgba(13,21,39,0.8)",glassBlur:"blur(20px)",
             name:"Sombre",icon:"🌑"},
  light:    {bg:"#F4F6FB",bg2:"#FFFFFF",bg3:"#F0F3FA",bg4:"#E8EEF9",
             border:"rgba(0,0,0,0.07)",borderHi:"rgba(0,0,0,0.14)",borderFocus:"rgba(59,130,246,0.5)",
             text:"#0F172A",textSub:"#475569",textFaint:"#CBD5E1",bodyText:"#334155",
             sidebar:"#1A2540",sidebarBorder:"rgba(255,255,255,0.1)",
             cardShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.08)",
             glassBg:"rgba(255,255,255,0.85)",glassBlur:"blur(20px)",
             name:"Clair",icon:"☀️"},
  midnight: {bg:"#020509",bg2:"#080E1C",bg3:"#0C1425",bg4:"#111D32",
             border:"rgba(255,255,255,0.05)",borderHi:"rgba(255,255,255,0.1)",borderFocus:"rgba(139,92,246,0.5)",
             text:"#F0F4FF",textSub:"#8892B0",textFaint:"#233044",bodyText:"#7B8DB0",
             sidebar:"#040710",sidebarBorder:"rgba(255,255,255,0.04)",
             cardShadow:"0 4px 16px rgba(0,0,0,0.5),0 16px 48px rgba(0,0,0,0.6)",
             glassBg:"rgba(8,14,28,0.9)",glassBlur:"blur(24px)",
             name:"Minuit",icon:"🌌"},
  aurora:   {bg:"#0A0E1A",bg2:"#0F1628",bg3:"#141E35",bg4:"#1A2640",
             border:"rgba(100,220,200,0.08)",borderHi:"rgba(100,220,200,0.15)",borderFocus:"rgba(52,211,153,0.5)",
             text:"#E2F5F0",textSub:"#7BBFB0",textFaint:"#2A4A44",bodyText:"#9DCFCA",
             sidebar:"#070C18",sidebarBorder:"rgba(100,220,200,0.06)",
             cardShadow:"0 4px 24px rgba(0,0,0,0.5)",
             glassBg:"rgba(10,14,26,0.85)",glassBlur:"blur(20px)",
             name:"Aurora",icon:"🌌"},
  rose:     {bg:"#110810",bg2:"#1A0F1C",bg3:"#201526",bg4:"#281C30",
             border:"rgba(220,100,150,0.08)",borderHi:"rgba(220,100,150,0.15)",borderFocus:"rgba(236,72,153,0.5)",
             text:"#F5E6F0",textSub:"#C080A0",textFaint:"#4A2A3A",bodyText:"#C4A0B8",
             sidebar:"#0D060F",sidebarBorder:"rgba(220,100,150,0.06)",
             cardShadow:"0 4px 24px rgba(0,0,0,0.5)",
             glassBg:"rgba(17,8,16,0.85)",glassBlur:"blur(20px)",
             name:"Rose",icon:"🌸"},
}
const AC = {
  blue:"#3B82F6",blueDim:"rgba(59,130,246,0.15)",blueGlow:"rgba(59,130,246,0.3)",blueSoft:"rgba(59,130,246,0.08)",
  indigo:"#6366F1",indigoDim:"rgba(99,102,241,0.15)",
  violet:"#8B5CF6",violetDim:"rgba(139,92,246,0.15)",violetGlow:"rgba(139,92,246,0.3)",
  cyan:"#06B6D4",cyanDim:"rgba(6,182,212,0.15)",cyanGlow:"rgba(6,182,212,0.3)",
  green:"#10B981",greenDim:"rgba(16,185,129,0.15)",greenGlow:"rgba(16,185,129,0.3)",
  red:"#EF4444",redDim:"rgba(239,68,68,0.15)",
  orange:"#F59E0B",orangeDim:"rgba(245,158,11,0.15)",
  pink:"#EC4899",pinkDim:"rgba(236,72,153,0.15)",
  gold:"#EAB308",goldDim:"rgba(234,179,8,0.15)",
  grad1:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
  grad2:"linear-gradient(135deg,#06B6D4,#3B82F6)",
  grad3:"linear-gradient(135deg,#10B981,#06B6D4)",
  grad4:"linear-gradient(135deg,#EC4899,#8B5CF6)",
  grad5:"linear-gradient(135deg,#F59E0B,#EF4444)",
  gradSidebar:"linear-gradient(180deg,#3B82F6 0%,#6366F1 50%,#8B5CF6 100%)",
}
const DEFAULT_SETTINGS = {enabled:true,autoAnalyze:false,language:"fr",temperature:0.4,maxDraftLength:2000,safetyFilter:true,professionalTone:true,showSecurityDetails:true,compactView:false,theme:"dark",wordFilterEnabled:true,showPreview:true,groupByDate:false,grammarCheck:false,digestEnabled:false,undoEnabled:true,searchHistory:[],browserNotif:false,autoRefresh:true}
const DEFAULT_PROFILE = {firstName:"",lastName:"",company:"",role:"",email:"",context:"",signature:""}
const ld = (k,d) => { try{const s=localStorage.getItem(k);return s?{...d,...JSON.parse(s)}:d}catch{return d} }
const sv = (k,v) => localStorage.setItem(k,JSON.stringify(v))
const fl = (g=8,a="center",j="flex-start") => ({display:"flex",alignItems:a,justifyContent:j,gap:g})
const grd = (c,g=14) => ({display:"grid",gridTemplateColumns:c,gap:g})
// Helper fetch avec timeout pour eviter les freezes
// SECURITE: Token API local (X-API-Key)
const getApiToken = () => localStorage.getItem("emailai_api_token") || ""
const setApiToken = (t) => localStorage.setItem("emailai_api_token", t)

// Helper fetch avec token + timeout automatiques
async function fetchWithTimeout(url, options={}, timeoutMs=30000) {
  const ctrl = new AbortController()
  const tid = setTimeout(()=>ctrl.abort(), timeoutMs)
  const token = getApiToken()
  const headers = {
    ...(options.headers||{}),
    ...(token ? {"X-API-Key": token} : {}),
  }
  try {
    const r = await fetch(url, {...options, headers, signal:ctrl.signal})
    clearTimeout(tid)
    if(r.status===401) {
      // Token invalide ou manquant → afficher le panneau de connexion token
      window.dispatchEvent(new CustomEvent("emailai:auth_error"))
    }
    if(!r.ok) throw new Error(`HTTP ${r.status}`)
    return r
  } catch(e) {
    clearTimeout(tid)
    if(e.name==="AbortError") throw new Error("Timeout - Groq trop lent, reessaie")
    throw e
  }
}

// fetch simple avec token (pour les cas sans timeout custom)

// ══════════════════════════════════════════════════════════════
// CACHE API — évite les requêtes dupliquées (TTL en ms)
// ══════════════════════════════════════════════════════════════
const _apiCache = new Map()
const _cacheInflight = new Map()

function cachedFetch(url, ttlMs = 30000) {
  const now = Date.now()
  const cached = _apiCache.get(url)
  if (cached && now - cached.ts < ttlMs) return Promise.resolve(cached.data)
  // Dédupliquer les requêtes en vol
  if (_cacheInflight.has(url)) return _cacheInflight.get(url)
  const req = apiFetch(url)
    .then(r => r.json())
    .then(data => { _apiCache.set(url, {data, ts: Date.now()}); _cacheInflight.delete(url); return data })
    .catch(e => { _cacheInflight.delete(url); throw e })
  _cacheInflight.set(url, req)
  return req
}

function invalidateCache(pattern) {
  for (const key of _apiCache.keys()) {
    if (!pattern || key.includes(pattern)) _apiCache.delete(key)
  }
}

function apiFetch(url, options={}) {
  const token = getApiToken()
  return fetch(url, {
    ...options,
    headers: {...(options.headers||{}), ...(token?{"X-API-Key":token}:{})}
  })
}




// ── Favicon dynamique (badge non-lus) ────────────────────────────────────────
function updateFavicon(unreadCount) {
  const canvas = document.createElement("canvas")
  canvas.width = 32; canvas.height = 32
  const ctx = canvas.getContext("2d")
  // Fond rond bleu
  ctx.fillStyle = "#3B82F6"
  ctx.beginPath(); ctx.arc(16,16,15,0,Math.PI*2); ctx.fill()
  // Lettre M
  ctx.fillStyle = "#fff"; ctx.font = "bold 16px DM Sans,sans-serif"
  ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText("M",16,17)
  if(unreadCount > 0) {
    // Badge rouge
    ctx.fillStyle = "#EF4444"
    ctx.beginPath(); ctx.arc(24,8,9,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = "#fff"; ctx.font = "bold 9px sans-serif"
    ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.fillText(unreadCount > 99 ? "99+" : String(unreadCount), 24, 8)
  }
  const link = document.querySelector("link[rel~='icon']") || (() => {
    const l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); return l
  })()
  link.href = canvas.toDataURL()
  // Titre de l'onglet
  document.title = unreadCount > 0 ? `(${unreadCount}) EmailAI` : "EmailAI"
}

// ── Sons de notification ──────────────────────────────────────────────────────
const SoundFX = {
  _ctx: null,
  _get() { if(!this._ctx) this._ctx = new (window.AudioContext||window.webkitAudioContext)(); return this._ctx },
  play(type) {
    try {
      const ctx = this._get()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      if(type === "send") {
        // Swoosh montant
        osc.type = "sine"; osc.frequency.setValueAtTime(300, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime+0.15)
        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.25)
        osc.start(); osc.stop(ctx.currentTime+0.25)
      } else if(type === "newvip") {
        // Carillon 3 notes
        [440,554,659].forEach((freq,i) => {
          const o2 = ctx.createOscillator(); const g2 = ctx.createGain()
          o2.connect(g2); g2.connect(ctx.destination)
          o2.type = "triangle"; o2.frequency.value = freq
          g2.gain.setValueAtTime(0, ctx.currentTime+i*0.1)
          g2.gain.linearRampToValueAtTime(0.15, ctx.currentTime+i*0.1+0.02)
          g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.1+0.3)
          o2.start(ctx.currentTime+i*0.1); o2.stop(ctx.currentTime+i*0.1+0.3)
        })
      } else if(type === "new") {
        // Ding simple
        osc.type = "sine"; osc.frequency.value = 523
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.4)
        osc.start(); osc.stop(ctx.currentTime+0.4)
      } else if(type === "error") {
        osc.type = "sawtooth"; osc.frequency.value = 150
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.2)
        osc.start(); osc.stop(ctx.currentTime+0.2)
      }
    } catch(e) { /* AudioContext non supporté */ }
  }
}


// ── Z-Index cohérent ──────────────────────────────────────────────────────────
const Z = {
  base: 1, sidebar: 10, toolbar: 20, dropdown: 50,
  modal: 100, toast: 9999, overlay: 500, floating: 200
}

// ── Icones SVG manquantes dans la version de lucide ──────────────────────────

const Pin = ({size,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
const Upload = ({size,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
const MailX = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m17 17 5 5m0-5-5 5"/></svg>
const History = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
const MapPin = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const Timer = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4"/><path d="M12 14v-4"/><circle cx="12" cy="14" r="8"/></svg>
const Bookmark = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
const ExternalLink = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
const Circle = ({size=16,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
const Plus = ({size,color,...p}) => <svg {...p} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>


// Couleur déterministe par expéditeur (hash simple)
function senderColor(email) {
  const COLORS = ["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#06B6D4","#6366F1","#EC4899","#14B8A6","#F97316"]
  let h = 0
  for(let i=0;i<email.length;i++) h = (h*31+email.charCodeAt(i))&0xffffffff
  return COLORS[Math.abs(h)%COLORS.length]
}

// Couleur selon l'âge de l'email
function emailAgeColor(dateStr, T) {
  if(!dateStr) return T.textFaint
  const diff = (Date.now() - new Date(dateStr).getTime()) / 3600000 // heures
  if(diff < 1)  return "#10B981"   // moins de 1h → vert
  if(diff < 24) return "#3B82F6"   // moins de 1j → bleu
  if(diff < 72) return "#F59E0B"   // moins de 3j → orange
  return undefined                  // plus vieux → défaut
}
// Formatte la date de manière relative
function relativeDate(dateStr) {
  if(!dateStr) return ""
  const diff = (Date.now() - new Date(dateStr).getTime()) / 60000 // minutes
  if(diff < 60)   return `${Math.round(diff)}min`
  if(diff < 1440) return `${Math.round(diff/60)}h`
  if(diff < 10080)return `${Math.round(diff/1440)}j`
  return new Date(dateStr).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"})
}
// ── Primitives ─────────────────────────────────────────────────────────────────
const Spin = ({size=16,color="#64748B"}) => <Loader2 size={size} color={color} style={{animation:"spin .7s linear infinite"}}/>
function Chip({label,T}) {
  const m=EMAIL_CATS[label]||EMAIL_CATS["Info"]; const{Icon}=m
  return <span style={{...fl(4),background:m.s,color:m.c,border:`1px solid ${m.c}20`,borderRadius:999,padding:"2px 9px 2px 6px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}><Icon size={9} strokeWidth={2.5}/> {label}</span>
}
function CatBadge({cat}) {
  const m=CAT_META[cat]; if(!m) return null
  return <span style={{...fl(4),background:m.bg,color:m.color,border:`1px solid ${m.color}20`,borderRadius:999,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{m.icon} {cat}</span>
}
function Pill({label,color,icon}) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:`${color}12`,color,border:`1px solid ${color}22`,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",boxShadow:`0 1px 4px ${color}15`,letterSpacing:"0.01em"}}>{icon&&<span style={{fontSize:9}}>{icon}</span>}{label}</span>
}
function SecBar({sec,T}) {
  if(!sec||sec.level==="OK") return null
  const m={MEDIUM:{Icon:Shield,c:AC.orange,l:"Attention"},HIGH:{Icon:ShieldAlert,c:AC.red,l:"Risque"},CRITICAL:{Icon:AlertTriangle,c:AC.red,l:"CRITIQUE"}}[sec.level]
  if(!m) return null; const{Icon}=m
  return <div style={{...fl(10),padding:"11px 14px",background:`${m.c}12`,border:`1px solid ${m.c}25`,borderRadius:12,marginBottom:12}}>
    <Icon size={16} color={m.c} style={{flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:700,color:m.c}}>{m.l}</div>{sec.threats?.map((t,i)=><div key={i} style={{fontSize:11,color:T.textSub,marginTop:2}}>{t.detail}</div>)}</div>
  </div>
}
function Btn({children,onClick,disabled,variant="ghost",T,full,style:s={}}) {
  const vars={
    primary:{background:AC.grad1,color:"#fff",boxShadow:`0 2px 8px ${AC.blueGlow},0 4px 20px ${AC.blueGlow}`,border:"none"},
    secondary:{background:AC.blueDim,color:AC.blue,border:`1px solid ${AC.blue}30`,boxShadow:`inset 0 1px 0 rgba(255,255,255,0.05)`},
    ghost:{background:T.bg3,color:T.textSub,border:`1px solid ${T.border}`,boxShadow:"none"},
    danger:{background:AC.redDim,color:AC.red,border:`1px solid ${AC.red}30`},
    success:{background:AC.greenDim,color:AC.green,border:`1px solid ${AC.green}30`},
    violet:{background:AC.violetDim,color:AC.violet,border:`1px solid ${AC.violet}30`},
    flat:{background:"transparent",color:T.textSub,border:"none"},
  }
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"9px 16px",borderRadius:10,fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?.45:1,whiteSpace:"nowrap",width:full?"100%":undefined,transition:"all .14s cubic-bezier(.4,0,.2,1)"}
  const v=vars[variant||"ghost"]||vars.ghost
  return <button onClick={onClick} disabled={disabled} className={disabled?"":"press"} style={{...base,...v,...s}}
    onMouseEnter={e=>{if(!disabled&&variant!=="flat"){e.currentTarget.style.filter="brightness(1.12)";e.currentTarget.style.transform="translateY(-1px)"}}}
    onMouseLeave={e=>{if(!disabled){e.currentTarget.style.filter="";e.currentTarget.style.transform=""}}}
  >{children}</button>
}
function Tog({on,set,disabled,T,color}) {
  return <button onClick={()=>!disabled&&set(!on)} disabled={disabled} style={{width:42,height:24,borderRadius:12,border:"none",cursor:disabled?"default":"pointer",background:on?(color||AC.blue):T.bg4,position:"relative",transition:"background .2s",opacity:disabled?.4:1,flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:on?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 2px 6px rgba(0,0,0,0.4)"}}/>
  </button>
}
function SI({T,value,onChange,placeholder,onKeyDown,icon:Icon,style:s={}}) {
  return <div style={{position:"relative",flex:1}}>
    {Icon&&<Icon size={13} color={T.textFaint} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>}
    <input value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} style={{width:"100%",padding:Icon?"9px 12px 9px 34px":"9px 14px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box",...s}} onFocus={e=>e.target.style.borderColor=T.borderFocus} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>
}
function Sel({T,value,onChange,options}) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"8px 12px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.text,outline:"none",cursor:"pointer",fontFamily:"inherit"}}>
    {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
  </select>
}
function TA({T,value,onChange,placeholder,rows=4,mono}) {
  return <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{width:"100%",padding:"11px 14px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text,outline:"none",fontFamily:mono?"'Courier New',monospace":"inherit",resize:"vertical",lineHeight:1.65,boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.borderFocus} onBlur={e=>e.target.style.borderColor=T.border}/>
}
function Field({T,label,sub,children}) {
  return <div style={{marginBottom:18}}><label style={{display:"block",fontSize:11,fontWeight:800,color:T.textSub,marginBottom:6,letterSpacing:"0.06em"}}>{label}</label>{sub&&<p style={{fontSize:11,color:T.textFaint,marginBottom:8,lineHeight:1.5}}>{sub}</p>}{children}</div>
}
function Toast({toast}) {
  if(!toast) return null
  const cfg={"err":{bg:"rgba(42,10,10,0.95)",b:"#EF4444",c:"#FCA5A5",icon:"✕"},"success":{bg:"rgba(10,42,26,0.95)",b:"#22C55E",c:"#86EFAC",icon:"✓"},"warn":{bg:"rgba(42,26,0,0.95)",b:"#F59E0B",c:"#FCD34D",icon:"⚠"},"info":{bg:"rgba(10,26,42,0.95)",b:"#3B82F6",c:"#93C5FD",icon:"ℹ"}}
  const t=cfg[toast.type]||cfg.success
  return <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"12px 20px",background:t.bg,border:`1px solid ${t.b}50`,borderRadius:14,color:t.c,fontSize:13,fontWeight:600,boxShadow:`0 8px 32px rgba(0,0,0,0.6),0 0 0 1px ${t.b}20`,animation:"fadeIn .2s ease",maxWidth:380,display:"flex",gap:8,alignItems:"center",backdropFilter:"blur(16px)"}}>
    <span style={{flexShrink:0,fontWeight:900}}>{t.icon}</span>
    <span style={{overflow:'hidden',textOverflow:'ellipsis'}}>{toast.msg}</span>
  </div>
}

function GS({T}) {
  return <style>{`
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes glow{0%,100%{box-shadow:0 0 8px ${AC.blue}40}50%{box-shadow:0 0 24px ${AC.blue}80}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes popIn{0%{opacity:0;transform:scale(.92)}100%{opacity:1;transform:scale(1)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    *{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;}
    html,body{margin:0;height:100%;}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${T.textFaint};border-radius:4px;}
    ::-webkit-scrollbar-thumb:hover{background:${T.textSub};}
    input[type=range]{accent-color:${AC.blue};}
    ::placeholder{color:${T.textFaint};opacity:.7;}
    *{transition-property:none;}
    button,a{cursor:pointer;}
    .animated{animation:fadeUp .22s cubic-bezier(.34,1.26,.64,1) both;}
    .card-hover{transition:transform .15s,box-shadow .15s;}
    .card-hover:hover{transform:translateY(-1px);box-shadow:0 8px 32px rgba(0,0,0,.35);}
    .press:active{transform:scale(.97)!important;}
    .sidebar-glow{box-shadow:inset -1px 0 0 ${T.sidebarBorder},4px 0 24px rgba(0,0,0,0.3);}
  `}</style>
}
const NL = ({children,T}) => <div style={{fontSize:9,fontWeight:800,color:"#3A4A5E",letterSpacing:"0.14em",padding:"14px 12px 5px",textTransform:"uppercase"}}>{children}</div>
function NB({T,Icon,label,active,onClick,badge,color}) {
  const ac=color||AC.blue
  return <button className="sidebar-item" onClick={onClick} style={{width:"100%",textAlign:"left",padding:"7px 10px",background:active?`${ac}12`:"transparent",border:"none",borderRadius:10,color:active?ac:"#7A8BAA",fontSize:12.5,cursor:"pointer",marginBottom:1,...fl(9),fontFamily:"inherit",fontWeight:active?700:400,transition:"all .13s",position:"relative"}}
    onMouseEnter={e=>{if(!active){e.currentTarget.style.background="#ffffff0a";e.currentTarget.style.color="#C0CDE0"}}}
    onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#7A8BAA"}}}>
    {active&&<div style={{position:"absolute",left:-8,top:"50%",transform:"translateY(-50%)",width:3,height:18,borderRadius:2,background:ac,boxShadow:`0 0 8px ${ac}`}}/>}
    <div style={{width:28,height:28,borderRadius:8,background:active?`${ac}18`:"transparent",...fl(0,"center","center"),flexShrink:0,transition:"background .13s"}}><Icon size={14}/></div>
    <span style={{flex:1}}>{label}</span>
    {badge>0&&<span style={{fontSize:10,background:AC.blue,color:"#fff",borderRadius:20,padding:"2px 7px",fontWeight:800,minWidth:18,textAlign:"center"}}>{badge>99?"99+":badge}</span>}
  </button>
}
const ND = ({T}) => <div style={{height:1,background:T.sidebarBorder,margin:"8px 6px"}}/>
function IAB({T,Icon,onClick,title,danger,color}) {
  const c=danger?AC.red:color||T.textSub
  return <button title={title} onClick={onClick} style={{width:30,height:30,borderRadius:8,border:"none",background:"transparent",color:c,cursor:"pointer",...fl(0,"center","center"),transition:"all .12s"}}
    onMouseEnter={e=>{e.currentTarget.style.background=danger?AC.redDim:`${c}18`;e.currentTarget.style.transform="scale(1.08)"}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform=""}}
    className="press"><Icon size={13}/></button>
}


// ── Modal de configuration du token API ──────────────────────────────────────
function TokenSetupModal({T,onSave}) {
  const [token,setToken]=useState(getApiToken()||"")
  const [testing,setTesting]=useState(false)
  const [testOk,setTestOk]=useState(null)

  const testToken=async()=>{
    setTesting(true);setTestOk(null)
    try{
      const r=await fetch(`${API}/health`,{headers:{"X-API-Key":token}})
      setTestOk(r.ok)
      if(r.ok){setApiToken(token);setTimeout(()=>onSave(token),500)}
    }catch{setTestOk(false)}finally{setTesting(false)}
  }

  return <div className="modal-overlay" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:500,...fl(0,"center","center"),backdropFilter:"blur(8px)"}}>
    <div style={{background:"#0D1527",border:`1px solid ${AC.blue}40`,borderRadius:24,padding:"48px 56px",maxWidth:480,width:"90%",textAlign:"center",boxShadow:`0 16px 64px rgba(0,0,0,0.7),0 0 0 1px ${AC.blue}20`}}>
      <div style={{width:64,height:64,borderRadius:20,background:AC.grad1,...fl(0,"center","center"),margin:"0 auto 24px",boxShadow:`0 8px 32px ${AC.blueGlow}`}}>
        <Shield size={30} color="#fff"/>
      </div>
      <h2 style={{fontSize:24,fontWeight:800,color:"#E8EDF8",marginBottom:8,letterSpacing:"-0.02em"}}>Configuration sécurité</h2>
      <p style={{fontSize:13,color:"#94A3B8",lineHeight:1.7,marginBottom:28}}>
        EmailAI utilise un token local pour sécuriser l'API.<br/>
        Retrouve-le dans ton fichier <code style={{background:"#1A2845",padding:"2px 8px",borderRadius:5,color:AC.cyan,fontSize:12}}>{"emailai_api_token"}</code> ou dans les logs du backend.
      </p>
      <div style={{...fl(8),marginBottom:16}}>
        <input
          value={token} onChange={e=>setToken(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&testToken()}
          placeholder="Colle ton token ici..."
          type="password"
          style={{flex:1,padding:"11px 16px",background:"#121E35",border:`1px solid ${testOk===false?AC.red:testOk===true?AC.green:AC.blue}40`,borderRadius:12,fontSize:13,color:"#E8EDF8",outline:"none",fontFamily:"inherit"}}
        />
        <button onClick={testToken} disabled={testing||!token.trim()} style={{padding:"11px 20px",background:AC.grad1,border:"none",borderRadius:12,color:"#fff",fontWeight:700,cursor:testing?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit",opacity:testing||!token.trim()?.5:1}}>
          {testing?<Spin size={14} color="#fff"/>:<Check size={14}/>}
        </button>
      </div>
      {testOk===true&&<div style={{...fl(6,"center","center"),fontSize:13,color:AC.green,marginBottom:16,...fl(6)}}><ShieldCheck size={14}/> Token valide — connexion réussie !</div>}
      {testOk===false&&<div style={{...fl(6,"center","center"),fontSize:13,color:AC.red,marginBottom:16}}><AlertTriangle size={14}/> Token invalide — vérifie les logs du backend</div>}
      <div style={{fontSize:11,color:"#3D5068",marginTop:16,...fl(6,"center","center")}}><Lock size={9}/> Stocké uniquement dans ton navigateur</div>
      <div style={{marginTop:16}}>
        <button onClick={()=>{if(window.confirm("Continuer sans token ? (mode développement local)"))onSave("")}} style={{fontSize:11,color:"#3D5068",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
          Continuer sans token (développement local)
        </button>
      </div>
    </div>
  </div>
}


// ══════════════════════════════════════════════════════════════════════════════
// NOUVELLES FEATURES VISUELLES
// ══════════════════════════════════════════════════════════════════════════════


// Debounce — évite les requêtes à chaque frappe

// Préchargement silencieux de l'email suivant
function useEmailPreload(emails, selectedId) {
  useEffect(() => {
    if (!emails || !selectedId) return
    const idx = emails.findIndex(e => e.id === selectedId)
    if (idx >= 0 && idx < emails.length - 1) {
      const nextId = emails[idx+1].id
      setTimeout(() => {
        cachedFetch(`${API}/emails/${nextId}`, 120000).catch(()=>{})
      }, 500)
    }
  }, [selectedId, emails])
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}


// ── Empty State — écran vide élégant ─────────────────────────────────────────
function EmptyState({T, icon="📭", title="Rien ici", subtitle="", action=null, actionLabel=""}) {
  return <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:60,textAlign:"center",color:T.text}}>
    <div style={{fontSize:48,opacity:0.3,animation:"bounce 2s ease infinite"}}>{icon}</div>
    <div>
      <div style={{fontSize:16,fontWeight:700,color:T.textSub,marginBottom:6}}>{title}</div>
      {subtitle&&<div style={{fontSize:13,color:T.textFaint,maxWidth:280,lineHeight:1.6}}>{subtitle}</div>}
    </div>
    {action&&<button onClick={action} style={{padding:"10px 24px",background:"linear-gradient(135deg,#3B82F6,#6366F1)",border:"none",borderRadius:12,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>{actionLabel}</button>}
  </div>
}

// ── Skeleton Loader ────────────────────────────────────────────────────────
function SkeletonLine({w="100%",h=14,radius=6,style={}}) {
  return <div style={{width:w,height:h,borderRadius:radius,background:"linear-gradient(90deg,#1a2540 25%,#243050 50%,#1a2540 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite",...style}}/>
}
function SkeletonCard({T}) {
  return <div style={{padding:"16px 18px",borderBottom:`1px solid ${T.border}`,...fl(14)}}>
    <div style={{width:40,height:40,borderRadius:12,background:"#1a2540",flexShrink:0}}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
      <SkeletonLine w="60%"/><SkeletonLine w="40%" h={10}/>
    </div>
  </div>
}

// ── Undo Bar ───────────────────────────────────────────────────────────────
function UndoBar({T,action,onUndo,onDismiss}) {
  const [progress,setProgress]=useState(100)
  useEffect(()=>{
    const start=Date.now();const dur=5000
    const tick=setInterval(()=>{
      const pct=Math.max(0,100-(Date.now()-start)/dur*100)
      setProgress(pct);if(pct<=0){clearInterval(tick);onDismiss()}
    },50)
    return()=>clearInterval(tick)
  },[])
  return <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1E2D4A",border:`1px solid ${AC.blue}40`,borderRadius:16,padding:"14px 20px",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",...fl(14),"minWidth":320}}>
    <div style={{position:"absolute",bottom:0,left:0,height:3,background:AC.blue,borderRadius:"0 0 16px 16px",width:progress+"%",transition:"width .05s linear"}}/>
    <span style={{fontSize:13,color:"#E8EDF8",flex:1}}>{action.label}</span>
    <button onClick={onUndo} style={{padding:"5px 14px",background:AC.blueDim,border:`1px solid ${AC.blue}40`,borderRadius:9,color:AC.blue,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",...fl(4)}}><Undo size={11}/> Annuler</button>
    <button onClick={onDismiss} style={{background:"none",border:"none",color:"#3D5068",cursor:"pointer",...fl(0,"center","center")}}><X size={14}/></button>
  </div>
}

// ── Smart Replies ──────────────────────────────────────────────────────────
function SmartReplies({T,emailId,onSelect}) {
  const [replies,setReplies]=useState(null),[loading,setLoading]=useState(false)
  const load=async()=>{
    setLoading(true)
    try{const d=await apiFetch(`${API}/emails/${emailId}/smart-replies`).then(r=>r.json());setReplies(d.replies||[])}
    catch{setReplies([])}finally{setLoading(false)}
  }
  useEffect(()=>{if(emailId)load()},[emailId])
  if(!replies&&!loading) return null
  return <div style={{marginTop:12,padding:"12px 16px",background:T.bg3,borderRadius:12,border:`1px solid ${T.border}`}}>
    <div style={{fontSize:11,fontWeight:700,color:T.textSub,marginBottom:8,letterSpacing:"0.06em",...fl(6)}}><Sparkles size={11} color={AC.violet}/> RÉPONSES RAPIDES</div>
    {loading?<div style={{...fl(8)}}>{[1,2,3].map(i=><SkeletonLine key={i} w={80+i*20+"px"} h={28} radius={9}/>)}</div>
    :<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {(replies||[]).map((r,i)=><button key={i} onClick={()=>onSelect(r)} style={{padding:"6px 12px",background:T.bg2,border:`1px solid ${AC.violet}30`,borderRadius:20,fontSize:12,color:T.text,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=AC.violetDim;e.target.style.borderColor=AC.violet}} onMouseLeave={e=>{e.target.style.background=T.bg2;e.target.style.borderColor=AC.violet+"30"}}>{r}</button>)}
    </div>}
  </div>
}

// ── Shortcuts Modal ────────────────────────────────────────────────────────
function ShortcutsModal({T,onClose}) {
  const groups = [
    {title:"Navigation",items:[["E","Archiver email sélectionné"],["Suppr","Supprimer"],["S","Étoiler / Désétoiler"],["U","Marquer non lu"],["Z","Mode Zen (Focus)"]]},
    {title:"Interface",items:[["?","Afficher ce modal"],["Ctrl+Z","Annuler la dernière action"],["Échap","Fermer / Annuler"],["A+","Agrandir la police"],["A-","Réduire la police"]]},
    {title:"Composition",items:[["Ctrl+Entrée","Envoyer l'email en cours"],["Ctrl+K","Barre de recherche"]]},
  ]
  return <div className="modal-overlay" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,...fl(0,"center","center"),backdropFilter:"blur(4px)"}} onClick={onClose}>
    <div style={{background:"#0D1527",border:`1px solid ${AC.blue}30`,borderRadius:20,padding:32,maxWidth:520,width:"90%",maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{...fl(0,"space-between","center"),marginBottom:24}}>
        <div style={{fontSize:18,fontWeight:800,color:"#E8EDF8",...fl(8)}}><Keyboard size={18} color={AC.blue}/> Raccourcis clavier</div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#3D5068",...fl(0,"center","center")}}><X size={18}/></button>
      </div>
      {groups.map(g=><div key={g.title} style={{marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:800,color:AC.blue,letterSpacing:"0.08em",marginBottom:10}}>{g.title.toUpperCase()}</div>
        {g.items.map(([k,desc])=><div key={k} style={{...fl(0,"space-between","center"),padding:"7px 0",borderBottom:`1px solid #1A2540`}}>
          <span style={{fontSize:13,color:"#94A3B8"}}>{desc}</span>
          <kbd style={{padding:"3px 8px",background:"#1A2540",border:"1px solid #2A3A5A",borderRadius:6,fontSize:11,fontWeight:700,color:"#E8EDF8",fontFamily:"monospace"}}>{k}</kbd>
        </div>)}
      </div>)}
    </div>
  </div>
}

// ── AIConfigView ────────────────────────────────────────────────────────────
function AIConfigView({T,showToast}) {
  const [cfg,setCfg]=useState(null),[models,setModels]=useState([]),[presets,setPresets]=useState({})
  const [saving,setSaving]=useState(false),[testing,setTesting]=useState(false),[testResult,setTestResult]=useState(null)
  useEffect(()=>{
    Promise.all([
      apiFetch(`${API}/ai-config`).then(r=>r.json()),
      cachedFetch(`${API}/ai-config/models`, 1800000),
      cachedFetch(`${API}/ai-config/presets`, 1800000),
    ]).then(([c,m,p])=>{setCfg(c);setModels(m.models||[]);setPresets(p.presets||{})}).catch(console.error)
  },[])
  const save=async()=>{setSaving(true);try{await apiFetch(`${API}/ai-config`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(cfg)});showToast("Config IA sauvegardée !")}catch(e){showToast("Erreur","err")}finally{setSaving(false)}}
  const test=async()=>{setTesting(true);setTestResult(null);try{const d=await apiFetch(`${API}/ai-config/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(cfg)}).then(r=>r.json());setTestResult(d)}catch(e){setTestResult({ok:false,error:e.message})}finally{setTesting(false)}}
  const applyPreset=(name)=>{const p=presets[name];if(p&&cfg)setCfg({...cfg,...p})}
  if(!cfg) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad2,...fl(0,"center","center")}}><Sparkles size={24} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Moteur IA</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Configure le modèle, la température et le style d'analyse</p></div>
      </div>
      {/* Présets */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:800,color:T.textSub,marginBottom:10,letterSpacing:"0.06em"}}>PRÉSETS RAPIDES</div>
        <div style={{...fl(8),flexWrap:"wrap"}}>
          {Object.entries(presets).map(([name,p])=><button key={name} onClick={()=>applyPreset(name)} style={{padding:"7px 16px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:20,fontSize:12,color:T.text,cursor:"pointer",fontFamily:"inherit",fontWeight:600,textTransform:"capitalize"}}>{name}</button>)}
        </div>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <Field T={T} label="MODÈLE IA">
          <select value={cfg.model} onChange={e=>setCfg({...cfg,model:e.target.value})} style={{width:"100%",padding:"10px 14px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            {(models||[]).map(m=><option key={m.id} value={m.id}>{m.name} — {m.desc}</option>)}
          </select>
        </Field>
        <Field T={T} label={`TEMPÉRATURE: ${cfg.temperature} (0=précis, 1=créatif)`}>
          <div style={{...fl(10)}}>
            <span style={{fontSize:11,color:T.textFaint}}>0</span>
            <input type="range" min="0" max="1" step="0.1" value={cfg.temperature} onChange={e=>setCfg({...cfg,temperature:parseFloat(e.target.value)})} style={{flex:1,accentColor:AC.violet}}/>
            <span style={{fontSize:11,color:T.textFaint}}>1</span>
          </div>
        </Field>
        <Field T={T} label="PROFONDEUR D'ANALYSE">
          <div style={{...fl(8)}}>
            {["quick","normal","deep"].map(d=><button key={d} onClick={()=>setCfg({...cfg,depth:d})} style={{flex:1,padding:"8px",background:cfg.depth===d?AC.violetDim:T.bg3,border:`1px solid ${cfg.depth===d?AC.violet:T.border}`,borderRadius:10,color:cfg.depth===d?AC.violet:T.textSub,fontWeight:cfg.depth===d?700:400,cursor:"pointer",fontFamily:"inherit",fontSize:12,textTransform:"capitalize"}}>{d==="quick"?"⚡ Rapide":d==="normal"?"⚖️ Normal":"🔬 Approfondi"}</button>)}
          </div>
        </Field>
        <Field T={T} label="SECTEUR D'ACTIVITÉ (optionnel)">
          <SI T={T} value={cfg.business_sector||""} onChange={e=>setCfg({...cfg,business_sector:e.target.value})} placeholder="Ex: informatique, e-commerce, médical..."/>
        </Field>
        <Field T={T} label="MOTS-CLÉS PRIORITAIRES (séparés par virgule)">
          <SI T={T} value={(cfg.priority_keywords||[]).join(", ")} onChange={e=>setCfg({...cfg,priority_keywords:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})} placeholder="Ex: urgent, facture, client"/>
        </Field>
        <Field T={T} label="EXPÉDITEURS VIP (séparés par virgule)">
          <SI T={T} value={(cfg.vip_senders||[]).join(", ")} onChange={e=>setCfg({...cfg,vip_senders:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})} placeholder="Ex: patron@entreprise.com"/>
        </Field>
      </div>
      <div style={{...fl(8)}}>
        <Btn T={T} variant="ghost" onClick={test} disabled={testing} style={{padding:"10px 20px"}}>
          {testing?<Spin size={13} color={AC.cyan}/>:<Zap size={13}/>} {testing?"Test...":"Tester le modèle"}
        </Btn>
        <Btn T={T} variant="primary" onClick={save} disabled={saving} style={{flex:1}}>
          {saving?<Spin size={13} color="#fff"/>:<Check size={13}/>} Sauvegarder la configuration
        </Btn>
      </div>
      {testResult&&<div style={{marginTop:12,padding:"12px 16px",background:testResult.ok?AC.greenDim:AC.orangeDim,borderRadius:12,border:`1px solid ${testResult.ok?AC.green:AC.orange}30`,fontSize:12,color:testResult.ok?AC.green:AC.orange}}>
        {testResult.ok?"✓ Modèle actif et fonctionnel":"✗ Erreur: "+(testResult.error||"inconnue")}
      </div>}
    </div>
  </div>
}

// ── Advanced Search Panel ───────────────────────────────────────────────────
function AdvancedSearchPanel({T,onSearch,onClose}) {
  const [form,setForm]=useState({from_addr:"",to_addr:"",subject:"",body_contains:"",date_after:"",date_before:"",has_attachment:false,is_unread:false})
  const [loading,setLoading]=useState(false)
  const search=async()=>{
    setLoading(true)
    try{
      const d=await apiFetch(`${API}/emails/search-advanced`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,max_results:30})}).then(r=>r.json())
      onSearch(d.emails||[],d.query||"")
    }catch(e){console.error(e)}finally{setLoading(false)}
  }
  const u=(k,v)=>setForm(p=>({...p,[k]:v}))
  return <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,margin:"8px 12px"}}>
    <div style={{...fl(0,"space-between","center"),marginBottom:16}}>
      <span style={{fontSize:13,fontWeight:700,...fl(6)}}><Search size={13} color={AC.blue}/> Recherche avancée</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint}}><X size={14}/></button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
      {[["De","from_addr","Ex: boss@gmail.com"],["À","to_addr","Ex: moi@gmail.com"],["Objet","subject","Mots dans le sujet"],["Contient","body_contains","Texte dans le corps"]].map(([label,key,ph])=>
        <div key={key}><div style={{fontSize:10,fontWeight:700,color:T.textFaint,marginBottom:4}}>{label}</div><SI T={T} value={form[key]} onChange={e=>u(key,e.target.value)} placeholder={ph} style={{fontSize:12}}/></div>
      )}
    </div>
    <div style={{...fl(8,undefined,"center"),marginBottom:12,flexWrap:"wrap",gap:12}}>
      {[["has_attachment","📎 Pièce jointe"],["is_unread","● Non lu"]].map(([k,label])=>
        <label key={k} style={{...fl(6),"cursor":"pointer","userSelect":"none",fontSize:12,color:T.textSub}}>
          <input type="checkbox" checked={form[k]} onChange={e=>u(k,e.target.checked)} style={{accentColor:AC.blue}}/>{label}
        </label>
      )}
    </div>
    <Btn T={T} variant="primary" onClick={search} disabled={loading} full>
      {loading?<Spin size={13} color="#fff"/>:<Search size={13}/>} Rechercher
    </Btn>
  </div>
}



// ── CSS globaux injectés au démarrage ────────────────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      /* ═══ Animations ═══ */
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      @keyframes glow { 0%,100%{box-shadow:0 0 12px rgba(99,102,241,0.25)} 50%{box-shadow:0 0 24px rgba(99,102,241,0.5)} }
      @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }

      /* ═══ Scrollbar ═══ */
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.25); border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.55); }
      * { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.25) transparent; }

      /* ═══ Focus accessible ═══ */
      *:focus-visible { outline: 2px solid #6366F1; outline-offset: 2px; border-radius: 4px; }

      /* ═══ Interactions ═══ */
      button, a, [role="button"] { transition: opacity .15s ease, background .15s ease, color .15s ease, border-color .15s ease, transform .1s ease, box-shadow .2s ease; }
      button:not(:disabled):active { transform: scale(0.96); }
      button:disabled { cursor: not-allowed; opacity: 0.45; }

      /* ═══ Cards ═══ */
      .card-hover { transition: transform .18s cubic-bezier(.34,1.3,.64,1), box-shadow .18s ease, border-color .18s ease; }
      .card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(0,0,0,0.35); }

      /* ═══ Email rows ═══ */
      .email-row { animation: fadeIn .18s ease both; transition: background .12s ease, border-color .12s ease, padding-left .15s ease; position: relative; }
      .email-row:hover { padding-left: 22px !important; }
      .email-row::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: linear-gradient(180deg, #6366F1, #3B82F6); transition: width .15s ease; border-radius: 0 3px 3px 0; }
      .email-row:hover::before { width: 3px; }

      /* ═══ Stagger animation pour les listes ═══ */
      .email-row:nth-child(1) { animation-delay: 0ms; }
      .email-row:nth-child(2) { animation-delay: 25ms; }
      .email-row:nth-child(3) { animation-delay: 50ms; }
      .email-row:nth-child(4) { animation-delay: 75ms; }
      .email-row:nth-child(5) { animation-delay: 100ms; }
      .email-row:nth-child(n+6) { animation-delay: 120ms; }

      /* ═══ Sidebar ═══ */
      .sidebar-item { transition: background .12s, color .12s, padding-left .15s; }
      .sidebar-item:hover { padding-left: 18px !important; }

      /* ═══ Inputs ═══ */
      input, textarea, select { transition: border-color .15s ease, box-shadow .2s ease, background .15s ease; }
      input:focus, textarea:focus, select:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.13); border-color: #6366F1 !important; }
      input::placeholder, textarea::placeholder { color: rgba(148,163,184,0.4); }

      /* ═══ Modals ═══ */
      .modal-overlay { animation: fadeIn .15s ease; }
      .modal-content { animation: scaleIn .2s cubic-bezier(.34,1.3,.64,1); }

      /* ═══ Divers ═══ */
      ::selection { background: rgba(99,102,241,0.3); }
      .badge-pulse { animation: pulse 2s infinite; }
      button, .sidebar-item { user-select: none; -webkit-user-select: none; }
      img { max-width: 100%; }

      /* ═══ Réduire le motion si demandé ═══ */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `
    document.head.appendChild(style)
    return () => { try { document.head.removeChild(style) } catch {} }
  }, [])
  return null
}// ── ErrorBoundary — capture les erreurs de rendu React ──────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error("[EmailAI] Render error:", error, info)
  }
  render() {
    if (this.state.hasError) {
      const T = this.props.theme || {}
      return (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:40,background:T.bg||"#080C18",color:T.text||"#E8EDF8"}}>
          <div style={{width:64,height:64,borderRadius:20,background:"#2A0A0A",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:28}}>⚠️</span>
          </div>
          <div style={{textAlign:"center"}}>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:"#EF4444"}}>Erreur de rendu</h3>
            <p style={{fontSize:13,color:T.textSub||"#94A3B8",marginBottom:20}}>
              {this.state.error?.message || "Une erreur inattendue s'est produite"}
            </p>
            <button
              onClick={()=>this.setState({hasError:false,error:null})}
              style={{padding:"10px 24px",background:"#3B82F6",border:"none",borderRadius:10,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
            >
              Réessayer
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthScreen({T}) {
  const [loading,setLoading]=useState(false),[msg,setMsg]=useState("")
  useEffect(()=>{
    if(!loading) return
    const id=setInterval(async()=>{const d=await apiFetch(`${API}/auth/status`).then(r=>r.json()).catch(()=>({}));if(d.authenticated){clearInterval(id);window.location.reload()}},2000)
    return()=>clearInterval(id)
  },[loading])
  return <div style={{height:"100vh",...fl(0,"center","center"),background:T.bg,fontFamily:"'DM Sans',system-ui,sans-serif",position:"relative",overflow:"hidden"}}>
    <GS T={T}/>
    {[["#3B82F6","10%","10%","500px"],["#8B5CF6","70%","60%","600px"],["#06B6D4","80%","20%","400px"]].map(([c,t,l,sz],i)=>(
      <div key={i} style={{position:"absolute",top:t,left:l,width:sz,height:sz,borderRadius:"50%",background:`radial-gradient(circle,${c}15,transparent 60%)`,filter:"blur(60px)",animation:`spin ${20+i*5}s linear infinite`,pointerEvents:"none"}}/>
    ))}
    {/* Card glass */}
    <div style={{position:"relative",zIndex:1,width:"min(480px,92vw)",animation:"popIn .45s cubic-bezier(.34,1.26,.64,1)"}}>
      {/* Glow derrière la card */}
      <div style={{position:"absolute",inset:-40,background:`radial-gradient(ellipse,${AC.blue}18 0%,${AC.violet}10 50%,transparent 70%)`,filter:"blur(40px)",pointerEvents:"none"}}/>
      <div style={{background:T.glassBg,backdropFilter:T.glassBlur,WebkitBackdropFilter:T.glassBlur,border:`1px solid ${T.borderHi}`,borderRadius:28,padding:"52px 56px",textAlign:"center",boxShadow:T.cardShadow,position:"relative",overflow:"hidden"}}>
        {/* Shine top */}
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)`,pointerEvents:"none"}}/>
        {/* Logo animé */}
        <div style={{width:80,height:80,borderRadius:26,margin:"0 auto 28px",background:AC.grad1,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${AC.blueGlow},0 0 0 1px rgba(255,255,255,0.1) inset`,animation:"float 3s ease-in-out infinite"}}>
          <Mail size={36} color="#fff" strokeWidth={1.6}/>
        </div>
        <h1 style={{fontSize:38,fontWeight:900,color:T.text,letterSpacing:"-0.05em",marginBottom:6,lineHeight:1}}>EmailAI</h1>
        <p style={{color:T.textSub,fontSize:14,lineHeight:1.7,marginBottom:6}}>Assistant email intelligent · Gratuit</p>
        <div style={{...fl(6,"center","center"),marginBottom:28}}>
          <span style={{...fl(4),fontSize:12,color:AC.green,fontWeight:700}}><span style={{width:7,height:7,borderRadius:"50%",background:AC.green,animation:"pulse 2s infinite"}}/>Groq LLaMA 3.3 · 100% local</span>
        </div>
        {/* Feature grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:32}}>
          {[["🤖","IA Analyse"],["📬","Auto-reply"],["🏷️","4 Catégories"],["🔍","Filtres"],["📝","Templates"],["📊","Stats"]].map(([ic,l])=>(
            <div key={l} style={{padding:"10px 8px",background:`${T.bg3}`,border:`1px solid ${T.border}`,borderRadius:12,fontSize:11,color:T.textSub,...fl(4,"center","center"),fontWeight:500}}>
              <span style={{fontSize:16}}>{ic}</span>{l}
            </div>
          ))}
        </div>
        <Btn T={T} variant="primary" full onClick={async()=>{setLoading(true);try{await apiFetch(`${API}/auth/login`);setMsg("Connecte-toi dans la fenetre Google !")}catch{setMsg("Erreur: backend sur port 8000 ?");setLoading(false)}}} disabled={loading} style={{fontSize:15,padding:"13px 24px",borderRadius:14,boxShadow:`0 4px 24px ${AC.blueGlow}`}}>
          {loading?<Spin size={18} color="#fff"/>:<Mail size={18}/>} {loading?"En attente de connexion...":"Connecter Gmail"}
        </Btn>
        {msg&&<div style={{marginTop:16,padding:"12px 16px",background:AC.blueDim,color:AC.blue,borderRadius:12,fontSize:12,lineHeight:1.6,...fl(8)}}><Info size={14} style={{flexShrink:0}}/>{msg}</div>}
        <div style={{marginTop:22,fontSize:11,color:T.textFaint,...fl(6,"center","center")}}><Lock size={10}/> 100% local · Aucun serveur tiers · OAuth officiel Google</div>
        {/* Barre de progression si en attente */}
        {loading&&<div style={{marginTop:14,height:2,background:T.bg4,borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",background:AC.grad1,animation:"shimmer 1.5s linear infinite",backgroundSize:"200% 100%"}}/></div>}
      </div>
    </div>
  </div>
}

// ── Email list ─────────────────────────────────────────────────────────────────
function EmailList({T,emails,onSelect,selected,loading,compact,doAction,settings,selectedIds,setSelectedIds}) {
  const [hov,setHov]=useState(null)
  const multi=selectedIds.size>0
  if(loading) return <div style={{flex:1,overflowY:"auto"}}>
    {[...Array(6)].map((_,i)=>(
      <div key={i} style={{padding:"13px 14px",borderBottom:`1px solid ${T.border}`,opacity:1-i*0.12}}>
        <div style={{...fl(10,"flex-start")}}>
          <div style={{width:28,height:28,borderRadius:9,background:T.bg4,flexShrink:0,backgroundImage:`linear-gradient(90deg,${T.bg4} 25%,${T.bg3} 50%,${T.bg4} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s linear infinite"}}/>
          <div style={{flex:1}}>
            <div style={{height:12,width:`${60+i*5}%`,background:T.bg4,borderRadius:6,marginBottom:8,backgroundImage:`linear-gradient(90deg,${T.bg4} 25%,${T.bg3} 50%,${T.bg4} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s linear infinite"}}/>
            <div style={{height:10,width:"40%",background:T.bg4,borderRadius:6,backgroundImage:`linear-gradient(90deg,${T.bg4} 25%,${T.bg3} 50%,${T.bg4} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.4s linear infinite"}}/>
          </div>
        </div>
      </div>
    ))}
  </div>
  if(!emails.length) return <div style={{flex:1,...fl(0,"center","center"),flexDirection:"column",gap:12,padding:40,color:T.textFaint}}>
    <div style={{width:64,height:64,borderRadius:20,background:T.bg3,...fl(0,"center","center")}}><Mail size={28} strokeWidth={1}/></div>
    <span style={{fontSize:13}}>Aucun email</span>
  </div>
  return <div style={{overflowY:"auto",flex:1}}>
    {(emails||[]).map(e=>{
      const sel=selected===e.id,hv=hov===e.id,chk=selectedIds.has(e.id)
      return <div key={e.id} className="email-row" onMouseEnter={()=>setHov(e.id)} onMouseLeave={()=>setHov(null)}
        style={{padding:compact?"9px 14px":"12px 14px",borderBottom:`1px solid ${T.border}`,background:sel?`${AC.blue}10`:chk?`${AC.indigo}08`:hv?T.bg3:"transparent",borderLeft:`3px solid ${sel?AC.blue:chk?AC.indigo:"transparent"}`,cursor:"pointer",position:"relative",transition:"background .1s"}}>
        <div style={{...fl(8,"flex-start")}}>
          <div onClick={ev=>{ev.stopPropagation();setSelectedIds(p=>{const n=new Set(p);n.has(e.id)?n.delete(e.id):n.add(e.id);return n})}} style={{width:16,height:16,flexShrink:0,marginTop:1,opacity:multi||hv?1:0,transition:"opacity .15s",cursor:"pointer"}}>
            {chk?<CheckSquare size={16} color={AC.indigo}/>:<Square size={16} color={T.textFaint}/>}
          </div>
          {/* Avatar expéditeur */}
          <div onClick={()=>onSelect(e.id)} style={{width:34,height:34,borderRadius:11,background:senderColor(e.from),flexShrink:0,...fl(0,"center","center"),fontSize:12,fontWeight:800,color:"#fff",boxShadow:`0 2px 8px ${senderColor(e.from)}40`,userSelect:"none"}}>
            {(e.from.match(/<(.+)>/)?.[1]||e.from)?.[0]?.toUpperCase()||"?"}
          </div>
          <div style={{flex:1,minWidth:0}} onClick={()=>onSelect(e.id)}>
            <div style={{...fl(6),justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontWeight:e.unread?700:400,fontSize:13,color:e.unread?T.text:T.textSub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",...fl(6)}}>
                {e.unread&&<span style={{width:7,height:7,borderRadius:"50%",background:AC.blue,flexShrink:0,boxShadow:`0 0 8px ${AC.blue}`,animation:"pulse 2s infinite"}}/>}
                {e.starred&&<Star size={11} color={AC.gold} fill={AC.gold} style={{flexShrink:0}}/>}
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.subject}</span>
              </span>
              {e.date&&<span style={{flexShrink:0,fontSize:10,color:emailAgeColor(e.date,T)||T.textFaint,fontWeight:emailAgeColor(e.date,T)?"700":"400",marginLeft:6}}>{relativeDate(e.date)}</span>}
            </div>
            <div style={{fontSize:11,...fl(6),marginBottom:compact?0:2}}>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,color:T.textFaint}}>{e.from.replace(/<.*>/,"").trim()||e.from}</span>
              {e.main_category&&<CatBadge cat={e.main_category}/>}
            </div>
            {!compact&&settings?.showPreview&&e.summary&&<div style={{fontSize:11,color:T.textFaint,marginTop:3,lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",letterSpacing:"0.01em"}}>{e.summary}</div>}
            {e.is_phishing&&<div style={{...fl(4),marginTop:4,fontSize:10,color:AC.red,fontWeight:700}}><AlertTriangle size={9}/> Phishing détecté</div>}
          </div>
        </div>
        {hv&&!multi&&<div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",...fl(3),background:T.bg2,borderRadius:9,padding:4,border:`1px solid ${T.border}`,boxShadow:T.cardShadow,zIndex:2}}>
          <IAB T={T} Icon={e.starred?StarOff:Star} title="Favori" onClick={ev=>{ev.stopPropagation();doAction(e.id,e.starred?"unstar":"star")}}/>
          <IAB T={T} Icon={Archive} title="Archiver" onClick={ev=>{ev.stopPropagation();doAction(e.id,"archive")}}/>
          <IAB T={T} Icon={Trash2} title="Supprimer" danger onClick={ev=>{ev.stopPropagation();doAction(e.id,"trash")}}/>
        </div>}
      </div>
    })}
  </div>
}

// ── Email detail ───────────────────────────────────────────────────────────────
function EmailDetail({T,emailId,settings,profile,doAction,showToast,emailMeta}) {
  const [email,setEmail]=useState(null)
  const [analysis,setAnalysis]=useState(null)
  const [loading,setLoading]=useState(false)
  const [anaLoad,setAnaLoad]=useState(false)
  const [showDraft,setShowDraft]=useState(false)
  const [translated,setTranslated]=useState(null)
  const [transLoad,setTransLoad]=useState(false)
  const [manualCat,setManualCat]=useState(null)
  const [classifying,setClassifying]=useState(false)
  const [collapsed,setCollapsed]=useState(false)

  const analyze=useCallback(async()=>{
    if(!settings.enabled){showToast("IA desactivee dans les reglages","err");return}
    setAnaLoad(true)
    try{
        const rr=await fetchWithTimeout(`${API}/emails/${emailId}/summary`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({settings,profile})},45000)
      const d=await rr.json()
      setAnalysis(d);if(d.main_category)setManualCat(d.main_category)
      // Enregistrer sentiment pour les tendances
      if(d.sentiment){
        apiFetch(`${API}/stats/sentiment-record?email_id=${emailId}&sentiment=${encodeURIComponent(d.sentiment)}`,{method:"POST"}).catch(()=>{})
      }
    }catch(e){
      console.error(e)
      const msg=e.message||"Erreur inconnue"
      if(msg.includes("Timeout"))showToast("Groq trop lent - reessaie dans 1 min","err")
      else if(msg.includes("429"))showToast("Limite API atteinte - attends 1 min","err")
      else showToast("Erreur analyse: "+msg.slice(0,50),"err")
    }finally{setAnaLoad(false)}
  },[emailId,settings,profile])

  useEffect(()=>{
    if(!emailId) return
    setEmail(null);setAnalysis(null);setShowDraft(false);setTranslated(null)
    setManualCat(emailMeta?.main_category||null);setCollapsed(false)
    setLoading(true)
    apiFetch(`${API}/emails/${emailId}`).then(r=>r.json()).then(d=>{setEmail(d);if(settings.autoAnalyze&&settings.enabled)analyze()}).catch(console.error).finally(()=>setLoading(false))
  },[emailId])

  const exportEmail=async()=>{
    try{
      const d=await apiFetch(`${API}/emails/${emailId}/export`).then(r=>r.json())
      const blob=new Blob([d.text],{type:"text/plain"})
      const url=URL.createObjectURL(blob)
      const a=document.createElement("a"); a.href=url; a.download=d.filename||"email.txt"; a.click()
      URL.revokeObjectURL(url)
      showToast("Email exporte !")
    }catch{showToast("Erreur export","err")}
  }

  const translate=async()=>{
    setTransLoad(true)
    try{const d=await apiFetch(`${API}/translate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:email.body||email.snippet,target_lang:settings.language==="auto"?"fr":settings.language})}).then(r=>r.json());setTranslated(d.translation)}
    catch{showToast("Erreur traduction","err")}finally{setTransLoad(false)}
  }
  const classifyManual=async(cat)=>{
    setClassifying(true)
    try{await apiFetch(`${API}/emails/classify`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email_id:emailId,category:cat})});setManualCat(cat);showToast(`Classe: ${cat}`)}
    catch{showToast("Erreur","err")}finally{setClassifying(false)}
  }

  if(!emailId) return <div style={{flex:1,...fl(0,"center","center"),flexDirection:"column",gap:16,color:T.textFaint}}>
    <div style={{width:80,height:80,borderRadius:24,background:T.bg3,...fl(0,"center","center")}}><Mail size={36} strokeWidth={1}/></div>
    <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:600,color:T.textSub,marginBottom:4}}>Selectionne un email</div><div style={{fontSize:12,color:T.textFaint}}>Clique sur un email dans la liste</div></div>
  </div>
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  if(!email) return null

  const fromInitial=(email.from.match(/<(.+)>/)?.[1]||email.from)?.[0]?.toUpperCase()||"?"

  return <div style={{flex:1,overflowY:"auto",color:T.text,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"16px 24px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bg,zIndex:5,backdropFilter:"blur(12px)"}}>
      <div style={{...fl(8),justifyContent:"space-between",marginBottom:8}}>
        <h2 style={{fontSize:18,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.3,flex:1}}>{email.subject}</h2>
        <ReplyNeededBadge T={T} emailId={emailId}/>
      </div>
      <div style={{...fl(10),marginBottom:12,flexWrap:"wrap"}}>
        <div style={{...fl(8)}}>
          <div style={{width:36,height:36,borderRadius:11,background:senderColor(email.from),...fl(0,"center","center"),fontSize:13,fontWeight:800,color:"#fff",flexShrink:0,boxShadow:`0 2px 8px ${senderColor(email.from)}50`}}>{fromInitial}</div>
          <div><div style={{fontSize:12,fontWeight:700}}>{email.from.replace(/<.*>/,"").trim()||email.from}</div><div style={{fontSize:11,color:T.textFaint}}>{email.date}</div></div>
        </div>
        <div style={{...fl(6),marginLeft:"auto"}}>
          {manualCat&&<CatBadge cat={manualCat}/>}
          {analysis?.priority&&<Pill label={analysis.priority} color={PRI[analysis.priority]||"#64748B"}/>}
          {analysis?.sentiment&&<Pill label={analysis.sentiment} color={SENT_C[analysis.sentiment]||"#64748B"}/>}
        </div>
      </div>
      <div style={{...fl(6),flexWrap:"wrap"}}>
        {/* Zen mode + font size */}
        <div style={{...fl(4),marginLeft:"auto",paddingBottom:8}}>
          <button onClick={()=>setFontSize(p=>Math.min(p+1,20))} title="Agrandir texte" style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border}`,background:T.bg3,color:T.textSub,cursor:"pointer",fontSize:13,fontWeight:700}}>A+</button>
          <button onClick={()=>setFontSize(p=>Math.max(p-1,11))} title="Réduire texte" style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border}`,background:T.bg3,color:T.textSub,cursor:"pointer",fontSize:10,fontWeight:700}}>A-</button>
          <button onClick={()=>setZenMode(p=>!p)} title="Mode Zen (Z)" style={{...fl(4),width:28,height:28,borderRadius:7,border:`1px solid ${zenMode?AC.violet:T.border}`,background:zenMode?AC.violetDim:T.bg3,color:zenMode?AC.violet:T.textSub,cursor:"pointer",fontSize:10,fontWeight:700}}>
            {zenMode?"✕":"🧘"}
          </button>
        </div>
        {[
          {Icon:Bookmark,label:"Sauver en template",fn:async()=>{const name=prompt("Nom du modèle ?","Modèle");if(!name)return;await apiFetch(`${API}/emails/${emailId}/save-template?template_name=${encodeURIComponent(name)}`,{method:"POST"});showToast("Modèle sauvegardé !")}},
          {Icon:emailMeta?.pinned?Pin:Pin,label:emailMeta?.pinned?"Désépingler":"Épingler",fn:async()=>{await apiFetch(`${API}/emails/${emailId}/pin`,{method:"POST"});showToast(emailMeta?.pinned?"Désépinglé":"Épinglé !")}},
          {Icon:emailMeta?.starred?StarOff:Star,label:emailMeta?.starred?"Retirer":"Favori",fn:()=>doAction(emailId,emailMeta?.starred?"unstar":"star")},
          {Icon:Archive,label:"Archiver",fn:()=>doAction(emailId,"archive")},
          {Icon:MailOpen,label:"Non lu",fn:()=>doAction(emailId,"unread")},
          {Icon:transLoad?Loader2:Languages,label:transLoad?"...":"Traduire",fn:translate},
          {Icon:Copy,label:"Copier",fn:()=>{navigator.clipboard.writeText(email.body||"");showToast("Copie !")}},
          {Icon:Download,label:"Exporter",fn:exportEmail},
          {Icon:Trash2,label:"Supprimer",danger:true,fn:()=>doAction(emailId,"trash")}
        ].map(({Icon,label,fn,danger})=>(
          <button key={label} onClick={fn} style={{...fl(5),padding:"6px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",border:`1px solid ${T.border}`,background:T.bg3,color:danger?AC.red:T.textSub,fontFamily:"inherit",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderHi;e.currentTarget.style.background=T.bg4}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.bg3}}><Icon size={12}/> {label}</button>
        ))}
        <div style={{marginLeft:"auto",...fl(4)}}>
          {MAIN_CATS.map(cat=><button key={cat} onClick={()=>classifyManual(cat)} disabled={classifying} title={CAT_META[cat].desc} style={{padding:"4px 9px",fontSize:10,borderRadius:16,border:`1px solid ${manualCat===cat?CAT_META[cat].color+"40":T.border}`,background:manualCat===cat?CAT_META[cat].bg:"transparent",color:manualCat===cat?CAT_META[cat].color:T.textFaint,cursor:"pointer",fontFamily:"inherit"}}>{CAT_META[cat].icon}</button>)}
        </div>
      </div>
    </div>

    <div style={{padding:"20px 28px",flex:1}}>
      {analysis?(
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:20,animation:"fadeIn .3s"}}>
          <div style={{...fl(8),marginBottom:collapsed?0:14}}>
            <div style={{width:28,height:28,borderRadius:8,background:AC.indigoDim,...fl(0,"center","center")}}><Sparkles size={14} color={AC.indigo}/></div>
            <span style={{fontSize:12,fontWeight:800,color:AC.indigo,letterSpacing:"0.06em",flex:1}}>ANALYSE IA</span>
            <button onClick={()=>setCollapsed(!collapsed)} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><ChevronDown size={16} style={{transform:collapsed?"rotate(-90deg)":"rotate(0)",transition:"transform .2s"}}/></button>
          </div>
          {!collapsed&&<>
            {settings.showSecurityDetails&&<SecBar sec={analysis.security} T={T}/>}
            {analysis.is_phishing&&<div style={{...fl(10),padding:"11px 14px",background:AC.redDim,border:`1px solid ${AC.red}25`,borderRadius:12,marginBottom:12}}><AlertTriangle size={15} color={AC.red} style={{flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:700,color:AC.red}}>Email suspect / Phishing</div>{analysis.phishing_reason&&<div style={{fontSize:11,color:T.textSub,marginTop:2}}>{analysis.phishing_reason}</div>}</div></div>}
            <div style={{...fl(8),flexWrap:"wrap",marginBottom:14}}>
              {analysis.category&&<Chip label={analysis.category} T={T}/>}
              {analysis.priority&&<Pill label={analysis.priority} color={PRI[analysis.priority]||"#64748B"}/>}
              {analysis.sentiment&&<Pill label={analysis.sentiment} color={SENT_C[analysis.sentiment]||"#64748B"}/>}
              {analysis.main_category&&<CatBadge cat={analysis.main_category}/>}
              {analysis.is_vip&&<Pill label="★ VIP" color={AC.gold}/>}
              {analysis.risk_level&&analysis.risk_level!=="Aucun"&&<Pill label={`⚠ ${analysis.risk_level}`} color={AC.red}/>}
              {analysis.analysis_depth&&<span style={{fontSize:10,color:T.textFaint,padding:"2px 8px",background:T.bg4,borderRadius:10}}>{{"quick":"⚡ Rapide","normal":"⚖️ Normal","deep":"🔬 Approfondi"}[analysis.analysis_depth]||""}</span>}
            </div>
            {analysis.matched_keywords?.length>0&&<div style={{...fl(6),flexWrap:"wrap",marginBottom:10}}>
              {analysis.matched_keywords.map(k=><span key={k} style={{padding:"2px 8px",background:AC.redDim,color:AC.red,borderRadius:10,fontSize:10,fontWeight:600}}>🔴 {k}</span>)}
            </div>}
            {analysis.deadline&&<div style={{...fl(6),padding:"8px 12px",background:AC.orangeDim,borderRadius:10,marginBottom:10,fontSize:12,color:AC.orange}}>
              <Clock size={12}/> Deadline: <strong>{analysis.deadline}</strong>
            </div>}
            {analysis.estimated_response_time&&analysis.estimated_response_time!=="pas urgent"&&<div style={{...fl(6),fontSize:11,color:T.textFaint,marginBottom:8}}>
              <Clock size={11}/> Réponse suggérée: {analysis.estimated_response_time}
            </div>}
            <p style={{fontSize:14,lineHeight:1.75,color:T.text,marginBottom:14}}>{analysis.summary}</p>
            {analysis.key_info&&<div style={{padding:"12px 14px",background:AC.blueDim,borderRadius:10,fontSize:12,color:T.textSub,lineHeight:1.65,marginBottom:12}}>
              <div style={{...fl(6),fontWeight:700,color:AC.blue,marginBottom:6}}><Info size={12}/> Points cles</div>{analysis.key_info}
            </div>}
            {analysis.tasks?.length>0&&<div style={{padding:"12px 14px",background:AC.violetDim,borderRadius:10,marginBottom:12}}>
              <div style={{...fl(6),fontWeight:700,color:AC.violet,marginBottom:8,fontSize:12}}><ListChecks size={13}/> Taches</div>
              {analysis.tasks.map((t,i)=><div key={i} style={{...fl(8),fontSize:12,color:T.textSub,marginBottom:4}}><div style={{width:18,height:18,borderRadius:6,border:`1.5px solid ${AC.violet}`,flexShrink:0,...fl(0,"center","center")}}><Check size={10} color={AC.violet}/></div>{t}</div>)}
            </div>}
            {analysis.action&&<div style={{fontSize:12,color:T.textSub,...fl(6)}}><ChevronRight size={13} color={AC.green}/>{analysis.action}</div>}
            {analysis.secondary_actions?.length>0&&<div style={{...fl(6),flexWrap:"wrap",marginTop:4}}>
              {analysis.secondary_actions.map((a,i)=><span key={i} style={{fontSize:11,color:T.textFaint,...fl(4)}}><ChevronRight size={10} color={T.textFaint}/>{a}</span>)}
            </div>}
            {analysis.tone_analysis&&<div style={{fontSize:11,color:T.textFaint,marginTop:6,...fl(5)}}><span style={{fontWeight:600,color:T.textSub}}>Ton expéditeur:</span> {analysis.tone_analysis}</div>}
            {analysis.keywords?.length>0&&<div style={{...fl(6),flexWrap:"wrap",marginTop:6}}>
              {analysis.keywords.slice(0,6).map(k=><span key={k} style={{padding:"2px 8px",background:T.bg3,borderRadius:10,fontSize:10,color:T.textFaint}}>#{k}</span>)}
            </div>}
          </>}
        </div>
      ):(
        <Btn T={T} variant="primary" onClick={analyze} disabled={anaLoad||!settings.enabled} style={{marginBottom:20}}>
          {anaLoad?<Spin size={14} color="#fff"/>:<Sparkles size={14}/>} {anaLoad?"Analyse...":settings.enabled?"Analyser avec l'IA":"IA desactivee"}
        </Btn>
      )}

      {translated&&<div style={{background:AC.greenDim,border:`1px solid ${AC.green}25`,borderRadius:14,padding:18,marginBottom:16,animation:"fadeIn .3s"}}>
        <div style={{...fl(8),marginBottom:10}}><Languages size={13} color={AC.green}/><span style={{fontSize:11,fontWeight:800,color:AC.green,letterSpacing:"0.06em",flex:1}}>TRADUCTION</span><button onClick={()=>setTranslated(null)} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><X size={14}/></button></div>
        <div style={{fontSize:14,lineHeight:1.8,color:T.text,whiteSpace:"pre-wrap"}}>{translated}</div>
      </div>}

      {/* Infos email : temps de lecture + date relative */}
      <div style={{...fl(12,"center"),marginBottom:10,fontSize:11,color:T.textFaint}}>
        <span>{email.body ? `${Math.ceil(email.body.split(/\s+/).length/200)} min de lecture` : ""}</span>
        {email.body?.length>0 && <span>· {email.body.length.toLocaleString()} caracteres</span>}
      </div>
      <SmartReplies T={T} emailId={emailId} onSelect={txt=>{setShowDraft("quick");}} showToast={showToast}/>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 24px",marginBottom:18,lineHeight:1.9,fontSize:14,color:T.bodyText,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{email.body||email.snippet}</div>

      {!showDraft&&<div style={{...fl(8),flexWrap:"wrap"}}>
        <Btn T={T} variant="secondary" onClick={()=>setShowDraft("ai")}><Reply size={14} color={AC.blue}/> Repondre avec l'IA</Btn>
        <Btn T={T} variant="ghost" onClick={()=>setShowDraft("quick")}><Reply size={14}/> Reponse rapide</Btn>
        {analysis&&<Btn T={T} variant="ghost" onClick={analyze} disabled={anaLoad}>{anaLoad?<Spin size={13}/>:<RefreshCw size={13}/>} Re-analyser</Btn>}
      </div>}
      {emailId&&<SmartReplies T={T} emailId={emailId} onSelect={(txt)=>{setShowDraft("reply")}}/> }
      {showDraft==="ai"&&<DraftPanel T={T} emailId={emailId} settings={settings} profile={profile} showToast={showToast} onClose={()=>setShowDraft(false)}/>}
      {showDraft==="quick"&&<QuickReplyPanel T={T} email={email} showToast={showToast} onClose={()=>setShowDraft(false)}/>}
    </div>
  </div>
}

// ── Draft panel ────────────────────────────────────────────────────────────────
function DraftPanel({T,emailId,settings,profile,onClose,showToast}) {
  const [instr,setInstr]=useState(""),[tone,setTone]=useState("auto")
  const [draft,setDraft]=useState(null),[meta,setMeta]=useState(null)
  const [loading,setLoading]=useState(false),[sending,setSending]=useState(false)
  const [edited,setEdited]=useState(""),[err,setErr]=useState(null)
  const [variants,setVariants]=useState(null),[varLoad,setVarLoad]=useState(false)
  const TONES=[["auto","Auto"],["formal","Formel"],["friendly","Amical"],["firm","Ferme"],["concise","Concis"],["detailed","Detaille"]]
  const QUICK=["Accepte la proposition","Decline poliment","Demande plus d'infos","Confirme reception","Propose un rdv","Remercie"]

  const gen=async()=>{
    if(!instr.trim()||!settings.enabled) return;setLoading(true);setErr(null);setDraft(null);setVariants(null)
    try{const r=await apiFetch(`${API}/emails/${emailId}/draft-reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email_id:emailId,instruction:instr,tone,settings,profile})});const d=await r.json();if(!r.ok)throw new Error(d.detail||"Erreur");setDraft(d.draft);setEdited(d.draft);setMeta(d)}
    catch(e){setErr(e.message)}finally{setLoading(false)}
  }
  const genVar=async()=>{
    if(!instr.trim()) return;setVarLoad(true);setErr(null)
    try{const r=await apiFetch(`${API}/emails/${emailId}/variants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email_id:emailId,instruction:instr,settings,profile})});const d=await r.json();if(!r.ok)throw new Error(d.detail);setVariants(d);setMeta({to:d.to,subject:d.subject})}
    catch(e){setErr(e.message)}finally{setVarLoad(false)}
  }
  const sendIt=async()=>{
    if(!window.confirm("Envoyer cet email ?")) return;setSending(true)
    try{const r=await apiFetch(`${API}/emails/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:meta.to,subject:meta.subject,body:edited})});const d=await r.json();if(!r.ok)throw new Error(d.detail);showToast("Email envoye !");try{SoundFX.play("send")}catch(ex){}onClose()}
    catch(e){setErr(e.message)}finally{setSending(false)}
  }
  const saveDraft=async()=>{
    if(!meta) return showToast("Genere d'abord un brouillon","err")
    try{await apiFetch(`${API}/emails/save-draft`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:meta.to,subject:meta.subject,body:edited})});showToast("Brouillon sauvegarde !")}
    catch{showToast("Erreur","err")}
  }
  const pct=Math.round(edited.length/settings.maxDraftLength*100)
  const [grammarResult,setGrammarResult]=useState(null)
  const [grammarLoad,setGrammarLoad]=useState(false)
  const checkGrammar=async()=>{
    if(!edited.trim()) return
    setGrammarLoad(true)
    try{const d=await apiFetch(`${API}/grammar/check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:edited,language:settings.language==="auto"?"fr":settings.language||"fr"})}).then(r=>r.json());setGrammarResult(d)}
    catch{setGrammarResult(null)}finally{setGrammarLoad(false)}
  }

  return <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginTop:12,animation:"fadeIn .3s"}}>
    <div style={{...fl(8),marginBottom:14}}><div style={{width:28,height:28,borderRadius:8,background:AC.blueDim,...fl(0,"center","center")}}><Reply size={14} color={AC.blue}/></div><span style={{fontSize:13,fontWeight:700,flex:1}}>Repondre avec l'IA</span><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><X size={16}/></button></div>
    <div style={{...fl(5),flexWrap:"wrap",marginBottom:10}}>
      {TONES.map(([v,l])=><button key={v} onClick={()=>setTone(v)} style={{padding:"4px 11px",fontSize:11,fontWeight:600,background:tone===v?AC.blueDim:T.bg3,border:`1px solid ${tone===v?AC.blue+"40":T.border}`,borderRadius:20,cursor:"pointer",color:tone===v?AC.blue:T.textFaint,fontFamily:"inherit"}}>{l}</button>)}
    </div>
    <div style={{...fl(5),flexWrap:"wrap",marginBottom:12}}>
      {QUICK.map(s=><button key={s} onClick={()=>setInstr(s)} style={{padding:"3px 10px",fontSize:11,background:instr===s?AC.indigoDim:T.bg3,border:`1px solid ${instr===s?AC.indigo+"40":T.border}`,borderRadius:20,cursor:"pointer",color:instr===s?AC.indigo:T.textFaint,fontFamily:"inherit"}}>{s}</button>)}
    </div>
    <div style={{...fl(8),marginBottom:8}}>
      <SI T={T} value={instr} onChange={e=>setInstr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&gen()} placeholder="Instruction personnalisee..."/>
      <Btn T={T} variant="primary" onClick={gen} disabled={loading||!instr.trim()||!settings.enabled} style={{flexShrink:0}}>
        {loading?<Spin size={14} color="#fff"/>:<Sparkles size={14}/>} {loading?"...":"Generer"}
      </Btn>
    </div>
    <button onClick={genVar} disabled={varLoad||!instr.trim()} style={{background:"none",border:"none",color:AC.violet,fontSize:11,cursor:"pointer",...fl(5),fontFamily:"inherit",marginBottom:14,opacity:varLoad||!instr.trim()?.5:1}}>
      {varLoad?<Spin size={11} color={AC.violet}/>:<Copy size={11}/>} 3 variantes
    </button>
    {err&&<div style={{padding:"10px 14px",background:AC.redDim,color:AC.red,borderRadius:10,fontSize:12,marginBottom:12,...fl(8)}}><AlertCircle size={13}/>{err}</div>}
    {variants&&<div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
      {Object.entries(variants.variants).map(([k,v])=>(
        <div key={k} style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
          <div style={{...fl(8),justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:AC.violet}}>{v.label}</span><button onClick={()=>{setDraft(v.text);setEdited(v.text);setVariants(null)}} style={{fontSize:11,color:AC.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Utiliser</button></div>
          <div style={{fontSize:12,color:T.textSub,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{v.text}</div>
        </div>
      ))}
    </div>}
    {draft&&<>
      {meta?.word_filter?.triggered&&<div style={{padding:"10px 14px",background:AC.violetDim,border:`1px solid ${AC.violet}25`,borderRadius:10,fontSize:12,marginBottom:12}}>
        <div style={{fontWeight:700,color:AC.violet,marginBottom:6,...fl(6)}}><Zap size={12}/> Filtre mots ({meta.word_filter.attempts} regen.)</div>
        <div style={{color:T.textSub,...fl(6),flexWrap:"wrap"}}>Filtres: {meta.word_filter.words_found.map(w=><span key={w} style={{padding:"1px 8px",background:AC.violet+"25",color:AC.violet,borderRadius:10,fontSize:11,fontWeight:600}}>{w}</span>)}</div>
        {meta.word_filter.words_remaining?.length>0&&<div style={{color:AC.orange,marginTop:6,fontSize:11,...fl(5)}}><AlertTriangle size={11}/> Non supprimes: {meta.word_filter.words_remaining.join(", ")}</div>}
      </div>}
      {meta?.security&&<SecBar sec={meta.security} T={T}/>}
      <div style={{...fl(8,"center"),marginBottom:8}}>
        <div style={{flex:1,height:4,background:T.bg4,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:pct>90?AC.red:pct>70?AC.orange:AC.blue,borderRadius:2,transition:"width .3s"}}/></div>
        <span style={{fontSize:10,color:pct>90?AC.red:T.textFaint,fontWeight:600,minWidth:60,textAlign:"right"}}>{edited.length}/{settings.maxDraftLength}</span>
      </div>
      <textarea value={edited} onChange={e=>setEdited(e.target.value)} style={{width:"100%",minHeight:180,padding:"14px 16px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:12,fontSize:13,lineHeight:1.75,resize:"vertical",outline:"none",boxSizing:"border-box",color:T.text,fontFamily:"inherit",marginBottom:10}} onFocus={e=>e.target.style.borderColor=T.borderFocus} onBlur={e=>e.target.style.borderColor=T.border}/>
        <ToneBar T={T} text={body}/>
      {grammarResult&&grammarResult.errors?.length>0&&<div style={{padding:"10px 14px",background:T.bg3,borderRadius:10,marginBottom:10}}>
        <div style={{...fl(6),fontWeight:600,color:AC.orange,marginBottom:6,fontSize:12}}><ShieldCheck size={12}/> {grammarResult.errors.length} suggestion{grammarResult.errors.length>1?"s":""} de correction</div>
        {grammarResult.errors.slice(0,3).map((e,i)=><div key={i} style={{fontSize:11,color:T.textSub,marginBottom:3}}>• "{e.text}" → {e.correction} <span style={{color:T.textFaint}}>({e.type})</span></div>)}
      </div>}
      <div style={{...fl(8),flexWrap:"wrap"}}>
        <Btn T={T} variant="ghost" onClick={gen} style={{fontSize:11,padding:"6px 12px"}}><RefreshCw size={11}/> Regen.</Btn>
        <Btn T={T} variant="ghost" onClick={saveDraft} style={{fontSize:11,padding:"6px 12px"}}><Save size={11}/> Gmail</Btn>
        <Btn T={T} variant="ghost" onClick={checkGrammar} disabled={grammarLoad} style={{fontSize:11,padding:"6px 12px"}}>
          {grammarLoad?<Spin size={11}/>:<ShieldCheck size={11}/>} Grammaire
        </Btn>
        <div style={{flex:1}}/>
        <Btn T={T} variant="primary" onClick={sendIt} disabled={sending} style={{padding:"9px 20px"}}>
          {sending?<Spin size={14} color="#fff"/>:<Send size={14}/>} {sending?"Envoi...":"Envoyer"}
        </Btn>
      </div>
    </>}
  </div>
}

// ── Compose ────────────────────────────────────────────────────────────────────
function ComposeView({T,settings,profile,showToast}) {
  const [to,setTo]=useState(""),[instr,setInstr]=useState(""),[tone,setTone]=useState("auto")
  const [subject,setSubject]=useState(""),[body,setBody]=useState("")
  const [loading,setLoading]=useState(false),[sending,setSending]=useState(false)
  const TONES=[["auto","Auto"],["formal","Formel"],["friendly","Amical"],["firm","Ferme"],["concise","Concis"]]
  const gen=async()=>{if(!instr.trim()) return;setLoading(true);try{const r=await apiFetch(`${API}/compose`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({instruction:instr,recipient:to,tone,settings,profile})});const d=await r.json();if(!r.ok)throw new Error(d.detail);setSubject(d.subject||"");setBody(d.body||"")}catch(e){showToast("Erreur: "+e.message,"err")}finally{setLoading(false)}}
  const send=async()=>{
    if(!to.trim()) return showToast("Destinataire manquant","err")
    if(!to.includes('@')||!to.includes('.')||to.trim().length<5) return showToast("Adresse email invalide","err")
    if(!subject.trim()) return showToast("Objet manquant","err")
    if(!window.confirm("Envoyer cet email ?")) return
    setSending(true);try{const r=await apiFetch(`${API}/emails/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,subject,body})});const d=await r.json();if(!r.ok)throw new Error(d.detail);showToast("Email envoye !");setTo("");setInstr("");setSubject("");setBody("")}catch(e){showToast("Erreur: "+e.message,"err")}finally{setSending(false)}}
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:32}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad2,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.cyanGlow}`}}><PenLine size={22} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1}}>Nouvel email</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Décris ton message en langage naturel, l'IA rédige</p></div>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <Field T={T} label="DESTINATAIRE"><SI T={T} value={to} onChange={e=>setTo(e.target.value)} placeholder="email@exemple.com" icon={Mail}/></Field>
        <Field T={T} label="CE QUE TU VEUX DIRE"><TA T={T} value={instr} onChange={e=>setInstr(e.target.value)} placeholder="Demande un devis, propose une reunion, donne une mise a jour..." rows={3}/></Field>
        <div style={{...fl(6),flexWrap:"wrap",marginBottom:20}}>{TONES.map(([v,l])=><button key={v} onClick={()=>setTone(v)} style={{padding:"5px 13px",fontSize:12,fontWeight:600,background:tone===v?AC.blueDim:T.bg3,border:`1px solid ${tone===v?AC.blue+"40":T.border}`,borderRadius:20,cursor:"pointer",color:tone===v?AC.blue:T.textSub,fontFamily:"inherit"}}>{l}</button>)}</div>
        <Btn T={T} variant="primary" onClick={gen} disabled={loading||!instr.trim()}>{loading?<Spin size={14} color="#fff"/>:<Sparkles size={14}/>} {loading?"Redaction...":"Rediger avec l'IA"}</Btn>
      </div>
      {(subject||body)&&<div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,animation:"fadeIn .3s"}}>
        <div style={{...fl(8),marginBottom:16}}><div style={{width:28,height:28,borderRadius:8,background:AC.greenDim,...fl(0,"center","center")}}><Check size={14} color={AC.green}/></div><span style={{fontSize:13,fontWeight:700,color:AC.green}}>Email genere</span></div>
        <Field T={T} label="OBJET">
          <div style={{...fl(8)}}>
            <SI T={T} value={subject} onChange={e=>setSubject(e.target.value)}/>
            <button title="Suggerer un objet avec l'IA" onClick={async()=>{if(!body.trim()) return;const d=await apiFetch(`${API}/suggest/subject`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body,language:settings.language||"fr"})}).then(r=>r.json()).catch(()=>({}));if(d.subjects?.length>0)setSubject(d.subjects[0])}} style={{padding:"8px 12px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,cursor:"pointer",color:T.textSub,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>
              <Sparkles size={12}/>
            </button>
          </div>
        </Field>
        <Field T={T} label="MESSAGE"><TA T={T} value={body} onChange={e=>setBody(e.target.value)} rows={10}/></Field>
        <div style={{...fl(8)}}><Btn T={T} variant="primary" onClick={send} disabled={sending} style={{padding:"11px 24px"}}>{sending?<Spin size={14} color="#fff"/>:<Send size={14}/>} {sending?"Envoi...":"Envoyer"}</Btn><Btn T={T} variant="ghost" onClick={gen}><RefreshCw size={13}/> Regenerer</Btn></div>
      </div>}
    </div>
  </div>
}

// ── Templates ──────────────────────────────────────────────────────────────────
function TemplatesView({T,showToast}) {
  const [templates,setTemplates]=useState(()=>ld("emailai_templates",[]))
  const [form,setForm]=useState({name:"",subject:"",body:"",category:"Client",tags:""})
  const [editIdx,setEditIdx]=useState(null),[srch,setSrch]=useState("")
  const svt=(t)=>{setTemplates(t);sv("emailai_templates",t)}
  const saveT=()=>{
    if(!form.name.trim()||!form.body.trim()) return showToast("Nom et corps requis","err")
    const t={...form,id:Date.now(),tags:form.tags.split(",").map(x=>x.trim()).filter(Boolean),updatedAt:new Date().toISOString()}
    if(editIdx!==null){const n=[...templates];n[editIdx]=t;svt(n)}else svt([...templates,t])
    setForm({name:"",subject:"",body:"",category:"Client",tags:""});setEditIdx(null);showToast("Template sauvegarde !")
  }
  const CAT_COLORS={"Client":AC.cyan,"Personnel":AC.blue,"Commercial":AC.violet,"Juridique":AC.orange,"Support":AC.green,"Autre":"#94A3B8"}
  const filtered=templates.filter(t=>!srch||t.name.toLowerCase().includes(srch.toLowerCase()))
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad3,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.greenGlow}`}}><FileText size={22} color="#fff"/></div>
        <div style={{flex:1}}><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Templates</h2><p style={{color:T.textSub,fontSize:13}}>Modeles de reponses reusables</p></div>
        <SI T={T} value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Rechercher..." icon={Search} style={{width:200,flex:"none"}}/>
      </div>
      <div style={{...grd("1fr 1fr",20)}}>
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
          <div style={{...fl(8),marginBottom:18}}><span style={{fontSize:14,fontWeight:700}}>{editIdx!==null?"Modifier":"Nouveau template"}</span>{editIdx!==null&&<button onClick={()=>{setEditIdx(null);setForm({name:"",subject:"",body:"",category:"Client",tags:""})}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><X size={15}/></button>}</div>
          <Field T={T} label="NOM"><SI T={T} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Ex: Reponse devis"/></Field>
          <Field T={T} label="CATEGORIE"><Sel T={T} value={form.category} onChange={v=>setForm(p=>({...p,category:v}))} options={["Client","Personnel","Commercial","Juridique","Support","Autre"].map(c=>[c,c])}/></Field>
          <Field T={T} label="OBJET (optionnel)"><SI T={T} value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="Objet de l'email"/></Field>
          <Field T={T} label="CORPS"><TA T={T} value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Corps du template... Utilise {NOM}, {ENTREPRISE} comme variables" rows={6}/></Field>
          <Field T={T} label="TAGS"><SI T={T} value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="devis, client, pro"/></Field>
          <Btn T={T} variant="primary" onClick={saveT} full>{editIdx!==null?<><Check size={14}/> Modifier</>:<><Plus size={14}/> Sauvegarder</>}</Btn>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length===0&&<div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center",color:T.textFaint}}><FileText size={32} style={{margin:"0 auto 12px",display:"block",opacity:.3}}/>{srch?"Aucun resultat":"Aucun template"}</div>}
          {filtered.map((t,i)=><div key={t.id||i} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,padding:16}}>
            <div style={{...fl(8),marginBottom:8}}>
              <Pill label={t.category||"Autre"} color={CAT_COLORS[t.category]||"#94A3B8"}/>
              <span style={{fontSize:14,fontWeight:700,flex:1,marginLeft:6}}>{t.name}</span>
              <div style={{...fl(4)}}><IAB T={T} Icon={Copy} title="Copier (avec variables)" onClick={()=>{
  const vars={"{NOM}":"[Nom]","{PRÉNOM}":"[Prénom]","{PRENOM}":"[Prénom]","{ENTREPRISE}":"[Entreprise]","{EMAIL}":"[Email]","{DATE}":new Date().toLocaleDateString("fr-FR"),"{POSTE}":"[Poste]"}
  let body=t.body; Object.entries(vars).forEach(([k,v])=>{body=body.replaceAll(k,v)})
  navigator.clipboard.writeText(body);showToast("Copie avec variables !")
}}/><IAB T={T} Icon={Edit2} title="Modifier" onClick={()=>{setEditIdx(i);setForm({...t,tags:(t.tags||[]).join(", ")})}}/><IAB T={T} Icon={Trash2} title="Supprimer" danger onClick={()=>{if(!window.confirm("Supprimer ?")) return;const n=[...templates];n.splice(i,1);svt(n);showToast("Supprime")}}/></div>
            </div>
            {t.subject&&<div style={{fontSize:11,color:T.textSub,marginBottom:6}}>Objet: {t.subject}</div>}
            <div style={{fontSize:12,color:T.textFaint,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.body}</div>
            {t.tags?.length>0&&<div style={{...fl(5),flexWrap:"wrap",marginTop:8}}>{t.tags.map(tag=><span key={tag} style={{padding:"2px 8px",background:T.bg4,borderRadius:10,fontSize:10,color:T.textFaint}}>#{tag}</span>)}</div>}
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

// ── Stats ──────────────────────────────────────────────────────────────────────
function StatsView({T}) {
  const [stats,setStats]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{Promise.all([cachedFetch(`${API}/stats?max_results=50`, 300000),apiFetch(`${API}/stats/categories`).then(r=>r.json())]).then(([s,c])=>setStats({...s,...c})).catch(console.error).finally(()=>setLoading(false))},[])
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  if(!stats) return null
  const mx=Math.max(...(stats.top_senders?.map(s=>s.count)||[1]))
  // FIX: /stats retourne {cat: number}, /stats/categories retourne {cat: {count,percent}}
  // On normalise pour toujours avoir un nombre
  const normCat = Object.fromEntries(
    Object.entries(stats.categories||{}).map(([k,v])=>[k, typeof v==="object"?v.count:v])
  )
  const tc=Object.values(normCat).reduce((a,b)=>a+b,0)||1
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}><div style={{width:52,height:52,borderRadius:16,background:AC.grad1,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.blueGlow}`}}><TrendingUp size={22} color="#fff"/></div><div><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Statistiques</h2><p style={{color:T.textSub,fontSize:13}}>Apercu de ta boite</p></div></div>
      <div style={{...grd("repeat(4,1fr)",12),marginBottom:28}}>
        {[{l:"Inbox",v:stats.total,Icon:Inbox,c:AC.blue,sub:"emails"},{l:"Non lus",v:stats.unread,Icon:Mail,c:AC.orange,sub:`${stats.total?Math.round(stats.unread/stats.total*100):0}%`},{l:"Favoris",v:stats.starred,Icon:Star,c:AC.gold,sub:"épinglés"},{l:"Classifiés",v:stats.total_classified||0,Icon:Sparkles,c:AC.violet,sub:"par l'IA"}].map(({l,v,Icon,c,sub})=>(
          <div key={l} className="card-hover" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 16px",textAlign:"center",position:"relative",overflow:"hidden",cursor:"default"}}>
            {/* Glow de fond */}
            <div style={{position:"absolute",bottom:-20,right:-20,width:80,height:80,borderRadius:"50%",background:`${c}12`,filter:"blur(20px)",pointerEvents:"none"}}/>
            <div style={{width:46,height:46,borderRadius:14,background:`linear-gradient(135deg,${c}25,${c}12)`,border:`1px solid ${c}25`,color:c,...fl(0,"center","center"),margin:"0 auto 14px",boxShadow:`0 4px 12px ${c}20`}}><Icon size={20}/></div>
            <div style={{fontSize:32,fontWeight:900,color:T.text,letterSpacing:"-0.04em",lineHeight:1}}>{v}</div>
            <div style={{fontSize:11,fontWeight:700,color:T.textSub,marginTop:4}}>{l}</div>
            <div style={{fontSize:10,color:c,marginTop:2,fontWeight:600}}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{...grd("1fr 1fr",20)}}>
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
          <div style={{...fl(8),marginBottom:18}}><Tag size={14} color={AC.violet}/><span style={{fontSize:14,fontWeight:700}}>Categories IA</span><span style={{marginLeft:"auto",fontSize:11,color:T.textFaint}}>{typeof stats.total_classified==='number'?stats.total_classified:Object.values(normCat).reduce((a,b)=>a+b,0)} classes</span></div>
          {MAIN_CATS.map(cat=>{const count=normCat[cat]||0,pct=Math.round(count/tc*100),m=CAT_META[cat];return <div key={cat} style={{marginBottom:16}}><div style={{...fl(8),marginBottom:6}}><div style={{width:28,height:28,borderRadius:8,background:m.bg,...fl(0,"center","center"),fontSize:14,flexShrink:0}}>{m.icon}</div><span style={{fontSize:13,fontWeight:600,flex:1}}>{cat}</span><span style={{fontSize:13,fontWeight:800,color:m.color}}>{count}</span><span style={{fontSize:10,color:T.textFaint,minWidth:32,textAlign:"right",background:m.bg,padding:"1px 6px",borderRadius:8}}>{pct}%</span></div><div style={{height:6,background:T.bg4,borderRadius:3,overflow:"hidden",boxShadow:"inset 0 1px 2px rgba(0,0,0,0.2)"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${m.color},${m.color}bb)`,borderRadius:3,transition:"width 1s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${m.color}50`}}/></div></div>})}
        </div>
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
          <div style={{...fl(8),marginBottom:18}}><Users size={14} color={AC.blue}/><span style={{fontSize:14,fontWeight:700}}>Top expediteurs</span></div>
          {stats.top_senders?.map((s,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{...fl(8),marginBottom:4}}><div style={{width:22,height:22,borderRadius:7,background:AC.grad1,...fl(0,"center","center"),fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{s.name?.[0]?.toUpperCase()||"?"}</div><span style={{fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span><span style={{fontSize:11,color:T.textSub,fontWeight:700}}>{s.count}</span></div>
              <div style={{height:5,background:T.bg4,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${s.count/mx*100}%`,background:AC.grad1,borderRadius:3}}/></div>
            </div>
          ))}
        </div>
        {/* Tendances sentiments */}
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22,gridColumn:"1/-1"}}>
          <div style={{...fl(8),marginBottom:18}}><TrendingUp size={14} color={AC.violet}/><span style={{fontSize:14,fontWeight:700}}>Tendances des sentiments (14j)</span></div>
          <SentimentTrendChart T={T}/>
        </div>
        {stats.rate_limiter&&<div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22,gridColumn:"1/-1"}}>
          <div style={{...fl(8),marginBottom:16}}><Activity size={14} color={AC.green}/><span style={{fontSize:14,fontWeight:700}}>API Groq - Quota</span><span style={{marginLeft:"auto",fontSize:11,color:AC.green,fontWeight:600,...fl(5)}}><span style={{width:8,height:8,borderRadius:"50%",background:AC.green,animation:"pulse 2s infinite"}}/> Actif</span></div>
          <div style={{...grd("repeat(4,1fr)",12)}}>
            {[["Appels/min",stats.rate_limiter.calls_last_minute,stats.rate_limiter.max_per_minute,AC.blue],["Appels/jour",stats.rate_limiter.calls_today,stats.rate_limiter.max_per_day,AC.violet],["Restants",stats.rate_limiter.remaining_today,stats.rate_limiter.max_per_day,AC.green],["Total session",stats.rate_limiter.total_calls,null,AC.gold]].map(([l,v,m,c])=>(
              <div key={l} style={{background:T.bg3,borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:24,fontWeight:900,color:c}}>{v}</div>
                <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{l}{m?` / ${m}`:""}</div>
                {m&&<div style={{height:4,background:T.bg4,borderRadius:2,marginTop:8,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(v/m*100,100)}%`,background:c,borderRadius:2}}/></div>}
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  </div>
}

// ── Word filter ────────────────────────────────────────────────────────────────
function WordFilterView({T,showToast}) {
  const [words,setWords]=useState([]),[input,setInput]=useState("")
  const [testText,setTestText]=useState(""),[testResult,setTestResult]=useState(null)
  const [saving,setSaving]=useState(false),[testing,setTesting]=useState(false),[loading,setLoading]=useState(true)
  useEffect(()=>{apiFetch(`${API}/banned-words`).then(r=>r.json()).then(d=>{setWords(d.words||[]);setLoading(false)}).catch(()=>setLoading(false))},[])
  const add=()=>{const w=input.trim().toLowerCase();if(!w||words.includes(w)){setInput("");return};setWords(p=>[...p,w]);setInput("")}
  const remove=(w)=>setWords(p=>p.filter(x=>x!==w))
  const save_=async()=>{setSaving(true);try{const r=await apiFetch(`${API}/banned-words`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({words})});const d=await r.json();if(!r.ok)throw new Error(d.detail);setWords(d.words);showToast(`${d.count} mots sauvegardes !`)}catch(e){showToast("Erreur: "+e.message,"err")}finally{setSaving(false)}}
  const test=async()=>{if(!testText.trim()) return;setTesting(true);try{const r=await apiFetch(`${API}/banned-words/test?text=${encodeURIComponent(testText)}`,{method:"POST"});setTestResult(await r.json())}catch{showToast("Erreur","err")}finally{setTesting(false)}}
  const PRESETS={"Commercial":["gratuit","promotion","offre","solde","remise","promo"],"Spam":["urgent","cliquez ici","gagnez","lot","felicitations"],"Formel":["peut-etre","si possible","desoler","malheureusement"]}
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}><div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${AC.orange},${AC.red})`,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.orangeDim}`}}><Filter size={22} color="#fff"/></div><div><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Filtre de mots</h2><p style={{color:T.textSub,fontSize:13}}>Mots interdits dans les brouillons IA</p></div></div>
      <div style={{background:AC.indigoDim,border:`1px solid ${AC.indigo}20`,borderRadius:16,padding:20,marginBottom:24}}>
        <div style={{...fl(8),marginBottom:14}}><Zap size={14} color={AC.indigo}/><span style={{fontSize:13,fontWeight:700,color:AC.indigo}}>Comment ca marche</span></div>
        <div style={{...grd("1fr 1fr",10)}}>
          {[["1","L'IA genere un brouillon normalement",AC.blue],["2","Le systeme detecte les mots interdits",AC.orange],["3","L'IA regenere avec interdiction explicite",AC.violet],["4","Max 3 tentatives avec rapport de resultat",AC.green]].map(([n,l,c])=>(
            <div key={n} style={{...fl(10,"flex-start"),padding:"10px 14px",background:T.bg2,borderRadius:10,border:`1px solid ${T.border}`}}>
              <div style={{width:24,height:24,borderRadius:8,background:`${c}20`,color:c,...fl(0,"center","center"),fontSize:11,fontWeight:800,flexShrink:0}}>{n}</div>
              <span style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{...grd("1fr 1fr",20)}}>
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:16,...fl(8)}}><Plus size={14} color={AC.blue}/> Gerer les mots <span style={{marginLeft:"auto",fontSize:11,color:T.textFaint,fontWeight:400}}>{words.length}/200</span></div>
          <div style={{...fl(8),marginBottom:14}}><SI T={T} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>(e.key==="Enter"||e.key===",")&&add()} placeholder="Mot + Entree..."/><Btn T={T} variant="secondary" onClick={add} disabled={!input.trim()} style={{flexShrink:0,padding:"9px 14px"}}>+</Btn></div>
          <div style={{fontSize:11,fontWeight:800,color:T.textSub,marginBottom:8,letterSpacing:"0.06em"}}>PRESETS</div>
          <div style={{...fl(6),flexWrap:"wrap",marginBottom:16}}>
            {Object.entries(PRESETS).map(([label,preset])=><button key={label} onClick={()=>{const toAdd=preset.filter(w=>!words.includes(w));setWords(p=>[...p,...toAdd]);showToast(`+${toAdd.length} mots`)}} style={{padding:"5px 12px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",color:T.textSub,fontFamily:"inherit"}}>+ {label}</button>)}
            <button onClick={()=>{setWords([]);showToast("Liste videe")}} style={{padding:"5px 12px",background:AC.redDim,border:`1px solid ${AC.red}25`,borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",color:AC.red,fontFamily:"inherit"}}><Trash2 size={10}/></button>
          </div>
          {words.length===0?<div style={{padding:20,textAlign:"center",color:T.textFaint,fontSize:12,border:`2px dashed ${T.border}`,borderRadius:10}}>Aucun mot interdit</div>:
            <div style={{...fl(6),flexWrap:"wrap",maxHeight:220,overflowY:"auto",padding:2}}>
              {words.map(w=><div key={w} style={{...fl(6),padding:"4px 11px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:20,fontSize:12}}>{w}<button onClick={()=>remove(w)} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center"),padding:0,marginLeft:2}}><X size={11}/></button></div>)}
            </div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22,flex:1}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:14,...fl(8)}}><Search size={14} color={AC.cyan}/> Tester</div>
            <TA T={T} value={testText} onChange={e=>setTestText(e.target.value)} placeholder="Colle un texte pour verifier..." rows={5}/>
            <div style={{marginTop:10}}><Btn T={T} variant="secondary" onClick={test} disabled={testing||!testText.trim()} full>{testing?<Spin size={13} color={AC.blue}/>:<Search size={13}/>} {testing?"Analyse...":"Tester"}</Btn></div>
            {testResult&&<div style={{marginTop:12,padding:"12px 14px",borderRadius:10,background:testResult.count>0?AC.redDim:AC.greenDim,border:`1px solid ${testResult.count>0?AC.red:AC.green}25`}}>
              {testResult.count>0?<><div style={{...fl(6),fontSize:13,fontWeight:700,color:AC.red,marginBottom:8}}><AlertTriangle size={14}/> {testResult.count} mot{testResult.count>1?"s":""} interdit{testResult.count>1?"s":""} detecte{testResult.count>1?"s":""}</div><div style={{...fl(6),flexWrap:"wrap"}}>{testResult.found.map(w=><Pill key={w} label={w} color={AC.red}/>)}</div></>
              :<div style={{...fl(6),fontSize:13,fontWeight:700,color:AC.green}}><ShieldCheck size={14}/> Aucun mot interdit</div>}
            </div>}
          </div>
          <Btn T={T} variant="primary" onClick={save_} disabled={saving} full style={{padding:"13px",fontSize:14}}>
            {saving?<Spin size={14} color="#fff"/>:<Save size={14}/>} {saving?"Sauvegarde...":` Sauvegarder (${words.length} mots)`}
          </Btn>
        </div>
      </div>
    </div>
  </div>
}

// ── Auto-reply ─────────────────────────────────────────────────────────────────
function AutoReplyView({T,showToast}) {
  const [config,setConfig]=useState(null),[monitoring,setMonitoring]=useState(null),[rateLimit,setRateLimit]=useState(null),[saving,setSaving]=useState(false)
  useEffect(()=>{
    apiFetch(`${API}/auto-reply`).then(r=>r.json()).then(setConfig).catch(console.error)
    apiFetch(`${API}/monitoring`).then(r=>r.json()).then(setMonitoring).catch(console.error)
    apiFetch(`${API}/rate-limiter`).then(r=>r.json()).then(setRateLimit).catch(console.error)
    const id=setInterval(()=>apiFetch(`${API}/rate-limiter`).then(r=>r.json()).then(setRateLimit).catch(()=>{}),30000)
    return()=>clearInterval(id)
  },[])
  const save_=async()=>{setSaving(true);try{await apiFetch(`${API}/auto-reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(config)});showToast("Sauvegarde !")}catch{showToast("Erreur","err")}finally{setSaving(false)}}
  const saveM=async(enabled)=>{try{const r=await apiFetch(`${API}/monitoring`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled,check_interval:monitoring?.check_interval||120})});const d=await r.json();setMonitoring(d);showToast(enabled?"Surveillance demarree !":"Arretee")}catch{showToast("Erreur","err")}}
  const upd=(k,v)=>setConfig(p=>({...p,[k]:v}))
  const updCat=(cat,k,v)=>setConfig(p=>({...p,categories:{...p.categories,[cat]:{...p.categories?.[cat],[k]:v}}}))
  if(!config||!monitoring) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}><div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${AC.green},${AC.cyan})`,...fl(0,"center","center")}}><Bot size={20} color="#fff"/></div><div><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Automatisation</h2><p style={{color:T.textSub,fontSize:13}}>Surveillance + reponses auto</p></div></div>
      {rateLimit&&<div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{...fl(8),marginBottom:14}}><Activity size={14} color={AC.blue}/><span style={{fontSize:13,fontWeight:700}}>Quota API Groq</span></div>
        <div style={{...grd("repeat(3,1fr)",12)}}>
          {[{l:"Cette minute",v:rateLimit.calls_last_minute,m:rateLimit.max_per_minute,c:AC.blue},{l:"Aujourd'hui",v:rateLimit.calls_today,m:rateLimit.max_per_day,c:AC.violet},{l:"Restants",v:rateLimit.remaining_today,m:rateLimit.max_per_day,c:AC.green}].map(({l,v,m,c})=>(
            <div key={l} style={{background:T.bg3,borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:24,fontWeight:900,color:c}}>{v}</div>
              <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{l} / {m}</div>
              <div style={{height:4,background:T.bg4,borderRadius:2,marginTop:8,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(v/m*100,100)}%`,background:c,borderRadius:2}}/></div>
            </div>
          ))}
        </div>
      </div>}
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{...fl(10),marginBottom:14}}>{monitoring.active?<Wifi size={14} color={AC.green}/>:<WifiOff size={14} color={AC.red}/>}<span style={{fontSize:13,fontWeight:700}}>Surveillance</span><span style={{marginLeft:"auto",padding:"3px 12px",borderRadius:20,background:monitoring.active?AC.greenDim:AC.redDim,color:monitoring.active?AC.green:AC.red,fontSize:11,fontWeight:700}}>{monitoring.active?"Actif":"Inactif"}</span></div>
        <p style={{fontSize:12,color:T.textSub,marginBottom:14,lineHeight:1.6}}>Verifie les nouveaux emails et les classe automatiquement dans les 4 categories.</p>
        <div style={{...fl(12,"center"),marginBottom:14}}><span style={{fontSize:13}}>Intervalle</span><Sel T={T} value={String(monitoring.check_interval||120)} onChange={v=>setMonitoring(p=>({...p,check_interval:Number(v)}))} options={[["30","30 secondes"],["60","1 minute"],["120","2 minutes"],["300","5 minutes"],["600","10 minutes"]]}/></div>
        <div style={{...fl(10)}}>
          <Btn T={T} variant={monitoring.enabled?"danger":"success"} onClick={()=>saveM(!monitoring.enabled)}>{monitoring.enabled?<><X size={13}/> Arreter</>:<><Eye size={13}/> Demarrer</>}</Btn>
          <Btn T={T} variant="secondary" onClick={()=>{showToast("Classification en cours...");apiFetch(`${API}/emails/classify-batch?max_emails=20`,{method:"POST"}).catch(console.error)}}><Sparkles size={13}/> Classer les emails existants</Btn>
        </div>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{...fl(10),justifyContent:"space-between",marginBottom:config.enabled?20:0}}>
          <div><div style={{...fl(8),fontSize:14,fontWeight:700,marginBottom:4}}><Bot size={14} color={AC.violet}/> Reponse automatique</div><div style={{fontSize:12,color:T.textSub}}>L'IA repond aux emails des categories activees</div></div>
          <Tog T={T} on={config.enabled} set={v=>upd("enabled",v)} color={AC.violet}/>
        </div>
        {config.enabled&&<>
          <div style={{...fl(12),marginBottom:16,padding:"12px 14px",background:T.bg3,borderRadius:10}}><Clock size={13} color={T.textSub}/><span style={{fontSize:13}}>Delai</span><Sel T={T} value={String(config.delay_seconds||10)} onChange={v=>upd("delay_seconds",Number(v))} options={[["5","5s"],["10","10s"],["30","30s"],["60","1min"],["300","5min"]]}/></div>
          {MAIN_CATS.map(cat=>{const cc=config.categories?.[cat]||{},m=CAT_META[cat];return <div key={cat} style={{background:T.bg3,borderRadius:14,padding:16,marginBottom:12}}>
            <div style={{...fl(10),justifyContent:"space-between",marginBottom:cc.enabled?14:0}}>
              <div style={{...fl(10)}}><div style={{width:36,height:36,borderRadius:10,background:m.bg,...fl(0,"center","center"),fontSize:18}}>{m.icon}</div><div><div style={{fontSize:13,fontWeight:700,color:m.color}}>{cat}</div><div style={{fontSize:11,color:T.textFaint}}>{m.desc}</div></div></div>
              <Tog T={T} on={cc.enabled||false} set={v=>updCat(cat,"enabled",v)} color={m.color}/>
            </div>
            {cc.enabled&&<><label style={{fontSize:11,fontWeight:800,color:T.textSub,display:"block",marginBottom:6,letterSpacing:"0.05em"}}>INSTRUCTION IA</label><TA T={T} value={cc.template||""} onChange={e=>updCat(cat,"template",e.target.value)} placeholder="Ex: Remercie et dis que tu reviens dans 24h..." rows={3}/></>}
          </div>})}
        </>}
      </div>
      <Btn T={T} variant="primary" onClick={save_} disabled={saving} full style={{padding:"13px",fontSize:14}}>{saving?<Spin size={14} color="#fff"/>:<Check size={14}/>} {saving?"Sauvegarde...":"Sauvegarder"}</Btn>
    </div>
  </div>
}

// ── Profile ────────────────────────────────────────────────────────────────────
function ProfileView({T,profile,setProfile}) {
  const upd=(k,v)=>{
    const n={...profile,[k]:v};setProfile(n);sv("emailai_profile",n)
    // FIX: sync avec le backend pour l'auto-reply
    apiFetch(`${API}/prefs/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({settings:ld("emailai_settings",{}),profile:n})}).catch(()=>{})
  }
  const initials=((profile.firstName?.[0]||"")+(profile.lastName?.[0]||"")).toUpperCase()||"?"
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}><div style={{width:44,height:44,borderRadius:14,background:AC.grad2,...fl(0,"center","center")}}><User size={20} color="#fff"/></div><div><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Profil utilisateur</h2><p style={{color:T.textSub,fontSize:13}}>Personalise les reponses de l'IA</p></div></div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{...fl(16),marginBottom:24}}><div style={{width:72,height:72,borderRadius:22,background:AC.grad1,...fl(0,"center","center"),fontSize:24,fontWeight:900,color:"#fff",boxShadow:`0 8px 24px ${AC.blueGlow}`,flexShrink:0}}>{initials}</div><div><div style={{fontSize:20,fontWeight:800}}>{profile.firstName||profile.lastName?`${profile.firstName} ${profile.lastName}`.trim():"Utilisateur"}</div><div style={{fontSize:13,color:T.textSub,marginTop:2}}>{profile.role||"Role non defini"}{profile.company?` · ${profile.company}`:""}</div></div></div>
        <div style={{...grd("1fr 1fr",14),marginBottom:14}}>
          {[{k:"firstName",l:"PRENOM",ph:"Jean",Icon:User},{k:"lastName",l:"NOM",ph:"Dupont",Icon:User},{k:"company",l:"ENTREPRISE",ph:"Acme Corp",Icon:Building2},{k:"role",l:"POSTE",ph:"Directeur",Icon:Briefcase},{k:"email",l:"EMAIL PRO",ph:"jean@acme.com",Icon:Mail}].map(({k,l,ph,Icon})=>(
            <div key={k}><label style={{fontSize:10,fontWeight:800,color:T.textSub,display:"block",marginBottom:6,letterSpacing:"0.06em"}}>{l}</label><SI T={T} value={profile[k]||""} onChange={e=>upd(k,e.target.value)} placeholder={ph} icon={Icon}/></div>
          ))}
        </div>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <Field T={T} label="CONTEXTE PROFESSIONNEL" sub="L'IA utilise ces informations pour personaliser les reponses."><TA T={T} value={profile.context||""} onChange={e=>upd("context",e.target.value)} placeholder="Decris ton activite, secteur, clients..." rows={4}/></Field>
        <Field T={T} label="SIGNATURE EMAIL" sub="Ajoutee automatiquement a tes reponses."><TA T={T} value={profile.signature||""} onChange={e=>upd("signature",e.target.value)} placeholder={"Cordialement,\nJean Dupont\nDirecteur - Acme Corp"} rows={4} mono/></Field>
        {profile.signature&&<div style={{padding:"12px 14px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,marginTop:4}}><div style={{fontSize:10,fontWeight:800,color:T.textFaint,marginBottom:6,letterSpacing:"0.06em"}}>APERCU</div><div style={{fontSize:12,color:T.textSub,whiteSpace:"pre-wrap",fontFamily:"'Courier New',monospace",lineHeight:1.6}}>{profile.signature}</div></div>}
      </div>
      <div style={{...fl(10),padding:"14px 18px",background:AC.blueDim,border:`1px solid ${AC.blue}20`,borderRadius:12}}><ShieldCheck size={16} color={AC.blue} style={{flexShrink:0}}/><span style={{fontSize:12,color:AC.blue,lineHeight:1.5}}>Stocke localement · Jamais envoye a un serveur tiers</span></div>
    </div>
  </div>
}

// ── Settings ───────────────────────────────────────────────────────────────────
function SettingsView({T,settings,setSettings}) {
  const upd=(k,v)=>{const n={...settings,[k]:v};setSettings(n);sv("emailai_settings",n)}
  const reset=()=>{const n={...DEFAULT_SETTINGS,theme:settings.theme};setSettings(n);sv("emailai_settings",n)}
  const RS=({Icon,label,sub,ctrl})=><div style={{...fl(12),padding:"13px 18px",borderBottom:`1px solid ${T.border}`}}>
    {Icon&&<Icon size={14} color={T.textFaint} style={{flexShrink:0}}/>}<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{label}</div>{sub&&<div style={{fontSize:11,color:T.textSub,marginTop:2}}>{sub}</div>}</div>{ctrl}
  </div>
  const Sec=({title,color,Icon:I,children})=><div style={{marginBottom:24}}><div style={{...fl(8),marginBottom:10}}><div style={{width:28,height:28,borderRadius:8,background:`${color}18`,color,...fl(0,"center","center")}}><I size={14}/></div><span style={{fontSize:11,fontWeight:800,color,letterSpacing:"0.08em"}}>{title}</span></div><div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>{children}</div></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <NotificationSetup T={T} showToast={showToast}/>
      <div style={{...fl(12),justifyContent:"space-between",marginBottom:28}}>
        <div style={{...fl(12)}}><div style={{width:44,height:44,borderRadius:14,background:AC.grad1,...fl(0,"center","center")}}><Settings size={20} color="#fff"/></div><div><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Configuration</h2><p style={{color:T.textSub,fontSize:13}}>Parametres du moteur IA</p></div></div>
        <Btn T={T} variant="ghost" onClick={reset} style={{fontSize:12,padding:"7px 14px"}}><RotateCcw size={12}/> Reset</Btn>
      </div>
      <Sec title="MOTEUR IA" color={AC.indigo} Icon={Sparkles}>
        <RS label="IA activee" sub="Active ou desactive l'assistant" ctrl={<Tog T={T} on={settings.enabled} set={v=>upd("enabled",v)} color={AC.indigo}/>}/>
        <RS label="Analyse automatique" sub="Analyser a l'ouverture" ctrl={<Tog T={T} on={settings.autoAnalyze} set={v=>upd("autoAnalyze",v)} disabled={!settings.enabled} color={AC.indigo}/>}/>
        <RS label={`Creativite : ${settings.temperature}`} sub={settings.temperature<0.3?"Factuel":settings.temperature<0.6?"Equilibre":"Creatif"} ctrl={<div style={{...fl(6)}}><span style={{fontSize:10,color:T.textFaint}}>0</span><input type="range" min={0} max={1} step={0.05} value={settings.temperature} onChange={e=>upd("temperature",Number(e.target.value))} style={{width:110}}/><span style={{fontSize:10,color:T.textFaint}}>1</span></div>}/>
      </Sec>
      <Sec title="REDACTION" color={AC.violet} Icon={PenLine}>
        <RS label="Langue" ctrl={<Sel T={T} value={settings.language} onChange={v=>upd("language",v)} options={[["fr","Francais"],["en","English"],["es","Espanol"],["de","Deutsch"],["it","Italiano"],["pt","Portugais"],["nl","Nederlands"],["auto","Automatique"]]}/>}/>
        <RS label="Ton professionnel" sub="Registre formel" ctrl={<Tog T={T} on={settings.professionalTone} set={v=>upd("professionalTone",v)} color={AC.violet}/>}/>
        <RS label={`Longueur max : ${settings.maxDraftLength}`} ctrl={<div style={{...fl(6)}}><span style={{fontSize:10,color:T.textFaint}}>200</span><input type="range" min={200} max={8000} step={100} value={settings.maxDraftLength} onChange={e=>upd("maxDraftLength",Number(e.target.value))} style={{width:110,accentColor:AC.violet}}/><span style={{fontSize:10,color:T.textFaint}}>8000</span></div>}/>
        <RS label="Filtre de mots actif" sub="Regenerer si mot interdit detecte" ctrl={<Tog T={T} on={settings.wordFilterEnabled!==false} set={v=>upd("wordFilterEnabled",v)} color={AC.violet}/>}/>
      </Sec>
      <Sec title="SECURITE" color={AC.green} Icon={Shield}>
        <RS label="Filtre anti-injection" sub="Bloque la manipulation de l'IA" ctrl={<Tog T={T} on={settings.safetyFilter} set={v=>upd("safetyFilter",v)} color={AC.green}/>}/>
        <RS label="Details securite" sub="Afficher les rapports" ctrl={<Tog T={T} on={settings.showSecurityDetails} set={v=>upd("showSecurityDetails",v)} color={AC.green}/>}/>
      </Sec>
      <Sec title="INTERFACE" color={AC.orange} Icon={Sliders}>
        <RS label="Thème" ctrl={<Sel T={T} value={settings.theme} onChange={v=>upd("theme",v)} options={[["dark","🌑 Sombre"],["midnight","🌌 Minuit"],["light","☀️ Clair"],["aurora","🌌 Aurora"],["rose","🌸 Rose"]]}/>}/>
        <RS label="Vue compacte" sub="Liste condensee" ctrl={<Tog T={T} on={settings.compactView} set={v=>upd("compactView",v)} color={AC.orange}/>}/>
        <RS label="Apercu du contenu" sub="Extrait dans la liste" ctrl={<Tog T={T} on={settings.showPreview!==false} set={v=>upd("showPreview",v)} color={AC.orange}/>}/>
        <RS label="Grouper par date" sub="Organiser par jour" ctrl={<Tog T={T} on={settings.groupByDate||false} set={v=>upd("groupByDate",v)} color={AC.orange}/>}/>
        <RS label="Bouton Annuler" sub="Permettre d'annuler archive/suppression (5s)" ctrl={<Tog T={T} on={settings.undoEnabled!==false} set={v=>upd("undoEnabled",v)} color={AC.orange}/>}/>
        <RS label="Auto-refresh" sub="Recharger l'inbox automatiquement (2 min)" ctrl={<Tog T={T} on={settings.autoRefresh!==false} set={v=>upd("autoRefresh",v)} color={AC.orange}/>}/>
        <RS label="Notifications navigateur" sub="Alerter lors de nouveaux emails" ctrl={<Tog T={T} on={settings.browserNotif||false} set={v=>{upd("browserNotif",v);if(v&&"Notification"in window)Notification.requestPermission()}} color={AC.orange}/>}/>
        <RS label="Verification grammaire" sub="Verifier la grammaire des brouillons IA" ctrl={<Tog T={T} on={settings.grammarCheck||false} set={v=>upd("grammarCheck",v)} color={AC.green}/>}/>
      </Sec>
      <div style={{padding:"16px 18px",background:AC.indigoDim,border:`1px solid ${AC.indigo}20`,borderRadius:12,fontSize:12,color:AC.indigo,lineHeight:1.7}}>
        <div style={{...fl(6),fontWeight:800,marginBottom:4}}><Sparkles size={13}/> Modele actif</div>
        <span style={{color:T.text,fontWeight:700}}>Groq LLaMA 3.3 70B</span> · Gratuit · 14 400 req/jour · Rate limiting auto
      </div>
    </div>
  </div>
}

// ── Bulk bar ───────────────────────────────────────────────────────────────────
function BulkBar({T,selectedIds,setSelectedIds,doAction,showToast}) {
  if(selectedIds.size===0) return null
  const ids=[...selectedIds]
  const act=async(action)=>{for(const id of ids){try{await doAction(id,action)}catch{}}setSelectedIds(new Set());showToast(`${ids.length} emails: ${action}`)}
  return <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:98,...fl(10),padding:"12px 20px",background:T.bg2,border:`1px solid ${T.borderHi}`,borderRadius:16,boxShadow:T.cardShadow,animation:"fadeUp .2s",whiteSpace:"nowrap"}}>
    <span style={{fontSize:13,fontWeight:700}}>{ids.length} selectionne{ids.length>1?"s":""}</span>
    <div style={{width:1,height:20,background:T.border}}/>
    <Btn T={T} variant="ghost" onClick={()=>act("archive")} style={{padding:"6px 12px",fontSize:12}}><Archive size={13}/> Archiver</Btn>
    <Btn T={T} variant="ghost" onClick={()=>act("read")} style={{padding:"6px 12px",fontSize:12}}><MailOpen size={13}/> Lu</Btn>
    <Btn T={T} variant="ghost" onClick={()=>act("star")} style={{padding:"6px 12px",fontSize:12}}><Star size={13}/> Favori</Btn>
    <Btn T={T} variant="danger" onClick={()=>act("trash")} style={{padding:"6px 12px",fontSize:12}}><Trash2 size={13}/> Supprimer</Btn>
    <div style={{width:1,height:20,background:T.border}}/>
    <button onClick={()=>setSelectedIds(new Set())} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><X size={16}/></button>
  </div>
}



// ── Modal raccourcis clavier ──────────────────────────────────────────────────

// ── UndoBar : annuler la derniere action (archive/delete) ─────────────────────

function ReplyNeededBadge({T,emailId}) {
  const [pred,setPred]=useState(null)
  useEffect(()=>{
    if(!emailId) return
    const timer=setTimeout(()=>{
      apiFetch(`${API}/emails/${emailId}/reply-needed`)
        .then(r=>r.json()).then(setPred).catch(()=>{})
    },2000) // Charger après 2s pour ne pas surcharger
    return()=>clearTimeout(timer)
  },[emailId])
  if(!pred||!pred.needs_reply) return null
  const urgColors={immediate:AC.red,today:AC.orange,this_week:AC.blue,none:T.textFaint}
  const c=urgColors[pred.urgency]||T.textFaint
  return <div title={pred.reason} style={{...fl(5),padding:"4px 10px",background:`${c}15`,border:`1px solid ${c}25`,borderRadius:20,fontSize:11,fontWeight:700,color:c,flexShrink:0,cursor:"help"}}>
    <Reply size={10}/> {pred.urgency==="immediate"?"Réponse urgente":pred.urgency==="today"?"Répondre aujourd'hui":pred.urgency==="this_week"?"Répondre cette semaine":"Réponse attendue"}
  </div>
}

// ── Smart Replies : suggestions rapides IA ───────────────────────────────────

function PinnedBanner({T,onSelect,selected}) {
  const [pinned,setPinned]=useState([])
  useEffect(()=>{
    apiFetch(`${API}/emails/pinned`).then(r=>r.json()).then(d=>setPinned(d.emails||[])).catch(()=>{})
  },[])
  if(!pinned.length) return null
  return <div style={{borderBottom:`1px solid ${T.border}`,background:`${AC.gold}08`}}>
    <div style={{padding:"6px 12px",fontSize:9,fontWeight:800,color:AC.gold,letterSpacing:"0.1em",...fl(6)}}>
      <Pin size={9}/> ÉPINGLÉS
    </div>
    {pinned.map(e=><div key={e.id} onClick={()=>onSelect(e.id)}
      style={{padding:"6px 14px",cursor:"pointer",background:selected===e.id?`${AC.gold}15`:"transparent",borderLeft:`3px solid ${AC.gold}`,...fl(6)}}
      onMouseEnter={ev=>ev.currentTarget.style.background=`${AC.gold}10`}
      onMouseLeave={ev=>ev.currentTarget.style.background=selected===e.id?`${AC.gold}15`:"transparent"}>
      <span style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{e.subject}</span>
    </div>)}
  </div>
}

// ── Recherche avancée ─────────────────────────────────────────────────────────

function QuickReplyPanel({T,email,showToast,onClose}) {
  const [body,setBody]=useState(""),[sending,setSending]=useState(false)
  const QUICK_TEXTS=["Merci pour votre email.","Bien recu, je reviens vers vous rapidement.","Je prends note, merci.","D'accord, c'est note.","Pouvez-vous me donner plus de details ?"]
  const send=async()=>{
    if(!body.trim()) return showToast("Ecris un message","err")
    if(!window.confirm("Envoyer cette reponse ?")) return
    setSending(true)
    try{
      const r=await apiFetch(`${API}/emails/${email.id}/quick-reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email_id:email.id,body})})
      const d=await r.json(); if(!r.ok) throw new Error(d.detail)
      showToast("Reponse envoyee !"); onClose()
    }catch(e){showToast("Erreur: "+e.message,"err")}finally{setSending(false)}
  }
  return <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginTop:12,animation:"fadeIn .3s"}}>
    <div style={{...fl(8),marginBottom:14}}>
      <div style={{width:28,height:28,borderRadius:8,background:T.bg3,...fl(0,"center","center")}}><Reply size={14} color={T.textSub}/></div>
      <span style={{fontSize:13,fontWeight:700,flex:1}}>Reponse rapide (sans IA)</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><X size={16}/></button>
    </div>
    <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>A: <strong style={{color:T.text}}>{email.from}</strong></div>
    <div style={{...fl(6),flexWrap:"wrap",marginBottom:10}}>
      {QUICK_TEXTS.map(t=><button key={t} onClick={()=>setBody(t)} style={{padding:"3px 10px",fontSize:11,background:T.bg3,border:`1px solid ${T.border}`,borderRadius:20,cursor:"pointer",color:T.textSub,fontFamily:"inherit"}}>{t.slice(0,30)}...</button>)}
    </div>
    <textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="Tape ta reponse..." style={{width:"100%",padding:"11px 14px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text,outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.65,boxSizing:"border-box",marginBottom:10}} onFocus={e=>e.target.style.borderColor=T.borderFocus} onBlur={e=>e.target.style.borderColor=T.border}/>
    <div style={{...fl(8)}}>
      <span style={{fontSize:11,color:T.textFaint,flex:1}}>{body.length} car.</span>
      <Btn T={T} variant="primary" onClick={send} disabled={sending||!body.trim()} style={{padding:"9px 20px"}}>
        {sending?<Spin size={14} color="#fff"/>:<Send size={14}/>} {sending?"Envoi...":"Envoyer"}
      </Btn>
    </div>
  </div>
}


// ── Configuration avancée du moteur IA ───────────────────────────────────────
function SentimentTrendChart({T}) {
  const [trends,setTrends]=useState(null)
  useEffect(()=>{
    apiFetch(`${API}/stats/sentiment-trends`).then(r=>r.json()).then(d=>setTrends(d.trends||[])).catch(()=>setTrends([]))
  },[])
  if(!trends) return <div style={{height:80,...fl(0,"center","center")}}><Spin size={20}/></div>
  const hasData=trends.some(d=>d.Positif+d.Neutre+d.Negatif+d.Urgent>0)
  if(!hasData) return <div style={{height:60,...fl(0,"center","center"),color:T.textFaint,fontSize:12}}>Données insuffisantes — les sentiments s'accumulent au fil des analyses</div>
  const maxVal=Math.max(...(trends||[]).map(d=>d.Positif+d.Neutre+d.Negatif+d.Urgent),1)
  const COLS={Positif:AC.green,Neutre:"#64748B",Negatif:AC.orange,Urgent:AC.red}
  return <div style={{overflowX:"auto"}}>
    <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80,minWidth:trends.length*32}}>
      {(trends||[]).map((d,i)=>{
        const total=d.Positif+d.Neutre+d.Negatif+d.Urgent||0
        const heightPct=(t,max)=>total===0?0:Math.round(t/maxVal*100)
        return <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,flex:1,minWidth:24}}>
          <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:60,gap:1}}>
            {Object.entries(COLS).map(([k,c])=>d[k]>0&&<div key={k} title={`${k}: ${d[k]}`} style={{width:"100%",height:`${heightPct(d[k],maxVal)}%`,minHeight:d[k]>0?3:0,background:c,borderRadius:2,opacity:.85}}/>)}
          </div>
          <div style={{fontSize:8,color:T.textFaint,transform:"rotate(-35deg)",transformOrigin:"center",whiteSpace:"nowrap"}}>{d.day}</div>
        </div>
      })}
    </div>
    <div style={{...fl(12),marginTop:12,justifyContent:"center"}}>
      {Object.entries(COLS).map(([k,c])=><div key={k} style={{...fl(4),fontSize:10,color:T.textSub}}><div style={{width:10,height:10,borderRadius:2,background:c}}/>{k}</div>)}
    </div>
  </div>
}

// ── Digest du jour ────────────────────────────────────────────────────────────
function DigestView({T}) {
  const [digest,setDigest]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{
    apiFetch(`${API}/digest/daily`).then(r=>r.json()).then(setDigest).catch(console.error).finally(()=>setLoading(false))
  },[])
  const refresh=()=>{setLoading(true);apiFetch(`${API}/digest/daily`).then(r=>r.json()).then(setDigest).catch(console.error).finally(()=>setLoading(false))}
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{...fl(12),marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:14,background:AC.grad2,...fl(0,"center","center")}}><Inbox size={20} color="#fff"/></div>
        <div style={{flex:1}}><h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Digest du jour</h2><p style={{color:T.textSub,fontSize:13}}>Résumé IA de ta boite de reception aujourd'hui</p></div>
        <button onClick={refresh} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center"),gap:6,fontSize:12,fontFamily:"inherit"}}><RefreshCw size={14}/> Actualiser</button>
      </div>
      {digest?.digest?(
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
          <div style={{...fl(8),marginBottom:14}}><Sparkles size={14} color={AC.indigo}/><span style={{fontSize:12,fontWeight:800,color:AC.indigo,letterSpacing:"0.06em"}}>RÉSUMÉ IA</span><span style={{marginLeft:"auto",fontSize:12,color:T.textFaint}}>{digest.count} email{digest.count>1?"s":""} aujourd'hui</span></div>
          <p style={{fontSize:14,lineHeight:1.8,color:T.text,whiteSpace:"pre-wrap"}}>{digest.digest}</p>
        </div>
      ):(
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center",color:T.textFaint}}>
          <Inbox size={40} style={{display:"block",margin:"0 auto 12px",opacity:.3}}/><span>Aucun email recu aujourd'hui</span>
        </div>
      )}
    </div>
  </div>
}


// ── Contacts fréquents ───────────────────────────────────────────────────────
function ContactsView({T,showToast}) {
  const [contacts,setContacts]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{
    apiFetch(`${API}/contacts/frequent`).then(r=>r.json()).then(d=>setContacts(d.contacts||[])).catch(()=>setContacts([])).finally(()=>setLoading(false))
  },[])
  const addVip=async(email)=>{
    try{await apiFetch(`${API}/contacts/${encodeURIComponent(email)}/add-vip`,{method:"POST"});showToast(`★ ${email} ajouté aux VIP !`);setContacts(p=>p.map(c=>c.email===email?{...c,is_vip:true}:c))}
    catch{showToast("Erreur","err")}
  }
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad2,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.cyanGlow}`}}><Users size={22} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Contacts fréquents</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Personnes avec qui tu échanges le plus</p></div>
      </div>
      {contacts.length===0&&<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,color:T.textFaint}}>
        <Users size={48} style={{opacity:.2}}/><span>Aucun contact analysé</span>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {(contacts||[]).map((c,i)=>(
          <div key={c.email} className="card-hover" style={{background:T.bg2,border:`1px solid ${c.is_vip?AC.gold+"40":T.border}`,borderRadius:16,padding:18,...fl(14)}}>
            <div style={{width:48,height:48,borderRadius:15,background:senderColor(c.email),...fl(0,"center","center"),fontSize:16,fontWeight:900,color:"#fff",flexShrink:0,boxShadow:`0 4px 12px ${senderColor(c.email)}50`}}>
              {c.name?.[0]?.toUpperCase()||"?"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",...fl(6)}}>
                {c.is_vip&&<span style={{color:AC.gold,fontSize:12}}>★</span>}
                {c.name}
              </div>
              <div style={{fontSize:11,color:T.textFaint,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email}</div>
              <div style={{...fl(6),marginTop:6}}>
                <span style={{padding:"2px 8px",background:AC.blueSoft,color:AC.blue,borderRadius:10,fontSize:11,fontWeight:700}}>✉ {c.count}</span>
                {c.domain&&<span style={{fontSize:10,color:T.textFaint}}>{c.domain}</span>}
              </div>
            </div>
            {!c.is_vip&&<button onClick={()=>addVip(c.email)} title="Ajouter aux VIP" style={{padding:"5px 10px",background:AC.goldDim,border:`1px solid ${AC.gold}30`,borderRadius:8,fontSize:11,color:AC.gold,cursor:"pointer",fontFamily:"inherit",fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>★ VIP</button>}
          </div>
        ))}
      </div>
    </div>
  </div>
}

// ── Règles automatiques ───────────────────────────────────────────────────────
function RulesView({T,showToast}) {
  const [rules,setRules]=useState([]),[loading,setLoading]=useState(true)
  const [form,setForm]=useState({name:"",conditions:[{field:"from",op:"contains",value:""}],logic:"AND",actions:[{type:"category",value:"Client"}],enabled:true})
  const [testing,setTesting]=useState(false),[testResult,setTestResult]=useState(null)

  useEffect(()=>{apiFetch(`${API}/rules`).then(r=>r.json()).then(d=>setRules(d.rules||[])).finally(()=>setLoading(false))},[])

  const save=async()=>{
    if(!form.name.trim()) return showToast("Nomme la règle","err")
    try{const r=await apiFetch(`${API}/rules`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const d=await r.json();if(!r.ok)throw new Error(d.detail);setRules(p=>{const idx=p.findIndex(x=>x.id===d.rule.id);return idx>=0?p.map((x,i)=>i===idx?d.rule:x):[...p,d.rule]});setForm({name:"",conditions:[{field:"from",op:"contains",value:""}],logic:"AND",actions:[{type:"category",value:"Client"}],enabled:true});showToast("Règle sauvegardée !")}
    catch(e){showToast("Erreur: "+e.message,"err")}
  }
  const del=async(id)=>{if(!window.confirm("Supprimer ?"))return;await apiFetch(`${API}/rules/${id}`,{method:"DELETE"});setRules(p=>p.filter(r=>r.id!==id));showToast("Supprimée")}
  const test=async()=>{setTesting(true);try{const d=await apiFetch(`${API}/rules/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}).then(r=>r.json());setTestResult(d)}catch{showToast("Erreur","err")}finally{setTesting(false)}}
  const updCond=(i,k,v)=>setForm(p=>{const c=[...p.conditions];c[i]={...c[i],[k]:v};return{...p,conditions:c}})
  const addCond=()=>setForm(p=>({...p,conditions:[...p.conditions,{field:"from",op:"contains",value:""}]}))
  const remCond=(i)=>setForm(p=>({...p,conditions:p.conditions.filter((_,idx)=>idx!==i)}))
  const updAct=(i,k,v)=>setForm(p=>{const ac=[...p.actions];ac[i]={...ac[i],[k]:v};return{...p,actions:ac}})

  const FIELDS=[["from","Expéditeur"],["subject","Objet"],["body","Corps"]]
  const OPS=[["contains","contient"],["not_contains","ne contient pas"],["equals","est exactement"]]
  const ATYPES=[["category","Classer en"],["star","Mettre en favori"],["archive","Archiver"],["priority","Priorité"]]
  const CATS=["Client","Personnel","Publicite","Spam"]

  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:860,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad5,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.orangeDim}`}}><Sliders size={22} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Règles automatiques</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Si [condition] alors [action] — appliquées aux nouveaux emails</p></div>
      </div>
      <div style={{...grd("1fr 1fr",20)}}>
        {/* Éditeur de règle */}
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:13,fontWeight:800,marginBottom:16,color:T.text,...fl(8)}}><Plus size={14} color={AC.violet}/> Nouvelle règle</div>
          <Field T={T} label="NOM"><SI T={T} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Ex: Classer Bambu Lab"/></Field>
          <div style={{fontSize:11,fontWeight:800,color:T.textSub,marginBottom:8,letterSpacing:"0.06em"}}>CONDITIONS</div>
          {form.conditions.map((c,i)=><div key={i} style={{...fl(6),marginBottom:8,flexWrap:"wrap"}}>
            <Sel T={T} value={c.field} onChange={v=>updCond(i,"field",v)} options={FIELDS}/>
            <Sel T={T} value={c.op} onChange={v=>updCond(i,"op",v)} options={OPS}/>
            <SI T={T} value={c.value} onChange={e=>updCond(i,"value",e.target.value)} placeholder="valeur..." style={{minWidth:80}}/>
            {form.conditions.length>1&&<IAB T={T} Icon={X} danger onClick={()=>remCond(i)}/>}
          </div>)}
          <div style={{...fl(8),marginBottom:16}}>
            <button onClick={addCond} style={{fontSize:11,color:AC.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",...fl(4)}}><Plus size={11}/> Ajouter condition</button>
            {form.conditions.length>1&&<Sel T={T} value={form.logic} onChange={v=>setForm(p=>({...p,logic:v}))} options={[["AND","TOUTES les conditions"],["OR","UNE des conditions"]]}/>}
          </div>
          <div style={{fontSize:11,fontWeight:800,color:T.textSub,marginBottom:8,letterSpacing:"0.06em"}}>ACTIONS</div>
          {form.actions.map((act,i)=><div key={i} style={{...fl(6),marginBottom:8}}>
            <Sel T={T} value={act.type} onChange={v=>updAct(i,"type",v)} options={ATYPES}/>
            {act.type==="category"&&<Sel T={T} value={act.value} onChange={v=>updAct(i,"value",v)} options={CATS.map(c=>[c,c])}/>}
            {act.type==="priority"&&<Sel T={T} value={act.value||"Haute"} onChange={v=>updAct(i,"value",v)} options={[["Haute","Haute"],["Normale","Normale"],["Basse","Basse"]]}/>}
          </div>)}
          <div style={{...fl(8),marginTop:4}}>
            <Btn T={T} variant="ghost" onClick={test} disabled={testing||!form.name.trim()} style={{fontSize:12,padding:"7px 14px"}}>{testing?<Spin size={12}/>:<Search size={12}/>} Tester</Btn>
            <Btn T={T} variant="primary" onClick={save} style={{flex:1}}><Check size={13}/> Sauvegarder</Btn>
          </div>
          {testResult&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:10,background:testResult.count>0?AC.greenDim:T.bg3,border:`1px solid ${testResult.count>0?AC.green:T.border}`}}>
            <span style={{fontSize:12,fontWeight:700,color:testResult.count>0?AC.green:T.textSub}}>{testResult.count>0?`✓ ${testResult.count} email(s) correspondant(s)`:"Aucun email ne correspond actuellement"}</span>
            {testResult.matches?.slice(0,3).map((m,i)=><div key={i} style={{fontSize:11,color:T.textFaint,marginTop:4}}>→ {m.subject}</div>)}
          </div>}
        </div>
        {/* Liste des règles */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {rules.length===0&&<div style={{...fl(0,"center","center"),flexDirection:"column",gap:8,padding:40,background:T.bg2,borderRadius:16,border:`1px solid ${T.border}`,color:T.textFaint}}>
            <Sliders size={32} style={{opacity:.2}}/><span style={{fontSize:12}}>Aucune règle — crée la première !</span>
          </div>}
          {(rules||[]).map(r=>(
            <div key={r.id} style={{background:T.bg2,border:`1px solid ${r.enabled?T.border:T.textFaint+"20"}`,borderRadius:14,padding:16,opacity:r.enabled?1:0.5}}>
              <div style={{...fl(8),marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:700,flex:1,color:T.text}}>{r.name}</span>
                <IAB T={T} Icon={Trash2} danger onClick={()=>del(r.id)}/>
              </div>
              <div style={{fontSize:11,color:T.textFaint,lineHeight:1.6}}>
                {r.conditions?.map((c,i)=><span key={i}>{i>0?` ${r.logic} `:"Si "}<strong style={{color:T.textSub}}>{c.field}</strong> {c.op.replace("_"," ")} "<em>{c.value}</em>"</span>)}
              </div>
              <div style={{...fl(6),marginTop:6,flexWrap:"wrap"}}>
                {r.actions?.map((act,i)=><span key={i} style={{padding:"2px 8px",background:AC.violetDim,color:AC.violet,borderRadius:10,fontSize:10,fontWeight:600}}>→ {act.type}: {act.value||""}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
}

// ── Follow-ups (relances non-répondues) ──────────────────────────────────────
function FollowUpsView({T,showToast}) {
  const [followups,setFollowups]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{apiFetch(`${API}/emails/follow-ups`).then(r=>r.json()).then(d=>setFollowups(d.follow_ups||[])).catch(()=>setFollowups([])).finally(()=>setLoading(false))},[])
  const dismiss=async(mid)=>{await apiFetch(`${API}/emails/follow-ups/${mid}/dismiss`,{method:"POST"});setFollowups(p=>p.filter(f=>f.id!==mid));showToast("Rappel supprimé")}
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad5,...fl(0,"center","center")}}><Bell size={22} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Relances</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Emails envoyés sans réponse</p></div>
        <button onClick={()=>{setLoading(true);apiFetch(`${API}/emails/follow-ups`).then(r=>r.json()).then(d=>setFollowups(d.follow_ups||[])).finally(()=>setLoading(false))}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><RefreshCw size={16}/></button>
      </div>
      {followups.length===0?<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,background:T.bg2,borderRadius:16,border:`1px solid ${T.border}`,color:T.textFaint}}>
        <Check size={40} color={AC.green} style={{opacity:.5}}/><span style={{fontSize:14}}>Aucune relance en attente — tout est traité !</span>
      </div>:(followups||[]).map(f=>(
        <div key={f.id} style={{background:T.bg2,border:`2px solid ${AC.orange}30`,borderRadius:16,padding:20,marginBottom:12,...fl(14)}}>
          <div style={{width:44,height:44,borderRadius:14,background:AC.orangeDim,...fl(0,"center","center"),flexShrink:0}}><Bell size={20} color={AC.orange}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>{f.subject}</div>
            <div style={{fontSize:12,color:T.textSub,...fl(6)}}><span>À: {f.to}</span><span style={{color:AC.orange,fontWeight:600}}>· {f.days_waiting}j sans réponse</span></div>
          </div>
          <div style={{...fl(8),flexShrink:0}}>
            <Btn T={T} variant="secondary" onClick={()=>{window.open(`mailto:${f.to}?subject=Re: ${f.subject}`)}} style={{fontSize:11,padding:"6px 12px"}}><Reply size={11}/> Relancer</Btn>
            <Btn T={T} variant="ghost" onClick={()=>dismiss(f.id)} style={{fontSize:11,padding:"6px 12px"}}><X size={11}/> Ignorer</Btn>
          </div>
        </div>
      ))}
    </div>
  </div>
}

// ── Rapport hebdomadaire ──────────────────────────────────────────────────────
function WeeklyReportView({T}) {
  const [report,setReport]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{apiFetch(`${API}/reports/weekly`).then(r=>r.json()).then(setReport).catch(()=>setReport({report:"Erreur de génération",week_emails:0,week_sent:0})).finally(()=>setLoading(false))},[])
  if(loading) return <div style={{flex:1,...fl(0,"center","center"),flexDirection:"column",gap:12}}><Spin size={32}/><span style={{color:T.textFaint,fontSize:13}}>Génération du rapport...</span></div>
  if(!report) return null
  const refresh=()=>{setLoading(true);apiFetch(`${API}/reports/weekly`).then(r=>r.json()).then(setReport).finally(()=>setLoading(false))}
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad1,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.blueGlow}`}}><BarChart3 size={22} color="#fff"/></div>
        <div style={{flex:1}}><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Rapport de la semaine</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Analyse IA de tes 7 derniers jours</p></div>
        <button onClick={refresh} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,...fl(0,"center","center")}}><RefreshCw size={16}/></button>
      </div>
      <div style={{...grd("1fr 1fr",14),marginBottom:24}}>
        {[{l:"Emails reçus",v:report.week_emails,c:AC.blue,Icon:Inbox},{l:"Emails envoyés",v:report.week_sent,c:AC.green,Icon:Send}].map(({l,v,c,Icon})=>(
          <div key={l} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,textAlign:"center"}}>
            <div style={{width:44,height:44,borderRadius:14,background:`${c}15`,color:c,...fl(0,"center","center"),margin:"0 auto 12px"}}><Icon size={20}/></div>
            <div style={{fontSize:32,fontWeight:900,color,letterSpacing:"-0.04em"}}>{v}</div>
            <div style={{fontSize:12,color:T.textSub,marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:28}}>
        <div style={{...fl(8),marginBottom:16}}><Sparkles size={15} color={AC.indigo}/><span style={{fontSize:13,fontWeight:800,color:AC.indigo,letterSpacing:"0.06em"}}>BILAN IA</span></div>
        <p style={{fontSize:14,lineHeight:1.85,color:T.text,whiteSpace:"pre-wrap"}}>{report.report}</p>
      </div>
    </div>
  </div>
}

// ── Export / Import des données ───────────────────────────────────────────────
function ExportView({T,showToast}) {
  const [importing,setImporting]=useState(false)
  const exportAll=async()=>{
    try{
      const backend=await apiFetch(`${API}/backup/export`).then(r=>r.json())
      const local={emailai_settings:JSON.parse(localStorage.getItem("emailai_settings")||"{}"),emailai_profile:JSON.parse(localStorage.getItem("emailai_profile")||"{}"),emailai_templates:JSON.parse(localStorage.getItem("emailai_templates")||"[]")}
      const full={...backend,local_data:local}
      const blob=new Blob([JSON.stringify(full,null,2)],{type:"application/json"})
      const url=URL.createObjectURL(blob)
      const link=document.createElement("a");link.href=url;link.download=`emailai-backup-${new Date().toISOString().slice(0,10)}.json`;link.click()
      URL.revokeObjectURL(url)
      showToast("Sauvegarde téléchargée !")
    }catch(e){showToast("Erreur export","err")}
  }
  const importFile=async(e)=>{
    const file=e.target.files?.[0]; if(!file) return
    setImporting(true)
    try{
      const txt=await file.text()
      const data=JSON.parse(txt)
      // Restaurer localStorage
      if(data.local_data){
        if(data.local_data.emailai_settings) localStorage.setItem("emailai_settings",JSON.stringify(data.local_data.emailai_settings))
        if(data.local_data.emailai_profile)   localStorage.setItem("emailai_profile",JSON.stringify(data.local_data.emailai_profile))
        if(data.local_data.emailai_templates) localStorage.setItem("emailai_templates",JSON.stringify(data.local_data.emailai_templates))
      }
      // Restaurer backend
      if(data.data){
        await apiFetch(`${API}/backup/import`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:data.data,version:data.version||"1.0"})})
      }
      showToast("Données importées ! Rechargement...")
      setTimeout(()=>window.location.reload(),1500)
    }catch(e){showToast("Fichier invalide: "+e.message,"err")}finally{setImporting(false)}
  }
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:640,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad3,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.greenGlow}`}}><Download size={22} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Sauvegarde & Export</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Exporter ou importer toutes tes données EmailAI</p></div>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:28,marginBottom:20}}>
        <div style={{...fl(8),marginBottom:16}}><Download size={16} color={AC.blue}/><span style={{fontSize:14,fontWeight:700}}>Exporter toutes les données</span></div>
        <p style={{fontSize:13,color:T.textSub,lineHeight:1.7,marginBottom:20}}>Télécharge un fichier <code style={{background:T.bg4,padding:"1px 6px",borderRadius:5,fontSize:12}}>.json</code> contenant :<br/>• Préférences & thème • Profil & signature • Templates • Mots interdits • Règles automatiques • Config IA • Recherches sauvegardées</p>
        <Btn T={T} variant="primary" onClick={exportAll} full style={{padding:"12px 24px",fontSize:14}}><Download size={16}/> Télécharger la sauvegarde</Btn>
      </div>
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:28}}>
        <div style={{...fl(8),marginBottom:16}}><Upload size={16} color={AC.violet}/><span style={{fontSize:14,fontWeight:700}}>Importer une sauvegarde</span></div>
        <p style={{fontSize:13,color:T.textSub,lineHeight:1.7,marginBottom:20}}>⚠️ L'importation remplace tes données actuelles. L'application se rechargera automatiquement.</p>
        <label style={{display:"block",padding:"32px",border:`2px dashed ${T.border}`,borderRadius:12,textAlign:"center",cursor:"pointer",color:T.textFaint,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=AC.violet} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          {importing?<><Spin size={18} color={AC.violet}/> Importation...</>:<><Upload size={24} style={{display:"block",margin:"0 auto 8px",opacity:.4}}/><span style={{fontSize:13}}>Clique pour choisir un fichier .json</span></>}
          <input type="file" accept=".json" onChange={importFile} disabled={importing} style={{display:"none"}}/>
        </label>
      </div>
    </div>
  </div>
}


// ── GitHub & Analyse automatique ─────────────────────────────────────────────
function GitHubView({T,showToast}) {
  const [status,setStatus]=useState(null)
  const [loading,setLoading]=useState(true)
  const [running,setRunning]=useState(false)
  const [configSaving,setConfigSaving]=useState(false)
  const [interval,setIntervalMin]=useState(5)
  const [autoEnabled,setAutoEnabled]=useState(false)
  const [maxEmails,setMaxEmails]=useState(20)
  const [lastReport,setLastReport]=useState(null)

  const load=()=>{
    apiFetch(`${API}/cron/status`).then(r=>r.json()).then(d=>{
      setStatus(d);setAutoEnabled(d.auto_run_enabled||false)
      setIntervalMin(d.auto_run_interval_min||5)
      setLastReport(d.last_report)
    }).catch(console.error).finally(()=>setLoading(false))
  }
  useEffect(()=>{load();const id=setInterval(load,15000);return()=>clearInterval(id)},[])

  const saveCronConfig=async()=>{
    setConfigSaving(true)
    try{
      await apiFetch(`${API}/cron/config?enabled=${autoEnabled}&interval_min=${interval}`,{method:"POST"})
      showToast(autoEnabled?`Analyse auto activée (toutes les ${interval} min) !`:"Analyse auto désactivée")
      load()
    }catch(e){showToast("Erreur: "+e.message,"err")}finally{setConfigSaving(false)}
  }

  const runNow=async()=>{
    setRunning(true);showToast("Cycle en cours... (peut prendre 1-2 min)")
    try{
      const r=await apiFetch(`${API}/cron/run?max_emails=${maxEmails}`,{method:"POST"})
      const d=await r.json();if(!r.ok)throw new Error(d.detail)
      setLastReport(d)
      showToast(`Terminé ! ${d.classified} classifiés, ${d.analyzed} analysés (${d.duration_s}s)`)
    }catch(e){showToast("Erreur: "+e.message,"err")}finally{setRunning(false)}
  }

  const copyWorkflow=()=>{
    const workflow=`# Colle ce code dans .github/workflows/auto-analyze.yml
name: EmailAI Auto-Analyze
on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Run analysis
        run: |
          curl -s -X POST \
            "\${{ secrets.EMAILAI_API_URL }}/cron/run?max_emails=20" \
            -H "X-Cron-Secret: \${{ secrets.EMAILAI_CRON_SECRET }}"
`
    navigator.clipboard.writeText(workflow)
    showToast("Workflow copié !")
  }

  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>

  const StatusDot=({ok})=><span style={{width:9,height:9,borderRadius:"50%",background:ok?AC.green:AC.red,display:"inline-block",animation:ok?"pulse 2s infinite":"none"}}/>

  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>
      {/* Header */}
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#24292E,#444D56)",...fl(0,"center","center"),boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </div>
        <div style={{flex:1}}>
          <h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>GitHub & Analyse auto</h2>
          <p style={{color:T.textSub,fontSize:13,marginTop:3}}>Analyse automatique toutes les 5 min — locale ou via GitHub Actions</p>
        </div>
      </div>

      {/* Statut connexions */}
      <div style={{...grd("1fr 1fr",14),marginBottom:24}}>
        {[
          {l:"Gmail",ok:status?.gmail_connected,desc:status?.gmail_connected?"Connecté et opérationnel":"Non connecté"},
          {l:"Analyse auto",ok:status?.auto_run_enabled,desc:status?.auto_run_enabled?`Active (/${status.auto_run_interval_min}min)`:"Désactivée"},
          {l:"Secret cron",ok:status?.cron_secret_set,desc:status?.cron_secret_set?"EMAILAI_CRON_SECRET configuré":"Non configuré (pas de protection)"},
          {l:"GitHub Actions",ok:false,desc:"Configurer ci-dessous"},
        ].map(({l,ok,desc})=>(
          <div key={l} style={{background:T.bg2,border:`1px solid ${ok?AC.green+"30":T.border}`,borderRadius:14,padding:"16px 18px",...fl(10)}}>
            <StatusDot ok={ok}/>
            <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{l}</div><div style={{fontSize:11,color:T.textSub,marginTop:2}}>{desc}</div></div>
          </div>
        ))}
      </div>

      {/* Config cron local */}
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{...fl(10),marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:11,background:autoEnabled?AC.greenDim:T.bg4,...fl(0,"center","center")}}><Clock size={18} color={autoEnabled?AC.green:T.textFaint}/></div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Analyse automatique locale</div><div style={{fontSize:12,color:T.textSub,marginTop:2}}>S'exécute dans le backend pendant que l'app tourne</div></div>
          <Tog T={T} on={autoEnabled} set={setAutoEnabled} color={AC.green}/>
        </div>
        {autoEnabled&&<>
          <div style={{...fl(12,"center"),marginBottom:16,padding:"12px 16px",background:T.bg3,borderRadius:12}}>
            <Clock size={13} color={T.textSub}/><span style={{fontSize:13}}>Toutes les</span>
            <Sel T={T} value={String(interval)} onChange={v=>setIntervalMin(Number(v))} options={[["1","1 minute"],["2","2 minutes"],["5","5 minutes"],["10","10 minutes"],["15","15 minutes"],["30","30 minutes"]]}/>
            <span style={{fontSize:13,color:T.textSub}}>— max</span>
            <Sel T={T} value={String(maxEmails)} onChange={v=>setMaxEmails(Number(v))} options={[["5","5 emails"],["10","10 emails"],["15","15 emails"],["20","20 emails"],["30","30 emails"]]}/>
          </div>
          <div style={{padding:"12px 16px",background:AC.blueDim,borderRadius:10,marginBottom:16,fontSize:12,color:AC.blue,...fl(8)}}>
            <Info size={13} style={{flexShrink:0}}/>Chaque cycle consomme ~{maxEmails*2} appels API Groq · Quota journalier : 14 400
          </div>
        </>}
        <div style={{...fl(8)}}>
          <Btn T={T} variant="primary" onClick={saveCronConfig} disabled={configSaving} style={{flex:1}}>
            {configSaving?<Spin size={13} color="#fff"/>:<Check size={13}/>} {autoEnabled?"Activer l'analyse auto":"Sauvegarder"}
          </Btn>
          <Btn T={T} variant="secondary" onClick={runNow} disabled={running||!status?.gmail_connected} style={{flex:1}}>
            {running?<Spin size={13} color={AC.blue}/>:<Zap size={13}/>} {running?"Analyse en cours...":"Lancer maintenant"}
          </Btn>
        </div>
      </div>

      {/* Dernier rapport */}
      {lastReport&&<div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{...fl(8),marginBottom:16}}><Activity size={15} color={AC.violet}/><span style={{fontSize:14,fontWeight:700}}>Dernier cycle</span><span style={{marginLeft:"auto",fontSize:11,color:T.textFaint}}>{lastReport.started_at} · {lastReport.duration_s}s · source: {lastReport.source}</span></div>
        <div style={{...grd("repeat(4,1fr)",10)}}>
          {[{l:"Emails traités",v:lastReport.emails_processed,c:AC.blue},{l:"Classifiés",v:lastReport.classified,c:AC.violet},{l:"Analysés",v:lastReport.analyzed,c:AC.indigo},{l:"Règles",v:lastReport.rules_applied,c:AC.green}].map(({l,v,c})=>(
            <div key={l} style={{background:T.bg3,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:900,color:c}}>{v}</div>
              <div style={{fontSize:11,color:T.textSub,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        {lastReport.errors?.length>0&&<div style={{marginTop:14,padding:"10px 14px",background:AC.orangeDim,borderRadius:10,fontSize:12,color:AC.orange}}>
          ⚠️ {lastReport.errors.length} erreur(s) : {lastReport.errors.slice(0,2).join(" · ")}
        </div>}
      </div>}

      {/* GitHub Actions setup */}
      <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{...fl(10),marginBottom:20}}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill={T.text}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>GitHub Actions (si déployé)</div><div style={{fontSize:12,color:T.textSub,marginTop:2}}>Analyse toutes les 5 min même si l'app est sur un serveur distant</div></div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:T.textSub,marginBottom:10,letterSpacing:"0.06em"}}>ÉTAPES DE CONFIGURATION</div>
          {[
            {n:1,l:"Publie ce repo sur GitHub",sub:"git init && git add . && git commit -m 'init' && git remote add origin URL && git push"},
            {n:2,l:"Déploie l'app sur Railway ou Render",sub:"Voir DEPLOY.md · Gratuit jusqu'à 500h/mois"},
            {n:3,l:"Ajoute les secrets GitHub",sub:"Settings → Secrets → Actions : EMAILAI_API_URL + EMAILAI_CRON_SECRET"},
            {n:4,l:"Le workflow se déclenche automatiquement",sub:".github/workflows/auto-analyze.yml déjà inclus dans le projet"},
          ].map(({n,l,sub})=>(
            <div key={n} style={{...fl(14,"flex-start"),marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:28,height:28,borderRadius:9,background:AC.indigoDim,color:AC.indigo,...fl(0,"center","center"),fontSize:12,fontWeight:800,flexShrink:0}}>{n}</div>
              <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{l}</div><div style={{fontSize:11,color:T.textFaint,marginTop:3,fontFamily:"'Courier New',monospace",lineHeight:1.5}}>{sub}</div></div>
            </div>
          ))}
        </div>
        <div style={{...fl(8)}}>
          <Btn T={T} variant="ghost" onClick={copyWorkflow} style={{fontSize:12,padding:"8px 16px"}}><Copy size={12}/> Copier le workflow</Btn>
          <Btn T={T} variant="ghost" onClick={()=>{const a2=document.createElement("a");a2.href="data:text/plain,"+encodeURIComponent("EMAILAI_API_URL=https://ton-app.railway.app\nEMAILAI_CRON_SECRET=change-moi\nGROQ_API_KEY=gsk_xxxxx");a2.download=".env.example";a2.click()}} style={{fontSize:12,padding:"8px 16px"}}><Download size={12}/> .env.example</Btn>
        </div>
      </div>

      {/* Variables d'env */}
      <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
        <div style={{fontSize:12,fontWeight:700,color:T.textSub,marginBottom:10,letterSpacing:"0.06em"}}>VARIABLES D'ENVIRONNEMENT (.env)</div>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:12,lineHeight:2,color:T.text}}>
          {[
            ["GROQ_API_KEY","gsk_xxxxxx (Groq Console)"],
            ["EMAILAI_API_TOKEN","(généré automatiquement au 1er démarrage)"],
            ["EMAILAI_CRON_SECRET","chaine-aleatoire-secrete"],
            ["EMAILAI_API_URL","https://ton-app.railway.app (si déployé)"],
          ].map(([k,v])=><div key={k}><span style={{color:AC.cyan}}>{k}</span>=<span style={{color:AC.gold}}>{v}</span></div>)}
          <div style={{marginTop:12,...fl(8)}}>
            <span style={{fontSize:11,color:T.textFaint}}>Ton token actuel: </span>
            <code style={{fontSize:11,color:AC.cyan,background:T.bg4,padding:"2px 8px",borderRadius:5}}>{getApiToken()?getApiToken().slice(0,12)+"...":"Non configuré"}</code>
            <button onClick={()=>{navigator.clipboard.writeText(getApiToken());}} style={{fontSize:10,color:AC.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Copier</button>
            <button onClick={()=>setShowTokenModal(true)} style={{fontSize:10,color:AC.orange,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Reconfigurer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
}


// ════════════════════════════════════════════════════════════
// NOUVELLES VUES — Toutes gratuites
// ════════════════════════════════════════════════════════════

// ── 1. TasksView — Tâches extraites de l inbox ──────────────
function TasksView({T,showToast}) {
  const [tasks,setTasks]=useState(null),[loading,setLoading]=useState(false)
  const cached = ()=>apiFetch(`${API}/emails/tasks/cached`).then(r=>r.json()).then(d=>{setTasks(d.tasks||[])})
  useEffect(()=>{cached()},[])
  const scan=async()=>{
    setLoading(true);showToast("Scan des emails en cours (30-60s)...","info")
    try{const d=await apiFetch(`${API}/emails/extract-tasks`).then(r=>r.json());setTasks(d.tasks||[]);showToast(`${d.count} tâches trouvées !`)}
    catch(e){showToast("Erreur scan","err")}finally{setLoading(false)}
  }
  const done=async(i)=>{
    await apiFetch(`${API}/emails/tasks/${i}/done`,{method:"POST"})
    setTasks(p=>(p||[]).map((t,idx)=>idx===i?{...t,done:true}:t))
  }
  const del=async(i)=>{
    await apiFetch(`${API}/emails/tasks/${i}`,{method:"DELETE"})
    setTasks(p=>(p||[]).filter((_,idx)=>idx!==i))
  }
  const pColors={"haute":AC.red,"normale":AC.blue,"basse":AC.green}
  const pending=(tasks||[]).filter(t=>!t.done)
  const done_tasks=(tasks||[]).filter(t=>t.done)
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad5,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.orangeDim}`}}><CheckSquare size={24} color="#fff"/></div>
        <div style={{flex:1}}><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Tâches extraites</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>L'IA scanne tes emails et extrait les actions à faire</p></div>
        <Btn T={T} variant="primary" onClick={scan} disabled={loading} style={{padding:"10px 20px"}}>
          {loading?<Spin size={13} color="#fff"/>:<Zap size={13}/>} {loading?"Scan...":"Scanner l'inbox"}
        </Btn>
      </div>
      {tasks===null&&<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,color:T.textFaint}}>
        <CheckSquare size={48} style={{opacity:.2}}/><span>Clique sur "Scanner" pour détecter les tâches</span>
      </div>}
      {pending.length>0&&<>
        <div style={{fontSize:11,fontWeight:800,color:T.textSub,marginBottom:12,letterSpacing:"0.06em",...fl(6)}}><Circle size={11}/> À FAIRE ({pending.length})</div>
        {(tasks||[]).map((t,i)=>t.done?null:<div key={i} className="card-hover" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",...fl(14),marginBottom:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:pColors[t.priority]||AC.blue,flexShrink:0,marginTop:4}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>{t.action}</div>
            <div style={{...fl(8),flexWrap:"wrap",gap:6}}>
              {t.deadline&&<span style={{fontSize:11,color:AC.orange,...fl(4)}}><Calendar size={9}/> {t.deadline}</span>}
              <span style={{fontSize:11,color:T.textFaint}}>📧 {t.email_subject?.slice(0,40)}</span>
            </div>
          </div>
          <div style={{...fl(6)}}>
            <IAB T={T} Icon={CheckSquare} title="Fait" onClick={()=>done(i)} style={{color:AC.green}}/>
            <IAB T={T} Icon={X} danger onClick={()=>del(i)}/>
          </div>
        </div>)}
      </>}
      {done_tasks.length>0&&<div style={{marginTop:20,opacity:.5}}>
        <div style={{fontSize:11,fontWeight:800,color:T.textFaint,marginBottom:8,letterSpacing:"0.06em",...fl(6)}}><CheckSquare size={11}/> TERMINÉES ({done_tasks.length})</div>
        {(tasks||[]).map((t,i)=>!t.done?null:<div key={i} style={{background:T.bg3,borderRadius:12,padding:"10px 14px",...fl(10),marginBottom:6}}>
          <span style={{fontSize:12,textDecoration:"line-through",color:T.textFaint}}>{t.action}</span>
          <IAB T={T} Icon={Trash2} danger onClick={()=>del(i)} style={{marginLeft:"auto"}}/>
        </div>)}
      </div>}
    </div>
  </div>
}

// ── 2. BatchUnsubView — Désabonnement en masse ───────────────
function BatchUnsubView({T,showToast}) {
  const [newsletters,setNewsletters]=useState(null),[loading,setLoading]=useState(true)
  const [archiving,setArchiving]=useState({})
  useEffect(()=>{
    apiFetch(`${API}/emails/newsletters`).then(r=>r.json()).then(d=>setNewsletters(d.newsletters||[])).catch(()=>setNewsletters([])).finally(()=>setLoading(false))
  },[])
  const archive=async(n,i)=>{
    setArchiving(p=>({...p,[i]:true}))
    try{
      await apiFetch(`${API}/emails/batch-archive-newsletter?sender_email=${encodeURIComponent(n.email)}`,{method:"POST"})
      showToast(`${n.count} emails de ${n.email.slice(0,30)} archivés !`)
      setNewsletters(p=>(p||[]).filter((_,idx)=>idx!==i))
    }catch{showToast("Erreur","err")}
    finally{setArchiving(p=>({...p,[i]:false}))}
  }
  const openUnsub=(n)=>{
    const link = n.unsubscribe_link
    if(!link) return showToast("Pas de lien de désabonnement trouvé","warn")
    const url = link.match(/https?:\/\/[^\s>]+/)?.[0]
    if(url) window.open(url,"_blank")
    else showToast("Lien non reconnu","warn")
  }
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#EF4444,#B91C1C)",...fl(0,"center","center")}}><MailX size={24} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Newsletters & Listes</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Désabonne-toi et nettoie ta boite en un clic</p></div>
      </div>
      {(!newsletters||newsletters.length===0)?<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,color:T.textFaint}}>
        <MailX size={48} style={{opacity:.2}}/><span>Aucune newsletter détectée dans les 30 derniers jours</span>
      </div>:<>
        <div style={{padding:"10px 16px",background:AC.blueDim,borderRadius:12,marginBottom:20,fontSize:12,color:AC.blue,...fl(8)}}>
          <Info size={13}/> {newsletters.length} expéditeurs détectés — Archive pour masquer, Désabonne pour ne plus recevoir
        </div>
        {(newsletters||[]).map((n,i)=>(
          <div key={i} className="card-hover" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",...fl(14),marginBottom:10}}>
            <div style={{width:42,height:42,borderRadius:13,background:senderColor(n.email),...fl(0,"center","center"),fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>{n.email[0]?.toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.sender?.split("<")[0]?.trim()||n.email}</div>
              <div style={{fontSize:11,color:T.textFaint,marginTop:2}}>{n.email} · {n.count} email{n.count>1?"s":""}</div>
            </div>
            <div style={{...fl(8),flexShrink:0}}>
              {n.unsubscribe_link&&<Btn T={T} variant="secondary" onClick={()=>openUnsub(n)} style={{fontSize:11,padding:"6px 12px"}}><ExternalLink size={10}/> Se désabonner</Btn>}
              <Btn T={T} variant="ghost" onClick={()=>archive(n,i)} disabled={archiving[i]} style={{fontSize:11,padding:"6px 12px",color:AC.orange,borderColor:AC.orange+"30"}}>
                {archiving[i]?<Spin size={11} color={AC.orange}/>:<Archive size={10}/>} Archiver tout
              </Btn>
            </div>
          </div>
        ))}
      </>}
    </div>
  </div>
}

// ── 3. CalendarView — Emails avec événements ─────────────────
function CalendarView({T,showToast}) {
  const [events,setEvents]=useState(null),[loading,setLoading]=useState(true),[selected,setSelected]=useState(null)
  useEffect(()=>{
    // Chercher les emails avec des dates dans le sujet ou corps
    apiFetch(`${API}/emails?q=is:inbox+has:&max_results=30`).then(r=>r.json()).then(async d=>{
      const emails = d.emails||[]
      const evts = []
      for(const e of emails.slice(0,20)){
        try{
          const ev = await apiFetch(`${API}/emails/${e.id}/calendar-event`).then(r=>r.json())
          if(ev.has_event) evts.push({...ev,email_id:e.id,email_subject:e.subject,email_from:e.from})
        }catch{}
        await new Promise(r=>setTimeout(r,200))
      }
      setEvents(evts)
    }).catch(()=>setEvents([])).finally(()=>setLoading(false))
  },[])
  if(loading) return <div style={{flex:1,...fl(0,"center","center"),flexDirection:"column",gap:12}}><Spin size={32}/><span style={{color:T.textFaint,fontSize:13}}>Détection des événements...</span></div>
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad1,...fl(0,"center","center"),boxShadow:`0 4px 20px ${AC.blueGlow}`}}><Calendar size={24} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Calendrier</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Événements et réunions détectés dans tes emails</p></div>
      </div>
      {(!events||events.length===0)?<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,color:T.textFaint}}>
        <Calendar size={48} style={{opacity:.2}}/><span>Aucun événement détecté</span>
      </div>:<div style={{display:"flex",flexDirection:"column",gap:12}}>
        {(events||[]).map((ev,i)=><div key={i} className="card-hover" onClick={()=>setSelected(selected===i?null:i)} style={{background:T.bg2,border:`1px solid ${selected===i?AC.blue:T.border}`,borderRadius:16,padding:"18px 22px",cursor:"pointer"}}>
          <div style={{...fl(14)}}>
            <div style={{width:48,height:48,borderRadius:14,background:AC.grad1,...fl(0,"center","center"),flexShrink:0}}>
              <Calendar size={20} color="#fff"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{ev.title||ev.email_subject}</div>
              <div style={{...fl(10),flexWrap:"wrap",gap:8}}>
                {ev.date&&<span style={{fontSize:12,color:AC.blue,...fl(4)}}><Calendar size={10}/>{ev.date}</span>}
                {ev.time&&<span style={{fontSize:12,color:AC.violet,...fl(4)}}><Clock size={10}/>{ev.time}</span>}
                {ev.location&&<span style={{fontSize:12,color:AC.green,...fl(4)}}><MapPin size={10}/>{ev.location}</span>}
                {ev.duration&&<span style={{fontSize:12,color:T.textSub,...fl(4)}}><Timer size={10}/>{ev.duration}</span>}
              </div>
            </div>
          </div>
          {selected===i&&ev.description&&<div style={{marginTop:12,padding:"10px 14px",background:T.bg3,borderRadius:10,fontSize:12,color:T.textSub,lineHeight:1.6}}>{ev.description}</div>}
          {selected===i&&ev.participants?.length>0&&<div style={{marginTop:8,fontSize:11,color:T.textFaint}}>👥 {ev.participants.join(", ")}</div>}
        </div>)}
      </div>}
    </div>
  </div>
}

// ── 4. AIHistoryView — Historique des analyses ───────────────
function AIHistoryView({T}) {
  const [history,setHistory]=useState(null),[loading,setLoading]=useState(true)
  useEffect(()=>{
    apiFetch(`${API}/ai-history`).then(r=>r.json()).then(d=>setHistory(d.history||[])).catch(()=>setHistory([])).finally(()=>setLoading(false))
  },[])
  if(loading) return <div style={{flex:1,...fl(0,"center","center")}}><Spin size={32}/></div>
  const sentColors={"Positif":AC.green,"Neutre":"#64748B","Negatif":AC.orange,"Urgent":AC.red}
  return <div style={{flex:1,overflowY:"auto",padding:"32px 40px",color:T.text}}>
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{...fl(14),marginBottom:28}}>
        <div style={{width:52,height:52,borderRadius:16,background:AC.grad2,...fl(0,"center","center")}}><History size={24} color="#fff"/></div>
        <div><h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em"}}>Historique IA</h2><p style={{color:T.textSub,fontSize:13,marginTop:3}}>Toutes tes analyses sauvegardées — zéro re-consommation de quota</p></div>
      </div>
      {(!history||history.length===0)?<div style={{...fl(0,"center","center"),flexDirection:"column",gap:12,padding:60,color:T.textFaint}}>
        <History size={48} style={{opacity:.2}}/><span>Aucune analyse enregistrée — analyse un email pour commencer</span>
      </div>:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {(history||[]).map((h,i)=><div key={i} className="card-hover" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px"}}>
          <div style={{...fl(8),marginBottom:8,flexWrap:"wrap"}}>
            <CatBadge cat={h.category} T={T}/>
            {h.priority&&<Chip label={h.priority} color={h.priority==="Haute"?AC.red:h.priority==="Normale"?AC.blue:AC.green} T={T}/>}
            {h.sentiment&&<span style={{fontSize:10,fontWeight:700,color:sentColors[h.sentiment]||T.textFaint,padding:"2px 7px",borderRadius:9,background:`${sentColors[h.sentiment]||T.textFaint}15`}}>{h.sentiment}</span>}
          </div>
          <p style={{fontSize:12,color:T.textSub,lineHeight:1.6,margin:0}}>{h.summary||"Analyse disponible"}</p>
          {h.analyzed_at&&<div style={{fontSize:10,color:T.textFaint,marginTop:6}}>{new Date(h.analyzed_at*1000).toLocaleDateString("fr-FR")}</div>}
        </div>)}
      </div>}
    </div>
  </div>
}

// ── 5. ToneBar — Analyse de ton en temps réel ────────────────
function ToneBar({T,text}) {
  const [tone,setTone]=useState(null),[loading,setLoading]=useState(false)
  useEffect(()=>{
    if(!text||text.length<20){setTone(null);return}
    const timer=setTimeout(async()=>{
      setLoading(true)
      try{
        const d=await apiFetch(`${API}/emails/analyze-tone`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})}).then(r=>r.json())
        setTone(d)
      }catch{}finally{setLoading(false)}
    },1500) // Debounce 1.5s
    return()=>clearTimeout(timer)
  },[text])
  if(!text||text.length<20) return null
  const toneColors={"professionnel":AC.blue,"amical":AC.green,"agressif":AC.red,"urgent":AC.orange,"neutre":"#64748B","formel":AC.indigo}
  const tc=toneColors[tone?.tone]||T.textFaint
  return <div style={{padding:"8px 14px",background:T.bg3,borderRadius:10,marginTop:8,...fl(10),flexWrap:"wrap",gap:8}}>
    {loading&&<><Spin size={11} color={T.textFaint}/><span style={{fontSize:11,color:T.textFaint}}>Analyse du ton...</span></>}
    {tone&&!loading&&<>
      <span style={{fontSize:11,fontWeight:700,color:tc,padding:"2px 8px",background:`${tc}15`,borderRadius:8}}>{tone.tone}</span>
      <span style={{fontSize:11,color:T.textFaint}}>Score: {tone.score}/100</span>
      {tone.is_too_long&&<span style={{fontSize:11,color:AC.orange}}>⚠ Trop long</span>}
      {tone.reading_time_seconds&&<span style={{fontSize:11,color:T.textFaint}}>⏱ {tone.reading_time_seconds}s de lecture</span>}
      {(tone.suggestions||[]).slice(0,1).map((s,i)=><span key={i} style={{fontSize:11,color:T.textSub,fontStyle:"italic"}}>💡 {s}</span>)}
    </>}
  </div>
}

// ── 6. BestTimeIndicator — Meilleur moment d envoi ───────────
function BestTimeIndicator({T}) {
  const [data,setData]=useState(null)
  useEffect(()=>{
    cachedFetch(`${API}/emails/best-send-time`,600000).then(setData).catch(()=>{})
  },[])
  if(!data) return null
  const now=new Date()
  const isGoodTime=Math.abs(now.getHours()-data.best_hour)<=2&&now.getDay()===data.best_day_idx
  return <div style={{...fl(6),padding:"6px 12px",background:isGoodTime?AC.greenDim:T.bg3,border:`1px solid ${isGoodTime?AC.green+"30":T.border}`,borderRadius:9,fontSize:11,color:isGoodTime?AC.green:T.textFaint}}>
    {isGoodTime?"✓ Bon moment d'envoyer":"🕐 Meilleur: "+data.best_day+" "+data.best_hour_label}
  </div>
}

// ── 7. SignaturePicker — Signatures multiples ────────────────
function SignaturePicker({T,onSelect}) {
  const profile = JSON.parse(localStorage.getItem("emailai_profile")||"{}")
  const signatures = [
    {label:"Complète",text:profile.signature||""},
    {label:"Courte",text:(profile.name||"")+"\n"+(profile.title||"")},
    {label:"Sans signature",text:""},
  ].filter(s=>s.text!==undefined)
  const [open,setOpen]=useState(false)
  return <div style={{position:"relative"}}>
    <button onClick={()=>setOpen(p=>!p)} style={{...fl(4),padding:"5px 10px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:8,color:T.textSub,cursor:"pointer",fontFamily:"inherit",fontSize:11}}>
      ✍ Signature <ChevronDown size={10}/>
    </button>
    {open&&<div style={{position:"absolute",bottom:"100%",left:0,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:12,padding:8,zIndex:50,minWidth:160,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
      {signatures.map((s,i)=><button key={i} onClick={()=>{onSelect(s.text);setOpen(false)}} style={{display:"block",width:"100%",padding:"8px 12px",background:"none",border:"none",color:T.text,cursor:"pointer",textAlign:"left",fontFamily:"inherit",fontSize:12,borderRadius:8}}>
        {s.label}
      </button>)}
    </div>}
  </div>
}

// ── 8. NotificationSetup — Notifications push navigateur ─────
function NotificationSetup({T,showToast}) {
  const [perm,setPerm]=useState(()=>typeof Notification!=="undefined"?Notification.permission:"denied")
  const enable=async()=>{
    if(!("Notification" in window)){showToast("Navigateur non supporté","warn");return}
    const result=await Notification.requestPermission()
    setPerm(result)
    if(result==="granted") showToast("Notifications activées ! Tu seras alerté des emails VIP.")
    else showToast("Notifications refusées","warn")
  }
  const test=()=>{
    if(perm!=="granted"){showToast("Active d'abord les notifications","warn");return}
    new Notification("EmailAI",{body:"Test — Tu recevras des alertes comme celle-ci !",icon:"/mail.github.io/favicon.ico"})
  }
  return <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:16,padding:22,marginBottom:16}}>
    <div style={{...fl(10),marginBottom:14}}>
      <div style={{width:38,height:38,borderRadius:11,background:perm==="granted"?AC.greenDim:T.bg4,...fl(0,"center","center")}}><Bell size={17} color={perm==="granted"?AC.green:T.textFaint}/></div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700}}>Notifications navigateur</div>
        <div style={{fontSize:12,color:T.textSub,marginTop:2}}>Alertes pour les emails VIP même onglet en arrière-plan</div>
      </div>
      <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:perm==="granted"?AC.greenDim:T.bg4,color:perm==="granted"?AC.green:T.textFaint}}>
        {perm==="granted"?"Actif":perm==="denied"?"Bloqué":"En attente"}
      </span>
    </div>
    <div style={{...fl(8)}}>
      {perm!=="granted"&&<Btn T={T} variant="primary" onClick={enable} style={{flex:1,fontSize:12}}><Bell size={12}/> Activer</Btn>}
      {perm==="granted"&&<Btn T={T} variant="ghost" onClick={test} style={{fontSize:12,padding:"7px 14px"}}><Bell size={12}/> Tester</Btn>}
    </div>
  </div>
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [settings,setSettings]=useState(()=>ld("emailai_settings",DEFAULT_SETTINGS))
  const T={...THEMES[settings.theme||"dark"],...AC}
  const [auth,setAuth]=useState(false),[ready,setReady]=useState(false)
  const [emails,setEmails]=useState([]),[selected,setSelected]=useState(null)
  const [loading,setLoading]=useState(false),[tab,setTab]=useState("inbox")
  const [view,setView]=useState("emails"),[search,setSearch]=useState("")
  const [catFilter,setCatFilter]=useState(null)
  const [profile,setProfile]=useState(()=>ld("emailai_profile",DEFAULT_PROFILE))
  const [batchLoad,setBatchLoad]=useState(false),[toast,setToast]=useState(null)
  const [monitorActive,setMonitorActive]=useState(false)
  const [selectedIds,setSelectedIds]=useState(new Set())
  const [collapsed,setCollapsed]=useState(false)
  const [undoAction,setUndoAction]=useState(null)
  const [showShortcuts,setShowShortcuts]=useState(false)
  const [showAdvSearch,setShowAdvSearch]=useState(false)
  // Précharger l'email suivant pour navigation fluide
  useEmailPreload(emails, selected?.id)
  const [zenMode,setZenMode]=useState(false)
      const [showTokenModal,setShowTokenModal]=useState(!getApiToken())
  const [fontSize,setFontSize]=useState(()=>parseInt(localStorage.getItem("emailai_fontsize")||"14"))

  const showToast=(msg,type="ok")=>{
    const t=type==="err"||type==="error"?"err":type==="warn"?"warn":type==="info"?"info":"success"
    setToast({msg,type:t})
    const dur=t==="err"?5000:t==="warn"?4000:3000
    setTimeout(()=>setToast(null),dur)
  }
  const TABS=[
    {id:"inbox", label:"Inbox",   q:"is:inbox",  Icon:Inbox},
    {id:"unread",label:"Non lus", q:"is:unread", Icon:Mail},
    {id:"star",  label:"Favoris", q:"is:starred",Icon:Star},
    {id:"sent",  label:"Envoyes", q:"in:sent",   Icon:Send},
  ]
  const unread=emails.filter(e=>e.unread).length

  const loadEmails=useCallback(async(q,cat=null)=>{
    setLoading(true)
    try{const url=cat?`${API}/emails?category=${cat}&max_results=30`:`${API}/emails?q=${encodeURIComponent(q)}&max_results=30`;const d=await fetch(url).then(r=>r.json());setEmails(d.emails||[])}
    catch(e){console.error(e)}finally{setLoading(false)}
  },[])

  useEffect(()=>{
    apiFetch(`${API}/auth/status`).then(r=>r.json()).then(d=>{setAuth(d.authenticated);setReady(true)}).catch(()=>setReady(true))
    const id=setInterval(()=>apiFetch(`${API}/monitoring`).then(r=>r.json()).then(d=>setMonitorActive(d.active)).catch(()=>{}),15000)
    return()=>clearInterval(id)
  },[])

  // Raccourcis clavier globaux
  useEffect(()=>{
    const h=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT") return
      if(e.key==="?"||e.key=="/") setShowShortcuts(p=>!p)
      if(e.key==="Escape") { setShowShortcuts(false); setUndoAction(null); setZenMode(false) }
      if(e.key==="?"||e.key==="/") setShowShortcuts(p=>!p)
      if(e.key==="z"&&!e.ctrlKey) setZenMode(p=>!p)
      if(e.ctrlKey&&e.key==="z"&&undoAction) { undoAction.fn(); setUndoAction(null) }
      if(e.key==="z"&&!e.ctrlKey&&!e.metaKey&&!e.altKey) setZenMode(p=>!p)
      if(!selected) return
      if(e.key==="e"||e.key==="E") doAction(selected,"archive")
      if(e.key==="Delete") doAction(selected,"trash")
      if(e.key==="s"||e.key==="S") doAction(selected,"star")
      if(e.key==="u"||e.key==="U") doAction(selected,"unread")
      if(e.key==="z"&&(e.ctrlKey||e.metaKey)&&undoAction) handleUndo()
    }
    window.addEventListener("keydown",h)
    return()=>window.removeEventListener("keydown",h)
  },[selected,undoAction])

  useEffect(()=>{if(auth)loadEmails("is:inbox")},[auth,loadEmails])

  // Favicon dynamique + titre onglet
  useEffect(()=>{ updateFavicon(unread) },[unread])

  // SECURITE: écouter les erreurs 401 pour redemander le token
  useEffect(()=>{
    const h=()=>setShowTokenModal(true)
    window.addEventListener("emailai:auth_error", h)
    return()=>window.removeEventListener("emailai:auth_error",h)
  },[])

  // Taille de police appliquée globalement
  useEffect(()=>{
    document.documentElement.style.fontSize = fontSize+"px"
    localStorage.setItem("emailai_fontsize", fontSize)
  },[fontSize])

  // Auto-refresh toutes les 2 minutes si onglet actif
  useEffect(()=>{
    if(!auth) return
    const id=setInterval(()=>{
      if(!document.hidden && view==="emails") {
        loadEmails(TABS.find(t=>t.id===tab)?.q||"is:inbox",catFilter)
      }
    },120000)
    return()=>clearInterval(id)
  },[auth,tab,catFilter,view])

  // Notifications navigateur
  useEffect(()=>{
    if(settings.browserNotif && "Notification" in window && Notification.permission==="default") {
      Notification.requestPermission()
    }
  },[settings.browserNotif])

  const goTab=(t)=>{setTab(t.id);setView("emails");setSelected(null);setCatFilter(null);setSelectedIds(new Set());loadEmails(t.q)}
  const filterCat=(cat)=>{const nc=cat===catFilter?null:cat;setCatFilter(nc);setView("emails");setSelected(null);setSelectedIds(new Set());loadEmails("is:inbox",nc)}
  const refresh=()=>loadEmails(TABS.find(t=>t.id===tab)?.q||"is:inbox",catFilter)
  const logout=async()=>{await apiFetch(`${API}/auth/logout`,{method:"POST"});setAuth(false);setEmails([]);setSelected(null)}

  const doAction=async(id,action)=>{
    try{
      await apiFetch(`${API}/emails/${id}/action`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})})
      const labels={archive:"Archive",trash:"Supprime",star:"Favori",unstar:"Favori retire",read:"Marque lu",unread:"Marque non lu",spam:"Spam"}
      showToast(labels[action]||"OK")
      if(["archive","trash","spam"].includes(action)){
        const removed=emails.find(e=>e.id===id)
        setEmails(p=>p.filter(e=>e.id!==id))
        if(selected===id) setSelected(null)
        // FIX: Undo disponible pour archive/trash
        if(settings.undoEnabled!==false && ["archive","trash"].includes(action)){
          setUndoAction({type:action,id,email:removed})
        }
      }
      else setEmails(p=>p.map(e=>e.id===id?{...e,starred:action==="star"?true:action==="unstar"?false:e.starred,unread:action==="unread"?true:action==="read"?false:e.unread}:e))
    }catch{showToast("Erreur","err")}
  }
  const handleUndo=async()=>{
    if(!undoAction) return
    const {type,id,email:em}=undoAction
    setUndoAction(null)
    if(type==="archive"){
      await apiFetch(`${API}/emails/${id}/restore`,{method:"POST"}).catch(()=>{})
      if(em) setEmails(p=>[em,...p])
      showToast("Archive annule")
    } else if(type==="trash"){
      await apiFetch(`${API}/emails/${id}/action`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"unread"})}).catch(()=>{})
      if(em) setEmails(p=>[em,...p])
      showToast("Suppression annulee")
    }
  }

  const batchAnalyze=async()=>{
    if(!settings.enabled) return showToast("IA desactivee","err")
    const toAnalyze=emails.slice(0,8)
    if(!toAnalyze.length) return
    setBatchLoad(true)
    showToast(`Analyse de ${toAnalyze.length} emails...`)
    try{
      const ids=toAnalyze.map(e=>e.id)
      const r=await fetchWithTimeout(`${API}/emails/analyze-batch`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email_ids:ids,settings,profile})
      },120000) // 2 min timeout (3s par email * 10 max)
      const d=await r.json()
      if(d.results){
        setEmails(p=>p.map(e=>d.results[e.id]?{...e,...d.results[e.id]}:e))
        showToast(`${d.count} emails analyses !`)
      }
    }catch(e){
      showToast("Analyse interrompue: "+e.message,"err")
      console.error(e)
    }finally{setBatchLoad(false)}
  }

  const initials=((profile.firstName?.[0]||"")+(profile.lastName?.[0]||"")).toUpperCase()||"?"

  if(!ready) return <div style={{height:"100vh",...fl(0,"center","center"),background:"#080C18"}}><Spin size={40}/></div>
  if(!auth) return <AuthScreen T={T}/>

  return <ErrorBoundary theme={T}>
    <GlobalStyles/>
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,overflow:"hidden",color:T.text}}>
    <GS T={T}/>
    <div style={{width:zenMode?0:collapsed?60:220,display:"flex",flexDirection:"column",flexShrink:0,background:T.sidebar,transition:"width .28s cubic-bezier(.4,0,.2,1)",overflow:"hidden",position:"relative"}} className="sidebar-glow">
      <div style={{padding:"16px 12px 12px",borderBottom:`1px solid ${T.sidebarBorder}`,...fl(10)}}>
        <div style={{width:34,height:34,borderRadius:11,background:AC.grad1,...fl(0,"center","center"),boxShadow:`0 4px 14px ${AC.blueGlow}`,flexShrink:0}}><Mail size={18} color="#fff" strokeWidth={2}/></div>
        {!collapsed&&<>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>EmailAI</div>
            <div style={{fontSize:9,fontWeight:700,...fl(4),color:settings.enabled?"#34D399":"#F87171"}}>
              {monitorActive&&<span style={{width:6,height:6,borderRadius:"50%",background:"#34D399",animation:"pulse 2s infinite"}}/>}
              {settings.enabled?"IA active":"IA off"}
            </div>
          </div>
          <button onClick={()=>setShowShortcuts(true)} title="Raccourcis clavier (?)" style={{background:"none",border:"none",cursor:"pointer",color:"#3D5068",...fl(0,"center","center"),padding:2}}><Keyboard size={12}/></button>
          <button onClick={()=>setCollapsed(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#3D5068",...fl(0,"center","center"),padding:2}}><Minus size={14}/></button>
        </>}
        {collapsed&&<button onClick={()=>setCollapsed(false)} style={{position:"absolute",left:46,top:18,width:20,height:20,borderRadius:5,background:T.bg3,border:`1px solid ${T.border}`,cursor:"pointer",...fl(0,"center","center"),zIndex:10}}><ChevronRight size={11} color={T.textSub}/></button>}
      </div>
      {!collapsed&&<nav style={{flex:1,padding:"8px",overflowY:"auto"}}>
        <NL T={T}>MESSAGERIE</NL>
        {TABS.map(({id,label,q,Icon})=><NB key={id} T={T} Icon={Icon} label={label} active={view==="emails"&&tab===id&&!catFilter} onClick={()=>goTab({id,q})} badge={id==="inbox"?unread:id==="unread"?unread:0}/>)}
        <ND T={T}/>
        <NL T={T}>CATEGORIES</NL>
        {MAIN_CATS.map(cat=>{const m=CAT_META[cat];return <button key={cat} onClick={()=>filterCat(cat)} style={{width:"100%",textAlign:"left",padding:"7px 12px",background:catFilter===cat?`${m.color}14`:"transparent",border:`1px solid ${catFilter===cat?`${m.color}25`:"transparent"}`,borderRadius:10,color:catFilter===cat?m.color:"#5A6A8A",fontSize:13,cursor:"pointer",marginBottom:2,...fl(8),fontFamily:"inherit",fontWeight:catFilter===cat?700:400,transition:"all .12s"}}><span style={{fontSize:14}}>{m.icon}</span> {cat}</button>})}
        <ND T={T}/>
        <NL T={T}>OUTILS</NL>
        <NB T={T} Icon={PenLine}    label="Nouvel email"       active={view==="compose"}    onClick={()=>setView("compose")}/>
        <NB T={T} Icon={FileText}   label="Templates"          active={view==="templates"}  onClick={()=>setView("templates")}/>
        <NB T={T} Icon={Bot}        label="Automatisation"     active={view==="autoreply"}  onClick={()=>setView("autoreply")}  color={AC.green}/>
        <NB T={T} Icon={Filter}     label="Filtre de mots"     active={view==="wordfilter"} onClick={()=>setView("wordfilter")} color={AC.orange}/>
        <NB T={T} Icon={TrendingUp} label="Statistiques"       active={view==="stats"}      onClick={()=>setView("stats")}      color={AC.violet}/>
        <NB T={T} Icon={Inbox}      label="Digest du jour"      active={view==="digest"}     onClick={()=>setView("digest")}     color={AC.cyan}/>
        <NB T={T} Icon={BarChart3}  label="Rapport semaine"     active={view==="weekly"}     onClick={()=>setView("weekly")}     color={AC.indigo}/>
        <ND T={T}/>
        <NL T={T}>PRODUCTIVITÉ</NL>
        <NB T={T} Icon={Users}      label="Contacts fréquents"  active={view==="contacts"}   onClick={()=>setView("contacts")}  color={AC.cyan}/>
        <NB T={T} Icon={Sliders}    label="Règles auto"         active={view==="rules"}      onClick={()=>setView("rules")}     color={AC.orange}/>
        <NB T={T} Icon={Bell}       label="Relances"            active={view==="followups"}  onClick={()=>setView("followups")} color={AC.orange}/>
        <NB T={T} Icon={CheckSquare} label="Tâches IA"          active={view==="tasks"}      onClick={()=>setView("tasks")}     color={AC.green}/>
        <NB T={T} Icon={MailX}       label="Newsletters"        active={view==="newsletters"} onClick={()=>setView("newsletters")} color={AC.red}/>
        <ND T={T}/>
        <NL T={T}>ANALYSES</NL>
        <NB T={T} Icon={History}     label="Historique IA"      active={view==="aihistory"}  onClick={()=>setView("aihistory")} color={AC.indigo}/>
        <NB T={T} Icon={Calendar}    label="Calendrier"         active={view==="calendar"}   onClick={()=>setView("calendar")}  color={AC.blue}/>
        <NB T={T} Icon={Download}   label="Export / Import"     active={view==="export"}     onClick={()=>setView("export")}    color={AC.green}/>
        <ND T={T}/>
        <NL T={T}>DÉPLOIEMENT</NL>
        <NB T={T} Icon={Zap}        label="GitHub & Cron auto"  active={view==="github"}     onClick={()=>setView("github")}    color={AC.violet}/>
        <ND T={T}/>
        <NL T={T}>DÉPLOIEMENT</NL>
        <NB T={T} Icon={Zap}        label="GitHub & Cron auto"  active={view==="github"}     onClick={()=>setView("github")}    color={AC.violet}/>
        <ND T={T}/>
        <NL T={T}>COMPTE</NL>
        <NB T={T} Icon={User}       label="Profil & Signature" active={view==="profile"}    onClick={()=>setView("profile")}/>
        <NB T={T} Icon={Sparkles}   label="Moteur IA"          active={view==="aiconfig"}   onClick={()=>setView("aiconfig")} color={AC.violet}/>
        <NB T={T} Icon={Settings}   label="Configuration"      active={view==="settings"}   onClick={()=>setView("settings")}/>
      </nav>}
      {!collapsed&&<div style={{padding:"8px",borderTop:`1px solid ${T.sidebarBorder}`}}>
        <button onClick={()=>{const ts=["dark","midnight","light","aurora","rose"];const ci=ts.indexOf(settings.theme||"dark");const n={...settings,theme:ts[(ci+1)%ts.length]};setSettings(n);sv("emailai_settings",n)}} style={{width:"100%",padding:"7px 10px",marginBottom:6,background:"transparent",border:"none",borderRadius:8,color:"#6A7E9A",fontSize:11,cursor:"pointer",...fl(8),fontFamily:"inherit"}}>
          <span style={{fontSize:14}}>{THEMES[settings.theme||"dark"]?.icon||"🌑"}</span>
          <span style={{flex:1}}>{THEMES[settings.theme||"dark"]?.name||"Sombre"}</span>
          <span style={{fontSize:9,color:"#3A4A5E",letterSpacing:"0.08em"}}>THÈME</span>
        </button>
        <div style={{...fl(6),padding:"6px 10px",marginBottom:6,borderRadius:8,background:settings.safetyFilter?AC.greenDim:AC.redDim,color:settings.safetyFilter?AC.green:AC.red,fontSize:10,fontWeight:700}}>
          <ShieldCheck size={10}/> {settings.safetyFilter?"Securite active":"Securite off"}
        </div>
        <div style={{...fl(8),padding:"6px 10px",marginBottom:4,borderRadius:8}}>
          <div style={{width:28,height:28,borderRadius:9,background:AC.grad1,...fl(0,"center","center"),fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>{initials}</div>
          <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:12,fontWeight:700,color:"#E8EDF8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.firstName||profile.lastName?`${profile.firstName} ${profile.lastName}`.trim():"Utilisateur"}</div>{profile.role&&<div style={{fontSize:10,color:"#5A6A8A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.role}</div>}</div>
        </div>
        <button onClick={logout} style={{width:"100%",padding:"7px 12px",background:"transparent",border:"none",borderRadius:8,color:"#5A6A8A",fontSize:12,cursor:"pointer",...fl(8),fontFamily:"inherit"}}><LogOut size={13}/> Deconnexion</button>
      </div>}
    </div>

    {view==="settings"  ?<SettingsView   T={T} settings={settings} setSettings={setSettings}/>
    :view==="profile"   ?<ProfileView    T={T} profile={profile}   setProfile={setProfile}/>
    :view==="aiconfig"  ?<AIConfigView   T={T} showToast={showToast}/>
    :view==="stats"     ?<StatsView      T={T}/>
    :view==="compose"   ?<ComposeView    T={T} settings={settings} profile={profile} showToast={showToast}/>
    :view==="aiconfig"  ?<AIConfigView  T={T} showToast={showToast}/>
    :view==="aiconfig"  ?<AIConfigView  T={T} showToast={showToast}/>
    :view==="aiconfig"  ?<AIConfigView  T={T} showToast={showToast}/>
    :view==="autoreply" ?<AutoReplyView  T={T} showToast={showToast}/>
    :view==="digest"    ?<DigestView     T={T}/>
    :view==="wordfilter"?<WordFilterView T={T} showToast={showToast}/>
    :view==="contacts" ?<ContactsView   T={T} showToast={showToast}/>
    :view==="rules"    ?<RulesView      T={T} showToast={showToast}/>
    :view==="followups"?<FollowUpsView  T={T} showToast={showToast}/>
    :view==="weekly"   ?<WeeklyReportView T={T}/>
    :view==="export"   ?<ExportView     T={T} showToast={showToast}/>
    :view==="github"   ?<GitHubView     T={T} showToast={showToast}/>
    :view==="tasks"    ?<TasksView      T={T} showToast={showToast}/>
    :view==="newsletters"?<BatchUnsubView T={T} showToast={showToast}/>
    :view==="calendar" ?<CalendarView   T={T} showToast={showToast}/>
    :view==="aihistory"?<AIHistoryView  T={T}/>
    :view==="tasks"    ?<TasksView      T={T} showToast={showToast}/>
    :view==="newsletters"?<BatchUnsubView T={T} showToast={showToast}/>
    :view==="calendar" ?<CalendarView   T={T} showToast={showToast}/>
    :view==="aihistory"?<AIHistoryView  T={T}/>
    :view==="github"   ?<GitHubView     T={T} showToast={showToast}/>
    :view==="templates" ?<TemplatesView  T={T} showToast={showToast}/>
    :(
      <>
        <div style={{width:zenMode?0:320,flexShrink:0,display:"flex",flexDirection:"column",borderRight:`1px solid ${T.border}`,background:T.bg2,overflow:"hidden",transition:"width .28s cubic-bezier(.4,0,.2,1)"}}>
          <div style={{padding:"12px 14px 10px",borderBottom:`1px solid ${T.border}`,position:"relative"}}>
          {showAdvSearch&&<AdvancedSearchPanel T={T} onSearch={(emails,q)=>{setEmails(emails);setSearch(q)}} onClose={()=>setShowAdvSearch(false)}/>}
            <SI T={T} value={search} onChange={e=>setSearch(e.target.value)}
              onKeyDown={e=>{
                if(e.key==="Enter"&&search.trim()){
                  setSelected(null);setCatFilter(null);setSelectedIds(new Set());loadEmails(search)
                  // Sauvegarder dans l'historique
                  const hist=[search,...(settings.searchHistory||[]).filter(h=>h!==search)].slice(0,5)
                  const ns={...settings,searchHistory:hist};setSettings(ns);sv("emailai_settings",ns)
                }
              }}
              placeholder={catFilter?`Dans ${catFilter}...`:"Ctrl+K · Rechercher..."}
              icon={Search}/>
            {/* Historique de recherche */}
            {!search&&(settings.searchHistory||[]).length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
              {(settings.searchHistory||[]).slice(0,3).map(h=><button key={h} onClick={()=>{setSearch(h);setSelected(null);setCatFilter(null);setSelectedIds(new Set());loadEmails(h)}} style={{fontSize:10,padding:"2px 8px",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,cursor:"pointer",color:T.textFaint,fontFamily:"inherit",...fl(4)}}><Search size={8}/>{h}</button>)}
            </div>}
            <div style={{...fl(0,"center","space-between"),marginTop:8}}>
              <div style={{...fl(6)}}><span style={{fontSize:10,color:T.textFaint,fontWeight:600}}>{emails.length} emails{catFilter?` · ${catFilter}`:""}</span>{selectedIds.size>0&&<span style={{fontSize:10,color:AC.indigo,fontWeight:700}}>{selectedIds.size} sel.</span>}</div>
              <div style={{...fl(8)}}>
                <button onClick={batchAnalyze} disabled={batchLoad} style={{background:"none",border:"none",cursor:"pointer",color:batchLoad?T.textFaint:AC.violet,fontSize:10,...fl(4),fontFamily:"inherit",fontWeight:600}}>
                  {batchLoad?<><Spin size={10} color={AC.violet}/> En cours...</>:<><Sparkles size={10}/> Analyser</>}
                </button>
                <button onClick={()=>setShowAdvSearch(p=>!p)} title="Recherche avancée" style={{background:"none",border:"none",cursor:"pointer",color:showAdvSearch?AC.blue:T.textFaint,fontSize:10,...fl(4),fontFamily:"inherit"}}><Filter size={10}/></button>
                <button onClick={refresh} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,fontSize:10,...fl(4),fontFamily:"inherit"}}><RefreshCw size={10}/></button>
                {search&&<button onClick={()=>{setSearch("");refresh()}} style={{background:"none",border:"none",cursor:"pointer",color:T.textFaint,fontSize:10,...fl(4),fontFamily:"inherit"}}><X size={10}/></button>}
              </div>
            </div>
          </div>
          <PinnedBanner T={T} onSelect={(id)=>{setSelected(id);setSelectedIds(new Set())}} selected={selected}/>
          <EmailList T={T} emails={emails} onSelect={(id)=>{setSelected(id);setSelectedIds(new Set())}} selected={selected} loading={loading} compact={settings.compactView} doAction={doAction} settings={settings} selectedIds={selectedIds} setSelectedIds={setSelectedIds}/>
        </div>
        <div style={{flex:1,overflow:"hidden",display:"flex"}}>
          <EmailDetail T={T} emailId={selected} settings={settings} profile={profile} doAction={doAction} showToast={showToast} emailMeta={emails.find(e=>e.id===selected)}/>
        </div>
      </>
    )}

    {/* Bouton Zen flottant */}
    <div style={{position:"fixed",top:12,right:12,zIndex:200,...fl(6)}}>
      <button onClick={()=>setFontSize(p=>Math.max(p-1,11))} title="Réduire police (A-)" style={{width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:T.bg2,color:T.textSub,cursor:"pointer",fontSize:10,fontWeight:800,backdropFilter:"blur(8px)"}}>A-</button>
      <button onClick={()=>setFontSize(p=>Math.min(p+1,20))} title="Agrandir police (A+)" style={{width:28,height:28,borderRadius:8,border:`1px solid ${T.border}`,background:T.bg2,color:T.textSub,cursor:"pointer",fontSize:13,fontWeight:800,backdropFilter:"blur(8px)"}}>A+</button>
      <button onClick={()=>setZenMode(p=>!p)} title={zenMode?"Quitter le mode Zen (Z)":"Mode Zen - Focus (Z)"} style={{width:32,height:28,borderRadius:8,border:`1px solid ${zenMode?AC.violet:T.border}`,background:zenMode?AC.violetDim:T.bg2,color:zenMode?AC.violet:T.textSub,cursor:"pointer",fontSize:14,backdropFilter:"blur(8px)"}}>🧘</button>
    </div>
    {undoAction&&<UndoBar T={T} action={undoAction} onUndo={()=>{undoAction.fn&&undoAction.fn();setUndoAction(null)}} onDismiss={()=>setUndoAction(null)}/>}
    {showShortcuts&&<ShortcutsModal T={T} onClose={()=>setShowShortcuts(false)}/>}
    <Toast toast={toast}/>
    <BulkBar T={T} selectedIds={selectedIds} setSelectedIds={setSelectedIds} doAction={doAction} showToast={showToast}/>
    {showShortcuts&&<ShortcutsModal T={T} onClose={()=>setShowShortcuts(false)}/>}
  </div>
  </ErrorBoundary>
}
