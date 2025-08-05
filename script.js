const jobListings = document.getElementById("jobListings");
const searchInput = document.getElementById("searchInput");

const githubRepo = "LakshmidharKotipalli/Job_Scraper";
const githubDataPath = "data";

// Step 1: Fetch JSON file names from GitHub
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

// Step 2: Load all JSON files
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

// Step 3: Render jobs
function displayJobs(jobs) {
  jobListings.innerHTML = "";

  if (jobs.length === 0) {
    jobListings.innerHTML = "<p>No matching jobs found.</p>";
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

// Step 4: Match any search word with any field
function filterJobs(jobs, query) {
  if (!query.trim()) return jobs;

  const words = query.toLowerCase().split(/\s+/);
  return jobs.filter(job => {
    const combined = `${job.title || ""} ${job.company || ""} ${job.location || ""} ${job.description || ""}`.toLowerCase();
    return words.some(word => combined.includes(word));
  });
}

// Step 5: Initialize app
window.addEventListener("DOMContentLoaded", async () => {
  const fileList = await fetchJobFileList();
  const allJobs = await loadAllJobs(fileList);
  displayJobs(allJobs);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    const filtered = filterJobs(allJobs, query);
    displayJobs(filtered);
  });
});
