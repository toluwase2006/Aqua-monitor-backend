const DataEntry = require('../models/dataentry.model');

// Create a new data entry
const createDataEntry = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found in token' });
  }

  const {
    year,
    month,
    fishStock = {},
    finance = {},
    foodUsage = {},
    userId: bodyUserId,
    owner: bodyOwner,
  } = req.body;

  if (year == null || month == null || !foodUsage) {
    return res.status(400).json({ message: 'year, month and foodUsage are required' });
  }

  try {
    const entry = new DataEntry({
      year,
      month,
      fishStock,
      finance,
      foodUsage,
      userId: bodyUserId || userId,
      owner: bodyOwner || userId,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all data entries for current user, with optional year/month filter
const getAllDataEntries = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found in token' });
  }

  const { year, month, limit = 50, skip = 0 } = req.query;
  const filter = { owner: userId };
  if (year) filter.year = Number(year);
  if (month) filter.month = month;

  try {
    const entries = await DataEntry.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(200, Number(limit)));

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get one data entry by id
const getDataEntryById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found in token' });
  }

  try {
    const entry = await DataEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    if (entry.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: not your entry' });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update entry by id
const updateDataEntryById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const update = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found in token' });
  }

  delete update.owner;
  delete update.userId;

  try {
    const entry = await DataEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    if (entry.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: not your entry' });
    }

    Object.assign(entry, update);
    await entry.save();

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete entry by id
const deleteDataEntryById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found in token' });
  }

  try {
    const entry = await DataEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    if (entry.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: not your entry' });
    }

    await entry.deleteOne();
    res.status(200).json({ message: 'Data entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDataEntry,
  getAllDataEntries,
  getDataEntryById,
  updateDataEntryById,
  deleteDataEntryById,
};
