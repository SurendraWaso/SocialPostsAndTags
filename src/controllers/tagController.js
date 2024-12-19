const tagModel  =   require('../models/tags');

/**
 * Creates new post with Title, Description, Tags and Image in base64 format
 * @param {Object} req
 * @param {Object} req  {name}
 * @param {Object} res 
 * @returns {Object} 400 - Bad request (missing mandatory fields).
 * @returns {Object} 500 - Internal server error.
 * @returns {Object} 200 - Success response after saving the tag
 */

let addNewTag   =   async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) return res.status(400).json({ message: 'Tag name is required.' });
  
      const existingTag = await tagModel.findOne({ name });
      if (existingTag) return res.status(400).json({ message: 'Tag already exists.' });
  
      const tag = new tagModel({ name });
      await tag.save();
  
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }

  module.exports    =   {
    addNewTag
  }