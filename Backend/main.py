import os
import re
import json
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
import chromadb
from chromadb.utils import embedding_functions

# Initialize Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Set up the models
planning_model = genai.GenerativeModel('gemini-1.5-pro')
guide_model = genai.GenerativeModel('gemini-1.5-pro'),

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./travel_plans_db")
embedding_function = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_or_create_collection(
    name="travel_plans",
    embedding_function=embedding_function
)

def extract_trip_details(prompt, quiz_responses):
    """Extract travel details with enhanced JSON validation."""
    extraction_prompt = f"""
    Strictly return valid JSON without any additional text. Follow these rules:
    1. Use double quotes for all property names and string values
    2. No trailing commas in arrays or objects
    3. Escape any internal double quotes with \\
    4. Never use single quotes
    5. Follow this exact schema:
    {{
        "trip_details": {{
            "origin": "City",
            "destination": "City",
            "dates": {{
                "start": "YYYY-MM-DD",
                "end": "YYYY-MM-DD",
                "duration_days": Number
            }},
            "budget": "Amount"
        }},
        "user_profile": {{
            "age_group": "String",
            "travel_style": "String",
            "key_interests": ["Array"],
            "experience_goals": ["Array"]
        }}
    }}
    
    User Profile: {json.dumps(quiz_responses)}
    Trip Request: "{prompt}"
    """
    
    try:
        response = planning_model.generate_content(extraction_prompt)
        json_text = response.text
        
        # Enhanced JSON cleaning
        json_text = re.sub(r'[\s\S]*?({.*})[\s\S]*', r'\1', json_text)  # Extract first JSON object
        json_text = re.sub(r',\s*([}\]])', r'\1', json_text)  # Remove trailing commas
        json_text = re.sub(r"'", '"', json_text)  # Replace single quotes
        json_text = re.sub(r'\\{2,}"', r'\"', json_text)  # Fix escaped quotes
        
        # Add validation
        parsed = json.loads(json_text)
        
        # Validate required fields
        required = {
            'trip_details': ['origin', 'destination', 'dates', 'budget'],
            'user_profile': ['age_group', 'travel_style', 'key_interests', 'experience_goals']
        }
        
        for section, fields in required.items():
            if section not in parsed:
                raise ValueError(f"Missing section: {section}")
            for field in fields:
                if field not in parsed[section]:
                    raise ValueError(f"Missing field: {section}.{field}")
        
        return parsed
        
    except json.JSONDecodeError as e:
        print(f"JSON Error: {str(e)}")
        print(f"Problematic JSON: {json_text}")
        return {"error": f"Invalid JSON: {str(e)}"}
    except Exception as e:
        print(f"Extraction Error: {str(e)}")
        return {"error": str(e)}
    
def create_travel_plan(combined_data):
    """Generate personalized itineraries based on user profile."""
    try:
        planning_prompt = f"""
        Create two personalized itineraries (budget & luxury) for:
        
        {json.dumps(combined_data, indent=2)}
        
        Consider these factors:
        1. Age-appropriate activities ({combined_data['user_profile']['age_group']})
        2. {combined_data['user_profile']['travel_style']} travel style
        3. Transportation: {combined_data['user_profile'].get('transport_preference', 'any')}
        4. Main interests: {', '.join(combined_data['user_profile']['key_interests'])}
        5. Experience goals: {', '.join(combined_data['user_profile']['experience_goals'])}
        
        Structure response as:
        {{
            "itineraries": {{
                "budget": {{
                    "theme": "Itinerary theme matching user style",
                    "activities": [
                        {{
                            "type": "activity category",
                            "description": "Detailed description",
                            "age_suitability": "Recommended age group",
                            "interest_match": ["matched", "interests"],
                            "cost": "Estimated cost",
                            "time_required": "Duration"
                        }}
                    ],
                    "transportation": {{
                        "between_activities": "Transport mode details",
                        "cost_breakdown": "Transportation costs"
                    }},
                    "dining": {{
                        "budget_options": [
                            {{
                                "type": "Meal type",
                                "suggestion": "Restaurant/recommendation",
                                "cuisine": "Food style",
                                "cost": "Meal cost"
                            }}
                        ]
                    }}
                }},
                "luxury": {{
                    "theme": "Premium experience theme",
                    "activities": [
                        {{
                            "type": "Premium activity category",
                            "description": "Detailed luxury experience",
                            "age_suitability": "Adjusted for age group",
                            "interest_match": ["matched", "premium", "interests"],
                            "cost": "Premium cost",
                            "time_required": "Duration"
                        }}
                    ],
                    "transportation": {{
                        "between_activities": "Luxury transport modes",
                        "cost_breakdown": "Premium transport costs"
                    }},
                    "dining": {{
                        "luxury_options": [
                            {{
                                "type": "Fine dining experience",
                                "suggestion": "Michelin/celebrity chef",
                                "cuisine": "Gourmet style",
                                "cost": "Luxury meal cost"
                            }}
                        ]
                    }}
                }}
            }},
            "personalization_factors": {{
                "age_considerations": "How activities suit age group",
                "style_match": "How itineraries match travel style",
                "bucket_list_progress": "Which bucket list items are addressed"
            }}
        }}
        """
        
        response = planning_model.generate_content(planning_prompt)
        json_text = response.text.strip()
        return json.loads(re.sub(r'```json\s*|\s*```', '', json_text))
    except Exception as e:
        return {"error": str(e)}

# Updated plan_trip endpoint
@app.route('/api/plan-trip', methods=['POST'])
def plan_trip():
    try:
        data = request.get_json()
        
        # Quiz responses
        quiz = {
            "age_group": data.get('age_group', 'adult'),
            "travel_style": data.get('travel_style', 'explorer'),
            "interests": data.get('interests', []),
            "bucket_list": data.get('bucket_list', []),
            "travel_frequency": data.get('travel_frequency', 'occasionally'),
            "transport_preference": data.get('transport_preference', 'mixed')
        }
        
        # Extract and combine data
        combined = extract_trip_details(data['prompt'], quiz)
        if 'error' in combined:
            return jsonify(combined), 400
            
        # Create plan
        plan = create_travel_plan(combined)
        if 'error' in plan:
            return jsonify(plan), 500
            
        # Store with profile metadata
        trip_id = store_travel_plan(
    documents=json.dumps(plan),
    metadata={
        "trip_details": combined.get('trip_details', {}),
        "user_profile": combined.get('user_profile', {})
    }
)
        
        return jsonify({
            "trip_id": trip_id,
            "personalized_plan": plan
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def store_travel_plan(documents, metadata):
    """Store the travel plan in ChromaDB."""
    try:
        # Generate a unique trip ID using UUID
        import uuid
        trip_id = f"trip_{uuid.uuid4().hex}"
        
        # Process metadata
        if not isinstance(metadata, dict):
            metadata = {"content": str(metadata)}
            
        # Convert metadata values to strings
        processed_metadata = {k: str(v) for k, v in metadata.items()}
        
        # Store in ChromaDB
        collection.add(
            documents=[documents],
            metadatas=[processed_metadata],
            ids=[trip_id]
        )
        
        # Verify insertion
        result = collection.get(ids=[trip_id])
        return trip_id if result['documents'] else None
        
    except Exception as e:
        print(f"Storage error: {str(e)}")
        return None

# Update the storage call in plan_trip endpoint



def guide_through_plan(trip_id, user_query):
    """Return structured guidance response."""
    try:
        result = collection.get(ids=[trip_id])
        if not result['documents']:
            return {"error": "Travel plan not found"}
        
        travel_plan = result['documents'][0]
        
        guide_prompt = f"""
        Based on this travel plan: {travel_plan}
        Answer query: "{user_query}"
        
        Return JSON response with:
        {{
            "query": "Original user question",
            "answer": {{
                "summary": "Brief direct answer",
                "details": ["List", "of", "key points"],
                "relevant_sections": {{
                    "transportation": ["List", "of", "relevant flights"],
                    "accommodation": ["List", "of", "hotels"],
                    "activities": ["List", "of", "relevant activities"]
                }}
            }},
            "suggestions": {{
                "if_missing_info": ["Alternative", "suggestions"],
                "pro_tips": ["List", "of", "expert recommendations"]
            }},
            "additional_resources": {{
                "links": ["List", "of", "relevant websites"],
                "contact_info": {{
                    "local_emergency": "Phone number",
                    "embassy": "Address/phone"
                }}
            }}
        }}
        """
        
        response = guide_model.generate_content(guide_prompt)
        json_text = response.text.strip()
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', json_text, re.DOTALL)
        if json_match:
            structured_response = json_match.group()
            return json.loads(structured_response)
            
        return {"error": "Failed to structure guidance response"}
    except Exception as e:
        return {"error": str(e)}

# Updated plan_trip endpoint to handle JSON

# Updated guide_trip endpoint
@app.route('/api/guide-trip', methods=['POST'])
def guide_trip():
    try:
        data = request.get_json()
        required = ['trip_id', 'query']
        if not all(k in data for k in required):
            return jsonify({
                "error": f"Missing required fields: {', '.join(required)}"
            }), 400
        
        guidance = guide_through_plan(data['trip_id'], data['query'])
        return jsonify(guidance)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'date': '2025-04-05'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)