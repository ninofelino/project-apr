#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
  echo "❌ Error: OPENROUTER_API_KEY is not set in .env.local"
  exit 1
fi

MODEL=${OPENROUTER_MODEL:-"minimax/minimax-m2.5:free"}

echo "Testing OpenRouter API with model: $MODEL..."

RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hello, are you working?\"}]
  }")

if echo "$RESPONSE" | grep -q "choices"; then
  echo "✅ OpenRouter API test successful!"
  echo "AI Response: $(echo "$RESPONSE" | grep -o '\"content\":\"[^\"]*\"' | head -1 | cut -d'\"' -f4)"
else
  echo "❌ OpenRouter API test failed!"
  echo "Response: $RESPONSE"
  exit 1
fi
