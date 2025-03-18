
import conf from '../conf/conf';

import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjID);
        this.account = new Account(this.client)
    }
    async createAccount ({email , password , name}){
        try {
            const userAccount = await this.account.create(ID.unique() , email  , password , name)
            if(userAccount){
                 //call another method 
                return this.login({email,password})
            }
            else{
                return userAccount;
            }
        } catch (error) {
            throw error;
        }

    }
    async login({email, password}){
        try {
           return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.error("AuthService :: login :: error", error);
            throw error;  // Ensure error is not silently ignored
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error" , error );
        }
        return null;
    }

    async  logout(){
        try {
            return await this.account.deleteSessions();  
        } catch (error) {
            console.error("There was some problem, please try again later:", error);
            throw error;  // Ensure error is not swallowed
        }
    }
    
}

const authService = new AuthService();

export default authService;