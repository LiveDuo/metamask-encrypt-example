import React, { useState, useContext } from 'react'

import { useMetamask } from 'use-metamask'
import { Input, Button } from '@chakra-ui/react'
import { providers } from 'ethers'

import * as sigUtil from '@metamask/eth-sig-util'
import * as ethUtil from 'ethereumjs-util'

const context = React.createContext('')

const FormResult = () => {
  const result = useContext(context)
  return <p>{result}</p>
}

const Form = ({ onSubmit, children }) => {
  const [result, setResult] = React.useState('')
  const submit = async (e) => {
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
const encrypt = (publicKey, text) => {
  const result = sigUtil.encrypt({ publicKey, data: text, version: 'x25519-xsalsa20-poly1305' })
  return ethUtil.bufferToHex(Buffer.from(JSON.stringify(result), 'utf8'))
}

const App = () => {
  const { connect, metaState } = useMetamask()
  const [publicKey, setPublicKey] = useState('')

  const web3 = metaState.web3
  const account = metaState.account[0]

  return (
    <div style={{fontFamily: 'sans-serif', textAlign: 'center'}}>
      <h2>Encryption/Decryption with Metamask</h2>
      {!metaState.isConnected || !web3 || !account ? (
        <Button onClick={() => connect(providers.Web3Provider)}>Connect</Button>
      ) : (
        <div>
          <p>Connected account: {account} </p>
          <hr />
          <div>
            <p>Get encryption public key from Metamask or input your own.</p>
            <p>
              <Button onClick={() => web3.send('eth_getEncryptionPublicKey', [account]).then(setPublicKey)}>
                Get public key
              </Button>
            </p>
            <p> or </p>
            <Form onSubmit={setPublicKey}>
              <Input placeholder="message" name="message" />
              <Button type="submit">encryption public key</Button>
            </Form>
            <p>{publicKey}</p>
          </div>
          <br />
          <hr />
          <br />
          <p>The key is used to encrypt any message.</p>
          <Form onSubmit={(msg) => encrypt(publicKey, msg)}>
            <Input placeholder="message" name="message" />
            <Button disabled={!publicKey} type="submit">Encrypt</Button>
            <FormResult />
          </Form>
          <br />
          <hr />
          <br />
          <p>Metamask is used to decrypt an encrypted message</p>
          <Form onSubmit={(msg) => web3.send('eth_decrypt', [msg, account])}>
            <Input placeholder="message" name="encrypted message" />
            <Button type="submit">Decrypt</Button>
            <FormResult />
          </Form>
        </div>
      )}
    </div>
  )
}
export default App
