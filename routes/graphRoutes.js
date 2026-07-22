const express = require("express");
const router = express.Router();

const { getGraphClient } =  require("../services/graphService");

router.get("/test", async (req, res) => {
    try{
        const client = await getGraphClient();
        const result = await client.api("/organization").get();

        res.json({
            success: true,
            data: result,
        });
    } catch(err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = router;