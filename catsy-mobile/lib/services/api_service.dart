import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart'; // To check if we are on Web

class ApiService {
  // If running on Web (Chrome), use localhost. 
  // If Android Emulator, use 10.0.2.2.
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8000';
    return 'http://10.0.2.2:8000';
  }

  static Future<Map<String, dynamic>> checkSystem() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/db-check'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {"status": "Error", "message": "Server error: ${response.statusCode}"};
    } catch (e) {
      return {"status": "Offline", "message": "Connection failed. Is the API running?"};
    }
  }
}