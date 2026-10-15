import { definePrismaConfig } from 'prisma/config'; // or '@prisma/config'
export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
