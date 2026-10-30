#!/usr/bin/env bash
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@34.177.82.80}"
DEPLOY_DIR="${DEPLOY_DIR:-/opt/learnify}"
IMAGE_NAME="${IMAGE_NAME:-learnify-app:latest}"
BRANCH="${1:-staging}"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log()  { printf "${GREEN}[%s]${NC} %s\n" "$(date +%H:%M:%S)" "$1"; }
err()  { printf "${RED}[%s]${NC} %s\n" "$(date +%H:%M:%S)" "$1" >&2; }

log "Building Docker image ${IMAGE_NAME}..."

BUILD_ARGS=""
if [[ -f .env ]]; then
    set -a; source .env; set +a
fi
for Var in VITE_GRAPHQL_ENDPOINT VITE_GOOGLE_CLIENT_ID VITE_ELEVENLABS_API_KEY VITE_ELEVENLABS_VOICE_ID VITE_ELENVENLABS_MODEL_ID VITE_ELEVENLABS_OUTPUT_FORMAT VITE_ELENVENLABS_ENABLE_TIMESTAMPS VITE_EDGETTS_VOICE_ID VITE_MODEL_CDN_URL; do
    BUILD_ARGS="$BUILD_ARGS --build-arg ${Var}=${!Var:-}"
done

docker build --no-cache $BUILD_ARGS -t "$IMAGE_NAME" .

log "Compressing image..."
IMAGE_FILE="/tmp/learnify-deploy-$(date +%s).tar.gz"
docker save "$IMAGE_NAME" | gzip > "$IMAGE_FILE"
log "Image saved: $(du -h "$IMAGE_FILE" | cut -f1)"

log "Shipping to ${VPS_HOST}..."
scp -q "$IMAGE_FILE" "${VPS_HOST}:/tmp/learnify-image.tar.gz"
rm "$IMAGE_FILE"

log "Loading and restarting on VPS..."
ssh "$VPS_HOST" "
    docker load < /tmp/learnify-image.tar.gz && \
    rm /tmp/learnify-image.tar.gz && \
    cd ${DEPLOY_DIR} && \
    docker compose up -d --force-recreate && \
    docker compose ps
" 2>&1

log "Pushing code to staging branch..."
git push vps "HEAD:${BRANCH}" --force 2>&1 || true

log "Deploy complete."
log "Health check: curl -s http://${VPS_HOST#*@}/health"
log "Monitor:     ssh ${VPS_HOST} 'cd ${DEPLOY_DIR} && docker compose logs -f --tail=20'"