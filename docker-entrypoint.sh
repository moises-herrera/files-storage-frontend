#!/bin/sh

mkdir -p /usr/share/nginx/html/assets

cat > /usr/share/nginx/html/assets/config.json << EOF
{
  "apiUrl": "${API_URL:-http://localhost:3000/api}",
  "production": ${PRODUCTION:-false}
}
EOF

exec "$@"
