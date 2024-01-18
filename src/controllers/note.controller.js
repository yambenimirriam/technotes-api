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
  return res.status(200).json({ message: 'Note updated successfully' });
};
/******* DELETE NOTE *******/
export const deleteNote = async (req, res) => {
  return res.status(200).json({ message: 'Note deleted' });
};
