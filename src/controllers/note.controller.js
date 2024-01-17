/******* CREATE NEW NOTE *******/
export const createNote = async (req, res) => {
  return res.status(201).json({ message: 'New note created' });
};

/******* GET ALL NOTES *******/
export const getAllNotes = async (req, res) => {
  return res.status(200).json({ message: 'Notes' });
};

/******* UPDATE NOTE *******/
export const updateNote = async (req, res) => {
  return res.status(200).json({ message: 'Note updated successfully' });
};
/******* DELETE NOTE *******/
export const deleteNote = async (req, res) => {
  return res.status(200).json({ message: 'Note deleted' });
};
