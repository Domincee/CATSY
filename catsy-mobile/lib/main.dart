import 'package:flutter/material.dart';
import 'services/api_service.dart';

void main() => runApp(const CatsyMobile());

class CatsyMobile extends StatelessWidget {
  const CatsyMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.brown),
      home: const StatusPage(),
    );
  }
}

class StatusPage extends StatefulWidget {
  const StatusPage({super.key});

  @override
  State<StatusPage> createState() => _StatusPageState();
}

class _StatusPageState extends State<StatusPage> {
  Map<String, dynamic>? result;
  bool loading = true;

  void runCheck() async {
    setState(() => loading = true);
    final data = await ApiService.checkSystem();
    setState(() {
      result = data;
      loading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    runCheck();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Catsy System Status")),
      body: Center(
        child: loading 
          ? const CircularProgressIndicator()
          : Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  result?['status'] == "📡 Supabase Connected!" ? Icons.check_circle : Icons.error,
                  color: result?['status'] == "📡 Supabase Connected!" ? Colors.green : Colors.red,
                  size: 100,
                ),
                const SizedBox(height: 20),
                Text(result?['status'] ?? "Unknown State", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text("Database Count: ${result?['count'] ?? 0}"),
                const Divider(indent: 50, endIndent: 50, height: 40),
                const Text("Last Item Found:", style: TextStyle(fontWeight: FontWeight.bold)),
                Text(result?['data_preview']?[0]?['product_name'] ?? "None"),
                const SizedBox(height: 30),
                ElevatedButton(onPressed: runCheck, child: const Text("Refresh Connection")),
              ],
            ),
      ),
    );
  }
}