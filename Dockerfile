ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN npm install --no-audit --no-fund \
  && npm run build

  # --- Stage 2: compile the API (TypeScript → JavaScript) ---
# Produces dist/ with index.js and the rest of the server bundle.
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app
COPY backend/ ./
RUN npm install --no-audit --no-fund \
  && npm run build

# --- Stage 3: runtime image (only prod deps + built assets) ---
# Express serves API routes and static files from public/ (the Vite build from stage 1).
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]