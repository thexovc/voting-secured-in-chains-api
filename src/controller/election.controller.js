const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createElection(req, res) {
  try {
    const { name, startDate, endDate } = req.body;

    const newElection = await prisma.election.create({
      data: {
        name,
        startDate,
        endDate,
      },
    });

    res.json(newElection);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while starting the election.",
      message: error.message,
    });
  }
}

async function addPosition(req, res) {
  try {
    const { title, electionId } = req.body;
    // Check if the election with the given ID exists
    const existingElection = await prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });

    if (!existingElection) {
      return res
        .status(400)
        .json({ error: "Election with the provided ID does not exist." });
    }

    const newPosition = await prisma.position.create({
      data: {
        title,
        Election: {
          connect: { id: electionId },
        },
      },
    });
    res.json(newPosition);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the position." });
  }
}

async function addCandidate(req, res) {
  try {
    const { name, email, positionId } = req.body;
    // Check if the position with the given ID exists
    const existingPosition = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });

    if (!existingPosition) {
      return res
        .status(400)
        .json({ error: "Position with the provided ID does not exist." });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        email,
        position: {
          connect: { id: positionId },
        },
      },
    });
    res.json(newCandidate);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the candidate." });
  }
}

async function vote(req, res) {
  try {
    const { userId, positionId, electionId, candidateId } = req.body;

    // Check if the user has already voted for the given position in the election
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: { equals: userId },
        positionId: { equals: positionId },
        electionId: { equals: electionId },
      },
    });

    if (existingVote) {
      return res.status(400).json({
        error: "User has already voted for this position in this election.",
      });
    }

    const newVote = await prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        position: { connect: { id: positionId } },
        election: { connect: { id: electionId } },
        candidate: { connect: { id: candidateId } },
      },
    });

    res.json(newVote);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the vote." });
  }
}

async function checkWinner(req, res) {
  const { id: electionId } = req.params;

  try {
    const positions = await prisma.position.findMany({
      where: { electionId },
      include: {
        candidate: {
          include: {
            Vote: true,
          },
        },
      },
    });

    const formattedPositions = positions.map((position) => {
      const formattedCandidates = position.candidate.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        votes: candidate.Vote.length,
      }));

      return {
        position: position.title,
        candidates: formattedCandidates,
      };
    });

    res.status(200).json(formattedPositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
}

// Controller to get all elections
async function getAllElections(req, res) {
  try {
    const elections = await prisma.election.findMany();
    res.json(elections);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching elections." });
  }
}

// Controller to get all positions in an election
async function getAllPositionsInElection(req, res) {
  try {
    const { id: electionId } = req.params; // Assuming you pass the electionId as a route parameter
    const positions = await prisma.position.findMany({
      where: {
        electionId: electionId,
      },
      include: {
        candidate: true,
      },
    });
    res.json(positions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching positions." });
  }
}

// Controller to get all candidates in a position
async function getAllCandidatesInPosition(req, res) {
  try {
    const { id: positionId } = req.params; // Assuming you pass the positionId as a route parameter
    const candidates = await prisma.candidate.findMany({
      where: {
        positionId: positionId,
      },
    });
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching candidates." });
  }
}

module.exports = {
  addPosition,
  addCandidate,
  createElection,
  getAllElections,
  getAllPositionsInElection,
  getAllCandidatesInPosition,
  vote,
  checkWinner,
};
