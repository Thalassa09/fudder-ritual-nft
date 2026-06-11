'use client';

import { useState } from 'react';
import { Wallet, ArrowRight, Search, Heart } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  image: string;
  price: string;
  owner: string;
}

const mockNFTs: NFT[] = [
  { id: 1, name: "Ritual Agent #001", image: "∞", price: "0.05", owner: "0x1234...5678" },
  { id: 2, name: "Ritual Agent #002", image: "∞", price: "0.08", owner: "0x8765...4321" },
  { id: 3, name: "Ritual Agent #003", image: "∞", price: "0.03", owner: "0x1111...2222" },
  { id: 4, name: "Ritual Agent #004", image: "∞", price: "0.12", owner: "0x3333...4444" },
];

export default function FudderRitualNFT() {
  const [address, setAddress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'explore' | 'mint' | 'owned'>('explore');
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xEFA' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xEFA',
              chainName: 'Ritual Testnet',
              nativeCurrency: { name: 'Ritual', symbol: 'RIT', decimals: 18 },
              rpcUrls: ['https://testnet.rpc.ritual.net'],
              blockExplorerUrls: ['https://explorer.ritual.net']
            }]
          });
        }
      }

      setStatus('Connected to Ritual Testnet');
    } catch (error) {
      alert('Failed to connect wallet');
    }
    setIsConnecting(false);
  };

  const mintNFT = async () => {
    if (!address) {
      alert('Connect wallet first');
      return;
    }

    setStatus('Minting...');
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Ganti dengan contract address Ritual yang asli
      const contractAddress = '0x0000000000000000000000000000000000000000';
      const abi = ['function mint() payable'];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.mint({ value: ethers.parseEther('0.01') });
      
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('Mint successful!');
    } catch (error: any) {
      setStatus('Mint failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1C1917]">
      {/* Navbar */}
      <nav className="border-b border-[#e8e0d5] bg-[#f5f0e8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div>
              <div className="font-semibold tracking-tight text-2xl">Fudder</div>
              <div className="text-[10px] text-[#8B5E3C] -mt-1">Ritual NFT</div>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            <div className="relative w-80">
              <Search className="absolute left-4 top-3 text-[#8B5E3C]" size={18} />
              <input 
                type="text" 
                placeholder="Search collections or NFTs" 
                className="w-full bg-white border border-[#e8e0d5] pl-11 py-2.5 rounded-2xl text-sm focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
            
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-x-2 px-5 py-2.5 text-sm font-medium border border-[#1C1917] rounded-2xl hover:bg-[#1C1917] hover:text-[#f5f0e8] transition-all disabled:opacity-50"
            >
              <Wallet size={17} />
              {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Connect'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8 flex gap-x-8 border-t border-[#e8e0d5]">
          {(['explore', 'mint', 'owned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-[#1C1917] text-[#1C1917]' 
                  : 'border-transparent text-[#8B5E3C] hover:text-[#1C1917]'
              }`}
            >
              {tab === 'owned' ? 'My NFTs' : tab}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-xs tracking-[3px] text-[#8B5E3C] mb-1">RITUAL TESTNET</div>
                <div className="text-5xl font-semibold tracking-[-2px]">Explore Collections</div>
              </div>
              <div className="text-sm text-[#8B5E3C]">4,892 NFTs • 128 Collections</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {mockNFTs.map((nft) => (
                <div key={nft.id} className="bg-white border border-[#e8e0d5] rounded-3xl overflow-hidden group">
                  <div className="bg-[#f8f3eb] h-56 flex items-center justify-center relative">
                    <div className="text-7xl text-[#8B5E3C] opacity-80">{nft.image}</div>
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Heart size={16} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="font-semibold tracking-tight mb-1">{nft.name}</div>
                    <div className="text-xs text-[#8B5E3C] mb-4">{nft.owner}</div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-[#8B5E3C]">Price</div>
                        <div className="font-mono font-medium">{nft.price} ETH</div>
                      </div>
                      <button className="px-5 py-2 text-sm bg-[#1C1917] text-[#f5f0e8] rounded-2xl hover:bg-[#8B5E3C] transition-all">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mint Tab */}
        {activeTab === 'mint' && (
          <div className="max-w-lg mx-auto pt-12">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[3px] text-[#8B5E3C] mb-2">RITUAL TESTNET</div>
              <div className="text-6xl font-semibold tracking-[-2.5px] mb-3">Mint Ritual NFT</div>
              <p className="text-[#5C5248]">Create your own Autonomous Agent on Ritual</p>
            </div>

            <div className="bg-white border border-[#e8e0d5] rounded-3xl p-9">
              <div className="bg-[#f8f3eb] border border-[#e8e0d5] rounded-2xl h-72 flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-8xl mb-4 text-[#8B5E3C]">∞</div>
                  <div className="font-medium">Ritual Agent</div>
                  <div className="text-sm text-[#8B5E3C] mt-1">Limited Edition</div>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-8">
                <div className="flex justify-between"><span className="text-[#5C5248]">Price</span><span className="font-medium">0.01 ETH</span></div>
                <div className="flex justify-between"><span className="text-[#5C5248]">Network</span><span className="font-medium">Ritual Testnet</span></div>
                <div className="flex justify-between"><span className="text-[#5C5248]">Supply</span><span className="font-medium">10,000 / 10,000</span></div>
              </div>

              <button 
                onClick={mintNFT}
                disabled={!address}
                className="w-full py-4 bg-[#1C1917] hover:bg-[#8B5E3C] text-[#f5f0e8] rounded-2xl font-semibold flex items-center justify-center gap-x-2 disabled:opacity-50 transition-all"
              >
                Mint NFT <ArrowRight size={19} />
              </button>
            </div>

            {status && <div className="text-center mt-6 text-sm text-[#8B5E3C]">{status}</div>}
          </div>
        )}

        {/* Owned Tab */}
        {activeTab === 'owned' && (
          <div className="pt-8">
            <div className="text-4xl font-semibold tracking-[-1.5px] mb-8">My NFTs</div>
            
            {!address ? (
              <div className="text-center py-20 text-[#8B5E3C]">
                Connect your wallet to view your NFTs
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {mockNFTs.slice(0, 2).map((nft) => (
                  <div key={nft.id} className="bg-white border border-[#e8e0d5] rounded-3xl p-5">
                    <div className="bg-[#f8f3eb] h-48 rounded-2xl flex items-center justify-center mb-5">
                      <div className="text-6xl text-[#8B5E3C]">{nft.image}</div>
                    </div>
                    <div className="font-medium">{nft.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
