const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'notlostplayz-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Admin credentials
const ADMIN_PASSWORD = 'notlostplayz335';
const ADMIN_EMAILS = ['ittzrudra@gmail.com'];
const ADMIN_INSTAGRAM_ACCOUNTS = [
  'https://www.instagram.com/itzzz_ur_rudra?igsh=MWozZzM5NXh2MWJncA==',
  'https://www.instagram.com/itzz_urrudra?igsh=ZXo4YjV6Mm1ybjFt'
];

// In-memory data storage (use database in production)
let users = {};
let adminSessions = {};
let chatMessages = [];

// Routes

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const adminToken = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    adminSessions[adminToken] = { createdAt: new Date(), email: ADMIN_EMAILS[0] };
    req.session.adminToken = adminToken;
    
    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token: adminToken,
      adminEmail: ADMIN_EMAILS[0]
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin password' });
  }
});

// Check Admin Status
app.get('/api/admin/status', (req, res) => {
  const token = req.session.adminToken || req.headers.authorization?.split(' ')[1];
  
  if (token && adminSessions[token]) {
    res.json({ isAdmin: true, email: adminSessions[token].email });
  } else {
    res.json({ isAdmin: false });
  }
});

// Get Admin Dashboard Data
app.get('/api/admin/dashboard', (req, res) => {
  const token = req.session.adminToken || req.headers.authorization?.split(' ')[1];
  
  if (!token || !adminSessions[token]) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  res.json({
    totalUsers: Object.keys(users).length,
    totalMessages: chatMessages.length,
    adminAccounts: ADMIN_INSTAGRAM_ACCOUNTS,
    adminEmail: ADMIN_EMAILS[0],
    features: {
      instagramFollowers: true,
      instagramViews: true,
      instagramLikes: true,
      tiktokFollowers: true,
      tiktokViews: true,
      youtubeSubscribers: true,
      twitterFollowers: true,
      facebookFollowers: true
    }
  });
});

// User Registration/Login
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  if (users[email]) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  users[email] = {
    username,
    email,
    password, // In production, hash this!
    createdAt: new Date(),
    plan: 'free',
    services: {}
  };
  
  req.session.userEmail = email;
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: { username, email }
  });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  req.session.userEmail = email;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: { username: users[email].username, email }
  });
});

// Get User Profile
app.get('/api/user/profile', (req, res) => {
  const email = req.session.userEmail;
  
  if (!email || !users[email]) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  res.json({ success: true, user: users[email] });
});

// Get Plans
app.get('/api/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        duration: 'Lifetime',
        features: [
          '100 Instagram Followers',
          '50 Instagram Views',
          '20 Instagram Likes',
          'Basic Dashboard',
          'Email Support'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        price: 4.99,
        duration: 'Month',
        features: [
          '1000 Instagram Followers',
          '500 Instagram Views',
          '200 Instagram Likes',
          'TikTok Support',
          'Twitter Support',
          'Priority Support'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        duration: 'Month',
        features: [
          '5000 Instagram Followers',
          '2500 Instagram Views',
          '1000 Instagram Likes',
          'All Platforms Supported',
          'YouTube & Facebook',
          'Priority Support',
          'Custom Packages'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 29.99,
        duration: 'Month',
        features: [
          'Unlimited Followers',
          'Unlimited Views',
          'Unlimited Likes',
          'All Platforms',
          'Dedicated Account Manager',
          '24/7 Support',
          'Custom Solutions'
        ]
      }
    ]
  });
});

// Chat with Admin
app.post('/api/chat/send', (req, res) => {
  const { message, userName, userEmail } = req.body;
  
  if (!message || !userName || !userEmail) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  const chatMessage = {
    id: Date.now(),
    type: 'user',
    sender: userName,
    email: userEmail,
    message,
    timestamp: new Date(),
    read: false
  };
  
  chatMessages.push(chatMessage);
  
  // Simulate admin response
  setTimeout(() => {
    chatMessages.push({
      id: Date.now() + 1,
      type: 'admin',
      sender: 'Admin (notlostplayz)',
      email: ADMIN_EMAILS[0],
      message: `Thanks for reaching out! We received your message: "${message}". Our team will respond shortly. - Admin Team`,
      timestamp: new Date(),
      read: false
    });
  }, 2000);
  
  res.json({ success: true, chatMessage });
});

// Get Chat Messages
app.get('/api/chat/messages', (req, res) => {
  const userEmail = req.query.email;
  
  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }
  
  const userMessages = chatMessages.filter(msg => msg.email === userEmail || msg.email === ADMIN_EMAILS[0]);
  
  res.json({ success: true, messages: userMessages });
});

// Admin Get All Messages
app.get('/api/admin/messages', (req, res) => {
  const token = req.session.adminToken || req.headers.authorization?.split(' ')[1];
  
  if (!token || !adminSessions[token]) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  res.json({ success: true, messages: chatMessages });
});

// Boost Service
app.post('/api/boost/service', (req, res) => {
  const { service, platform, count, accountLink } = req.body;
  const email = req.session.userEmail;
  
  if (!email || !users[email]) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const user = users[email];
  
  // Simulate boost processing
  const boostId = 'boost_' + Date.now();
  
  if (!user.services[service]) {
    user.services[service] = [];
  }
  
  user.services[service].push({
    id: boostId,
    platform,
    count,
    accountLink,
    status: 'processing',
    createdAt: new Date(),
    completedAt: null
  });
  
  // Simulate completion
  setTimeout(() => {
    const service_obj = user.services[service].find(s => s.id === boostId);
    if (service_obj) {
      service_obj.status = 'completed';
      service_obj.completedAt = new Date();
    }
  }, 5000);
  
  res.json({
    success: true,
    message: `Boost initiated for ${count} ${service}`,
    boostId,
    estimatedTime: '5-30 minutes'
  });
});

// Get Boosts
app.get('/api/boosts', (req, res) => {
  const email = req.session.userEmail;
  
  if (!email || !users[email]) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  res.json({ success: true, services: users[email].services });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Live Follower Counter Server running on http://localhost:${PORT}`);
  console.log(`📱 Made by notlostplayz`);
  console.log(`🔑 Admin Portal: http://localhost:${PORT}/admin`);
});
