const { gql } = require("apollo-server-express");
const {
  testClient,
  connectToDb,
  dropTestDb,
  closeDbConnection,
} = require("./setup");
const { query, mutate } = testClient;

beforeAll(async () => {
  await connectToDb();
  await dropTestDb();
});

afterAll(async () => {
  await dropTestDb();
  await closeDbConnection();
});

describe("Tests the hello world queries", () => {
  it("should return hello world", async () => {
    const helloWorld = gql`
      query helloWorld {
        helloWorld
      }
    `;

    const { data } = await query({
      query: helloWorld,
    });

    expect(data.helloWorld).toBe("Hello World!");
  });
});
