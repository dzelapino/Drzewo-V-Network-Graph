const express = require("express");
const router = express.Router({ mergeParams: true });
const driver = require("../config/neo4jDriver");

const checkGender = (gender) => {
  if (gender.charAt(0).toUpperCase() == "M") {
    return "Male";
  }
  return "Female";
};

router.post("/createPerson", async (req, res) => {
  //& data urodzenia format: birthDate: date("2019-06-01"),
  const { name, surname, birthDate, gender, sure } = req.body;
  let formattedGender = "Female";
  if (gender) {
    formattedGender = checkGender(gender);
  }
  let foundPeople = [];
  try {
    const session = driver.session();
    const found = await session.run(
      `MATCH (p:Person) WHERE p.name = \'${name}\' AND p.surname = \'${surname}\' AND p.birthDate = date(\'${birthDate}\') AND p.gender = \'${formattedGender}\' RETURN p`
    );
    await session.close();
    foundPeople = found.records.map((x) => x._fields[0].identity.low);
  } catch (error) {
    foundPeople = [];
  }
  try {
    const session = driver.session();
    const result = await session.run(
      `CREATE (p:Person {name : \'${name}\', surname : \'${surname}\', birthDate : date(\'${birthDate}\'), gender: \'${formattedGender}\', sure : ${sure}}) RETURN p`
    );
    await session.close();
    const created_id = result.records[0]._fields[0].identity.low;
    res.status(201).json({
      message: {
        msgBody: `Created ${name} ${surname}`,
        msgPayload: created_id,
        msgFoundPeople: foundPeople,
        msgError: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while creating person: ${error}`,
        msgError: true,
      },
    });
  }
});

router.post("/test", async (req, res) => {
  //& data urodzenia format: birthDate: date("2019-06-01"),
  const { name } = req.body;
  try {
    const session = driver.session();
    const result = await session.run(
      `MERGE (p:Test {name : \'${name}\'}) RETURN p`
    );
    await session.close();
    const id_result = result.records[0]._fields[0].identity.low;
    res.status(201).json({
      message: { msgBody: id_result, msgError: false },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while creating person: ${error}`,
        msgError: true,
      },
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(`MATCH (p:Person) RETURN p LIMIT 20`);
    await session.close();
    const mapped_result = result.records.map((person) => person._fields[0]);
    res
      .status(200)
      .json({ message: { msgBody: mapped_result, msgError: false } });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while getting people: ${error}`,
        msgError: true,
      },
    });
  }
});

router.get("/properties", async (_req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(`MATCH (p:Person) RETURN p LIMIT 20`);
    await session.close();
    const mapped_result = result.records.map(
      (person) => person._fields[0].properties
    );
    res
      .status(200)
      .json({ message: { msgBody: mapped_result, msgError: false } });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while getting people: ${error}`,
        msgError: true,
      },
    });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const session = driver.session();
    const result = await session.run(
      `MATCH (p:Person) WHERE ID(p) = ${id} RETURN p`
    );
    await session.close();
    const mapped_result = result.records[0]._fields[0].properties;
    res
      .status(200)
      .json({ message: { msgBody: mapped_result, msgError: false } });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while getting people: ${error}`,
        msgError: true,
      },
    });
  }
});

router.get("/family/:id/:upTo", async (req, res) => {
  const id = req.params.id;
  const upTo = req.params.upTo;
  try {
    const session = driver.session();
    const resultEdges = await session.run(
      `MATCH p=(:Person)-[r1:Parent*0..${upTo}]-(me: Person) WHERE id(me) = ${id} RETURN r1`
    );
    const resultMembers = await session.run(
      `MATCH p=(member:Person)-[r1:Parent*0..${upTo}]-(me: Person) WHERE id(me) = ${id} RETURN member`
    );
    await session.close();
    const edgesInProgress = resultEdges.records.map(
      (person) => person._fields[0]
    );
    const edges = edgesInProgress
      .filter((arr) => arr.length > 0)
      .map((person) => [
        {
          source: `node${person[0].start.low}`,
          target: `node${person[0].end.low}`,
          label: "Child of",
        },
      ])
      .map((person) => person[0])
      .reduce((json, value, key) => {
        json[`edge${key + 1}`] = value;
        return json;
      }, {});
    const members = resultMembers.records
      .map((person) => [
        person._fields[0].properties,
        { id: person._fields[0].elementId },
      ])
      .map((person) => [{ ...person[0], ...person[1] }][0])
      .reduce((json, value) => {
        json[`node${value.id}`] = value;
        return json;
      }, {});
    res.status(200).json({
      message: { msgBody: { nodes: members, edges: edges }, msgError: false },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while getting family: ${error}`,
        msgError: true,
      },
    });
  }
});

router.post("/createRelative", async (req, res) => {
  const { type, myId, relatedId } = req.body;
  try {
    let parentId = myId;
    let childId = relatedId;
    if (type == "parent") {
      parentId = relatedId;
      childId = myId;
    }
    const session = driver.session();
    const parentGender = await session.run(
      `MATCH (n: Person) where id(n) = ${parentId} return n.gender`
    );
    let relationshipValue = "Mother";
    if (parentGender.records[0]._fields[0] == "Male") {
      relationshipValue = "Father";
    }
    const result = await session.run(`MATCH
    (p:Person), (c:Person) WHERE ID(p) = ${parentId} AND ID(c) = ${childId}
    CREATE (c)-[r:Parent {type: \'${relationshipValue}\'}]->(p) RETURN p, c
    `);
    await session.close();
    const persons = {
      person1: {
        name: result.records[0]._fields[0].properties.name,
        surname: result.records[0]._fields[0].properties.surname,
      },
      person2: {
        name: result.records[0]._fields[1].properties.name,
        surname: result.records[0]._fields[1].properties.surname,
      },
    };
    res.status(201).json({
      message: {
        msgBody: `Created relationship ${relationshipValue} between ${persons.person1.name} ${persons.person1.surname} and ${persons.person2.name} ${persons.person2.surname}`,
        msgError: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while creating relationship: ${error}`,
        msgError: true,
      },
    });
  }
});

router.put("/createParent", async (req, res) => {
  const { childId, parentId } = req.body;
  try {
    const session = driver.session();
    const parentGender = await session.run(
      `MATCH (n: Person) where id(n) = ${parentId} return n.gender`
    );
    let relationshipValue = "Mother";
    if (parentGender.records[0]._fields[0] == "Male") {
      relationshipValue = "Father";
    }
    const result = await session.run(`MATCH
    (p:Person), (c:Person) WHERE ID(p) = ${parentId} AND ID(c) = ${childId}
    CREATE (c)-[r:Parent {type: \'${relationshipValue}\'}]->(p) RETURN p, c
    `);
    await session.close();
    // res.send(result.records[0]._fields[0].properties)
    const persons = {
      person1: {
        name: result.records[0]._fields[0].properties.name,
        surname: result.records[0]._fields[0].properties.surname,
      },
      person2: {
        name: result.records[0]._fields[1].properties.name,
        surname: result.records[0]._fields[1].properties.surname,
      },
    };
    res.status(201).json({
      message: {
        msgBody: `Created relationship ${relationshipValue} between ${persons.person1.name} ${persons.person1.surname} and ${persons.person2.name} ${persons.person2.surname}`,
        msgError: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while creating Parent relationship: ${error}`,
        msgError: true,
      },
    });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, surname, sure } = req.body;
  try {
    const session = driver.session();
    await session.run(
      `MATCH (p:Person) WHERE ID(p) = ${id} SET p.name = \'${name}\', p.surname = \'${surname}\', p.sure = ${sure} RETURN p`
    ); // , p.birthDate : date(\'${birthDate}\')
    await session.close();
    res.status(200).json({
      message: {
        msgBody: `Person of id: ${id} has been updated`,
        msgError: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while updating person of id: ${id}.`,
        msgErrorContent: error,
        msgError: true,
      },
    });
  }
});

router.delete("/deleteRelative/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const session = driver.session();
    const result = await session.run(
      `MATCH (p:Person)-[r:Parent]-() WHERE ID(p) = ${id} RETURN COUNT(r)`
    );
    await session.close();
    const relationsFound = result.records[0]._fields[0].low;
    if (relationsFound < 2) {
      const session = driver.session();
      await session.run(
        `MATCH (p:Person)-[r:Parent]-() WHERE ID(p) = ${id} DELETE p,r`
      );
      await session.close();
      res.status(200).json({
        message: {
          msgBody: `Person of id: ${id} has been deleted`,
          msgError: false,
        },
      });
    } else {
      const session = driver.session();
      await session.run(
        `MATCH (p:Person) WHERE ID(p) = ${id} SET p.name = "Unknown", p.surname = "Unknown" RETURN p`
      );
      await session.close();
      res.status(200).json({
        message: {
          msgBody: `Person of id: ${id} has disappeared`,
          msgError: false,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while deleting person of id: ${id}.`,
        msgErrorContent: error,
        msgError: true,
      },
    });
  }
});

router.post("/treeCopy/:targetId/:ourId", async (req, res) => {
  const targetId = req.params.targetId;
  const ourId = req.params.ourId;
  try {
    const session = driver.session();
    await session.run(
      `
          MATCH (p1:Person) WHERE id(p1) = ${targetId}
          MATCH (p2:Person) WHERE id(p2) = ${ourId}
          MATCH path = (p1)-[:Parent*]-()
          WITH p1,p2, collect(path) as paths
          CALL apoc.refactor.cloneSubgraphFromPaths(paths, {
              standinNodes:[[p1, p2]]
          })
          YIELD input, output, error
          RETURN input, output, error
        `
    );
    await session.close();
    res.status(200).json({
      message: {
        msgBody: `Tree of id: ${targetId} has been copied`,
        msgError: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: `Error while copying tree of id: ${targetId}.`,
        msgErrorContent: error,
        msgError: true,
      },
    });
  }
});

module.exports = router;
