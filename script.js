// Utility functions for local storage
function saveJSON(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}
function loadJSON(key) {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : null;
}

// Smooth scroll for nav
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Generate DID using TweetNaCl + WebCrypto random seed
document.getElementById("genDidBtn").addEventListener("click", () => {
  const keyPair = nacl.sign.keyPair();
  const pub58 = bs58.encode(Buffer.from(keyPair.publicKey));
  const sec64 = btoa(String.fromCharCode(...keyPair.secretKey));

  const did = `did:demo:${pub58}`;

  // Save in localStorage (demo only)
  saveJSON("didInfo", { did, pub58, sec64 });

  document.getElementById("didResult").innerHTML = `
    <div class="bg-[#1a1a24] p-4 rounded-lg mt-4 inline-block text-left">
      <p><strong>Your DID:</strong> ${did}</p>
      <p class="text-gray-400 text-sm mt-1">Public Key (base58): ${pub58}</p>
      <p class="text-gray-500 text-xs mt-1">(Private key stored locally for demo)</p>
    </div>
  `;
});

// Upload file (mock IPFS using WebCrypto hashing)
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Please select a file first.");

  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fakeCid = hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, "0")).join("");

  document.getElementById("uploadResult").innerHTML = `
    <div class="bg-[#1a1a24] p-4 rounded-lg mt-4 inline-block">
      <p><strong>Mock CID:</strong> bafy${fakeCid}</p>
      <p><strong>File Size:</strong> ${file.size} bytes</p>
    </div>
  `;
});

// MetaMask connection using ethers.js
document.getElementById("connectMetaMaskBtn").addEventListener("click", async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install MetaMask!");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();

    document.getElementById("walletResult").innerHTML = `
      <div class="bg-[#1a1a24] p-4 rounded-lg mt-4 inline-block text-left">
        <p><strong>Connected Wallet:</strong> ${accounts[0]}</p>
        <p><strong>Network:</strong> ${network.name}</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    alert("MetaMask connection failed");
  }
});
