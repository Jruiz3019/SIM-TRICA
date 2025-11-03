#!/bin/bash
echo "Building with VITE_API_URL: $VITE_API_URL"
npm ci
npm run build
