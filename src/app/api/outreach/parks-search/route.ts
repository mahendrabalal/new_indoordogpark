import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface ParkRecord {
  name: string;
  email: string;
  listingUrl: string;
  website: string;
  phone: string;
  city: string;
  state: string;
  hasEmail: boolean;
}

let cachedParks: ParkRecord[] | null = null;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

function loadAllParks(): ParkRecord[] {
  if (cachedParks) return cachedParks;

  const parkMap = new Map<string, ParkRecord>();

  // 1. Load from State JSON files
  const dataDir = path.resolve(process.cwd(), 'public/data');
  try {
    if (fs.existsSync(dataDir)) {
      const files = fs
        .readdirSync(dataDir)
        .filter((f) => f.endsWith('.json') && f !== 'keyword_clusters.json');

      for (const file of files) {
        try {
          const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            for (const p of list) {
              if (p.name) {
                const slug =
                  p.slug ||
                  p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const key = `${p.name.toLowerCase().trim()}_${(p.city || '').toLowerCase().trim()}`;
                parkMap.set(key, {
                  name: p.name,
                  email: p.email || '',
                  listingUrl: `https://www.indoordogpark.org/parks/${slug}`,
                  website: p.website || '',
                  phone: p.phone || '',
                  city: p.city || '',
                  state: p.state || file.replace('.json', '').toUpperCase(),
                  hasEmail: Boolean(p.email),
                });
              }
            }
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Error reading state JSON directory:', err);
  }

  // 2. Load and overlay from CSV (outreach-db-all)
  const csvPath = path.resolve(
    process.cwd(),
    'data-backups/outreach-db-all-2026-06-19.csv'
  );
  try {
    if (fs.existsSync(csvPath)) {
      const fileContent = fs.readFileSync(csvPath, 'utf8');
      const lines = fileContent.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = parseCsvLine(line);
        if (cols.length >= 7) {
          const name = cols[0] || '';
          const email = cols[1] || '';
          const listingUrl = cols[2] || '';
          const website = cols[3] || '';
          const phone = cols[4] || '';
          const city = cols[5] || '';
          const state = cols[6] || '';
          const hasEmail = (cols[7] || '').toLowerCase() === 'true' || Boolean(email);

          if (name) {
            const key = `${name.toLowerCase().trim()}_${city.toLowerCase().trim()}`;
            const existing = parkMap.get(key);
            parkMap.set(key, {
              name,
              email: email || existing?.email || '',
              listingUrl: listingUrl || existing?.listingUrl || `https://www.indoordogpark.org/parks/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              website: website || existing?.website || '',
              phone: phone || existing?.phone || '',
              city: city || existing?.city || '',
              state: state || existing?.state || '',
              hasEmail: hasEmail || Boolean(existing?.email),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error loading parks CSV:', err);
  }

  cachedParks = Array.from(parkMap.values());
  return cachedParks;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const stateFilter = (searchParams.get('state') || '').trim().toLowerCase();
    const onlyWithEmail = searchParams.get('withEmail') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);

    const allParks = loadAllParks();

    let filtered = allParks;

    if (onlyWithEmail) {
      filtered = filtered.filter((p) => p.hasEmail && p.email);
    }

    if (stateFilter) {
      filtered = filtered.filter((p) => p.state.toLowerCase() === stateFilter);
    }

    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.website.toLowerCase().includes(q)
      );
    }

    // Sort parks with email to the top if no query
    if (!q) {
      filtered.sort((a, b) => (b.hasEmail ? 1 : 0) - (a.hasEmail ? 1 : 0));
    }

    const results = filtered.slice(0, limit);

    return NextResponse.json({
      success: true,
      totalDatabaseCount: allParks.length,
      matchedCount: filtered.length,
      count: results.length,
      parks: results,
    });
  } catch (error) {
    console.error('[api/outreach/parks-search] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search parks' },
      { status: 500 }
    );
  }
}
