pragma solidity ^0.4.25;


import "./ownable.sol";
import "./safemath.sol";

contract ZombieFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewZombie(uint zombieId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 15 minutes;

  struct Zombie {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  Zombie[] public zombies;

  mapping (uint => address) public zombieToOwner;
  mapping (address => uint) ownerZombieCount;

  function _createZombie(string _name, uint _dna) internal {
    uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now), 0, 0)) - 1;
    zombieToOwner[id] = msg.sender;
    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
    emit NewZombie(id, _name, _dna);
  }

  function _generateRandomDna(string _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createZombiesInBulk(bytes32[] memory _names, uint[] memory _dnas) public {
    require(_names.length == _dnas.length, "Names and DNA arrays must be of equal length");

    for (uint i = 0; i < _names.length; i++) {
        _createZombie(_bytes32ToString(_names[i]), _dnas[i]);
    }
  }

  function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
    uint8 i = 0;
    while (i < 32 && _bytes32[i] != 0) {
        i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
        bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }

  function createRandomZombie(string _name) public {
    require(ownerZombieCount[msg.sender] == 0);
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createZombie(_name, randDna);
  }

  function bulkDeleteZombies(uint[] memory zombieIds) public {
    for (uint i = 0; i < zombieIds.length; i++) {
        uint zombieId = zombieIds[i];
        require(zombieToOwner[zombieId] == msg.sender, "You do not own this zombie.");
        _deleteZombie(zombieId);
    }
  }

  function _deleteZombie(uint zombieId) internal {
      ownerZombieCount[zombieToOwner[zombieId]] = ownerZombieCount[zombieToOwner[zombieId]].sub(1);
      delete zombieToOwner[zombieId];
      zombies[zombieId].dna = 0;
  }


}
