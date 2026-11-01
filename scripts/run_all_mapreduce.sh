#!/bin/bash
HADOOP_STREAMING_JAR=$(find $HADOOP_HOME -name "hadoop-streaming-*.jar" 2>/dev/null | head -1)
INPUT="/accidents/processed/"
PROJECT_ROOT="$(dirname "$(dirname "$(realpath "$0")")")"

JOBS=("city_count" "state_count" "hour_count" "severity_count" "weather_count")

for JOB in "${JOBS[@]}"; do
    echo "Running MapReduce job: $JOB"
    MAPPER="$PROJECT_ROOT/hadoop/mapreduce/$JOB/mapper.py"
    REDUCER="$PROJECT_ROOT/hadoop/mapreduce/$JOB/reducer.py"
    OUTPUT="/accidents/results/mapreduce/$JOB"
    
    # Remove existing output
    hdfs dfs -rm -r -f "$OUTPUT"
    
    hadoop jar "$HADOOP_STREAMING_JAR" \
        -input "$INPUT" \
        -output "$OUTPUT" \
        -mapper "python3 $MAPPER" \
        -reducer "python3 $REDUCER" \
        -file "$MAPPER" \
        -file "$REDUCER"
    
    echo "Job $JOB completed. Output at: $OUTPUT"
    echo "---"
done

echo "All MapReduce jobs completed."
