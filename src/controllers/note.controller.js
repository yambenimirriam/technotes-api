import Note from '../models/Note.js';
import User from '../models/User.js';

/******* CREATE NEW NOTE *******/
export const createNote = async (req, res) => {
  const { title, text } = req.body;

  // Check for duplicate title
  const note = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (note) {
    return res.status(409).json({ message: 'Note title already exists' });
  }

  // Create and store the new user
  const newNote = await Note.create({ userId: req.user.id, title, text });

  if (!newNote) {
    return res.status(400).json({ message: 'Invalid note data received' });
  }

  return res.status(201).json({ message: 'New note created' });
};

/******* GET ALL NOTES *******/
export const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();

  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.userId).lean().exec();
      return { ...note, username: user.username };
    })
  );

  return res.status(200).json(notesWithUser);
};

/******* UPDATE NOTE *******/
export const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, text, completed } = req.body;

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  note.user = req.user.id;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  if (!updatedNote) {
    return res.status(400).json({ message: 'Invalid note data received' });
  }

  return res.status(200).json({ message: 'Note updated successfully' });
};
/******* DELETE NOTE *******/
export const deleteNote = async (req, res) => {
  const id = req.params.id;

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const result = await note.deleteOne();
  if (!result) {
    return res.status(400).json({ message: 'Error ocuured' });
  }

  return res.status(200).json({ message: 'Note deleted' });
};
