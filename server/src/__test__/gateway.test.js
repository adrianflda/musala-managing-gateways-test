const { gql } = require("apollo-server-express");
const {
  testClient,
  connectToDb,
  dropTestDb,
  closeDbConnection,
  gen,
  mockAddress,
} = require("./setup");

const { query, mutate } = testClient;
let n = gen();
const peripheralsId = [...Array(15)].map(() => `${++n}`);
const gateway1 = {
  serial: `${gen()}`,
  name: `gateway ${gen()}`,
  address: mockAddress(),
};

beforeAll(async () => {
  await connectToDb();
  await dropTestDb();
});

afterAll(async () => {
  await dropTestDb();
  await closeDbConnection();
});

describe("Tests the gateway mutations", () => {
  it("should successfully add a gateway", async () => {
    const addGateway1 = gql`
      mutation addGateway($serial: String!, $name: String!, $address: String!) {
        addGateway(serial: $serial, name: $name, address: $address) {
          serial
          name
          address
        }
      }
    `;

    const { data } = await mutate({
      mutation: addGateway1,
      variables: {
        ...gateway1,
      },
    });

    expect(data.addGateway).toMatchObject(gateway1);
  });

  it("should not add two gateways with the same serial", async () => {
    const addGateway2 = gql`
      mutation addGateway($serial: String!, $name: String!, $address: String!) {
        addGateway(serial: $serial, name: $name, address: $address) {
          serial
          name
          address
        }
      }
    `;

    const gateway = {
      serial: gateway1.serial,
      name: "gateway 1",
      address: mockAddress(),
    };

    const { errors } = mutate({
      mutation: addGateway2,
      variables: {
        ...gateway,
      },
    });

    expect(errors);
  });

  it("should successfully add one peripheral to a gateway", async () => {
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

    const params = {
      serial: gateway1.serial,
      peripheralId: peripheralsId[gen()],
    };

    const { data, errors } = await mutate({
      mutation: addPeripheralToGateway,
      variables: {
        ...params,
      },
    });

    expect(data.addPeripheralToGateway.peripherals.length).not.toBe(0);
  });

  it("should successfully update a gateway", async () => {
    const updateGateway = gql`
      mutation updateGateway($serial: String!, $peripherals: [String]!) {
        updateGateway(serial: $serial, peripherals: $peripherals) {
          serial
          peripherals
        }
      }
    `;

    const params = {
      serial: gateway1.serial,
      peripherals: peripheralsId.slice(0, 9),
    };

    const { data, errors } = await mutate({
      mutation: updateGateway,
      variables: {
        ...params,
      },
    });

    gateway1.peripherals = data.updateGateway.peripherals;
    expect(data.updateGateway.peripherals.length).toBe(9);
  });

  it("should not add more than 10 peripherals to a gateways", async () => {
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

    const params = {
      serial: gateway1.serial,
      peripheralId: peripheralsId[10],
    };

    const { errors } = await mutate({
      mutation: addPeripheralToGateway,
      variables: {
        ...params,
      },
    });

    expect(errors);
  });

  it("should successfully remove peripherals", async () => {
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

    const params = {
      serial: gateway1.serial,
      peripheralId: peripheralsId[0],
    };

    const { data, errors } = await mutate({
      mutation: removePeripheralFromGateway,
      variables: {
        ...params,
      },
    });

    const expected = [...peripheralsId];
    expect(data.removePeripheralFromGateway.peripherals).toEqual(
      expect.not.arrayContaining(expected)
    );
  });
});

describe("Tests the gateway queries", () => {
  it("should return all gateways", async () => {
    const gateways = gql`
      query {
        getGateways {
          serial
        }
      }
    `;

    const { data } = await query({
      query: gateways,
    });

    expect(data.getGateways).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serial: gateway1.serial,
        }),
      ])
    );
  });
});
