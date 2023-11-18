import seed from "utils/seed.ts";

const date = new Date();

for (let i = 0; i <= 360; i++) {
  await seed(date);
  date.setDate(date.getDate() + 1);
}
