import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req,res)=>{
    const {page} = req.query;

    try{
        const LIMIT = 6;
        const startIndex = (Number(page)-1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data:posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});       // giving back the responce to client
    }catch(error){
        res.status(404).json({Message: error.message});
    }
}
export const getPostsBySearch = async (req,res)=>{
    const {searchQuery, tags} = req.query;
    console.log("search:", searchQuery);
    console.log("tags:", tags);
    try{
        const title = new RegExp(searchQuery, 'i'); //tags // Tags // TAGS
        // const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags} } ] });
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ] });

        
        res.json({data:posts});
    }catch(error){
       res.status(404).json({message: error.message})
    }
}
export const getPost = async(req,res) => {
    const {id} = req.params;

    try{
        const post= await PostMessage.findById(id);
        res.status(200).json(post);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}
export const createPosts = async (req,res)=>{
    const post = req.body; // Extract the post data from the request body
    const newPost = new PostMessage({...post, creator : req.userId, createdAt : new Date().toISOString()}); // Create a new PostMessage instance using the extracted data="Post"
    try{
        await newPost.save();
        res.status(201).json(newPost);
    }catch(error){
        res.status(409).json({message: error.message});
    }
}

//    /posts/123
export const updatePosts = async(req,res)=>{
    // const _id = req.params.id;
    //           OR            //
    const {id: _id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    

    const UpdatedPost = await PostMessage.findByIdAndUpdate(_id, {...post , _id}, { new: true });


    res.json(UpdatedPost);  // giving back the updated responce to client
}

export const deletePost = async(req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id: ${id}`);

    await PostMessage.findByIdAndRemove(id);
    console.log('Delete!');
    res.json({message: "Post deleted successfully"});

}

export const likePost = async(req, res)=>{
    const {id} = req.params;
    if(!req.userId) return res.json({message:"Unauthenticated"});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id: ${id}`);

    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id)=>id === String(req.userId));

    if(index === -1){
        // like the post
        post.likes.push(req.userId);
    }
    else{
        //unlike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true});

    res.json(updatedPost)
}

export const commentPost = async(req,res)=>{
    const {id} = req.params;
    const {value} = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true});

    res.json(updatedPost);
}

