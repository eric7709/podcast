"use client";

import { useState, useEffect, FormEvent } from "react";

const platforms = ["Spotify", "Apple Podcasts", "YouTube", "Google Podcasts"];

interface Episode { id: string; youtube: string; number: number; title: string; description: string; guest: string; guestRole: string; duration: string; date: string; category: string; }

const CAT: Record<string, string> = { Money: "#FF3E9A", Dating: "#FF8A3D", Careers: "#8B5CF6", Family: "#22C7A9", "Pop Culture": "#FFD23F", Opinions: "#4DA3FF" };

const EPISODES: Episode[] = [
  { id: "ep-142", youtube: "https://www.youtube.com/watch?v=AltSlq83FpM", number: 142, title: "The Financially Responsible Episode", description: "Ngozi Okonye joins the Bounce for a conversation about money, crypto, and building better financial habits. We also revisit our unfortunate past business ventures, snail and pig farming included.", guest: "Ngozi Okonye", guestRole: "Head of Brand, Busha", duration: "1h 12m", date: "Feb 18, 2026", category: "Money" },
  { id: "ep-141", youtube: "https://www.youtube.com/watch?v=d0SOqTDzCWM", number: 141, title: "Dating Apps Are a Scam (But We're Still On Them)", description: "From left-swiping on our soulmates to accidentally matching with our exes, we unpack why modern dating feels like a full-time job.", guest: "Solo", guestRole: "", duration: "58m", date: "Feb 11, 2026", category: "Dating" },
  { id: "ep-140", youtube: "https://www.youtube.com/watch?v=39A3vJS0VY0", number: 140, title: "Career Pivots & Quarter-Life Crises", description: "If you've ever cried in a bathroom during a work event, this one is for you. We talk quitting, pivoting, and pretending to have it together.", guest: "Temi Otedola", guestRole: "Entrepreneur", duration: "1h 04m", date: "Feb 4, 2026", category: "Careers" },
  { id: "ep-139", youtube: "https://www.youtube.com/watch?v=FeJE5iPXtsA", number: 139, title: "Family Group Chats & Boundary Battles", description: "The aunties are typing. We discuss the art of saying no, keeping boundaries, and the politics of the family WhatsApp group.", guest: "Solo", guestRole: "", duration: "49m", date: "Jan 28, 2026", category: "Family" },
  { id: "ep-138", youtube: "https://www.youtube.com/watch?v=FxV86FznfcA", number: 138, title: "The Pop Culture Catch-Up", description: "From award shows to album drops, everything you missed while you were being a responsible adult.", guest: "Solo", guestRole: "", duration: "52m", date: "Jan 21, 2026", category: "Pop Culture" },
  { id: "ep-137", youtube: "https://www.youtube.com/watch?v=DmbXiCamArQ", number: 137, title: "Hot Takes & Hard Truths", description: "We asked you for your most controversial opinions. You delivered. We react. No filters, no apologies.", guest: "Solo", guestRole: "", duration: "1h 01m", date: "Jan 14, 2026", category: "Opinions" },
  { id: "ep-136", youtube: "https://www.youtube.com/watch?v=R2mkXB94wrU", number: 136, title: "The Side Hustle Confessions", description: "Everyone has a side hustle and nobody is telling the whole story. We share the wins, the losses and the invoices that never got paid.", guest: "Solo", guestRole: "", duration: "55m", date: "Jan 7, 2026", category: "Money" },
];

/* ── YOUTUBE: each episode has a `youtube` field (full link or ID). Featured video below. ── */
const parseYt = (s: string) => (s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? s.trim());
const CHANNEL = "https://www.youtube.com/@yourchannel";
const FEATURED_INPUT = "https://www.youtube.com/watch?v=nVWOAPke_2E"; // trailer / featured video link or ID
const FEATURED_VIDEO = parseYt(FEATURED_INPUT);
const thumbUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* Host photo lives in /public/host.png */
const HOST_PHOTO = "/host.png";

const THEMES = [
  { name: "Cyan", bg: "#00D9F5", card: "#7FEBFA", fg: "#06232B", mute: "#0E4A57", accent: "#7B1FA2", ink: "#FFFFFF", line: "rgba(6,35,43,.18)", line2: "rgba(6,35,43,.35)" },
  { name: "Sunshine", bg: "#FFD60A", card: "#FFE766", fg: "#241C00", mute: "#5C4B00", accent: "#B3125B", ink: "#FFFFFF", line: "rgba(36,28,0,.18)", line2: "rgba(36,28,0,.35)" },
  { name: "Lavender", bg: "#B79CFF", card: "#D3C2FF", fg: "#170B3A", mute: "#43307D", accent: "#7A0A4B", ink: "#FFFFFF", line: "rgba(23,11,58,.18)", line2: "rgba(23,11,58,.35)" },
];

const CATS = ["All", ...Object.keys(CAT)];
const NAV = [["Episodes", "#episodes"], ["Guests", "#guests"], ["Events", "#events"], ["Merch", "#merch"], ["About", "#about"]];
const MERCH = [["The Saner Side Tee", "₦18,000", "#FF3E9A"], ["Season 8 Hoodie", "₦35,000", "#8B5CF6"], ["Bounce Tote", "₦9,500", "#FF8A3D"], ["Enamel Mug", "₦6,500", "#22C7A9"]];
const COLUMNS: Record<string, string[][]> = {
  Listen: [["Apple Podcasts", "https://podcasts.apple.com"], ["Spotify", "https://open.spotify.com"], ["YouTube", "https://youtube.com"], ["RSS Feed", "#"]],
  Explore: [["All Episodes", "#episodes"], ["Guests", "#guests"], ["Merch", "#merch"], ["Contact", "#"]],
  Follow: [["Instagram", "https://instagram.com"], ["X (Twitter)", "https://x.com"], ["TikTok", "https://tiktok.com"], ["LinkedIn", "https://linkedin.com"]],
};


const stats = [["142", "episodes"], ["2.4M+", "monthly listeners"], ["4.9", "average rating"], ["8", "seasons"]];

const GUESTS = [
  { i: "NO", name: "Ngozi Okonye", role: "Head of Brand, Busha", ep: 142, c: "#FF3E9A" },
  { i: "TO", name: "Temi Otedola", role: "Entrepreneur", ep: 140, c: "#FF8A3D" },
  { i: "AS", name: "Ayra Starr", role: "Musician", ep: 128, c: "#8B5CF6" },
  { i: "BB", name: "Burna Boy", role: "Artist", ep: 115, c: "#22C7A9" },
  { i: "KA", name: "Kemi Adetiba", role: "Director", ep: 109, c: "#FFD23F" },
  { i: "ME", name: "Mr Eazi", role: "Artist & Investor", ep: 102, c: "#4DA3FF" },
];

const clips = [
  ["Rest is not a reward. It is part of the job.", "Dr. Amaka Eze"],
  ["I stopped asking for permission and started sending invoices.", "Tunde Bello"],
  ["Love me, but also show me your bank alerts.", "Ngozi Okafor"],
];

const tour = [
  ["Oct 18", "Lagos", "Eko Convention Centre", "Few tickets left"],
  ["Nov 02", "Abuja", "Transcorp Hilton", "On sale"],
  ["Nov 22", "London", "The Roundhouse", "On sale"],
  ["Dec 13", "Accra", "Labadi Beach Hotel", "Sold out"],
];

const reviews = [
  ["Like sitting with my funniest friends. I laugh out loud on the bus and do not care.", "Adaeze, Lagos"],
  ["The money episodes changed how I talk to my family. Honest and kind.", "Michael, Manchester"],
  ["Finally a show that says it plainly and still keeps me sane, with receipts.", "Zainab, Abuja"],
];

const faqs = [
  ["When do new episodes come out?", "Every Wednesday at 7am on all platforms, with the video on YouTube."],
  ["Can I be a guest?", "We pick guests from the dilemmas inbox and listener nominations. Send a note and tell us your story."],
  ["What does the members club include?", "Bonus episodes, early access, ad-free listening and a private group chat with the hosts."],
];

const sponsors = ["Kuda", "Busha", "Paystack", "Jumia", "Flutterwave"];

const guests = ["Founders", "Creators", "Doctors", "Athletes", "Artists", "Authors", "Investors", "Strangers"];

const css = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;800&display=swap');
:root {
  --plum: #1d1020;
  --plum-2: #2a1830;
  --bg: #1d1020; --card: #2a1830; --fg: #fff3e6; --ink: #1d1020; --line: #3b2641; --line2: #5a4262;
  --pink: #ff3e9a;
  --cream: #fff3e6;
  --mute: #c9b6c9;
  --max: 1180px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--fg); font-family: inherit; line-height: 1.55; }
a { color: inherit; text-decoration: none; }
h1, h2, h3, .logo { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; line-height: 1; }
:focus-visible { outline: 3px solid var(--pink); outline-offset: 3px; }

.nav { max-width: var(--max); margin: 0 auto; padding: 22px 24px; display: flex; align-items: center; gap: 32px; }
.logo { font-weight: 800; font-size: 24px; color: var(--pink); }
.nav nav { display: flex; gap: 24px; margin-left: auto; font-size: 15px; color: var(--mute); }
.nav nav a:hover { color: var(--fg); }

.btn { display: inline-block; border: 0; border-radius: 999px; padding: 12px 22px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; }
.btn-pink { background: var(--pink); color: var(--plum); }
.btn-cream { background: var(--cream); color: var(--plum); margin-top: 8px; }

.hero { max-width: var(--max); margin: 0 auto; padding: 56px 24px 72px; }
.kicker { color: var(--pink); font-weight: 700; margin-bottom: 20px; }
.hero h1 { font-weight: 800; font-size: clamp(44px, 8vw, 104px); max-width: 15ch; margin-bottom: 56px; }

.player { display: grid; grid-template-columns: 300px 1fr; gap: 40px; background: var(--card); border-radius: 28px; padding: 28px; }
.art { aspect-ratio: 1; border-radius: 20px; background: var(--pink); color: var(--plum); display: grid; place-items: end start; padding: 22px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 56px; line-height: .95; letter-spacing: -0.04em; }
.info { display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.meta { color: var(--mute); font-size: 14px; }
.info h2 { font-size: clamp(26px, 3.4vw, 42px); font-weight: 800; }
.desc { color: var(--mute); max-width: 56ch; }
.controls { display: flex; align-items: center; gap: 16px; }
.play { width: 52px; height: 52px; border-radius: 50%; border: 0; background: var(--cream); color: var(--plum); font-size: 18px; cursor: pointer; flex: none; }
.bar { flex: 1; height: 6px; border-radius: 6px; background: var(--line2); }
.bar i { display: block; width: 18%; height: 100%; border-radius: 6px; background: var(--pink); }
.time { font-size: 13px; color: var(--mute); font-variant-numeric: tabular-nums; }
.platforms { display: flex; flex-wrap: wrap; gap: 10px; }
.platforms a { border: 1.5px solid var(--line2); border-radius: 999px; padding: 8px 16px; font-size: 14px; }
.platforms a:hover { border-color: var(--pink); color: var(--pink); }

.ticker { background: var(--pink); color: var(--plum); overflow: hidden; padding: 16px 0; transform: rotate(-1.2deg); margin: 0 -2%; }
.track { display: flex; gap: 40px; width: max-content; animation: slide 30s linear infinite; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 28px; white-space: nowrap; }
.track b { margin-left: 40px; }
@keyframes slide { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; } html { scroll-behavior: auto; } }

.section { max-width: var(--max); margin: 0 auto; padding: 96px 24px; }
.head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 36px; }
.head h2, .split h2, .news h2, .dilemma h2 { font-size: clamp(32px, 5vw, 60px); font-weight: 800; }
.head a { color: var(--pink); font-weight: 700; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.thumb { aspect-ratio: 1; border-radius: 18px; padding: 16px; display: flex; align-items: flex-end; color: var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 16px; transition: transform .2s; }
.card:hover .thumb { transform: translateY(-4px); }
.card h3 { font-size: 21px; font-weight: 500; line-height: 1.15; margin-bottom: 8px; letter-spacing: -0.01em; }
.card p { color: var(--mute); font-size: 14px; }

.split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.split p { font-size: 19px; margin-bottom: 18px; max-width: 52ch; }

.dilemma { background: var(--cream); color: var(--plum); text-align: center; padding: 96px 24px; }
.dilemma p { margin: 20px auto 32px; font-size: 19px; max-width: 48ch; }

.news { text-align: center; }
.news p { margin: 20px auto 32px; color: var(--mute); max-width: 46ch; }
.field { display: flex; gap: 10px; max-width: 480px; margin: 0 auto; }
.field input { flex: 1; min-width: 0; padding: 12px 20px; border-radius: 999px; border: 1.5px solid var(--line2); background: transparent; color: var(--fg); font: inherit; }

footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; max-width: var(--max); margin: 0 auto; padding: 32px 24px 48px; color: var(--mute); font-size: 14px; border-top: 1px solid var(--line); }

@media (max-width: 900px) {
  .player, .split { grid-template-columns: 1fr; }
  .art { max-width: 240px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
  .nav nav { display: none; }
  .nav .btn { margin-left: auto; }
}
@media (max-width: 520px) { .grid { grid-template-columns: 1fr; } .field { flex-direction: column; } }

.stats { max-width: var(--max); margin: 72px auto 0; padding: 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.stats div { border-left: 3px solid var(--pink); padding-left: 16px; }
.stats b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(36px, 5vw, 64px); letter-spacing: -0.04em; line-height: 1; }
.stats span { color: var(--mute); font-size: 14px; }

.guests { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.guest { text-align: center; }
.avatar { width: 100%; max-width: 140px; aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 14px; color: var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 34px; transition: transform .2s; }
.guest:hover .avatar { transform: scale(1.06); }
.guest h3 { font-size: 17px; font-weight: 500; letter-spacing: -0.01em; }
.guest p { color: var(--mute); font-size: 14px; }

.clips { background: var(--card); max-width: none; }
.clips .head, .clips .quotes { max-width: var(--max); margin-left: auto; margin-right: auto; }
.quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
blockquote { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; min-height: 220px; }
blockquote p { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 500; }
cite { color: var(--pink); font-style: normal; font-weight: 700; font-size: 14px; }
.review { background: var(--card); border-radius: 20px; padding: 28px; min-height: 0; }
.review p { font-family: inherit; font-size: 18px; line-height: 1.5; letter-spacing: 0; font-weight: 400; }

.watch { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: center; }
.video { aspect-ratio: 16/9; border-radius: 24px; background: linear-gradient(135deg, var(--pink), #8B5CF6); display: grid; place-items: center; }
.video .play { width: 76px; height: 76px; font-size: 26px; }
.watch h2 { font-size: clamp(30px, 4vw, 48px); font-weight: 800; margin-bottom: 18px; }
.watch p { color: var(--mute); margin-bottom: 24px; max-width: 44ch; }

.tour { list-style: none; border-top: 1px solid var(--line); }
.tour li { display: grid; grid-template-columns: 110px 1fr 2fr auto; gap: 20px; align-items: center; padding: 22px 0; border-bottom: 1px solid var(--line); }
.tour b { color: var(--pink); font-size: 18px; }
.city { font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.venue { color: var(--mute); }
.sold { background: var(--line); color: var(--mute); cursor: not-allowed; }

.faq { max-width: 820px; }
.faq h2 { font-size: clamp(32px, 5vw, 56px); font-weight: 800; margin-bottom: 32px; }
details { border-top: 1px solid var(--line); padding: 20px 0; }
details:last-child { border-bottom: 1px solid var(--line); }
summary { cursor: pointer; font-weight: 700; font-size: 19px; list-style: none; display: flex; justify-content: space-between; }
summary::after { content: "+"; color: var(--pink); font-size: 24px; line-height: 1; }
details[open] summary::after { content: "–"; }
details p { color: var(--mute); margin-top: 12px; max-width: 60ch; }

.sponsors { max-width: var(--max); margin: 0 auto; padding: 0 24px 72px; display: flex; flex-wrap: wrap; align-items: center; gap: 16px 40px; color: var(--mute); }
.sponsors span { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 24px; color: var(--fg); opacity: .7; }

@media (max-width: 900px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .guests { grid-template-columns: repeat(3, 1fr); }
  .quotes, .watch { grid-template-columns: 1fr; }
  .tour li { grid-template-columns: 80px 1fr; }
  .tour .venue { grid-column: 2; }
  .tour .btn { grid-column: 1 / -1; justify-self: start; }
}

.top { position: sticky; top: 0; z-index: 50; transition: background .3s; }
.top.solid { background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.burger { display: none; width: 42px; height: 42px; border-radius: 50%; border: 0; background: var(--card); color: var(--fg); font-size: 18px; cursor: pointer; }
.mobile { display: flex; flex-direction: column; gap: 18px; padding: 8px 24px 28px; }
.mobile a:not(.btn) { font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.mobile .btn { align-self: flex-start; }
.hero h1 { margin-bottom: 28px; }
.lede { font-size: 20px; color: var(--mute); max-width: 52ch; margin-bottom: 32px; }
.ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-bottom: 56px; }
.ghost { border: 1.5px solid var(--line2); }
.ghost:hover { border-color: var(--pink); color: var(--pink); }
.proof { display: flex; align-items: center; gap: 14px; margin-left: 12px; }
.proof b { display: block; line-height: 1.1; }
.proof small, .chip small { color: var(--mute); font-size: 13px; display: block; }
.stack { display: flex; }
.stack i { width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--bg); margin-left: -10px; }
.stack i:first-child { margin-left: 0; }
.chip { display: flex; align-items: center; gap: 12px; }
.avatar.sm { width: 44px; height: 44px; font-size: 15px; margin: 0; flex: none; }
.save { border: 1.5px solid var(--line2); background: transparent; color: var(--fg); border-radius: 999px; padding: 8px 16px; font: inherit; font-size: 14px; cursor: pointer; }
.save[aria-pressed="true"] { background: var(--cream); color: var(--plum); border-color: var(--fg); }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
.chips button { border: 1.5px solid var(--line2); background: transparent; color: var(--fg); border-radius: 999px; padding: 8px 18px; font: inherit; font-size: 14px; cursor: pointer; }
.chips button:hover { border-color: var(--pink); }
.chips button.on { background: var(--pink); border-color: var(--pink); color: var(--plum); font-weight: 700; }
.eps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ecard { background: var(--card); border-radius: 22px; overflow: hidden; }
.ecard .thumb { position: relative; margin: 0; border-radius: 0; aspect-ratio: 16/10; align-items: center; justify-content: center; }
.ecard:hover .thumb { transform: none; }
.big { font-size: 72px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; opacity: .85; }
.tag { position: absolute; top: 14px; left: 14px; background: rgba(29,16,32,.85); color: var(--cream); border-radius: 999px; padding: 4px 12px; font-family: inherit; font-size: 12px; font-weight: 500; }
.ecard .body { padding: 22px; }
.emeta { color: var(--mute); font-size: 13px; margin-bottom: 8px; }
.ecard h3 { font-size: 22px; font-weight: 800; line-height: 1.1; margin-bottom: 10px; }
.clamp { color: var(--mute); font-size: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.egu { color: var(--pink); font-size: 14px; font-weight: 700; margin-top: 12px; }
.wide { grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; }
.wide .thumb { aspect-ratio: auto; min-height: 280px; }
.wide .big { font-size: 120px; }
.wide h3 { font-size: 30px; }
.wide .body { padding: 32px; align-self: center; }
.guest small { color: var(--pink); font-size: 12px; font-weight: 700; }
.success { max-width: 480px; margin: 0 auto; background: var(--card); border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 6px; }
.success b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; color: var(--pink); }
.fine { display: block; margin-top: 16px; color: var(--mute); font-size: 12px; }
.btn:disabled { opacity: .6; cursor: wait; }
footer { display: block; }
.fgrid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; }
.fgrid p { margin-top: 14px; max-width: 34ch; font-size: 14px; }
.fgrid h4 { color: var(--pink); font-size: 14px; margin-bottom: 14px; }
.fgrid ul { list-style: none; display: grid; gap: 10px; }
.fgrid a:hover, .fbase a:hover { color: var(--fg); }
.fbase { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-top: 1px solid var(--line); padding-top: 24px; font-size: 13px; }
@media (max-width: 900px) {
  .burger { display: grid; place-items: center; margin-left: 12px; }
  .nav .btn { display: none; }
  .nav nav { display: none; }
  .nav { justify-content: space-between; }
  .eps { grid-template-columns: 1fr; }
  .wide { grid-column: auto; grid-template-columns: 1fr; }
  .wide .thumb { min-height: 0; aspect-ratio: 16/10; }
  .fgrid { grid-template-columns: 1fr 1fr; }
  .proof { margin-left: 0; }
}

html, body { overflow-x: clip; max-width: 100%; }
main { overflow-x: clip; }
.ticker { margin: 0; }
.vid { background-size: cover; background-position: center; cursor: pointer; }
.vid::after { content: ""; position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(29,16,32,.5)); pointer-events: none; }
.vid > * { z-index: 1; }
.ply { position: relative; width: 64px; height: 64px; border-radius: 50%; background: var(--pink); color: var(--plum); display: grid; place-items: center; font-size: 22px; padding-left: 4px; transition: transform .2s; }
.vid:hover .ply { transform: scale(1.1); }
.video { background-size: cover; background-position: center; }
.modal { position: fixed; inset: 0; z-index: 100; background: rgba(10,4,12,.88); display: grid; place-items: center; padding: 20px; }
.frame { position: relative; width: min(1000px, 100%); aspect-ratio: 16/9; background: #000; border-radius: 18px; overflow: hidden; }
.frame iframe { width: 100%; height: 100%; border: 0; display: block; }
.close { position: absolute; top: 10px; right: 10px; z-index: 2; width: 38px; height: 38px; border-radius: 50%; border: 0; background: rgba(29,16,32,.85); color: var(--cream); cursor: pointer; font-size: 16px; }
.empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 24px; color: var(--mute); }
.empty b { color: var(--fg); font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; }

.byline { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.byline .kicker { margin: 0; }
.face { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--pink); flex: none; }
.host { margin-top: 36px; max-width: 420px; }
.host img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 28px; border: 3px solid var(--pink); }
.host figcaption { margin-top: 12px; color: var(--mute); font-size: 14px; }

.about { display: grid; grid-template-columns: 1.1fr .9fr; gap: 72px; align-items: center; }
.about h2 { font-size: clamp(34px, 5vw, 62px); font-weight: 800; margin-bottom: 28px; }
.about p { font-size: 19px; margin-bottom: 18px; max-width: 50ch; }
.facts { display: flex; flex-wrap: wrap; gap: 20px 40px; margin: 32px 0; }
.facts b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: 44px; letter-spacing: -0.04em; line-height: 1; }
.facts span { color: var(--mute); font-size: 14px; }
.portrait { position: relative; aspect-ratio: 4/5; max-width: 460px; width: 100%; justify-self: center; }
.blob { position: absolute; top: 0; left: 0; width: 86%; height: 86%; background: var(--pink); border-radius: 36px; transform: rotate(-6deg); }
.portrait img { position: absolute; right: 0; bottom: 0; width: 86%; height: 86%; object-fit: cover; object-position: 55% 30%; border-radius: 36px; box-shadow: 0 24px 50px rgba(0,0,0,.45); }
.sticker { position: absolute; top: 14px; right: 4px; background: var(--cream); color: var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 16px; padding: 10px 18px; border-radius: 999px; transform: rotate(5deg); }
.bubble { position: absolute; left: 0; bottom: 36px; background: var(--card); border: 2px solid var(--pink); border-radius: 18px 18px 18px 4px; padding: 12px 18px; font-size: 14px; font-weight: 700; }
@media (max-width: 900px) { .about { grid-template-columns: 1fr; gap: 48px; } }

.btn-pink, .ticker, .chips button.on, .art, .ply { color: var(--ink); }
main, main * { transition: background-color .45s ease, color .45s ease, border-color .45s ease; }
body { transition: background-color .45s ease; }
.portrait img { cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-drag: none; }
.hint { position: absolute; left: 0; bottom: -34px; color: var(--mute); font-size: 13px; }
@media (prefers-reduced-motion: reduce) { main, main *, body { transition: none; } }

.embed { position: relative; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #1d1020; text-align: center; padding: 12px; }
.embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.note { font-size: 13px; font-weight: 700; max-width: 26ch; }
.wide .embed { aspect-ratio: auto; min-height: 300px; }
@media (max-width: 900px) { .wide .embed { aspect-ratio: 16/9; min-height: 0; } }

/* ───── layout polish + mobile ───── */
.wide { grid-column: 1 / -1; grid-template-columns: 1.3fr 1fr; }
.wide .embed { aspect-ratio: 16/9; min-height: 0; }
.field input { font-size: 16px; }

@media (max-width: 900px) {
  .burger { margin-left: auto; }
  .section { padding: 72px 24px; }
  .eps { grid-template-columns: repeat(2, 1fr); }
  .wide { grid-column: 1 / -1; grid-template-columns: 1fr; }
  .wide .body { padding: 24px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
  .watch { gap: 32px; }
}

@media (max-width: 600px) {
  .nav { padding: 14px 20px; }
  .logo { font-size: 20px; }
  .mobile { padding: 8px 20px 24px; }
  .mobile a:not(.btn) { font-size: 26px; }

  .hero { padding: 28px 20px 44px; }
  .byline { gap: 10px; align-items: flex-start; }
  .face { width: 40px; height: 40px; }
  .kicker { font-size: 13px; line-height: 1.4; }
  .hero h1 { font-size: clamp(40px, 12.5vw, 56px); margin-bottom: 20px; }
  .lede { font-size: 17px; margin-bottom: 24px; }
  .ctas { gap: 10px; margin-bottom: 32px; }
  .ctas .btn { flex: 1 1 calc(50% - 5px); text-align: center; padding: 13px 14px; }
  .proof { flex: 1 1 100%; margin-top: 6px; }

  .player { padding: 16px; gap: 18px; border-radius: 22px; }
  .art { max-width: none; aspect-ratio: 2/1; font-size: 38px; padding: 16px; border-radius: 16px; }
  .info { gap: 12px; }
  .info h2 { font-size: 26px; }
  .desc { font-size: 15px; }
  .controls { flex-wrap: wrap; gap: 10px 12px; }
  .play { width: 46px; height: 46px; }
  .time { margin-left: auto; font-size: 12px; }
  .bar { order: 10; flex: 1 1 100%; }
  .platforms { gap: 8px; }
  .platforms a { padding: 7px 12px; font-size: 13px; }

  .ticker { padding: 11px 0; }
  .track { font-size: 20px; gap: 28px; }
  .track b { margin-left: 28px; }

  .stats { margin-top: 40px; padding: 0 20px; gap: 20px 16px; }
  .stats b { font-size: 34px; }
  .stats span { font-size: 13px; }

  .section { padding: 56px 20px; }
  .head { flex-wrap: wrap; gap: 6px 16px; margin-bottom: 24px; }
  .head h2 { font-size: 30px; }
  .head a { font-size: 14px; }

  .chips { flex-wrap: nowrap; overflow-x: auto; margin: 0 -20px 22px; padding: 0 20px 4px; scrollbar-width: none; }
  .chips::-webkit-scrollbar { display: none; }
  .chips button { flex: none; padding: 8px 16px; }

  .eps { grid-template-columns: 1fr; gap: 18px; }
  .ecard { border-radius: 18px; }
  .ecard .body, .wide .body { padding: 18px; }
  .ecard h3, .wide h3 { font-size: 20px; }
  .clamp { font-size: 14px; }

  .grid { gap: 14px; }
  .card h3 { font-size: 16px; }
  .thumb { padding: 12px; font-size: 18px; border-radius: 14px; }

  .guests { grid-template-columns: repeat(3, 1fr); gap: 20px 12px; }
  .avatar { font-size: 22px; }
  .guest h3 { font-size: 14px; }
  .guest p { font-size: 12px; }

  .quotes { gap: 28px; }
  blockquote { min-height: 0; gap: 14px; }
  blockquote p { font-size: 22px; }
  .review { padding: 22px; }
  .review p { font-size: 16px; }

  .watch { gap: 24px; }
  .video { border-radius: 16px; }
  .video .play { width: 60px; height: 60px; font-size: 22px; }
  .watch h2 { font-size: 30px; }

  .tour li { grid-template-columns: 70px 1fr; gap: 6px 14px; padding: 16px 0; }
  .tour b { font-size: 15px; }
  .city { font-size: 24px; }
  .venue { font-size: 14px; }
  .tour .btn { width: 100%; text-align: center; margin-top: 6px; }

  .about { gap: 40px; }
  .about h2 { font-size: 34px; margin-bottom: 20px; }
  .about p { font-size: 17px; }
  .facts { gap: 16px 28px; margin: 24px 0; }
  .facts b { font-size: 34px; }
  .about .btn { display: block; text-align: center; }
  .portrait { max-width: 340px; margin-bottom: 40px; }
  .sticker { font-size: 13px; padding: 8px 14px; }
  .bubble { font-size: 12px; padding: 10px 14px; bottom: 28px; }
  .hint { font-size: 12px; bottom: -32px; }

  .dilemma { padding: 56px 20px; }
  .dilemma p { font-size: 17px; margin: 16px auto 24px; }
  .news p { margin: 16px auto 24px; }
  .field { flex-direction: column; }
  .field .btn { width: 100%; }

  .faq h2 { font-size: 30px; margin-bottom: 20px; }
  summary { font-size: 17px; gap: 16px; }
  details { padding: 16px 0; }

  .sponsors { padding: 0 20px 40px; gap: 10px 24px; }
  .sponsors span { font-size: 20px; }

  footer { padding: 32px 20px 40px; }
  .fgrid { grid-template-columns: 1fr 1fr; gap: 28px 20px; }
  .fgrid > div:first-child { grid-column: 1 / -1; }
  .fbase { flex-direction: column; gap: 8px; }

  .modal { padding: 12px; }
  .frame { border-radius: 12px; }
}

/* hide scrollbars (page still scrolls) */
html, body { scrollbar-width: none; -ms-overflow-style: none; }
html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none; width: 0; height: 0; }
* { scrollbar-width: none; }
`;

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [themeIdx, setThemeIdx] = useState(-1);
  const nextTheme = () => setThemeIdx((i) => (i >= THEMES.length - 1 ? -1 : i + 1));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [video, setVideo] = useState<{ id: string; title: string } | null>(null);
  const openVideo = (id: string, title: string) => setVideo({ id, title });
  const [episodes, setEpisodes] = useState<Episode[]>(EPISODES);
  const latest = episodes[0];
  const shown = filter === "All" ? episodes : episodes.filter((e) => e.category === filter);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    // BACKEND: when your API is ready, load episodes here, e.g.
    // fetch("/api/episodes").then((r) => r.json()).then(setEpisodes);
    // Each item needs: id, number, title, description, guest, guestRole, duration, date, category, youtube
  }, []);

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [video]);

  useEffect(() => {
    const root = document.documentElement;
    const keys = ["--bg", "--card", "--fg", "--mute", "--pink", "--ink", "--line", "--line2"];
    if (themeIdx < 0) { keys.forEach((k) => root.style.removeProperty(k)); return; }
    const t = THEMES[themeIdx];
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--card", t.card);
    root.style.setProperty("--fg", t.fg);
    root.style.setProperty("--mute", t.mute);
    root.style.setProperty("--pink", t.accent);
    root.style.setProperty("--ink", t.ink);
    root.style.setProperty("--line", t.line);
    root.style.setProperty("--line2", t.line2);
  }, [themeIdx]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className={"top" + (scrolled ? " solid" : "")}>
        <div className="nav">
          <a className="logo" href="#">The Saner Side</a>
          <nav>{NAV.map(([l, h]) => (<a key={l} href={h}>{l}</a>))}</nav>
          <a className="btn btn-pink" href="#members">Listen now</a>
          <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        </div>
        {open && (
          <div className="mobile">
            {NAV.map(([l, h]) => (<a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>))}
            <a className="btn btn-pink" href="#members">Listen now</a>
          </div>
        )}
      </header>

      <section className="hero">
        <div className="byline"><img className="face" src={HOST_PHOTO} alt="Oga Peter" /><p className="kicker">Hosted by Oga Peter · Season 8 is live · New episodes every Wednesday</p></div>
        <h1>The saner side of the conversation.</h1>
        <p className="lede">One of the boldest podcasts around. Unfiltered conversations on pop culture, careers, money and the confusions of modern adulthood. Come for the banter. Stay for the hard truths.</p>
        <div className="ctas">
          <a className="btn btn-pink" href="#latest">Play latest episode</a>
          <a className="btn ghost" href="#episodes">Browse episodes</a>
          <div className="proof">
            <span className="stack"><i style={{ background: "#FF3E9A" }} /><i style={{ background: "#FFF3E6" }} /><i style={{ background: "#8B5CF6" }} /><i style={{ background: "#FF8A3D" }} /></span>
            <span><b>2.4M+</b><small>monthly listeners</small></span>
          </div>
        </div>

        <div id="latest" className="player">
          <div className="art" aria-hidden="true">
            <span>S08<br />EP{latest.number}</span>
          </div>
          <div className="info">
            <p className="meta">Latest episode · {latest.duration} · {latest.date}</p>
            <h2>{latest.title}</h2>
            <p className="desc">{latest.description}</p>
            <div className="chip"><span className="avatar sm" style={{ background: CAT[latest.category] }}>NO</span><div><b>{latest.guest}</b><small>{latest.guestRole}</small></div></div>
            <div className="controls">
              <button className="play" aria-label="Play latest episode" onClick={() => openVideo(parseYt(latest.youtube), latest.title)}>▶</button>
              <div className="bar" role="presentation"><i /></div>
              <button className="save" onClick={() => setSaved(!saved)} aria-pressed={saved}>{saved ? "✓ Saved" : "Save"}</button>
              <span className="time">0:00 / 1:12:04</span>
            </div>
            <div className="platforms">
              {platforms.map((p) => (
                <a key={p} href="#">{p}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="track">
          {[...guests, ...guests].map((g, i) => (
            <span key={i}>{g} <b>✺</b></span>
          ))}
        </div>
      </div>

      <section className="stats">
        {stats.map(([n, l]) => (
          <div key={l}><b>{n}</b><span>{l}</span></div>
        ))}
      </section>

      <section id="episodes" className="section">
        <div className="head"><h2>Recent episodes</h2><a href="#">View all</a></div>
        <div className="chips">
          {CATS.map((c) => (<button key={c} className={c === filter ? "on" : ""} onClick={() => setFilter(c)}>{c}</button>))}
        </div>
        <div className="eps">
          {shown.map((e, i) => (
            <article key={e.id} className={"ecard" + (i === 0 ? " wide" : "")}>
              <div className="embed" style={{ backgroundColor: CAT[e.category] }}>
                {parseYt(e.youtube) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${parseYt(e.youtube)}?rel=0`}
                    title={e.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <span className="big">#{e.number}</span>
                    <span className="note">Add a YouTube link to this episode</span>
                  </>
                )}
              </div>
              <div className="body">
                <p className="emeta">{e.category} · Ep. {e.number} · {e.duration} · {e.date}</p>
                <h3>{e.title}</h3>
                <p className="clamp">{e.description}</p>
                {e.guest !== "Solo" && <p className="egu">with {e.guest}, {e.guestRole}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="guests" className="section">
        <div className="head"><h2>Guests who joined the conversation</h2><a href="#">See everyone</a></div>
        <div className="guests">
          {GUESTS.map((g) => (
            <a key={g.name} href="#" className="guest">
              <span className="avatar" style={{ background: g.c }}>{g.i}</span>
              <h3>{g.name}</h3>
              <p>{g.role}</p>
              <small>Episode {g.ep}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section clips">
        <div className="head"><h2>Lines you will repeat</h2></div>
        <div className="quotes">
          {clips.map(([q, who]) => (
            <blockquote key={who}><p>{q}</p><cite>{who}</cite></blockquote>
          ))}
        </div>
      </section>

      <section className="section watch">
        <div
          className="video"
          style={FEATURED_VIDEO ? { backgroundImage: `url(${thumbUrl(FEATURED_VIDEO)})` } : undefined}
        >
          <button className="play" aria-label="Play featured video" onClick={() => openVideo(FEATURED_VIDEO, "Featured video")}>▶</button>
        </div>
        <div>
          <h2>Watch the full video episodes</h2>
          <p>Every conversation is filmed. Catch the faces, the side eyes and the clips that never made the audio.</p>
          <a className="btn btn-pink" href={CHANNEL} target="_blank" rel="noopener noreferrer">Subscribe on YouTube</a>
        </div>
      </section>

      <section id="events" className="section">
        <div className="head"><h2>Come see us live</h2><a href="#">All dates</a></div>
        <ul className="tour">
          {tour.map(([d, city, venue, status]) => (
            <li key={d}>
              <b>{d}</b>
              <span className="city">{city}</span>
              <span className="venue">{venue}</span>
              <a className={status === "Sold out" ? "btn sold" : "btn btn-cream"} href="#">{status === "Sold out" ? "Sold out" : "Get tickets"}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="head"><h2>What listeners say</h2></div>
        <div className="quotes">
          {reviews.map(([q, who]) => (
            <blockquote key={who} className="review"><p>{q}</p><cite>{who}</cite></blockquote>
          ))}
        </div>
      </section>

      <section id="merch" className="section">
        <div className="head"><h2>Merch</h2><a href="#">Shop all</a></div>
        <div className="grid">
          {MERCH.map(([n, price, c]) => (
            <a key={n} href="#" className="card">
              <div className="thumb" style={{ background: c }}><span>SS</span></div>
              <h3>{n}</h3>
              <p>{price}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="section about">
        <div>
          <h2>Hosted by Oga Peter. One rule: say it plainly.</h2>
          <p>The Saner Side Podcast is a weekly show, hosted by Oga Peter, where honest conversation meets big laughs. Each week we sit down with one guest, answer your dilemmas, and talk about work, money, love and family without the polish.</p>
          <p>Come for the banter. Stay for the answers nobody else will give you.</p>
          <div className="facts">
            <div><b>142</b><span>episodes</span></div>
            <div><b>8</b><span>seasons</span></div>
            <div><b>2.4M+</b><span>monthly listeners</span></div>
          </div>
          <a className="btn btn-cream" href="#episodes">Start with the latest episode</a>
        </div>
        <div className="portrait">
          <div className="blob" />
          <img src={HOST_PHOTO} alt="Oga Peter, host of The Saner Side Podcast" onDoubleClick={nextTheme} draggable={false} title="Double-tap to change the colour" />
          <span className="sticker">Oga Peter, host and founder</span>
          <span className="bubble">New episode every Wednesday</span>
          <span className="hint">Double-tap the photo to change the colour{themeIdx >= 0 ? ` · ${THEMES[themeIdx].name}` : ""}</span>
        </div>
      </section>

      <section id="dilemmas" className="dilemma">
        <h2>Got a situation? Send it in.</h2>
        <p>Type it out or record a voice note. We read the best ones on air.</p>
        <a className="btn btn-pink" href="#">Submit a dilemma</a>
      </section>

      <section id="newsletter" className="section news">
        <h2>Never miss an episode</h2>
        <p>New episodes, behind-the-scenes clips and the occasional hot take, straight to your inbox.</p>
        {status === "success" ? (
          <div className="success"><b>You are in.</b><span>Check your inbox for a confirmation. Talk soon.</span></div>
        ) : (
          <form className="field" onSubmit={submit}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" />
            <button className="btn btn-pink" type="submit" disabled={status === "loading"}>{status === "loading" ? "Subscribing..." : "Subscribe"}</button>
          </form>
        )}
        <small className="fine">No spam. Unsubscribe anytime.</small>
      </section>

      <section className="section faq">
        <h2>Questions</h2>
        {faqs.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <div className="sponsors">
        <p>Supported by</p>
        {sponsors.map((s) => <span key={s}>{s}</span>)}
      </div>

      <footer>
        <div className="fgrid">
          <div>
            <a className="logo" href="#">The Saner Side</a>
            <p>Unfiltered conversations on pop culture, careers, money and the confusions of modern adulthood. Hosted by Oga Peter.</p>
          </div>
          {Object.entries(COLUMNS).map(([t, links]) => (
            <div key={t}>
              <h4>{t}</h4>
              <ul>{links.map(([l, h]) => (<li key={l}><a href={h}>{l}</a></li>))}</ul>
            </div>
          ))}
        </div>
        <div className="fbase">
          <span>© {new Date().getFullYear()} The Saner Side Podcast by Oga Peter. All rights reserved.</span>
          <span><a href="#">Privacy</a> &nbsp; <a href="#">Terms</a></span>
        </div>
      </footer>
    {video && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setVideo(null)}>
          <div className="frame" onClick={(e) => e.stopPropagation()}>
            <button className="close" aria-label="Close video" onClick={() => setVideo(null)}>✕</button>
            {video.id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="empty">
                <b>No YouTube video linked yet</b>
                <span>Add a YouTube link in the data at the top of this file.</span>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
  );
}