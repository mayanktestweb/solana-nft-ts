import {config} from 'dotenv'
import {createNftCollection} from "./create-nft-collection"
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js'
import { publicKey, PublicKey } from "@metaplex-foundation/umi"
import { createNFT } from './create-nft'
import {promises as fs} from 'fs'
import {join, dirname} from 'path'
import { verifyNft } from './verify-nft'

config()
if (!process.env.PRIVATE_KEY_ONE || !process.env.PRIVATE_KEY_TWO) {
    console.error('Missing Private Keys!')
    process.exit(1)
}

if (!process.env.ACTION) {
    console.error('Missing Action! Consider reading README.md')
    console.log("set ACTION env to `create_collection` or `create_nft` or `verify_nft`")
    process.exit(1)
}

const privateKeys = [process.env.PRIVATE_KEY_ONE, process.env.PRIVATE_KEY_TWO]
const [keypair, _keypair] = privateKeys.map(key => Keypair.fromSecretKey(new Uint8Array(JSON.parse(key))))
console.log(`Keypair: ${keypair.publicKey.toBase58()}`)


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

interface IData {
    collectionDetails: {
        name: string,
        symbol: string,
        imageFile: string,
        contentType?: string,
        description: string,
        address: string
    },

    nftDetails: {
        name: string,
        symbol: string,
        imageFile: string,
        contentType?: string,
        description: string,
        address: string
    }
}

async function readDataFile(): Promise<IData> {
    const filePath = join(__dirname, '../data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

async function main() {
    const data = await readDataFile(); 

    
    switch (process.env.ACTION) {
        case "create_collection":
            createNftCollection({
                connection,
                keypair,
                name: data.collectionDetails.name,
                symbol: data.collectionDetails.symbol,
                imagePath: join(__dirname, "../assets", data.collectionDetails.imageFile),
                description: data.collectionDetails.description,
                contentType: data.collectionDetails.contentType,
            });
            break;
        case "create_nft":
            createNFT({
                connection,
                keypair,
                collection: publicKey(data.collectionDetails.address),
                name: data.nftDetails.name,
                symbol: data.nftDetails.symbol,
                imagePath: join(__dirname, "../assets", data.nftDetails.imageFile),
                description: data.nftDetails.description,
                contentType: data.nftDetails.contentType,
            });
            break;
        case "verify_nft":
            verifyNft({
                connection,
                keypair,
                collection: publicKey(data.collectionDetails.address),
                nft: publicKey(data.nftDetails.address),
            })
            break;
        default:
            break;
    }
} 

main()