#!/bin/bash

# Variables
REPO="florixer/flexiyo"  # Your repository

# Fetch the most recent run ID
RUN_ID=$(gh run list --repo $REPO --limit 1 --json databaseId --jq '.[0].databaseId')

# Fetch and display a summary of the latest run
if [ -n "$RUN_ID" ]; then
  echo "Fetching summary for latest run ID: $RUN_ID"
  gh run view $RUN_ID --repo $REPO --json status,conclusion --jq '.status, .conclusion'
else
  echo "No recent runs found."
fi