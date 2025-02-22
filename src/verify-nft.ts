import { Connection, Keypair } from "@solana/web3.js";
import { keypairIdentity, PublicKey as UMIPublicKey } from '@metaplex-foundation/umi'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import * as bs from 'bs58'

export interface IVerifyNftParams {
    connection: Connection,
    keypair: Keypair,
    collection: UMIPublicKey,
    nft: UMIPublicKey,
}

export async function verifyNft(params: IVerifyNftParams) {
    // TODO: do basic set up for UMI
    const umi = createUmi(params.connection);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(params.keypair.secretKey);
    
    umi
    .use(mplTokenMetadata())
    .use(keypairIdentity(umiKeypair))


    // TODO: get metadata pda
    const metadata = findMetadataPda(umi, {
        mint: params.nft,
    })

    // TODO: send verification request
    const {signature, result} = await verifyCollectionV1(umi, {
        collectionMint: params.collection,
        metadata,
        authority: umi.identity
    }).sendAndConfirm(umi)

    console.log(`Transaction: ${bs.default.encode(signature)}`)
    console.log(`Result: ${result}`)
}