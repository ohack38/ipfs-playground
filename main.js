import {create as createIPFS} from 'ipfs-core'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from '@ceramicnetwork/key-did-resolver'
import { randomBytes } from '@stablelib/random'

const ipfs = await createIPFS()


// generate a seed, used as a secret for the DID
const seed = randomBytes(32)

// create did instance
const provider = new Ed25519Provider(seed)
const did = new DID({ provider, resolver: KeyResolver.getResolver() })
await did.authenticate()
window.did = did
console.log('Connected with DID:', did.id)

async function addEncryptedObject(cleartext, dids) {
    const jwe = await did.createDagJWE(cleartext, dids)
    return ipfs.dag.put(jwe, { storeCodec: 'dag-jose', hashAlg: 'sha2-256' })
}

await addEncryptedObject({ hello: 'secret' }, [did.id])

// testing lazygit
