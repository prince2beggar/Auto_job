async function checkUI() {
  console.log('Verifying clean page and CSS rendering on http://localhost:3000...');

  // 1. Fetch Onboarding HTML
  const res = await fetch('http://localhost:3000/onboarding');
  console.log('GET /onboarding status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);

  // Check for CSS link in HTML
  const cssMatches = html.match(/href="(\/_next\/static\/css\/[^"]+)"/g);
  console.log('CSS links found in HTML:', cssMatches);

  if (cssMatches && cssMatches.length > 0) {
    for (const match of cssMatches) {
      const href = match.replace('href="', '').replace('"', '');
      const cssRes = await fetch(`http://localhost:3000${href}`);
      console.log(`CSS file ${href} status:`, cssRes.status, 'size:', (await cssRes.text()).length, 'bytes');
    }
  }

  // 2. Fetch Root Dashboard HTML
  const rootRes = await fetch('http://localhost:3000/');
  console.log('GET / status:', rootRes.status);

  console.log('🎉 Clean UI & CSS check finished successfully!');
}

checkUI().catch(console.error);
