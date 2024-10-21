var safemath = artifacts.require("./safemath.sol");
var zombiefactory = artifacts.require("./zombiefactory.sol");
var zombiefeeding = artifacts.require("./zombiefeeding.sol");
var zombiehelper = artifacts.require("./zombiehelper.sol");
var zombieattack = artifacts.require("./zombieattack.sol");
var zombieownership = artifacts.require("./zombieownership.sol");

module.exports = async function(deployer) {

    await deployer.deploy(safemath);
    await deployer.deploy(zombiefactory);
    await deployer.deploy(zombiefeeding);
    await deployer.deploy(zombiehelper);
    await deployer.deploy(zombieattack);
    await deployer.deploy(zombieownership);
}