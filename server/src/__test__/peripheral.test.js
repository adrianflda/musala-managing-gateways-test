const { gql } = require("apollo-server");
const {
  testClient,
  connectToDb,
  dropTestDb,
  closeDbConnection,
  gen,
} = require("./setup");

const { query, mutate } = testClient;
const uid = gen(10000);
const date_created = new Date();
const date_result = date_created.getTime();

beforeAll(async () => {
  await connectToDb();
  await dropTestDb();
});

afterAll(async () => {
  await dropTestDb();
  await closeDbConnection();
});

describe("Tests the peripheral mutations", () => {
  it("should successfully add a peripheral", async () => {
    const addPeripheral = gql`
      mutation addPeripheral(
        $uid: Int!
        $vendor: String!
        $date_created: Date!
        $status: String!
      ) {
        addPeripheral(
          uid: $uid
          vendor: $vendor
          date_created: $date_created
          status: $status
        ) {
          vendor
          date_created
          status
          uid
        }
      }
    `;

    const peripheral = {
      uid,
      vendor: "me",
      date_created,
      status: "online",
    };

    const { data } = await mutate({
      mutation: addPeripheral,
      variables: {
        ...peripheral,
      },
    });

    peripheral.date_created = date_result;
    expect(data.addPeripheral).toMatchObject(peripheral);
  });
});

describe("Tests the peripheral queries", () => {
  it("should return all peripherals", async () => {
    const getPeripherals = gql`
      query {
        getPeripherals {
          id
          uid
        }
      }
    `;

    const { data } = await query({
      query: getPeripherals,
    });

    expect(data.getPeripherals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid,
        }),
      ])
    );
  });
});
