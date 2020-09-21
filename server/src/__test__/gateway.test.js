const { gql } = require("apollo-server");
const {
  testClient,
  connectToDb,
  dropTestDb,
  closeDbConnection,
  gen,
  mockAddress,
  newGateway,
} = require("./setup");

const { query, mutate } = testClient;
let n = gen();
const peripheralsId = [...Array(15)].map(() => `${++n}`);

const addNewGateway = async (gateway = newGateway()) => {
  const ADD_GATEWAY = gql`
    mutation addGateway($serial: String!, $name: String!, $address: String!) {
      addGateway(serial: $serial, name: $name, address: $address) {
        serial
        name
        address
      }
    }
  `;

  let { data, errors } = await mutate({
    mutation: ADD_GATEWAY,
    variables: {
      ...gateway,
    },
  });

  errors && console.log(errors);

  return { gateway: data && data.addGateway, errors };
};

beforeAll(async () => {
  await connectToDb();
  await dropTestDb();
});

afterAll(async () => {
  await dropTestDb();
  const gateways = gql`
    query {
      getGateways {
        serial
      }
    }
  `;

  let { data } = await query({
    query: gateways,
  });

  console.log(JSON.stringify(data));

  await closeDbConnection();
});

describe("Tests the gateway mutations", () => {
  it("should successfully add a gateway", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    expect(gateway).toMatchObject(newG);
  });

  it("should not add two gateways with the same serial", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    let otherG = newGateway();
    otherG.serial = newG.serial;

    expect((await addNewGateway(otherG)).errors);
  });

  it("should successfully add one peripheral to a gateway", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    const addPeripheralToGateway = gql`
      mutation addPeripheralToGateway(
        $serial: String!
        $peripheralId: String!
      ) {
        addPeripheralToGateway(serial: $serial, peripheralId: $peripheralId) {
          serial
          peripherals
        }
      }
    `;

    let { data } = await mutate({
      mutation: addPeripheralToGateway,
      variables: {
        serial: gateway.serial,
        peripheralId: peripheralsId[gen()],
      },
    });

    expect(data.addPeripheralToGateway.peripherals.length).not.toBe(0);
  });

  it("should successfully update a gateway", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    const updateGateway = gql`
      mutation updateGateway($serial: String!, $peripherals: [String]!) {
        updateGateway(serial: $serial, peripherals: $peripherals) {
          serial
          peripherals
        }
      }
    `;

    let { data } = await mutate({
      mutation: updateGateway,
      variables: {
        serial: gateway.serial,
        peripherals: peripheralsId.slice(0, 9),
      },
    });

    expect(data.updateGateway.peripherals.length).toBe(9);
  });

  it("should not add more than 10 peripherals to a gateways", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    const updateGateway = gql`
      mutation updateGateway($serial: String!, $peripherals: [String]!) {
        updateGateway(serial: $serial, peripherals: $peripherals) {
          serial
          peripherals
        }
      }
    `;

    let { data } = await mutate({
      mutation: updateGateway,
      variables: {
        serial: gateway.serial,
        peripherals: peripheralsId.slice(0, 10),
      },
    });

    const addPeripheralToGateway = gql`
      mutation addPeripheralToGateway(
        $serial: String!
        $peripheralId: String!
      ) {
        addPeripheralToGateway(serial: $serial, peripheralId: $peripheralId) {
          serial
          peripherals
        }
      }
    `;

    let { errors } = await mutate({
      mutation: addPeripheralToGateway,
      variables: {
        serial: gateway.serial,
        peripheralId: peripheralsId[11],
      },
    });

    expect(errors);
  });

  it("should successfully add and remove peripherals", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    const addPeripheralToGateway = gql`
      mutation addPeripheralToGateway(
        $serial: String!
        $peripheralId: String!
      ) {
        addPeripheralToGateway(serial: $serial, peripheralId: $peripheralId) {
          serial
          peripherals
        }
      }
    `;

    let result = await mutate({
      mutation: addPeripheralToGateway,
      variables: {
        serial: gateway.serial,
        peripheralId: peripheralsId[0],
      },
    });

    expect(result.data.addPeripheralToGateway.peripherals.length).not.toBe(0);

    const removePeripheralFromGateway = gql`
      mutation removePeripheralFromGateway(
        $serial: String!
        $peripheralId: String!
      ) {
        removePeripheralFromGateway(
          serial: $serial
          peripheralId: $peripheralId
        ) {
          serial
          peripherals
        }
      }
    `;

    let { data } = await mutate({
      mutation: removePeripheralFromGateway,
      variables: {
        serial: gateway.serial,
        peripheralId: peripheralsId[0],
      },
    });

    const expected = [peripheralsId[0]];
    expect(data.removePeripheralFromGateway.peripherals).toEqual(
      expect.not.arrayContaining(expected)
    );
  });
});

describe("Tests the gateway queries", () => {
  it("should return all gateways", async () => {
    let newG = newGateway();
    let { gateway } = await addNewGateway(newG);

    const gateways = gql`
      query {
        getGateways {
          serial
        }
      }
    `;

    let { data } = await query({
      query: gateways,
    });

    expect(data.getGateways).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serial: gateway.serial,
        }),
      ])
    );
  });
});
