export const protocolDefinition = {
    "protocol": "https://social-media.xyz",
    "published": true,
    "types": {
      "patientProfile": {
        "schema": "https://social-media.xyz/schemas/postSchema",
        "dataFormats": ["text/plain"]
      },
      "reply": {
        "schema": "https://social-media.xyz/schemas/replySchema",
        "dataFormats": ["text/plain"]
      },
      "image": {
        "dataFormats": ["image/jpeg"]
      },
      "caption": {
        "schema": "https://social-media.xyz/schemas/captionSchema",
        "dataFormats": ["text/plain"]
      }
    },
    "structure": {
      "post": {
        "$actions": [
          {
            "who": "anyone",
            "can": "read"
          },
          {
            "who": "anyone",
            "can": "write"
          }
        ],
        "reply": {
          "$actions": [
            {
              "who": "recipient",
              "of": "post",
              "can": "write"
            },
            {
              "who": "author",
              "of": "post",
              "can": "write"
            }
          ]
        }
      },
      "image": {
        "$actions": [
          {
            "who": "anyone",
            "can": "read"
          },
          {
            "who": "anyone",
            "can": "write"
          }
        ],
        "caption": {
          "$actions": [
            {
              "who": "anyone",
              "can": "read"
            },
            {
              "who": "author",
              "of": "image",
              "can": "write"
            }
          ]
        },
        "reply": {
          "$actions": [
            {
              "who": "author",
              "of": "image",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "image",
              "can": "write"
            }
          ]
        }
      }
    }
}