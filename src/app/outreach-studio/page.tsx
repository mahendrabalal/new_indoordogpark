'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

interface ParkItem {
  name: string;
  email: string;
  listingUrl: string;
  website: string;
  phone: string;
  city: string;
  state: string;
  hasEmail: boolean;
}

interface BeehiivContactItem {
  id: string;
  email: string;
  status: string;
  name?: string;
  parkName?: string;
  city?: string;
  state?: string;
}

interface TemplateDef {
  id: string;
  name: string;
  shortLabel: string;
  icon: string;
  badge: string;
  badgeColor: string;
  subject: string;
  body: string;
  defaultNote: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'badge-ego-bait',
    name: 'Featured Badge & Partner',
    shortLabel: 'Featured Badge',
    icon: 'bi-award-fill',
    badge: 'Highest Link ROI',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    subject: 'Congrats {{park_name}} - Featured in the 2026 Indoor Dog Park Directory!',
    body: `Hello {{contact_name}} Team,

I'm reaching out from IndoorDogPark.org. We just published our 2026 directory update for {{city}}, and **{{park_name}}** is officially featured as a top-rated indoor dog recreation facility!

👉 **View your verified listing:** [{{listing_url}}]({{listing_url}})

### 🏆 Claim Your Official 2026 Featured Badge
To celebrate, we created an official **"Featured 2026"** embed badge for your website. When you place this badge in your website footer or "About / Press" page, our directory automatically upgrades your listing to a **#1 Featured Partner** at the top of the {{city}} directory.

{{badge_snippet}}

### 1-Click Embed Code:
\`\`\`html
<a href="{{listing_url}}" target="_blank" rel="noopener noreferrer"><img src="https://www.indoordogpark.org/images/badge-featured.svg" alt="Featured on IndoorDogPark.org 2026" width="180" height="208" style="border:none;" /></a>
\`\`\`

Once our system detects the badge on your website, your listing will be immediately elevated to the top of our search results and interactive map!

If you need any adjustments to your photos, hours, or description, simply reply to this email.

Warm regards,  
**The IndoorDogPark.org Team**  
[https://www.indoordogpark.org](https://www.indoordogpark.org)`,
    defaultNote: 'We loved your climate-controlled play areas and safety protocols!',
  },
  {
    id: 'broken-link-gopetfriendly',
    name: 'Broken Link Replacement',
    shortLabel: 'Broken Link',
    icon: 'bi-link-45deg',
    badge: 'High Authority .Org',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    subject: 'Outdated pet directory link update for {{city}} dog owners',
    body: `Hi {{contact_name}},

I was reading your helpful pet resource page on your website and noticed a link pointing to GoPetFriendly. 

As you may know, GoPetFriendly recently wound down active operations in early 2025 (*"It's Been a Great Ride"*). 

If you're looking for an active, 2026-updated resource for local pet owners seeking safe, climate-controlled indoor dog parks, daycare, and agility spaces, we maintain a dedicated directory for {{city}}:

👉 **Active 2026 {{city}} Guide:** [https://www.indoordogpark.org/cities/{{city_slug}}](https://www.indoordogpark.org/cities/{{city_slug}})

Would you be open to replacing the outdated link with our verified guide so your readers have access to current hours, safety requirements, and weather-proof dog recreation?

Thanks for all you do for the pet community!

Best regards,  
**The IndoorDogPark.org Team**`,
    defaultNote: 'Noticed this while browsing your helpful local resources section.',
  },
  {
    id: 'shelter-rescue',
    name: 'Shelter & Rescue Resource',
    shortLabel: 'Rescue / Shelter',
    icon: 'bi-heart-pulse-fill',
    badge: 'High Trust .Org',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    subject: 'Safe indoor socialization resource for {{city}} rescue adopters',
    body: `Hello {{contact_name}} Team,

First of all, thank you for the wonderful rescue and adoption work you do in {{city}}!

We know that newly adopted rescue dogs often need controlled, climate-safe spaces to exercise and socialize without the unpredictable chaos of outdoor public parks or extreme weather hazards (scorching summer asphalt / winter freezes).

We've compiled a verified directory of indoor dog parks and climate-controlled training facilities in {{city}}:

👉 **{{city}} Indoor Dog Recreation Guide:** [https://www.indoordogpark.org/cities/{{city_slug}}](https://www.indoordogpark.org/cities/{{city_slug}})

We also offer a free **Dog Exercise Calculator** ([https://www.indoordogpark.org/dog-exercise-calculator](https://www.indoordogpark.org/dog-exercise-calculator)) to help new adopters calculate daily exercise needs based on breed and age.

Would this be a helpful link to add to your "New Adopter Resources" or "Pet Care Links" page?

Thank you again for helping dogs find loving forever homes.

Warmly,  
**IndoorDogPark.org Community Team**`,
    defaultNote: 'Dedicated to supporting local dog rescues and humane societies.',
  },
  {
    id: 'tourism-guide',
    name: 'Tourism & Visitors Guide',
    shortLabel: 'Tourism Board',
    icon: 'bi-geo-alt-fill',
    badge: 'Local SEO Booster',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    subject: 'Pet-friendly indoor recreation guide for {{city}} visitors',
    body: `Hi {{contact_name}},

I'm reaching out from IndoorDogPark.org. When travelers visit {{city}} with their pets, bad weather (heat waves, rain, or snow) often makes outdoor recreation difficult.

We have published a curated guide to indoor dog parks, dog-friendly taprooms, and training centers in {{city}}:

👉 **Visiting {{city}} with Dogs - Indoor Guide:** [https://www.indoordogpark.org/cities/{{city_slug}}](https://www.indoordogpark.org/cities/{{city_slug}})

Could you consider adding this as a resource in your "Pet-Friendly Travel" or "Things to Do" visitor guide?

Thank you for helping travelers explore {{city}} with their four-legged family members!

Best regards,  
**The IndoorDogPark.org Team**`,
    defaultNote: 'A great addition to your official visitor guides.',
  },
  {
    id: 'custom-blank',
    name: 'Blank Custom Pitch',
    shortLabel: 'Custom',
    icon: 'bi-pencil-square',
    badge: 'Flexible',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    subject: 'Indoor dog recreation insights for {{city}}',
    body: `Hi {{contact_name}},

Write your custom message here...

Best regards,  
**The IndoorDogPark.org Team**`,
    defaultNote: '',
  },
];

export default function OutreachStudioPage() {
  // Navigation & View states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('badge-ego-bait');
  const [contactSource, setContactSource] = useState<'directory' | 'beehiiv' | 'manual'>('directory');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [showSenderDetails, setShowSenderDetails] = useState<boolean>(false);

  // Search & Target States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ParkItem[]>([]);
  const [beehiivContacts, setBeehiivContacts] = useState<BeehiivContactItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedPark, setSelectedPark] = useState<ParkItem | null>(null);

  // Email form states
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [parkName, setParkName] = useState<string>('');
  const [city, setCity] = useState<string>('New Orleans');
  const [stateName, setStateName] = useState<string>('LA');
  const [listingUrl, setListingUrl] = useState<string>('https://www.indoordogpark.org');
  const [fromName, setFromName] = useState<string>('IndoorDogPark.org');
  const [fromEmail, setFromEmail] = useState<string>('media@indoordogpark.org');
  const [replyTo, setReplyTo] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [bodyContent, setBodyContent] = useState<string>('');
  const [personalNote, setPersonalNote] = useState<string>('');
  const [syncToBeehiiv, setSyncToBeehiiv] = useState<boolean>(false);

  // Feedback states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testEmailAddress, setTestEmailAddress] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load initial template
  useEffect(() => {
    const tpl = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
    setSubject(tpl.subject);
    setBodyContent(tpl.body);
    setPersonalNote(tpl.defaultNote);
  }, [selectedTemplateId]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Beehiiv contacts on demand
  useEffect(() => {
    if (contactSource === 'beehiiv' && beehiivContacts.length === 0) {
      setIsSearching(true);
      fetch('/api/outreach/beehiiv-contacts')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.contacts)) {
            setBeehiivContacts(data.contacts);
          }
        })
        .catch((err) => console.error('Beehiiv fetch error:', err))
        .finally(() => setIsSearching(false));
    }
  }, [contactSource, beehiivContacts.length]);

  // Search directory parks
  useEffect(() => {
    if (contactSource === 'directory') {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (stateFilter) params.set('state', stateFilter);
        params.set('limit', '12');

        fetch(`/api/outreach/parks-search?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setSearchResults(data.parks || []);
            }
          })
          .catch((err) => console.error('Parks search error:', err))
          .finally(() => setIsSearching(false));
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, stateFilter, contactSource]);

  // Handle selecting a park
  const handleSelectPark = (park: ParkItem) => {
    setSelectedPark(park);
    setParkName(park.name);
    setRecipientEmail(park.email || '');
    setRecipientName(park.name);
    setCity(park.city || 'Your City');
    setStateName(park.state || 'CA');
    setListingUrl(park.listingUrl || `https://www.indoordogpark.org/parks/${park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    setIsSearchOpen(false);
    setStatusMessage({ type: 'info', text: `Selected: ${park.name} (${park.city}, ${park.state})` });
  };

  // Handle selecting a Beehiiv contact
  const handleSelectBeehiivContact = (contact: BeehiivContactItem) => {
    setRecipientEmail(contact.email);
    setRecipientName(contact.name || contact.parkName || 'Partner');
    if (contact.parkName) setParkName(contact.parkName);
    if (contact.city) setCity(contact.city);
    if (contact.state) setStateName(contact.state);
    setIsSearchOpen(false);
    setStatusMessage({ type: 'info', text: `Selected subscriber: ${contact.email}` });
  };

  // Dynamic Variable Replacer
  const renderVariables = (text: string) => {
    const citySlug = (city || 'city').toLowerCase().replace(/\s+/g, '-');
    return text
      .replace(/{{park_name}}/g, parkName || 'Your Facility')
      .replace(/{{contact_name}}/g, recipientName || 'Park Owner')
      .replace(/{{city}}/g, city || 'your city')
      .replace(/{{city_slug}}/g, citySlug)
      .replace(/{{state}}/g, stateName || 'your state')
      .replace(/{{listing_url}}/g, listingUrl || 'https://www.indoordogpark.org')
      .replace(/{{year}}/g, '2026')
      .replace(
        /{{badge_snippet}}/g,
        `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; text-align:center; margin:20px 0;">
          <img src="https://www.indoordogpark.org/images/badge-featured.svg" alt="Featured on IndoorDogPark.org 2026" width="160" height="185" style="display:inline-block; margin-bottom:12px;" />
          <p style="margin:0; font-size:12px; color:#64748b; font-weight:700; letter-spacing:0.5px; text-transform:uppercase;">Official 2026 Featured Badge</p>
        </div>`
      );
  };

  const compiledSubject = useMemo(() => renderVariables(subject), [subject, parkName, recipientName, city, stateName, listingUrl]);

  const compiledHtml = useMemo(() => {
    const processedBody = renderVariables(bodyContent);

    let formattedBody = processedBody
      .replace(/^### (.*$)/gim, '<h3 style="color:#0f172a; margin:24px 0 10px; font-size:17px; font-weight:700;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#0f172a; margin:28px 0 12px; font-size:20px; font-weight:800;">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#6366f1; text-decoration:underline; font-weight:600;">$1</a>')
      .replace(/```html([\s\S]*?)```/g, '<div style="background:#0f172a; color:#38bdf8; font-family:Consolas, Monaco, monospace; padding:12px; border-radius:8px; font-size:12px; word-break:break-all; margin:16px 0; text-align:left;">$1</div>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 16px; font-size:15px; line-height:1.65; color:#334155;">')
      .replace(/\n/g, '<br />');

    const personalNoteBox = personalNote
      ? `<div style="background:#f5f3ff; border-left:4px solid #6366f1; padding:14px 16px; border-radius:0 8px 8px 0; margin-bottom:24px;">
          <p style="margin:0; font-size:14px; color:#4338ca; font-style:italic;"><strong>Personal note:</strong> "${personalNote}"</p>
        </div>`
      : '';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${compiledSubject}</title>
</head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f1f5f9; margin:0; padding:24px 12px; -webkit-font-smoothing:antialiased;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Top Header Banner -->
    <div style="background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding:28px 24px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:800; letter-spacing:-0.5px;">IndoorDogPark.org</h1>
      <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px; font-weight:500;">America's Premier Indoor Canine Recreation Directory</p>
    </div>

    <!-- Body Content Area -->
    <div style="padding:32px 28px;">
      ${personalNoteBox}
      <p style="margin:0 0 16px; font-size:15px; line-height:1.65; color:#334155;">
        ${formattedBody}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc; padding:20px 28px; border-top:1px solid #e2e8f0; text-align:center; font-size:12px; color:#64748b; line-height:1.5;">
      <p style="margin:0 0 6px;">Sent by <strong>IndoorDogPark.org</strong> • 2026 Directory Outreach</p>
      <p style="margin:0;">
        <a href="https://www.indoordogpark.org" style="color:#6366f1; text-decoration:none;">Visit Directory</a> • 
        <a href="https://www.indoordogpark.org/privacy" style="color:#6366f1; text-decoration:none;">Privacy Policy</a> • 
        <a href="https://www.indoordogpark.org/contact" style="color:#6366f1; text-decoration:none;">Contact Support</a>
      </p>
    </div>

  </div>
</body>
</html>`;
  }, [bodyContent, compiledSubject, personalNote, parkName, recipientName, city, stateName, listingUrl]);

  const insertSnippet = (snippet: string) => {
    setBodyContent((prev) => prev + '\n' + snippet);
  };

  const handleSendEmail = async (isTest: boolean = false, targetTo?: string) => {
    const finalTo = targetTo || recipientEmail;
    if (!finalTo) {
      setStatusMessage({ type: 'error', text: 'Please specify a recipient email address.' });
      return;
    }

    setIsSending(true);
    setStatusMessage({ type: 'info', text: isTest ? `Sending test preview to ${finalTo}...` : `Dispatching outreach to ${finalTo}...` });

    try {
      const response = await fetch('/api/outreach/composer-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: finalTo,
          toName: recipientName,
          from: `${fromName} <${fromEmail}>`,
          replyTo: replyTo || undefined,
          subject: compiledSubject,
          html: compiledHtml,
          testMode: isTest,
          syncToBeehiiv: syncToBeehiiv && !isTest,
          parkDetails: {
            parkName,
            city,
            state: stateName,
            website: selectedPark?.website,
          },
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        setStatusMessage({
          type: 'success',
          text: isTest
            ? `✅ Test email delivered to ${finalTo}!`
            : `🚀 Outreach sent to ${finalTo}! (ID: ${resData.emailId || 'OK'})${resData.beehiivSynced ? ' • Synced to Beehiiv' : ''}`,
        });
        if (showTestModal) setShowTestModal(false);
      } else {
        setStatusMessage({
          type: 'error',
          text: `❌ Error: ${resData.error || 'Failed to dispatch email.'}`,
        });
      }
    } catch (err: any) {
      console.error('Send error:', err);
      setStatusMessage({ type: 'error', text: `❌ Network error: ${err.message}` });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ── Top Bar / Header ─────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#0c111d]/95 backdrop-blur sticky top-0 z-40 px-5 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-white hover:text-indigo-300 transition">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-base shadow-md shadow-indigo-500/20">
                🐾
              </span>
              <span className="text-base tracking-tight font-semibold">IndoorDogPark</span>
            </Link>
            <span className="text-slate-600 text-sm">/</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Outreach Studio</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Resend Live
              </span>
            </div>
          </div>

          {/* Quick Actions & Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowTestModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 transition shadow-sm"
            >
              <i className="bi bi-send-check text-indigo-400"></i>
              <span>Send Test</span>
            </button>

            <button
              onClick={() => handleSendEmail(false)}
              disabled={isSending || !recipientEmail}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
                isSending || !recipientEmail
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-[0.98]'
              }`}
            >
              {isSending ? (
                <>
                  <span className="inline-block animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill text-[11px]"></i>
                  <span>Send Outreach</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Status Toast Banner ──────────────────────────────────────────── */}
      {statusMessage && (
        <div
          className={`px-4 py-2.5 text-xs font-medium border-b transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-800/80 text-rose-200'
              : 'bg-indigo-950/90 border-indigo-800/80 text-indigo-200'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <i
                className={`bi ${
                  statusMessage.type === 'success'
                    ? 'bi-check-circle-fill text-emerald-400'
                    : statusMessage.type === 'error'
                    ? 'bi-exclamation-octagon-fill text-rose-400'
                    : 'bi-info-circle-fill text-indigo-400'
                }`}
              ></i>
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="opacity-60 hover:opacity-100 text-sm">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Main Dual-Pane Workspace ─────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Composer & Controls (7 Cols) ─────────────────── */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* 1. Campaign Template Cards */}
          <div className="bg-[#101625] border border-white/[0.08] rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                1. Select Campaign Strategy
              </span>
              <span className="text-[11px] text-slate-500">5 Proven Link Templates</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tpl) => {
                const isActive = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`text-left p-3 rounded-lg border text-xs transition-all flex flex-col justify-between gap-2 ${
                      isActive
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : 'bg-[#151c2e] border-white/[0.06] text-slate-300 hover:bg-[#1a233a] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`bi ${tpl.icon} text-sm ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}></i>
                      <span className="font-semibold truncate">{tpl.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium border inline-block w-fit ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Park & Recipient Picker */}
          <div className="bg-[#101625] border border-white/[0.08] rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                2. Target Recipient & Listing
              </span>

              {/* Source Tabs */}
              <div className="flex items-center rounded-lg bg-[#0a0d16] p-1 border border-white/[0.08]">
                <button
                  onClick={() => setContactSource('directory')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    contactSource === 'directory' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Park Directory (7,200)
                </button>
                <button
                  onClick={() => setContactSource('beehiiv')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    contactSource === 'beehiiv' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beehiiv Contacts
                </button>
                <button
                  onClick={() => setContactSource('manual')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    contactSource === 'manual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Custom Entry
                </button>
              </div>
            </div>

            {/* Combobox Search Bar */}
            {contactSource === 'directory' && (
              <div className="relative" ref={searchContainerRef}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <i className="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                    <input
                      type="text"
                      placeholder="Search 7,200+ parks by name, city, state, or email..."
                      value={searchQuery}
                      onFocus={() => setIsSearchOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <select
                    value={stateFilter}
                    onChange={(e) => {
                      setStateFilter(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    className="bg-[#0a0d16] border border-white/[0.1] rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">All States</option>
                    <option value="la">Louisiana (LA)</option>
                    <option value="ca">California (CA)</option>
                    <option value="tx">Texas (TX)</option>
                    <option value="fl">Florida (FL)</option>
                    <option value="co">Colorado (CO)</option>
                    <option value="ny">New York (NY)</option>
                  </select>
                </div>

                {/* Floating Autocomplete Dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto border border-white/[0.12] rounded-xl bg-[#0c111e] divide-y divide-white/[0.04] shadow-2xl z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <span className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Searching park database...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((park, idx) => (
                        <button
                          key={`${park.name}-${idx}`}
                          onClick={() => handleSelectPark(park)}
                          className={`w-full text-left p-2.5 px-3 text-xs hover:bg-[#161f36] transition flex items-center justify-between gap-3 ${
                            selectedPark?.name === park.name ? 'bg-indigo-600/20 text-indigo-200' : 'text-slate-300'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-semibold text-white">{park.name}</span>
                            <span className="text-slate-400 ml-2">
                              {park.city}, {park.state}
                            </span>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {park.hasEmail ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {park.email}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                                No email
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500">No parks found.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Beehiiv Picker */}
            {contactSource === 'beehiiv' && (
              <div className="space-y-2">
                {beehiivContacts.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto border border-white/[0.1] rounded-lg bg-[#0a0d16] divide-y divide-white/[0.04]">
                    {beehiivContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleSelectBeehiivContact(contact)}
                        className="w-full text-left p-2.5 px-3 text-xs hover:bg-[#161f36] transition flex items-center justify-between text-slate-300"
                      >
                        <div>
                          <span className="font-semibold text-white">{contact.email}</span>
                          {contact.parkName && <span className="text-slate-400 ml-2">({contact.parkName})</span>}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                          {contact.status}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg bg-[#0a0d16] border border-white/[0.08] text-xs text-slate-400">
                    <p>No active Beehiiv contacts loaded, or Beehiiv credentials need to be configured.</p>
                  </div>
                )}
              </div>
            )}

            {/* Recipient Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Recipient Email *</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="owner@dogpark.com"
                  className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Park / Business Name</label>
                <input
                  type="text"
                  value={parkName}
                  onChange={(e) => {
                    setParkName(e.target.value);
                    setRecipientName(e.target.value);
                  }}
                  placeholder="e.g. Canine Connection"
                  className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">City & State</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Orleans"
                    className="flex-1 bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="LA"
                    className="w-16 bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Directory Listing URL</label>
                <input
                  type="text"
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  placeholder="https://www.indoordogpark.org/parks/..."
                  className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Sender & Reply-To Settings Toggle */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowSenderDetails(!showSenderDetails)}
                className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5"
              >
                <i className={`bi bi-chevron-${showSenderDetails ? 'up' : 'down'} text-[10px]`}></i>
                <span>{showSenderDetails ? 'Hide' : 'Configure'} Sender & Reply-To Settings</span>
              </button>

              {showSenderDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5 p-3 rounded-lg bg-[#0a0d16] border border-white/[0.06]">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">From Name & Email</label>
                    <input
                      type="text"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="outreach@indoordogpark.org"
                      className="w-full bg-[#101625] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Reply-To (Your Inbox)
                    </label>
                    <input
                      type="email"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      placeholder="yourpersonal@gmail.com"
                      className="w-full bg-[#101625] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Subject & Message Editor */}
          <div className="bg-[#101625] border border-white/[0.08] rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              3. Customize Email Message
            </span>

            {/* Subject Line with Variable Tags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Subject Line</label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">Insert tag:</span>
                  <button
                    onClick={() => setSubject((s) => s + ' {{park_name}}')}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1a233a] text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    + Park
                  </button>
                  <button
                    onClick={() => setSubject((s) => s + ' {{city}}')}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1a233a] text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    + City
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Formatting Bar */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0d16] p-1.5 rounded-lg border border-white/[0.06] text-xs">
              <button
                onClick={() => insertSnippet('**Bold Text**')}
                className="px-2 py-1 bg-[#151c2e] hover:bg-[#1e293b] rounded text-slate-300 font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => insertSnippet('*Italic Text*')}
                className="px-2 py-1 bg-[#151c2e] hover:bg-[#1e293b] rounded text-slate-300 italic"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => insertSnippet('[Link Text](https://www.indoordogpark.org)')}
                className="px-2 py-1 bg-[#151c2e] hover:bg-[#1e293b] rounded text-slate-300 inline-flex items-center gap-1"
                title="Link"
              >
                <i className="bi bi-link-45deg"></i> Link
              </button>
              <button
                onClick={() => insertSnippet('{{badge_snippet}}')}
                className="px-2 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 rounded font-semibold inline-flex items-center gap-1"
                title="Insert Verified Badge"
              >
                🏆 Embed Badge Snippet
              </button>
              <button
                onClick={() => insertSnippet('{{listing_url}}')}
                className="px-2 py-1 bg-[#151c2e] hover:bg-[#1e293b] rounded text-indigo-300"
              >
                + Listing URL
              </button>
            </div>

            {/* Message Body Textarea */}
            <div>
              <textarea
                rows={11}
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg p-3 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Personal Note Box */}
            <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-lg p-3">
              <label className="block text-xs font-semibold text-indigo-300 mb-1">
                <i className="bi bi-chat-quote-fill mr-1"></i> Add 1-on-1 Personalized Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Loved your agility equipment and clean turf!"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="w-full bg-[#0a0d16] border border-indigo-700/50 rounded-lg px-3 py-1.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Beehiiv Safe Opt-In Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="syncBeehiiv"
                checked={syncToBeehiiv}
                onChange={(e) => setSyncToBeehiiv(e.target.checked)}
                className="mt-0.5 rounded bg-[#0a0d16] border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="syncBeehiiv" className="text-xs text-slate-300">
                Save contact to <strong>Beehiiv audience</strong> as <code className="text-indigo-300 font-mono">park_owner</code>{' '}
                <span className="text-amber-400/90 text-[11px] block mt-0.5">
                  (Best practice: only check for contacts who have opted in, claimed their listing, or replied)
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* ── Right Column: Live Device Preview (5 Cols) ─────────────────── */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#101625] border border-white/[0.08] rounded-xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <i className="bi bi-eye-fill text-indigo-400"></i> Live Email Preview
            </span>

            {/* Device Toggles */}
            <div className="flex items-center rounded-lg bg-[#0a0d16] p-0.5 border border-white/[0.08]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  previewDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop View (600px)"
              >
                <i className="bi bi-display mr-1"></i> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  previewDevice === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile View (375px)"
              >
                <i className="bi bi-phone mr-1"></i> Mobile
              </button>
              <button
                onClick={() => setPreviewDevice('code')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  previewDevice === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="HTML Code"
              >
                <i className="bi bi-code-slash mr-1"></i> HTML
              </button>
            </div>
          </div>

          {/* Email Preview Frame */}
          <div className="bg-[#101625] border border-white/[0.08] rounded-xl p-4 flex-1 flex flex-col justify-center items-center overflow-hidden min-h-[640px]">
            {previewDevice === 'code' ? (
              <div className="w-full h-full relative">
                <textarea
                  readOnly
                  value={compiledHtml}
                  className="w-full h-[600px] bg-[#0a0d16] border border-white/[0.08] rounded-lg p-3 text-xs font-mono text-emerald-400 leading-relaxed"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(compiledHtml);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md text-white shadow-md border border-slate-700"
                >
                  {copiedCode ? '✓ Copied' : 'Copy HTML'}
                </button>
              </div>
            ) : (
              <div
                className={`transition-all duration-300 overflow-y-auto bg-slate-100 rounded-xl shadow-2xl p-2 ${
                  previewDevice === 'mobile' ? 'w-[360px] h-[620px] border-8 border-slate-800 rounded-3xl' : 'w-full max-w-[560px] h-[620px]'
                }`}
              >
                <iframe
                  title="Email Preview Frame"
                  srcDoc={compiledHtml}
                  className="w-full h-full rounded-lg border-none"
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Send Test Modal ──────────────────────────────────────────────── */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101625] border border-white/[0.12] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="bi bi-send-check text-indigo-400"></i> Send a Test Preview
              </h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Send this exact draft with real preview data to your own email address to verify inbox styling, badge rendering, and buttons.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Test Email Address</label>
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-full bg-[#0a0d16] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendEmail(true, testEmailAddress)}
                disabled={isSending || !testEmailAddress}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
              >
                {isSending ? 'Sending...' : 'Send Test Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
