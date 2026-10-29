from flask import Flask, jsonify, request
from data_service import fetch_sightings, filter_sightings, count_sightings, count_by_species, count_by_location, count_by_month
from database import save_sighting
from flask_cors import CORS
import requests
import sqlite3

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})


@app.route("/api/sightings", methods=["GET"])
def get_sightings():
    try:
        sightings = fetch_sightings()
        location = request.args.get("location")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        sightings = filter_sightings(sightings, location, start_date, end_date)
        return jsonify(sightings), 200

    except requests.RequestException:
        return jsonify({
            "error": "Unable to retrieve sightings from Elanco"
        }), 502

    except ValueError:
        return jsonify({
            "error": "Elanco returned data in an unexpected format"
        }), 502

@app.route("/api/statistics", methods=["GET"])
def det_statistics():
    try:
        sightings = fetch_sightings()
        stat_type = request.args.get("type")
        if stat_type == "total":
            data = count_sightings(sightings) 
        elif stat_type == "location":
            data = count_by_location(sightings)
        elif stat_type == "species":
            data = count_by_species(sightings)
        elif stat_type == "month":
            data = count_by_month(sightings)
        else :
            return jsonify({
                "error": "Invalid statistic type"
            }), 400

        return jsonify(data), 200
        
    except requests.RequestException:
            return jsonify({
                "error": "Unable to retrieve sightings from Elanco"
            }), 502
    
    except ValueError:
        return jsonify({
            "error": "Elanco returned data in an unexpected format"
        }), 50

@app.route("/api/reports", methods=["POST"])
def submit_sighting():
            report = request.get_json()
            if report is None :
                return jsonify({
                    "error": "Bad request"
                }), 400
            if isinstance(report, dict):
                if "species" in report and "date" in report and "location" in report :
                    if not isinstance(report["species"], str) or not isinstance(report["location"], str) or not isinstance(report["date"], str) :
                            return jsonify({
                                "error":"Bad Request"
                            }), 400
                    if report["species"].strip() == "" or report["date"].strip() == "" or report["location"].strip() == "":
                            return jsonify({
                                "error":"Bad Request"
                            }), 400
                    
                    #After all validation save data
                    try :
                        save_sighting(report["species"], report["date"], report["location"])
                        return jsonify({
                            "message":"Report saved successfully"
                        }), 201
                    except sqlite3.Error :
                        return jsonify({
                            "error": "Internal server error"
                        }), 500
                else :
                    return jsonify({
                        "error":"Bad Request"
                    }), 400
            else :
                    return jsonify({
                        "error":"Bad Request"
                    }), 400
        
        
    
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
