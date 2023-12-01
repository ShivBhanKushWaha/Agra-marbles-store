import { User } from "@prisma/client"

export type SafeUser = Omit<User,
"createdAt" | "updatedAt" | "emailVerified"> & {
    createdAt: String;
    updatedAt: String
    emailVerified: String | null;
}