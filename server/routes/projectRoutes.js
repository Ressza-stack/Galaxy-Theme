const express = require('express');
const { body, param } = require('express-validator');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
router.get('/', getProjects);
router.get('/:id', [param('id').isMongoId()], validate, getProject);

const projectValidator = [
  body('title').isString().trim().notEmpty(),
  body('description').isString().notEmpty(),
  body('tech').optional().isArray(),
  body('imageUrl').optional().isString(),
  body('liveUrl').optional().isString(),
  body('sourceUrl').optional().isString(),
  body('featured').optional().isBoolean(),
  body('order').optional().isNumeric()
];

router.post('/', requireAuth, projectValidator, validate, createProject);
router.put('/:id', requireAuth, [param('id').isMongoId(), ...projectValidator], validate, updateProject);
router.delete('/:id', requireAuth, [param('id').isMongoId()], validate, deleteProject);
module.exports = router;
