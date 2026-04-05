.PHONY: player-install player-dev player-build hugo-dev dev thumbnails thumbnails-changed build

## Install player dependencies
player-install:
	cd player && npm install

## Start Remotion player dev server (hot reload, http://localhost:5173)
player-dev:
	cd player && npm run dev

## Build Remotion player to static/player/ (run before hugo build for deployment)
player-build:
	cd player && npm run build

## Generate thumbnails for ALL compositions (slow, ~5-10 min for full set)
thumbnails:
	bash scripts/generate-thumbnails.sh

## Generate thumbnails only for compositions in files changed since last commit (fast)
thumbnails-changed:
	bash scripts/generate-thumbnails.sh --changed

## Full production build: thumbnails (changed only) → player → hugo
build:
	@echo "Building: thumbnails → player → hugo"
	bash scripts/generate-thumbnails.sh --changed
	cd player && npm run build
	hugo

## Start Hugo dev server
hugo-dev:
	hugo server --disableFastRender

## Start both Hugo + player in parallel (development)
dev:
	@echo "Starting Hugo + Remotion Player dev servers..."
	@make player-dev & hugo server --disableFastRender
