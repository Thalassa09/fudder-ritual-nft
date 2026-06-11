'use client';

import { useState } from 'react';
import { Wallet, X, Zap } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  price: string;
  minted: boolean;
}

const initialNFTs: NFT[] = [
  { id: 1, name: "Ritual Fudder #01", price: "0", minted: true },
  { id: 2, name: "Ritual Fudder #02", price: "0", minted: true },
  { id: 3, name: "Ritual Fudder #03", price: "0", minted: true },
  { id: 4, name: "Ritual Fudder #04", price: "0", minted: true },
  { id: 5, name: "Ritual Fudder #05", price: "0", minted: true },
  { id: 6, name: "Ritual Fudder #06", price: "0", minted: true },
];

const OWNER_ADDRESS = "0x3883f0dDccC55Ac112173BC67584952Bf13B1A7D";
const CONTRACT_ADDRESS = "0xf5CBc369f8f253D6ADD6C17D15fc5483fa8708A3";

const ABI = [
  "function mint() payable",
  "function nextTokenId() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)"
];

export default function RitualFudder() {
  const [address, setAddress] = useState('');
  const [tab, setTab] = useState<'explore' | 'mint' | 'owned'>('explore');
  const [nfts] = useState(initialNFTs);
  const [status, setStatus] = useState('');
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const connect = async () => {
    if (!(window as any).ethereum) return alert('Install MetaMask');
    try {
      const { ethers } = await import('ethers');
      const p = new ethers.BrowserProvider((window as any).ethereum);
      await p.send('eth_requestAccounts', []);
      const s = await p.getSigner();
      setAddress(await s.getAddress());
    } catch {}
  };

  const openMint = (nft: NFT) => {
    if (nft.minted) return;
    setSelectedNFT(nft);
    setShowMintModal(true);
  };

  const mint = async () => {
    if (!address || !selectedNFT) return;
    
    try {
      setStatus('Minting on Ritual Network...');
      
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      const tx = await contract.mint({ value: 0 });
      await tx.wait();
      
      setStatus('Mint successful!');
      setShowMintModal(false);
      setTimeout(() => setStatus(''), 2500);
    } catch (error: any) {
      setStatus('Mint failed: ' + (error.reason || error.message));
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#F5F0E6]">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0B0B0A]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C5A26F] via-[#A67C52] to-[#8B6F47] flex items-center justify-center shadow-inner">
              <span className="text-[#0B0B0A] font-bold text-[22px] tracking-[-1.5px]">R</span>
            </div>
            <div>
              <div className="font-semibold text-[22px] tracking-[-1.4px]">Ritual Fudder</div>
            </div>
          </div>

          <button
            onClick={connect}
            className="flex items-center gap-x-2.5 px-7 h-11 rounded-2xl border border-white/15 hover:bg-white hover:text-[#0B0B0A] active:scale-[0.985] transition-all text-sm"
          >
            <Wallet size={17} />
            {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect Wallet'}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-8 flex gap-x-10 text-sm border-t border-white/10">
          {(['explore', 'mint', 'owned'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 capitalize tracking-[-0.4px] transition-all relative ${tab === t ? 'text-white font-medium' : 'text-white/45 hover:text-white/75'}`}
            >
              {t === 'owned' ? 'My Collection' : t}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-16">
        <div className="max-w-[620px]">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 text-xs tracking-[3.5px] mb-7 border border-white/10">RITUAL NETWORK • FREE MINT</div>
          <h1 className="text-[76px] leading-[0.98] font-semibold tracking-[-6.2px] mb-5">
            Genesis.<br />On-chain.<br />Forever.
          </h1>
          <p className="text-[17px] text-white/65 tracking-[-0.35px]">100 pieces. Only gas. No price.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {tab === 'explore' && (
          <div>
            <div className="flex justify-between items-end mb-9">
              <div>
                <div className="text-[11px] tracking-[4px] text-white/45 mb-1.5">COLLECTION 001</div>
                <div className="text-5xl tracking-[-2.2px] font-semibold">Genesis Series</div>
              </div>
              <div className="text-right text-sm text-white/55 font-mono">{nfts.length} / 100</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => openMint(nft)}
                  className={`group bg-[#121210] border border-white/10 rounded-3xl overflow-hidden transition-all ${!nft.minted ? 'cursor-pointer hover:border-[#C5A26F]/40 active:scale-[0.985]' : 'opacity-60'}`}
                >
                  <div className="aspect-[16/10] bg-[#1C1B18] relative flex items-center justify-center">
                    <div className="text-[92px] font-mono text-white/10 tracking-[-8px] font-semibold">#{String(nft.id).padStart(2, '0')}</div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
                  </div>
                  <div className="px-7 py-6 flex items-center justify-between border-t border-white/10 bg-[#121210]">
                    <div>
                      <div className="font-medium tracking-[-0.35px] text-[15px]">{nft.name}</div>
                      <div className="text-xs text-[#C5A26F]/80 mt-px">Free Mint • Ritual</div>
                    </div>
                    <div className="text-xs px-4 py-1.5 rounded-full border border-white/10 text-white/60">
                      {nft.minted ? 'Owned' : 'Mint'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'mint' && (
          <div className="max-w-md mx-auto pt-10 text-center">
            <div className="inline-block px-5 py-1.5 rounded-full bg-white/5 text-xs tracking-[2.5px] mb-6 border border-white/10">
              PHASE 1 — MINTING LIVE
            </div>
            
            <div className="text-6xl tracking-[-2.5px] font-semibold mb-4">Minting Open</div>
            <p className="text-white/60 text-lg mb-10">Free mint. Only gas. Collection will be revealed after 100 minted.</p>

            <div className="bg-[#121210] border border-white/10 rounded-3xl p-8 text-left">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/60">Total Supply</span>
                <span>100</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/60">Price</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Reveal Status</span>
                <span className="text-[#C5A26F]">Not Revealed</span>
              </div>
            </div>

            <button 
              onClick={() => setTab('explore')} 
              className="mt-8 px-10 h-14 rounded-2xl bg-white text-[#0B0B0A] font-medium tracking-[-0.4px] hover:bg-[#C5A26F] active:scale-[0.985] transition-all"
            >
              Browse Collection
            </button>
          </div>
        )}

        {tab === 'owned' && (
          <div className="pt-20 text-center text-white/50">Connect wallet to see your collection.</div>
        )}
      </div>

      {/* Mint Modal */}
      {showMintModal && selectedNFT && !selectedNFT.minted && (
        <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-6">
          <div className="bg-[#121210] border border-white/10 w-full max-w-[380px] rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-9">
                <div>
                  <div className="uppercase text-xs tracking-[3px] text-[#C5A26F]/70">Ritual Genesis</div>
                  <div className="text-3xl tracking-[-1px] mt-1.5">{selectedNFT.name}</div>
                </div>
                <button onClick={() => setShowMintModal(false)} className="text-white/60 hover:text-white mt-1"><X size={23} /></button>
              </div>

              <div className="space-y-px text-sm">
                <div className="flex justify-between py-[17px] border-b border-white/10"><span className="text-white/55">Price</span><span>Free</span></div>
                <div className="flex justify-between py-[17px] border-b border-white/10"><span className="text-white/55">Network</span><span>Ritual Network</span></div>
                <div className="flex justify-between py-[17px]"><span className="text-white/55">Gas Fee</span><span className="text-[#C5A26F]">Only gas</span></div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={mint}
                disabled={!address}
                className="flex items-center justify-center gap-x-3 w-full h-[58px] rounded-2xl bg-gradient-to-r from-white to-[#F5F0E6] text-[#0B0B0A] font-medium active:scale-[0.985] disabled:opacity-40 transition-all"
              >
                <Zap size={18} /> Mint Now
              </button>
              {!address && <div className="text-center text-xs mt-4 text-white/45">Connect wallet first</div>}
            </div>
          </div>
        </div>
      )}

      {status && (
        <div className="fixed bottom-9 left-1/2 -translate-x-1/2 bg-[#1C1B18] border border-white/10 px-8 h-12 rounded-2xl flex items-center text-sm tracking-[-0.2px]">
          {status}
        </div>
      )}
    </div>
  );
}
