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

interface SentRecord {
  email: string;
  parkName: string;
  sentAt: string;
  templateId?: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'badge-ego-bait',
    name: 'Featured Badge & Partner',
    shortLabel: 'Featured Badge',
    icon: 'bi-award-fill',
    badge: 'Highest ROI',
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
    badge: 'Authority .Org',
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
    badge: 'High Trust',
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
    badge: 'Local SEO',
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

const US_STATES = [
  { code: '', label: 'All States' },
  { code: 'ca', label: 'California (CA)' },
  { code: 'tx', label: 'Texas (TX)' },
  { code: 'fl', label: 'Florida (FL)' },
  { code: 'ny', label: 'New York (NY)' },
  { code: 'il', label: 'Illinois (IL)' },
  { code: 'pa', label: 'Pennsylvania (PA)' },
  { code: 'oh', label: 'Ohio (OH)' },
  { code: 'ga', label: 'Georgia (GA)' },
  { code: 'nc', label: 'North Carolina (NC)' },
  { code: 'mi', label: 'Michigan (MI)' },
  { code: 'nj', label: 'New Jersey (NJ)' },
  { code: 'va', label: 'Virginia (VA)' },
  { code: 'wa', label: 'Washington (WA)' },
  { code: 'az', label: 'Arizona (AZ)' },
  { code: 'ma', label: 'Massachusetts (MA)' },
  { code: 'tn', label: 'Tennessee (TN)' },
  { code: 'in', label: 'Indiana (IN)' },
  { code: 'mo', label: 'Missouri (MO)' },
  { code: 'md', label: 'Maryland (MD)' },
  { code: 'wi', label: 'Wisconsin (WI)' },
  { code: 'co', label: 'Colorado (CO)' },
  { code: 'mn', label: 'Minnesota (MN)' },
  { code: 'sc', label: 'South Carolina (SC)' },
  { code: 'al', label: 'Alabama (AL)' },
  { code: 'la', label: 'Louisiana (LA)' },
  { code: 'ky', label: 'Kentucky (KY)' },
  { code: 'or', label: 'Oregon (OR)' },
  { code: 'ok', label: 'Oklahoma (OK)' },
  { code: 'ct', label: 'Connecticut (CT)' },
  { code: 'ut', label: 'Utah (UT)' },
  { code: 'nv', label: 'Nevada (NV)' },
  { code: 'ia', label: 'Iowa (IA)' },
  { code: 'ar', label: 'Arkansas (AR)' },
  { code: 'ks', label: 'Kansas (KS)' },
  { code: 'ms', label: 'Mississippi (MS)' },
  { code: 'nm', label: 'New Mexico (NM)' },
  { code: 'ne', label: 'Nebraska (NE)' },
  { code: 'id', label: 'Idaho (ID)' },
  { code: 'wv', label: 'West Virginia (WV)' },
  { code: 'hi', label: 'Hawaii (HI)' },
  { code: 'nh', label: 'New Hampshire (NH)' },
  { code: 'me', label: 'Maine (ME)' },
  { code: 'mt', label: 'Montana (MT)' },
  { code: 'ri', label: 'Rhode Island (RI)' },
  { code: 'de', label: 'Delaware (DE)' },
  { code: 'sd', label: 'South Dakota (SD)' },
  { code: 'nd', label: 'North Dakota (ND)' },
  { code: 'ak', label: 'Alaska (AK)' },
  { code: 'dc', label: 'Washington D.C. (DC)' },
  { code: 'vt', label: 'Vermont (VT)' },
  { code: 'wy', label: 'Wyoming (WY)' },
];

export default function OutreachStudioPage() {
  // Navigation & View states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('badge-ego-bait');
  const [contactSource, setContactSource] = useState<'directory' | 'beehiiv' | 'manual'>('directory');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [showSenderDetails, setShowSenderDetails] = useState<boolean>(false);

  // Sent Tracking State (Persisted in localStorage)
  const [sentRecords, setSentRecords] = useState<Record<string, SentRecord>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsent' | 'sent'>('all');

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
  const [city, setCity] = useState<string>('Glendale');
  const [stateName, setStateName] = useState<string>('CA');
  const [listingUrl, setListingUrl] = useState<string>('https://www.indoordogpark.org');
  const [fromName, setFromName] = useState<string>('IndoorDogPark.org');
  const [fromEmail, setFromEmail] = useState<string>('outreach@indoordogpark.org');
  const [replyTo, setReplyTo] = useState<string>('media@indoordogpark.org');
  const [subject, setSubject] = useState<string>('');
  const [bodyContent, setBodyContent] = useState<string>('');
  const [personalNote, setPersonalNote] = useState<string>('');
  const [syncToBeehiiv, setSyncToBeehiiv] = useState<boolean>(true);

  // Feedback states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testEmailAddress, setTestEmailAddress] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load Sent Records from LocalStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('indoordogpark_outreach_sent');
      if (raw) {
        setSentRecords(JSON.parse(raw));
      } else {
        const initialSeed: Record<string, SentRecord> = {
          'info@resort4dogs.com': {
            email: 'info@resort4dogs.com',
            parkName: 'Dog Resort Glendale',
            sentAt: new Date().toISOString(),
            templateId: 'badge-ego-bait',
          },
          'dog resort glendale': {
            email: 'info@resort4dogs.com',
            parkName: 'Dog Resort Glendale',
            sentAt: new Date().toISOString(),
            templateId: 'badge-ego-bait',
          },
        };
        setSentRecords(initialSeed);
        localStorage.setItem('indoordogpark_outreach_sent', JSON.stringify(initialSeed));
      }
    } catch (e) {
      console.warn('Could not read outreach sent history from localStorage', e);
    }
  }, []);

  // Helper to check if a park or email has already been contacted
  const getSentInfo = (emailOrName?: string) => {
    if (!emailOrName) return null;
    return sentRecords[emailOrName.toLowerCase().trim()] || null;
  };

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
        params.set('limit', '30');

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
      .replace(/```(?:html)?([\s\S]*?)```/g, (_, code) => {
        const escaped = code
          .trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
        return `<div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #6366f1; color:#0f172a; font-family:Consolas, Monaco, 'Courier New', monospace; padding:14px; border-radius:6px; font-size:12px; word-break:break-all; margin:16px 0; text-align:left; line-height:1.5;">${escaped}</div>`;
      })
      .replace(/^### (.*$)/gim, '<h3 style="color:#0f172a; margin:24px 0 10px; font-size:17px; font-weight:700;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#0f172a; margin:28px 0 12px; font-size:20px; font-weight:800;">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#6366f1; text-decoration:underline; font-weight:600;">$1</a>')
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
    
    <!-- Top Header Banner with Official Logo -->
    <div style="background:linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%); padding:32px 20px 24px; text-align:center;">
      <a href="https://www.indoordogpark.org" target="_blank" style="text-decoration:none; display:inline-block;">
        <div style="display:inline-block; background:#ffffff; padding:10px 24px 8px; border-radius:100px; box-shadow:0 4px 16px rgba(0,0,0,0.15);">
          <img src="https://www.indoordogpark.org/images/logo/logo.png" alt="IndoorDogPark.org" width="145" style="display:block; margin:0 auto; max-width:145px; height:auto;" />
        </div>
      </a>
      <p style="color:rgba(255,255,255,0.95); margin:14px 0 0; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px;">
        🐾 America's Premier Indoor Canine Recreation Directory
      </p>
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
        if (!isTest) {
          const sentItem: SentRecord = {
            email: finalTo.toLowerCase().trim(),
            parkName: parkName || selectedPark?.name || 'Park',
            sentAt: new Date().toISOString(),
            templateId: selectedTemplateId,
          };
          setSentRecords((prev) => {
            const next = {
              ...prev,
              [finalTo.toLowerCase().trim()]: sentItem,
              [(parkName || selectedPark?.name || '').toLowerCase().trim()]: sentItem,
            };
            try {
              localStorage.setItem('indoordogpark_outreach_sent', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }

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

  const sentCount = Object.keys(sentRecords).length > 0 ? Math.ceil(Object.keys(sentRecords).length / 2) : 0;
  const isCurrentRecipientSent = Boolean(getSentInfo(recipientEmail) || getSentInfo(parkName));
  const currentSentInfo = getSentInfo(recipientEmail) || getSentInfo(parkName);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ── Top Bar / Header ─────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#0c121e]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-white hover:text-indigo-300 transition group">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                🐾
              </span>
              <span className="text-base tracking-tight font-extrabold text-white">IndoorDogPark</span>
            </Link>
            <span className="text-slate-600 text-sm">/</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">Outreach Studio</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Resend Live
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="hidden lg:flex items-center gap-3 bg-[#111726] px-3 py-1.5 rounded-xl border border-white/[0.06] text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <i className="bi bi-database text-indigo-400"></i>
              <span>7,200+ Parks Database</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 font-medium text-emerald-400">
              <i className="bi bi-check2-all"></i>
              <span>Sent: {sentCount}</span>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowTestModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-xs font-bold text-slate-200 transition shadow-sm hover:border-slate-600"
            >
              <i className="bi bi-send-check text-indigo-400"></i>
              <span>Send Test</span>
            </button>

            <button
              onClick={() => handleSendEmail(false)}
              disabled={isSending || !recipientEmail}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-extrabold text-white transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isSending ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill"></i>
                  <span>Send Outreach</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Status Notification Toast ─────────────────────────────────────── */}
      {statusMessage && (
        <div
          className={`mx-auto max-w-[1600px] w-full px-6 pt-3 transition-all ${
            statusMessage.type === 'error'
              ? 'text-red-300'
              : statusMessage.type === 'success'
              ? 'text-emerald-300'
              : 'text-indigo-300'
          }`}
        >
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium backdrop-blur-md shadow-lg ${
              statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/30 shadow-red-950/40'
                : statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 shadow-emerald-950/40'
                : 'bg-indigo-950/80 border-indigo-500/30 shadow-indigo-950/40'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Main Studio Split Workspace ──────────────────────────────────── */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Configuration & Composer (7 cols) ──────────────── */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* STEP 1: Select Strategy */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-extrabold text-indigo-300">
                  01
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Select Campaign Strategy
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">5 Proven Link Templates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TEMPLATES.map((tpl) => {
                const isActive = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between gap-2.5 ${
                      isActive
                        ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/40'
                        : 'bg-[#141a2a] border-white/[0.06] text-slate-300 hover:bg-[#182136] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`bi ${tpl.icon} text-sm ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}></i>
                      <span className="font-bold truncate">{tpl.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border inline-block w-fit ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Target Recipient & Listing */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-extrabold text-indigo-300">
                  02
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Target Recipient &amp; Listing
                </span>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center rounded-xl bg-[#090d16] p-1 border border-white/[0.08]">
                <button
                  onClick={() => setContactSource('directory')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    contactSource === 'directory' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Park Directory (7,200)
                </button>
                <button
                  onClick={() => setContactSource('beehiiv')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    contactSource === 'beehiiv' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beehiiv Contacts
                </button>
                <button
                  onClick={() => setContactSource('manual')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    contactSource === 'manual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Custom Entry
                </button>
              </div>
            </div>

            {/* Command-Style Search Bar & Status Filter */}
            {contactSource === 'directory' && (
              <div className="relative space-y-2.5" ref={searchContainerRef}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <i className="bi bi-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                    <input
                      type="text"
                      placeholder="Search 7,200+ parks by name, city, state, or email..."
                      value={searchQuery}
                      onFocus={() => setIsSearchOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <select
                    value={stateFilter}
                    onChange={(e) => {
                      setStateFilter(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    className="bg-[#090d16] border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[160px] font-medium"
                  >
                    {US_STATES.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter Segmented Controls */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Status:</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      statusFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('unsent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      statusFilter === 'unsent'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Unsent Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('sent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      statusFilter === 'sent'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✓ Sent ({sentCount})
                  </button>
                </div>

                {/* Autocomplete Dropdown List */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto border border-white/[0.12] rounded-xl bg-[#0a0e1a] divide-y divide-white/[0.04] shadow-2xl z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <span className="h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Searching park directory...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults
                        .filter((park) => {
                          const sent = Boolean(getSentInfo(park.email) || getSentInfo(park.name));
                          if (statusFilter === 'unsent') return !sent;
                          if (statusFilter === 'sent') return sent;
                          return true;
                        })
                        .map((park, idx) => {
                          const sentInfo = getSentInfo(park.email) || getSentInfo(park.name);
                          const isSent = Boolean(sentInfo);

                          return (
                            <button
                              key={`${park.name}-${idx}`}
                              onClick={() => handleSelectPark(park)}
                              className={`w-full text-left p-3 text-xs hover:bg-[#141b2e] transition flex items-center justify-between gap-3 ${
                                selectedPark?.name === park.name ? 'bg-indigo-600/20 text-indigo-200' : 'text-slate-300'
                              }`}
                            >
                              <div className="truncate">
                                <span className="font-bold text-white text-xs">{park.name}</span>
                                <span className="text-slate-400 ml-2 text-[11px]">
                                  {park.city}, {park.state}
                                </span>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {isSent ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                    <i className="bi bi-check2-circle"></i>
                                    SENT
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-white/[0.06]">
                                    UNSENT
                                  </span>
                                )}

                                {park.hasEmail ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    {park.email}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">
                                    No email
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">No matching parks found.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recipient Details 2x2 Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-white/[0.06]">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="owner@dogpark.com"
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Park / Facility Name
                </label>
                <input
                  type="text"
                  value={parkName}
                  onChange={(e) => {
                    setParkName(e.target.value);
                    setRecipientName(e.target.value);
                  }}
                  placeholder="e.g. Dog Resort Glendale"
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  City &amp; State
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="flex-1 bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-20 bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Directory Listing URL
                </label>
                <input
                  type="text"
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  placeholder="https://www.indoordogpark.org/parks/..."
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Sender & Reply-To Settings Accordion */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowSenderDetails(!showSenderDetails)}
                className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 font-semibold"
              >
                <i className={`bi bi-chevron-${showSenderDetails ? 'up' : 'down'} text-[10px]`}></i>
                <span>{showSenderDetails ? 'Hide' : 'Configure'} Sender &amp; Reply-To Settings</span>
              </button>

              {showSenderDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3.5 rounded-xl bg-[#090d16] border border-white/[0.06]">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">From Email</label>
                    <input
                      type="text"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="outreach@indoordogpark.org"
                      className="w-full bg-[#111726] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">
                      Reply-To (Your Inbox)
                    </label>
                    <input
                      type="email"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      placeholder="media@indoordogpark.org"
                      className="w-full bg-[#111726] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Customize Email Message */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-extrabold text-indigo-300">
                  03
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Customize Email Message
                </span>
              </div>
            </div>

            {/* Already Sent Notice */}
            {isCurrentRecipientSent && currentSentInfo && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-200 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3">
                  <i className="bi bi-check-circle-fill text-emerald-400 text-lg shrink-0"></i>
                  <div>
                    <p className="font-bold text-white text-xs">Outreach Already Sent to This Facility</p>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      Dispatched on{' '}
                      {new Date(currentSentInfo.sentAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      . You can still send a follow-up or pick an unsent park.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 ml-2">
                  ✓ Sent
                </span>
              </div>
            )}

            {/* Variable Insertion Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px]">Subject Line</label>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-semibold mr-0.5">Insert:</span>
                  <button
                    onClick={() => setSubject((s) => s + ' {{park_name}}')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#182136] text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    + Park
                  </button>
                  <button
                    onClick={() => setSubject((s) => s + ' {{city}}')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#182136] text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    + City
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Email Body Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px]">Message Content (Markdown)</label>
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => insertSnippet('{{badge_snippet}}')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white transition"
                  >
                    + Badge Preview
                  </button>
                  <button
                    onClick={() => insertSnippet('{{listing_url}}')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#182136] text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    + Listing URL
                  </button>
                </div>
              </div>
              <textarea
                rows={9}
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            {/* Personal Note Callout */}
            <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1.5">
              <label className="block text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                <i className="bi bi-chat-quote-fill"></i>
                Personal Note Callout (Appears highlighted in email)
              </label>
              <input
                type="text"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="e.g. We loved your agility equipment and clean play floor!"
                className="w-full bg-[#090d16] border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-indigo-300/40"
              />
            </div>

            {/* Beehiiv Auto-Sync Switch */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncToBeehiiv}
                  onChange={(e) => setSyncToBeehiiv(e.target.checked)}
                  className="rounded bg-[#090d16] border-white/20 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">Auto-save contact into Beehiiv audience as partner</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Column: Live Email Preview Frame (5 cols) ─────────────── */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-[#0f1422] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Window Top Controls & Device Switcher */}
            <div className="bg-[#090d16] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 ml-2">Email Preview</span>
              </div>

              {/* Device Mode Toggle */}
              <div className="flex rounded-lg bg-[#141a2a] p-0.5 border border-white/[0.06]">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                    previewDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <i className="bi bi-display"></i>
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                    previewDevice === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <i className="bi bi-phone"></i>
                  <span>Mobile</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('code')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                    previewDevice === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <i className="bi bi-code-slash"></i>
                  <span>HTML</span>
                </button>
              </div>
            </div>

            {/* Email Client Header Metadata */}
            {previewDevice !== 'code' && (
              <div className="bg-[#111726] p-3.5 border-b border-white/[0.06] text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold w-14 shrink-0 text-[11px]">To:</span>
                  <span className="font-mono text-white truncate font-medium">{recipientEmail || 'owner@dogpark.com'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold w-14 shrink-0 text-[11px]">From:</span>
                  <span className="text-slate-200 truncate">{fromName} &lt;{fromEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold w-14 shrink-0 text-[11px]">Subject:</span>
                  <span className="font-bold text-white truncate">{compiledSubject}</span>
                </div>
              </div>
            )}

            {/* Preview Frame Body */}
            <div className="p-4 bg-[#0a0e1a] overflow-y-auto max-h-[calc(100vh-250px)] flex justify-center">
              {previewDevice === 'code' ? (
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-mono">Compiled HTML Output</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(compiledHtml);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5"
                    >
                      <i className={`bi bi-${copiedCode ? 'check-lg' : 'clipboard'}`}></i>
                      <span>{copiedCode ? 'Copied!' : 'Copy HTML'}</span>
                    </button>
                  </div>
                  <pre className="bg-[#070a12] p-3.5 rounded-xl border border-white/[0.08] text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-[500px]">
                    {compiledHtml}
                  </pre>
                </div>
              ) : (
                <div
                  className={`w-full transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'max-w-[375px] rounded-2xl shadow-2xl border-4 border-slate-700 overflow-hidden' : 'max-w-[560px]'
                  }`}
                >
                  <iframe
                    srcDoc={compiledHtml}
                    title="Email Live Preview"
                    className="w-full min-h-[640px] rounded-xl bg-white border-0"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* ── Test Email Modal ─────────────────────────────────────────────── */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <i className="bi bi-send-check text-indigo-400"></i>
                Send Test Preview Email
              </h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Verify how this email appears in your Gmail inbox before broadcasting to facility owners.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Send Test To:
              </label>
              <input
                type="email"
                value={testEmailAddress || 'mahenbalal@gmail.com'}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="your-email@gmail.com"
                className="w-full bg-[#090d16] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendEmail(true, testEmailAddress || 'mahenbalal@gmail.com')}
                disabled={isSending}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {isSending ? 'Sending...' : 'Send Test Now →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
