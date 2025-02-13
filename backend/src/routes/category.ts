import { Hono } from 'hono';
import {
  create,
  updateUserCategory,
  getAllOwnerCategories,
  getAllPublicCategories,
  deleteUserCategory,
  getCategoryDetails,
} from '../controllers/categoryController';
import isAuthenticated from '../middlewares/isAuthenticated';

const categoryRouter = new Hono();

categoryRouter.post('/create', isAuthenticated, create);
categoryRouter.patch('/update/:id', isAuthenticated, updateUserCategory);
categoryRouter.delete('/delete/:id', isAuthenticated, deleteUserCategory);
categoryRouter.get('/me', isAuthenticated, getAllOwnerCategories);
categoryRouter.get('/', getAllPublicCategories);
categoryRouter.get('/:id', getCategoryDetails);

export default categoryRouter;
