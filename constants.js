import * as dotenv from 'dotenv'
dotenv.config()

export const constants = {
    rpc: process.env.POLYGON_RPC,
    disperseContractAddress: process.env.DISPERSE_POLYGON_CONTRACT_ADDRESS,
    sponsorPrivateKey: process.env.SPONSOR_PRIVATE_KEY,
    xenContractAddress: process.env.XEN_CONTRACT_ADDRESS,
}