"use server";

import { StreamClient } from "@stream-io/node-sdk"


const STREAM_API_KEY=process.env.NEXT_PUBLIC_STREAM_API_KEY
const STREAM_SECRET_KEY=process.env.STREAM_SECRET_KEY


export const tokenProvider=async(user)=>{
    // generate user Data (sensitive data) from clerk server side (useUser get user data from clerk Client side)
    
    
    if(!STREAM_API_KEY) throw new Error('stream Api key is not provided')
    if(!STREAM_SECRET_KEY) throw new Error('stream secret key is not provided')

    // connect stram backend core api
    const streamClient= new StreamClient(STREAM_API_KEY,STREAM_SECRET_KEY)

    const expirationTime = Math.floor(Date.now() / 1000) + 10800; // 3 hours
const issuedAt = Math.floor(Date.now() / 1000) - 60;

// generate Token
const token = streamClient.createToken(user.id, expirationTime, issuedAt);
return token
}