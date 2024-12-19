
let tagModel    =   require('../models/tags');
let postModel   =   require('../models/posts');

/**
 * Creates new post with Title, Description, Tags and Image in base64 format
 * @param {Object} req
 * @param {Object} req  {postTitle, postDesc, tags, image}
 * @param {Object} res 
 * @returns {Object} 400 - Bad request (missing mandatory fields).
 * @returns {Object} 500 - Internal server error.
 * @returns {Object} 200 - Success response after saving the post
 */

let addNewPost  =   async (req, res) => {
    try {
        console.log("req - ",req.body)
      let { postTitle, postDesc, tags } = req.body;
  
      if (!postTitle || !postDesc) {
        return res.status(400).json({ message: 'postTitle and postDesc are mandatory.' });
      }
  
      let tagIds = [];
      tags  =   tags.split(",")
      if (tags && tags.length > 0) {
        tagIds = await Promise.all(
          tags.map(async (tagName) => {
            let tag = await tagModel.findOne({ name: tagName });
            if (!tag) tag = await tagModel.create({ name: tagName });
            return tag._id;
          })
        );
      }
      let base64ImageString    =   "";
      if(req.file){
        let base64Image = req.file.buffer.toString('base64');
        let mimeType  =   req.file.mimetype; //ToDo: Add Validation to accept only images

        base64ImageString    =   `data:${mimeType};base64,${base64Image}`;
      }
  
      const post = new postModel({
        postTitle,
        postDesc,
        image:base64ImageString,
        tags: tagIds,
        user:req.user._id
      });
  
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }

/**
 * To get the list of posts with optional filters, sorting, and pagination.
 *
 * @param {Object} req
 * @param {Object} req.query - Query parameters for filtering.
 * 
 * @param {Object} res 
 * @returns {Object} 400 - Bad request (Invalid query parameters).
 * @returns {Object} 500 - Internal server error.
 * @returns {Object[]} posts - The list of posts.
 * @returns {Object} 200 - Success response with a list of posts.
 */  
let getPosts    =  async (req, res) => {
    try {
      const { sort = 1, pageNo = 1, perPage = 10, keyword, tag, ...extraData } = req.query;
        let totalSkips = (pageNo - 1) * perPage;
        let totalPages, prevPage, nextPage = 0;
        
      if (Object.keys(extraData).length > 0) {
        return res.status(400).json({ message: 'Invalid query parameters.' });
      }
  
      const query = {};
      if (keyword) {
        query.$or = [
          { postTitle: { $regex: keyword, $options: 'i' } },
          { postDesc: { $regex: keyword, $options: 'i' } },
        ];
      }
  
      if (tag) {
        const tagDoc = await postModel.findOne({ name: tag });
        if (tagDoc) query.tags = tagDoc._id;
      }
  
      const posts = await postModel.find(query)
        .populate('tags', 'name')
        .populate('user', 'name username')
        .sort({createdAt:Number(sort)})
        .skip(Number(totalSkips))
        .limit(Number(perPage));
  
      const totalPosts = await postModel.countDocuments(query);
      totalPages = Math.ceil(totalPosts / perPage);
      prevPage = pageNo - 1;
      if (totalPages >= Number(pageNo) + 1) nextPage = Number(pageNo) + 1;
      res.status(200).json({ totalPosts, totalPages,prevPage,nextPage,perPage, posts });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }

  /**
 * To get the post details by id of post.
 *
 * @param {Object} req
 * @param {Object} req.params - Query parameters for post details.
 * 
 * @param {Object} res 
 * @returns {Object} 500 - Internal server error.
 * @returns {Object} 200 - Success response with a details of posts.
 */ 
 let getPostDetails =    async (req, res) => {
    try {
      const { postId } = req.params;
  
      const postDetails = await postModel.find({_id:postId})
        .populate('tags', 'name')
        
        res.status(200).json({ postDetails });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error.', error });
    }
  }


  module.exports    =   {
    addNewPost,
    getPosts,
    getPostDetails
  }