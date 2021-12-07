import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

class UpdateNote extends StatefulWidget {
  final int id;
  final String noteDescription;
  final Client client;
  final String apiUrl;
  const UpdateNote({
    Key? key,
    required this.id,
    required this.noteDescription,
    required this.client,
    required this.apiUrl,
  }) : super(key: key);

  @override
  _UpdateNoteState createState() => _UpdateNoteState();
}

class _UpdateNoteState extends State<UpdateNote> {
  // Text editor for noteDescription
  TextEditingController controller = TextEditingController();

  // Method for put request
  void _updateNote(int id, String noteDescription) async {
    await widget.client.put(
      Uri.parse(widget.apiUrl + '/notes/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(<String, String>{'noteDescription': noteDescription}),
    );
  }

  @override
  void initState() {
    // Load text editor before construct the page
    controller.text = widget.noteDescription;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Update'),
      ),
      body: Container(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            TextField(controller: controller, maxLines: 10),
            ElevatedButton(
              onPressed: () {
                _updateNote(widget.id, controller.text);
                Navigator.pop(context);
              },
              child: const Text('Update'),
            ),
          ],
        ),
      ),
    );
  }
}
