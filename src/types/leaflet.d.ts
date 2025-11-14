// Type declarations for leaflet
// This ensures TypeScript recognizes the leaflet module when dynamically imported
// This is a pragmatic solution - see DEPENDENCY_ANALYSIS.md for details

declare module 'leaflet' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L: any;
  export default L;
}

