#!/bin/bash

REPO_DIR="/Users/petersoncharles/Developer"
TEMP_FILE=$(mktemp)

# Find all .git directories and extract the repository names
find "$REPO_DIR" -name ".git" -type d | while read -r git_dir; do
    repo_name=$(basename "$(dirname "$git_dir")")
    echo "$repo_name $git_dir" >> "$TEMP_FILE"
done

# Sort the repositories by name and keep the newest one
sort -k1,1 -u "$TEMP_FILE" | while read -r repo_name git_dir; do
    repo_path=$(dirname "$git_dir")
    echo "Keeping $repo_path"
    # Find and remove duplicate repositories
    find "$REPO_DIR" -name "$repo_name" -type d | while read -r duplicate_dir; do
        if [ "$duplicate_dir" != "$repo_path" ]; then
            echo "Removing $duplicate_dir"
            rm -rf "$duplicate_dir"
        fi
    done
done

# Clean up
rm "$TEMP_FILE"

