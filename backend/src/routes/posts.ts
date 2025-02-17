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
  removeTag,
} from '../controllers/postsController';
import cacheRequests from '../middlewares/cacheRequests';

const postRouter = new Hono();

postRouter.post('/create', isAuthenticated, create);
postRouter.post('/:postId/tags/:tagId', isAuthenticated, addTag);
postRouter.delete('/:postId/tags/:tagId', isAuthenticated, removeTag);
postRouter.patch('/update/:id', isAuthenticated, update);
postRouter.delete('/delete/:id', isAuthenticated, deleteUserPost);
postRouter.get('/me', isAuthenticated, getAllOwnerPosts);
postRouter.get('/', cacheRequests('posts'), getAllPublicPosts);
postRouter.get('/:id', getPostDetails);

export default postRouter;
