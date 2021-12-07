import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

class CreateNote extends StatefulWidget {
  final Client client;
  final String apiUrl;
  const CreateNote({Key? key, required this.client, required this.apiUrl}) : super(key: key);

  @override
  _CreateNoteState createState() => _CreateNoteState();
}

class _CreateNoteState extends State<CreateNote> {
  // Text editor for noteDescription
  TextEditingController controller = TextEditingController();

  // Method for post request
  void _createNote(String noteDescription) async {
    await widget.client.post(
      Uri.parse(widget.apiUrl + '/notes'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(<String, String>{'noteDescription': noteDescription}),
    );
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New'),
      ),
      body: Container(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            TextField(controller: controller, maxLines: 10),
            ElevatedButton(
              onPressed: () {
                _createNote(controller.text);
                Navigator.pop(context);
              },
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
  }
}
