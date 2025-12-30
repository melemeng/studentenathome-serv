#!/bin/bash

echo "📊 Überprüfe Datenbank - Benutzer und Login-Events"
echo "═══════════════════════════════════════════════════"
echo ""

echo "👥 Registrierte Benutzer:"
echo "─────────────────────────"
docker exec studentenathome-db psql -U postgres -d studentenathome -c "SELECT email, name, is_verified, is_admin, is_locked, created_at FROM users ORDER BY created_at DESC;" 2>/dev/null

echo ""
echo "📝 Audit-Log (Login/Logout Events):"
echo "───────────────────────────────────"
docker exec studentenathome-db psql -U postgres -d studentenathome -c "SELECT a.action, u.email, a.ip_address, a.created_at FROM audit_log a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 15;" 2>/dev/null

echo ""
echo "🚫 Fehlgeschlagene Login-Versuche:"
echo "──────────────────────────────────"
docker exec studentenathome-db psql -U postgres -d studentenathome -c "SELECT email, ip_address, attempted_at FROM failed_login_attempts ORDER BY attempted_at DESC LIMIT 10;" 2>/dev/null

echo ""
echo "✅ Check abgeschlossen!"
