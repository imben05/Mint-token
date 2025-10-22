import { writeFileSync, readFileSync } from "fs";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";

// 🔧 Load whitelist từ file JSON
const raw = readFileSync("merkle/whitelist.json", "utf-8");
const whitelist = JSON.parse(raw) as { address: string; amount: string }[];

// 📦 Băm dữ liệu đầu vào thành các leaf node
const leafNodes = whitelist.map(({ address, amount }) => {
  const packed = ethers.solidityPacked(["address", "uint256"], [address.toLowerCase(), amount]);
  return keccak256(packed);
});

// 🌳 Tạo Merkle Tree
const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const root = tree.getHexRoot();

// 💾 Ghi merkle root ra file
writeFileSync("merkle/merkleRoot.json", JSON.stringify({ merkleRoot: root }, null, 2));

// 🔐 Tạo merkle proof cho từng địa chỉ
const proofs: Record<string, { amount: string; proof: string[] }> = {};

for (const { address, amount } of whitelist) {
  const packed = ethers.solidityPacked(["address", "uint256"], [address.toLowerCase(), amount]);
  const leaf = keccak256(packed);
  const proof = tree.getHexProof(leaf);

  proofs[address.toLowerCase()] = {
    amount,
    proof,
  };
}

// 💾 Ghi ra file
writeFileSync("merkle/merkleProofs.json", JSON.stringify(proofs, null, 2));

console.log("✅ Merkle root & proofs generated!");
