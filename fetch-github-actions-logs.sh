#!/bin/bash

# Variables
REPO="florixer/flexiyo"  # Replace with your repository owner and name
LIMIT=1  # Number of most recent runs to fetch (adjust as needed)

# Fetch the most recent run ID
RUN_ID=$(gh run list --repo $REPO --limit $LIMIT --json databaseId --jq '.[0].databaseId')

# Fetch and display a summary of the latest run
if [ -n "$RUN_ID" ]; then
  echo "Fetching summary for run ID: $RUN_ID"
  gh run view $RUN_ID --repo $REPO --json status,conclusion --jq '.status, .conclusion'
else
  echo "No recent runs found."
fi
