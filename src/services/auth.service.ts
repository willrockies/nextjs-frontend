import { cookies } from "next/headers";

export class AuthService {
    async login(input: { email: string, password: string }) {
        const response = await fetch(`${process.env.ORDERS_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: input.email,
                password: input.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 401) {
            return { error: "Credenciais Inválidas" };
        }

        if (!response.ok) {
            const error = await response.json();
            return { error };
        }

        const data = await response.json();

        const cookieStore = cookies();
        //cookie criptografado
        //lpesquisar sobre a lib iron session para implementar
        cookieStore.set("token", data.access_token);
    }

    logout() {
        const cookieStore = cookies();
        cookieStore.delete("token");
      }


      getUser() {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
    
        if (!token) {
          return null;
        }
    
        const payloadBase64 = token.split(".")[1];
        const payloadDecoded = atob(payloadBase64);
        return JSON.parse(payloadDecoded);
      }
    
      getToken() {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
    
        if (!token) {
          return null;
        }
    
        return token;
      }
    
      isTokenExpired() {
        const user = this.getUser();
    
        if (!user) {
          return true;
        }
    
        const now = new Date();
        const exp = new Date(user.exp * 1000);
    
        return now > exp;
      }

}