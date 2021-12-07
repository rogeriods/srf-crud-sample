class Note {
  final int id;
  final String noteDescription;

  // Constructor
  Note({
    required this.id,
    required this.noteDescription,
  });

  // Parser from JSON
  factory Note.fromJson(Map<String, dynamic> json) {
    return Note(
      id: json['id'],
      noteDescription: json['noteDescription'],
    );
  }

  // Parser from Map
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
