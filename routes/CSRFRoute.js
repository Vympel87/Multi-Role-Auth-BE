import express from 'express';
import csurf from 'csurf';

const router = express.Router();
const csrfProtection = csurf({ cookie: true });

router.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;