const groupId = 4413376; // Replace with your group's ID

async function fetchMemberCount() {
  const url = `https://groups.roblox.com/v1/groups/${groupId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('memberCount').textContent = data.memberCount;
    document.getElementById('groupId').textContent = groupId;
  } catch (err) {
    document.getElementById('memberCount').textContent = 'Error';
    console.error("Failed to fetch member count:", err);
  }
}

fetchMemberCount();
setInterval(fetchMemberCount, 60000); // Refresh every 60 seconds
