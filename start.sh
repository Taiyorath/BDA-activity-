#!/bin/bash
# ============================================================
#  AccidentIQ — Quick Start Script
#  Road Accident Pattern Analysis and Black Spot Identification
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║        AccidentIQ — Hadoop Analytics Platform        ║"
echo "║   Road Accident Pattern Analysis & Black Spot ID     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── Step 0: Free up ports 8000 and 4033 if already bound ─────
echo "[0/3] Cleaning up existing processes on ports 8000 and 4033..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:4033 | xargs kill -9 2>/dev/null || true
sleep 1

# ── Step 1: Generate / validate dataset ─────────────────────
if [ ! -f "$PROJECT_ROOT/datasets/processed/accidents_clean.csv" ]; then
  echo "[1/3] Dataset not found. Generating 50,000 synthetic records..."
  python3 "$PROJECT_ROOT/datasets/synthetic/generate_synthetic.py" \
    --records 50000 \
    --output "$PROJECT_ROOT/datasets/raw/synthetic_accidents.csv"
  python3 "$PROJECT_ROOT/scripts/preprocess_data.py"
else
  echo "[1/3] Dataset ready ✓"
fi

# ── Step 2: Start FastAPI backend ────────────────────────────
echo "[2/3] Starting backend API on http://localhost:8000 ..."
cd "$PROJECT_ROOT/backend"
pip install -q -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/backend-8000.log 2>&1 &
BACKEND_PID=$!
echo "      Backend PID: $BACKEND_PID"

# Wait for backend to start
for i in {1..15}; do
  if curl -s http://127.0.0.1:8000/api/health > /dev/null 2>&1; then
    echo "      Backend is up ✓"
    break
  fi
  sleep 1
done

# ── Step 3: Start React frontend ─────────────────────────────
echo "[3/3] Starting frontend on http://localhost:4033 ..."
cd "$PROJECT_ROOT/frontend"
npx vite --port 4033 --host 0.0.0.0 > /tmp/vite-4033.log 2>&1 &
FRONTEND_PID=$!
echo "      Frontend PID: $FRONTEND_PID"

# Wait for frontend to respond
for i in {1..15}; do
  if curl -s http://127.0.0.1:4033 > /dev/null 2>&1; then
    echo "      Frontend is up ✓"
    break
  fi
  sleep 1
done

# Try to automatically open in default browser on macOS
if command -v open &> /dev/null; then
  open "http://localhost:4033" 2>/dev/null || true
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  Application is running!                         ║"
echo "║                                                      ║"
echo "║  Dashboard  →  http://localhost:4033                 ║"
echo "║  API Docs   →  http://localhost:8000/docs            ║"
echo "║  API Health →  http://localhost:8000/api/health      ║"
echo "║                                                      ║"
echo "║  Hadoop Operations demo available in the sidebar     ║"
echo "║  Press Ctrl+C to stop all services                   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Keep running and handle Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait

