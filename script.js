const countEl = document.getElementById("memberCount");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");
const groupInput = document.getElementById("groupInput");
const checkBtn = document.getElementById("checkBtn");

let currentCount = 0;
let currentGroupId = null;
let refreshInterval = null;
let isFetching = false;

function animateNumber(start, end) {
  const duration = 1000;
  const startTime = performance.now();

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.floor(start + (end - start) * progress);
    countEl.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

async function fetchGroupData(groupId) {
  if (isFetching) return; // Prevent overlapping requests
  isFetching = true;
  loader.style.display = "block";
  statusEl.style.color = "#b0b0b0";
  statusEl.textContent = "🔄 Loading group data...";
  try {
    const response = await fetch(`https://corsproxy.io/?https://groups.roblox.com/v1/groups/${groupId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!data.memberCount || !data.name) {
      throw new Error("Incomplete data");
    }

    statusEl.style.color = "#2ecc71";
    statusEl.textContent = `✅ Group: ${data.name}`;

    animateNumber(currentCount, data.memberCount);
    currentCount = data.memberCount;
  } catch (err) {
    statusEl.style.color = "#e74c3c";
    statusEl.textContent = "❌ Group not found or error fetching.";
    countEl.textContent = "Error";
    console.error("Fetch error:", err);
  } finally {
    loader.style.display = "none";
    isFetching = false;
  }
}

function updateGroup() {
  const groupIdInput = groupInput.value.trim();
  const groupId = parseInt(groupIdInput, 10);

  if (isNaN(groupId) || groupId <= 0) {
    statusEl.style.color = "#e74c3c";
    statusEl.textContent = "❌ Invalid Group ID.";
    countEl.textContent = "0";
    clearInterval(refreshInterval);
    refreshInterval = null;
    currentGroupId = null;
    // Also clear the hash in URL
    history.replaceState(null, "", window.location.pathname);
    return;
  }

  if (groupId !== currentGroupId) {
    currentGroupId = groupId;
    currentCount = 0;
    countEl.textContent = "0";

    // Update the URL hash with the group ID
    history.replaceState(null, "", `#${groupId}`);
  }

  fetchGroupData(groupId);

  // Clear and restart refresh interval
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    fetchGroupData(groupId);
  }, 15000); // every 15 seconds
}

// On page load: read the group ID from URL hash and auto load
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const groupId = parseInt(hash, 10);
    if (!isNaN(groupId) && groupId > 0) {
      groupInput.value = groupId;
      updateGroup();
    }
  }
});

// Button click handler
checkBtn.addEventListener("click", () => {
  if (isFetching) return;
  updateGroup();
});

// Enter key triggers update
groupInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!isFetching) updateGroup();
  }
});
