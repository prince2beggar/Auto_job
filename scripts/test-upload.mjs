async function testUpload() {
  console.log('Testing CV File Upload API endpoint...');

  // Test 1: Upload a sample custom candidate resume as plain text / blob
  const sampleCV = `
RAHIM AHMED
Chittagong, Bangladesh | +880 1812-998877 | rahim.ahmed@example.com
LinkedIn: linkedin.com/in/rahim-ahmed

CAREER SUMMARY
Enthusiastic Bachelor of Business Administration graduate from University of Chittagong with practical project experience in SQL querying, Excel dashboarding, and market research.

EDUCATION
University of Chittagong
Bachelor of Business Administration (BBA) - Finance & MIS
Graduation: 2024 | CGPA: 3.75

WORK EXPERIENCE
Apex Footwear Ltd. — Commercial Analytics Intern (Feb 2024 - Aug 2024)
• Conducted retail sales performance analysis across 40 outlets in Chittagong
• Automated weekly revenue reporting using advanced Excel macros and Pivot tables
• Designed interactive Power BI dashboards for category sales heads

SKILLS
• Software: Power BI, Microsoft Excel (Advanced), Tableau, Metabase
• Technical: SQL, Python, Data Visualization
• Business: Financial Modeling, Market Research, Business Analysis
`;

  const blob = new Blob([sampleCV], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'Rahim_Ahmed_Resume.txt');

  const res = await fetch('http://localhost:3000/api/cv/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  console.log('Upload response status:', res.status);
  console.log('Extracted Full Name:', data.result?.profileDraft?.fullName);
  console.log('Extracted Email:', data.result?.profileDraft?.email);
  console.log('Extracted Phone:', data.result?.profileDraft?.phone);
  console.log('Extracted City:', data.result?.profileDraft?.city);
  console.log('Extracted Degree:', data.result?.profileDraft?.education?.[0]?.degree);
  console.log('Extracted Institution:', data.result?.profileDraft?.education?.[0]?.institution);
  console.log('Extracted CGPA:', data.result?.profileDraft?.education?.[0]?.cgpa);
  console.log('Extracted Skills Count:', data.result?.profileDraft?.skills?.length);

  if (
    data.result?.profileDraft?.fullName?.toLowerCase().includes('rahim') &&
    data.result?.profileDraft?.education?.[0]?.cgpa === '3.75'
  ) {
    console.log('\n🎉 SUCCESS: Real CV Upload & Dynamic Parsing is fully working!');
  } else {
    console.error('\n❌ FAILED: Unexpected extracted data');
    process.exit(1);
  }
}

testUpload().catch(console.error);
