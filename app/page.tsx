'use client';

import { useState } from 'react';
import { Wallet, Zap, LogOut } from 'lucide-react';

const OWNER_ADDRESS = "0x3883f0dDccC55Ac112173BC67584952Bf13B1A7D";
const CONTRACT_ADDRESS = "0x644A6A11d0C2a68119dAdDc22164f40a6A325f84";
const RITUAL_CHAIN_ID = 1979;

const ABI = [
  "function mint()",
  "function nextTokenId() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)"
];

const phases = [
  { phase: 1, start: 1, end: 25, minted: 0, status: 'live', name: "The First Rite", unlockNote: "" },
  { phase: 2, start: 26, end: 50, minted: 0, status: 'locked', name: "The Forgotten Sigil", unlockNote: "Unlocks 24h after Phase 1 is fully minted" },
  { phase: 3, start: 51, end: 75, minted: 0, status: 'locked', name: "The Eternal Flame", unlockNote: "Unlocks 24h after Phase 2 is fully minted" },
  { phase: 4, start: 76, end: 100, minted: 0, status: 'locked', name: "The Final Offering", unlockNote: "Unlocks 24h after Phase 3 is fully minted" },
];

export default function RitualFudder() {
  // Add animation keyframes
  const style = `
    @keyframes moveLines {
      0% { background-position: 0 0; }
      100% { background-position: 600px 600px; }
    }
  `;
  const [address, setAddress] = useState('');
  const [tab, setTab] = useState<'explore' | 'mint' | 'owned'>('explore');
  const [status, setStatus] = useState('');
  const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);

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

  const disconnect = () => {
    setAddress('');
  };

  const mint = async () => {
    if (!address) return;

    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== RITUAL_CHAIN_ID) {
        setStatus('Please switch to Ritual Network (Chain ID 1979)');
        setTimeout(() => setStatus(''), 3000);
        return;
      }

      setStatus('Minting on Ritual Network...');
      
      const signer = await provider.getSigner();
      
      // Encode mint() function call
      const iface = new ethers.Interface(ABI);
      const data = iface.encodeFunctionData("mint");
      
      // Send transaction without specifying value
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: data
      });
      await tx.wait();
      
      setStatus('Mint successful!');
      setTimeout(() => setStatus(''), 2500);
    } catch (error: any) {
      setStatus('Mint failed: ' + (error.reason || error.message));
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F5F0E6] font-sans tracking-[-0.2px] relative">
      <style>{style}</style>
      {/* Animated Random Lines Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(142deg,#ffffff0a_0px,#ffffff0a_1px,transparent_1px,transparent_65px)] animate-[moveLines_12s_linear_infinite]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-95deg,#ffffff06_0px,#ffffff06_1px,transparent_1px,transparent_95px)] animate-[moveLines_19s_linear_infinite]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(48deg,#ffffff05_0px,#ffffff05_1px,transparent_1px,transparent_55px)] animate-[moveLines_9s_linear_infinite]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-160deg,#ffffff04_0px,#ffffff04_1px,transparent_1px,transparent_110px)] animate-[moveLines_27s_linear_infinite]" />
      </div>
      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0A0A09]/95 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-x-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
              <img src="/logo.png" alt="Ritual Fudder" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-sans font-semibold text-[22px] tracking-[6px] uppercase">Ritual Fudder NFT</div>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            {/* Disconnect Button */}
            {address && (
              <button
                onClick={disconnect}
                className="flex items-center gap-x-2 px-5 h-12 rounded-2xl border border-white/15 hover:bg-white/5 active:scale-[0.985] transition-all text-sm font-medium text-white/70 hover:text-white"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            )}

            <button
              onClick={connect}
              className="flex items-center gap-x-2.5 px-8 h-12 rounded-2xl border border-white/15 hover:bg-white hover:text-[#0A0A09] active:scale-[0.985] transition-all text-sm font-medium"
            >
              <Wallet size={18} />
              {address ? address.slice(0,6)+'...'+address.slice(-4) : 'Connect Wallet'}
            </button>

            {/* Ritual Chain Status */}
            <div className="flex items-center gap-x-2 px-4 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-[1px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RITUAL CHAIN
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8 flex gap-x-2 text-sm border-t border-white/10 bg-[#0A0A09]">
          {(['explore','mint','owned'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-[18px] capitalize tracking-[-0.4px] transition-all font-medium rounded-t-xl ${tab === t ? 'text-white bg-[#11110F] border-x border-t border-white/10' : 'text-white/50 hover:text-white/90'}`}
            >
              {t === 'owned' ? 'My Collection' : t}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-20">
        <div className="max-w-[720px]">
          <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-xs tracking-[3.5px] mb-8 border border-white/10">
            RITUAL NETWORK • FREE MINT
          </div>
          <h1 className="text-[88px] leading-[0.9] font-semibold tracking-[-7px] mb-7">
            Four Rites.<br />One Chain.
          </h1>
          <p className="text-2xl text-white/70 tracking-[-0.6px]">Each phase reveals after 25 NFTs minted.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {tab === 'explore' && (
          <div>
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="text-5xl tracking-[-2px] font-semibold">The Ritual Collection</div>
              </div>
              <div className="text-sm text-white/60 font-mono">0 / 100</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phases.map((p, index) => (
                <div key={index} className="bg-[#11110F] border border-white/10 rounded-3xl p-9">
                  
                  <div className="text-4xl tracking-[-1.5px] font-semibold mb-1">#{p.start} — #{p.end}</div>
                  <div className="text-2xl text-[#C5A26F] font-medium mb-2">{p.name}</div>
                  
                  {p.status === "locked" && (
                    <div className="text-xs text-white/40 mb-4 italic">{p.unlockNote}</div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Minted</span>
                    <span className="font-mono">{p.minted} / 25</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'mint' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-xs tracking-[3.5px] mb-8 border border-white/10">
                4 PHASES • 25 NFT EACH
              </div>
              <div className="text-8xl tracking-[-4px] font-semibold mb-6">Minting Phases</div>
              <p className="text-2xl text-white/60 tracking-[-0.5px]">Each phase reveals only after 25 NFTs are minted.</p>
            </div>

            <div className="space-y-6">
              {phases.map((p, index) => {
                const isRevealed = p.minted === 25;
                return (
                  <div key={index} className={`flex flex-col md:flex-row items-center justify-between gap-8 bg-[#11110F] border rounded-3xl px-10 py-9 transition-all ${p.status === 'live' ? 'border-[#C5A26F]/50' : 'border-white/10'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-x-4 mb-4">
                        <div className="text-xs tracking-[4px] text-white/50">PHASE {p.phase}</div>
                        <div className={`text-xs px-4 py-1 rounded-full border ${p.status === 'live' ? 'border-[#C5A26F] text-[#C5A26F]' : 'border-white/20 text-white/50'}`}>
                          {p.status === 'live' ? 'LIVE' : 'UPCOMING'}
                        </div>
                      </div>
                      <div className="text-6xl tracking-[-2.5px] font-semibold mb-1">#{p.start} — #{p.end}</div>
                      <div className="text-2xl tracking-[-1px] text-[#C5A26F] font-medium">{p.name}</div>
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Minted</span>
                          <span className="font-mono">{p.minted} / 25</span>
                        </div>
                        <div className="h-px bg-white/10 rounded-full overflow-hidden">
                          <div className="h-px bg-[#C5A26F] transition-all" style={{width: `${(p.minted/25)*100}%`}} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Reveal Status</span>
                        <span className={isRevealed ? 'text-[#C5A26F]' : 'text-white/50'}>
                          {isRevealed ? 'Revealed' : 'Not Revealed'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      {p.status === 'live' && (
                        <button 
                          onClick={mint}
                          disabled={!address}
                          className="w-full md:w-auto px-10 h-14 rounded-2xl bg-white text-[#0A0A09] font-medium flex items-center justify-center gap-x-3 hover:bg-[#C5A26F] active:scale-[0.985] disabled:opacity-40 transition-all"
                        >
                          <Zap size={18} /> Mint Phase {p.phase}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!address && <div className="text-center text-sm text-white/50 mt-9">Connect wallet to mint</div>}
          </div>
        )}

        {tab === 'owned' && (
          <div>
            {!address ? (
              <div className="pt-24 text-center text-white/50">Connect wallet to see your collection.</div>
            ) : ownedNFTs.length > 0 ? (
              <div className="pt-12">
                <div className="text-center mb-12">
                  <div className="text-6xl tracking-[-2px] font-semibold mb-3">Your Collection</div>
                  <p className="text-white/60">You own {ownedNFTs.length} NFT{ownedNFTs.length > 1 ? "s" : ""}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {ownedNFTs.map((tokenId, index) => (
                    <div key={index} className="bg-[#11110F] border border-white/10 rounded-3xl overflow-hidden">
                      <div className="aspect-square bg-[#1a1916] flex items-center justify-center">
                        <img 
                          src="/nfts/phase-1/#1" 
                          alt={`NFT #${tokenId}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-5">
                        <div className="font-mono text-sm text-white/50">#{tokenId}</div>
                        <div className="text-lg font-medium mt-1">The First Rite</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-12">
                <div className="text-center mb-12">
                  <div className="text-6xl tracking-[-2px] font-semibold mb-3">Your Collection</div>
                  <p className="text-white/60">NFTs you own will appear here</p>
                </div>
                <div className="text-center py-20 border border-white/10 rounded-3xl">
                  <div className="text-white/40">No NFTs found yet</div>
                  <div className="text-sm text-white/30 mt-2">Start minting from the Mint tab</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1C1B18] border border-white/10 px-9 h-12 rounded-2xl flex items-center text-sm tracking-[-0.3px]">
          {status}
        </div>
      )}
    </div>
  );
}
