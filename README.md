# Mint-token — Hardhat ERC20 Mintable Token

Purpose: Example Hardhat project that creates and deploys an ERC20 token with minting functionality (minting restricted to the owner). This README summarizes the project structure, installation, local usage, and deployment.

## Requirements

- Node.js >= 16
- npm or pnpm
- Hardhat
- (Optional) API key for Infura/Alchemy and PRIVATE_KEY for testnet/mainnet deployment

## Installation

1. Install dependencies:

```bash
npm install
```

2. If not already installed, add Hardhat toolbox and OpenZeppelin:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

## Project structure (representative)

```
├── 📁 .openzeppelin
│   └── ⚙️ sepolia.json
├── 📁 contracts
│   ├── 📄 Airdrop.sol
│   └── 📄 MyMintToken.sol
├── 📁 data
│   └── 📁 abi
│       ├── 📁 @openzeppelin
│       │   ├── 📁 contracts
│       │   │   ├── 📁 access
│       │   │   │   ├── 📁 AccessControl.sol
│       │   │   │   │   └── ⚙️ AccessControl.json
│       │   │   │   └── 📁 IAccessControl.sol
│       │   │   │       └── ⚙️ IAccessControl.json
│       │   │   ├── 📁 interfaces
│       │   │   │   ├── 📁 IERC1967.sol
│       │   │   │   │   └── ⚙️ IERC1967.json
│       │   │   │   ├── 📁 draft-IERC1822.sol
│       │   │   │   │   └── ⚙️ IERC1822Proxiable.json
│       │   │   │   └── 📁 draft-IERC6093.sol
│       │   │   │       ├── ⚙️ IERC1155Errors.json
│       │   │   │       ├── ⚙️ IERC20Errors.json
│       │   │   │       └── ⚙️ IERC721Errors.json
│       │   │   ├── 📁 proxy
│       │   │   │   ├── 📁 ERC1967
│       │   │   │   │   └── 📁 ERC1967Utils.sol
│       │   │   │   │       └── ⚙️ ERC1967Utils.json
│       │   │   │   └── 📁 beacon
│       │   │   │       └── 📁 IBeacon.sol
│       │   │   │           └── ⚙️ IBeacon.json
│       │   │   ├── 📁 token
│       │   │   │   └── 📁 ERC20
│       │   │   │       ├── 📁 ERC20.sol
│       │   │   │       │   └── ⚙️ ERC20.json
│       │   │   │       ├── 📁 IERC20.sol
│       │   │   │       │   └── ⚙️ IERC20.json
│       │   │   │       └── 📁 extensions
│       │   │   │           └── 📁 IERC20Metadata.sol
│       │   │   │               └── ⚙️ IERC20Metadata.json
│       │   │   └── 📁 utils
│       │   │       ├── 📁 Address.sol
│       │   │       │   └── ⚙️ Address.json
│       │   │       ├── 📁 Errors.sol
│       │   │       │   └── ⚙️ Errors.json
│       │   │       ├── 📁 cryptography
│       │   │       │   └── 📁 MerkleProof.sol
│       │   │       │       └── ⚙️ MerkleProof.json
│       │   │       └── 📁 introspection
│       │   │           ├── 📁 ERC165.sol
│       │   │           │   └── ⚙️ ERC165.json
│       │   │           └── 📁 IERC165.sol
│       │   │               └── ⚙️ IERC165.json
│       │   └── 📁 contracts-upgradeable
│       │       ├── 📁 access
│       │       │   └── 📁 AccessControlUpgradeable.sol
│       │       │       └── ⚙️ AccessControlUpgradeable.json
│       │       ├── 📁 proxy
│       │       │   └── 📁 utils
│       │       │       ├── 📁 Initializable.sol
│       │       │       │   └── ⚙️ Initializable.json
│       │       │       └── 📁 UUPSUpgradeable.sol
│       │       │           └── ⚙️ UUPSUpgradeable.json
│       │       └── 📁 utils
│       │           ├── 📁 ContextUpgradeable.sol
│       │           │   └── ⚙️ ContextUpgradeable.json
│       │           └── 📁 introspection
│       │               └── 📁 ERC165Upgradeable.sol
│       │                   └── ⚙️ ERC165Upgradeable.json
│       └── 📁 contracts
│           ├── 📁 Airdrop.sol
│           │   ├── ⚙️ IMintableToken.json
│           │   └── ⚙️ MerkleAirdropUpgradeable.json
│           └── 📁 MyMintToken.sol
│               └── ⚙️ MyMintToken.json
├── 📁 deploy
│   └── 📄 deploy-myminttoken.ts
├── 📁 deployments
│   ├── 📁 sepolia
│   │   ├── 📁 solcInputs
│   │   │   └── ⚙️ 51c9523c63347fcb2c1197bb857b36f8.json
│   │   ├── ⚙️ .chainId
│   │   └── ⚙️ MyMintToken.json
│   └── ⚙️ .gitignore
├── 📁 scripts
│   ├── 📁 merkle
│   │   ├── ⚙️ merkleProofs.json
│   │   ├── ⚙️ merkleRoot.json
│   │   └── ⚙️ whitelist.json
│   ├── 📄 generateMerkleData.ts
│   └── 📄 verify.ts
├── 📁 test
│   └── 📄 Counter.test.ts
├── ⚙️ .env_example
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ deployments-sepolia.json
├── 📄 hardhat.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ tsconfig.json
└── 📦 yarn.lock
```

## Local development / Usage

1. Compile:

```bash
npx hardhat compile
```

2. Run local node:

```bash
npx hardhat node
```

3. Deploy to local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. Run tests:

```bash
npx hardhat test
# or enable gas report:
REPORT_GAS=true npx hardhat test
```

## Deploy to testnet / mainnet

1. Add environment variables to `.env` (hardhat.config.ts should load dotenv):

```
RPC_URL=https://...
PRIVATE_KEY=0x...
```

2. Configure networks in `hardhat.config.ts`, then deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

(Replace `sepolia` with the desired network.)

## Minting tokens (example)

If the contract exposes `mint(address to, uint256 amount)` callable only by owner, you can mint via script or console:

```js
const tx = await myToken.connect(owner).mint(recipient, amount);
await tx.wait();
```

## Security & Notes

- Never commit PRIVATE_KEY or `.env` with secrets.
- Verify owner/roles before deploying to public networks.
- Consider gas limits and token decimals when minting large amounts.

## Extensions

- Make the contract upgradeable (UUPS) if upgrades are required.
- Use OpenZeppelin AccessControl for multi-role minting instead of single owner.

## License

MIT
