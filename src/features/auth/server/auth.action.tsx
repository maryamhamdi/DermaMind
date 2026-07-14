'use server'
import { cookies } from "next/headers";
import { authIntialState } from "../store/auth.slice";
import axios from "axios";
import { AxiosRequestConfig } from "axios";


export  async function setToken(token:string , keepme:boolean):Promise<void> {
    const cookieStore= await cookies()
    if(keepme){
        cookieStore.set( 'token' , token , {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 
    })
    }else{
        cookieStore.set( 'token' , token , {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 
    })
    }   
}

export  async function getToken():Promise<string|null>{
    const cookieStore= await cookies()
    const token =cookieStore.get('token')?.value || null
    return token
}

export async function deleteToken():Promise<void>{
    const cookieStore= await cookies()
    cookieStore.delete('token')
}

export async function verifyToken(): Promise<authIntialState> {
  const token = await getToken();

  if (!token) {
    return {
      isAuthinticated: false,
      userInfo: null,
    };
  }

  try {
    const response = await axios.get(
      "https://dermamind-api-production-a383.up.railway.app/api/Profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PROFILE API =>", response.data);
    console.log("PROFILE IMAGE =>", response.data.profileImage);

    const imageUrl = response.data.profileImage
      ? response.data.profileImage.startsWith("http")
        ? response.data.profileImage
        : `https://dermamind-api-production-a383.up.railway.app${response.data.profileImage}`
      : null;

    console.log("FINAL IMAGE =>", imageUrl);

    return {
      isAuthinticated: true,
      userInfo: {
        id: response.data.id,
        name: response.data.fullName,
        email: response.data.email,
        profileImage: imageUrl ?? undefined,
      },
    };
  } catch (error) {
    console.log("VERIFY TOKEN ERROR =>", error);

    return {
      isAuthinticated: false,
      userInfo: null,
    };
  }
}