import { Router, Request, Response } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Simulate authentication (replace this with your auth logic)
    if (email === 'test@example.com' && password === 'password123') {
        return res.status(200).json({ message: 'Login successful!' });
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
});

export default router;
