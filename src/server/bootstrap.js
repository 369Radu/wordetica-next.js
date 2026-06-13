import { formatFirestoreStartupError, getFirebaseApp } from "./firebase.js";
import { hashPassword } from "./auth/djangoPassword.js";
import { createUser, findUserByEmail } from "./repositories/usersRepository.js";

const ADMIN_ACCOUNTS = [
  { email: "office@wordetica.eu", password: "elara", first_name: "Wordetica", last_name: "EU" },
  { email: "office@wordetica.ro", password: "zachrinodus", first_name: "Wordetica", last_name: "RO" },
];

async function seedAdmins() {
  getFirebaseApp();
  for (const account of ADMIN_ACCOUNTS) {
    const existing = await findUserByEmail(account.email);
    if (existing) {
      console.log(`[bootstrap] ${account.email} already exists`);
      continue;
    }
    await createUser({
      email: account.email,
      password: hashPassword(account.password),
      first_name: account.first_name,
      last_name: account.last_name,
      is_staff: true,
      is_superuser: true,
      is_active: true,
    });
    console.log(`[bootstrap] Created admin ${account.email}`);
  }
}

seedAdmins().catch((err) => {
  console.error("[bootstrap] Failed:\n" + formatFirestoreStartupError(err));
  process.exit(1);
});
