const jobListings = document.getElementById("jobListings");
const searchInput = document.getElementById("searchInput");

const githubRepo = "LakshmidharKotipalli/Job_Scraper";
const githubDataPath = "data";

// Step 1: Get all JSON filenames from the GitHub repo using GitHub API
async function fetchJobFileList() {
  const apiURL = `https://api.github.com/repos/${githubRepo}/contents/${githubDataPath}`;
  try {
    const res = await fetch(apiURL);
    const files = await res.json();
    return files
      .filter(file => file.name.endsWith(".json"))
      .map(file => file.name);
  } catch (err) {
    console.error("❌ Failed to fetch file list:", err);
    return [];
  }
}

// Step 2: Load each job file from raw.githubusercontent.com
async function loadAllJobs(files) {
  let allJobs = [];

  for (const file of files) {
    const rawURL = `https://raw.githubusercontent.com/${githubRepo}/main/${githubDataPath}/${file}`;
    try {
      const res = await fetch(rawURL);
      const data = await res.json();
      if (Array.isArray(data)) {
        allJobs = allJobs.concat(data);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err);
    }
  }

  return allJobs;
}

// Step 3: Render job cards
function displayJobs(jobs) {
  jobListings.innerHTML = "";

  if (jobs.length === 0) {
    jobListings.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h2>${job.title || "Untitled Role"}</h2>
      <p><strong>Company:</strong> ${job.company || "N/A"}</p>
      <p><strong>Location:</strong> ${job.location || "Remote/Not Specified"}</p>
      <a href="${job.url}" target="_blank">Apply Now</a>
    `;
    jobListings.appendChild(card);
  });
}

// Step 4: Filter based on search
function filterJobs(jobs, query) {
  return jobs.filter(job =>
    (job.title && job.title.toLowerCase().includes(query)) ||
    (job.company && job.company.toLowerCase().includes(query)) ||
    (job.location && job.location.toLowerCase().includes(query))
  );
}

// Initialize everything on load
window.addEventListener("DOMContentLoaded", async () => {
  const fileList = await fetchJobFileList();
  const allJobs = await loadAllJobs(fileList);
  displayJobs(allJobs);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = filterJobs(allJobs, query);
    displayJobs(filtered);
  });
});
