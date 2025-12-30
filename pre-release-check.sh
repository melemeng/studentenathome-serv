#!/bin/bash

# Pre-Release Final Check Script
# Führe dieses Script aus bevor du das Repository public machst

echo "🔍 StudentenAtHome Pre-Release Security Check"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: .env file should not exist in repo
echo "1️⃣  Checking for .env file..."
if git ls-files | grep -q "^\.env$"; then
    echo -e "${RED}❌ CRITICAL: .env file is tracked in Git!${NC}"
    echo "   Run: git rm --cached .env"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ .env is not in repository${NC}"
fi

# Check 2: Search for sensitive strings in committed files
echo ""
echo "2️⃣  Searching for secrets in committed files..."
SECRETS_FOUND=0

if git grep -q "lsBo1WSEzRsQokCezmAMtyXJUjKOY4emHiFBTaRPT7YbXwbego3El6v0BDq3f05A" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Old ADMIN_TOKEN found in committed files!${NC}"
    ERRORS=$((ERRORS + 1))
    SECRETS_FOUND=1
fi

if git grep -q "Linuslinus15" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: SMTP password found in committed files!${NC}"
    ERRORS=$((ERRORS + 1))
    SECRETS_FOUND=1
fi

if git grep -q "C5jBnuaPsMD6C3" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Database password found in committed files!${NC}"
    ERRORS=$((ERRORS + 1))
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No secrets found in committed files${NC}"
fi

# Check 3: logs/ and uploads/ should not be tracked
echo ""
echo "3️⃣  Checking for logs/ and uploads/ directories..."
if git ls-files | grep -q "^logs/\|^uploads/"; then
    echo -e "${YELLOW}⚠️  WARNING: logs/ or uploads/ files are tracked${NC}"
    echo "   Run: git rm -r --cached logs/ uploads/"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ logs/ and uploads/ are not tracked${NC}"
fi

# Check 4: Check .env.example for real secrets
echo ""
echo "4️⃣  Checking .env.example for placeholders..."
if grep -q "lsBo1WSEzRsQokCezmAMtyXJUjKOY4emHiFBTaRPT7YbXwbego3El6v0BDq3f05A" .env.example 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Real ADMIN_TOKEN in .env.example!${NC}"
    ERRORS=$((ERRORS + 1))
elif grep -q "your-random-admin-token" .env.example || grep -q "generiere-mit-openssl" .env.example; then
    echo -e "${GREEN}✅ .env.example contains only placeholders${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: .env.example might contain real values${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 5: npm audit
echo ""
echo "5️⃣  Running npm audit..."
if command -v npm &> /dev/null; then
    npm audit --production 2>&1 | head -20
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
        echo -e "${YELLOW}⚠️  WARNING: npm audit found vulnerabilities${NC}"
        echo "   Run: npm audit fix"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ No vulnerabilities found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  npm not found, skipping audit${NC}"
fi

# Check 6: Git history for secrets
echo ""
echo "6️⃣  Checking Git history for old ADMIN_TOKEN..."
if git log --all -S "lsBo1WSEzRsQokCezmAMtyXJUjKOY4emHiFBTaRPT7YbXwbego3El6v0BDq3f05A" --pretty=format:"%h" 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ CRITICAL: Old ADMIN_TOKEN found in Git history!${NC}"
    echo "   You MUST clean Git history or create a new repository"
    echo "   See PRE_RELEASE_CHECKLIST.md Section 2"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No secrets found in Git history${NC}"
fi

# Check 7: Verify .gitignore entries
echo ""
echo "7️⃣  Checking .gitignore..."
MISSING_ENTRIES=0

if ! grep -q "^\.env$" .gitignore; then
    echo -e "${RED}❌ .env not in .gitignore${NC}"
    ERRORS=$((ERRORS + 1))
    MISSING_ENTRIES=1
fi

if ! grep -q "^logs/" .gitignore; then
    echo -e "${RED}❌ logs/ not in .gitignore${NC}"
    ERRORS=$((ERRORS + 1))
    MISSING_ENTRIES=1
fi

if ! grep -q "^uploads/" .gitignore; then
    echo -e "${RED}❌ uploads/ not in .gitignore${NC}"
    ERRORS=$((ERRORS + 1))
    MISSING_ENTRIES=1
fi

if [ $MISSING_ENTRIES -eq 0 ]; then
    echo -e "${GREEN}✅ .gitignore is properly configured${NC}"
fi

# Check 8: Documentation exists
echo ""
echo "8️⃣  Checking documentation files..."
DOCS_OK=1

if [ ! -f "SECURITY_FEATURES.md" ]; then
    echo -e "${YELLOW}⚠️  SECURITY_FEATURES.md missing${NC}"
    WARNINGS=$((WARNINGS + 1))
    DOCS_OK=0
fi

if [ ! -f "DEPLOYMENT.md" ]; then
    echo -e "${YELLOW}⚠️  DEPLOYMENT.md missing${NC}"
    WARNINGS=$((WARNINGS + 1))
    DOCS_OK=0
fi

if [ ! -f "PRE_RELEASE_CHECKLIST.md" ]; then
    echo -e "${YELLOW}⚠️  PRE_RELEASE_CHECKLIST.md missing${NC}"
    WARNINGS=$((WARNINGS + 1))
    DOCS_OK=0
fi

if [ $DOCS_OK -eq 1 ]; then
    echo -e "${GREEN}✅ All documentation files exist${NC}"
fi

# Final Summary
echo ""
echo "=============================================="
echo "📊 Summary"
echo "=============================================="
echo -e "Errors: ${RED}${ERRORS}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ REPOSITORY NOT READY FOR PUBLIC RELEASE!${NC}"
    echo -e "${RED}   Fix all critical errors before pushing!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Fix all errors listed above"
    echo "2. Read PRE_RELEASE_CHECKLIST.md carefully"
    echo "3. Run this script again"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Repository has warnings but can be released${NC}"
    echo -e "${YELLOW}   Consider fixing warnings for best practices${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review warnings above"
    echo "2. Generate new production secrets (openssl rand -hex 32/64)"
    echo "3. git add . && git commit -m 'Security: Prepare for public release'"
    echo "4. git push origin main"
    echo "5. Make repository public on GitHub"
    exit 0
else
    echo -e "${GREEN}✅ REPOSITORY READY FOR PUBLIC RELEASE!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Generate new production secrets:"
    echo "   openssl rand -hex 32  # ADMIN_TOKEN"
    echo "   openssl rand -hex 64  # JWT_SECRET"
    echo "2. Final commit:"
    echo "   git add . && git commit -m 'Security: Prepare for public release'"
    echo "   git push origin main"
    echo "3. Make repository public on GitHub:"
    echo "   Settings → Danger Zone → Change visibility → Make public"
    echo "4. IMMEDIATELY set new secrets in production environment!"
    exit 0
fi
