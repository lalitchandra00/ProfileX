import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Profile } from './models/Profile.models.js'
import { User } from './models/User.models.js'
import { upload } from './middlewares/multer.middlewares.js'
import { uploadOnCloudinary } from './utils/cloudinary.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// AI coded this part
app.post('/api/home', async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'Not logged in. Please login first.' });
        }

        // upsert: update existing profile or create new one — linked to this user
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { ...profileData, user: userId },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ success: true, data: profile });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


// PDF upload — multer saves file locally, then uploads to Cloudinary, URL stored in Profile
app.post('/api/upload-pdf', upload.single('resumePdf'), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'Not logged in. Please login first.' });
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No PDF file uploaded.' });
        }

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryResponse) {
            return res.json({ success: false, message: 'Failed to upload PDF to Cloudinary.' });
        }

        // Save URL into the Profile document
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { resumePdfUrl: cloudinaryResponse.url, user: userId },
            { new: true, upsert: true }
        );

        res.json({ success: true, pdfUrl: cloudinaryResponse.url, data: profile });
    } catch (error) {
        console.error('PDF upload error:', error);
        res.json({ success: false, message: error.message });
    }
});


app.get('/api/profile', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.json({ success: false, message: 'Not logged in.' });
        }

        const profile = await Profile.findOne({ user: userId });
        res.json({ success: true, data: profile });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});
// Till here


app.post('/api/signup', async (req, res) => {

    try {
        const { email, username } = req.body;
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existedUser) {
            return res.json({
                success: false,
                message: "Username or Email already exists",
            });
        }

        const newUser = await User.create(req.body);
        res.json({ success: true, data: newUser });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "No record existed",
            });
        }

        const isValid = await user.isPasswordCorrect(password);
        if (!isValid) {
            return res.json({
                success: false,
                message: "The password is incorrect",
            });
        }

        return res.json({
            success: true,
            message: "Success",
            userId: user._id,
            username: user.username,
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

export { app }


