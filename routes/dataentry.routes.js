const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  createDataEntry,
  getAllDataEntries,
  getDataEntryById,
  updateDataEntryById,
  deleteDataEntryById,
} = require('../controllers/dataentry.controller');

router.post('/', auth, createDataEntry);
router.get('/', auth, getAllDataEntries);
router.get('/:id', auth, getDataEntryById);
router.put('/:id', auth, updateDataEntryById);
router.delete('/:id', auth, deleteDataEntryById);

module.exports = router;
