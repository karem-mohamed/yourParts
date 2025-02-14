import { Hono } from 'hono';
import isAuthenticated from '../middlewares/isAuthenticated';

import {
  create,
  deleteUserComment,
  getCommentDetails,
  getPostComments,
  update,
} from '../controllers/commentsController';

const commentRouter = new Hono();

commentRouter.post('/create', isAuthenticated, create);
commentRouter.patch('/update/:id', update);
commentRouter.delete('/delete/:id', isAuthenticated, deleteUserComment);
commentRouter.get('/post/:postId', getPostComments);
commentRouter.get('/:id', getCommentDetails);

export default commentRouter;
