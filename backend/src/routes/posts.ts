import { Hono } from 'hono';
import isAuthenticated from '../middlewares/isAuthenticated';
import {
  create,
  deleteUserPost,
  getAllOwnerPosts,
  getAllPublicPosts,
  getPostDetails,
  update,
  addTag,
} from '../controllers/postsController';

const postRouter = new Hono();

postRouter.post('/create', isAuthenticated, create);
postRouter.post('/:postId/tags/:tagId', isAuthenticated, addTag);
postRouter.patch('/update/:id', isAuthenticated, update);
postRouter.delete('/delete/:id', isAuthenticated, deleteUserPost);
postRouter.get('/me', isAuthenticated, getAllOwnerPosts);
postRouter.get('/', getAllPublicPosts);
postRouter.get('/:id', getPostDetails);

export default postRouter;
