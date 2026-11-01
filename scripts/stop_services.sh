#!/bin/bash
echo "Stopping all services..."

if command -v docker &> /dev/null; then
    docker compose -f docker/docker-compose.yml down
else
    pkill -f "uvicorn app.main:app" 2>/dev/null && echo "Backend stopped."
    pkill -f "vite" 2>/dev/null && echo "Frontend stopped."
    
    if [ -n "$HADOOP_HOME" ] && [ -f "$HADOOP_HOME/sbin/stop-dfs.sh" ]; then
        $HADOOP_HOME/sbin/stop-dfs.sh
        $HADOOP_HOME/sbin/stop-yarn.sh
        echo "Hadoop services stopped."
    fi
fi

echo "All services stopped."
