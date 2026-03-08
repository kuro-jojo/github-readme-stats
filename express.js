import "dotenv/config";
import statsCard from "./api/index.js";
import repoCard from "./api/pin.js";
import langCard from "./api/top-langs.js";
import wakatimeCard from "./api/wakatime.js";
import gistCard from "./api/gist.js";
import express from "express";
import cors from "cors"
import admin from "firebase-admin";
import { getAppCheck } from "firebase-admin/app-check";

const app = express();

var corsOptions = {
  origin: process.env.ORIGINS.split(','),
  allowedHeaders: ['X-Firebase-AppCheck'],
}

app.use(cors(corsOptions))

// Add firebase
admin.initializeApp({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  if (!appCheckToken) {
    return res.status(401).send('Unauthorized: No App Check token');
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    console.error('App Check failed:', err);
    return res.status(401).send('Unauthorized: Invalid App Check token');
  }
};

// Apply to all routes
app.use(appCheckVerification);

const router = express.Router();

router.get("/", statsCard);
router.get("/pin", repoCard);
router.get("/top-langs", langCard);
router.get("/wakatime", wakatimeCard);
router.get("/gist", gistCard);

app.use("/api", router);

const port = process.env.PORT || process.env.port || 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
