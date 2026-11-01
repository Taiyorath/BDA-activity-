#!/bin/bash
echo "=============================================="
echo "  Road Accident Analysis - Starting Services"
echo "=============================================="

# Check if using Docker
if command -v docker &> /dev/null; then
    echo "[Docker] Starting all services with Docker Compose..."
    docker compose -f docker/docker-compose.yml up -d
    echo ""
    echo "Services started:"
    echo "  → Frontend:          http://localhost:4033"
    echo "  → Backend API:       http://localhost:8000"
    echo "  → HDFS NameNode UI:  http://localhost:9870"
    echo "  → YARN Resource UI:  http://localhost:8088"
    echo "  → API Docs:          http://localhost:8000/docs"
else
    echo "[Manual] Starting services manually..."
    
    # Start Hadoop if available
    if [ -n "$HADOOP_HOME" ] && [ -f "$HADOOP_HOME/sbin/start-dfs.sh" ]; then
        echo "[Hadoop] Starting HDFS..."
        $HADOOP_HOME/sbin/start-dfs.sh
        echo "[Hadoop] Starting YARN..."
        $HADOOP_HOME/sbin/start-yarn.sh
        echo "[Hadoop] Setting up HDFS directories..."
        bash hadoop/hdfs/setup_dirs.sh
        echo "[Hadoop] Uploading dataset to HDFS..."
        bash hadoop/hdfs/upload_data.sh
    else
        echo "[Hadoop] HADOOP_HOME not set or not installed. Skipping Hadoop services."
        echo "         The backend will use simulated Hadoop execution."
    fi
    
    # Clear existing processes on ports 8000 and 4033
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:4033 | xargs kill -9 2>/dev/null || true
    sleep 1

    # Start Backend
    echo "[Backend] Starting FastAPI server..."
    cd backend
    pip install -r requirements.txt -q
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "[Backend] Running with PID $BACKEND_PID"
    cd ..
    
    # Wait for backend
    for i in {1..15}; do
        if curl -s http://127.0.0.1:8000/api/health > /dev/null 2>&1; then
            break
        fi
        sleep 1
    done

    # Start Frontend
    echo "[Frontend] Starting React dev server..."
    cd frontend
    npm install -q
    npx vite --port 4033 --host 0.0.0.0 &
    FRONTEND_PID=$!
    echo "[Frontend] Running with PID $FRONTEND_PID"
    cd ..
    
    echo ""
    echo "Services started:"
    echo "  → Frontend:    http://localhost:4033"
    echo "  → Backend API: http://localhost:8000"
    echo "  → API Docs:    http://localhost:8000/docs"
fi
