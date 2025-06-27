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
  if (isFetching) return;
  isFetching = true;

  if (!refreshInterval) loader.style.display = "block";

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

function updateGroup(groupId) {
  if (isNaN(groupId) || groupId <= 0) {
    statusEl.style.color = "#e74c3c";
    statusEl.textContent = "❌ Invalid Group ID.";
    countEl.textContent = "0";
    clearInterval(refreshInterval);
    refreshInterval = null;
    currentGroupId = null;
    return;
  }

  if (groupId !== currentGroupId) {
    currentGroupId = groupId;
    currentCount = 0;
    countEl.textContent = "0";
    location.hash = `#${groupId}`;
    groupInput.value = groupId;
  }

  fetchGroupData(groupId);

  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    fetchGroupData(groupId);
  }, 15000);
}

function getGroupIdFromHash() {
  const hash = window.location.hash.replace("#", "").trim();
  const id = parseInt(hash, 10);
  return isNaN(id) || id <= 0 ? null : id;
}

window.addEventListener("DOMContentLoaded", () => {
  const groupIdFromHash = getGroupIdFromHash();
  if (groupIdFromHash) {
    updateGroup(groupIdFromHash);
  }
});

checkBtn.addEventListener("click", () => {
  if (isFetching) return;
  const groupIdInput = parseInt(groupInput.value.trim(), 10);
  updateGroup(groupIdInput);
});

groupInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!isFetching) {
      const groupIdInput = parseInt(groupInput.value.trim(), 10);
      updateGroup(groupIdInput);
    }
  }
});
