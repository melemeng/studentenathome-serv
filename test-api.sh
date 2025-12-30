#!/bin/bash

echo "========================================="
echo "TESTING STUDENTENATHOME API"
echo "========================================="
echo ""

# Test 1: Register Admin User
echo "TEST 1: Registering Admin User..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support@studentenathome.de",
    "password": "TestPassword123!",
    "name": "Admin User"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""
echo "========================================="
echo ""

# Wait a moment
sleep 2

# Test 2: Get verification token from database
echo "TEST 2: Getting verification token from database..."
echo "Please check Supabase SQL Editor with:"
echo "SELECT id, email, verification_token, is_verified, is_admin FROM users WHERE email = 'support@studentenathome.de';"
echo ""
echo "========================================="
echo ""

# Test 3: Try login BEFORE verification (should fail)
echo "TEST 3: Attempting login BEFORE email verification (should fail)..."
LOGIN_BEFORE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support@studentenathome.de",
    "password": "TestPassword123!"
  }')

echo "Response: $LOGIN_BEFORE"
echo ""
echo "========================================="
echo ""

# Test 4: Wrong password (should increment failed_login_attempts)
echo "TEST 4: Attempting login with WRONG password..."
WRONG_PASSWORD=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support@studentenathome.de",
    "password": "WrongPassword123!"
  }')

echo "Response: $WRONG_PASSWORD"
echo ""
echo "========================================="
echo ""

# Test 5: Get posts (should return empty or existing posts)
echo "TEST 5: Getting all posts (public)..."
POSTS_RESPONSE=$(curl -s http://localhost:5000/api/posts)
echo "Response: $POSTS_RESPONSE"
echo ""
echo "========================================="
echo ""

# Test 6: Create blog post (with admin token)
echo "TEST 6: Creating blog post with admin token..."
CREATE_POST=$(curl -s -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "title": "Test Blog Post About Tech Support in Dresden",
    "excerpt": "This is a comprehensive test excerpt for our blog post about tech support services",
    "content": "This is the full content of the test blog post. It contains information about our tech support services in Dresden, Germany. We provide excellent support for students and businesses alike.",
    "category": "Tech-Tipps",
    "author": "Admin Team"
  }')

echo "Response: $CREATE_POST"
echo ""
echo "========================================="
echo ""

# Test 7: Check sitemap
echo "TEST 7: Checking sitemap generation..."
SITEMAP_RESPONSE=$(curl -s http://localhost:5000/sitemap.xml | head -20)
echo "Sitemap (first 20 lines):"
echo "$SITEMAP_RESPONSE"
echo ""
echo "========================================="
echo ""

echo "MANUAL STEPS REQUIRED:"
echo "1. Go to Supabase SQL Editor"
echo "2. Run: SELECT id, email, verification_token, is_verified, is_admin FROM users WHERE email = 'support@studentenathome.de';"
echo "3. Copy the verification_token"
echo "4. Test verification with: curl 'http://localhost:5000/api/auth/verify-email?token=YOUR_TOKEN'"
echo "5. Check audit log: SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;"
echo "6. Check failed logins: SELECT * FROM failed_login_attempts ORDER BY attempted_at DESC LIMIT 10;"
echo ""
echo "========================================="
