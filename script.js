const dataFolder = 'data';
const jobListings = document.getElementById('jobListings');
const searchInput = document.getElementById('searchInput');

async function loadJobsFromFolder() {
  const files = [
    'jobs_batch_1.json',
    'jobs_batch_2.json',
    'jobs_batch_3.json',
    // Add all your JSON filenames here
  ];

  let allJobs = [];

  for (const file of files) {
    try {
      const res = await fetch(`${dataFolder}/${file}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        allJobs = allJobs.concat(data);
      }
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }

  return allJobs;
}

function displayJobs(jobs) {
  jobListings.innerHTML = '';
  if (jobs.length === 0) {
    jobListings.innerHTML = '<p>No jobs found.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <h2>${job.title || 'Untitled Role'}</h2>
      <p><strong>Company:</strong> ${job.company || 'N/A'}</p>
      <p><strong>Location:</strong> ${job.location || 'Remote/Not Specified'}</p>
      <a href="${job.url}" target="_blank">Apply Now</a>
    `;
    jobListings.appendChild(card);
  });
}

function filterJobs(jobs, query) {
  return jobs.filter(job =>
    (job.title && job.title.toLowerCase().includes(query)) ||
    (job.company && job.company.toLowerCase().includes(query)) ||
    (job.location && job.location.toLowerCase().includes(query))
  );
}

window.addEventListener('DOMContentLoaded', async () => {
  const allJobs = await loadJobsFromFolder();
  displayJobs(allJobs);

  searchInput.addEventListener('input', () => {
    const filtered = filterJobs(allJobs, searchInput.value.toLowerCase());
    displayJobs(filtered);
  });
});
