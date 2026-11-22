import type { Submission } from '../types';

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    title: 'The Ultimate Global Variable Nightmare',
    description: 'A JavaScript application that uses global variables for everything, including user authentication state, API responses, and UI state management.',
    codeSnippet: `# The Problem

This code demonstrates the worst possible way to manage application state using global variables.

## Why It's Terrible

1. **Global pollution** - Everything is in the global scope
2. **No encapsulation** - Any code can modify any state
3. **Race conditions** - Multiple functions modifying the same globals
4. **Impossible to test** - Global state makes unit testing a nightmare
5. **Memory leaks** - Globals never get garbage collected

\`\`\`javascript
// Global variables everywhere!
var currentUser = null;
var isLoggedIn = false;
var apiData = {};
var errorMessages = [];
var loadingStates = {};

function login(username, password) {
  // No validation, no error handling
  currentUser = { name: username, pass: password };
  isLoggedIn = true;
  
  // Directly modifying global state
  loadingStates.login = false;
  errorMessages = [];
}

function fetchUserData() {
  loadingStates.userData = true;
  
  // Assuming fetch always succeeds
  fetch('/api/user').then(response => {
    apiData.user = response.data;
    loadingStates.userData = false;
  });
}

function updateUI() {
  // Reading from globals everywhere
  if (isLoggedIn) {
    document.getElementById('user-name').innerHTML = currentUser.name;
    document.getElementById('user-data').innerHTML = JSON.stringify(apiData.user);
  }
  
  // More global state manipulation
  if (errorMessages.length > 0) {
    document.getElementById('errors').innerHTML = errorMessages.join('<br>');
  }
}
\`\`\`

## The Right Way

\`\`\`typescript
class UserManager {
  private currentUser: User | null = null;
  private isLoggedIn = false;
  private apiCache = new Map<string, any>();
  
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const user = await this.authService.authenticate(credentials);
      this.currentUser = user;
      this.isLoggedIn = true;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async fetchUserData(): Promise<UserData> {
    if (!this.isLoggedIn) {
      throw new Error('User not authenticated');
    }
    
    const cached = this.apiCache.get('userData');
    if (cached) return cached;
    
    const userData = await this.apiService.getUserData(this.currentUser.id);
    this.apiCache.set('userData', userData);
    return userData;
  }
}
\`\`\``,
    category: 'frontend',
    tags: ['javascript', 'global-variables', 'state-management', 'anti-pattern'],
    author: 'GlobalHater',
    votes: 156,
    comments: 23,
    createdAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    demoUrl: 'https://codepen.io/example/global-nightmare'
  },
  {
    id: '2',
    title: 'SQL Injection Paradise',
    description: 'A PHP application that concatenates user input directly into SQL queries without any sanitization or prepared statements.',
    codeSnippet: `# The Security Nightmare

This code is a hacker's dream - direct SQL injection vulnerabilities everywhere.

## What Makes This Dangerous

1. **No input sanitization** - User input goes directly into queries
2. **String concatenation** - The classic SQL injection vector
3. **No prepared statements** - Missing the most basic security measure
4. **Exposed error messages** - Reveals database structure to attackers
5. **No access controls** - Anyone can access any data

\`\`\`php
<?php
// The worst possible way to handle database queries
function getUserData($userId) {
    $connection = mysql_connect("localhost", "root", getenv("DB_PASSWORD"));
    mysql_select_db("users_db");
    
    // NEVER DO THIS - Direct string concatenation!
    $query = "SELECT * FROM users WHERE id = " . $userId;
    $result = mysql_query($query);
    
    if (!$result) {
        // Exposing database errors to users
        die("Database error: " . mysql_error());
    }
    
    return mysql_fetch_array($result);
}

function searchUsers($searchTerm) {
    $connection = mysql_connect("localhost", "root", getenv("DB_PASSWORD"));
    mysql_select_db("users_db");
    
    // Another injection point
    $query = "SELECT * FROM users WHERE name LIKE '%" . $searchTerm . "%'";
    $result = mysql_query($query);
    
    $users = array();
    while ($row = mysql_fetch_array($result)) {
        $users[] = $row;
    }
    
    return $users;
}

// Usage that enables attacks
$userId = $_GET['id']; // No validation!
$userData = getUserData($userId);

$search = $_POST['search']; // No sanitization!
$searchResults = searchUsers($search);
?>
\`\`\`

## Attack Examples

An attacker could easily:

\`\`\`sql
-- Get all user data
GET /user.php?id=1 OR 1=1

-- Drop the entire table
GET /user.php?id=1; DROP TABLE users; --

-- Extract password hashes
GET /user.php?id=1 UNION SELECT username,password FROM admin_users
\`\`\`

## The Secure Way

\`\`\`php
<?php
class UserRepository {
    private $pdo;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    public function getUserById(int $userId): ?array {
        try {
            $stmt = $this->pdo->prepare("SELECT id, username, email FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            throw new DatabaseException("Unable to fetch user data");
        }
    }
    
    public function searchUsers(string $searchTerm): array {
        $stmt = $this->pdo->prepare("SELECT id, username FROM users WHERE username LIKE ? LIMIT 50");
        $stmt->execute(['%' . $searchTerm . '%']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
\`\`\``,
    category: 'security',
    tags: ['php', 'sql-injection', 'security', 'database', 'vulnerability'],
    author: 'SecurityExpert',
    votes: 203,
    comments: 31,
    createdAt: '2024-01-14T14:20:00Z',
    demoUrl: 'https://example.com/vulnerable-demo'
  },
  {
    id: '3',
    title: 'React Component from Hell',
    description: 'A single React component that does everything: API calls, state management, rendering, validation, and more. Over 500 lines of unmaintainable code.',
    codeSnippet: `# The Monolithic Component Monster

This React component violates every principle of good component design.

## What's Wrong Here

1. **Single Responsibility Violation** - Does everything in one component
2. **No separation of concerns** - UI, logic, and data fetching all mixed
3. **Massive component** - Over 500 lines in a single file
4. **No custom hooks** - All logic embedded directly
5. **Prop drilling nightmare** - Passing props through multiple levels
6. **No error boundaries** - Will crash the entire app on errors

\`\`\`jsx
import React, { useState, useEffect } from 'react';

// The component that does EVERYTHING
function UserDashboard() {
  // State management nightmare
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Massive useEffect doing everything
  useEffect(() => {
    setLoading(true);
    
    // API call directly in component
    fetch('/api/users?page=' + currentPage + '&sort=' + sortBy + '&filter=' + filterBy)
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentPage, sortBy, filterBy]);
  
  // Inline validation logic
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (formData.email && !formData.email.includes('@')) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone) errors.phone = 'Phone is required';
    if (formData.age && formData.age < 18) {
      errors.age = 'Must be 18 or older';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Inline form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save user');
      
      const savedUser = await response.json();
      
      if (editMode) {
        setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
      } else {
        setUsers([...users, savedUser]);
      }
      
      setFormData({});
      setEditMode(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Massive render method with everything inline
  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      
      {/* Search and filters inline */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="created">Sort by Created</option>
        </select>
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>
      
      {/* Error handling inline */}
      {error && <div className="error">{error}</div>}
      
      {/* Loading state inline */}
      {loading && <div className="loading">Loading...</div>}
      
      {/* User list with inline logic */}
      <div className="user-list">
        {users
          .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <button onClick={() => {
                setSelectedUser(user);
                setFormData(user);
                setEditMode(true);
              }}>
                Edit
              </button>
              <button onClick={async () => {
                if (window.confirm('Delete user?')) {
                  try {
                    await fetch(\`/api/users/\${user.id}\`, { method: 'DELETE' });
                    setUsers(users.filter(u => u.id !== user.id));
                  } catch (err) {
                    setError(err.message);
                  }
                }
              }}>
                Delete
              </button>
            </div>
          ))}
      </div>
      
      {/* Pagination inline */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      {/* Form inline with all validation */}
      <form onSubmit={handleSubmit} className="user-form">
        <h2>{editMode ? 'Edit User' : 'Add User'}</h2>
        
        <input
          type="text"
          placeholder="Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {validationErrors.name && <span className="error">{validationErrors.name}</span>}
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ''}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {validationErrors.email && <span className="error">{validationErrors.email}</span>}
        
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        {validationErrors.phone && <span className="error">{validationErrors.phone}</span>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </button>
        
        {editMode && (
          <button type="button" onClick={() => {
            setEditMode(false);
            setFormData({});
            setSelectedUser(null);
          }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default UserDashboard;
\`\`\`

## The Right Way

Break this monster into smaller, focused components:

\`\`\`jsx
// Separate components with single responsibilities
function UserDashboard() {
  return (
    <div className="dashboard">
      <DashboardHeader />
      <UserFilters />
      <UserList />
      <UserForm />
      <Pagination />
    </div>
  );
}

// Custom hooks for logic separation
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Focused user management logic
  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}

function useUserForm() {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  
  // Focused form logic
  return { formData, validationErrors, validateForm, handleSubmit };
}
\`\`\``,
    category: 'frontend',
    tags: ['react', 'component-design', 'anti-pattern', 'monolithic', 'maintainability'],
    author: 'ReactRefactorer',
    votes: 189,
    comments: 27,
    createdAt: '2024-01-13T09:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg'
  },
  {
    id: '4',
    title: 'Docker Compose Disaster',
    description: 'A Docker Compose file that exposes all ports, runs everything as root, has no health checks, and stores secrets in plain text.',
    codeSnippet: `# The DevOps Security Nightmare

This Docker Compose configuration violates every security and best practice principle.

## Critical Security Issues

1. **Running as root** - All containers run with root privileges
2. **Exposed ports** - Every service port is exposed to the host
3. **Plain text secrets** - Passwords and API keys in clear text
4. **No health checks** - Services can fail silently
5. **No resource limits** - Can consume all system resources
6. **Privileged containers** - Full system access
7. **No network isolation** - All services on default network

\`\`\`yaml
version: '3.8'

services:
  # Database with terrible security
  database:
    image: postgres:latest
    ports:
      - "5432:5432"  # Exposed to the world!
    environment:
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}  # still in the compose file
      - POSTGRES_USER=root
      - POSTGRES_DB=production
    privileged: true  # Full system access!
    user: root  # Running as root!
    volumes:
      - /:/host-root  # Mounting entire host filesystem!
    
  # Redis with no authentication
  redis:
    image: redis:latest
    ports:
      - "6379:6379"  # Another exposed port
    command: redis-server --protected-mode no  # No protection!
    privileged: true
    user: root
    
  # Web application with secrets exposed
  web:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
      - "3000:3000"  # Exposing everything!
    environment:
      - API_KEY=\${API_KEY}  # still passed as a compose env value
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
      - STRIPE_SECRET_KEY=\${STRIPE_SECRET_KEY}
    privileged: true
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # Docker socket access!
      - /:/host  # Full host access
    depends_on:
      - database
      - redis
    
  # API service with no limits
  api:
    image: node:latest
    ports:
      - "3001:3001"
      - "9229:9229"  # Debug port exposed!
    environment:
      - NODE_ENV=production
      - DB_PASSWORD=\${DB_PASSWORD}
      - ADMIN_PASSWORD=\${ADMIN_PASSWORD}
      - SECRET_KEY=\${SECRET_KEY}
    privileged: true
    user: root
    volumes:
      - /:/host-system
    # No resource limits - can use all CPU/memory!
    
  # Monitoring with admin access
  monitoring:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=\${GF_SECURITY_ADMIN_PASSWORD}
      - GF_SECURITY_SECRET_KEY=\${GF_SECURITY_SECRET_KEY}
    privileged: true
    user: root
    volumes:
      - /var/log:/host-logs  # Access to all system logs
      
# No custom networks - everything on default
# No secrets management
# No health checks
# No resource constraints
\`\`\`

## What Attackers Can Do

With this configuration, an attacker who compromises any container can:

- Access the entire host filesystem
- Read all environment variables and secrets
- Connect to any service directly
- Escalate to root on the host system
- Access Docker daemon and create new containers
- Read system logs and sensitive data

## The Secure Way

\`\`\`yaml
version: '3.8'

services:
  database:
    image: postgres:14-alpine
    # No exposed ports - internal only
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
      - POSTGRES_USER=app_user
      - POSTGRES_DB=app_db
    user: postgres  # Non-root user
    volumes:
      - db_data:/var/lib/postgresql/data
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_db"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    networks:
      - backend
      
  redis:
    image: redis:7-alpine
    user: redis
    command: redis-server --requirepass-file /run/secrets/redis_password
    secrets:
      - redis_password
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
    networks:
      - backend
      
  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    user: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - web_static:/usr/share/nginx/html:ro
    depends_on:
      api:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - frontend
      - backend

secrets:
  db_password:
    file: ./secrets/db_password.txt
  redis_password:
    file: ./secrets/redis_password.txt
    
volumes:
  db_data:
  web_static:
  
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
\`\`\``,
    category: 'devops',
    tags: ['docker', 'security', 'devops', 'containers', 'vulnerability'],
    author: 'DevSecOps',
    votes: 167,
    comments: 19,
    createdAt: '2024-01-12T16:45:00Z',
    demoUrl: 'https://github.com/example/vulnerable-docker'
  },
  {
    id: '5',
    title: 'The Performance Killer Query',
    description: 'A database query that brings any system to its knees with N+1 problems, missing indexes, and unnecessary data fetching.',
    codeSnippet: `# The Query That Kills Databases

This query demonstrates every possible performance anti-pattern in database design.

## Performance Disasters

1. **N+1 Query Problem** - Executes hundreds of separate queries
2. **Missing Indexes** - Full table scans on large tables
3. **SELECT *** - Fetching unnecessary data
4. **No Pagination** - Loading entire datasets
5. **Nested Loops** - Cartesian products everywhere
6. **No Query Optimization** - Ignoring database capabilities

\`\`\`sql
-- The query that will destroy your database performance
SELECT 
    u.*,  -- Selecting everything from users (unnecessary data)
    p.*,  -- Selecting everything from posts
    c.*,  -- Selecting everything from comments
    l.*,  -- Selecting everything from likes
    f.*   -- Selecting everything from follows
FROM users u
LEFT JOIN posts p ON u.id = p.user_id  -- No index on user_id!
LEFT JOIN comments c ON p.id = c.post_id  -- No index here either!
LEFT JOIN likes l ON p.id = l.post_id  -- Another missing index
LEFT JOIN follows f ON u.id = f.follower_id  -- You guessed it, no index
WHERE u.created_at > '2020-01-01'  -- No index on created_at
    AND p.content LIKE '%keyword%'  -- LIKE with leading wildcard = full scan
    AND c.created_at > '2023-01-01'  -- Another unindexed date filter
ORDER BY u.created_at DESC, p.created_at DESC  -- Expensive sorting
-- No LIMIT clause - fetching ALL matching records!
\`\`\`

## The Application Code Making It Worse

\`\`\`python
# Python code that creates the N+1 nightmare
def get_user_dashboard(user_id):
    # First query - get user
    user = db.execute("SELECT * FROM users WHERE id = %s", [user_id])
    
    # N+1 Problem starts here
    posts = []
    for post_id in get_user_post_ids(user_id):  # Query 1
        post = db.execute("SELECT * FROM posts WHERE id = %s", [post_id])  # Query N
        
        # More N+1 problems nested inside!
        comments = []
        for comment_id in get_post_comment_ids(post_id):  # Query N+1
            comment = db.execute("SELECT * FROM comments WHERE id = %s", [comment_id])  # Query N*M
            
            # Even more nested queries!
            comment_author = db.execute("SELECT * FROM users WHERE id = %s", [comment['user_id']])  # Query N*M*O
            comment['author'] = comment_author
            comments.append(comment)
            
        post['comments'] = comments
        
        # Fetching likes one by one
        likes = []
        for like_id in get_post_like_ids(post_id):  # Another N+1
            like = db.execute("SELECT * FROM likes WHERE id = %s", [like_id])
            like_user = db.execute("SELECT * FROM users WHERE id = %s", [like['user_id']])
            like['user'] = like_user
            likes.append(like)
            
        post['likes'] = likes
        posts.append(post)
    
    # Getting followers with more N+1
    followers = []
    for follower_id in get_user_follower_ids(user_id):
        follower = db.execute("SELECT * FROM users WHERE id = %s", [follower_id])
        
        # Getting follower's post count (more queries!)
        follower_post_count = db.execute("SELECT COUNT(*) FROM posts WHERE user_id = %s", [follower_id])
        follower['post_count'] = follower_post_count[0]['count']
        
        followers.append(follower)
    
    return {
        'user': user,
        'posts': posts,  # Each post has nested comments and likes
        'followers': followers
    }

# This function will execute HUNDREDS of queries for a single dashboard!
# For a user with 50 posts, 10 comments per post, 5 likes per post, and 100 followers:
# Total queries: 1 + 50 + (50 * 10) + (50 * 10) + (50 * 5) + (50 * 5) + 100 + 100 = 1,851 queries!
\`\`\`

## The Database Schema Making It Worse

\`\`\`sql
-- Tables with NO indexes (performance nightmare)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP,
    bio TEXT,
    profile_image_url TEXT,
    settings JSON  -- Storing JSON without proper indexing
    -- Missing indexes on commonly queried columns!
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,  -- No foreign key constraint or index!
    title VARCHAR(200),
    content TEXT,
    created_at TIMESTAMP,  -- No index for date queries
    updated_at TIMESTAMP,
    tags TEXT,  -- Storing comma-separated tags instead of proper normalization
    metadata JSON  -- More unindexed JSON
    -- No indexes anywhere!
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER,  -- No index or foreign key
    user_id INTEGER,  -- No index or foreign key
    content TEXT,
    created_at TIMESTAMP,  -- No index
    parent_comment_id INTEGER  -- No index for nested comments
);

-- More tables with the same problems...
\`\`\`

## The Right Way

\`\`\`sql
-- Optimized query with proper joins and indexes
SELECT 
    u.id, u.username, u.email,  -- Only select needed columns
    p.id as post_id, p.title, p.content, p.created_at as post_date,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT l.id) as like_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN likes l ON p.id = l.post_id
WHERE u.id = $1  -- Parameterized query
    AND p.created_at > $2
GROUP BY u.id, u.username, u.email, p.id, p.title, p.content, p.created_at
ORDER BY p.created_at DESC
LIMIT 20 OFFSET $3;  -- Proper pagination

-- Proper indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_users_created_at ON users(created_at);
\`\`\`

\`\`\`python
# Optimized application code
def get_user_dashboard(user_id, page=1, per_page=20):
    offset = (page - 1) * per_page
    
    # Single optimized query instead of N+1
    query = """
        SELECT 
            u.id, u.username, u.email,
            p.id as post_id, p.title, p.content, p.created_at,
            COUNT(DISTINCT c.id) as comment_count,
            COUNT(DISTINCT l.id) as like_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN likes l ON p.id = l.post_id
        WHERE u.id = %s
        GROUP BY u.id, u.username, u.email, p.id, p.title, p.content, p.created_at
        ORDER BY p.created_at DESC
        LIMIT %s OFFSET %s
    """
    
    result = db.execute(query, [user_id, per_page, offset])
    
    # Process results efficiently
    user_data = None
    posts = []
    
    for row in result:
        if not user_data:
            user_data = {
                'id': row['id'],
                'username': row['username'],
                'email': row['email']
            }
        
        if row['post_id']:
            posts.append({
                'id': row['post_id'],
                'title': row['title'],
                'content': row['content'],
                'created_at': row['created_at'],
                'comment_count': row['comment_count'],
                'like_count': row['like_count']
            })
    
    return {
        'user': user_data,
        'posts': posts
    }

# This executes just 1 query instead of 1,851!
\`\`\``,
    category: 'database',
    tags: ['sql', 'performance', 'n+1-problem', 'database-optimization', 'indexing'],
    author: 'DBOptimizer',
    votes: 234,
    comments: 42,
    createdAt: '2024-01-11T11:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg'
  }
];