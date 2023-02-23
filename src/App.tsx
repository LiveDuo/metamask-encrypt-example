import "./styles.css";
import { useMetamask } from "use-metamask";
import { providers } from "ethers";
import * as sigUtil from "@metamask/eth-sig-util";
import * as ethUtil from "ethereumjs-util";

import { Form, FormInput, FormResult, FormSubmit } from "./Form";
import { useState } from "react";

const requestPublicKey = (web3: providers.Web3Provider, account: string) => {
  return web3.send("eth_getEncryptionPublicKey", [account]);
};

const encrypt = (publicKey: string, text: string) => {
  const result = sigUtil.encrypt({
    publicKey,
    data: text,
    // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
    version: "x25519-xsalsa20-poly1305"
  });

  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
  return ethUtil.bufferToHex(Buffer.from(JSON.stringify(result), "utf8"));
};

const decrypt = async (
  web3: providers.Web3Provider,
  account: string,
  text: string
) => {
  const result = await web3.send("eth_decrypt", [text, account]);
  return result;
};

export default function App() {
  const { connect, metaState } = useMetamask();
  const [publicKey, setPublicKey] = useState("");

  const web3 = metaState.web3 as providers.Web3Provider;
  const account = metaState.account[0];

  return (
    <div className="App">
      <h2>Encryption/Decryption with Metamask</h2>
      <p style={{ fontSize: 11, fontStyle: "italic" }}>
        Metamask is only used to "access" the private key, nothing happens
        on-chain.
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
              <button
                onClick={() => {
                  requestPublicKey(web3, account).then(setPublicKey);
                }}
              >
                Get public key
              </button>
            </p>
            <p> or </p>
            <Form onSubmit={setPublicKey}>
              <FormInput placeholder="encryption public key" />
              <FormSubmit>Set public key</FormSubmit>
            </Form>
            <p>{publicKey}</p>
          </div>
          <br />
          <hr />
          <br />
          <p>The key is used to encrypt any message.</p>

          <Form onSubmit={(msg) => encrypt(publicKey, msg)}>
            <FormInput placeholder="message" />
            <FormSubmit disabled={!publicKey}>Encrypt</FormSubmit>
            <FormResult />
          </Form>
          <br />
          <hr />
          <br />
          <p>Metamask is used to decrypt an encrypted message</p>
          <Form onSubmit={(msg) => decrypt(web3, account, msg)}>
            <FormInput placeholder="encrypted message" />
            <FormSubmit>Decrypt</FormSubmit>
            <FormResult />
          </Form>
        </>
      )}
    </div>
  );
}
