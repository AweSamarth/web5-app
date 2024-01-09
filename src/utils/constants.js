export const protocolDefinition =

{
    "protocol": "https://h.xyz",
    "published": true,
    "types": {
      "profile": {
        "schema": "https://social-media.xyz/schemas/profileSchema",
        "dataFormats": ["text/plain"]
      },

      "name": {
        "schema": "https://social-media.xyz/schemas/nameSchema",
        "dataFormats": ["text/plain"]
      },
      "role": {
        "schema": "https://social-media.xyz/schemas/roleSchema",
        "dataFormats": ["text/plain"]
      },

      "pfp": {
        "schema": "https://social-media.xyz/schemas/pfpSchema",
        "dataFormats": ["image/jpeg"]
      },
      "prescription": {
        "schema": "https://social-media.xyz/schemas/prescriptionSchema",
        "dataFormats": ["text/plain"]
      }
    },

    "structure": {
      "profile": {
        "$actions": [
          {
            "who": "anyone",
            "can": "read"
          },
          {
            "who": "author",
            "of": "profile",
            "can": "write"
          }
        ],
        "pfp": {
          "$actions": [
            {
              "who": "anyone",
              "can": "read"
            },
            {
              "who": "author",
              "of": "profile",
              "can": "write"
            }
          ]
        },

        "name" :{          
            
            "$actions": [
            {
              "who": "author",
              "of": "profile",
              "can": "read"
            },
            {
                "who": "recipient",
                "of": "profile",
                "can": "read"
              },
            {
              "who": "author",
              "of": "profile",
              "can": "write"
            }
          ]},

          "role" :{          
            
            "$actions": [
            {
              "who": "anyone",
              "can": "read"
            },
          ]},



          "prescription": {
            "$actions": [
              {
                "who": "recipient",
                "of": "prescription",
                "can": "read"
              },
              {
                "who": "author",
                "of": "prescription",
                "can": "write"
              },
              {
                "who": "author",
                "of": "prescription",
                "can": "update"
              }
    
            ]
    
            
    
          }

    
    },
      "prescription": {
        "$actions": [
          {
            "who": "recipient",
            "of": "prescription",
            "can": "read"
          },
          {
            "who": "author",
            "of": "prescription",
            "can": "write"
          },
          {
            "who": "author",
            "of": "prescription",
            "can": "update"
          }

        ]

        

      }
    }
}