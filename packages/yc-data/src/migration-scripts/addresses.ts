import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const oldAddresses = await prisma.addresses.findMany();

const oldProtocols = await prisma.protocols.findMany();

const protocolAddressRelations = {
  1: [4, 5],
  2: [6, 3],
  3: [7],
  5: [9],
  6: [10, 11],
  7: [12, 13, 16],
  8: [14],
  10: [15],
  13: [17],
};

const newProtocols = await prisma.protocolsv2.findMany();

const newAddresses = oldAddresses.map((address) => {
  const oldProtocolId = (Object.entries(protocolAddressRelations).find(
    ([protocolid, addressids]) =>
      addressids.includes(address.address_identifier)
  ) || [])[0];

  const oldProtocol = oldProtocols.find(
    (protocol) => protocol.protocol_identifier == parseInt(oldProtocolId || "0")
  );

  const newProtocol = newProtocols.find(
    (protocol) => protocol.name === oldProtocol?.name
  );

  console.log(
    "new protocol",
    oldProtocols,
    "address id",
    address.address_identifier
  );

  return {
    address: address.contract_address || "0x",
    abi: address.abi || [{}],
    chain_id: address.chain_id || 0,
    protocol_id: newProtocol?.id || "",
  };
});

// console.log(newAddresses);

await prisma.addressesv2.createMany({
  data: newAddresses,
});
