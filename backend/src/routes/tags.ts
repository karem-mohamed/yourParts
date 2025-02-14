import { Hono } from 'hono';
import {
  create,
  deleteUserTag,
  getAllOwnerTags,
  getAllPublicTags,
  getTagDetails,
  updateUserTag,
} from '../controllers/tagController';
import isAuthenticated from '../middlewares/isAuthenticated';

const tagRouter = new Hono();

tagRouter.post('/create', isAuthenticated, create);
tagRouter.patch('/update/:id', isAuthenticated, updateUserTag);
tagRouter.delete('/delete/:id', isAuthenticated, deleteUserTag);
tagRouter.get('/me', isAuthenticated, getAllOwnerTags);
tagRouter.get('/', getAllPublicTags);
tagRouter.get('/:id', getTagDetails);

export default tagRouter;
