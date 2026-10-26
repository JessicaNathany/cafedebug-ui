#!/usr/bin/env bash

set -euo pipefail

required_variables=(WEB_BASE_URL ADMIN_BASE_URL API_PUBLIC_BASE_URL)
missing_variables=()

for variable_name in "${required_variables[@]}"; do
  if [[ -z "${!variable_name:-}" ]]; then
    missing_variables+=("$variable_name")
  fi
done

if ((${#missing_variables[@]} > 0)); then
  printf 'Missing production environment variable(s): %s. Configure them in the GitHub production environment before running this smoke check.\n' \
    "${missing_variables[*]}" >&2
  exit 1
fi

WEB_BASE_URL="${WEB_BASE_URL%/}"
ADMIN_BASE_URL="${ADMIN_BASE_URL%/}"
API_PUBLIC_BASE_URL="${API_PUBLIC_BASE_URL%/}"
temp_dir="$(mktemp -d)"

cleanup() {
  rm -rf "$temp_dir"
}
trap cleanup EXIT

request() {
  local url="$1"
  local label="$2"

  response_headers="$temp_dir/${label}.headers"
  response_body="$temp_dir/${label}.body"

  for attempt in $(seq 1 10); do
    if curl --fail-with-body --location --silent --show-error \
      --connect-timeout 10 --max-time 20 \
      --dump-header "$response_headers" --output "$response_body" "$url"; then
      return 0
    fi

    sleep 6
  done

  printf 'Production endpoint did not succeed after 10 attempts: %s\n' "$url" >&2
  return 1
}

assert_no_store() {
  local headers_file="$1"
  local label="$2"

  if ! grep -Eiq '^cache-control:[[:space:]]*no-store([,[:space:]]|$)' "$headers_file"; then
    printf '%s did not return Cache-Control: no-store.\n' "$label" >&2
    return 1
  fi
}

assert_ok_status() {
  local body_file="$1"
  local label="$2"

  if ! jq -e '.status == "ok"' "$body_file" >/dev/null; then
    printf '%s did not return a JSON status of ok.\n' "$label" >&2
    return 1
  fi
}

request "${WEB_BASE_URL}/api/health" 'web-health'
assert_ok_status "$response_body" 'Website health'
assert_no_store "$response_headers" 'Website health'

request "${WEB_BASE_URL}/sitemap.xml" 'web-sitemap'
grep -Fq "<loc>${WEB_BASE_URL}</loc>" "$response_body"
grep -Fq "<loc>${WEB_BASE_URL}/episodes</loc>" "$response_body"
grep -Fq "<loc>${WEB_BASE_URL}/about</loc>" "$response_body"

request "${WEB_BASE_URL}/robots.txt" 'web-robots'
grep -Fq "Sitemap: ${WEB_BASE_URL}/sitemap.xml" "$response_body"

request "${WEB_BASE_URL}/about" 'web-about'
grep -Fq 'canonical' "$response_body"
grep -Fq "${WEB_BASE_URL}/about" "$response_body"

request "${ADMIN_BASE_URL}/api/health" 'admin-health'
assert_ok_status "$response_body" 'Backoffice health'
assert_no_store "$response_headers" 'Backoffice health'

request "${ADMIN_BASE_URL}/robots.txt" 'admin-robots'
grep -Eq '^User-agent:[[:space:]]*\*$' "$response_body"
grep -Eq '^Disallow:[[:space:]]*/$' "$response_body"

request "${API_PUBLIC_BASE_URL}/health/ready" 'api-ready'

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf '%s\n' \
    '## Production smoke' \
    '- Website health, sitemap, robots, and canonical URL passed.' \
    '- Backoffice health and disallow-all robots passed.' \
    '- API readiness passed.' \
    '- Human release check remaining: authorized admin login and a read-only content operation.' \
    >>"$GITHUB_STEP_SUMMARY"
fi

printf 'Production smoke checks passed.\n'
