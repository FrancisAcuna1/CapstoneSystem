// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json(); 

          console.log(data)
          if (response.status === 200 && data.token) {
            return {
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              username: data.username,
              accessToken: data.token, // Make sure your API returns 'access_token'
              role: data.user_type,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  
  pages: {
    signIn: "/",
  },
  session: {
    maxAge: 60 * 60,
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account }) {
      // const response = await fetch("http://127.0.0.1:8000/api/login")
      // console.log("data: ", response)
      try{
        const response = await fetch("http://127.0.0.1:8000/api/userdata",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }

        })
        const fetchedData = await response.json();
        console.log("fetchedData: ", fetchedData);

        if (response.ok){
          // throw new Error(`Failed to fetch user data: ${response.status}`);
          if(fetchedData.username === user.username && fetchedData.role === user.user_type){
            user.id = fetchedData.id.toString();
            user.firstname = fetchedData.firstname;
            user.middlename = fetchedData.middlename || null;
            user.lastname = fetchedData.lastname;
            user.username = fetchedData.username;
            user.role = fetchedData.user_type;
            // user.accessToken = fetchedData.token;
          }
          return true;
        }else{
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }
      }catch (error) {
        console.error("Error Checking user in database:", error);
        return false; // Indicate sign-in failure
      }
      // return true;
      
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.firstname = user.firstname;
        token.middlename = user.middlename || null;
        token.lastname = user.lastname;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;

      }
      return token;
    },

    async session({ session, token }) {
      // if (token) {
      //   // session.accessToken = token.accessToken;
      //   session.id = token.id.toString();
      //   session.firstname = token.firstname;
      //   session.middlename = token.middlename || null;
      //   session.lastname = token.lastname;
      //   session.username = token.username;
      //   session.role = token.role;
      //   session.accessToken = token.accessToken;
      // }
      if (token) {
        session.user = {
          id: token.id,
          firstname: token.firstname,
          lastname: token.lastname,
          username: token.username,
          role: token.role,
        };
        session.accessToken = token.accessToken;
      }
     
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
