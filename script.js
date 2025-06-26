const countEl = document.getElementById("memberCount");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");

let currentCount = 0;

function updateGroup() {
  const groupId = document.getElementById("groupInput").value.trim();
  if (!groupId || isNaN(groupId)) {
    statusEl.textContent = "❌ Invalid Group ID.";
    return;
  }

  statusEl.textContent = "Loading...";
  loader.style.display = "block";

  fetch(`https://groups.roblox.com/v1/groups/${groupId}`)
    .then(res => {
      if (!res.ok) throw new Error("Group not found");
      return res.json();
    })
    .then(data => {
      const newCount = data.memberCount;
      statusEl.textContent = `✅ Group: ${data.name}`;
      animateNumber(currentCount, newCount);
      currentCount = newCount;
    })
    .catch(err => {
      statusEl.textContent = "❌ Group not found or error fetching.";
      countEl.textContent = "0";
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

function animateNumber(start, end) {
  const duration = 1000;
  const startTime = performance.now();

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.floor(start + (end - start) * progress);
    countEl.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
