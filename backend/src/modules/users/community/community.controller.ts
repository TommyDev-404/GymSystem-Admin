import { Request, Response } from "express";
import * as service from "./community.service";


export const getCommentsController = async(req:Request, res:Response)=>{
	try {
		const comments = await service.getCommentsService(Number(req.params.postId));

		res.status(200).json(comments);
	} catch (error: any) {
		console.log(error);

		res.status(500).json({ message:error.message });
	}
};

export const getUserPostsController = async (req: Request, res: Response) => {
	try {
		const posts = await service.getMyPostsService(Number(req.params.member_id));

		res.status(200).json(posts);
	} catch(error:any){
		console.log(error);

		res.status(500).json({ message:error.message });
	}
};

export const getCommunityPostsController = async (req: Request, res: Response)=>{
	try {
		const posts = await service.getCommunityPostsService(Number(req.params.member_id));

		res.status(200).json(posts);
	} catch(error:any){
		console.log(error);
		
		res.status(500).json({
			message:error.message
		});

	}

};

export const createPostController = async (req: Request, res: Response) => {
	try {
		const memberId = Number(req.params.member_id);
		const { content } = req.body;
		const files = (req.files as Express.Multer.File[]) || [];

		const result = await service.createPostService(memberId, content, files);

		res.status(201).json(result);
	} catch (error: any) {
		console.log(error);
		
		res.status(500).json({ message: error.message });
	}
};

export const toggleLikeController = async(req:Request, res:Response)=>{
	try {
		const memberId = Number(req.params.member_id);
		const postId = Number(req.params.postId);

		const result = await service.toggleLikeService(memberId, postId);

		res.status(200).json(result);
	} catch(error:any){
		console.log(error);

		res.status(500).json({ message:error.message });
	}
};

export const addCommentController = async(req:Request, res:Response)=>{
	try {
		const memberId = Number(req.params.member_id);
		const postId = Number(req.params.postId);
		const { comment } = req.body;

		const result = await service.createCommentService(postId, memberId, comment);

		res.status(201).json(result);
	} catch(error:any){
		console.log(error);

		res.status(500).json({
			message:error.message
		});
	}
};



// DELETE POST
/*
export const deletePostController = async(
	req:Request,
	res:Response
)=>{

	try {

		const memberId = req.user.memberId;

		const postId = Number(req.params.id);


		const result =
			await deletePostService(
					memberId,
					postId
			);


		res.status(200).json(result);


	} catch(error:any){

		res.status(500).json({
			message:error.message
		});

	}

};
*/
