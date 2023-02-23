import React, { useState, useContext } from 'react'

import { useMetamask } from 'use-metamask'
import { providers } from 'ethers'

import * as sigUtil from '@metamask/eth-sig-util'
import * as ethUtil from 'ethereumjs-util'

const context = React.createContext('')

const FormResult = () => {
  const result = useContext(context)
  return <p>{result}</p>
}

type FormProps = { onSubmit: (text: string) => Promise<string> | string | void }

const Form = ({ onSubmit, children }: React.PropsWithChildren<FormProps>) => {
  const [result, setResult] = React.useState('')
  const submit: React.FormEventHandler<any> = async (e) => {
    e.preventDefault()
    const res = await onSubmit(e.currentTarget.elements.message.value)
    if (res) setResult(res)
  }
  return (
    <context.Provider value={result}>
      <form onSubmit={submit}>{children}</form>
    </context.Provider>
  )
}

// https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
// https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
const encrypt = (publicKey: string, text: string) => {
  const result = sigUtil.encrypt({ publicKey, data: text, version: 'x25519-xsalsa20-poly1305' })
  return ethUtil.bufferToHex(Buffer.from(JSON.stringify(result), 'utf8'))
}

const decrypt = async (web3: providers.Web3Provider, account: string, text: string) => {
  const result = await web3.send('eth_decrypt', [text, account])
  return result
}

const App = () => {
  const { connect, metaState } = useMetamask()
  const [publicKey, setPublicKey] = useState('')

  const web3 = metaState.web3
  const account = metaState.account[0]

  return (
    <div style={{fontFamily: 'sans-serif', textAlign: 'center'}}>
      <h2>Encryption/Decryption with Metamask</h2>
      <p style={{ fontSize: 11, fontStyle: 'italic' }}>
        Metamask is only used to "access" the private key, nothing happens on-chain.
      </p>
      {!metaState.isConnected || !web3 || !account ? (
        <button onClick={() => connect(providers.Web3Provider)}>Connect</button>
      ) : (
        <>
          <p>Connected account: {account} </p>
          <hr />
          <div>
            <p>Get encryption public key from Metamask or input your own.</p>
            <p>
              <button onClick={() => web3.send('eth_getEncryptionPublicKey', [account]).then(setPublicKey)}>
                Get public key
              </button>
            </p>
            <p> or </p>
            <Form onSubmit={setPublicKey}>
              <input placeholder="message" name="message" />
              <button type="submit">encryption public key</button>
            </Form>
            <p>{publicKey}</p>
          </div>
          <br />
          <hr />
          <br />
          <p>The key is used to encrypt any message.</p>
          <Form onSubmit={(msg) => encrypt(publicKey, msg)}>
            <input placeholder="message" name="message" />
            <button disabled={!publicKey} type="submit">Encrypt</button>
            <FormResult />
          </Form>
          <br />
          <hr />
          <br />
          <p>Metamask is used to decrypt an encrypted message</p>
          <Form onSubmit={(msg) => decrypt(web3, account, msg)}>
            <input placeholder="message" name="encrypted message" />
            <button type="submit">Decrypt</button>
            <FormResult />
          </Form>
        </>
      )}
    </div>
  )
}
export default App
