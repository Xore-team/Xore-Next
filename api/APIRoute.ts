import { Router } from "express";

let router = Router();

router.get("/", (req, res, next) => {
    res.json("hi")
});