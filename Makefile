.PHONY: player-install player-dev player-build hugo-dev dev

## Install player dependencies
player-install:
	cd player && npm install

## Start Remotion player dev server (hot reload, http://localhost:5173)
player-dev:
	cd player && npm run dev

## Build Remotion player to static/player/ (run before hugo build for deployment)
player-build:
	cd player && npm run build

## Start Hugo dev server
hugo-dev:
	hugo server --disableFastRender

## Start both Hugo + player in parallel (development)
dev:
	@echo "Starting Hugo + Remotion Player dev servers..."
	@make player-dev & hugo server --disableFastRender
