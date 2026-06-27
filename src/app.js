import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Profile from './models/Profile.js'
import User from './models/User.js'

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
        const newProfile = await Profile.create(req.body);
        res.json({ success: true, data: newProfile });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});
// Till here


app.post('/api/signup', async (req, res) => {
    try {
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

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "The password is incorrect",
      });
    }

    return res.json({
      success: true,
      message: "Success",
      user,
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


