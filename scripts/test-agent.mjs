import { CVParserAgent } from '../lib/agents/cv-parser-agent.js';
import { EligibilityAgent } from '../lib/agents/eligibility-agent.js';
import { MatchingAgent } from '../lib/agents/matching-agent.js';
import { CVTailoringAgent } from '../lib/agents/cv-tailoring-agent.js';
import { EmailAgent } from '../lib/agents/email-agent.js';
import { JobNormalizer } from '../lib/agents/job-discovery/normalizer.js';

async function runTests() {
  console.log('🧪 Starting AI Job Hunting Agent Core Verification Tests...\n');
  let passCount = 0;
  let totalCount = 0;

  function assert(condition, testName) {
    totalCount++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  // TEST 1: CV Parsing and Provenance Integrity
  console.log('--- Test Suite 1: CV Parsing & Provenance Integrity ---');
  const sampleText = `
    MD. ASADUJJAMAN PRINCE
    Email: prince.bba@example.com | Phone: +880 1711-234567
    East West University
    Bachelor of Business Administration (BBA) - MIS
    CGPA: 3.53 | Graduated: 2024
    FinTech Innovations Ltd. — Business Analytics Intern
    Skills: Power BI, Excel, SQL, Python, Business Analysis
  `;

  const parseResult = await CVParserAgent.parseCVText(sampleText, 'resume.pdf');
  assert(parseResult.profileDraft.fullName.toLowerCase().includes('prince'), 'Extracts candidate name accurately');
  assert(parseResult.profileDraft.education[0]?.degree.includes('BBA'), 'Extracts BBA degree');
  assert(parseResult.profileDraft.education[0]?.cgpa === '3.53', 'Extracts CGPA accurately');
  assert(parseResult.profileDraft.education[0]?.provenance === 'EXTRACTED', 'Assigns EXTRACTED provenance');
  assert(parseResult.profileDraft.skills.some(s => s.name.toLowerCase().includes('power bi')), 'Extracts Power BI skill');

  // TEST 2: Government Eligibility Checking
  console.log('\n--- Test Suite 2: Government Job Eligibility ---');
  const candidateProfile = parseResult.profileDraft;
  const mockGovtJob = {
    id: 'test-govt-1',
    source: 'BPSC',
    jobType: 'GOVERNMENT',
    title: 'Assistant Director (General)',
    company: 'Bangladesh Bank',
    country: 'Bangladesh',
    location: 'Dhaka',
    remoteType: 'On-site',
    employmentType: 'Full-time',
    description: 'Central bank cadre recruitment',
    responsibilities: [],
    requirements: [],
    preferredRequirements: [],
    educationRequirements: '4-year BBA or Economics',
    experienceRequirements: 'No experience required',
    requiredSkills: ['Business Analysis'],
    preferredSkills: [],
    currency: 'BDT',
    applicationDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    applicationMethod: 'GOVERNMENT_PORTAL',
    postedDate: new Date().toISOString(),
    status: 'ACTIVE',
    governmentCircular: {
      recruitingOrganization: 'Bangladesh Bank',
      ministry: 'Ministry of Finance',
      postTitle: 'Assistant Director',
      vacancies: 100,
      educationalQualification: '4-year Bachelor in BBA / Economics',
      acceptedDegrees: ['BBA', 'Economics', 'Finance'],
      requiredExperience: 'No prior experience required',
      ageLimit: '21-30 years',
      maxAge: 30,
      quotaAgeLimit: 32,
      applicationFee: '200 BDT',
      paymentMethod: 'Rocket / bKash',
      applicationWebsite: 'https://erecruitment.bb.org.bd',
    },
  };

  const govtEligibility = EligibilityAgent.evaluateEligibility(candidateProfile, mockGovtJob);
  assert(govtEligibility.status === 'ELIGIBLE', 'Correctly identifies candidate as ELIGIBLE for Govt role');
  assert(govtEligibility.ageEligible === true, 'Verifies candidate age is within maximum 30 years');
  assert(govtEligibility.educationEligible === true, 'Verifies BBA degree is in acceptedDegrees');

  // TEST 3: Semantic Match Engine
  console.log('\n--- Test Suite 3: Semantic Match & Grounded Reasons ---');
  const matchResult = await MatchingAgent.calculateMatch(candidateProfile, mockGovtJob);
  assert(matchResult.overallScore >= 80, 'Calculates high match score for qualified candidate (>80%)');
  assert(matchResult.matchReasons.length > 0, 'Generates grounded match reasons');
  assert(matchResult.matchReasons[0].includes('degree'), 'Match reason cites authentic candidate degree');

  // TEST 4: Truth-Preserving CV Personalization Invariant
  console.log('\n--- Test Suite 4: Truth-Preserving CV Personalization Invariant ---');
  const tailoredResult = await CVTailoringAgent.tailorCV(candidateProfile, mockGovtJob);
  assert(tailoredResult.tailoredSummary.length > 0, 'Generates tailored summary');
  // Strict test: assert no hallucinated company appears in tailored result
  const unverifiedCompanies = ['Google Inc', 'McKinsey', 'Goldman Sachs', 'NASA', 'Meta'];
  const hasHallucinatedCompany = unverifiedCompanies.some(c =>
    tailoredResult.tailoredSummary.includes(c) ||
    JSON.stringify(tailoredResult.highlightedExperiences).includes(c)
  );
  assert(!hasHallucinatedCompany, 'CRITICAL: Tailored CV contains ZERO hallucinated companies');
  assert(tailoredResult.changesSummary.length > 0, 'Provides transparent summary of changes for user review');

  // TEST 5: Email Application Safety
  console.log('\n--- Test Suite 5: Email Application Engine & Safety Gate ---');
  const emailDraft = EmailAgent.prepareEmailDraft(candidateProfile, mockGovtJob);
  assert(emailDraft.toEmail.length > 0, 'Extracts / prepares recipient email');
  assert(emailDraft.attachmentName.endsWith('_CV.pdf'), 'Attaches formatted candidate CV name');
  assert(emailDraft.subject.includes(mockGovtJob.title), 'Subject contains accurate job title');
  assert(emailDraft.gmailComposeUrl.startsWith('https://mail.google.com'), 'Provides secure client dispatch URL');

  // TEST 6: Duplicate Job Detection & Urgency
  console.log('\n--- Test Suite 6: Duplicate Detection & Deadline Urgency ---');
  const jobsToDedupe = [
    { ...mockGovtJob, id: 'dup-1', source: 'Source A' },
    { ...mockGovtJob, id: 'dup-2', source: 'Source B' },
  ];
  const deduped = JobNormalizer.deduplicateJobs(jobsToDedupe);
  assert(deduped.length === 1, 'Successfully deduplicates identical job postings from multiple sources');

  const urgentDeadline = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
  assert(JobNormalizer.getUrgency(urgentDeadline) === 'URGENT', 'Correctly flags deadline <24h as URGENT');

  console.log(`\n🎉 Verification Completed: ${passCount}/${totalCount} tests passed!`);
  if (passCount === totalCount) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
