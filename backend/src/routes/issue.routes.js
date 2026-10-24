import {Router} from 'express'
import { createIssue, deleteIssue, getIssue, getSingleIssue, searchIssues, updateIssue, updateIssueStatus } from '../controllers/issue.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { createIssueValidator } from '../validators/issue.validator.js';


const router = Router()


router.post('/create', protect, createIssueValidator, createIssue)

router.get('/get-issue', protect, getIssue)

router.get('/my', protect, searchIssues)

router.get('/:id', protect, getSingleIssue)

router.patch('/:id', protect, updateIssue)

router.delete('/:id', protect, deleteIssue)

router.patch("/:id/status",updateIssueStatus)


export default router