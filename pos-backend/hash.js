import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
};

await hashPassword("admin123"); // username:admin
await hashPassword("123456");   // username:kasir1
