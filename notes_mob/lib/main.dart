import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:http/http.dart' as http;
import 'package:notes_mob/create.dart';
import 'package:notes_mob/models/note.dart';
import 'package:notes_mob/update.dart';

void main() {
  runApp(const MaterialApp(
    title: 'CRUD Note',
    home: MyApp(),
  ));
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  _MyAppState createState() {
    return _MyAppState();
  }
}

class _MyAppState extends State<MyApp> {
  String apiUrl = "http://rds-nodes-api.herokuapp.com/api";
  Client client = http.Client();
  List<Note> notes = [];

  @override
  void initState() {
    _retrieveNotes();
    super.initState();
  }

  _retrieveNotes() async {
    notes = [];
    List res = json.decode((await client.get(Uri.parse('$apiUrl/notes'))).body);

    for (var element in res) {
      notes.add(Note.fromMap(element));
    }

    setState(() {});
  }

  void _deleteNote(int id) async {
    await client.delete(Uri.parse('$apiUrl/notes/$id'));
    _retrieveNotes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('List Notes'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          _retrieveNotes();
        },
        child: ListView.builder(
          itemCount: notes.length,
          itemBuilder: (BuildContext context, int index) {
            return Card(
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const UpdateNote()),
                  );
                },
                child: ListTile(
                  title: Text(notes[index].noteDescription),
                  onTap: () {},
                  trailing: IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () => _deleteNote(notes[index].id),
                  ),
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const CreateNote()),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
