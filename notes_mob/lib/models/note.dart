class Note {
  final int id;
  final String noteDescription;

  Note({required this.id, required this.noteDescription});

  // Convert map to json
  factory Note.fromJson(Map<String, dynamic> json) {
    return Note(
      id: json['id'],
      noteDescription: json['noteDescription'],
    );
  }

  // Convert json to map
  factory Note.fromMap(Map<String, dynamic> map) {
    return Note(
      id: map['id'],
      noteDescription: map['noteDescription'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'noteDescription': noteDescription,
    };
  }
}
