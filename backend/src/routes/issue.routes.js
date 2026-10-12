import {Router} from 'express'
import { createIssue, getIssue, getSingleIssue } from '../controllers/issue.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { createIssueValidator } from '../validators/issue.validator.js';


const router = Router()


router.post('/create', protect, createIssueValidator, createIssue)

router.get('/get-issue', protect, getIssue)


router.get('/issues/:id', protect, getSingleIssue)

export default router