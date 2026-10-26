#!/usr/bin/env bash

set -euo pipefail

image_tag="${WEB_IMAGE_TAG:-cafedebug/web:ci}"
host_port="${WEB_SMOKE_PORT:-3100}"
container_name="cafedebug-web-smoke-$$"
base_url="http://127.0.0.1:${host_port}"
public_url="https://web-ci.example.invalid"
temp_dir="$(mktemp -d)"

cleanup() {
  docker rm --force "$container_name" >/dev/null 2>&1 || true
  rm -rf "$temp_dir"
}
trap cleanup EXIT

request() {
  local path="$1"
  local label="$2"

  response_headers="$temp_dir/${label}.headers"
  response_body="$temp_dir/${label}.body"

  for attempt in $(seq 1 30); do
    if curl --fail --silent --dump-header "$response_headers" \
      --output "$response_body" "${base_url}${path}"; then
      return 0
    fi

    sleep 1
  done

  printf 'Website container did not serve %s within 30 seconds.\n' "$path" >&2
  return 1
}

assert_no_store() {
  local headers_file="$1"

  if ! grep -Eiq '^cache-control:[[:space:]]*no-store([,[:space:]]|$)' "$headers_file"; then
    printf 'Expected Cache-Control: no-store in %s.\n' "$headers_file" >&2
    return 1
  fi
}

docker build \
  --file infra/docker/web/Dockerfile \
  --target production \
  --build-arg "NEXT_PUBLIC_SITE_URL=${public_url}" \
  --tag "$image_tag" \
  .

docker run \
  --detach \
  --rm \
  --name "$container_name" \
  --publish "127.0.0.1:${host_port}:3000" \
  "$image_tag" >/dev/null

request '/api/health' 'health'
grep -Fq '"status":"ok"' "$response_body"
assert_no_store "$response_headers"

request '/sitemap.xml' 'sitemap'
grep -Fq "<loc>${public_url}</loc>" "$response_body"
grep -Fq "<loc>${public_url}/episodes</loc>" "$response_body"
grep -Fq "<loc>${public_url}/about</loc>" "$response_body"

request '/robots.txt' 'robots'
grep -Fq "Sitemap: ${public_url}/sitemap.xml" "$response_body"

printf 'Website production image smoke test passed.\n'
