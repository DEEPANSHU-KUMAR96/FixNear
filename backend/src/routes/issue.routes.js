import { Router } from 'express';
import { 
    createIssue, 
    deleteIssue, 
    getAllIssues, 
    getIssue, 
    getSingleIssue, 
    searchIssues, 
    updateIssue, 
    updateIssueStatus,
    toggleUpvoteIssue
} from '../controllers/issue.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { parseIssueImage } from '../middlewares/issue-image.middleware.js';
import { createIssueValidator } from '../validators/issue.validator.js';

const router = Router();

router.post('/create', protect, parseIssueImage, createIssueValidator, createIssue);

router.get('/all', getAllIssues);

router.get('/get-issue', protect, getIssue);

router.get('/my', protect, searchIssues);

router.get('/:id', getSingleIssue);

router.patch('/:id', protect, parseIssueImage, updateIssue);

router.delete('/:id', protect, deleteIssue);

router.patch('/:id/status', protect, updateIssueStatus);

router.post('/:id/upvote', protect, toggleUpvoteIssue);
router.patch('/:id/upvote', protect, toggleUpvoteIssue);

export default router;
