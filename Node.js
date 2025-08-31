{
  "nodes": [
    {
      "parameters": {},
      "id": "f8fb19b2-ccb0-48f2-816b-d8582a1f5e47",
      "name": "Start Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [-1520, 220],
      "typeVersion": 1
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_URL",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "YOUR_SHEET_NAME",
          "mode": "url"
        },
        "options": {}
      },
      "id": "920b3043-3d14-4e90-8032-b8bf04060628",
      "name": "Read Planning Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "position": [-1300, 200],
      "typeVersion": 4,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "YOUR_GOOGLE_SHEET_CREDENTIAL_ID",
          "name": "Google Sheets Account"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.Schedule }}",
              "operation": "notContains",
              "value2": "=Write a linkedin post on {{ $json[\"Content Pillar\"] }} Here you can find topic and idea{{ $json[\"Topic/Idea\"] }} on the top of the topic mention this date {{ $json.Schedule }}"
            }
          ]
        }
      },
      "id": "5c7d2702-76a6-41ee-8f23-1f73975e9136",
      "name": "Filter Status = Start",
      "type": "n8n-nodes-base.if",
      "position": [-40, 160],
      "typeVersion": 1
    },
    {
      "parameters": {
        "keepOnlySet": true,
        "values": {
          "string": [
            {
              "name": "prompt",
              "value": "=Mention {{ $json.Schedule }} on top of article \nI am an SEO expert now I am using AI and automation tool to do SEO and it is giving good result you have to write a linkedin post on topic{{ $json[\"Content Pillar\"] }} You can tak idea from {{ $json[\"Topic/Idea\"] }} You have to write{{ $json.sheetDate }} on the top of the post. Topic should not sound like robotic it sound like human if needed you can add story in the post"
            }
          ]
        },
        "options": {}
      },
      "id": "f9469252-cdba-401a-ba0d-2277c51c36ca",
      "name": "Format Prompt",
      "type": "n8n-nodes-base.set",
      "position": [300, 240],
      "typeVersion": 2
    },
    {
      "parameters": {
        "jsCode": "// Get today's date in YYYY-MM-DD format\nconst today = new Date().toISOString().split('T')[0];\n\n// Filter only rows where Schedule == today\nconst results = $input.all().filter(item => item.json.Schedule === today);\n\n// Return only today's rows\nreturn results;\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-840, 200],
      "id": "ba1b96af-84cf-4a37-885b-313134a2e04a",
      "name": "Code"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.prompt }}",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2,
      "position": [620, 120],
      "id": "13410b9b-aa38-498f-9440-0ef1d4868ca3",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "model": "openai/gpt-3.5-turbo",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
      "typeVersion": 1,
      "position": [520, 300],
      "id": "1356b765-e1f5-4c8d-bd39-a26fbaacafe9",
      "name": "OpenRouter Chat Model",
      "credentials": {
        "openRouterApi": {
          "id": "YOUR_OPENROUTER_CREDENTIAL_ID",
          "name": "OpenRouter Account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://router.huggingface.co/together/v1/images/generations",
        "sendHeaders": true,
        "specifyHeaders": "json",
        "jsonHeaders": "={\n  \"Authorization\": \"Bearer YOUR_HF_API_KEY\",\n  \"Content-Type\": \"application/json\"\n}\n",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"prompt\": \"{{ $json['Content Pillar'] }}\",\n  \"response_format\": \"base64\",\n  \"model\": \"black-forest-labs/FLUX.1-schnell\"\n}",
        "options": {
          "response": {
            "response": {
              "fullResponse": true,
              "responseFormat": "json"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [0, 680],
      "id": "8623f99f-427d-49a6-895e-5386b0a180ab",
      "name": "HTTP Request"
    },
    {
      "parameters": {
        "driveId": {
          "__rl": true,
          "mode": "list",
          "value": "My Drive"
        },
        "folderId": {
          "__rl": true,
          "mode": "list",
          "value": "root",
          "cachedResultName": "/ (Root folder)"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [520, 680],
      "id": "63d31a80-02ed-494e-8abd-98be2331a828",
      "name": "Google Drive",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "YOUR_GOOGLE_DRIVE_CREDENTIAL_ID",
          "name": "Google Drive Account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const base64 = $json[\"body\"][\"data\"][0][\"b64_json\"];\n\n// Dynamic name bana lo (timestamp use kar ke)\nconst fileName = `image_${Date.now()}.png`;\n\nreturn [\n  {\n    binary: {\n      data: {\n        data: Buffer.from(base64, \"base64\"),\n        mimeType: 'image/png',\n        fileName: fileName,\n      }\n    }\n  }\n];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [280, 640],
      "id": "044c4f52-37da-458a-9a1d-b653c2826143",
      "name": "Code1"
    },
    {
      "parameters": {
        "command": "=node ~/YOUR_SCRIPT_PATH/linkedin.js"
      },
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1,
      "position": [980, 120],
      "id": "7cf7e306-3cd5-4fe5-b720-7e2966520f45",
      "name": "Execute Command"
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "YOUR_INSTANCE_ID"
  }
}
