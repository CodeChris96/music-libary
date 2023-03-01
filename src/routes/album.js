const express = require('express');
const albumsController = require('../controllers/albums');

const router = express.Router({ mergeParams: true });

router.get('/', albumsController.getAllAlbums);
router.get('/:id', albumsController.getAlbumById);
router.patch('/:id', albumsController.updateAlbum);
router.delete('/:id', albumsController.deleteAlbum);

module.exports = router;
