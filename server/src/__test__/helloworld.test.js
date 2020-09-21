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
      query sayHello {
        sayHello
      }
    `;

    const { data } = await query({
      query: helloWorld,
    });

    expect(data.sayHello).toBe("Hello World");
  });

  it("should return hi world", async () => {
    const sayHi = gql`
      query sayHi {
        sayHi
      }
    `;

    const { data } = await query({
      query: sayHi,
    });

    expect(data.sayHi).toBe("Hi world");
  });
});
