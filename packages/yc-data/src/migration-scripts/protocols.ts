import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const oldProtocols = await prisma.protocols.findMany();

const newProtocols = oldProtocols.map((protocol) => {
  return {
    name: protocol.name || "",
    logo: protocol.logo || "",
    available: !protocol.hidden || true,
    website: protocol.website || "",
    twitter: "https://twitter.com/" + protocol.name || "",
    telegram: "https://t.me/" + protocol.name || "",
    discord: "https://discord.gg/" + protocol.name || "",
    color: protocol.color || "",
    verified: protocol.is_verified || false,
    chain_ids: [],
    address_ids: [],
  };
});

await prisma.protocolsv2.createMany({
  data: newProtocols,
});
