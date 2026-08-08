import { prisma } from "../../../lib/prisma";
import { uploadImageToSupabase } from "../../admin/tutorials/tutorials.service";

export const createPostService = async (
    memberId: number,
    content: string,
    files: Express.Multer.File[]
) => {

    // Upload all images first
    const urls = await Promise.all(
        files.map(file => uploadImageToSupabase(file))
    );

    const post = await prisma.$transaction(async (tx) => {
        // Create the post
        const createdPost = await tx.posts.create({
            data: {
                member_id: memberId,
                content
            }
        });

        // Insert all images
        if (urls.length > 0) {
            await tx.post_images.createMany({
                data: urls.map(url => ({
                    post_id: createdPost.id,
                    image_url: url
                }))
            });
        }

        return createdPost;
    });

    return { 
        success: true,
        message: "Post created successfully"
    };
};

export const getCommunityPostsService = async (member_id: number) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      created_at: "desc",
    },

    include: {
      members: {
        select: {
          id: true,
          fullname: true,
        },
      },

      post_images: {
        select: {
          image_url: true,
        },
      },

      post_likes: {
        where: {
          member_id,
        },
        select: {
          id: true,
        },
      },

      _count: {
        select: {
          post_likes: true,
          post_comments: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    author: post.members.fullname,
    content: post.content,
    images: post.post_images.map((image) => image.image_url),
    like: post._count.post_likes,
    comment: post._count.post_comments,
    liked: post.post_likes.length > 0,
    date: post.created_at,
  }));
};

export const toggleLikeService = async (
  member_id: number,
  post_id: number
) => {

  return await prisma.$transaction(async (tx) => {

    console.log(`Toggling like for post ${post_id} by member ${member_id}`);
    const existingLike = await tx.post_likes.findUnique({
      where: {
        post_id_member_id: {
          post_id,
          member_id
        }
      }
    });

    // REMOVE LIKE
    if (existingLike) {

      await tx.post_likes.delete({
        where:{
          id: existingLike.id
        }
      });


      const count = await tx.post_likes.count({
        where:{
          post_id
        }
      });


      return {
        liked:false,
        likes:count
      };
    }

    await tx.post_likes.create({
      data: {
        post_id,
        member_id
      }
    });
    
    const count = await tx.post_likes.count({
      where:{
        post_id
      }
    });

    return {
      liked:true,
      likes:count
    };

  });

};

export const createCommentService = async (
  post_id:number,
  member_id:number,
  comment:string
)=>{

  console.log(`Creating comment for post ${post_id} by member ${member_id}: ${comment}`);
  const newComment = await prisma.post_comments.create({

    data:{
      post_id,
      member_id,
      comment
    },


    include:{
      members:{
        select:{
          id:true,
          fullname:true
        }
      }
    }

  });



  return newComment;

};

export const getCommentsService = async (postId: number) => {
  const comments = await prisma.post_comments.findMany({
      where:{
          post_id: postId,
      },

      orderBy:{
          created_at:"asc",
      },

      include:{
          members:{
              select:{
                  id:true,
                  fullname:true,
              },
          },
      },

  });

  if (!comments) throw new Error("No comments yet.");

  return comments.map((comment)=>({
      id: comment.id,
      author: comment.members.fullname,
      member_id: comment.member_id,
      comment: comment.comment,
      date: comment.created_at,
  }));

};

export const getMyPostsService = async (member_id: number) => {
  const [
    posts,
    totalPosts,
    totalLikes,
    totalComments,
  ] = await Promise.all([

    prisma.posts.findMany({
      where: {
        member_id,
      },

      orderBy: {
        created_at: "desc",
      },

      include: {

        members: {
          select: {
            id: true,
            fullname: true,
          },
        },

        post_images: {
          select: {
            image_url: true,
          },
        },

        post_likes: {
          where: {
            member_id,
          },
          select: {
            id: true,
          },
        },

        _count: {
          select: {
            post_likes: true,
            post_comments: true,
          },
        },

      },

    }),

    prisma.posts.count({
      where:{
        member_id,
      },
    }),


    prisma.post_likes.count({
      where:{
        posts:{
          member_id,
        },
      },
    }),


    prisma.post_comments.count({
      where:{
        posts:{
          member_id,
        },
      },
    }),

  ]);


  return {
    stats:{
      totalPosts,
      totalLikes,
      totalComments,
    },

    posts: posts.map((post)=>({
      id: post.id,
      author: post.members.fullname,
      content: post.content,
      images: post.post_images.map(
        image=>image.image_url
      ),
      like: post._count.post_likes,
      liked: post.post_likes.length > 0,
      comment: post._count.post_comments,
      date: post.created_at,
    })),
  };

};