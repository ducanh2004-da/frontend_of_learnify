setup:
	npm i -g sass sass-migrator pnpm
	pnpm install
	sass-migrator module --migrate-deps node_modules/.pnpm/material-symbols\@0.42.3/node_modules/material-symbols/rounded.scss
	pnpm codegen

bootstrap:
	pnpm install
	pnpm codegen

dev:
	pnpm install
	pnpm codegen
	pnpm dev

build:
	pnpm build

prod:
	pnpm build
	pnpm preview

lint:
	pnpm lint

lint-fix:
	pnpm lint:fix

codegen:
	pnpm codegen

VPS_HOST ?= root@34.177.82.80
DEPLOY_DIR ?= /opt/learnify

vps-init:
	@if [ -z "$(VPS_HOST)" ]; then \
		echo "Usage: make vps-init VPS_HOST=root@34.56.78.90 DEPLOY_DIR=/opt/learnify"; \
		echo "  VPS_HOST   — SSH destination (required)"; \
		echo "  DEPLOY_DIR — path on VPS (default: /opt/learnify)"; \
		exit 1; \
	fi
	@echo "Setting up VPS at $(VPS_HOST):$(DEPLOY_DIR)"
	ssh $(VPS_HOST) "mkdir -p $(DEPLOY_DIR)/.git && git init --bare $(DEPLOY_DIR)/.git"
	scp scripts/post-receive $(VPS_HOST):$(DEPLOY_DIR)/.git/hooks/post-receive
	ssh $(VPS_HOST) "chmod +x $(DEPLOY_DIR)/.git/hooks/post-receive && chmod 755 $(DEPLOY_DIR)/.git/hooks/post-receive"
	git remote add vps $(VPS_HOST):$(DEPLOY_DIR)
	@echo "Done. Run 'make deploy' to push to VPS."

deploy:
	@if ! git remote get-url vps &>/dev/null; then \
		echo "Error: remote 'vps' not found. Run 'make vps-init' first."; \
		exit 1; \
	fi
	docker build \
		--build-arg VITE_GRAPHQL_ENDPOINT \
		--build-arg VITE_GOOGLE_CLIENT_ID \
		--build-arg VITE_ELEVENLABS_API_KEY \
		--build-arg VITE_ELEVENLABS_VOICE_ID \
		--build-arg VITE_ELENVENLABS_MODEL_ID \
		--build-arg VITE_ELEVENLABS_OUTPUT_FORMAT \
		--build-arg VITE_ELENVENLABS_ENABLE_TIMESTAMPS \
		--build-arg VITE_EDGETTS_VOICE_ID \
		--build-arg VITE_MODEL_CDN_URL \
		-t learnify-app:latest .
	docker save learnify-app:latest | gzip | ssh $(VPS_HOST) "gunzip | docker load"
	git push vps HEAD:staging

logs:
	ssh $(VPS_HOST) "docker compose -f $(DEPLOY_DIR)/docker-compose.yml logs -f --tail=50"

ssh:
	ssh $(VPS_HOST)
