# Team MetaZombies

1. Drashti Mehta - 889212452 - dumehta@csu.fullerton.edu

2. Jainish Shah - 885154104 - jainishshah0124@csu.fullerton.edu

3. Hiral Pokiya - 818055535 - hiral14@csu.fullerton.edu

4. Sai Preethi Mekala - 881461081 - saipreethi@csu.fullerton.edu

# Repo Link

https://github.com/jainishshah0124/Crytozombie

# Video Demo

https://www.youtube.com/watch?v=3TkMWQ_AEqU

# Improvments

1. Built a nicer website for the DApp.

2. Added dynamic zombie images extracting according to the DNA from RoboHash.

3. User can develop multiple zombies. 

4. Added the attack zombies functionality, Basically in this app we can attack another account's zombie.

5. Updated the starter code and made it dynamic so data comes from key.json and .env.

6. Deployed the DApp to Sepolia.
   
7. Apart from starter pack below are the additional functionalities :
    - Bulk Zombie Leve-Up
    - Create Bulk Zombie
    - Transfer Bulk Zombie
    - Change Name
    - Change DNA
    - Delete Bulk Zombie
    - List the zombie on MarketPlace (NFT Token Transfer):
        - If user clicks buy, Whatever ether posted is debited from buyer
        - Ownership transfer from seller to buyer
    - Zombie Vs Zombie (Fight):
        - Select Opponent zombie for fight
        - If Zombie Won:
            - NoName Zombie is created
            - Current Zombie is leveled Up
        - If Zombie Lost:
            - Buffer Time 
        - Buffer time of fight initiator is updated
        - Statistics gets updated
        - Buffer time comes on screen as stopwatch and once exhuasted then only a zombie can fight


# To run this application

1. Install the dependencies using `npm install`
    - If specific version needed use nvm and start using that version with nvm use.

2. Install Ganache and update the `truffle-config.js` file with the its network configuration.

3. Compile all the contracts using `truffle compile`.
    - for ganache use `truffle compile --network development`
    - for sepolia use `truffle compile --network sepolia`

4. Migrate all the contracts using `truffle migrate`.
    - for ganache use `truffle migrate --network development`
    - for sepolia use `truffle migrate --network sepolia`

5. Create a key.json file. Put the contract address from ZombieOwnership there. Here's the format.
   `{
    "Ganacheaddress" : "Your ZombieOwnership contract address from ganache"
   }`

6. Create a .env file. Put infura API and private key as
    INFURA_API_KEY=<Infura_KEY>
    PRIVATE_KEY=<API>

7. Install Metamask and connect to the Ganache network using the following details:
    - Network Name: Ganache
    - New RPC URL: http://localhost:7545
    - Chain ID: 1337 (if your network id is different, change it to 1337)
    - Symbol: ETH

8. Copy the private key of any account from Ganache (copy a key from any account) and add a new account (import account) in Metamask using the private key.

9. In index.html use `var cryptoZombiesAddress = secrets.Ganacheaddress;` for ganache at line 151

10. install http server with `npm i http-server`

11. Run `http-server`



# Instructions to deploy on Sepolia

1. Create an account on [Infura](https://www.infura.io/).
2. Configure the API to Sepolia, and copy the API-key.

    `npm i @truffle/hdwallet-provider`

3. Deploy using command `truffle migrate --network sepolia`

4. Update key.json with your passphrase from metamask, apikey from Infura, and contract address after deploying
    `{
        "OwnershipAddress" : "Your ZombieOwnership contract address from sepolia"
    }`

5. In index.html use `var cryptoZombiesAddress = secrets.OwnershipAddress;` for sepolia at line 151

6. Run `http-server`

# Additional Instructions

1. Use `truffle migrate --reset` to redeploy on Ganache, and use `truffle migrate --reset --network sepolia` to redeploy on Sepolia.
