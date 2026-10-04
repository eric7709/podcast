"use client";

import { useState, useEffect, FormEvent } from "react";

const platforms = ["Spotify", "Apple Podcasts", "YouTube", "Google Podcasts"];

interface Episode { id: string; youtube: string; number: number; title: string; description: string; guest: string; guestRole: string; duration: string; date: string; category: string; }

const CAT: Record<string, string> = { Money: "#FF3E9A", Dating: "#FF8A3D", Careers: "#8B5CF6", Family: "#22C7A9", "Pop Culture": "#FFD23F", Opinions: "#4DA3FF" };

const EPISODES: Episode[] = [
  { id: "ep-142", youtube: "https://www.youtube.com/watch?v=IFXW9u65fWA&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 142, title: "The Financially Responsible Episode", description: "Ngozi Okonye joins the Bounce for a conversation about money, crypto, and building better financial habits. We also revisit our unfortunate past business ventures, snail and pig farming included.", guest: "Ngozi Okonye", guestRole: "Head of Brand, Busha", duration: "1h 12m", date: "Feb 18, 2026", category: "Money" },
  { id: "ep-141", youtube: "https://www.youtube.com/watch?v=DyYI4WMKFlE&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 141, title: "Dating Apps Are a Scam (But We're Still On Them)", description: "From left-swiping on our soulmates to accidentally matching with our exes, we unpack why modern dating feels like a full-time job.", guest: "Solo", guestRole: "", duration: "58m", date: "Feb 11, 2026", category: "Dating" },
  { id: "ep-140", youtube: "https://www.youtube.com/watch?v=8JqrgxFDYsk&pp=ygURb2dhIHBldGVyIHBvZGNhc3TSBwkJLQwBhyohjO8%3D", number: 140, title: "Career Pivots & Quarter-Life Crises", description: "If you've ever cried in a bathroom during a work event, this one is for you. We talk quitting, pivoting, and pretending to have it together.", guest: "Temi Otedola", guestRole: "Entrepreneur", duration: "1h 04m", date: "Feb 4, 2026", category: "Careers" },
  { id: "ep-139", youtube: "https://www.youtube.com/watch?v=J7UBMZfhdu8&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 139, title: "Family Group Chats & Boundary Battles", description: "The aunties are typing. We discuss the art of saying no, keeping boundaries, and the politics of the family WhatsApp group.", guest: "Solo", guestRole: "", duration: "49m", date: "Jan 28, 2026", category: "Family" },
  { id: "ep-138", youtube: "https://www.youtube.com/watch?v=58O0HgJL5Nc&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 138, title: "The Pop Culture Catch-Up", description: "From award shows to album drops, everything you missed while you were being a responsible adult.", guest: "Solo", guestRole: "", duration: "52m", date: "Jan 21, 2026", category: "Pop Culture" },
  { id: "ep-137", youtube: "https://www.youtube.com/watch?v=Gv4Kn32T9c4&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 137, title: "Hot Takes & Hard Truths", description: "We asked you for your most controversial opinions. You delivered. We react. No filters, no apologies.", guest: "Solo", guestRole: "", duration: "1h 01m", date: "Jan 14, 2026", category: "Opinions" },
  { id: "ep-136", youtube: "https://www.youtube.com/watch?v=tfqpdo_AW3w&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D", number: 136, title: "The Side Hustle Confessions", description: "Everyone has a side hustle and nobody is telling the whole story. We share the wins, the losses and the invoices that never got paid.", guest: "Solo", guestRole: "", duration: "55m", date: "Jan 7, 2026", category: "Money" },
];

/* ── YOUTUBE: each episode has a `youtube` field (full link or ID). Featured video below. ── */
const parseYt = (s: string) => (s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? s.trim());
const CHANNEL = "https://www.youtube.com/@yourchannel";
const FEATURED_INPUT = "https://www.youtube.com/watch?v=nXXb57B7ofA&pp=ygURb2dhIHBldGVyIHBvZGNhc3Q%3D"; // trailer / featured video link or ID
const FEATURED_VIDEO = parseYt(FEATURED_INPUT);
const thumbUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const THEMES = [
  { name: "Cyan", bg: "#00D9F5", card: "#7FEBFA", fg: "#06232B", mute: "#0E4A57", accent: "#7B1FA2", ink: "#FFFFFF", line: "rgba(6,35,43,.18)", line2: "rgba(6,35,43,.35)" },
  { name: "Sunshine", bg: "#FFD60A", card: "#FFE766", fg: "#241C00", mute: "#5C4B00", accent: "#B3125B", ink: "#FFFFFF", line: "rgba(36,28,0,.18)", line2: "rgba(36,28,0,.35)" },
  { name: "Lavender", bg: "#B79CFF", card: "#D3C2FF", fg: "#170B3A", mute: "#43307D", accent: "#7A0A4B", ink: "#FFFFFF", line: "rgba(23,11,58,.18)", line2: "rgba(23,11,58,.35)" },
];

const CATS = ["All", ...Object.keys(CAT)];
const NAV = [["Episodes", "#episodes"], ["Guests", "#guests"], ["Events", "#events"], ["Merch", "#merch"], ["About", "#about"]];
const MERCH = [["The Quiet Parts Tee", "₦18,000", "#FF3E9A"], ["Season 8 Hoodie", "₦35,000", "#8B5CF6"], ["Bounce Tote", "₦9,500", "#FF8A3D"], ["Enamel Mug", "₦6,500", "#22C7A9"]];
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
  ["Finally a show that says the quiet part out loud, with receipts.", "Zainab, Abuja"],
];

const faqs = [
  ["When do new episodes come out?", "Every Wednesday at 7am on all platforms, with the video on YouTube."],
  ["Can I be a guest?", "We pick guests from the dilemmas inbox and listener nominations. Send a note and tell us your story."],
  ["What does the members club include?", "Bonus episodes, early access, ad-free listening and a private group chat with the hosts."],
];

const sponsors = ["Kuda", "Busha", "Paystack", "Jumia", "Flutterwave"];

const guests = ["Founders", "Creators", "Doctors", "Athletes", "Artists", "Authors", "Investors", "Strangers"];

const css = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;800&family=DM+Sans:wght@400;500;700&display=swap');
:root {
  --plum: #1d1020;
  --plum-2: #2a1830;
  --bg: #1d1020; --card: #2a1830; --fg: #fff3e6; --ink: #1d1020; --line: var(--line); --line2: var(--line2);
  --pink: #ff3e9a;
  --cream: #fff3e6;
  --mute: #c9b6c9;
  --max: 1180px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--fg); font-family: 'DM Sans', system-ui, sans-serif; line-height: 1.55; }
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
.review p { font-family: 'DM Sans', sans-serif; font-size: 18px; line-height: 1.5; letter-spacing: 0; font-weight: 400; }

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
.tag { position: absolute; top: 14px; left: 14px; background: rgba(29,16,32,.85); color: var(--cream); border-radius: 999px; padding: 4px 12px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; }
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
          <a className="logo" href="#">The Quiet Parts</a>
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
        <h1>The quiet parts, out loud.</h1>
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
        <div className="head"><h2>Guests who said the quiet parts too</h2><a href="#">See everyone</a></div>
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
              <div className="thumb" style={{ background: c }}><span>QP</span></div>
              <h3>{n}</h3>
              <p>{price}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="section about">
        <div>
          <h2>Hosted by Oga Peter. One rule: say it plainly.</h2>
          <p>The Quiet Parts is a weekly show, hosted by Oga Peter, where honest conversation meets big laughs. Each week we sit down with one guest, answer your dilemmas, and talk about work, money, love and family without the polish.</p>
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
          <img src={HOST_PHOTO} alt="Oga Peter, host of The Quiet Parts" onDoubleClick={nextTheme} draggable={false} title="Double-tap to change the colour" />
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
            <a className="logo" href="#">The Quiet Parts</a>
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
          <span>© {new Date().getFullYear()} The Quiet Parts by Oga Peter. All rights reserved.</span>
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

/* Host photo (embedded so this stays a single file) */
const HOST_PHOTO = "data:image/jpeg;base64,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";