const express = require("express");
const {
  addCandidate,
  addPosition,
  createElection,
  vote,
  checkWinner,
  getAllElections,
  getAllPositionsInElection,
  getAllCandidatesInPosition,
} = require("../controller/election.controller");
const getAdmin = require("../middleware/getAdmin");
const getUser = require("../middleware/getUser");

const router = express.Router();

router.post("/addCandidate", getAdmin, addCandidate);
router.post("/addPosition", getAdmin, addPosition);
router.post("/createElection", getAdmin, createElection);
router.post("/vote", getUser, vote);
router.get("/checkWinner/:id", getUser, checkWinner);
router.get("/getAllElections", getAllElections);
router.get(
  "/getAllPositionsInElection/:id",
  getUser,
  getAllPositionsInElection
);
router.get(
  "/getAllCandidatesInPosition/:id",
  getUser,
  getAllCandidatesInPosition
);

module.exports = router;
