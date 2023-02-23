const { query } = require('express');
const db = require('../db/index');

const createArtist = async (req, res) => {
  const { name, genre } = req.body;

  try {
    const {
      rows: [artist],
    } = await db.query(
      'INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *',
      [name, genre]
    );
    res.status(201).json(artist);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create artist' });
  }
};

const getAllArtists = async (_, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Artists ORDER by id ASC');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [artist],
    } = await db.query('SELECT * FROM Artists WHERE id = $1', [id]);

    if (!artist) {
      return res.status(404).json({
        message: `The artist ID: ${id} does not exist`,
      });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateArtist = async (req, res) => {
  const { id } = req.params;
  const { name, genre } = req.body;

  let query, params;

  if (name && genre) {
    query = `UPDATE Artists SET name = $1, genre = $2 WHERE id = $3 RETURNING *`;
    params = [name, genre, id];
  } else if (name) {
    query = `UPDATE Artists SET name = $1 WHERE id = $2 RETURNING *`;
    params = [name, id];
  } else if (genre) {
    query = `UPDATE Artists SET genre = $1 WHERE id = $2 RETURNING *`;
    params = [genre, id];
  }
  try {
    const {
      rows: [artist],
    } = await db.query(query, params);

    if (!artist) {
      return res.status(404).json({ message: `Artist ${id} does not exist` });
    }
    res.status(200).json(artist);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM Artists WHERE id = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: `The artist ID: ${id} does not exist`,
      });
    }

    const deletedArtist = rows[0];
    res.status(200).json(deletedArtist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
