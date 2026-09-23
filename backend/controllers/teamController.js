const db = require('../config/db');
const crypto = require('crypto');

/**
 * Get all team members
 * GET /team or /api/team (Public)
 */
const getAllTeamMembers = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        id AS "_id",
        name,
        role,
        badge,
        image,
        expertise,
        email,
        order_num AS "orderNum",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM team_members
      ORDER BY order_num ASC, created_at ASC
    `;
    const result = await db.query(queryText);
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};

/**
 * Create a new team member
 * POST /team (Protected, Admin, Multer)
 */
const createTeamMember = async (req, res) => {
  try {
    const { name, role, badge, expertise, email, orderNum } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    if (!image) {
      return res.status(400).json({ error: 'Portrait image file or image URL is required.' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Scientist / Team member name is required.' });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ error: 'Role / Designation is required.' });
    }
    if (!expertise || !expertise.trim()) {
      return res.status(400).json({ error: 'Research focus / Expertise is required.' });
    }

    const id = crypto.randomBytes(12).toString('hex');
    const parsedOrder = parseInt(orderNum, 10) || 0;

    const queryText = `
      INSERT INTO team_members (id, name, role, badge, image, expertise, email, order_num)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id AS "_id", 
        name, 
        role, 
        badge, 
        image, 
        expertise, 
        email, 
        order_num AS "orderNum", 
        created_at AS "createdAt"
    `;

    const result = await db.query(queryText, [
      id,
      name.trim(),
      role.trim(),
      badge ? badge.trim() : null,
      image.trim(),
      expertise.trim(),
      email ? email.trim() : null,
      parsedOrder,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /team:', err);
    res.status(500).json({ error: err.message || 'Failed to create team member' });
  }
};

/**
 * Update an existing team member
 * PUT /team/:id (Protected, Admin, Multer)
 */
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, badge, expertise, email, orderNum } = req.body;

    const findResult = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const currentMember = findResult.rows[0];
    const newImage = req.file ? req.file.path : (req.body.image || currentMember.image);
    const newName = name !== undefined ? name.trim() : currentMember.name;
    const newRole = role !== undefined ? role.trim() : currentMember.role;
    const newBadge = badge !== undefined ? badge.trim() : currentMember.badge;
    const newExpertise = expertise !== undefined ? expertise.trim() : currentMember.expertise;
    const newEmail = email !== undefined ? email.trim() : currentMember.email;
    const newOrder = orderNum !== undefined ? (parseInt(orderNum, 10) || 0) : currentMember.order_num;

    const updateQuery = `
      UPDATE team_members
      SET name = $1, role = $2, badge = $3, image = $4, expertise = $5, email = $6, order_num = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING 
        id AS "_id", 
        name, 
        role, 
        badge, 
        image, 
        expertise, 
        email, 
        order_num AS "orderNum", 
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await db.query(updateQuery, [
      newName,
      newRole,
      newBadge,
      newImage,
      newExpertise,
      newEmail,
      newOrder,
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /team/:id:', err);
    res.status(500).json({ error: err.message || 'Failed to update team member' });
  }
};

/**
 * Delete a team member
 * DELETE /team/:id (Protected, Admin)
 */
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM team_members WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully', id });
  } catch (err) {
    console.error('Error in DELETE /team/:id:', err);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
};

module.exports = {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
