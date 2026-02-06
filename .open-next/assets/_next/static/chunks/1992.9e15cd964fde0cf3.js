"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1992],{1992:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});var i=r(5155),a=r(2115);function n({parks:e,onParkClick:t}){let n=(0,a.useRef)(null),s=(0,a.useRef)(null),l=(0,a.useRef)([]);return(0,a.useEffect)(()=>{if(n.current)return(async()=>{let{loadLeafletStyles:t}=await r.e(9794).then(r.bind(r,9794));t();let i=(await r.e(1761).then(r.t.bind(r,9722,23))).default;delete i.Icon.Default.prototype._getIconUrl,i.Icon.Default.mergeOptions({iconRetinaUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"});let a=i.TileLayer.extend({createTile:function(e,t){let r=i.TileLayer.prototype.createTile.call(this,e,t);return r.alt="Map tile",r}});if(!s.current&&n.current&&(s.current=i.map(n.current).setView([36.7783,-119.4179],6),new a("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"\xa9 OpenStreetMap contributors"}).addTo(s.current)),l.current.forEach(e=>s.current?.removeLayer(e)),l.current=[],e.forEach(e=>{if(e.latitude&&e.longitude&&s.current){let t="\uD83D\uDC15",r="Dog Park",a="#00bfff";"Indoor Dog Park"===e.businessType?(t="\uD83C\uDFE0",r="Indoor",a="#8b5cf6"):"Dog-Friendly Establishment"===e.businessType?(t="\uD83C\uDFEA",r="Business",a="#f59e0b"):(t="\uD83D\uDC15",r="Park",a="#10b981");let n=i.divIcon({className:"custom-park-marker",html:`
              <div class="park-marker" data-type="${e.businessType}">
                <div class="park-marker-icon" style="background: ${a};">
                  <span class="park-icon-symbol">${t}</span>
                </div>
                <div class="park-marker-label">${r}</div>
              </div>
            `,iconSize:[48,60],iconAnchor:[24,60]}),o=i.marker([e.latitude,e.longitude],{icon:n}).addTo(s.current).bindPopup(`
              <div style="min-width: 260px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                  <span style="font-size: 1.5rem;">${t}</span>
                  <h5 style="margin: 0; font-size: 1.1rem; font-weight: 600; color: #1f2937; flex: 1;">${e.name}</h5>
                </div>
                
                <div style="background: #f3f4f6; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                  <p style="margin: 0; font-size: 0.85rem; color: #374151; line-height: 1.5;">
                    <i class="bi bi-geo-alt-fill" style="color: #ef4444;"></i> <strong>${e.address||e.full_address}</strong>
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #6b7280;">
                    ${e.city}, ${e.state} ${e.zipCode||""}
                  </p>
                </div>

                <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="bi bi-star-fill" style="color: #fbbf24; font-size: 0.9rem;"></i>
                    <span style="font-size: 0.9rem; font-weight: 600; color: #1f2937;">${e.rating}</span>
                    <span style="font-size: 0.85rem; color: #9ca3af;">(${e.reviewCount})</span>
                  </div>
                  <div style="padding: 3px 10px; background: ${a}; color: white; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                    ${r}
                  </div>
                </div>
                
                <a 
                  href="/parks/${e.slug||e.id}" 
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 12px;
                    padding: 10px 18px;
                    background: ${a};
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    width: 100%;
                    justify-content: center;
                  "
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                  <i class="bi bi-arrow-right-circle"></i> View Details
                </a>
              </div>
            `);l.current.push(o)}}),l.current.length>0&&s.current){let e=i.featureGroup(l.current);s.current.fitBounds(e.getBounds().pad(.1))}})(),window.handleParkClick=r=>{let i=e.find(e=>e.id===r);i&&t&&t(i)},()=>{delete window.handleParkClick}},[e,t]),(0,i.jsx)("div",{id:"map",ref:n})}}}]);