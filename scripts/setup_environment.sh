#!/bin/bash
echo "======================================"
echo "  Environment Setup Script"
echo "======================================"

echo ""
echo "[1/5] Checking Java..."
if command -v java &> /dev/null; then
    echo "  ✓ Java: $(java -version 2>&1 | head -1)"
else
    echo "  ✗ Java not found. Install OpenJDK 11: brew install openjdk@11"
fi

echo ""
echo "[2/5] Checking Python..."
if command -v python3 &> /dev/null; then
    echo "  ✓ Python: $(python3 --version)"
else
    echo "  ✗ Python 3 not found."
fi

echo ""
echo "[3/5] Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  ✓ Node: $(node --version)"
else
    echo "  ✗ Node.js not found. Install: brew install node"
fi

echo ""
echo "[4/5] Checking Docker..."
if command -v docker &> /dev/null; then
    echo "  ✓ Docker: $(docker --version)"
else
    echo "  ✗ Docker not found. Install Docker Desktop."
fi

echo ""
echo "[5/5] Checking Hadoop ecosystem..."
for tool in hdfs hadoop hive pig spark-submit; do
    if command -v $tool &> /dev/null; then
        echo "  ✓ $tool found"
    else
        echo "  ✗ $tool not found (will use simulated execution)"
    fi
done

echo ""
echo "======================================"
echo "  Generating Dataset..."
echo "======================================"
python3 datasets/synthetic/generate_synthetic.py --records 100000
python3 scripts/preprocess_data.py
echo ""
echo "Setup complete! Run: bash scripts/start_services.sh"
