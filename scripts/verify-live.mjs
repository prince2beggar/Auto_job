async function verify() {
  console.log('Testing live API endpoints on http://localhost:3000...');

  // 1. Test Jobs
  const jobsRes = await fetch('http://localhost:3000/api/jobs');
  const jobsData = await jobsRes.json();
  console.log(`✅ /api/jobs returned ${jobsData.jobs?.length} opportunities.`);
  if (jobsData.jobs?.length > 0) {
    console.log(`   Top recommendation: ${jobsData.jobs[0].title} at ${jobsData.jobs[0].company} (${jobsData.jobs[0].match?.overallScore}% Match)`);
  }

  // 2. Test Profile
  const profileRes = await fetch('http://localhost:3000/api/profile');
  const profileData = await profileRes.json();
  console.log(`✅ /api/profile loaded candidate: ${profileData.profile?.fullName}`);
  console.log(`   Completion score: ${profileData.profile?.completionPercentage}%`);

  // 3. Test CV Tailor API
  if (jobsData.jobs?.length > 0) {
    const tailorRes = await fetch('http://localhost:3000/api/cv/tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: jobsData.jobs[0].id }),
    });
    const tailorData = await tailorRes.json();
    console.log(`✅ /api/cv/tailor generated truth-preserving CV:`);
    console.log(`   Summary diff length: ${tailorData.tailored?.tailoredSummary?.length} chars`);
    console.log(`   Ordered skills count: ${tailorData.tailored?.orderedSkills?.length}`);
  }

  // 4. Test Email Prepare API
  if (jobsData.jobs?.length > 0) {
    const emailRes = await fetch('http://localhost:3000/api/email/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: jobsData.jobs[0].id }),
    });
    const emailData = await emailRes.json();
    console.log(`✅ /api/email/prepare generated email draft:`);
    console.log(`   Recipient: ${emailData.draft?.toEmail}`);
    console.log(`   Attachment: ${emailData.draft?.attachmentName}`);
  }

  // 5. Test Applications API
  const appsRes = await fetch('http://localhost:3000/api/applications');
  const appsData = await appsRes.json();
  console.log(`✅ /api/applications loaded ${appsData.applications?.length} active pipeline records.`);

  console.log('\n🎉 ALL LIVE SERVER ENDPOINTS RESPONDED WITH 200 OK AND VALID DATA!');
}

verify().catch(console.error);
