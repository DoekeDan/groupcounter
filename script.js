const countEl = document.getElementById("memberCount");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");
let currentCount = 0;

function updateGroup() {
  const groupIdInput = document.getElementById("groupInput").value.trim();
  const groupId = parseInt(groupIdInput, 10);

  if (isNaN(groupId) || groupId <= 0) {
    statusEl.textContent = "❌ Invalid Group ID.";
    countEl.textContent = "0";
    return;
  }

  statusEl.textContent = "🔄 Loading group data...";
  loader.style.display = "block";

  fetch(`https://groups.roblox.com/v1/groups/${groupId}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const newCount = data.memberCount;
      const groupName = data.name || "Unknown";

      statusEl.textContent = `✅ Group: ${groupName}`;
      animateNumber(currentCount, newCount);
      currentCount = newCount;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      statusEl.textContent = "❌ Group not found or error fetching.";
      countEl.textContent = "Error";
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

function animateNumber(start, end) {
  const duration = 800;
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
