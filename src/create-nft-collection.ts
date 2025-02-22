import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {Connection, Keypair} from '@solana/web3.js'
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults'
import { 
    createGenericFile,
    generateSigner,
    keypairIdentity,
    percentAmount
} from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { promises as fs } from 'fs'
import * as bs from 'bs58'


export interface ICreateNFTCollectionParams {
    connection: Connection
    keypair: Keypair,
    name: string,
    symbol: string,
    imagePath: string,
    contentType?: string,
    description?: string
}

export async function createNftCollection(params: ICreateNFTCollectionParams) {
    
    // TODO: create basic umi set up
    const umi = createUmi(params.connection);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(params.keypair.secretKey);

    umi
    .use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(irysUploader())

    console.log(`UMI identity keypair: ${umi.identity.publicKey}`)



    // TODO: upload the image file and get image url
    const fileExtension = params.imagePath.split('.').pop();
    const imageBuffer = await fs.readFile(params.imagePath)
    const file = createGenericFile(
        new Uint8Array(imageBuffer), 
        params.name + '.' + fileExtension, 
        {
            contentType: params.contentType || 'image/png'
        }
    );

    const [image] = await umi.uploader.upload([file])



    // TODO: upload meta-data json file and get it's url
    const uri = await umi.uploader.uploadJson({
        name: params.name,
        symbol: params.symbol,
        image: image,
        description: params.description || `${params.name} NFT Collection`,
        sellerFeeBasisPoints: 0,
    })


    // TODO: generate a mint account address
    const mint = generateSigner(umi)
    console.log(`Collection Mint Address: ${mint.publicKey}`)

    // TODO: now create NFT 
    const {signature, result} = await createNft(umi, {
        mint,
        uri,
        name: params.name,
        symbol: params.symbol,
        updateAuthority: umi.identity.publicKey,
        sellerFeeBasisPoints: percentAmount(0),
        isCollection: true,
        isMutable: true
    }).sendAndConfirm(umi);

    console.log(`Transaction: ${bs.default.encode(signature)}`)
    console.log(result)
}