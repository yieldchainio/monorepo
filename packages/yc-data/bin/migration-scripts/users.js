import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
await client.usersv2.create({
    data: {
        address: "0xc6EAE321040E68C4152A19Abd584c376dc4d2159",
        username: "Ofir Smolpp",
        description: "ello sers",
        profile_picture: "",
        twitter: "https://twitter.com/ofiryieldchain",
        telegram: "@ofiryieldchain",
        discord: "OfirYieldchain#0000",
    },
});
//# sourceMappingURL=users.js.map