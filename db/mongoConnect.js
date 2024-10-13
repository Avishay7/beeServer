const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    // Your connection strings 
    `mongodb+srv://shlomosh1999:Vb0jDgPa0Od9GDFh@cluster0.xwr1u.mongodb.net/beeLingoual`
  );
  console.log("mongo connect frome start_node");
}
