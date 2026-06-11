'use client';

import { useState } from 'react';
import { Wallet, ArrowRight, Upload, X, Zap } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  price: string;
  image?: string;
}

const initialNFTs: NFT[] = [
  { id: 1, name: "Ritual Fudder #01", price: "0" },
  { id: 2, name: "Ritual Fudder #02", price: "0" },
  { id: 3, name: "Ritual Fudder #03", price: "0" },
  { id: 4, name: "Ritual Fudder #04", price: "0" },
  { id: 5, name: "Ritual Fudder #05", price: "0" },
  { id: 6, name: "Ritual Fudder #06", price: "0" },
];

const OWNER_ADDRESS = "0x3883f0dDccC55Ac112173BC67584952Bf13B1A7D";

export default function RitualFudder() {
  const [address, setAddress] = useState('');
  const [tab, setTab] = useState<'explore' | 'mint' | 'owned'>('explore');
  const [nfts, setNfts] = useState(initialNFTs);
  const [status, setStatus] = useState('');
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const isOwner = address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const connect = async () => {
    if (!(window as any).ethereum) return alert('Install MetaMask');
    try {
      const { ethers } = await import('ethers');
      const p = new ethers.BrowserProvider((window as any).ethereum);
      await p.send('eth_requestAccounts', []);
      const s = await p.getSigner();
      setAddress(await s.getAddress());
    } catch (e) {
      alert('Connection failed');
    }
  };

  const openMint = (nft: NFT) => {
    setSelectedNFT(nft);
    setShowMintModal(true);
  };

  const mint = async () => {
    if (!address || !selectedNFT) return;
    setStatus('Minting...');
    
    // Simulate mint transaction
    setTimeout(() => {
      setStatus('Mint successful');
      setShowMintModal(false);
      setTimeout(() => setStatus(''), 2000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F5F0E6] selection:bg-[#C5A26F] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0A0A09]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C5A26F] to-[#8B6F47] flex items-center justify-center">
              <span className="text-[#0A0A09] font-bold text-xl tracking-tighter">R</span>
            </div>
            <div>
              <div className="font-semibold text-[21px] tracking-[-1.2px]">Ritual Fudder</div>
              <div className="text-[10px] text-white/40 -mt-1">GENESIS COLLECTION</div>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <button
              onClick={connect}
              className="flex items-center gap-x-2 px-6 h-11 rounded-2xl border border-white/20 hover:bg-white hover:text-[#0A0A09] transition-all active:scale-[0.985]"
            >
              <Wallet size={16} />
              {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8 flex gap-x-9 text-sm border-t border-white/10">
          {(['explore', 'mint', 'owned'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 capitalize tracking-[-0.3px] transition-all relative ${tab === t ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              {t === 'owned' ? 'My Collection' : t}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-x-2 px-4 h-8 rounded-full bg-white/5 text-xs tracking-[2px] mb-6 border border-white/10">
            RITUAL TESTNET • 100 SUPPLY
          </div>
          <h1 className="text-[72px] leading-[1.05] font-semibold tracking-[-5.5px] mb-4">
            The Genesis.<br />On-chain.
          </h1>
          <p className="text-xl text-white/60 tracking-[-0.4px]">
            Limited edition Ritual Fudder. Free mint. Only gas.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {tab === 'explore' && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-sm tracking-[3px] text-white/50 mb-1">COLLECTION</div>
                <div className="text-4xl tracking-[-1.5px] font-semibold">Genesis Series</div>
              </div>
              <div className="text-right text-sm text-white/60">
                {nfts.length} / 100 minted
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  onClick={() => openMint(nft)}
                  className="group cursor-pointer bg-[#11110F] border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all active:scale-[0.985]"
                >
                  <div className="aspect-[4/3] bg-[#1A1917] relative flex items-center justify-center">
                    <div className="text-6xl font-mono text-white/10 tracking-[-4px]">#{String(nft.id).padStart(2, '0')}</div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium tracking-[-0.3px]">{nft.name}</div>
                        <div className="text-xs text-white/50 mt-1">Free Mint</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/40">GAS ONLY</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'mint' && (
          <div className="max-w-md mx-auto pt-12 text-center">
            <div className="text-6xl mb-8">🜁</div>
            <div className="text-4xl tracking-[-1.8px] font-semibold mb-3">Free Mint</div>
            <p className="text-white/60 mb-10">100 pieces. No price. Only gas.</p>
            
            <button
              onClick={() => setTab('explore')}
              className="px-10 h-14 rounded-2xl bg-white text-[#0A0A09] font-medium tracking-[-0.3px] hover:bg-[#C5A26F] active:scale-[0.985] transition-all"
            >
              Browse Collection
            </button>
          </div>
        )}

        {tab === 'owned' && (
          <div className="pt-12 text-center text-white/50">
            {address ? "You don't own any yet." : "Connect wallet to view your collection."}
          </div>
        )}
      </div>

      {/* Mint Modal */}
      {showMintModal && selectedNFT && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6">
          <div className="bg-[#11110F] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs tracking-[3px] text-white/50">RITUAL GENESIS</div>
                  <div className="text-3xl tracking-[-1px] mt-1">{selectedNFT.name}</div>
                </div>
                <button onClick={() => setShowMintModal(false)} className="text-white/60 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <div className="text-white/60">Price</div>
                  <div>Free</div>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <div className="text-white/60">Network</div>
                  <div>Ritual Testnet</div>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <div className="text-white/60">Gas Fee</div>
                  <div className="text-[#C5A26F]">~0.00001 RITUAL</div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-8">
              <button
                onClick={mint}
                disabled={!address}
                className="w-full h-14 rounded-2xl bg-white text-[#0A0A09] font-medium flex items-center justify-center gap-x-2 hover:bg-[#C5A26F] disabled:opacity-40 active:scale-[0.985] transition-all"
              >
                <Zap size={18} /> Mint on Ritual Testnet
              </button>
              {!address && <p className="text-center text-xs text-white/50 mt-4">Connect wallet first</p>}
            </div>
          </div>
        </div>
      )}

      {/* Status Toast */}
      {status && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 h-11 rounded-2xl bg-[#1F1E1B] border border-white/10 flex items-center text-sm tracking-[-0.2px]">
          {status}
        </div>
      )}
    </div>
  );
}
