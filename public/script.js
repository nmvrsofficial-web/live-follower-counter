// Global variables
let currentUser = null;
let isAdmin = false;
let currentSection = 'home';

const API_BASE = 'http://localhost:3000/api';

// Show section
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  currentSection = sectionId;
  
  if (sectionId === 'dashboard') loadDashboard();
  if (sectionId === 'plans') loadPlans();
  if (sectionId === 'chat') loadChatMessages();
  if (sectionId === 'admin') checkAdminStatus();
}

// Auth functions
async function register() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const username = email.split('@')[0];
  
  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.user;
      document.getElementById('authEmail').value = '';
      document.getElementById('authPassword').value = '';
      document.getElementById('logoutBtn').style.display = 'inline-block';
      alert('Registration successful! You are now logged in.');
      showSection('dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed');
  }
}

async function login() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  
  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.user;
      document.getElementById('authEmail').value = '';
      document.getElementById('authPassword').value = '';
      document.getElementById('logoutBtn').style.display = 'inline-block';
      alert('Login successful!');
      showSection('dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
}

async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    currentUser = null;
    isAdmin = false;
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    showSection('home');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Dashboard functions
async function loadDashboard() {
  if (!currentUser) {
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('notAuthMessage').style.display = 'block';
    return;
  }
  
  document.getElementById('dashboardContent').style.display = 'block';
  document.getElementById('notAuthMessage').style.display = 'none';
  
  try {
    const response = await fetch(`${API_BASE}/boosts`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      let active = 0, completed = 0, pending = 0;
      let tableHTML = '<table><tr><th>Service</th><th>Count</th><th>Status</th><th>Created</th></tr>';
      
      Object.entries(data.services).forEach(([service, boosts]) => {
        boosts.forEach(boost => {
          if (boost.status === 'processing') active++;
          if (boost.status === 'completed') completed++;
          if (boost.status === 'pending') pending++;
          
          const date = new Date(boost.createdAt).toLocaleDateString();
          tableHTML += `<tr>
            <td>${service}</td>
            <td>${boost.count}</td>
            <td><span class="status-badge ${boost.status}">${boost.status}</span></td>
            <td>${date}</td>
          </tr>`;
        });
      });
      
      tableHTML += '</table>';
      
      document.getElementById('activeBoosts').textContent = active;
      document.getElementById('completedBoosts').textContent = completed;
      document.getElementById('pendingBoosts').textContent = pending;
      document.getElementById('userPlan').textContent = 'Free';
      document.getElementById('boostsTable').innerHTML = tableHTML || '<p>No boosts yet</p>';
    }
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

async function initiateBoost() {
  if (!currentUser) {
    alert('Please login first');
    return;
  }
  
  const service = document.getElementById('boostService').value;
  const count = document.getElementById('boostCount').value;
  const link = document.getElementById('boostLink').value;
  
  if (!count || !link) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/boost/service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service,
        platform: service.split('-')[0],
        count: parseInt(count),
        accountLink: link
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(`✅ Boost started! ${data.message}\nEstimated time: ${data.estimatedTime}`);
      document.getElementById('boostService').value = 'instagram-followers';
      document.getElementById('boostCount').value = '';
      document.getElementById('boostLink').value = '';
      loadDashboard();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Boost error:', error);
    alert('Failed to initiate boost');
  }
}

// Plans functions
async function loadPlans() {
  try {
    const response = await fetch(`${API_BASE}/plans`);
    const data = await response.json();
    
    let plansHTML = '';
    data.plans.forEach((plan, index) => {
      const featured = index === 2 ? 'featured' : '';
      plansHTML += `
        <div class="plan-card ${featured}">
          <h3>${plan.name}</h3>
          <div class="price">$${plan.price}</div>
          <div class="duration">${plan.duration}</div>
          <ul>
            ${plan.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <button onclick="selectPlan('${plan.id}')">Choose Plan</button>
        </div>
      `;
    });
    
    document.getElementById('plansContainer').innerHTML = plansHTML;
  } catch (error) {
    console.error('Plans error:', error);
  }
}

function selectPlan(planId) {
  if (!currentUser) {
    alert('Please login first');
    return;
  }
  alert(`✅ Plan "${planId}" selected!\nThis will redirect to payment (demo mode)`);
}

// Chat functions
async function sendChat() {
  const message = document.getElementById('chatMessage').value;
  let userName = document.getElementById('userName').value;
  let userEmail = document.getElementById('userEmail').value;
  
  if (!message) {
    alert('Please type a message');
    return;
  }
  
  if (!userName) userName = currentUser?.username || 'Guest';
  if (!userEmail) userEmail = currentUser?.email || 'guest@example.com';
  
  try {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userName, userEmail })
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('chatMessage').value = '';
      loadChatMessages();
    }
  } catch (error) {
    console.error('Chat error:', error);
  }
}

async function loadChatMessages() {
  const email = currentUser?.email || document.getElementById('userEmail').value || 'guest@example.com';
  
  try {
    const response = await fetch(`${API_BASE}/chat/messages?email=${email}`);
    const data = await response.json();
    
    if (data.success) {
      let messagesHTML = '';
      data.messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        messagesHTML += `
          <div class="chat-message ${msg.type}">
            <div class="sender">${msg.sender}</div>
            <div>${msg.message}</div>
            <div class="timestamp">${time}</div>
          </div>
        `;
      });
      
      document.getElementById('chatMessages').innerHTML = messagesHTML || '<p style="text-align: center; color: #999;">No messages yet</p>';
      document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    }
  } catch (error) {
    console.error('Chat messages error:', error);
  }
}

// Admin functions
async function adminLogin() {
  const password = document.getElementById('adminPassword').value;
  
  if (!password) {
    alert('Please enter admin password');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      isAdmin = true;
      document.getElementById('adminLoginForm').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      document.getElementById('adminPassword').value = '';
      loadAdminDashboard();
    } else {
      alert('❌ Invalid admin password');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    alert('Admin login failed');
  }
}

function adminLogout() {
  isAdmin = false;
  document.getElementById('adminLoginForm').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminPassword').value = '';
}

async function loadAdminDashboard() {
  try {
    const response = await fetch(`${API_BASE}/admin/dashboard`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('adminTotalUsers').textContent = data.totalUsers;
      document.getElementById('adminTotalMessages').textContent = data.totalMessages;
      document.getElementById('adminEmail').textContent = data.adminEmail;
      
      // Instagram accounts
      let accountsHTML = '';
      data.adminAccounts.forEach(account => {
        accountsHTML += `
          <div class="account-link">
            <a href="${account}" target="_blank">🔗 ${account.substring(0, 50)}...</a>
          </div>
        `;
      });
      document.getElementById('adminInstagramAccounts').innerHTML = accountsHTML;
      
      // Load messages
      loadAdminMessages();
    }
  } catch (error) {
    console.error('Admin dashboard error:', error);
  }
}

async function loadAdminMessages() {
  try {
    const response = await fetch(`${API_BASE}/admin/messages`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      let messagesHTML = '<table><tr><th>From</th><th>Message</th><th>Type</th><th>Time</th></tr>';
      
      data.messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleString();
        messagesHTML += `<tr>
          <td>${msg.sender}</td>
          <td>${msg.message}</td>
          <td>${msg.type}</td>
          <td>${time}</td>
        </tr>`;
      });
      
      messagesHTML += '</table>';
      document.getElementById('adminMessages').innerHTML = messagesHTML || '<p>No messages</p>';
    }
  } catch (error) {
    console.error('Admin messages error:', error);
  }
}

async function checkAdminStatus() {
  try {
    const response = await fetch(`${API_BASE}/admin/status`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.isAdmin) {
      isAdmin = true;
      document.getElementById('adminLoginForm').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      loadAdminDashboard();
    }
  } catch (error) {
    console.error('Admin status error:', error);
  }
}

// Settings functions
function openSettingsTab(tabName) {
  document.querySelectorAll('.settings-content').forEach(tab => {
    tab.classList.remove('active');
    tab.style.display = 'none';
  });
  
  document.querySelectorAll('.settings-tabs button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const tab = document.getElementById(tabName);
  if (tab) {
    tab.classList.add('active');
    tab.style.display = 'block';
  }
  
  event.target.classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  showSection('home');
  loadPlans();
});
