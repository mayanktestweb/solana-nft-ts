
# Solana NFT and Collection
#### *Typescript client based operations*

*Clone repository and install Dependencies first**
```
$npm install
```

*Build project*
```
$npx tsc
```
This will create `dist` dir in the project root directory
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PRIVATE_KEY_ONE`

`PRIVATE_KEY_TWO`

Just create a new .env file in project root directory and populate both fields. It's best for playing around two different signers but you can populate both with same private key. 

In addition to that you also need ACTION env variable which you should set on the fly to choose an action. Available ACTION env values are `create_collection`, `create_nft` and `verify_nft`. See `src/index.ts`. Use it like following with Linux based command line

```
$ACTION=create_collection node dist/index.js
```
On windows, use Git Bash.



#### **NOTE**
Udate `data.json` according to your need for collection and nft.
First create collection with above command and update `data.json` in root dir with your newly created collection address.



Then create nft `$ACTION=create_nft node dist/index.js` and update `address` of `nftDetails`

*data.json*
```
{
    
    "collectionDetails": {
        "name": "Fakkar_01",
        ....
        "address": "" <== collection address 
    },

    "nftDetails": {
        "collection": "", <== collection address
        "name": "Fakkar_Cozy",
        ...
        "address": "" <== nft address
    }
}
``` 

After that run verify
```
$ACTION=verify_nft node dist/index.js
```