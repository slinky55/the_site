export default function MyAdapter(client, options = {}) {
    return {
      async createUser(user) {
        return
      },
      async getUser(id: string) {
        return
      },
      async getUserByEmail(email: string) {
        return
      },
      async getUserByAccount({ providerAccountId, provider }: {providerAccountId: string, provider: string}) {
        return
      },
      async updateUser(user) {
        return
      },
      async deleteUser(userId: string) {
        return
      },
      async linkAccount(account) {
        return
      },
      async unlinkAccount({ providerAccountId, provider }) {
        return
      },
      async createSession({ sessionToken, userId, expires }) {
        return
      },
      async getSessionAndUser(sessionToken) {
        return
      },
      async updateSession({ sessionToken }) {
        return
      },
      async deleteSession(sessionToken) {
        return
      },
      async createVerificationToken({ identifier, expires, token }) {
        return
      },
      async useVerificationToken({ identifier, token }) {
        return
      },
    }
  }