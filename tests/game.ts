import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Game } from "../target/types/game";
import { expect } from 'chai';
import { PublicKey } from '@solana/web3.js';

describe("game", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Game as Program<Game>;

  it("Sets and changes name!", async () => {
    // Add your test here.
    const [userStatsPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('user-stats'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId);
    await program.methods
      .createUserStats('brian')
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc()
    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      'brian'
    );
    await program.methods
      .changeUserName('tom')
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc()


    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      'tom'
    );
    /*const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);*/
  });
});
