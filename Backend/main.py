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
guide_model = genai.GenerativeModel('gemini-1.5-pro')

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./travel_plans_db")
embedding_function = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_or_create_collection(
    name="travel_plans",
    embedding_function=embedding_function
)

def extract_trip_details(prompt, quiz_responses):
    """Extract travel details with user profile context."""
    extraction_prompt = f"""
    Combine these user preferences and trip request:
    
    USER PROFILE:
    {json.dumps(quiz_responses, indent=2)}
    
    TRIP REQUEST:
    "{prompt}"
    
    Create a consolidated travel brief with:
    1. Demographic-adjusted suggestions (age: {quiz_responses['age_group']})
    2. Activity focus ({', '.join(quiz_responses['interests'])})
    3. Transportation preferences ({quiz_responses['transport_preference']})
    4. Bucket list integration ({quiz_responses['bucket_list']})
    
    Return JSON format:
    {{
        "trip_details": {{
            "origin": "City",
            "destination": "City",
            "dates": {{
                "start": "YYYY-MM-DD",
                "end": "YYYY-MM-DD",
                "duration_days": "Number"
            }},
            "budget": "Total amount"
        }},
        "user_profile": {{
            "age_group": "{quiz_responses['age_group']}",
            "travel_style": "{quiz_responses['travel_style']}",
            "key_interests": ["list", "of", "prioritized", "interests"],
            "experience_goals": ["list", "from", "bucket", "list"]
        }}
    }}
    """
    
    try:
        response = planning_model.generate_content(extraction_prompt)
        json_text = response.text.strip()
        json_text = re.sub(r'```json\s*|\s*```', '', json_text)
        return json.loads(json_text)
    except Exception as e:
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
                "trip_details": combined['trip_details'],
                "user_profile": combined['user_profile']
            }
        )
        
        return jsonify({
            "trip_id": trip_id,
            "personalized_plan": plan
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def store_travel_plan(trip_details, travel_plan):
    """Store the travel plan in ChromaDB."""
    try:
        # Generate a unique trip ID using UUID to prevent collisions
        import uuid
        trip_id = f"trip_{uuid.uuid4().hex}"
        
        # Handle potential JSON parsing issues
        try:
            metadata = json.loads(trip_details)
        except json.JSONDecodeError:
            # If JSON parsing fails, create a basic metadata structure
            metadata = {
                "error": "Failed to parse trip details",
                "raw_details": trip_details[:500]  # Store first 500 characters
            }
        
        # Validate metadata types for ChromaDB
        if not isinstance(metadata, dict):
            metadata = {"content": str(metadata)}
            
        # Convert all metadata values to strings
        metadata = {k: str(v) for k, v in metadata.items()}
        
        # Store in ChromaDB with error handling
        collection.add(
            documents=[travel_plan],
            metadatas=[metadata],
            ids=[trip_id]
        )
        
        # Verify insertion
        result = collection.get(ids=[trip_id])
        if not result['documents']:
            print(f"Failed to verify storage for trip {trip_id}")
            return None
            
        return trip_id
    except Exception as e:
        print(f"Storage error: {str(e)}")
        return None

# Updated plan_trip endpoint with better error reporting


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
@app.route('/api/plan-trip', methods=['POST'])
def plan_trip():
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "Missing required 'prompt' field"}), 400
        
        trip_details = extract_trip_details(data['prompt'])
        if "error" in trip_details:
            return jsonify(trip_details), 400
            
        travel_plan = create_travel_plan(trip_details)
        if "error" in travel_plan:
            return jsonify(travel_plan), 500
            
        trip_id = store_travel_plan(trip_details, json.dumps(travel_plan))
        if not trip_id:
            return jsonify({
                "error": "Storage failed",
                "details": trip_details,
                "plan_snippet": str(travel_plan)[:200]
            }), 500
            
        return jsonify({
            "trip_id": trip_id,
            "details": json.loads(trip_details),
            "plan": travel_plan
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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